---
title: DNS Providers
description: 'cert-manager contributing guide: Creating DNS providers'
---

## Creating DNS Providers

Due to the large number of requests to support DNS providers to resolve DNS
challenges, it became impractical and infeasible to maintain and test all DNS
providers in the main cert-manager repository.

For this reason, it was decided that new DNS providers should be supported out-of-tree
by way of external webhooks.

To implement an external DNS provider webhook, it is recommended to base your
implementation on the [cert-manager webhook-example](https://github.com/cert-manager/webhook-example).

There's further information available in the configuration section:

- [ACME DNS01 via webhook](../configuration/acme/dns01/README.md#webhook)
- [Configuring an ACME issuer with external webhook](../configuration/acme/dns01/webhook.md)

If you're struggling with creating a new DNS webhook, reach out on [Slack](./README.md#slack)!
