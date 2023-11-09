---
title: Continuous Deployment
description: Learn how to automate the installation of cert-manager using tools like Flux and Argo CD
---

Learn how to automate the installation of cert-manager using tools like Flux and Argo CD.

## Introduction

You can use [the cert-manager Helm chart](./helm.md) directly with tools like Flux, ArgoCD and Anthos,
and you can [output YAML using helm template](./helm.md#output-yaml) to generate customized cert-manager installation manifests,
which can be piped into your preferred deployment tool.

This page contains notes about how to install cert-manager with *some* of these tools.

> 📢 Please help us improve this page
> by contributing notes or short tutorials about using cert-manager with common GitOps and continuous deployment tools.

## Using the Flux Helm Controller

The cert-manager Helm chart can be installed by the [Flux Helm Controller](https://fluxcd.io/flux/components/helm/).

First create a [`HelmRepository` resource](https://fluxcd.io/flux/components/source/helmrepositories/),
configured with URL of the cert-manager Helm repository.
Then create a [`HelmRelease` resource](https://fluxcd.io/flux/components/helm/helmreleases/),
configured with your desired cert-manager chart values and release.

Here is an example which installs the latest patch version of the cert-manager 1.12 release,
and then upgrades to the latest patch version of the 1.13 release.

> ⚠️ This is a simple example which may not be suitable for production use.
> You should also refer to the [official Flux example repo](https://github.com/fluxcd/flux2-kustomize-helm-example),
> where cert-manager is now fully integrated.
> It shows how to deploy ClusterIssuer resources in the right order,
> after cert-manager CRDs and controller have been installed.

### Prerequisites

You'll need the [`flux` CLI](https://fluxcd.io/flux/cmd/)
and a Kubernetes cluster with [Flux installed](https://fluxcd.io/flux/installation/).

Here's how to quickly install Flux on a [Kind](https://kind.sigs.k8s.io/) cluster:

```bash
kind create cluster
flux check --pre
flux install
flux check
```

### Create a `HelmRepository` resource

```bash
flux create source helm cert-manager --url https://charts.jetstack.io
```

### Create a `HelmRelease` resource

Put your Helm chart values in a `values.yaml` file.
Use the `installCRDs` value, so that Flux can install and upgrade the CRD resources.

```yaml
# values.yaml
installCRDs: true
```

```bash
flux create helmrelease cert-manager \
  --chart cert-manager \
  --source HelmRepository/cert-manager.flux-system \
  --release-name cert-manager \
  --target-namespace cert-manager \
  --create-target-namespace \
  --values values.yaml \
  --chart-version 1.12.x
```

### Updates and Upgrades

And when you want to upgrade to the cert-manager 1.13 release,
you can simply update the partial semantic version in the chart version:

```bash
flux create helmrelease cert-manager \
  --chart cert-manager \
  --source HelmRepository/cert-manager.flux-system \
  --release-name cert-manager \
  --target-namespace cert-manager \
  --create-target-namespace \
  --values values.yaml \
  --chart-version 1.13.x
```

### Troubleshooting

Check Flux events and logs for warnings and errors:

```bash
flux events
flux logs
```

Use `cmctl` to check for problems with the cert-manager webhook or CRDs:

```bash
cmctl check api
cmctl version -o yaml
```

Check the cert-manager logs for warnings and errors:

```bash
kubectl logs -n cert-manager -l app.kubernetes.io/instance=cert-manager --prefix --all-containers
```
