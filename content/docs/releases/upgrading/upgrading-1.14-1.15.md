---
title: Upgrading from v1.14 to v1.15
description: 'cert-manager installation: Upgrading v1.14 to v1.15'
---

Before upgrading cert-manager from 1.14 to 1.15 please read the following important notes about breaking changes in 1.15:

## GatewayAPI promotion to beta

GatewayAPI support has been promoted to beta, and thus the feature flag `ExperimentalGatewayAPISupport` is now enabled by default. 

If you had previously enabled this feature flag you will now need to pass the flag `--enable-gateway-api` instead. This is because while the feature is now enabled by default, we still need to gate it behind a flag so cert-manager will not crash if the GatewayAPI CRDs are not installed.

## Next Steps

From here on you can follow the [regular upgrade process](../../installation/upgrade.md).
