---
title: Prometheus Metrics
description: 'cert-manager usage: Prometheus metrics'
---

To help with operations and insights into cert-manager activities, cert-manager exposes metrics in the [Prometheus](https://prometheus.io/) format from the controller component. These are available at the standard `/metrics` path of the controller component's configured HTTP port.

## Scraping Metrics

How metrics are scraped will depend how you're operating your Prometheus server(s). These examples presume the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) is being used to run Prometheus, and configure Pod or Service Monitor CRDs.

### Helm

If you're deploying cert-manager with helm, a `ServiceMonitor` resource can be configured. This configuration should enable metric scraping, and the configuration can be further tweaked as described in the [Helm configuration documentation](https://github.com/cert-manager/cert-manager/blob/master/deploy/charts/cert-manager/README.template.md#configuration).

```yaml
prometheus:
  enabled: true
  servicemonitor:
    enabled: true
```

### Regular Manifests

If you're not using helm to deploy cert-manager and instead using the provided regular YAML manifests, this example `PodMonitor` and deployment patch should be all you need to start ingesting cert-manager metrics.

1. [Apply the following patch](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/#use-a-strategic-merge-patch-to-update-a-deployment) to your cert-manager deployment

```yaml
spec:
  template:
    spec:
      containers:
        - name: cert-manager
          ports:
            - containerPort: 9402
              name: http
              protocol: TCP
```

2. Create the following `PodMonitor`

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: cert-manager
  namespace: cert-manager
  labels:
    app: cert-manager
    app.kubernetes.io/name: cert-manager
    app.kubernetes.io/instance: cert-manager
    app.kubernetes.io/component: "controller"
spec:
  jobLabel: app.kubernetes.io/name
  selector:
    matchLabels:
      app: cert-manager
      app.kubernetes.io/name: cert-manager
      app.kubernetes.io/instance: cert-manager
      app.kubernetes.io/component: "controller"
  podMetricsEndpoints:
    - port: http
      honorLabels: true
```

## Monitoring Mixin

Monitoring mixins are a way to bundle common alerts, rules, and dashboards for an application in a configurable and extensible way, using the Jsonnet data templating language. A cert-manager monitoring mixin can be found here https://gitlab.com/uneeq-oss/cert-manager-mixin. Documentation on usage can be found with the `cert-manager-mixin` project.