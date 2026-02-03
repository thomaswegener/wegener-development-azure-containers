# Chat Dev Webapp (MVP)

This repo is a Docker‑Compose monorepo for a self‑hosted chat webapp with:

- React/Vite/TypeScript UI.
- Core API with streaming chat, session history, and RAG retrieval.
- Obsidian/notes service that serves a vault over HTTP.
- Safe runner that executes local headless commands (including `codex exec`) using signed job tokens.

Dangerous/SSH runner is intentionally **not** included in MVP; the layout keeps that as a separate future service.

## Quick start

1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env`:
   - Set `OBSIDIAN_VAULT_PATH` to your vault folder on the host.
   - Set `JOB_SIGNING_SECRET` to a random string.
   - Optionally set `OPENAI_API_KEY` and `OPENAI_MODEL` for real chat + embeddings.
3. Start:
   ```bash
   docker compose up --build
   ```
4. Open:
   - Web UI: `http://localhost:5173`
   - Core API: `http://localhost:18080`
   - Notes API: `http://localhost:18081`
   - Safe runner: `http://localhost:18082`

## Traefik / production (chat.wegener.no)

This host uses Traefik file rules in `../traefik/dynamic/rules.yml`. This repo already adds:
- Router `chat-web` → `http://chat.wegener.no:5173`
- Router `chat-api` (PathPrefix `/api`) → `http://chat-api:8080`
- Router `chat-runner` (PathPrefix `/runner`) → `http://chat-safe-runner:8082`

Compose attaches `web`, `api`, `notes`, and `safe-runner` to the external `web` network and sets stable container names to match Traefik rules.

On the server:
1. Ensure the external Traefik network exists:
   ```bash
   docker network create web || true
   ```
2. From this folder:
   ```bash
   docker compose up --build -d
   ```
3. Visit `https://chat.wegener.no`.

Security note: never paste API keys into chat. Rotate any key you’ve already shared, then put the new key in `.env` as `OPENAI_API_KEY=...`.

## What works

### Sessions + streaming chat
- New chat creates a `sessionId` (ULID).
- Messages stream over SSE from `apps/api`.
- History is persisted in Postgres and reloads when you reopen a session.

### Obsidian vault API
Service: `services/notes`
- `GET /vault?recursive=true` lists files in the vault.
- `GET /note/:path` returns markdown.
- `GET /search?q=...` naive full‑text search.
- Vault is **read‑only by default** (`NOTES_READONLY=true`).

If your vault is not on this host, you can run a vault sync container and mount a shared volume instead. See `docker-compose.vault.yml`.

To sync from GitHub:
1. Set in `.env`:
   - `VAULT_GIT_REPO_URL=https://github.com/thomaswegener/Private-notes.git`
   - `VAULT_GIT_USERNAME=...`
   - `VAULT_GIT_TOKEN=...` (PAT with repo read)
2. Start with override:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.vault.yml up --build -d
   ```

### RAG over the vault
Service: `apps/api`
- `POST /index/rebuild` reads vault notes, chunks them, and stores embeddings.
- `POST /index/changed` reindexes specific paths.
- Each chat retrieves top chunks from attached collections (default `obsidian`).
- If `OPENAI_API_KEY` is unset, embeddings are skipped and retrieval falls back to keyword search.

### Safe command execution (`codex exec`)
Service: `services/safe-runner`
- UI button “Run safe command” creates a signed job via `POST /jobs/safe`.
- Safe runner verifies the token and allowlist, then runs the command and streams stdout/stderr.
- Workspace is mounted read‑only to keep the runner safe by default.

To use Codex CLI inside the runner, make sure the container can access a `codex` binary
(install it in the image, or mount it from host) and that it’s in the allowlist.

## Security notes

- Core API never holds SSH keys or Docker sockets.
- Safe runner only accepts short‑lived signed jobs (`JOB_SIGNING_SECRET`).
- Command allowlist is controlled by `SAFE_ALLOWLIST`.
- Safe runner has read‑only workspace mount in Compose.

## Layout

```
apps/
  api/            Core orchestrator + chat + RAG
  web/            React/Vite UI
services/
  notes/          Obsidian vault HTTP API
  safe-runner/    Signed safe command executor
infra/postgres/   pgvector extension + schema init
```

## Next milestones

1. **Dev workspace inside the UI**
   - File tree + Monaco editor.
   - Safe read/write endpoints (with path allowlist).
   - Preview iframe served from a sandboxed preview service.
2. **Dangerous runner + SSH gateway**
   - Separate deploy unit, time‑boxed dangerous sessions.
   - Per‑server runner agents or SSH job gateway.
3. **Docs/prompt library UI**
   - Uploads, collections, prompt versioning, citations UI.
