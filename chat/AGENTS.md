# Repository Guidelines

## Project Structure & Module Organization

This is a Docker‑Compose monorepo for a self‑hosted chat + RAG + safe‑exec stack.

- `apps/web/`: React + Vite + TypeScript SPA (chat UI). Source in `apps/web/src/`.
- `apps/api/`: Core API/orchestrator (Fastify, Postgres, streaming SSE, RAG). Source in `apps/api/src/`.
- `services/notes/`: Obsidian vault HTTP service. Source in `services/notes/src/`.
- `services/safe-runner/`: Signed “safe tier” command runner. Source in `services/safe-runner/src/`.
- `infra/postgres/`: `pgvector` extension + schema init.
- `docker-compose.yml`: main stack; `docker-compose.vault.yml` adds Git‑synced vault volume.

## Build, Test, and Development Commands

- `docker compose up --build -d`: build and start the base stack.
- `docker compose -f docker-compose.yml -f docker-compose.vault.yml up --build -d`: start stack with Git‑synced Obsidian vault.
- `docker compose logs -f api web notes safe-runner`: tail service logs.
- Local dev without Traefik: open `http://localhost:5173`; API on `http://localhost:18080`.

## Coding Style & Naming Conventions

- TypeScript across services; React in web.
- Indentation: 2 spaces. Keep existing import style (`node:` built‑ins, ESM).
- Prefer `const`, explicit exported types, and descriptive names. Avoid broad refactors.
- No formatter configured yet; match nearby file style.

## Testing Guidelines

No test suite is present in MVP. If you add tests:
- Web: prefer `vitest` + `@testing-library/react`.
- API/services: prefer `node:test` or `vitest`.
- Name tests `*.test.ts(x)` colocated near code or in a `tests/` folder.

## Commit & Pull Request Guidelines

No established history yet. Use Conventional Commits when possible:
- `feat: …`, `fix: …`, `chore: …`, `docs: …`.
PRs should include:
- A short description, risk notes (especially around runners/Traefik), and how to verify.
- Screenshots for UI changes and example curl/requests for API changes.

**Monorepo note:** This project lives inside the `containers` monorepo. Always commit and push from the monorepo root (`/home/wegener/containers`), not from within this subdirectory.

## Security & Configuration Tips

- Never commit `.env` or secrets; rotate any key pasted into chat.
- Core API must not gain SSH keys or Docker sockets; keep execution in runners.
- Keep `SAFE_ALLOWLIST` minimal; any “dangerous/SSH” runner must remain a separate service.

