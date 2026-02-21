# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Visit Hammerfest is a tourism CMS for the Hammerfest/Måsøy/Porsanger region. It has a React 18 frontend with a Fastify API backend, PostgreSQL 16 database via Prisma ORM, and a media pipeline using Sharp for image processing.

## Commands

```bash
npm run dev           # Vite dev server on :4179 (proxies /api → :5170)
npm run dev:api       # Fastify API server on :5170 (via tsx)
npm run build         # tsc + vite build → dist/
npm run build:api     # tsc server only
npm run prisma:generate   # Generate Prisma client from schema
npm run prisma:migrate    # Run Prisma migrations (dev)
npm run seed:admin        # Seed initial admin user
npm run import:legacy     # Import data from legacy MySQL
```

No test runner or linter is configured yet.

## Architecture

### Two-process full-stack app

- **Frontend** (`src/`): React 18 SPA with react-router-dom. `App.tsx` is a large single-file containing the public site (activities, partners, stores, articles, locations, concepts, FAQs). The admin panel lives in `src/admin/AdminApp.tsx`.
- **API** (`server/src/`): Fastify 4 server. Entry point `index.ts` registers 11 route plugins under `/api`. Serves uploaded media at `/uploads/`.

### Content model

All content entities (Partner, Activity, Store, Article, Location, Concept, Faq) follow the same pattern:
- `ContentStatus` enum: DRAFT → PENDING → PUBLISHED → ARCHIVED
- Text fields (`name`, `description`, `title`, etc.) are stored as `Json` containing `{ en?: string, no?: string }` for i18n
- Most entities have `slug`, `heroMediaId`, `publishedAt`/`publishedById`, and timestamps
- Partners own Activities, Stores, and Articles via `partnerId`

### Auth & RBAC

- Cookie-based sessions with `argon2` password hashing
- Two roles: `ADMIN` (full access) and `PARTNER` (scoped to linked partners via `PartnerUser`)
- Session middleware in `preHandler` hook attaches `request.session`
- RBAC helpers in `server/src/lib/rbac.ts`: `isAdmin()`, `canAccessPartner()`

### Media system

- `MediaAsset` with `MediaVariant` for resized versions (Sharp)
- `MediaLink` polymorphic join: links media to any content type via `targetType`/`targetId`
- Storage: LOCAL filesystem or AZURE_BLOB (configured via env)
- Uploads dir: `server/uploads/`, served as static files

### Key server libraries (`server/src/lib/`)

- `session.ts` - session creation/validation with cookie token hashing
- `audit.ts` - audit logging for admin actions
- `content.ts` - shared content CRUD helpers
- `image.ts` - Sharp-based image processing
- `storage.ts` - storage abstraction (local/Azure)
- `slug.ts` - slug generation
- `validation.ts` - input validation helpers

## Docker setup

Three services: `db` (postgres:16 on :5433), `api` (Dockerfile.api, node:20-bullseye-slim), `web` (Dockerfile.web, node:20-alpine via vite preview). The `api` and `web` containers join the external `web` network for Traefik routing.

## Environment variables

Required: `DATABASE_URL`, `COOKIE_SECRET`. Optional: `PORT` (5170), `CORS_ORIGIN`, `UPLOAD_DIR`, `PUBLIC_BASE_URL`, `MAX_UPLOAD_MB` (15), `SESSION_TTL_DAYS` (30), `AZURE_STORAGE_*`. Frontend build-time: `VITE_API_BASE_URL`.

## Prisma

Schema at `server/prisma/schema.prisma`. Always use `--schema server/prisma/schema.prisma` flag or the npm scripts. The Prisma client singleton is in `server/src/db.ts`.

## Version Control

This project lives inside the `containers` monorepo. Always commit and push from the monorepo root (`/home/wegener/containers`), not from within this subdirectory.
