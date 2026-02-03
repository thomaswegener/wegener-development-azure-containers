import Fastify from "fastify";
import cors from "@fastify/cors";
import { ulid } from "ulid";
import { exec, query } from "./db.js";
import { retrieveRelevantChunks } from "./rag/retrieve.js";
import { rebuildObsidianIndex, indexChangedNotes } from "./rag/indexer.js";
import { signPayload, verifyToken } from "./tools/signing.js";
import { streamChatCompletion, type ChatMessage } from "./llm.js";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const port = Number(process.env.PORT || 8080);
const secret = process.env.JOB_SIGNING_SECRET || "dev-secret-change-me";
const basePath = (process.env.BASE_PATH || "").replace(/\/$/, "");

function sseHeaders(reply: any) {
  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
}

function sendEvent(reply: any, event: string, data: any) {
  reply.raw.write(`event: ${event}\n`);
  reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
}

const routeBases = basePath ? ["", basePath] : [""];

for (const base of routeBases) {
  const p = (path: string) => `${base}${path}`;

  app.get(p("/health"), async () => ({ ok: true }));

  app.post(p("/sessions"), async (req) => {
    const body = (req.body || {}) as { title?: string };
    const id = ulid();
    const title = body.title?.slice(0, 120) || "New chat";
  await exec(
    `INSERT INTO sessions (id, title) VALUES ($1, $2)`,
    [id, title]
  );
  const session = (await query(`SELECT * FROM sessions WHERE id=$1`, [id]))[0];
  return session;
  });

  app.get(p("/sessions"), async () => {
  return await query(
    `SELECT id, title, attached_collections, dangerous_mode, updated_at
     FROM sessions
     ORDER BY updated_at DESC`
  );
  });

  app.get(p("/sessions/:id"), async (req) => {
  const { id } = req.params as { id: string };
  const session = (await query(`SELECT * FROM sessions WHERE id=$1`, [id]))[0];
  const messages = await query(
    `SELECT id, role, content, created_at, retrieval_refs
     FROM messages WHERE session_id=$1 ORDER BY created_at ASC`,
    [id]
  );
  return { session, messages };
  });

  app.put(p("/sessions/:id/collections"), async (req) => {
  const { id } = req.params as { id: string };
  const body = (req.body || {}) as { attachedCollections?: string[] };
  const cols = body.attachedCollections?.filter(Boolean) ?? ["obsidian"];
  await exec(
    `UPDATE sessions SET attached_collections=$2, updated_at=now() WHERE id=$1`,
    [id, cols]
  );
  return (await query(`SELECT * FROM sessions WHERE id=$1`, [id]))[0];
  });

  app.post(p("/sessions/:id/messages"), async (req, reply) => {
  const { id: sessionId } = req.params as { id: string };
  const body = (req.body || {}) as { content?: string };
  const content = body.content?.trim();
  if (!content) {
    reply.code(400);
    return { error: "content required" };
  }

  sseHeaders(reply);

  const userMsgId = ulid();
  await exec(
    `INSERT INTO messages (id, session_id, role, content) VALUES ($1, $2, 'user', $3)`,
    [userMsgId, sessionId, content]
  );
  await exec(`UPDATE sessions SET updated_at=now() WHERE id=$1`, [sessionId]);

  const session = (await query<{ attached_collections: string[] }>(
    `SELECT attached_collections FROM sessions WHERE id=$1`,
    [sessionId]
  ))[0];
  const attachedCollections = session?.attached_collections ?? ["obsidian"];

  const retrieved = await retrieveRelevantChunks(content, attachedCollections);
  sendEvent(reply, "retrieval", { chunks: retrieved.map((r) => ({
    path: r.path,
    heading: r.heading,
    score: r.score,
    snippet: r.content.slice(0, 200),
  }))});

  const history = await query<{ role: string; content: string }>(
    `SELECT role, content FROM messages WHERE session_id=$1 ORDER BY created_at ASC LIMIT 20`,
    [sessionId]
  );

  const systemParts: string[] = [
    "You are a helpful AI assistant.",
    "Use the provided context if relevant.",
    "If you use context, cite sources as (path#heading).",
  ];
  if (retrieved.length) {
    systemParts.push("Context:");
    for (const r of retrieved) {
      systemParts.push(`- ${r.path}${r.heading ? `#${r.heading}` : ""}: ${r.content}`);
    }
  }

  const messages: ChatMessage[] = [
    { role: "system", content: systemParts.join("\n") },
    ...history.map((m) => ({ role: m.role as any, content: m.content })),
  ];

  let assistantText = "";
  try {
    for await (const token of streamChatCompletion(messages)) {
      assistantText += token;
      sendEvent(reply, "delta", { token });
    }
  } catch (err: any) {
    sendEvent(reply, "error", { message: err?.message || "LLM error" });
  }

  const assistantMsgId = ulid();
  await exec(
    `INSERT INTO messages (id, session_id, role, content, retrieval_refs)
     VALUES ($1, $2, 'assistant', $3, $4)`,
    [assistantMsgId, sessionId, assistantText, JSON.stringify(retrieved)]
  );
  await exec(`UPDATE sessions SET updated_at=now() WHERE id=$1`, [sessionId]);

  sendEvent(reply, "done", { messageId: assistantMsgId });
  reply.raw.end();
  });

  app.post(p("/index/rebuild"), async () => {
  return await rebuildObsidianIndex();
  });

  app.post(p("/index/changed"), async (req) => {
  const body = (req.body || {}) as { paths?: string[] };
  const paths = body.paths ?? [];
  return await indexChangedNotes(paths);
  });

  app.post(p("/jobs/safe"), async (req, reply) => {
  const body = (req.body || {}) as { sessionId?: string; command?: string; cwd?: string };
  const sessionId = body.sessionId;
  const command = body.command?.trim();
  if (!sessionId || !command) {
    reply.code(400);
    return { error: "sessionId and command required" };
  }

  const jobId = ulid();
  await exec(
    `INSERT INTO jobs (id, session_id, tier, cwd, command) VALUES ($1, $2, 'safe', $3, $4)`,
    [jobId, sessionId, body.cwd || null, command]
  );

  const payload = {
    jobId,
    sessionId,
    tier: "safe",
    command,
    cwd: body.cwd || "",
    exp: Date.now() + 5 * 60_000,
  };
  const token = signPayload(payload, secret);
  return { jobId, token };
  });

  app.post(p("/jobs/:id/callback"), async (req, reply) => {
  const { id: jobId } = req.params as { id: string };
  const token = (req.headers["x-job-token"] as string) || "";
  const payload = verifyToken(token, secret);
  if (!payload || payload.jobId !== jobId) {
    reply.code(401);
    return { error: "invalid token" };
  }

  const body = (req.body || {}) as { exitCode?: number; stdout?: string; stderr?: string; status?: string };
  await exec(
    `UPDATE jobs
     SET status=$2, exit_code=$3, stdout=$4, stderr=$5, updated_at=now()
     WHERE id=$1`,
    [
      jobId,
      body.status || "completed",
      body.exitCode ?? null,
      body.stdout ?? "",
      body.stderr ?? "",
    ]
  );
  return { ok: true };
  });
}

app.listen({ port, host: "0.0.0.0" });
