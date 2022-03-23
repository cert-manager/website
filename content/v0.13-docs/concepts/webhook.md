---
title: Webhook
description: 'cert-manager core concepts: Webhook'
---

cert-manager makes use of extending the Kubernetes API server using a Webhook
server to provide [dynamic admission
control](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/)
over cert-manager resources. This means that cert-manager benefits from most of
the same behavior that core Kubernetes resource have. The webhook has three
main functions:

- [`ValidatingAdmissionWebhook`](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook):
  Ensures that when cert-manager resources are created or updated, they conform
  to the rules of the API. This validation is more in depth than for example
  ensuring resources conform to the OpenAPI schema, but instead contains logic such as
  not allowing to specify more than one `Issuer` type per `Issuer` resource. The
  validating admission is always called and will respond with a success or
  failed response.
- [`MutatingAdmissionWebhook`](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook):
  Changes the contents of resources during create and update operations, for
  example to set default values.
- [`CustomResourceConversionWebhook`](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definition-versioning/#webhook-conversion):
  The webhook will also be responsible for implementing a conversion over
  versions in the cert-manager `CustomResources` (`cert-manager.io`). Although
  none are currently implemented, the webhook will convert versions from
  `v1alpha2` to newer versions as they are released.

The webhook component is deployed as another pod that runs alongside the main
cert-manager controller and CA injector components.

In order for the API server to communicate with the webhook component, the
webhook requires a TLS certificate that the apiserver is configured to trust.
This is created by the [`cainjector`](./ca-injector.md) and is implemented by the
following two Secrets:

- `secret/cert-manager-webhook-ca`: A self-signed root CA certificate which is
  used to sign certificates for the webhook pod.
- `secret/cert-manager-webhook-tls`: A TLS certificate issued by the root CA
  above, served by the webhook.

If errors occur around the webhook but the webhook is running then the webhook
is most likely not reachable from the API server. In this case, ensure that the
API server can communicate with the webhook by following the [GKE private
cluster explanation](../installation/compatibility.md#gke).