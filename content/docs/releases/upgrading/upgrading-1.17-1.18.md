---
title: Upgrading from v1.17 to v1.18
description: 'cert-manager installation: Upgrading v1.17 to v1.18'
---

Before upgrading cert-manager from 1.17 to 1.18, please read the following important notes about breaking changes in 1.18:

1. We have changed the default value of `Certificate.Spec.PrivateKey.RotationPolicy` from `Never` to `Always`.

   > 📖 Read [Release 1.18 notes](../release-notes/release-notes-1.18.md) for more information..

## Next Steps

From here on, you can follow the [regular upgrade process](../../installation/upgrade.md).
