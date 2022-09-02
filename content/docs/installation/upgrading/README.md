---
title: Upgrading
description: 'cert-manager installation: Upgrading cert-manager overview'
---

This section contains information on upgrading cert-manager.
It also contains documents detailing breaking changes between cert-manager
versions, and information on things to look out for when upgrading.

> Note: Before performing upgrades of cert-manager, it is advised to take a
> backup of all your cert-manager resources just in case an issue occurs whilst
> upgrading. You can read how to backup and restore cert-manager in the [backup
> and restore](../../tutorials/backup.md) guide.

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
helm repo add jetstack https://charts.jetstack.io
helm repo update jetstack
```

The helm upgrade command will upgrade cert-manager to the specified or latest version of cert-manager, as listed on the
[cert-manager Helm chart documentation page](https://artifacthub.io/packages/helm/cert-manager/cert-manager).

> Note: You can find out your release name using `helm list | grep cert-manager`.

### CRDs managed separately

If you have installed the CRDs separately (instead of with the `--set installCRDs=true`
option added to your Helm install command), you should upgrade your CRD resources first:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/<version>/cert-manager.crds.yaml
```

And then upgrade the Helm chart:

```bash
helm upgrade --version <version> <release_name> jetstack/cert-manager
```

### CRDs managed using helm

If you have installed the CRDs together with the helm install command, you should
include CRD resources when upgrading the Helm chart:

```bash
helm upgrade --set installCRDs=true --version <version> <release_name> jetstack/cert-manager
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

Once you have deployed the new version of cert-manager, you can [verify](../verify.md) the installation.

## Reinstalling cert-manager

In some cases there may be a need to do a full uninstall and re-install of
cert-manager. An example could be when a very old cert-manager version needs to
be brought up to date and it isn't feasible to upgrade one minor version at a
time, which is our default recommended upgrade strategy.

If cert-manager `CustomResourceDefinition`s are also uninstalled, this will mean
loss of associated cert-manager custom resources such as `Certificate`s. The
main concern associated with this is application downtime and unnecessary
certificate reissuance, that could happen if `Secret`s with the X.509
certificates get deleted. You can use [`--enable-certificate-owner-ref`
flag](https://cert-manager.io/docs/cli/controller/)
on the cert-manager controller to configure whether the `Secret`s should be deleted.
If this flag is set to true, each `Secret` will have an owner reference to the
`Certificate` for which it was created and when the `Certificate` is deleted,
the `Secret` will be garbage collected. The default value for this flag is
false. If the `Certificate`s get deleted and re-applied, but the `Secret`s remain
in the cluster, the newly applied `Certificate`s should be able to pick up the
same `Secret`s and should not unnecessarily reissue the X.509 certs.

When uninstalling and re-installing in order to upgrade, you should still read
through the release notes for each skipped version.

Some things to look out for when considering uninstalling and re-installing
cert-manager _including the CRDs_:

- Is `--enable-certificate-owner-ref` flag currently set to true or could it have been set to true at some point previously? Due to an earlier bug, the owner reference that gets added to `Secret`s is _not_ removed when the value of `--enable-certificate-owner-ref` is changed from true to false, see [`cert-manager#4788`](https://github.com/cert-manager/cert-manager/issues/4788)
- Are there currently any certificate issuances in progress? If so, with the custom resources deleted, the progress will be lost. This could potentially cause duplicated issuances.
- Is there a need to convert cert-manager custom resource manifests to v1 API? You can use [`cmctl convert` command](../../reference/cmctl.md#convert) to do that.
