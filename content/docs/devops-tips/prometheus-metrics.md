---
title: Prometheus Metrics
description: 'cert-manager usage: Prometheus metrics'
---

To help with operations and insights into cert-manager activities, cert-manager exposes metrics in the [Prometheus](https://prometheus.io/) format from the controller and webhook components. These are available at the standard `/metrics` endpoint on port `9402` of each component Pod.

## Scraping Metrics

How metrics are scraped will depend how you're operating your Prometheus server(s). These examples presume the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) is being used to run Prometheus, and configure Pod or Service Monitor CRDs.

### Helm

If you're deploying cert-manager with helm, a `PodMonitor` resource can be configured. This configuration should enable metric scraping, and the configuration can be further tweaked as described in the [Helm configuration documentation](https://github.com/cert-manager/cert-manager/blob/master/deploy/charts/cert-manager/README.template.md#configuration).

```yaml
prometheus:
  enabled: true
  podmonitor:
    enabled: true
```

### Regular Manifests

If you're not using helm to deploy cert-manager and instead using the provided regular YAML manifests, this example `PodMonitor` should be all you need to start ingesting cert-manager metrics.

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
spec:
  jobLabel: app.kubernetes.io/name
  selector:
    matchExpressions:
      - key: app.kubernetes.io/name
        operator: In
        values:
        - cert-manager
        - webhook
      - key: app.kubernetes.io/instance
        operator: In
        values:
        - release-name
      - key: app.kubernetes.io/component
        operator: In
        values:
        - controller
        - webhook
  podMetricsEndpoints:
    - port: http-metrics
```

### TLS

TLS can be enabled on the metrics endpoint for end-to-end encryption. This is achieved either using pre-signed static certificates, or using the internal dynamic certificate signing.

#### Static certificates

Static certificates can be provided to the cert-manager to use when listening on the metric endpoint. If the certificate files are changed then cert-manager will reload the certificates for zero-downtime rotation.

Static certificates can be specified via the flags `--metrics-tls-cert-file` and `--metrics-tls-private-key-file` or the corresponding config file parameters `metricsTLSConfig.filesystem.certFile` and `metricsTLSConfig.filesystem.keyFile`.

The certificate and private key must be mounted into the controller pod for this to work, if cert-manager is deployed using helm the `.volumes[]` and `.mounts[]` properties can facilitate this.

An example Helm values file would be:

```yaml
# values.yaml
prometheus:
  enabled: true
config:
  metricsTLSConfig:
    filesystem:
      certFile: "/path/to/cert.pem"
      keyFile: "/path/to/key.pem"
webhook:
  config:
    metricsTLSConfig:
      filesystem:
        certFile: "/path/to/cert.pem"
        keyFile: "/path/to/key.pem"
```

#### Dynamic certificates

In this mode cert-manager will create a CA in a named Secret, then use this CA to sign the metrics endpoint certificates. This mode will also take care of rotation, auto rotating the certificate as required.

Dynamic certificates can be specified via the flags `--metrics-dynamic-serving-ca-secret-namespace`, `--metrics-dynamic-serving-ca-secret-name` and `--metrics-dynamic-serving-dns-names` or the corresponding config file parameters `metricsTLSConfig.dynamic.secretNamespace`, `metricsTLSConfig.dynamic.secretName` and `metricsTLSConfig.dynamic.dnsNames`.

An example Helm values file would be:

```yaml
# values.yaml
prometheus:
  enabled: true
  podmonitor:
    enabled: true
    endpointAdditionalProperties:
      scheme: https
      tlsConfig:
        serverName: cert-manager-metrics
        ca:
          secret:
            name: cert-manager-metrics-ca
            key: "tls.crt"
config:
  metricsTLSConfig:
    dynamic:
      secretNamespace: "cert-manager"
      secretName: "cert-manager-metrics-ca"
      dnsNames:
      - cert-manager-metrics
webhook:
  config:
    metricsTLSConfig:
      dynamic:
        secretNamespace: "cert-manager"
        secretName: "cert-manager-metrics-ca"
        dnsNames:
        - cert-manager-metrics
```

> ℹ️ This configuration will result in a single new Secret `cert-manager/cert-manager-metrics-ca` containing a CA.
> The first `controller` or `webook` Pod will create the CA Secret and the others will then use it.
>
> All the controller and webhook Pods will generate their own unique metrics serving certificates
> and sign them with the CA private key.
>
> The `PodMonitor` is configured to read the public certificate from the CA Secret
> and Prometheus will use that CA when it connects to the metrics servers of each of the matching Pods.
>
> All the serving certificates share the same DNS name.
> That same name must be added to the `PodMonitor`
> and Prometheus will use that hostname when it connects to the metrics servers of each of the matching Pods.

##### Troubleshooting

Check the controller and webhook logs to see the CA certificate and serving certificates being created and updated:

```sh
kubectl  -n cert-manager logs -l app.kubernetes.io/instance=cert-manager --prefix
```

```console
I0719 15:21:28.113411       1 dynamic_source.go:172] "Detected root CA rotation - regenerating serving certificates" logger="cert-manager"
I0719 15:21:28.115018       1 dynamic_source.go:290] "Updated cert-manager TLS certificate" logger="cert-manager" DNSNames=["cert-manager-metrics"]
```

Check the connection to the metrics endpoint using `kubectl port-forward` and  `curl`:

```sh
kubectl port-forward -n cert-manager deployment/cert-manager-webhook 9402
curl --insecure -v https://localhost:9402/metrics
```

Check the health of the cert-manager scrape targets on the Prometheus status page:

![](/docs/devops-tips/prometheus-metrics/prometheus-status-targets.png)

## Monitoring Mixin

Monitoring mixins are a way to bundle common alerts, rules, and dashboards for an application in a configurable and extensible way, using the Jsonnet data templating language. A cert-manager monitoring mixin can be found here https://gitlab.com/uneeq-oss/cert-manager-mixin. Documentation on usage can be found with the `cert-manager-mixin` project.
