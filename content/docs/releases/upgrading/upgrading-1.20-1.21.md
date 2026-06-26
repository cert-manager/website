---
title: Upgrading from v1.20 to v1.21
description: 'cert-manager installation: Upgrading v1.20 to v1.21'
---

Before upgrading cert-manager from 1.20 to 1.21, please read the following important notes about breaking changes in 1.21:

1. The Helm chart no longer creates a default `Role` and `RoleBinding` granting
   the cert-manager controller permission to create tokens for its own
   ServiceAccount (`serviceaccounts/token: create`).

   This RBAC was added in v1.16 but no documented workflow requires it. If you
   use `serviceAccountRef.name` pointing at the controller ServiceAccount
   (e.g. for Vault Kubernetes auth or Route53), you must now either:
   - create your own `Role` and `RoleBinding` granting
     `serviceaccounts/token: create` on that ServiceAccount, or
   - migrate to a dedicated ServiceAccount with its own RBAC (recommended —
     see the [Vault](../../configuration/vault.md) or
     [Route53](../../configuration/acme/dns01/route53.md) documentation).

   > 📖 Read [Release 1.21 notes](../release-notes/release-notes-1.21.md) for
   > more information.

## Next Steps

From here on, you can follow the [regular upgrade process](../../installation/upgrade.md).
