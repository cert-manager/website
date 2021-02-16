---
title: "Upgrading"
linkTitle: "Upgrading"
weight: 20
type: "docs"
---

This section contains information on upgrading cert-manager.
It also contains documents detailing breaking changes between cert-manager
versions, and information on things to look out for when upgrading.

> Note: Before performing upgrades of cert-manager, it is advised to take a
> backup of all your cert-manager resources just in case an issue occurs whilst
> upgrading. You can read how to backup and restore cert-manager in the [backup
> and restore](../../tutorials/backup/) guide.

## Upgrading with Helm

If you installed cert-manager using Helm, you can easily upgrade using the Helm
CLI.

> Note: Before upgrading, please read the relevant instructions at the links
> below for your from and to version.

Once you have read the relevant upgrading notes and taken any appropriate
actions, you can begin the upgrade process like so - replacing `<release_name>`
with the name of your Helm release for cert-manager (usually this is
`cert-manager`) and replacing `<version>` with the version number you want to
install:

If you have installed the CRDs manually instead of with the `--set installCRDs=true`
option added to your Helm install command, you should upgrade your CRD resources
before upgrading the Helm chart:

```bash
# Kubernetes 1.15+
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.1.1/cert-manager.crds.yaml

# Kubernetes <1.15
$ kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.1.1/cert-manager-legacy.crds.yaml
```

Add the Jetstack Helm repository if you haven't already.

```bash
$ helm repo add jetstack https://charts.jetstack.io
```

## Ensure the local Helm chart repository cache is up to date

```bash
$ helm repo update
$ helm upgrade --version <version> <release_name> jetstack/cert-manager
```

This will upgrade you to the latest version of cert-manager, as listed in the
[Jetstack Helm chart repository](https://hub.helm.sh/charts/jetstack).

> Note: You can find out your release name using `helm list | grep
> cert-manager`.

## Upgrading using static manifests

If you installed cert-manager using the static deployment manifests published
on each release, you can upgrade them in a similar way to how you first
installed them.

> Note: Before upgrading, please read the relevant instructions at the links
> below Note: for your from and to version.

Once you have read the relevant notes and taken any appropriate actions, you can
begin the upgrade process like so - replacing `<version>` with the version
number you want to install:

```bash
# Kubernetes 1.15+
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.1.1/cert-manager.yaml

# Kubernetes <1.15
$ kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.1.1/cert-manager-legacy.yaml
```
