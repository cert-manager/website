---
title: Upgrading from v1.12
description: 'cert-manager installation: Upgrading v1.12'
---

cert-manager v1.12 is a Long Term Support (LTS) release sponsored by [Venafi, a CyberArk company](https://venafi.com/). As an LTS release, v1.12 will be supported past the end-of-life
of cert-manager v1.13, v1.14 and v1.15.

To support users upgrading from v1.12 to a more modern version, this guide includes three sections:

1. An initial section which must be read and followed before any kind of upgrade.

2. Details on how to upgrade to a more modern version - cert-manager v1.17. This allows users to skip the usual cert-manager advice of "upgrading through the versions" and go directly from `v1.12.x` to `v1.17.y`. Further upgrades beyond cert-manager v1.17 should use the usual "upgrade through the versions" advice.

3. Details on a more traditional upgrade path, to upgrade from v1.12 to v1.13. Since v1.13 is already at end-of-life, users should not stay on cert-manager v1.13 and should proceed to continue upgrading until they reach a supported version.

## Before any upgrades

### Run the latest release of cert-manager v1.12

**IMPORTANT:** Before upgrading to any newer version, ensure you're running the latest v1.12 release. Otherwise, some certificates may be unexpectedly re-issued (see [this comment](https://github.com/cert-manager/cert-manager/issues/6494#issuecomment-1816112309)).

### Other Upgrade Information

Whether upgrading to v1.13 or to v1.17, you can follow the [regular upgrade process](../../installation/upgrade.md) once you've checked the notes in the relevant section below.

## Upgrading from v1.12 to v1.17

You should read all of the below information and check your environment. Most upgrades from v1.12 to v1.17 are simple but in some scenarios you may need to make some changes.

You should upgrade directly to the latest available v1.17 patch release.

1. If you run in an environment which tightly restricts which images can be pulled or if you've made manual changes to the `ctl` image in your deployment, be aware that the `ctl` image has changed a `startupapicheck` image. Ensure that the new image can be pulled in your environment. The `ctl` image is no longer available.

2. cert-manager v1.16 adds Helm schema validation, which will reject invalid Helm values. Be prepared to fix any invalid Helm values during the upgrade. For more information, check the [Helm](../release-notes/release-notes-1.16.md#helm) section of the v1.16 release notes.

3. If you set the `.featureGates` Helm value, be aware that this field no longer affects the webhook in newer versions. This could be an issue if you're relying on a webhook feature gate in cert-manager v1.12. Most users will be unaffected by this change; if you're concerned, check the note in the "Upgrading from v1.12 to v1.13" section below.

4. If you rely on GatewayAPI support in v1.12, note that it was promoted to Beta and as a side effect was put behind a flag. You'll need to pass the `--enable-gateway-api` flag to enable it.

5. Upgrades to the in-tree Venafi issuer mean that some certificate renewals may fail if Venafi configuration values are incorrect. If you use the Venafi issuer, check the [Venafi Issuer](../release-notes/release-notes-1.16.md#venafi-issuer) section of the v1.16 release notes.

6. In cert-manager v1.13, webhook validation of CertificateRequest resources became stricter: all `KeyUsages` and `ExtendedKeyUsages` must be defined directly in the CertificateRequest resource and the encoded CSR can never contain more usages than defined in the Kubernetes resource. See [`#6182`](https://github.com/cert-manager/cert-manager/pull/6182) for more information. Most users are unaffected by this change.

7. cert-manager v1.17 changed the signature algorithms used for RSA certificates such that 3072-bit RSA keys use SHA-384 and 4096-bit RSA keys use SHA-512. Previous versions of cert-manager used SHA-256 for all RSA signatures.

## Upgrading from v1.12 to v1.13

When upgrading cert-manager from 1.12 to 1.13, in few cases you might need to take additional steps to ensure a smooth upgrade:

1. If you deploy cert-manager using helm and have `.featureGates` value set, the features defined
there will no longer be passed to cert-manager webhook, only to cert-manager controller. Use `webhook.featureGates` field
instead to define features to be enabled on webhook. (https://github.com/cert-manager/cert-manager/pull/6093, https://github.com/irbekrm)

2. If you were, for some reason, passing cert-manager controller's features to webhook's --feature-gates flag,
this will now break (unless the webhook actually has a feature by that name). (https://github.com/cert-manager/cert-manager/pull/6093, https://github.com/irbekrm)

3. Webhook validation of CertificateRequest resources is stricter now: all `KeyUsages` and `ExtendedKeyUsages` must be defined directly in the CertificateRequest resource, the encoded CSR can never contain more usages than defined in the Kubernetes resource. See [`#6182`](https://github.com/cert-manager/cert-manager/pull/6182) for more information.
