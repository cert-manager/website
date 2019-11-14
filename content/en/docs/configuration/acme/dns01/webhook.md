---
title: "Webhook"
linkTitle: "Webhook"
weight: 30
type: "docs"
---

The webhook issuer is a generic acme solver. The actual work is done by an
external service. Look at the respective documentation of
[`dns-providers`](../../../../contributing/dns-providers/).

See more webhook solver on at `https://github.com/topics/cert-manager-webhook`.

Here is an example of how webhook providers are to be configured. All `DNS01`
providers will contain their own specific configuration however all require a
`groupName` and `solverName` field.

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
