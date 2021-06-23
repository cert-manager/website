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
oc apply -f https://github.com/jetstack/cert-manager/releases/download/v1.4.0/cert-manager.yaml
```

## Installing with Operator Lifecycle Manager and OperatorHub Web Console

cert-manager is in the [Red Hat-provided Operator catalog][] called "community-operators".
On OpenShift 4 you can install cert-manager from the [OperatorHub web console][] or from the command line.
These installation methods are described in Red Hat's [Adding Operators to a cluster][] documentation.

[Red Hat-provided Operator catalog]: https://docs.openshift.com/container-platform/4.7/operators/understanding/olm-rh-catalogs.html#olm-rh-catalogs_olm-rh-catalogs
[OperatorHub web console]: https://docs.openshift.com/container-platform/4.7/operators/understanding/olm-understanding-operatorhub.html
[Adding Operators to a cluster]: https://docs.openshift.com/container-platform/4.7/operators/admin/olm-adding-operators-to-cluster.html


### Release Channels

Whichever installation method you chose, there will now be an [OLM Subscription resource][] for cert-manager,
tracking the "stable" release channel. E.g.

```console
$ kubectl get subscription cert-manager -n operators -o yaml
...
spec:
  channel: stable
  installPlanApproval: Automatic
  name: cert-manager
...
status:
  currentCSV: cert-manager.v1.4.0
  state: AtLatestKnown
...
```

This means that OLM will discover new cert-manager releases in the stable channel,
and, depending on the Subscription settings it will upgrade cert-manager automatically,
when new releases become available.
Read [Manually Approving Upgrades via Subscriptions][] for information about automatic and manual upgrades.

[OLM Subscription resource]: https://olm.operatorframework.io/docs/concepts/crds/subscription/
[Manually Approving Upgrades via Subscriptions]: https://olm.operatorframework.io/docs/concepts/crds/subscription/#manually-approving-upgrades-via-subscriptions

NOTE: There is a single release channel called "stable" which will contain all cert-manager releases, shortly after they are released.
In future we may introduce other release channels with alternative release schedules,
in accordance with [OLM's Recommended Channel Naming][].

[OLM's Recommended Channel Naming]: https://olm.operatorframework.io/docs/best-practices/channel-naming/#recommended-channel-naming

## Configuring your first Issuer

Before you can begin issuing certificates, you must configure at least one
Issuer or `ClusterIssuer` resource in your cluster.

You should read the [configuration](../../configuration/) guide to
learn how to configure cert-manager to issue certificates from one of the
supported backends.

## Debugging installation issues

If you have any issues with your installation, please refer to the
[FAQ](../../faq/).
