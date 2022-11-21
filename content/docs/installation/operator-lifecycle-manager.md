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

> ⚠️ In cert-manager 1.10 the [secure computing (seccomp) profile](https://kubernetes.io/docs/tutorials/security/seccomp/) for all the Pods
> is set to `RuntimeDefault`.
> On some versions and configurations of OpenShift this can cause the Pod to be rejected by the
> [Security Context Constraints admission webhook](https://docs.openshift.com/container-platform/4.10/authentication/managing-security-context-constraints.html#admission_configuring-internal-oauth).
>
> 📖 Read the [Breaking Changes section in the 1.10 release notes](../release-notes/release-notes-1.10.md) before installing or upgrading.

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
  currentCSV: cert-manager.v1.7.1
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

## Configuration

The configuration options are quite limited when you install cert-manager using OLM.
There are a few Deployment settings which can be overridden permanently in the Subscription
and most other elements of the cert-manager manifests can be changed by editing the ClusterServiceVersion,
but changes to the ClusterServiceVersion are temporary and will be lost if OLM upgrades cert-manager,
because an upgrade results in a new ClusterServiceVersion resource.

### Configuration Via Subscription

When you create an OLM Subscription you can override **some** of the cert-manager Deployment settings,
but the options are quite limited.
The configuration which you add to the Subscription will be applied immediately to the current cert-manager Deployments.
It will also be re-applied if OLM upgrades cert-manager.

> 🔰 Read the [Configuring Operators deployed by OLM](https://github.com/operator-framework/operator-lifecycle-manager/blob/master/doc/design/subscription-config.md#configuring-operators-deployed-by-olm) design doc in the OLM repository.
>
> 🔰 Refer to the [Subscription API documentation](https://pkg.go.dev/github.com/operator-framework/api@v0.14.0/pkg/operators/v1alpha1#Subscription).

Here are some examples of configuration that can be achieved by modifying the Subscription resource.
In each case we assume that you are starting with the following [default Subscription from OperatorHub.io]((https://operatorhub.io/install/cert-manager.yaml)):

```yaml
# cert-manager.yaml
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: my-cert-manager
  namespace: operators
spec:
  channel: stable
  name: cert-manager
  source: operatorhubio-catalog
  sourceNamespace: olm
```

```bash
kubectl create -f https://operatorhub.io/install/cert-manager.yaml
```

#### Change the Resource Requests and Limits

It is possible to change the resource requests and limits by adding a `config` stanza to the Subscription:

```yaml
# resources-patch.yaml
spec:
  config:
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```


```bash
kubectl -n operators patch subscription my-cert-manager --type merge --patch-file resources-patch.yaml
```

You will see **all** the cert-manager Pods are restarted with the new resources:

```console
$ kubectl -n operators get pods -o "custom-columns=name:.metadata.name,mem:.spec.containers[*].resources"
name                                       mem
cert-manager-669867589c-n8dcn              map[limits:map[cpu:500m memory:128Mi] requests:map[cpu:250m memory:100Mi]]
cert-manager-cainjector-7b7fff8b9c-dxw6b   map[limits:map[cpu:500m memory:128Mi] requests:map[cpu:250m memory:100Mi]]
cert-manager-webhook-975bc87b5-tqdj4       map[limits:map[cpu:500m memory:128Mi] requests:map[cpu:250m memory:100Mi]]
```

> ⚠️ This configuration will apply to **all** the cert-manager Deployments.
> This is a known limitation of OLM which [does not support configuration of individual Deployments](https://github.com/operator-framework/operator-lifecycle-manager/issues/1794).

#### Change the NodeSelector

It is possible to change the `nodeSelector` for cert-manager Pods by adding the following stanza to the Subscription:

```yaml
# nodeselector-patch.yaml
spec:
  config:
    nodeSelector:
      kubernetes.io/arch: amd64
```

```bash
kubectl -n operators patch subscription my-cert-manager --type merge --patch-file nodeselector-patch.yaml
```

You will see **all** the cert-manager Pods are restarted with the new `nodeSelector`:

```console
$ kubectl -n operators get pods -o "custom-columns=name:.metadata.name,nodeselector:.spec.nodeSelector"
name                                      nodeselector
cert-manager-5b6b8f7d74-k7l94             map[kubernetes.io/arch:amd64 kubernetes.io/os:linux]
cert-manager-cainjector-b89cd6f46-kdkk2   map[kubernetes.io/arch:amd64 kubernetes.io/os:linux]
cert-manager-webhook-8464bc7cc8-64b4w     map[kubernetes.io/arch:amd64 kubernetes.io/os:linux]
```

> ⚠️ This configuration will apply to **all** the cert-manager Deployments.
> This is a known limitation of OLM which [does not support configuration of individual Deployments](https://github.com/operator-framework/operator-lifecycle-manager/issues/1794).

### Configuration Via ClusterServiceVersion (CSV)

The ClusterServiceVersion (CSV) resource contains the templates for all the cert-manager Deployments.
If you patch these templates, OLM will immediately roll out the changes to the Deployments.

> ⚠️ If OLM upgrades cert-manager your changes will be lost because it will create a new CSV with default Deployment templates.

Nevertheless, editing (patching) the CSV can be a useful way to override certain cert-manager settings. An example:

#### Change the log level of cert-manager components

The following JSON patch will append `-v=6` to command line arguments of the cert-manager controller-manager
(the first container of the first Deployment).

```bash
kubectl patch csv cert-manager.v1.10.1 \
  --type json \
  -p '[{"op": "add", "path": "/spec/install/spec/deployments/0/spec/template/spec/containers/0/args/-", "value": "-v=6" }]'
```

You will see the controller-manager Pod is restarted with the new arguments.

```console
$ kubectl  -n operators get pods -o "custom-columns=name:.metadata.name,args:.spec.containers[0].args"
name                                      args
cert-manager-797979cbdb-g444r             [-v=2 --cluster-resource-namespace=$(POD_NAMESPACE) --leader-election-namespace=kube-system -v=6]
...
```

> 🔰 Refer to the [ClusterServiceVersion API documentation](https://pkg.go.dev/github.com/operator-framework/api@v0.14.0/pkg/operators/v1alpha1#ClusterServiceVersion).

## Uninstall

Below is the processes for uninstalling cert-manager on OpenShift.

> ⚠️ To uninstall cert-manager you should always use the same process for
> installing but in reverse. Deviating from the following process can cause
> issues and potentially broken states. Please ensure you follow the below steps
> when uninstalling to prevent this happening.
