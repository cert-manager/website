---
title: Reinstalling cert-manager
description: 'cert-manager installation: Reinstalling cert-manager overview'
---

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
- Is there a need to convert cert-manager custom resource manifests to v1 API? You can use [`cmctl convert` command](../reference/cmctl.md#convert) to do that.
