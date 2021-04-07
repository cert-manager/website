---
title: "Release Notes"
linkTitle: "v1.3"
weight: 800
type: "docs"
---

This release prepares for the adoption of the upstream Kubernetes CSR API and improves interopability with Hashicorp Vault enterprise.
A slew of bugs have also been squashed.

Special thanks to the external contributors whose PRs landed in this release:

* [@teejaded](https://github.com/teejaded)
* [@7opf](https://github.com/7opf)
* [@yann-soubeyrand](https://github.com/yann-soubeyrand)
* [@Kirill-Garbar](https://github.com/Kirill-Garbar)
* [@joshuastern](https://github.com/joshuastern)
* [@lalitadithya](https://github.com/lalitadithya)

Please read the [upgrade notes](/docs/installation/upgrading/upgrading-1.2-1.3/) before upgrading.

As always, the full changelog is available on the [GitHub release](https://github.com/jetstack/cert-manager/releases/tag/v1.3.0)

# Deprecated Features and Breaking Changes

## Venafi Cloud Issuer

This release updates the [Venafi Cloud Issuer][] to use `OutagePREDICT` instead of `DevOpsACCELERATE`.

The only impact to Venafi Cloud users is the change in zone syntax.
The zone is now `<Application Name>\<Issuing Template Alias>`
(e.g. `My Application\My CIT`).

[Venafi Cloud Issuer]: https://cert-manager.io/docs/configuration/venafi/

## cert-manager controller

The `--renew-before-expiration-duration` flag has been removed from the cert-manager controller, having been deprecated in the previous release.

# New Features

## Upstream CSR Support.

# Bug Fixes

## cert-manager controller

* Fixed an issue which could cause multiple `CertificateRequests` to be created in a short time for a single `Certificate` resource.

## helm Chart

* The `targetPort` used by the prometheus service monitor is now correctly set from helm values.
* The correct permissions are added to the aggregate `edit` role.

