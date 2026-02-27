# Observer Stack — Kubernetes Migration

The observer stack is best migrated using Helm rather than raw manifests.

## Recommended approach: kube-prometheus-stack + Loki

```bash
# Add Helm repos
microk8s helm3 repo add prometheus-community https://prometheus-community.github.io/helm-charts
microk8s helm3 repo add grafana https://grafana.github.io/helm-charts
microk8s helm3 repo update

# Install kube-prometheus-stack (Prometheus + Grafana + Alertmanager + node-exporter + kube-state-metrics)
microk8s helm3 install kube-prometheus prometheus-community/kube-prometheus-stack \
  --namespace prod \
  --set grafana.adminPassword=YOUR_GRAFANA_PASSWORD \
  --set grafana.service.type=NodePort \
  --set grafana.service.nodePort=30090 \
  --set prometheus.prometheusSpec.retention=30d

# Install Loki stack (Loki + Promtail)
microk8s helm3 install loki grafana/loki-stack \
  --namespace prod \
  --set promtail.enabled=true
```

## Grafana dashboards

Import existing dashboards from `../grafana/dashboards/*.json` via Grafana UI
(Dashboards → Import → Upload JSON file).

## Promtail config

Promtail needs access to Docker logs and the Traefik access log. Mount host paths
by customising the Promtail values. See `promtail-values.yml` for overrides.

## cAdvisor

cAdvisor is bundled in kube-prometheus-stack as a DaemonSet. If you need the same
Docker-specific metrics as before, you can keep cAdvisor in Docker or deploy it as
a privileged DaemonSet. See `cadvisor.yml` for the raw manifest.

## NodePort for Traefik routing

After install, update rules.yml:
  grafana-observer service URL → http://localhost:30090
