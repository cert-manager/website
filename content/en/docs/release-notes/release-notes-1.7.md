---
title: "Release 1.7"
linkTitle: "v1.7"
weight: 760
type: "docs"
---

## Breaking Changes (You **MUST** read this before you upgrade!)

⚠ Following their deprecation in version 1.5, the cert-manager API versions v1alpha2, v1alpha3, and v1beta1 have been removed.
You must ensure that all cert-manager custom resources are stored in etcd at version v1
and that all cert-manager `CustomResourceDefinition`s have only v1 as the stored version.

Since release 1.7, `cmctl` can automatically migrate any deprecated API resources.
Please download `cmctl-v1.7.0-beta.0` and read [Removing Deprecated API Resources]
for full instructions.

[Removing Deprecated API Resources]: https://cert-manager.io/docs/installation/upgrading/remove-deprecated-apis/

## Major Themes

### Additional Certificate Output Formats

`additionalOutputFormats` is a field on the Certificate `spec` that allows
specifying additional supplementary formats of issued certificates and their
private key. There are currently two supported additional output formats:
`CombinedPEM` and `DER`. Both output formats can be specified on the same
Certificate.
Read [Additional Certificate Output Formats] for more details and
thanks to [@seuf](https://github.com/seuf) for getting this across the line!

[Additional Certificate Output Formats]: ../../usage/certificate/#additional-certificate-output-formats

### Removal of Deprecated APIs

In 1.7 the cert-manager API versions v1alpha2, v1alpha3, and v1beta1 have been removed from the custom resource definitions (CRDs).
You will notice that the YAML manifest files are much smaller as a result.
These APIs have been deprecated since 1.5.

In this release we have added a new sub-command to the cert-manager CLI (`cmctl upgrade migrate-api-version`),
which you SHOULD run BEFORE upgrading cert-manager to 1.7.
Please read [Removing Deprecated API Resources] for full instructions.

### Server-Side Apply

This is the first version of cert-manager which relies on [Server-Side Apply].
We are using it to properly manage the annotations and labels on the TLS Secret.
For this reason cert-manager 1.7 requires at least Kubernetes 1.18.

[Server-Side Apply]: https://kubernetes.io/docs/reference/using-api/server-side-apply/

### Configuration Files

In this release we introduce a new configuration file for the cert-manager-webhook.
Instead of configuring the webhook using command line flags,
you can now modify the webhook Deployment to mount a ConfigMap
containing a configuration file.
Read the [WebhookConfiguration Schema] for more information.

In future releases we will introduce configuration files for the other cert-manager components: controller-manager and cainjector.

[WebhookConfiguration Schema]: https://cert-manager.io/next-docs/reference/api-docs/#webhook.config.cert-manager.io/v1alpha1.WebhookConfiguration

### Non-bazel Development

We aim to stop using `bazel` for building and testing cert-manager.
It is too difficult for new contributors and frustrates many of our regular contributors.
So we have been fixing the cert-manager Makefile and trying to make it possible to run the unit-tests
with `go test ./cmd/... ./internal/... ./pkg/...` etc.

## Community

Thanks again to all open-source contributors with commits in this release, including:

- [@Adphi](https://github.com/Adphi)
- [@devholic](https://github.com/devholic)
- [@johnwchadwick](https://github.com/johnwchadwick)
- [@jsoref](https://github.com/jsoref)
- [@jwenz723](https://github.com/jwenz723)
- [@seuf](https://github.com/seuf)
- [@thirdeyenick](https://github.com/thirdeyenick)

And thanks as usual to [coderanger](https://github.com/coderanger) for helping people
out on the Slack `#cert-manager` channel; it's a huge help and much appreciated.

# Changelog since v1.6.1

## Changes by Kind

### Feature

- Add `--acme-http01-solver-nameservers` flag to enable custom nameservers usage for ACME HTT01 challenges propagation checks. ([#4287](https://github.com/jetstack/cert-manager/pull/4287), [@Adphi](https://github.com/Adphi))
- Add `cmctl upgrade migrate-api-version` to ensure all CRD resources are stored at 'v1' prior to upgrading to v1.7 onwards ([#4711](https://github.com/jetstack/cert-manager/pull/4711), [@munnerz](https://github.com/munnerz))
- Add goimports verification step for CI ([#4710](https://github.com/jetstack/cert-manager/pull/4710), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Add support for loading webhook flags/options from a WebhookConfiguration file on disk ([#4546](https://github.com/jetstack/cert-manager/pull/4546), [@munnerz](https://github.com/munnerz))
- Added `additionalOutputFormats` parameter to allow `DER` (binary) and `CombinedPEM` (key + cert bundle) formats. ([#4598](https://github.com/jetstack/cert-manager/pull/4598), [@seuf](https://github.com/seuf))
- Added a makefile based build workflow which doesn't depend on bazel ([#4554](https://github.com/jetstack/cert-manager/pull/4554), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Added a new Helm chart parameter `prometheus.servicemonitor.honorLabels`, which sets the `honor_labels` field  of the Prometheus scrape config. ([#4608](https://github.com/jetstack/cert-manager/pull/4608), [@thirdeyenick](https://github.com/thirdeyenick))
- Added helm value `.Values.serviceAnnotations` ([#4329](https://github.com/jetstack/cert-manager/pull/4329), [@jwenz723](https://github.com/jwenz723))
- Certificate Secrets are now managed by the APPLY API call, rather than UPDATE/CREATE. The issuing controller actively reconciles Certificate SecretTemplate's against corresponding Secrets, garbage collecting and correcting key/value changes. ([#4638](https://github.com/jetstack/cert-manager/pull/4638), [@JoshVanL](https://github.com/JoshVanL))

### Bug or Regression

- Ensures 1 hour backoff between errored calls for new ACME Orders. ([#4616](https://github.com/jetstack/cert-manager/pull/4616), [@irbekrm](https://github.com/irbekrm))
- Fix unexpected exit when multiple DNS providers are passed to `RunWebhookServer` ([#4702](https://github.com/jetstack/cert-manager/pull/4702), [@devholic](https://github.com/devholic))
- Fixed a bug that can cause `cmctl version` to erroneously display the wrong webhook pod versions when older failed pods are present. ([#4615](https://github.com/jetstack/cert-manager/pull/4615), [@johnwchadwick](https://github.com/johnwchadwick))
- Fixes a bug where a previous failed CertificateRequest was picked up during the next issuance. Thanks to @MattiasGees for raising the issue and help with debugging! ([#4688](https://github.com/jetstack/cert-manager/pull/4688), [@irbekrm](https://github.com/irbekrm))
- Improve checksum validation in makefile based tool installation ([#4680](https://github.com/jetstack/cert-manager/pull/4680), [@SgtCoDFish](https://github.com/SgtCoDFish))
- The HTTP-01 ACME solver now uses the `kubernetes.io/ingress.class` annotation instead of the `spec.ingressClassName` in created Ingress resources. ([#4762](https://github.com/jetstack/cert-manager/pull/4762), [@jakexks](https://github.com/jakexks))
- The `cmctl experimental install` command now uses the cert-manager namespace. This fixes a bug which was introduced in release 1.6 that caused cert-manager to be installed in the default namespace. ([#4763](https://github.com/jetstack/cert-manager/pull/4763), [@wallrj](https://github.com/wallrj))

### Other (Cleanup or Flake)

- Adds `clock_time_seconds_gauge` metric which returns the current clock time, based on seconds since 1970/01/01 UTC ([#4640](https://github.com/jetstack/cert-manager/pull/4640), [@JoshVanL](https://github.com/JoshVanL))
- Adds an automated script for cert-manager developers to update versions of kind used for development and testing. ([#4574](https://github.com/jetstack/cert-manager/pull/4574), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Bump kind image versions ([#4593](https://github.com/jetstack/cert-manager/pull/4593), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Clean up: Remove `v1beta1` form the webhook's `admissionReviewVersions` as cert-manager no longer supports v1.16 ([#4639](https://github.com/jetstack/cert-manager/pull/4639), [@JoshVanL](https://github.com/JoshVanL))
- Cleanup: Pipe feature gate flag to the e2e binary. Test against shared Feature Gate map for feature enabled and whether they should be tested against. ([#4703](https://github.com/jetstack/cert-manager/pull/4703), [@JoshVanL](https://github.com/JoshVanL))
- Ensures that in cases where an attempt to finalize an already finalized order is made, the originally issued certificate is used (instead of erroring and creating a new ACME order) ([#4697](https://github.com/jetstack/cert-manager/pull/4697), [@irbekrm](https://github.com/irbekrm))
- No longer log an error when a Certificate is deleted during normal operation. ([#4637](https://github.com/jetstack/cert-manager/pull/4637), [@JoshVanL](https://github.com/JoshVanL))
- Removed deprecated API versions from the cert-manager CRDs ([#4635](https://github.com/jetstack/cert-manager/pull/4635), [@wallrj](https://github.com/wallrj))
- Update distroless base images for cert-manager ([#4706](https://github.com/jetstack/cert-manager/pull/4706), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Upgrade Kubernetes dependencies to v0.23.1 ([#4675](https://github.com/jetstack/cert-manager/pull/4675), [@munnerz](https://github.com/munnerz))
