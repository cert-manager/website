---
title: Webhook
description: 'cert-manager configuration: ACME DNS-01 challenges using External Webhook Solvers'
---

The webhook `Issuer` is a generic ACME solver. The actual work is done by an
external service. Look at the respective documentation of
[`dns-providers`](../../../contributing/dns-providers.md).

View more webhook solvers at https://github.com/topics/cert-manager-webhook.

Here is an example of how webhook providers are to be configured. All `DNS01`
providers will contain their own specific configuration however all require a
`groupName` and `solverName` field.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
   ...
    solvers:
    - dns01:
        webhook:
          groupName: $WEBHOOK_GROUP_NAME
          solverName: $WEBHOOK_SOLVER_NAME
          config:
            ...
            <webhook-specific-configuration>
```
