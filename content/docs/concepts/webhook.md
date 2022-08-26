---
title: All About the cert-manager Webhook
description: |
    Learn about the webhook component of cert-manager, which validates, converts and sets default values for the cert-manager custom resources
---

cert-manager extends the Kubernetes API using Custom Resource Definitions.
It installs a webhook which has three main functions:

- [Validation](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook):
  Ensures that when cert-manager resources are created or updated, they conform
  to the rules of the API. This validation is more in depth than for example
  ensuring resources conform to the OpenAPI schema, but instead contains logic such as
  not allowing to specify more than one `Issuer` type per `Issuer` resource. The
  validating admission is always called and will respond with a success or
  failed response.
- [Mutation / Defaulting](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook):
  Changes the contents of resources during create and update operations, for
  example to set default values.
- [Conversion](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#webhook-conversion):
  The webhook is also responsible for implementing a conversion over versions
  in the cert-manager `CustomResources` (`cert-manager.io`). This means that
  multiple API versions can be supported simultaneously; from `v1alpha2` through to `v1`.
  This makes it possible to rely on a particular version of our
  configuration schema.

> ℹ️ This is known as Dynamic Admission Control.
> Read more about [Dynamic Admission Control](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) in the Kubernetes documentation.

## Overview

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

### Other Webhook Problems

If you encounter any other problems with the webhook, please refer to the [webhook troubleshooting guide](../troubleshooting/webhook/).
