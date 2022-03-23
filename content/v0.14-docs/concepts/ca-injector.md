---
title: CA Injector
description: 'cert-manager core concepts: CA Injector'
---

The cert-manager CA injector controller is responsible for injecting the CA
bundle into the [webhook's](./webhook.md) `ValidatingWebhookConfiguration` and
`MutatingWebhookConfiguration` resources in order to allow the Kubernetes
API server to 'trust' the webhook API server.

This component is configured using the `cert-manager.io/inject-apiserver-ca:
"true"` and `cert-manager.io/inject-ca-from: <NAMESPACE>/<CERTIFICATE>`
annotations on the `ValidatingWebhookConfiguration` and
`MutatingWebhookConfiguration` resources.

It copies across the CA defined in the `cert-manager-webhook-ca` `Secret` over
to the `clientConfig.caBundle` field in both the
`ValidatingWebhookConfiguration` and `MutatingWebhookConfiguration` resources in
order for the API server to trust their respective endpoints.

The CA injector runs as a separate pod along side the main cert-manager
controller and webhook components.