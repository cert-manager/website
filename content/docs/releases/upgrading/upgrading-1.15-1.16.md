---
title: Upgrading from v1.15 to v1.16
description: 'cert-manager installation: Upgrading v1.15 to v1.16'
---

Before upgrading cert-manager from 1.15 to 1.16 please read the following important notes about breaking changes in 1.16:

1. Helm schema validation may reject your existing Helm values files if they contain typos or unrecognized fields.
   For more details, refer to the [Helm](../release-notes/release-notes-1.16.md#helm) section in the release notes.
1. Venafi Issuer may fail to renew certificates if the requested duration conflicts with the CA’s minimum or maximum policy settings in Venafi.
   For more details, refer to the [Venafi Issuer](../release-notes/release-notes-1.16.md#venafi-issuer) section in the release notes.
1. Venafi Issuer may fail to renew Certificates if the issuer has been configured for TPP with username-password authentication.
   For more details, refer to the [Venafi Issuer](../release-notes/release-notes-1.16.md#venafi-issuer) section in the release notes.

## Next Steps

From here on you can follow the [regular upgrade process](../../installation/upgrade.md).
