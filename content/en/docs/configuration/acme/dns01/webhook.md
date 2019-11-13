---
title: "Webhook"
linkTitle: "Webhook"
weight: 30
type: "docs"
---

The webhook issuer is a generic acme solver. The actual work is done by an
external service. Look at the respective documentation of
[`dns-providers`](../../../../contributing/dns-providers/).

Existing webhook solvers:

- [`alidns-webhook`](https://github.com/pragkent/alidns-webhook)
- [`cert-manager-webhook-dnspod`](https://github.com/qqshfox/cert-manager-webhook-dnspod)
- [`cert-manager-webhook-selectel`](https://github.com/selectel/cert-manager-webhook-selectel)
- [`cert-manager-webhook-softlayer`](https://github.com/cgroschupp/cert-manager-webhook-softlayer)

See more webhook solver on at `https://github.com/topics/cert-manager-webhook`.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
   ...
    solvers:
    - dns01:
        webhook:
          groupName: <webhook-group-name>
          solverName: <webhook-solver-name>
          config:
            ...
            <webhook-specific-configuration>
```
