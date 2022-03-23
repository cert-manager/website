---
title: Operator Lifecycle Manager
description: 'cert-manager installation: Using OLM'
---

## Installation managed by OLM

### Prerequisites

- Install a [supported version of Kubernetes or OpenShift](./supported-releases.md).
- Read [Compatibility with Kubernetes Platform Providers](./compatibility.md) if you are using Kubernetes on a cloud platform.

### Option 1: Installing from OperatorHub Web Console on OpenShift

cert-manager is in the [Red Hat-provided Operator catalog][] called "community-operators".
On OpenShift 4 you can install cert-manager from the [OperatorHub web console][] or from the command line.
These installation methods are described in Red Hat's [Adding Operators to a cluster][] documentation.

[Red Hat-provided Operator catalog]: https://docs.openshift.com/container-platform/4.7/operators/understanding/olm-rh-catalogs.html#olm-rh-catalogs_olm-rh-catalogs
[OperatorHub web console]: https://docs.openshift.com/container-platform/4.7/operators/understanding/olm-understanding-operatorhub.html
[Adding Operators to a cluster]: https://docs.openshift.com/container-platform/4.7/operators/admin/olm-adding-operators-to-cluster.html


### Option 2: Installing from OperatorHub.io

Browse to the [cert-manager page on OperatorHub.io](https://operatorhub.io/operator/cert-manager),
click the "Install" button and follow the installation instructions.

### Option 3: Manual install via `kubectl operator` plugin

[Install OLM][] and [install the `kubectl operator` plugin][]
from the [Krew Kubectl plugins index][] and then use that to install the cert-manager as follows:

```sh
operator-sdk olm install
kubectl krew install operator
kubectl operator install cert-manager -n operators --channel stable --approval Automatic
```

You can monitor the progress of the installation as follows:

```sh
kubectl get events -w -n operators
```

And you can see the status of the installation with:

```sh
kubectl operator list
```

[install OLM]: https://sdk.operatorframework.io/docs/installation/
[install the `kubectl operator` plugin]: https://github.com/operator-framework/kubectl-operator#install
[Krew Kubectl plugins index]: https://krew.sigs.k8s.io/plugins/#:~:text=cert-manager

## Release Channels

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
  currentCSV: cert-manager.v1.5.5
  state: AtLatestKnown
...
```

This means that OLM will discover new cert-manager releases in the stable channel,
and, depending on the Subscription settings it will upgrade cert-manager automatically,
when new releases become available.
Read [Manually Approving Upgrades via Subscriptions][] for information about automatic and manual upgrades.

[OLM Subscription resource]: https://olm.operatorframework.io/docs/concepts/crds/subscription/
[Manually Approving Upgrades via Subscriptions]: https://olm.operatorframework.io/docs/concepts/crds/subscription/#manually-approving-upgrades-via-subscriptions

**NOTE:** There is a single release channel called "stable" which will contain all cert-manager releases, shortly after they are released.
In future we may introduce other release channels with alternative release schedules,
in accordance with [OLM's Recommended Channel Naming][].

[OLM's Recommended Channel Naming]: https://olm.operatorframework.io/docs/best-practices/channel-naming/#recommended-channel-naming

## Debugging installation issues

If you have any issues with your installation, please refer to the
[FAQ](../faq/README.md).

Below is the processes for uninstalling cert-manager on OpenShift.

> **Warning**: To uninstall cert-manger you should always use the same process for
> installing but in reverse. Deviating from the following process can cause
> issues and potentially broken states. Please ensure you follow the below steps
> when uninstalling to prevent this happening.