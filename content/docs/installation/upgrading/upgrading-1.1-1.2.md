---
title: Upgrading from v1.1 to v1.2
description: 'cert-manager installation: Upgrading v1.1 to v1.2'
---

In an effort to introduce new features whilst keeping the project maintainable,
cert-manager now only supports Kubernetes down to version `v1.16`. This means
the `legacy` manifests have now been removed. Some users experience issues when
upgrading the legacy `CRD`s to `v1.2`. To solve this, you could replace the `CRD`s:
1. Backup `cert-manager` resources as described in [the docs](../../tutorials/backup.md)
2. Run `kubectl replace -f https://github.com/cert-manager/cert-manager/releases/download/v1.2.0/cert-manager.crds.yaml` to replace the CRDs.
3. Follow the standard upgrade process.
You can read more about supported Kubernetes versions
   [here](../supported-releases.md).

In this release some features have been deprecated.  Please read the [version
1.2 release notes](../../release-notes/release-notes-1.2.md) for more details
and consider whether you are using any of these deprecated features before you
proceed with the upgrade.

From here on you can follow the [regular upgrade process](./README.md).