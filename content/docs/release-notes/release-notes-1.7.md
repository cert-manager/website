---
title: Release 1.7
description: 'cert-manager release notes: cert-manager v1.7'
---

## v1.7.3

v1.7.3 is in effect a bug fix release which increases some hard-coded timeouts which were preventing the use of certain ACME issuers
which sometimes had slower response times. This is known to include ZeroSSL and Sectigo.

These issues were reported by many users, who we listed and thanked on the [GitHub release](https://github.com/cert-manager/cert-manager/releases/tag/v1.7.3).

### Changes since v1.7.2

#### Bug

- Increase timeouts for `Issuer` and `ClusterIssuer` controllers to 2 minutes and increase ACME client HTTP timeouts to 90 seconds, in order to enable the use of slower ACME issuers which take a long time to process certain requests. ([#5232](https://github.com/cert-manager/cert-manager/pull/5232), [@JoooostB](https://github.com/JoooostB) [@SgtCoDFish](https://github.com/SgtCoDFish))

#### Other (Cleanup)

- Bumps go to 1.17.11 and bumps base images to latest distroless images ([#5234](https://github.com/cert-manager/cert-manager/pull/5234), [@SgtCoDFish](https://github.com/SgtCoDFish))

## v1.7.2

### Changes since 1.7.1

#### Bug or Regression

- Bumps the version of Go used to build the cert-manager binaries to 1.17.8, to fix a slew of CVEs (none of which were likely to be exploited) ([#4976](https://github.com/cert-manager/cert-manager/pull/4976), [@vhosakot](https://github.com/vhosakot))
- Fixes an expired hardcoded certificate which broke unit tests ([#4978](https://github.com/cert-manager/cert-manager/pull/4978), [@SgtCoDFish](https://github.com/SgtCoDFish), [@jakexks](https://github.com/jakexks))

## v1.7.1

### Changes since v1.7.0

#### Bug or Regression

- Fix: The alpha feature Certificate's `additionalOutputFormats` is now correctly validated at admission time, and no longer _only_ validated if the `privateKey` field of the Certificate is set. The Webhook component now contains a separate feature set.
  `AdditionalCertificateOutputFormats` feature gate (disabled by default) has been added to the webhook. This gate is required to be enabled on both the controller and webhook components in order to make use of the Certificate's `additionalOutputFormat` feature. ([#4816](https://github.com/cert-manager/cert-manager/pull/4816), [@JoshVanL](https://github.com/JoshVanL))

## v1.7.0

### Breaking Changes (You **MUST** read this before you upgrade!)

#### Removal of Deprecated APIs

⚠ Following their deprecation in version 1.4, the cert-manager API versions v1alpha2, v1alpha3, and v1beta1 have been removed.
You must ensure that all cert-manager custom resources are stored in etcd at version v1
and that all cert-manager `CustomResourceDefinition`s have only v1 as the stored version
**before** upgrading.

Since release 1.7, `cmctl` can automatically migrate any deprecated API resources.
Please [download `cmctl-v1.7.1`] and read [Migrating Deprecated API Resources]
for full instructions.

[download `cmctl-v1.7.1`]: https://github.com/cert-manager/cert-manager/releases/tag/v1.7.1
[Migrating Deprecated API Resources]: https://cert-manager.io/docs/installation/upgrading/remove-deprecated-apis/

#### Ingress Class Semantics

In 1.7, we have reverted a change that caused a regression in the ACME Issuer.
Before v1.5.4, the Ingress created by cert-manager while solving an HTTP-01 challenge contained the `kubernetes.io/ingress.class` annotation:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: istio # The `class` present on the Issuer.
```
Since v1.5.4, the Ingress does not contain the annotation anymore. Instead, cert-manager uses the `ingressClassName` field:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
spec:
  ingressClassName: istio # 🔥 Breaking change!
```

This broke many users that either don't use an Ingress controller that supports the field (such as ingress-gce and Azure AGIC), as well as people who did not need to create an IngressClass previously (such as with Istio and Traefik).

The regression is present in cert-manager v1.5.4, 1.6.0, and 1.6.1. It is only present on Kubernetes 1.19+ and only appears when using an Issuer or ClusterIssuer with an ACME HTTP-01 solver configured.

In 1.7, we have restored the original behavior which is to use the annotation. We also backported this fix to 1.5.5 and 1.6.2, allowing people to upgrade safely.

Most people won't have any trouble upgrading from a version that contains the regression to 1.7.0, 1.6.2 or 1.5.5. If you are using Gloo, Contour, Skipper, or kube-ingress-aws-controller, you shouldn't have any issues. If you use the default "class" (e.g., `istio` for Istio) for Traefik, Istio, Ambassador, or ingress-nginx, then these should also continue to work without issue.

If you are using Traefik, Istio, Ambassador, or ingress-nginx _and_ you are using a non-default value for the class (e.g., `istio-internal`), or if you experience any issues with your HTTP-01 challenges please read the [notes on Ingress v1 compatibility].

[notes on Ingress v1 compatibility]: https://cert-manager.io/docs/installation/upgrading/ingress-class-compatibility/

#### Upgrading with Server Side Apply

As part of the work to [remove deprecated APIs](#removal-of-deprecated-apis) cert-manager `CustomResourceDefinition`s no longer require a conversion webhook. The related change in cert-manager `CustomResourceDefinition` specs results in invalid `CustomResourceDefinition` configurations for users who are upgrading to cert-manager 1.7 using `kubectl apply --server-side=true -f <manifests>`. This can be solved either by performing the upgrade with client side apply or by manually patching the [managed fields](https://kubernetes.io/docs/reference/using-api/server-side-apply/#field-management) of cert-manager `CustomResourceDefinitions`:

```bash
crds=("certificaterequests.cert-manager.io" "certificates.cert-manager.io" "challenges.acme.cert-manager.io" "clusterissuers.cert-manager.io" "issuers.cert-manager.io" "orders.acme.cert-manager.io")

for crd in "${crds[@]}"; do
  manager_index="$(kubectl get crd "${crd}" --show-managed-fields --output json | jq -r '.metadata.managedFields | map(.manager == "cainjector") | index(true)')"
  kubectl patch crd "${crd}" --type=json -p="[{\"op\": \"remove\", \"path\": \"/metadata/managedFields/${manager_index}\"}]"
done
```
Thanks to [@stevehipwell](https://github.com/stevehipwell) for the above patch commands.

See the original GitHub issue [`cert-manager#4831`](https://github.com/cert-manager/cert-manager/issues/4831)

### Major Themes

#### Removal of Deprecated APIs

In 1.7 the cert-manager API versions v1alpha2, v1alpha3, and v1beta1, that were deprecated in 1.4,
have been removed from the custom resource definitions (CRDs).
As a result, you will notice that the YAML manifest files are much smaller.

In this release we have added a new sub-command to the cert-manager CLI (`cmctl upgrade migrate-api-version`),
which you SHOULD run BEFORE upgrading cert-manager to 1.7.
Please read [Removing Deprecated API Resources] for full instructions.

#### Additional Certificate Output Formats

`additionalOutputFormats` is a field on the Certificate `spec` that allows
specifying additional supplementary formats of issued certificates and their
private key. There are currently two supported additional output formats:
`CombinedPEM` (the PEM-encoded private key followed by the certificate chain)
and `DER` (the DER-encoded private key only). Any combination of output formats
can be requested for the same certificate.
Read [Additional Certificate Output Formats] for more details and
thanks to [@seuf](https://github.com/seuf) for getting this across the line!

[Additional Certificate Output Formats]: ../usage/certificate.md#additional-certificate-output-formats

#### Server-Side Apply

This is the first version of cert-manager which relies on [Server-Side Apply].
We use it to properly manage the annotations and labels on TLS secrets.
For this reason cert-manager 1.7 requires at least Kubernetes 1.18 (see
[Supported Releases](https://cert-manager.io/docs/installation/supported-releases/) for further compatibility details).

[Server-Side Apply]: https://kubernetes.io/docs/reference/using-api/server-side-apply/

#### Configuration Files

In this release we introduce a new configuration file for the cert-manager-webhook.
Instead of configuring the webhook using command line flags,
you can now modify the webhook Deployment to mount a ConfigMap
containing a configuration file.
Read the [WebhookConfiguration Schema] for more information.

In future releases we will introduce configuration files for the other cert-manager components:
the controller and the cainjector.

[WebhookConfiguration Schema]: https://cert-manager.io/next-docs/reference/api-docs/#webhook.config.cert-manager.io/v1alpha1.WebhookConfiguration

#### Developing cert-manager Without Bazel

In a future release, we'll remove the use of `bazel` for building and testing cert-manager,
with the aim of making it as easy as possible for anyone to contribute and to get involved
with the cert-manager project.

The [work is ongoing][Bazel -> Make Migration Tracker], but for now we've ensured that cert-manager 1.7 can be built with `go build`,
and that all unit tests can be run with `go test ./cmd/... ./internal/... ./pkg/...`.

[Bazel -> Make Migration Tracker]: https://github.com/cert-manager/cert-manager/issues/4712

### Community

Thanks again to all open-source contributors with commits in this release, including:

- [@Adphi](https://github.com/Adphi)
- [@devholic](https://github.com/devholic)
- [@johnwchadwick](https://github.com/johnwchadwick)
- [@jsoref](https://github.com/jsoref)
- [@jwenz723](https://github.com/jwenz723)
- [@seuf](https://github.com/seuf)
- [@thirdeyenick](https://github.com/thirdeyenick)

And thanks as usual to [coderanger](https://github.com/coderanger) for helping people
out on the [`#cert-manager` Slack channel]; it's a huge help and much appreciated.

[`#cert-manager` Slack channel]: ../contributing/README.md#slack

### Changelog since v1.6.0

#### Feature

- Add `--acme-http01-solver-nameservers` flag to enable custom nameservers usage for ACME HTT01 challenges propagation checks. ([#4287](https://github.com/cert-manager/cert-manager/pull/4287), [@Adphi](https://github.com/Adphi))
- Add `cmctl upgrade migrate-api-version` to ensure all CRD resources are stored at 'v1' prior to upgrading to v1.7 onwards ([#4711](https://github.com/cert-manager/cert-manager/pull/4711), [@munnerz](https://github.com/munnerz))
- Add goimports verification step for CI ([#4710](https://github.com/cert-manager/cert-manager/pull/4710), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Add support for loading webhook flags/options from a WebhookConfiguration file on disk ([#4546](https://github.com/cert-manager/cert-manager/pull/4546), [@munnerz](https://github.com/munnerz))
- Added `additionalOutputFormats` parameter to allow `DER` (binary) and `CombinedPEM` (key + cert bundle) formats. ([#4598](https://github.com/cert-manager/cert-manager/pull/4598), [@seuf](https://github.com/seuf))
- Added a makefile based build workflow which doesn't depend on bazel ([#4554](https://github.com/cert-manager/cert-manager/pull/4554), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Added a new Helm chart parameter `prometheus.servicemonitor.honorLabels`, which sets the `honor_labels` field  of the Prometheus scrape config. ([#4608](https://github.com/cert-manager/cert-manager/pull/4608), [@thirdeyenick](https://github.com/thirdeyenick))
- Breaking change: pprof now runs by default on `localhost:6060` on the webhook and the controller, but only if explicitly enabled. Pprof can now be enabled also for cainjector. All three components have `--enable-profiling`, `--profiler-address` CLI flags to configure profiling. Thanks to [@bitscuit](https://github.com/bitscuit) for help with this! ([#4550](https://github.com/cert-manager/cert-manager/pull/4550), [@irbekrm](https://github.com/irbekrm))
- Certificate Secrets are now managed by the APPLY API call, rather than UPDATE/CREATE. The issuing controller actively reconciles Certificate SecretTemplate's against corresponding Secrets, garbage collecting and correcting key/value changes. ([#4638](https://github.com/cert-manager/cert-manager/pull/4638), [@JoshVanL](https://github.com/JoshVanL))

#### Bug or Regression

- Ensures 1 hour backoff between errored calls for new ACME Orders. ([#4616](https://github.com/cert-manager/cert-manager/pull/4616), [@irbekrm](https://github.com/irbekrm))
- Fix unexpected exit when multiple DNS providers are passed to `RunWebhookServer` ([#4702](https://github.com/cert-manager/cert-manager/pull/4702), [@devholic](https://github.com/devholic))
- Fixed a bug that can cause `cmctl version` to erroneously display the wrong webhook pod versions when older failed pods are present. ([#4615](https://github.com/cert-manager/cert-manager/pull/4615), [@johnwchadwick](https://github.com/johnwchadwick))
- Fixes a bug where a previous failed CertificateRequest was picked up during the next issuance. Thanks to @MattiasGees for raising the issue and help with debugging! ([#4688](https://github.com/cert-manager/cert-manager/pull/4688), [@irbekrm](https://github.com/irbekrm))
- Fixes an issue in `cmctl` that prevented displaying the Order resource with cert-manager 1.6 when running `cmctl status certificate`. ([#4569](https://github.com/cert-manager/cert-manager/pull/4569), [@maelvls](https://github.com/maelvls))
- Improve checksum validation in makefile based tool installation ([#4680](https://github.com/cert-manager/cert-manager/pull/4680), [@SgtCoDFish](https://github.com/SgtCoDFish))
- The HTTP-01 ACME solver now uses the `kubernetes.io/ingress.class` annotation instead of the `spec.ingressClassName` in created Ingress resources. ([#4762](https://github.com/cert-manager/cert-manager/pull/4762), [@jakexks](https://github.com/jakexks))
- The `cmctl experimental install` command now uses the cert-manager namespace. This fixes a bug which was introduced in release 1.6 that caused cert-manager to be installed in the default namespace. ([#4763](https://github.com/cert-manager/cert-manager/pull/4763), [@wallrj](https://github.com/wallrj))
- Fixed a bug in the way the Helm chart handles service annotations on the controller and webhook services. ([#4329](https://github.com/cert-manager/cert-manager/pull/4329), [@jwenz723](https://github.com/jwenz723))
- Update to latest version of keystore-go to address a backwards incompatible change introduced in v1.6.0 ([#4563](https://github.com/cert-manager/cert-manager/pull/4563), [@SgtCoDFish](https://github.com/SgtCoDFish))

#### Other (Cleanup or Flake)

- Adds `clock_time_seconds_gauge` metric which returns the current clock time, based on seconds since 1970/01/01 UTC ([#4640](https://github.com/cert-manager/cert-manager/pull/4640), [@JoshVanL](https://github.com/JoshVanL))
- Adds an automated script for cert-manager developers to update versions of kind used for development and testing. ([#4574](https://github.com/cert-manager/cert-manager/pull/4574), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Breaking change: removes the deprecated `dns01-self-check-nameservers` flag. Use `--dns01-recursive-nameservers` instead. ([#4551](https://github.com/cert-manager/cert-manager/pull/4551), [@irbekrm](https://github.com/irbekrm))
- Bump kind image versions ([#4593](https://github.com/cert-manager/cert-manager/pull/4593), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Clean up: Remove `v1beta1` form the webhook's `admissionReviewVersions` as cert-manager no longer supports v1.16 ([#4639](https://github.com/cert-manager/cert-manager/pull/4639), [@JoshVanL](https://github.com/JoshVanL))
- Cleanup: Pipe feature gate flag to the e2e binary. Test against shared Feature Gate map for feature enabled and whether they should be tested against. ([#4703](https://github.com/cert-manager/cert-manager/pull/4703), [@JoshVanL](https://github.com/JoshVanL))
- Ensures that in cases where an attempt to finalize an already finalized order is made, the originally issued certificate is used (instead of erroring and creating a new ACME order) ([#4697](https://github.com/cert-manager/cert-manager/pull/4697), [@irbekrm](https://github.com/irbekrm))
- No longer log an error when a Certificate is deleted during normal operation. ([#4637](https://github.com/cert-manager/cert-manager/pull/4637), [@JoshVanL](https://github.com/JoshVanL))
- Removed deprecated API versions from the cert-manager CRDs ([#4635](https://github.com/cert-manager/cert-manager/pull/4635), [@wallrj](https://github.com/wallrj))
- Update distroless base images for cert-manager ([#4706](https://github.com/cert-manager/cert-manager/pull/4706), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Upgrade Kubernetes dependencies to v0.23.1 ([#4675](https://github.com/cert-manager/cert-manager/pull/4675), [@munnerz](https://github.com/munnerz))
