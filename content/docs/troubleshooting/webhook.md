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
- [`CustomResourceConversionWebhook`](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#webhook-conversion):
  The webhook is also responsible for implementing a conversion over versions
  in the cert-manager `CustomResources` (`cert-manager.io`). This means that
  multiple API versions can be supported simultaneously; from `v1alpha2` through to `v1`.
  This makes it possible to rely on a particular version of our
  configuration schema.

The webhook component is deployed as another pod that runs alongside the main
cert-manager controller and CA injector components.

In order for the API server to communicate with the webhook component, the
webhook requires a TLS certificate that the apiserver is configured to trust.

The [`cainjector`](./ca-injector.md) creates `secret/cert-manager-webhook-ca`, a self-signed root CA certificate which is used to sign certificates for the webhook pod.

Then the webhook can be configured with either

1. paths to a TLS certificate and key signed by the webhook CA, or
2. a reference to the CA Secret for dynamic generation of the certificate and key on webhook startup

## Known Problems and Solutions

### Webhook connection problems on GKE private cluster

If errors occur around the webhook but the webhook is running then the webhook
is most likely not reachable from the API server. In this case, ensure that the
API server can communicate with the webhook by following the [GKE private
cluster explanation](../installation/compatibility.md#gke).

### Webhook connection problems on AWS EKS

When using a custom CNI (such as Weave or Calico) on EKS, the webhook cannot be reached by cert-manager.
This happens because the control plane cannot be configured to run on a custom CNI on EKS,
so the CNIs differ between control plane and worker nodes.
The solution is to [run the webhook in the host network](../installation/compatibility.md#aws-eks) so it can be reached by cert-manager.

### Webhook connection problems shortly after cert-manager installation

When you first install cert-manager, it will take a few seconds before the cert-manager API is usable.
This is because the cert-manager API requires the cert-manager webhook server, which takes some time to start up.
Here's why:

* The webhook server performs a leader election at startup which may take a few seconds.
* The webhook server may take a few seconds to start up and to generate its self-signed CA and serving certificate and to publish those to a Secret.
* `cainjector` performs a leader election at start up which can take a few seconds.
* `cainjector`, once started, will take a few seconds to update the `caBundle` in all the webhook configurations.

For these reasons, after installing cert-manager and when performing post-installation cert-manager API operations,
you will need to check for temporary API configuration errors and retry.

You could also add a post-installation check which performs `kubectl --dry-run` operations on the cert-manager API.
Or you could add a post-installation check which automatically retries the [Installation Verification](../installation/verify.md) steps until they succeed.

## Diagnosing Other Webhook Problems

### Check the webhook TLS certificates

The Kubernetes API server will load the CA content from the webhook configuration and use that to verify the serving certificate presented by the webhook server, when the TLS connection is established.

Get the webhook configuration and check the `caBundle` value.
For example, to check the `ValidatingWebhookConfiguration`:

```
kubectl get validatingwebhookconfigurations cert-manager-webhook -o yaml | grep caBundle
```

NOTE: If the value is empty there may be a problem with `cainjector`.
The `caBundle` value is set by [`cainjector` Injecting CA data from a Secret resource](./ca-injector.md#injecting-ca-data-from-a-secret-resource).
Check that the `cainjector` Pod is running and check the `cainjector` logs for errors.

Next check that the `caBundle` has a valid CA certificate.

```
echo <CA BUNDLE VALUE> | base64 -d  | openssl x509 -in - -noout -text
```

Then compare that with the certificates that are being used by the webhook server:

```
kubectl -n cert-manager get secrets cert-manager-webhook-ca  -o yaml
```

You should be able to decode the `ca.crt` X.509 content from that secret and see that the CA matches that which we saw in the webhook configuration.

You should also find that the `tls.crt` content has a certificate signed by that same CA.

NOTE: This process can also be repeated for the `caBundle` field in `MutatingWebhookConfiguration` and `CustomResourceDefinition` resources.

#### Temporarily work around webhook TLS problems

If necessary, you can manually add / update the TLS certificates in the `ValidatingWebhookConfiguration`, `MutatingWebhookConfiguration`,
and in each of the cert-manager `CustomResourceDefinition` resources.
Add the `caBundle` value, copied from the `ca.crt` field of the `cert-manager-webhook-ca` Secret.

NOTE: This should only be used as a temporary measure, while you investigate the root cause of `cainjector` failing to update the fields automatically.