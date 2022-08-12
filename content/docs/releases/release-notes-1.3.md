---
title: Release Notes
description: 'cert-manager release notes: cert-manager v1.3'
---

# Patch Release `v1.3.1`

## Bug and Security Fixes

- A Helm upgrade bug was
  [fixed](https://github.com/cert-manager/cert-manager/pull/3882), you should now
  able to upgrade from cert-manager 1.2 to 1.3 when `--set installCRDs=true` is
  used. This issue was due to [a Helm
  bug](https://github.com/helm/helm/issues/5806#issuecomment-788116838) with the
  `minimum` field on the CRDs.

# Final Release `v1.3.0`

The 1.3 release prepares for the implementation of certificate issuance policies and adoption of the upstream [Kubernetes CSR](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/) API. It also improves interoperability with HashiCorp [Vault Enterprise](https://www.vaultproject.io/docs/enterprise).
A slew of bugs have also been squashed.

Special thanks to the external contributors who contributed to this release:

* [@teejaded](https://github.com/teejaded)
* [@7opf](https://github.com/7opf)
* [@yann-soubeyrand](https://github.com/yann-soubeyrand)
* [@Kirill-Garbar](https://github.com/Kirill-Garbar)
* [@joshuastern](https://github.com/joshuastern)
* [@lalitadithya](https://github.com/lalitadithya)
* [@johejo](https://github.com/johejo)
* [@alrs](https://github.com/alrs)
* [@jsoref](https://github.com/jsoref)
* [@RinkiyaKeDad](https://github.com/RinkiyaKeDad)
* [@jonathansp](https://github.com/jonathansp)
* [@OmairK](https://github.com/OmairK)
* [@justinkillen](https://github.com/justinkillen)

Please read the [upgrade notes](../installation/upgrading/upgrading-1.2-1.3.md) before upgrading.

As always, the full change log is available on the [GitHub release](https://github.com/cert-manager/cert-manager/releases/tag/v1.3.0).

## Deprecated Features and Breaking Changes

### Venafi Cloud Issuer

This release updates the [Venafi Cloud Issuer][] to use `OutagePREDICT` instead of `DevOpsACCELERATE`.

The only impact to Venafi Cloud users is the change in zone syntax.
The zone is now `<Application Name>\<Issuing Template Alias>`
(e.g. `My Application\My CIT`).

[Venafi Cloud Issuer]: https://cert-manager.io/docs/configuration/venafi/

### cert-manager controller

The `--renew-before-expiration-duration` flag has been removed from the cert-manager controller, having been deprecated in the previous release.

### cert-manager CRDs

`CertificateRequests` are now immutable - the `spec` and `metadata.annotations` fields cannot be changed after creation. They were always designed to be immutable but this behavior is now *enforced* by the cert-manager webhook.

## New Features

### Policy Support Preparation

* The [design documentation](https://github.com/cert-manager/cert-manager/blob/v1.3.0/design/20210203.certificate-request-identity.md) for Certificate Identity is now available.
* `CertificateRequests` now have identity fields mirroring the upstream [Kubernetes CSR](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/) object.
* `CertificateRequests` are now immutable.
* `CertificateRequests` now have an Approval condition type, with `Approved` and `Denied` reasons.
* The cert-manager controller currently always approves any `CertificateRequest`.
* Added `kubectl cert-manager [approve|deny]` commands to the kubectl plugin.

### cert-manager CRDs

* `CertificateRequests` now support the `revisionHistoryLimit` field to limit the amount of retained history. The default is unlimited (`nil`).

### Vault Enterprise

* cert-manager now sends the `X-VAULT-NAMESPACE` header for the `requestTokenWithAppRoleRef` API call.

## Bug Fixes

### cert-manager Controller

* Fixed an issue which could cause multiple `CertificateRequests` to be created in a short time for a single `Certificate` resource.
* Certificate Readiness controller only updates a certificate's status if something has changed.

### SelfSigned Issuer

* The issuer now warns if you request a certificate with an empty subject DN - creating a certificate that is in violation of RFC 5280. Some applications will reject such certificates as invalid, such as Java's `keytool`.

### Helm Chart

* The `targetPort` used by the Prometheus service monitor is now correctly set from helm values.
* The correct permissions are added to the aggregate `edit` role.

## Other Changes

## Repository Hygiene

* `SECURITY.md` now contains information on how to report security issues.
* The language of `CONTRIBUTING.md` has been updated to match existing copyright notices.

### Tooling

* cert-manager now can be built with go 1.16 on Apple Silicon.
* Docker images targets have been added to the Makefile.
* Bazel `v3.5.0` is required to build locally and to run tests.