# Docker → MicroK8s Migration Runbook

## Phase 0: MicroK8s Install

```bash
sudo snap install microk8s --classic --channel=1.31/stable
sudo usermod -aG microk8s wegener
newgrp microk8s

microk8s enable dns storage helm3 registry
microk8s kubectl create namespace prod
```

Verify:
```bash
microk8s status --wait-ready
microk8s kubectl get nodes
```

---

## NodePort → rules.yml reference

| Step | Service | NodePort | rules.yml service key | New URL |
|------|---------|----------|----------------------|---------|
| 1 | wegener.no | 30080 | `wegener` | `http://172.20.0.1:30080` |
| 2 | go-north.no | 30081 | `go-north` | `http://172.20.0.1:30081` |
| 3 | piratehusky.no | 30082 | `piratehusky` | `http://172.20.0.1:30082` |
| 4 | kongsbergvitensenter.no | 30083 | `kongsbergvitensenter` | `http://172.20.0.1:30083` |
| 5 | n8n | 30084 | `n8n` | `http://172.20.0.1:30084` |
| 7 | visithammerfest-api | 30085 | `visithammerfest-api` | `http://172.20.0.1:30085` |
| 7 | visithammerfest-web | 30086 | `visithammerfest-web` | `http://172.20.0.1:30086` |
| 9 | lamp-apache | 30087 | `lamp` | `http://172.20.0.1:30087` |
| 10 | chat-api | 30088 | `chat-api` | `http://172.20.0.1:30088` |
| 10 | chat-safe-runner | 30089 | `chat-runner` | `http://172.20.0.1:30089` |
| 8 | grafana | 30090 | `grafana-observer` | `http://172.20.0.1:30090` |
| 10 | chat-web | 30091 | `chat-web` | `http://172.20.0.1:30091` |

---

## Per-step cutover procedure

### Standard (stateless) service

```bash
# 1. Build and push image
cd /home/wegener/containers/<service>
docker build -t localhost:32000/<image-name>:latest .
docker push localhost:32000/<image-name>:latest

# 2. Apply k8s manifests
microk8s kubectl apply -f k8s/

# 3. Verify pod is running
microk8s kubectl get pods -n prod
microk8s kubectl logs -n prod deploy/<name>

# 4. Test via NodePort
curl -s http://172.20.0.1:<nodeport>

# 5. Cutover Traefik — edit rules.yml service URL
#    Change: http://container-name:port
#    To:     http://172.20.0.1:<nodeport>
# (Traefik picks it up in ~1s with watch: true)

# 6. Verify domain still works
curl -sk https://<domain>.no

# 7. Stop Docker container
docker compose down
```

### Rollback (any service)

```bash
# 1. Start Docker container
docker compose up -d   # in service directory

# 2. Revert rules.yml URL back to original container-name:port
# Traefik picks it up instantly

# 3. Scale down k8s deployment (optional)
microk8s kubectl scale deployment/<name> --replicas=0 -n prod
```

---

## Step 1: wegener.no

```bash
cd /home/wegener/containers/wegener.no
docker build -t localhost:32000/wegener-no:latest .
docker push localhost:32000/wegener-no:latest
microk8s kubectl apply -f k8s/
# Verify, cutover rules.yml, stop Docker
```

rules.yml change:
```yaml
# Before:
wegener:
  loadBalancer:
    servers:
      - url: "http://wegener.no:80"
# After:
wegener:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30080"
```

---

## Step 2: go-north.no

```bash
cd /home/wegener/containers/go-north
docker build -t localhost:32000/go-north:latest .
docker push localhost:32000/go-north:latest
microk8s kubectl apply -f k8s/
```

rules.yml change:
```yaml
# Before:
go-north:
  loadBalancer:
    servers:
      - url: "http://go-north.no:80"
# After:
go-north:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30081"
```

---

## Step 3: piratehusky.no

```bash
cd /home/wegener/containers/piratehusky

# Fill in real values from .env before applying:
# Edit k8s/secret.yml with actual ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET

docker build -t localhost:32000/piratehusky:latest .
docker push localhost:32000/piratehusky:latest
microk8s kubectl apply -f k8s/
```

rules.yml change:
```yaml
# Before:
piratehusky:
  loadBalancer:
    servers:
      - url: "http://piratehusky.no:4173"
# After:
piratehusky:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30082"
```

Note: sledespesialisten router also uses the `piratehusky` service — update both or just the
service definition (both routers will automatically point to the new URL).

---

## Step 4: kongsbergvitensenter.no

```bash
cd /home/wegener/containers/kongsbergvitensenter

# Fill k8s/secret.yml with values from .env (NOTION_API_KEY + DB IDs)

docker build -t localhost:32000/kongsbergvitensenter:latest .
docker push localhost:32000/kongsbergvitensenter:latest
microk8s kubectl apply -f k8s/
```

rules.yml change:
```yaml
# Before:
kongsbergvitensenter:
  loadBalancer:
    servers:
      - url: "http://kongsbergvitensenter.no:4173"
# After:
kongsbergvitensenter:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30083"
```

---

## Step 5: n8n (SQLite — stop Docker first!)

```bash
# Stop Docker container BEFORE starting k8s pod (SQLite single-writer)
cd /home/wegener/containers/n8n
docker compose down

# Apply k8s manifests (uses n8nio/n8n:latest directly — no build needed)
microk8s kubectl apply -f k8s/

# Verify pod is running and data dir is accessible
microk8s kubectl logs -n prod deploy/n8n

# Test
curl -s http://172.20.0.1:30084
```

rules.yml change:
```yaml
# Before:
n8n:
  loadBalancer:
    servers:
      - url: "http://n8n.wegener.no:5678"
# After:
n8n:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30084"
```

Rollback: `microk8s kubectl scale deployment/n8n --replicas=0 -n prod && docker compose up -d`

---

## Step 6: Twingate connectors

```bash
# Fill k8s/secret.yml with values from .env (TWINGATE_NETWORK, TG1_ACCESS, etc.)
cd /home/wegener/containers/twingate

# Enable unsafe sysctls in MicroK8s apiserver (required for ping_group_range):
# Edit /var/snap/microk8s/current/args/kube-apiserver
# Add: --allowed-unsafe-sysctls=net.ipv4.ping_group_range
# Then restart: sudo snap restart microk8s.daemon-apiserver
#
# If you'd rather skip the sysctl complexity, keep Twingate in Docker (perfectly fine).

microk8s kubectl apply -f k8s/

# Verify connectors appear as healthy in the Twingate admin console
# Then stop Docker containers:
docker compose down
```

---

## Step 7: visithammerfest (postgres + api + web)

```bash
cd /home/wegener/containers/visithammerfest

# Fill k8s/secret.yml with values from .env (DATABASE_URL, COOKIE_SECRET, etc.)

# 1. Stop Docker postgres first (NEVER run two instances on same data dir)
docker compose stop db

# 2. Apply postgres StatefulSet
microk8s kubectl apply -f k8s/postgres.yml
microk8s kubectl wait --for=condition=ready pod -l app=visithammerfest-db -n prod --timeout=60s

# 3. Build and push images
docker build -f Dockerfile.api -t localhost:32000/visithammerfest-api:latest .
docker push localhost:32000/visithammerfest-api:latest

docker build -f Dockerfile.web \
  --build-arg VITE_API_BASE_URL=/api \
  -t localhost:32000/visithammerfest-web:latest .
docker push localhost:32000/visithammerfest-web:latest

# 4. Stop Docker api and web, apply k8s manifests
docker compose down
microk8s kubectl apply -f k8s/secret.yml
microk8s kubectl apply -f k8s/api.yml
microk8s kubectl apply -f k8s/web.yml
```

rules.yml changes:
```yaml
# Before:
visithammerfest-web:
  loadBalancer:
    servers:
      - url: "http://visithammerfest-web:4179"

visithammerfest-api:
  loadBalancer:
    servers:
      - url: "http://visithammerfest-api:5170"
# After:
visithammerfest-web:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30086"

visithammerfest-api:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30085"
```

---

## Step 8: Observer stack (Helm)

See `observer/k8s/README.md` for full Helm install commands.

Quick summary:
```bash
microk8s helm3 repo add prometheus-community https://prometheus-community.github.io/helm-charts
microk8s helm3 repo add grafana https://grafana.github.io/helm-charts
microk8s helm3 repo update

microk8s helm3 install kube-prometheus prometheus-community/kube-prometheus-stack \
  --namespace prod \
  --set grafana.adminPassword=YOUR_PASSWORD \
  --set grafana.service.type=NodePort \
  --set grafana.service.nodePort=30090 \
  --set prometheus.prometheusSpec.retention=30d

microk8s helm3 install loki grafana/loki-stack \
  --namespace prod \
  -f observer/k8s/promtail-values.yml
```

rules.yml change:
```yaml
# Before:
grafana-observer:
  loadBalancer:
    servers:
      - url: "http://grafana.observer.wegener.no:3000"
# After:
grafana-observer:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30090"
```

Import dashboards: Grafana UI → Dashboards → Import → upload each `observer/grafana/dashboards/*.json`

---

## Step 9: LAMP stack (apache + mysql)

```bash
cd /home/wegener/containers/lampstack

# Stop Docker mysql first
docker compose stop mysql

# Apply mysql StatefulSet
microk8s kubectl apply -f k8s/secret.yml
microk8s kubectl apply -f k8s/mysql.yml
microk8s kubectl wait --for=condition=ready pod -l app=lamp-mysql -n prod --timeout=60s

# Build and push apache image
docker build -f apache/Dockerfile -t localhost:32000/lamp-apache:latest apache/
docker push localhost:32000/lamp-apache:latest

docker compose down
microk8s kubectl apply -f k8s/apache.yml
```

rules.yml change:
```yaml
# Before:
lamp:
  loadBalancer:
    servers:
      - url: "http://lamp-apache:80"
# After:
lamp:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30087"
```

Note: Three routers (visithammerfest, porsangerfjordenlodge, ingvildogthomas) all use the `lamp`
service — changing the service URL handles all three simultaneously.

---

## Step 10: chat (postgres + notes + api + safe-runner + web)

```bash
cd /home/wegener/containers/chat

# Fill k8s/secret.yml with values from .env

# 1. Find Docker volume mountpoint for postgres data
docker volume inspect chat_pgdata | grep Mountpoint
# Update k8s/postgres.yml hostPath with the actual path

# 2. Stop Docker postgres
docker compose stop postgres

# 3. Apply postgres
microk8s kubectl apply -f k8s/postgres.yml
microk8s kubectl wait --for=condition=ready pod -l app=chat-postgres -n prod --timeout=60s

# 4. Build and push all images
docker build -f services/notes/Dockerfile -t localhost:32000/chat-notes:latest services/notes/
docker push localhost:32000/chat-notes:latest

docker build -f apps/api/Dockerfile -t localhost:32000/chat-api:latest apps/api/
docker push localhost:32000/chat-api:latest

docker build -f services/safe-runner/Dockerfile -t localhost:32000/chat-safe-runner:latest services/safe-runner/
docker push localhost:32000/chat-safe-runner:latest

docker build -f apps/web/Dockerfile -t localhost:32000/chat-web:latest apps/web/
docker push localhost:32000/chat-web:latest

# 5. Stop Docker and apply remaining manifests
docker compose down
microk8s kubectl apply -f k8s/secret.yml
microk8s kubectl apply -f k8s/notes.yml
microk8s kubectl apply -f k8s/api.yml
microk8s kubectl apply -f k8s/safe-runner.yml
microk8s kubectl apply -f k8s/web.yml
```

rules.yml changes:
```yaml
# Before:
chat-web:
  loadBalancer:
    servers:
      - url: "http://chat.wegener.no:5173"

chat-api:
  loadBalancer:
    servers:
      - url: "http://chat-api:8080"

chat-runner:
  loadBalancer:
    servers:
      - url: "http://chat-safe-runner:8082"
# After:
chat-web:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30091"

chat-api:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30088"

chat-runner:
  loadBalancer:
    servers:
      - url: "http://172.20.0.1:30089"
```

---

## Useful kubectl commands

```bash
# All pods
microk8s kubectl get pods -n prod

# Pod logs
microk8s kubectl logs -n prod deploy/<name>
microk8s kubectl logs -n prod deploy/<name> -f   # follow

# Describe pod (events, errors)
microk8s kubectl describe pod -n prod -l app=<name>

# Scale down/up
microk8s kubectl scale deployment/<name> --replicas=0 -n prod
microk8s kubectl scale deployment/<name> --replicas=1 -n prod

# Execute into pod
microk8s kubectl exec -it -n prod deploy/<name> -- sh

# All services + NodePorts
microk8s kubectl get svc -n prod

# Watch pod status
microk8s kubectl get pods -n prod -w
```
