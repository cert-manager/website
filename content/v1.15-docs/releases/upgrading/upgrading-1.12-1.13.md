---
title: Upgrading from v1.12 to v1.13
description: 'cert-manager installation: Upgrading v1.12 to v1.13'
---

When upgrading cert-manager from 1.12 to 1.13, in few cases you might need to take additional steps to ensure a smooth upgrade:

1. **IMPORTANT NOTE**: If upgrading from a version below v1.12, upgrade to the latest v1.12 release before upgrading to v1.13. Otherwise, some certificates may be unexpectedly re-issued (see https://github.com/cert-manager/cert-manager/issues/6494#issuecomment-1816112309)

2. BREAKING: If you deploy cert-manager using helm and have `.featureGates` value set, the features defined
there will no longer be passed to cert-manager webhook, only to cert-manager controller. Use `webhook.featureGates` field
instead to define features to be enabled on webhook. (https://github.com/cert-manager/cert-manager/pull/6093, https://github.com/irbekrm)

3. Potentially breaking: If you were, for some reason, passing cert-manager controller's features to webhook's --feature-gates flag,
this will now break (unless the webhook actually has a feature by that name). (https://github.com/cert-manager/cert-manager/pull/6093, https://github.com/irbekrm)

4. Potentially breaking: Webhook validation of CertificateRequest resources is stricter now: all `KeyUsages` and `ExtendedKeyUsages` must be defined directly in the CertificateRequest resource, the encoded CSR can never contain more usages that defined there. (https://github.com/cert-manager/cert-manager/pull/6182, https://github.com/inteon)

## Next Steps

From here on you can follow the [regular upgrade process](../../installation/upgrade.md).
