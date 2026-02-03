# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Docker-based monorepo containing 13 containerized projects hosted on Traefik reverse proxy with Let's Encrypt SSL. Primary stack: Node.js/TypeScript, React/Vite, Fastify/Express, PostgreSQL.

## Common Commands

### Development
```bash
npm install           # Install dependencies
npm run dev           # Start dev server(s) - most projects
npm run dev:api       # API with hot reload
npm run lint          # ESLint checks
```

### Building
```bash
npm run build         # Build frontend for production
npm run build:all     # Build frontend + backend (full-stack projects)
```

### Docker Operations
```bash
docker compose up --build -d          # Build and start all services
docker compose logs -f [service]      # Tail logs
docker compose down                   # Stop and remove containers
```

### Database (Prisma projects like visithammerfest)
```bash
npm run prisma:migrate    # Run migrations
npm run seed:admin        # Seed admin user
```

## Architecture

### Project Structure Pattern
```
project/
├── src/              # React frontend (components/, pages/, hooks/, context/)
├── server/           # Backend code (Fastify or Express)
│   ├── src/          # Server source
│   └── prisma/       # Prisma schema (ORM projects)
├── dist/             # Built frontend (generated)
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Key Projects

| Project | Stack | Entry Points |
|---------|-------|--------------|
| **chat** | React + Fastify + pgvector | `apps/web/src/main.tsx`, `apps/api/src/index.ts` |
| **piratehusky** | React 19 + Express + SSR | `src/main.jsx`, `server/index.js` |
| **visithammerfest** | React 18 + Fastify + Prisma | `src/main.tsx`, `server/src/index.ts` |
| **kongsbergvitensenter** | React + Express + Notion | `src/main.tsx`, `server/index.ts` |

### Infrastructure

- **traefik/** - Reverse proxy (v3.1), routes via `dynamic/rules.yml`
- **observer/** - Prometheus, Grafana, Loki, Promtail for monitoring
- External network `web` connects all public apps to Traefik

### Backend Frameworks

- **Fastify** (chat, visithammerfest): Modern, stream-friendly, plugin-based
- **Express** (piratehusky, mattebok, kongsbergvitensenter): Traditional Node.js

### Database Patterns

- PostgreSQL 16 with Prisma ORM (visithammerfest)
- PostgreSQL with pgvector for embeddings (chat)
- JSON file storage (piratehusky at `server/data/dogs.json`)

## Code Style

- 2-space indentation
- Single quotes preferred
- ESM imports with `node:` prefix for Node builtins
- TypeScript with strict mode enabled
- React: function components, hooks, PascalCase filenames
- ESLint 9 flat config (`eslint.config.js`)

## Environment Variables

Each project uses `.env` files (never committed). Copy `.env.example` to `.env` and configure:

- **chat**: `OPENAI_API_KEY`, `DATABASE_URL`, `JOB_SIGNING_SECRET`
- **visithammerfest**: `DATABASE_URL` (Prisma), admin credentials
- **kongsbergvitensenter**: `NOTION_API_KEY`, database IDs

## Docker Networking

- External `web` network for Traefik routing
- Container naming: `[project]-[service]` for routing rules
- Database containers use internal networks with named volumes

## Project-Specific Documentation

Check `AGENTS.md` files in individual projects for detailed guidelines:
- `chat/AGENTS.md` - Module organization, security notes
- `piratehusky/AGENTS.md` - Frontend/server patterns
- `visithammerfest/AGENTS.md` - Fastify + Prisma patterns
