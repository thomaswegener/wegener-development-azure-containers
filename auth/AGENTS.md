# auth — Central SSO Service

## Overview

Fastify + Prisma + PostgreSQL SSO service at `auth.wegener.no` (K8s NodePort 30089).
Sets a shared `wgn_auth` cookie on `.wegener.no`, allowing all subdomains to share one session.

## Architecture

```
Browser
  │
  ├─► GET /auth/google  ──► Google OAuth ──► /auth/google/callback
  ├─► GET /auth/microsoft ► Microsoft OAuth ► /auth/microsoft/callback
  ├─► POST /auth/magic/request (email) ──► magic link email sent
  ├─► GET /auth/magic/verify?token=… ──► validate + create session
  └─► POST /auth/logout ──► delete session, clear cookie

  On successful auth → set wgn_auth cookie (httpOnly, .wegener.no, 30d)

Other services (server-to-server):
  ├─► GET /api/session  ──► validate cookie, return user JSON
  └─► GET /auth/forward ──► Traefik ForwardAuth endpoint (no rate limit)
                             200 + X-WEBAUTH-USER/ROLE on valid session
                             302 → login page on missing/expired session
```

## Key Files

```
server/
  src/
    index.ts          — Fastify app setup (cors, helmet, cookie, rate-limit)
    env.ts            — Typed env config (adminEmails is comma-separated)
    db.ts             — Prisma client singleton
    routes/
      auth.ts         — OAuth + magic link routes
      session.ts      — /api/session + /auth/forward
      admin.ts        — Admin panel API
    lib/
      session.ts      — createSession, getSession, cookie helpers
      google.ts       — Google OAuth helpers
      microsoft.ts    — Microsoft OAuth helpers
      email.ts        — Magic link creation + Nodemailer sending
  prisma/
    schema.prisma     — User, Identity, Session, AppAccess models
k8s/
  auth.yml            — Deployment + NodePort Service (30089)
  postgres.yml        — PostgreSQL 16 StatefulSet + ClusterIP Service
  secret.yml          — All env vars (DATABASE_URL, COOKIE_SECRET, etc.)
src/
  login/index.html    — Login SPA (served at /login)
  admin/index.html    — Admin SPA (served at /admin)
```

## Traefik ForwardAuth Integration

The `wgn-forwardauth` middleware in `traefik/dynamic/middlewares.yml` calls `GET /auth/forward` before forwarding any request to a protected backend.

```yaml
wgn-forwardauth:
  forwardAuth:
    address: "http://172.20.0.1:30089/auth/forward"
    authResponseHeaders:
      - "X-WEBAUTH-USER"    # user email
      - "X-WEBAUTH-ROLE"    # "Admin" or "Viewer"
      - "X-Display-Name"    # display name (if set)
```

Grafana (kube-prometheus-stack) is configured with `auth.proxy` in `observer/k8s/kube-prometheus-values.yml` to auto-login from these headers — no separate Grafana password required.

To protect a new service, add `middlewares: [wgn-forwardauth]` to its router in `traefik/dynamic/rules.yml`.

## Rate Limiting

Global: 60 req/min per **real client IP** (extracted from `X-Forwarded-For`).
`/auth/forward` is exempt — it's a server-to-server call from Traefik.

## Admin Emails

`ADMIN_EMAIL` env var (comma-separated) controls who gets:
- `ADMIN` role in the auth DB (at account creation)
- `X-WEBAUTH-ROLE: Admin` on every `/auth/forward` call (live check, not DB role)

Current: `thomaskaasgaardwegener@gmail.com,thomas@wegener.no`

## Deploy

```bash
cd /home/wegener/containers/auth
docker build -f Dockerfile.api -t localhost:32000/wegener-auth:latest .
docker push localhost:32000/wegener-auth:latest
microk8s kubectl apply -f k8s/secret.yml          # if secrets changed
microk8s kubectl rollout restart deployment/wegener-auth -n prod
microk8s kubectl rollout status deployment/wegener-auth -n prod
```

## Database Schema (Prisma)

- `User` — id, email, displayName, avatarUrl, role (ADMIN/USER)
- `Identity` — provider (google/microsoft), providerId, userId
- `Session` — tokenHash (SHA-256), userId, expiresAt, ip, userAgent, lastSeenAt
- `AppAccess` — userId, appId, role, metadata (per-app permissions)
- `MagicLink` — token, email, userId, redirect, expiresAt, usedAt
