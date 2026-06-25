---
title: Upgrading from v1.18 to v1.19
description: 'cert-manager installation: Upgrading v1.18 to v1.19'
---

Before upgrading cert-manager from 1.18 to 1.19, please read the following important notes about breaking changes:

## Use the latest patch version: `[[VAR::cert_manager_latest_version]]`

When upgrading to cert-manager `1.19`, use the latest patch version: `[[VAR::cert_manager_latest_version]]`.
Do not install `v1.19.0`, because it has a bug which may cause certificates to be re-issued unnecessarily.
We fixed the bug in `v1.19.1`.

## Potentially Breaking: ACME metrics label changes

A high cardinality label, called `path`, was removed from the `certmanager_acme_client_request_count` and `certmanager_acme_client_request_duration_seconds` metrics.
It is replaced with a new bounded cardinality label called `action`.
If you are using these metrics, you may need to update your dashboards and alerts.

1. Update any dashboards and alerts that using the old `path` label, to use the new bounded `action` label.
2. If you rely on the high-cardinality `path` label, consider adding a Prometheus relabeling or recording rule to preserve the prior semantics (but beware of storage and cost).

## Potentially Breaking: Challenge and Order RBAC restricted in `cert-manager-edit` ClusterRole

Starting in v1.19.6, the `cert-manager-edit` aggregate ClusterRole no longer grants `create` for `challenges.acme.cert-manager.io` or `create`, `patch`, `update` for `orders.acme.cert-manager.io`. This fixes a security issue ([`GHSA-8rvj-mm4h-c258`](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258)) where these permissions allowed namespace users to bypass Issuer solver selectors and abuse ClusterIssuer credentials.

These resources are internal to cert-manager's ACME workflow and are not intended to be created or modified directly by users. If you have tooling or workflows that create Challenge or Order resources directly (outside of the normal Certificate → CertificateRequest → Order → Challenge flow), you will need to grant those permissions explicitly.

## Next Steps

From here on, you can follow the [regular upgrade process](../../installation/upgrade.md).
