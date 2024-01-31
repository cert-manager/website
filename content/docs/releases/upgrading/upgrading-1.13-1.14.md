---
title: Upgrading from v1.13 to v1.14
description: 'cert-manager installation: Upgrading v1.13 to v1.14'
---

When upgrading cert-manager from 1.13 to 1.14, in few cases you might need to take additional steps to ensure a smooth upgrade.

## New startupapicheck image

The startupapicheck job uses a new OCI image called [startupapicheck](../../cli/startupapicheck.md), instead of the [ctl](../../cli/cmctl.md) image.
If you run in an environment in which images cannot be pulled, be sure to include the new image.

## Next Steps

From here on you can follow the [regular upgrade process](../../installation/upgrade.md).
