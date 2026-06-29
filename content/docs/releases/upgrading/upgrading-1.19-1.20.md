---
title: Upgrading from v1.19 to v1.20
description: 'cert-manager installation: Upgrading v1.19 to v1.20'
---

## Potentially Breaking: Challenge and Order RBAC restricted in `cert-manager-edit` ClusterRole

Starting in v1.20.3, the `cert-manager-edit` aggregate ClusterRole no longer grants `create` for `challenges.acme.cert-manager.io` or `create`, `patch`, `update` for `orders.acme.cert-manager.io`. This fixes a security issue ([`GHSA-8rvj-mm4h-c258`](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258)) where these permissions allowed namespace users to bypass Issuer solver selectors and abuse ClusterIssuer credentials.

These resources are internal to cert-manager's ACME workflow and are not intended to be created or modified directly by users. If you have tooling or workflows that create Challenge or Order resources directly (outside of the normal Certificate → CertificateRequest → Order → Challenge flow), you will need to grant those permissions explicitly.

## Next Steps

From here on, you can follow the [regular upgrade process](../../installation/upgrade.md).
