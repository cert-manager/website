---
title: "Release Notes"
linkTitle: "v1.3"
weight: 800
type: "docs"
---

Please read the [upgrade notes](/docs/installation/upgrading/upgrading-1.2-1.3/) before upgrading.

Aside from that, there have been numerous bug fixes and features summarized below.

# Breaking Changes

## Venafi Cloud Issuer

This release updates the [Venafi Cloud Issuer][] to use `OutagePREDICT` instead of `DevOpsACCELERATE`.

The only impact to Venafi Cloud users is the change in zone syntax.
The zone is now `<Application Name>\<Issuing Template Alias>`
(e.g. `My Application\My CIT`).

[Venafi Cloud Issuer]: https://cert-manager.io/docs/configuration/venafi/

# New Features


# Bug Fixes
