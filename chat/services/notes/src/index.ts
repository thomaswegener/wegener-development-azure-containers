import Fastify from "fastify";
import cors from "@fastify/cors";
import fs from "node:fs/promises";
import path from "node:path";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const vaultRoot = path.resolve(process.env.VAULT_PATH || "/vault");
const readonly = (process.env.NOTES_READONLY || "true").toLowerCase() === "true";
const port = Number(process.env.PORT || 8081);

function resolveVaultPath(relPath: string) {
  const target = path.resolve(vaultRoot, relPath);
  if (!target.startsWith(vaultRoot + path.sep)) {
    throw new Error("Invalid path");
  }
  return target;
}

async function walk(dir: string, base: string, out: any[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    const rel = path.relative(base, full);
    if (e.isDirectory()) {
      await walk(full, base, out);
    } else {
      const stat = await fs.stat(full);
      out.push({
        path: rel.replace(/\\/g, "/"),
        mtime: stat.mtime.toISOString(),
        size: stat.size,
      });
    }
  }
}

app.get("/vault", async (req) => {
  const recursive = (req.query as any)?.recursive === "true";
  const out: any[] = [];
  if (recursive) {
    await walk(vaultRoot, vaultRoot, out);
  } else {
    const entries = await fs.readdir(vaultRoot, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const full = path.join(vaultRoot, e.name);
      const stat = await fs.stat(full);
      out.push({
        path: e.name,
        mtime: stat.mtime.toISOString(),
        size: stat.size,
        isDir: e.isDirectory(),
      });
    }
  }
  return out;
});

app.get("/note/*", async (req, reply) => {
  const rel = (req.params as any)["*"] as string;
  const abs = resolveVaultPath(rel);
  const text = await fs.readFile(abs, "utf8");
  reply.type("text/markdown; charset=utf-8");
  return text;
});

app.put("/note/*", async (req, reply) => {
  if (readonly) {
    reply.code(403);
    return { error: "vault is read-only" };
  }
  const rel = (req.params as any)["*"] as string;
  const abs = resolveVaultPath(rel);
  const body = (req.body || "") as string;
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, body, "utf8");
  return { ok: true };
});

app.get("/search", async (req) => {
  const q = ((req.query as any)?.q || "").toString().toLowerCase();
  if (!q) return [];
  const files: any[] = [];
  await walk(vaultRoot, vaultRoot, files);
  const results: any[] = [];
  for (const f of files) {
    if (!f.path.endsWith(".md")) continue;
    const abs = resolveVaultPath(f.path);
    const text = (await fs.readFile(abs, "utf8")).toLowerCase();
    const idx = text.indexOf(q);
    if (idx !== -1) {
      results.push({
        path: f.path,
        snippet: text.slice(Math.max(0, idx - 80), idx + q.length + 80),
      });
    }
  }
  return results.slice(0, 50);
});

app.listen({ port, host: "0.0.0.0" });

