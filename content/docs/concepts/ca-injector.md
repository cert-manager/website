---
title: "CA Injector"
linkTitle: "ca-injector"
weight: 10
type: "docs"
---

The cert-manager CA injector controller is responsible for injecting the two CA
bundles above into the [webhook's](../webhook/index.html)
`ValidatingWebhookConfiguration` and `APIService` resource in order to allow the
Kubernetes apiserver to 'trust' the webhook apiserver.

This component is configured using the `cert-manager.io/inject-apiserver-ca:
"true"` and `cert-manager.io/inject-apiserver-ca: "true"` annotations on the
`APIService`, `ValidatingWebhookConfiguration` and
`MutatingWebhookConfiguration` resources.

It copies across the CA defined in the `cert-manager-webhook-ca` Secret
generated to the `caBundle` field on the `APIService` resource. It also sets
the webhook's `clientConfig.caBundle` field on the `cert-manager-webhook`
`ValidatingWebhookConfiguration` resource to that of your Kubernetes API server
in order to support Kubernetes versions earlier than v1.11.

The CA injector runs as a separate pod along side the main cert-manager
controller and webhook components.
