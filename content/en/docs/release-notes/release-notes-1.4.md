---
title: "Release Notes"
linkTitle: "v1.4"
weight: 800
type: "docs"
---

Special thanks to the external contributors who contributed to this release:

* [@andreas-p](https://github.com/andreas-p)

# Deprecated Features and Breaking Changes

## Certificate renewal period calculation

There have been slight changes in the renewal period calculation for
certificates. Renewal time (`rt`) is now calculated using formula `rt = notAfter -
rb` where `rb = min(renewBefore, cert duration / 3)`. (See [docs](/docs/usage/certificate/#renewal) for more
detailed explanation). Previously this was calculated using formula `rt =
notAfter - rb`  where  `if cert duration < renewBefore; then rb = cert duration
/ 3; else rb = renewBefore`. This change fixes a bug where, if a certificate's
duration is very slightly larger than `renewBefore` period, then a cert gets
renewed at `notAfter - renewBefore` which can lead to a continuous renewal loop,
see [`cert-manager#3897`](https://github.com/jetstack/cert-manager/issues/3897).

## Upgrading cert-manager CRDs and stored versions of cert-manager custom resources

We have deprecated the following cert-manager APIs:

- `cert-manager.io/v1alpha2`
- `cert-manager.io/v1alpha3`
- `cert-manager.io/v1beta1`
- `acme.cert-manager.io/v1alpha2`
- `acme.cert-manager.io/v1alpha3`
- `acme.cert-manager.io/v1beta1`

These APIs will be removed in cert-manager `v1.6.0`.
If you have a cert-manager installation that is using or has previously used these deprecated APIs you may need to upgrade your cert-manager custom resources and CRDs. This needs to be done before upgrading to cert-manager `v1.6.0`.
See cert-manager [docs](/docs/installation/upgrading/remove-deprecated-apis/#upgrading-existing-cert-manager-resources) for more detailed upgrade instructions.
