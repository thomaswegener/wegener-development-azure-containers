# System Architecture

## Overview

MicroK8s monorepo — all application services run as Kubernetes pods in the `prod` namespace, exposed via NodePort services. Traefik runs as a standalone Docker container, routing HTTPS traffic to K8s NodePorts via the host bridge IP `172.20.0.1`.

```
Internet
   │  HTTPS :443 / HTTP :80
   ▼
┌──────────────────────────────────────┐
│  Traefik v3.1  (Docker)              │
│  traefik/dynamic/rules.yml           │
│  traefik/dynamic/middlewares.yml     │
│  Let's Encrypt (acme.json)           │
└──────────┬───────────────────────────┘
           │ http://172.20.0.1:<NodePort>
           ▼
┌──────────────────────────────────────────────────────────────────┐
│  MicroK8s  –  namespace: prod                                    │
│                                                                  │
│  NodePort  Service                 Pod(s)                        │
│  ───────── ─────────────────────── ────────────────────────────  │
│  30080     wegener-no              wegener.no (nginx)            │
│  30081     go-north                go-north.no (nginx)           │
│  30082     piratehusky             piratehusky.no (express SSR)  │
│  30083     kongsbergvitensenter    kvs.no (express SSR)          │
│  30084     n8n                     n8n v2.6.3 + SQLite           │
│  30085     visithammerfest-api     Fastify + Prisma               │
│  30086     visithammerfest-web     Vite preview                  │
│  30087     lamp-apache             Apache PHP 8.2                │
│  30088     wegener-api             Portal API (Fastify)          │
│  30089     wegener-auth            SSO service (Fastify)         │
│  30090     kube-prometheus-grafana Grafana 11 (Helm)             │
│                                                                  │
│  ClusterIP (internal only)                                       │
│  ───────── ──────────────────────────────────────────────────    │
│  auth-db           PostgreSQL 16  (auth service)                 │
│  wegener-db        PostgreSQL 16  (portal API)                   │
│  visithammerfest-db PostgreSQL 16 + Prisma                       │
│  lamp-mysql        MySQL 8.0                                     │
│  loki              Grafana Loki 2.9                              │
│  prometheus        kube-prometheus-stack                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## SSO Flow (auth.wegener.no)

All internal services (`grafana.observer.wegener.no`, `wegener.no/portal`, etc.) are protected by a shared SSO cookie on `.wegener.no`. Traefik enforces this via the `wgn-forwardauth` middleware.

```
Browser visits grafana.observer.wegener.no
          │
          ▼
   Traefik: wgn-forwardauth middleware
          │  calls http://172.20.0.1:30089/auth/forward
          │  (forwards Cookie header including wgn_auth)
          ▼
   wegener-auth pod  GET /auth/forward
          │
          ├─ wgn_auth cookie valid?
          │        │
          │       YES ──► return 200
          │                + X-WEBAUTH-USER: email
          │                + X-WEBAUTH-ROLE: Admin | Viewer
          │                + X-Display-Name: name
          │
          └─ NO / expired ──► return 302
                               → https://auth.wegener.no/login
                                 ?redirect=<original-url>
                                 (user logs in, gets wgn_auth cookie
                                  on domain .wegener.no, redirected back)

   On 200: Traefik forwards X-WEBAUTH-* headers to backend
          │
          ▼  (for Grafana)
   Grafana auth.proxy reads X-WEBAUTH-USER + X-WEBAUTH-ROLE
   → auto-creates / logs in user, no Grafana login screen
```

### Cookie & Session

| Property | Value |
|----------|-------|
| Cookie name | `wgn_auth` |
| Cookie domain | `.wegener.no` (all subdomains) |
| Storage | PostgreSQL (`sessions` table in `auth-db`) |
| TTL | 30 days, refreshed on each request |
| Token | 32-byte random hex, SHA-256 hashed in DB |

### Auth Methods

| Method | Route |
|--------|-------|
| Google OAuth | `GET /auth/google` → callback `/auth/google/callback` |
| Microsoft OAuth | `GET /auth/microsoft` → callback `/auth/microsoft/callback` |
| Magic link (email) | `POST /auth/magic/request` → `GET /auth/magic/verify?token=` |
| Logout | `POST /auth/logout` |
| Session check | `GET /api/session` (returns JSON user info) |
| ForwardAuth | `GET /auth/forward` (Traefik-facing, no rate limit) |

### Admin Emails

Users whose email is in `ADMIN_EMAIL` (comma-separated) get:
- `ADMIN` role in the auth DB
- `X-WEBAUTH-ROLE: Admin` → Grafana Admin

Currently: `thomaskaasgaardwegener@gmail.com,thomas@wegener.no`

---

## Traefik Routing

```
Domain                          Middleware          NodePort
──────────────────────────────  ─────────────────  ────────
wegener.no                      wwwtohttps          30080
go-north.no                     wwwtohttps          30081
piratehusky.no                  wwwtohttps          30082
kongsbergvitensenter.no         wwwtohttps          30083
n8n.wegener.no                  —                   30084
visithammerfest.wegener.no/api  —                   30085
visithammerfest.wegener.no      —                   30086
visithammerfest.no              wwwtohttps          30087 (lamp)
ingvildogthomas.no              wwwtohttps          30087 (lamp)
porsangerfjordenlodge.no        wwwtohttps          30087 (lamp)
wegener.no/api                  wwwtohttps          30088
auth.wegener.no                 —                   30089
grafana.observer.wegener.no     wgn-forwardauth     30090
```

Config files (hot-reloaded, no Traefik restart needed):
- `traefik/dynamic/rules.yml` — routers + services
- `traefik/dynamic/middlewares.yml` — shared middlewares

---

## Monitoring Stack

Deployed via Helm (`kube-prometheus-stack` + `loki-stack`) in the `prod` namespace.

```
K8s pods / node metrics ──► prometheus (scrape)
                                    │
                                    └──► Grafana (dashboards + alerting)
                                                │
                                                └──► Discord webhook (alerts)

Container logs (promtail DaemonSet) ──► Loki ──► Grafana (log explorer)
```

Grafana is protected by `wgn-forwardauth` — SSO session required, then auth proxy auto-logs you in as Admin.

Config: `observer/k8s/kube-prometheus-values.yml`
Re-apply: `microk8s helm3 upgrade kube-prometheus prometheus-community/kube-prometheus-stack --namespace prod --values observer/k8s/kube-prometheus-values.yml --reuse-values`

---

## Deploy: Any Service

```bash
# 1. Build and push image
cd /home/wegener/containers/<service>
docker build -f Dockerfile[.api] -t localhost:32000/<image>:latest .
docker push localhost:32000/<image>:latest

# 2. Apply K8s manifests (secret + deployment + service)
microk8s kubectl apply -f k8s/secret.yml   # if secrets changed
microk8s kubectl apply -f k8s/            # everything else

# 3. Roll out new image (if pod was already running)
microk8s kubectl rollout restart deployment/<name> -n prod
microk8s kubectl rollout status deployment/<name> -n prod

# 4. Verify
microk8s kubectl logs -n prod deploy/<name> --tail=20
curl -s http://172.20.0.1:<nodeport>
```

## Useful kubectl

```bash
microk8s kubectl get pods -n prod          # all pod statuses
microk8s kubectl get svc -n prod           # NodePort assignments
microk8s kubectl logs -n prod deploy/<n>   # logs
microk8s kubectl exec -it -n prod deploy/<n> -- sh   # shell
microk8s kubectl describe pod -n prod -l app=<n>     # events/errors
microk8s kubectl scale deployment/<n> --replicas=0 -n prod  # stop
```
