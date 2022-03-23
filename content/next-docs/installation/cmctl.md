---
title: cmctl
description: 'cert-manager installation: cmctl'
---

## Installing using cmctl

### Prerequisites

- [Install the cert-manager CLI cmctl](../usage/cmctl.md#installation).
- Install a [supported version of Kubernetes or OpenShift](./supported-releases.md).
- Read [Compatibility with Kubernetes Platform Providers](./compatibility.md) if you are using Kubernetes on a cloud platform.

### Steps

The CLI provides the simplest way of installing cert-manager:
```bash
$ cmctl x install
```
The command makes sure that the required `CustomResourceDefinitions` are installed together with the cert-manager, cainjector and webhook components.
Under the hood, a procedure similar to the [Helm install procedure](./helm.md#steps) is used.

You can also use `cmctl x install` to customize the installation of cert-manager.

The example below shows how to tune the cert-manager installation by overwriting the default Helm values:

```bash
$ cmctl x install \
    --set prometheus.enabled=false \  # Example: disabling prometheus using a Helm parameter
    --set webhook.timeoutSeconds=4s   # Example: changing the wehbook timeout using a Helm parameter
```
You can find [a full list of the install parameters on cert-manager's ArtifactHub page](https://artifacthub.io/packages/helm/cert-manager/cert-manager#configuration). These are the same parameters that are available when using the Helm chart.
Once you have deployed cert-manager, you can [verify](./verify.md) the installation.

### Output YAML

The CLI also allows the user to output the templated manifest to `stdout`, instead of installing the manifest on the cluster.
```bash
$ cmctl x install --dry-run > cert-manager.custom.yaml
```