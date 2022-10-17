---
title: Release 1.10
description: 'cert-manager release notes: cert-manager v1.10'
---

Version 1.10 adds a variety of quality-of-life fixes and features including improvements to the test suite.

## Changes since v1.9.1

### Feature

- Add `issuer_name`, `issuer_kind` and `issuer_group` labels to `certificate_expiration_timestamp_seconds`, `certmanager_certificate_renewal_timestamp_seconds` and `certmanager_certificate_ready_status` metrics (#5461, @dkulchinsky)
- Add make targets for running scans with trivy against locally built containers (#5358, @SgtCoDFish)
- CertificateRequests: requests that use the SelfSigned Issuer will be re-reconciled when the target private key Secret has been informed `cert-manager.io/private-key-secret-name`. This resolves an issue whereby a request would never be signed when the target Secret was not created or was misconfigured before the request. (#5336, @JoshVanL)
- CertificateSigningRequests: requests that use the SelfSigned Issuer will be re-reconciled when the target private key Secret has been informed `experimental.cert-manager.io/private-key-secret-name`. This resolves an issue whereby a request would never be signed when the target Secret was not created or was misconfigured before the request.
  CertificateSigningRequests will also now no-longer be marked as failed when the target private key Secret is malformed- now only firing an event. When the Secret data is resolved, the request will attempt issuance. (#5379, @JoshVanL)
- Upgraded Gateway API to v0.5.0 (#5376, @inteon)
- Add caBundleSecretRef to the Vault Issuer to allow referencing the Vault CA Bundle with a Secret. Cannot be used in conjunction with the in-line caBundle field. (#5387, @Tolsto)
- The feature to create certificate requests with the name being a function of certificate name and revision has been introduced under the feature flag "StableCertificateRequestName" and it is disabled by default. This helps to prevent the error "multiple CertificateRequests were found for the 'next' revision...". (#5487, @sathyanarays)
- Helm: Added a new parameter `commonLabels` which gives you the capability to add the same label on all the resource deployed by the chart. (#5208, @thib-mary)

### Bug or Regression

- CertificateSigningRequest: no longer mark a request as failed when using the SelfSigned issuer, and the Secret referenced in `experimental.cert-manager.io/private-key-secret-name` doesn't exist. (#5323, @JoshVanL)
- DNS Route53: Remove incorrect validation which rejects solvers that don't define either a `accessKeyID` or `secretAccessKeyID`. (#5339, @JoshVanL)
- Enhanced securityContext for PSS/restricted compliance. (#5259, @joebowbeer)
- Fix issue where CertificateRequests marked as InvalidRequest did not properly trigger issuance failure handling leading to 'stuck' requests (#5366, @munnerz)
- `cmctl` and `kubectl cert-manager` now report their actual versions instead of "canary", fixing issue [#5020](https://github.com/cert-manager/cert-manager/issues/5020) (#5022, @maelvls)

### Other

- Avoid hard-coding release namespace in helm chart (#5163, @james-callahan)
- Bump cert-manager's version of Go to `1.19` (#5466, @lucacome)
- Remove `.bazel` and `.bzl` files from cert-manager now that bazel has been fully replaced (#5340, @SgtCoDFish)
- Updates Kubernetes libraries to `v0.25.2`. (#5456, @lucacome)
- Add annotations for ServiceMonitor in helm chart (#5401, @sathieu)
- Helm: Add NetworkPolicy support (#5417, @mjudeikis)
- To help troubleshooting, make the container names unique.
  BREAKING: this change will break scripts/ CI that depend on `cert-manager` being the container name. (#5410, @rgl)
