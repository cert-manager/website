---
title: Upgrading cert-manager
description: 'cert-manager installation: Upgrading cert-manager overview'
---

In the [releases section](../releases/README.md) of the documentation, you can find the release notes
and upgrade instructions for each release of cert-manager. It also contains
information on the breaking changes between each release and things to look out
for when upgrading.

> Note: Before performing upgrades of cert-manager, it is advised to take a
> backup of all your cert-manager resources just in case an issue occurs whilst
> upgrading. You can read how to backup and restore cert-manager in the [backup
> and restore](../devops-tips/backup.md) guide.

We recommend that you upgrade cert-manager one minor version at a time, always
choosing the latest patch version for the minor version. You should always read
the release notes for the minor version to which you are upgrading. In cases
where a large version jump is needed to get an installation up to date, it may
be possible to do a full uninstall and re-install of cert-manager without application
downtime and/or unnecessary re-issuances, however we do not guarantee that this will
work for your particular setup see [Reinstalling cert-manager](#reinstalling-cert-manager).

## Upgrading with Helm

If you installed cert-manager using Helm, you can easily upgrade using the Helm
CLI.

> Note: Before upgrading, please read the relevant instructions at the links
> below for your from and to version.

Once you have read the relevant upgrading notes and taken any appropriate
actions, you can begin the upgrade process like so - replacing `<release_name>`
with the name of your Helm release for cert-manager (usually this is
`cert-manager`) and replacing `<version>` with the version number you want to
install.

Add the Jetstack Helm repository (if you haven't already) and update it.

```bash
helm repo add jetstack https://charts.jetstack.io --force-update
```

The helm upgrade command will upgrade cert-manager to the specified or latest version of cert-manager, as listed on the
[cert-manager Helm chart documentation page](https://artifacthub.io/packages/helm/cert-manager/cert-manager).

> Note: You can find out your release name using `helm list | grep cert-manager`.

### CRDs managed using helm

If you have installed the CRDs together with the helm install command (using `--set crds.enabled=true`),
Helm will upgrade the CRDs automatically when you upgrade the cert-manager Helm chart:

```bash
helm upgrade --reset-then-reuse-values --version <version> <release_name> jetstack/cert-manager
```

### CRDs managed separately

If you have installed the CRDs separately (instead of with the `--set crds.enabled=true`
option added to your Helm install command), you should upgrade your CRD resources first:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/<version>/cert-manager.crds.yaml
```

And then upgrade the Helm chart:

```bash
helm upgrade --reset-then-reuse-values --version <version> <release_name> jetstack/cert-manager
```

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
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/<version>/cert-manager.yaml
```

Once you have deployed the new version of cert-manager, you can [verify](kubectl.md#verify) the installation.

## Reinstalling cert-manager

In some cases there may be a need to do a full uninstall and re-install of
cert-manager. An example could be when a very old cert-manager version needs to
be brought up to date and it isn't feasible to upgrade one minor version at a
time, which is our default recommended upgrade strategy.

See [Reinstalling cert-manager](reinstall.md) for a full guide on how to do this without any issues.
