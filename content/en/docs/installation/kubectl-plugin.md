---
title: "Kubectl plugin"
linkTitle: "Kubectl plugin"
weight: 21
type: "docs"
---

## Installing using the kubectl plugin

### Prerequisites

- **Have the [cert-manager kubectl plugin installed](../../usage/kubectl-plugin/#installation)**
- A Kubernetes or OpenShift cluster running a [supported version](../supported-releases/)
- cert-manager not already installed on the cluster
- [Prerequisites specific to your cloud provider](../compatibility/)

### Steps

The plugin provides the simplest way of installing cert-manager:
```bash
$ kubectl cert-manager x install
```
The command makes sure that the required `CustomResourceDefinitions` are installed together with the cert-manager, cainjector and webhook components.
Under the hood, a procedure similar to the [Helm install procedure](../helm/#steps) is used.

All Helm templating parameters can also be used with the kubectl plugin.
On the [cert-manager's ArtifactHub page](https://artifacthub.io/packages/helm/cert-manager/cert-manager) a full list of the available **Helm values** can be found.

The example below shows how to tune the cert-manager installation by overwriting the default Helm values:

```bash
$ kubectl cert-manager x install \
    --set prometheus.enabled=false \  # Example: disabling prometheus using a Helm parameter
    --set webhook.timeoutSeconds=4s   # Example: changing the wehbook timeout using a Helm parameter
```

Once you have deployed cert-manager, you can [verify](../verify/) the installation.

### Output YAML

The kubectl plugin also allows the user to output the templated manifest to `stdout`, instead of installing the manifest on the cluster.
```bash
$ kubectl cert-manager x install \
    --dry-run \
    > cert-manager.custom.yaml
```
