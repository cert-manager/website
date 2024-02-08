---
title: Upgrading from v1.13 to v1.14
description: 'cert-manager installation: Upgrading v1.13 to v1.14'
---

Before upgrading cert-manager from 1.13 to 1.14 please read the following important notes about breaking changes in 1.14:

## Please install the latest patch release: `v1.14.2`

The following bugs were found in `v1.14.1` and have been fixed in `v1.14.2`:

- cert-manager CA and SelfSigned issuers incorrectly copied the critical flag from the CSR instead of re-calculating that field themselves

The following bugs were found during the release of `v1.14.0` and have been fixed in `v1.14.1`:

- During the release of `v1.14.0`, the Helm chart was found to use the wrong OCI image for the `cainjector` Deployment,
  which caused the Helm installation to fail.
- A bug in cmctl namespace detection prevents it being used as a startupapicheck image in namespaces other than cert-manager.
- A bug in cmctl causes `cmctl experimental install` to panic.

Read the  [`v1.14.2` release notes](../release-notes/release-notes-1.14.md#v1.14.2) and [`v1.14.1` release notes](../release-notes/release-notes-1.14.md#v1.14.1) for more information.

## New startupapicheck image

The startupapicheck job uses a new OCI image called [startupapicheck](../../cli/startupapicheck.md), instead of the [ctl](../../cli/cmctl.md) image.
If you run in an environment in which images cannot be pulled, be sure to include the new image.

## Next Steps

From here on you can follow the [regular upgrade process](../../installation/upgrade.md).
