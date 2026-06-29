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

2. The `cert-manager-edit` aggregate ClusterRole no longer grants `create` for
   `challenges.acme.cert-manager.io` or `create`, `patch`, `update` for
   `orders.acme.cert-manager.io`. This fixes a security issue
   ([`GHSA-8rvj-mm4h-c258`](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258))
   where these permissions allowed namespace users to bypass Issuer solver
   selectors and abuse ClusterIssuer credentials.

   This change was already shipped in patch releases v1.20.3 and v1.19.6, so
   if you are already running one of those versions this will not be a breaking
   change.

   These resources are internal to cert-manager's ACME workflow and are not
   intended to be created or modified directly by users. If you have tooling or
   workflows that create Challenge or Order resources directly (outside of the
   normal Certificate → CertificateRequest → Order → Challenge flow), you will
   need to grant those permissions explicitly.

   > 📖 Read [Release 1.21 notes](../release-notes/release-notes-1.21.md) for
   > more information.

3. The Helm values `prometheus.servicemonitor.targetPort`,
   `prometheus.servicemonitor.path`, and `prometheus.podmonitor.path` have been
   removed. The metrics path (`/metrics`) and target port name (`http-metrics`)
   are now hardcoded.

   The controller Service metrics port has also been renamed from
   `tcp-prometheus-servicemonitor` to `http-metrics`.

   Because the Helm values schema uses `additionalProperties: false`, you must
   remove these keys from your values overrides before upgrading, or `helm
   upgrade` will fail with a schema validation error.

   If you have custom Prometheus scrape configurations that reference the old
   Service port name `tcp-prometheus-servicemonitor`, update them to use
   `http-metrics`.

   > 📖 Read [Release 1.21 notes](../release-notes/release-notes-1.21.md) for
   > more information.

## Next Steps

From here on, you can follow the [regular upgrade process](../../installation/upgrade.md).
