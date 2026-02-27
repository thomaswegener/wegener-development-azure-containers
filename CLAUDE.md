# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Monorepo with 15 containerized projects. **All services run in MicroK8s** (`prod` namespace) except Traefik, which runs as a Docker container. Traefik routes HTTPS traffic to K8s NodePort services via `172.20.0.1:<NodePort>`.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for full schematics, SSO flow, and NodePort map.

**No root package.json** — each project manages its own dependencies and must be `cd`'d into before running npm commands.

## Common Commands

Run from inside the relevant project directory:

```bash
npm install           # Install dependencies
npm run dev           # Start dev server (most projects)
npm run dev:api       # API with hot reload (chat, visithammerfest, auth, wegener.no)
npm run build         # Build frontend for production
npm run build:all     # Build frontend + backend (kongsbergvitensenter, piratehusky)
npm run lint          # ESLint checks
```

### Deploy to K8s (standard flow)
```bash
cd /home/wegener/containers/<service>
docker build -f Dockerfile[.api] -t localhost:32000/<image>:latest .
docker push localhost:32000/<image>:latest
microk8s kubectl apply -f k8s/secret.yml        # if secrets changed
microk8s kubectl rollout restart deployment/<name> -n prod
microk8s kubectl rollout status deployment/<name> -n prod
```

### K8s Operations
```bash
microk8s kubectl get pods -n prod               # all pod statuses
microk8s kubectl get svc -n prod                # NodePorts
microk8s kubectl logs -n prod deploy/<name>     # logs
microk8s kubectl exec -it -n prod deploy/<n> -- sh  # shell into pod
```

### Traefik (Docker — still running)
```bash
cd /home/wegener/containers/traefik
docker compose logs -f traefik
# dynamic/rules.yml and dynamic/middlewares.yml are hot-reloaded on save
```

### Database (visithammerfest only)
```bash
npm run prisma:migrate    # Run migrations
npm run seed:admin        # Seed admin user
```

## Architecture

### Project Table

| Project | Stack | K8s NodePort | Dockerfile |
|---------|-------|-------------|------------|
| **auth** | Fastify + Prisma + PostgreSQL | 30089 | `Dockerfile.api` |
| **wegener.no** | React 18 (nginx) + Fastify portal API | 30080 / 30088 | `Dockerfile` / `Dockerfile.api` |
| **chat** | React 19 + Fastify + pgvector + OpenAI | — (not yet migrated) | — |
| **piratehusky** | React 19 + Express SSR | 30082 | `Dockerfile` |
| **visithammerfest** | React 18 + Fastify + Prisma + PostgreSQL | 30085 / 30086 | `Dockerfile.api` / `Dockerfile.web` |
| **kongsbergvitensenter** | React 19 + Express + Notion API | 30083 | `Dockerfile` |
| **go-north** | React 19 + react-pdf (static nginx) | 30081 | `Dockerfile` |
| **lampstack** | Apache PHP 8.2 + MySQL 8.0 | 30087 | `apache/Dockerfile` |
| **n8n** | n8n v2.6.3 + SQLite | 30084 | upstream image |
| **observer** | kube-prometheus-stack + loki-stack (Helm) | 30090 | Helm |
| **traefik** | Traefik v3.1 (Docker) | — | upstream image |
| **twingate** | Twingate connectors | — | upstream image |

### SSO (auth.wegener.no)

Central SSO at `auth.wegener.no` (NodePort 30089). Sets `wgn_auth` cookie on `.wegener.no` domain.

Traefik's `wgn-forwardauth` middleware protects services by calling `GET /auth/forward`:
- Valid session → `200` + `X-WEBAUTH-USER` / `X-WEBAUTH-ROLE` headers forwarded to backend
- No session → `302` to `https://auth.wegener.no/login?redirect=<original-url>`

**Currently SSO-protected:** `grafana.observer.wegener.no`

Grafana uses `auth.proxy` to auto-login from the `X-WEBAUTH-USER` header — no separate Grafana login required.

Auth methods: Google OAuth, Microsoft OAuth, magic link email.
Admin emails (get Grafana Admin role): `thomaskaasgaardwegener@gmail.com`, `thomas@wegener.no`

### Frontend Serving Strategies

- **Nginx Alpine** (static): go-north, wegener.no frontend — multi-stage Dockerfile, Vite → nginx
- **Node.js runtime**: visithammerfest-web (Vite preview), piratehusky/kongsbergvitensenter (Express SSR)

### Backend Frameworks

- **Fastify** (auth, chat, visithammerfest, wegener.no portal API): Plugin-based, TypeScript
- **Express** (piratehusky, kongsbergvitensenter): Traditional middleware, CommonJS

### Database Patterns

- PostgreSQL 16 + Prisma ORM (auth) — schema in `server/prisma/`
- PostgreSQL 16 + pgvector (chat) — vector embeddings via OpenAI
- PostgreSQL 16 + Prisma ORM (visithammerfest) — schema in `server/prisma/`
- PostgreSQL 16 (wegener.no portal) — raw `pg` client
- MySQL 8.0 (lampstack) — shared LAMP stack
- SQLite (n8n) — `./data/database.sqlite`
- JSON file (piratehusky) — `server/data/dogs.json`

### Infrastructure

**traefik/dynamic/rules.yml** — all HTTP routers, services, TLS. Hot-reloaded on save.
**traefik/dynamic/middlewares.yml** — shared middlewares incl. `wgn-forwardauth`.

**observer/** — monitoring via Helm:
- `kube-prometheus-stack` — Prometheus + Grafana + Alertmanager + node-exporter + kube-state-metrics
- `loki-stack` — Loki + Promtail (ships container logs + host logs)
- Config: `observer/k8s/kube-prometheus-values.yml`
- Re-apply: `microk8s helm3 upgrade kube-prometheus prometheus-community/kube-prometheus-stack --namespace prod --values observer/k8s/kube-prometheus-values.yml --reuse-values`

**lampstack/** — single `lamp-apache` pod serving `ingvildogthomas.no`, `porsangerfjordenlodge.no`, `visithammerfest.no` via Apache virtual hosts.

**n8n/** — workflow automation. Community node `n8n-nodes-imap-enhanced`. IMAP folders: `INBOX.{folder}` (Dovecot/Domeneshop). Primary workflow: "Email Sorter 3.0".

**k8s-migration/RUNBOOK.md** — step-by-step migration log from Docker Compose to MicroK8s.

### chat/ Sub-Services (not yet migrated)

The chat project has 4 containers — still defined in Docker Compose, not yet in K8s:
- `chat-api` (port 8080) — Fastify + RAG pipeline
- `chat-web` (port 5173) — streaming SSE React UI
- `notes` (port 8081) — read-only Obsidian vault HTTP service
- `safe-runner` (port 8082) — signed allowlist command executor

## Code Style

- 2-space indentation, single quotes
- ESM imports with `node:` prefix for Node builtins
- TypeScript with strict mode (auth, chat, visithammerfest, wegener.no server)
- React: function components, hooks, PascalCase filenames
- ESLint 9 flat config (`eslint.config.js`)

## Environment Variables

Each project uses `k8s/secret.yml` in production (copy values from `.env.example`):

- **auth**: `DATABASE_URL`, `COOKIE_SECRET`, `ADMIN_EMAIL`, `GOOGLE_CLIENT_ID/SECRET`, `MICROSOFT_CLIENT_ID/SECRET`, `SMTP_*`
- **wegener.no portal**: `DATABASE_URL`, `DISCORD_WEBHOOK_URL`, `GITHUB_TOKEN`
- **chat**: `OPENAI_API_KEY`, `DATABASE_URL`, `JOB_SIGNING_SECRET`
- **visithammerfest**: `DATABASE_URL`, admin credentials
- **kongsbergvitensenter**: `NOTION_API_KEY`, Notion database IDs
- **piratehusky**: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`
- **n8n**: `N8N_HOST`, `GENERIC_TIMEZONE`
- **observer**: `GRAFANA_ADMIN_PASSWORD` (in `kube-prometheus-values.yml`)
- **twingate**: `TWINGATE_NETWORK`, `TWINGATE_ACCESS_TOKEN`, `TWINGATE_REFRESH_TOKEN`

## Project-Specific Documentation

- `ARCHITECTURE.md` — full system diagram, SSO flow, NodePort map, deploy commands
- `k8s-migration/RUNBOOK.md` — migration log and per-service cutover steps
- `auth/AGENTS.md` — SSO service architecture, endpoints, ForwardAuth integration
- `observer/k8s/README.md` — Helm install commands for monitoring stack
- `chat/AGENTS.md` — module organization, safe-runner security, RAG pipeline
- `piratehusky/AGENTS.md` — SSR pattern, i18n, data persistence
- `visithammerfest/AGENTS.md` — Fastify plugin structure, Prisma migrations
