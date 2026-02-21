# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Infrastructure-only monitoring stack (no application code). Seven Docker services providing metrics, logs, and alerting for the parent containers monorepo.

## Commands

```bash
docker compose up --build -d          # Start all services
docker compose down                   # Stop all services
docker compose logs -f <service>      # Tail logs (prometheus, grafana, loki, promtail, cadvisor, node_exporter, alertmanager)
docker compose restart prometheus     # Reload after config changes (or use lifecycle API below)
curl -X POST http://localhost:9090/-/reload  # Hot-reload Prometheus config (web.enable-lifecycle is on)
docker compose up -d --force-recreate promtail grafana  # After changing promtail config or dashboards
```

## Architecture

```
                           /var/log/auth.log ──▶ promtail ──push──▶ loki (log storage, 30d retention)
Docker containers (docker_sd) ──────────────┘       │
Traefik access log ─────────────────────────────────┘
                                                    │
cadvisor ──scrape──▶ prometheus (metrics, 30d retention) ──▶ alertmanager
node_exporter ─────┘       │
traefik (external) ────────┘
                           │
                        grafana (dashboards + alerting) ──▶ Discord (via Slack webhook)
                           ├── datasource: Prometheus (default, uid: prometheus)
                           └── datasource: Loki (uid: loki)
```

### Services and Versions

| Service | Image | Purpose |
|---------|-------|---------|
| prometheus | prom/prometheus:v2.52.0 | Metrics collection, 15s scrape interval, 30d retention |
| alertmanager | prom/alertmanager:v0.27.0 | Alert routing (default receiver placeholder, not actively used) |
| grafana | grafana/grafana:10.4.2 | Dashboards and Grafana-managed alerting |
| loki | grafana/loki:2.9.3 | Log aggregation, boltdb-shipper + filesystem, 30d retention |
| promtail | grafana/promtail:2.9.3 | Log shipping: Docker containers, Traefik access log, `/var/log/auth.log` |
| cadvisor | gcr.io/cadvisor/cadvisor:v0.50.0 | Container resource metrics |
| node_exporter | prom/node-exporter:v1.8.1 | Host-level system metrics |

### Networking

- Internal `observer` network connects all services to each other
- External `web` network (shared with Traefik) exposes Prometheus and Grafana for scraping/routing
- Grafana container name `grafana.observer.wegener.no` is used for Traefik routing

## Dashboards

Four provisioned dashboards in `grafana/dashboards/`:

| Dashboard | File | Key features |
|-----------|------|-------------|
| **Observer - Host** | `host.json` | Stat row (uptime/CPU/mem/disk), CPU, memory, disk, load average (1m/5m/15m + cores), network I/O, disk I/O |
| **Observer - Containers** | `docker.json` | `$container` variable for filtering, stat row (count/CPU/mem), per-container CPU/memory/FS/network, container logs |
| **Observer - Traefik** | `traefik.json` | `$domain` variable, stat row (RPS/error rate/P95), request rate, latency (p50/p95), 5xx + 4xx rates, response code distribution, daily requests, access logs |
| **Observer - Security** | `security.json` | Stats (failed attempts/unique IPs/successful logins/root logins), login attempts over time by type, top attacking IPs + usernames tables, attack rate by IP, raw SSH logs |

All dashboards use `graphTooltip: 1` (shared crosshair).

## Grafana Alert Rules

Defined in `grafana/provisioning/alerting/rules.yml`, delivered to Discord via `alerting.yml`:

**System health folder:** Node up, Disk almost full (<10%), High load (>1.5/core)

**Security folder:** SSH successful login detected (fires immediately), SSH brute force (>30 failed attempts in 2 min)

## Key Configuration Files

- `prometheus/prometheus.yml` — Scrape targets (prometheus, node_exporter, cadvisor, loki, promtail, traefik)
- `prometheus/alerts.yml` — Prometheus alert rules: NodeDown, HostDiskFreeLow, HostMemoryPressure, HostHighLoad, TraefikHigh5xx, TraefikHighLatency
- `prometheus/alertmanager.yml` — Alert routing config (receiver placeholder, no notification target configured)
- `grafana/provisioning/alerting/alerting.yml` — Grafana contact point: Discord via Slack-compatible webhook
- `grafana/provisioning/alerting/rules.yml` — Grafana-managed alert rules (System health + Security)
- `grafana/provisioning/datasources/datasources.yml` — Prometheus + Loki datasource definitions
- `loki/loki-config.yml` — Loki storage and retention config
- `promtail/promtail-config.yml` — Three scrape jobs: Docker containers (docker_sd), Traefik access log, `/var/log/auth.log`

## Promtail Log Parsing

**Traefik access logs** — JSON extraction into labels: `router`, `entrypoint`, `method`, `status`, `client_ip`, `host`

**Auth logs** (`job="auth"`) — Regex extraction into labels: `event` (Failed password, Accepted publickey, Invalid user, etc.), `username`, `src_ip`. Used by the Security dashboard and alert rules.

## Important Details

- Traefik access log path is hardcoded: `/home/wegener/containers/traefik/traefik-access.log`
- Grafana datasource UIDs (`prometheus`, `loki`) are referenced in all dashboard JSON and alert rules — changing them breaks provisioning
- There are two parallel alerting systems: Prometheus alertmanager (no receiver configured) and Grafana alerting (sends to Discord). Only Grafana alerting is actively delivering notifications
- `.env` contains `GRAFANA_ADMIN_PASSWORD`
- Dashboard `$container` variable queries `container_memory_working_set_bytes{image!=""}` label `name`
- Dashboard `$domain` variable extracts router names from `traefik_router_requests_total` via regex

## Version Control

This project lives inside the `containers` monorepo. Always commit and push from the monorepo root (`/home/wegener/containers`), not from within this subdirectory.
