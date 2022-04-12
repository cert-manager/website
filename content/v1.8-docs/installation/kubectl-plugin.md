---
title: Kubectl plugin
description: 'cert-manger installation: Using kubectl'
---

## Installing using the kubectl plugin

### Prerequisites

- [Install the kubectl cert-manager plugin](../usage/kubectl-plugin.md#installation).
- Install a [supported version of Kubernetes or OpenShift](../../installation/supported-releases/).
- Read [Compatibility with Kubernetes Platform Providers](./compatibility.md) if you are using Kubernetes on a cloud platform.

### Steps

The plugin provides the simplest way of installing cert-manager:
```bash
$ kubectl cert-manager x install
```
The command makes sure that the required `CustomResourceDefinitions` are installed together with the cert-manager, cainjector and webhook components.
Under the hood, a procedure similar to the [Helm install procedure](./helm.md#steps) is used.

You can also use `kubectl cert-manager x install` to customize the installation of cert-manager.

The example below shows how to tune the cert-manager installation by overwriting the default Helm values:

```bash
$ kubectl cert-manager x install \
    --set prometheus.enabled=false \  # Example: disabling prometheus using a Helm parameter
    --set webhook.timeoutSeconds=4s   # Example: changing the wehbook timeout using a Helm parameter
```
You can find [a full list of the install parameters on cert-manager's ArtifactHub page](https://artifacthub.io/packages/helm/cert-manager/cert-manager#configuration). These are the same parameters that are available when using the Helm chart.
Once you have deployed cert-manager, you can [verify](./verify.md) the installation.

### Output YAML

The kubectl plugin also allows the user to output the templated manifest to `stdout`, instead of installing the manifest on the cluster.
```bash
$ kubectl cert-manager x install \
    --dry-run \
    > cert-manager.custom.yaml
```