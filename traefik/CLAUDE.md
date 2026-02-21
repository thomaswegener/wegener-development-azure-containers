# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Traefik v3.1 reverse proxy handling SSL termination and routing for the entire containers monorepo. Uses file-based dynamic configuration (not Docker labels).

## Commands

```bash
docker compose up -d              # Start Traefik
docker compose down               # Stop Traefik
docker compose logs -f traefik    # Tail logs
```

## Configuration Architecture

- **`traefik.yml`** - Static config: entrypoints (80/443), Let's Encrypt ACME via HTTP challenge, Prometheus metrics, JSON access log
- **`dynamic/rules.yml`** - All routers and services (file provider, hot-reloaded on save)
- **`dynamic/middlewares.yml`** - Shared middlewares (redirects, basic auth)
- **`letsencrypt/acme.json`** - Certificate storage (auto-managed, do not edit)

Changes to `dynamic/` files are picked up automatically without restart (`watch: true`).

## Routing Pattern

Every router follows this structure in `dynamic/rules.yml`:
```yaml
router-name:
  rule: "Host(`domain.no`) || Host(`www.domain.no`)"
  entryPoints: [web, websecure]
  middlewares: [wwwtohttps]
  service: service-name
  tls:
    certResolver: letsencrypt
```

Services point to containers by their Docker DNS name on the `web` network:
```yaml
service-name:
  loadBalancer:
    servers:
      - url: "http://container-name:port"
```

Multi-service apps (chat, visithammerfest) use `priority` to route API paths before the catch-all frontend router.

## Adding a New Site

1. Add router + service entries in `dynamic/rules.yml`
2. Add middlewares in `dynamic/middlewares.yml` if needed
3. Ensure the target container joins the external `web` network in its own `docker-compose.yml`
4. No restart needed — file provider watches for changes

## Key Details

- HTTP→HTTPS redirect is in static config (`traefik.yml` entryPoints)
- `www.` → bare domain redirect uses `wwwtohttps` middleware (regex-based)
- Basic auth protects Grafana, Traefik dashboard, and chat (same htpasswd hash)
- `n8n-remote` service uses `insecureSkipVerify` for a non-local backend (`tortilla.local`)
- Traefik dashboard exposed at `traefik.observer.wegener.no` behind basic auth, using `api@internal`
- Access log is JSON format, written to `traefik-access.log` (can grow very large)
- Prometheus metrics enabled with router/service/entrypoint labels

## Version Control

This project lives inside the `containers` monorepo. Always commit and push from the monorepo root (`/home/wegener/containers`), not from within this subdirectory.
