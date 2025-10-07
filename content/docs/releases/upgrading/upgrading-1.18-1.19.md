---
title: Upgrading from v1.18 to v1.19
description: 'cert-manager installation: Upgrading v1.18 to v1.19'
---

Before upgrading cert-manager from 1.18 to 1.19, please read the following important notes about breaking changes in

## Potentially Breaking: ACME metrics label changes

A high cardinality label, called `path`, was removed from the `certmanager_acme_client_request_count` and `certmanager_acme_client_request_duration_seconds` metrics.
It is replaced with a new bounded cardinality label called `action`.
If you are using these metrics, you may need to update your dashboards and alerts.

1. Update any dashboards and alerts that using the old `path` label, to use the new bounded `action` label.
2. If you rely on the high-cardinality `path` label, consider adding a Prometheus relabeling or recording rule to preserve the prior semantics (but beware of storage and cost).

## Next Steps

From here on, you can follow the [regular upgrade process](../../installation/upgrade.md).
