---
title: OpenShift
description: 'cert-manager installation: OpenShift'
---

cert-manager supports running on OpenShift in a similar manner to [Running on
Kubernetes](.kubernetes.md).  It runs within your OpenShift cluster as a series
of deployment resources. It utilizes
[`CustomResourceDefinitions`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources)
to configure Certificate Authorities and request certificates.

It is deployed using regular YAML manifests, like any other application on
OpenShift.

Once cert-manager has been deployed, you must configure `Issuer` or `ClusterIssuer`
resources which represent certificate authorities.
More information on configuring different Issuer types can be found in the
[respective setup guides](../configuration/README.md).

> **Warning**: You should not install multiple instances of cert-manager on a
> single cluster. This will lead to undefined behavior and you may be banned
> from providers such as Let's Encrypt.

## Login to your OpenShift cluster

Before you can install cert-manager, you must first ensure your local machine
is configured to talk to your OpenShift cluster using the `oc` tool.

Login to the OpenShift cluster as the system:admin user
```bash
$ oc login -u system:admin
```

## Installing with regular manifests

In order to install cert-manager, we must first create a namespace to run it
in. This guide will install cert-manager into the `cert-manager`
namespace. It is possible to run cert-manager in a different namespace,
although you will need to make modifications to the deployment manifests.

Create a namespace to run cert-manager in
```bash
$ oc create namespace cert-manager
```

As part of the installation, cert-manager also deploys a webhook server.  The
webhook enables cert-manager to implement validation and mutating webhooks on
cert-manager resources. A
[`ValidatingWebhookConfiguration`](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers)
resource is deployed to validate cert-manager resources we will create after
installation.  No mutating webhooks are currently implemented.

You can read more about the webhook on the [webhook
document](../../concepts/webhook.md).

We can now go ahead and install cert-manager. All resources
(the `CustomResourceDefinitions`, cert-manager, and the webhook component)
are included in a single YAML manifest file:

Install the `CustomResourceDefinitions` and cert-manager itself
```bash
# OpenShift 4+
oc apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.1/cert-manager.yaml

# OpenShift 3.11
$ oc apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.1/cert-manager-legacy.yaml
```

> **Note**: If you're using OpenShift 3 you will need to install the legacy version of the manifests.
> This version does not have API version conversion and only supports `cert-manager.io/v1alpha2` API resources. 

> **Note**: The `--validate=false` flag is added to the `oc apply` command
> above else you will receive a validation error relating to the `caBundle`
> field of the `ValidatingWebhookConfiguration` resource.

## Configuring your first Issuer

Before you can begin issuing certificates, you must configure at least one
Issuer or `ClusterIssuer` resource in your cluster.

You should read the [configuration](../configuration/README.md) guide to
learn how to configure cert-manager to issue certificates from one of the
supported backends.

## Debugging installation issues

If you have any issues with your installation, please refer to the
[FAQ](../faq/README.md).