import Fastify from "fastify";
import cors from "@fastify/cors";
import { execaCommand } from "execa";
import crypto from "node:crypto";
import path from "node:path";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const port = Number(process.env.PORT || 8082);
const secret = process.env.JOB_SIGNING_SECRET || "dev-secret-change-me";
const basePath = (process.env.BASE_PATH || "").replace(/\/$/, "");
const allowlist = new Set(
  (process.env.SAFE_ALLOWLIST || "rg,cat,ls,codex")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);
const workdirRoot = path.resolve(process.env.WORKDIR_ROOT || "/workspace");
const coreUrl = process.env.CORE_API_URL || "http://api:8080";

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64url");
}

function hmac(secretKey: string, payloadJson: string): Buffer {
  return crypto.createHmac("sha256", secretKey).update(payloadJson).digest();
}

function verifyToken(token: string): Record<string, any> | null {
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;
  const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
  const expected = base64url(hmac(secret, payloadJson));
  try {
    const ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sigB64));
    if (!ok) return null;
  } catch {
    return null;
  }
  const payload = JSON.parse(payloadJson);
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

function resolveCwd(cwd: string): string {
  const resolved = path.resolve(workdirRoot, cwd || ".");
  if (resolved !== workdirRoot && !resolved.startsWith(workdirRoot + path.sep)) {
    throw new Error("Invalid cwd");
  }
  return resolved;
}

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

const runnerBases = basePath ? ["", basePath] : [""];

for (const base of runnerBases) {
  const p = (pathStr: string) => `${base}${pathStr}`;

  app.get(p("/health"), async () => ({ ok: true }));

  app.post(p("/run"), async (req, reply) => {
  const auth = (req.headers.authorization || "").toString();
  const headerToken =
    (req.headers["x-job-token"] as string) ||
    (req.headers["x-runner-token"] as string) ||
    "";
  const token =
    headerToken ||
    (auth.startsWith("Bearer ") ? auth.slice(7) : "");
  const payload = verifyToken(token);
  if (!payload || payload.tier !== "safe") {
    reply.code(401);
    return { error: "invalid token" };
  }

  const command = payload.command as string;
  const program = command.trim().split(/\s+/)[0];
  if (!allowlist.has(program)) {
    reply.code(403);
    return { error: `command not allowed: ${program}` };
  }

  const cwd = resolveCwd(payload.cwd || ".");

  sseHeaders(reply);
  sendEvent(reply, "start", { jobId: payload.jobId, command, cwd });

  let stdout = "";
  let stderr = "";

  const child = execaCommand(command, { cwd, stdout: "pipe", stderr: "pipe" });

  const onClose = async (exitCode: number | null) => {
    sendEvent(reply, "done", { exitCode });
    reply.raw.end();
    try {
      await fetch(`${coreUrl}/jobs/${payload.jobId}/callback`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-job-token": token,
        },
        body: JSON.stringify({
          status: "completed",
          exitCode,
          stdout,
          stderr,
        }),
      });
    } catch (e) {
      app.log.error({ err: e }, "callback failed");
    }
  };

  child.stdout?.on("data", (d: Buffer) => {
    const text = d.toString();
    stdout += text;
    sendEvent(reply, "stdout", { text });
  });
  child.stderr?.on("data", (d: Buffer) => {
    const text = d.toString();
    stderr += text;
    sendEvent(reply, "stderr", { text });
  });
  child.on("close", (code: number | null) => void onClose(code));

  req.raw.on("close", () => {
    child.kill("SIGTERM");
  });
  });
}

app.listen({ port, host: "0.0.0.0" });
