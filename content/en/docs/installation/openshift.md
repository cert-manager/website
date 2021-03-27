---
title: "OpenShift"
linkTitle: "OpenShift"
weight: 20
type: "docs"
---

cert-manager supports running on OpenShift in a similar manner to [Running on
Kubernetes](../kubernetes/).  It runs within your OpenShift cluster as a series
of deployment resources. It utilizes
[`CustomResourceDefinitions`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources)
to configure Certificate Authorities and request certificates.

It is deployed by using regular YAML manifests or using an operator, like any other application on
OpenShift.

Once cert-manager has been deployed, you must configure `Issuer` or `ClusterIssuer`
resources which represent certificate authorities.
More information on configuring different Issuer types can be found in the
[respective setup guides](../../configuration/).

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
document](../../concepts/webhook/).

We can now go ahead and install cert-manager. All resources
(the `CustomResourceDefinitions`, cert-manager, and the webhook component)
are included in a single YAML manifest file:

Install the `CustomResourceDefinitions` and cert-manager itself
```bash
oc apply -f https://github.com/jetstack/cert-manager/releases/download/v1.2.0/cert-manager.yaml
```

## Installing with cert-manager operator

On OpenShift 4 you can also install cert-manager via the OperatorHub using the [cert-manager operator](https://catalog.redhat.com/software/operators/detail/5e999d862937381642a21c7a), this can be found under Red Hat OpenShift Certified Operators in the Embedded OperatorHub of your OpenShift installation.
Any values set in the Operator configuration get passed through as Helm values.

## Configuring your first Issuer

Before you can begin issuing certificates, you must configure at least one
Issuer or `ClusterIssuer` resource in your cluster.

You should read the [configuration](../../configuration/) guide to
learn how to configure cert-manager to issue certificates from one of the
supported backends.

## Debugging installation issues

If you have any issues with your installation, please refer to the
[FAQ](../../faq/).
