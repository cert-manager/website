---
title: Release 1.12
description: 'cert-manager release notes: cert-manager 1.12'
---

## v1.12.6

v1.12.6 fixes some CVE alerts and a Venafi issuer bug

### Changes

#### Bug or Regression

- Bump `golang.org/x/net v0.15.0 => v0.17.0` as part of addressing `CVE-2023-44487` / `CVE-2023-39325` (#6431, @SgtCoDFish)
- The Venafi issuer now properly resets the certificate and should no longer get stuck with `WebSDK CertRequest Module Requested Certificate` or `This certificate cannot be processed while it is in an error state. Fix any errors, and then click Retry.`. (#6401, @jetstack-bot)

#### Other (Cleanup or Flake)

- Bump go to 1.20.10 to address `CVE-2023-39325`. Also bumps base images. (#6412, @SgtCoDFish)

## v1.12.5

v1.12.5 contains a backport for a name collision bug that was found in v1.13.0

### Changes

#### Bug or Regression

- BUGFIX: fix CertificateRequest name collision bug in StableCertificateRequestName feature. (#6359, @jetstack-bot)

#### Other (Cleanup or Flake)

- Updated base images to the latest version. (#6372, @inteon)
- Upgrade Go from 1.20.7 to 1.20.8. (#6371, @jetstack-bot)

## v1.12.4

v1.12.4 contains an important security fix that
addresses [CVE-2023-29409](https://cve.report/CVE-2023-29409).

### Changes

- Fixes an issue where cert-manager would incorrectly reject two IP addresses as
  being unequal when they should have compared equal. This would be most
  noticeable when using an IPv6 address which doesn't match how Go's
  `net.IP.String()` function would have printed that address.
  ([#6297](https://github.com/cert-manager/cert-manager/pull/6297),
  [@SgtCoDFish](https://github.com/SgtCoDFish))
- Use Go 1.20.7 to fix a security issue in Go's `crypto/tls` library.
  ([#6318](https://github.com/cert-manager/cert-manager/pull/6318),
  [@maelvls](https://github.com/maelvls))

## v1.12.3

v1.12.3 contains a bug fix for the cainjector which addresses a memory leak!

### Changes

- BUGFIX\[cainjector\]: 1-character bug was causing invalid log messages and a memory leak (#6235, @jetstack-bot)

## v1.12.2

v1.12.2 is a bugfix release, but includes a known issue. You should prefer
upgrading to the latest patch version available for 1.12.

### Known issues

- cainjector contains a memory leak due to re-assignment of a log variable (see https://github.com/cert-manager/cert-manager/issues/6217). The fix will be released in v1.12.3. See https://github.com/cert-manager/cert-manager/pull/6232 for context.

### Changes

- BUGFIX: `cmctl check api --wait 0` exited without output; we now make sure we perform the API check at least once (#6116, @jetstack-bot)

## v1.12.1

The v1.12.1 release contains a couple dependency bumps and changes to ACME
external webhook library. Note that v1.12.1 contains a known issue, and you
should prefer upgrading to the latest patch version available for 1.12.

### Known issues

- [`cmctl` API check](https://cert-manager.io/docs/installation/verify/) is broken in v1.12.1. We suggest that you do not upgrade `cmctl` to this version. The fix will be released in v1.12.2.
See #6116 for context.
- cainjector contains a memory leak due to re-assignment of a log variable (see https://github.com/cert-manager/cert-manager/issues/6217). The fix will be released in v1.12.3.
See https://github.com/cert-manager/cert-manager/pull/6232 for context.

### Other

- Don't run API Priority and Fairness controller in webhook's extension apiserver ([#6085](https://github.com/cert-manager/cert-manager/pull/6085), [@irbekrm](https://github.com/irbekrm))
- Adds a warning for folks to not use controller feature gates helm value to configure webhook feature gates ([#6100](https://github.com/cert-manager/cert-manager/pull/6100), [@irbekrm](https://github.com/irbekrm))

### Uncategorized

- Updates Kubernetes libraries to `v0.27.2`. ([#6077](https://github.com/cert-manager/cert-manager/pull/6077), [@lucacome](https://github.com/lucacome))
- Updates controller-runtime to `v0.15.0` ([#6098](https://github.com/cert-manager/cert-manager/pull/6098), [@lucacome](https://github.com/lucacome))

## v1.12.0

cert-manager 1.12 brings support for JSON logging, a lower memory footprint, the
support for ephemeral service account tokens with Vault, and the support of the
`ingressClassName` field. We also improved on our ability to patch
vulnerabilities.

### Major Themes

#### Support for JSON logging

JSON logs are now available in cert-manager! A massive thank you to
[@malovme](https://github.com/malovme) for going the extra mile to get
[#5828](https://github.com/cert-manager/cert-manager/pull/5828) merged!

To enable JSON logs, add the flag `--logging-format=json` to the three
deployments (`cert-manager`, `cert-manager-webhook`, and
`cert-manager-cainjector`).

For example, if you are using the Helm chart:

```bash
helm repo add --force-update jetstack https://charts.jetstack.io
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager \
  --set extraArgs='{--logging-format=json}' \
  --set webhook.extraArgs='{--logging-format=json}' \
  --set cainjector.extraArgs='{--logging-format=json}'
```

#### Lower memory footprint

In 1.12 we continued the work started in 1.11 to reduce cert-manager component's
memory consumption.

##### Controller

Caching of the full contents of all cluster `Secret`s can now be disabled by
setting a `SecretsFilteredCaching` alpha feature gate to true. This will ensure
that only `Secret` resources that are labelled with
`controller.cert-manager.io/fao` label [^1] are cached in full. Cert-manager
automatically adds this label to all `Certificate` `Secret`s.

This change has been placed behind alpha feature gate as it could potentially
slow down large scale issuance because issuer credentials `Secret`s will now be
retrieved from kube-apiserver instead of local cache. To prevent the slow down,
users can manually label issuer `Secret`s with a
`controller.cert-manager.io/fao` label.
See the
[design](https://github.com/cert-manager/cert-manager/blob/master/design/20221205-memory-management.md)
and [implementation](https://github.com/cert-manager/cert-manager/pull/5824) for
additional details.
We would like to gather some feedback on this change before
it can graduate- please leave your comments on
(`cert-manager#6074`)[https://github.com/cert-manager/cert-manager/issues/6074].

Additionally, controller no longer watches and caches all `Pod` and `Service`
resources.
See [`cert-manager#5976`](https://github.com/cert-manager/cert-manager/pull/5976) for implementation.

##### Cainjector

[Cainjector's](../../concepts/ca-injector.md) control loops have been refactored, so by default it should
consume up to half as much memory as before, see
[`cert-manager#5746`](https://github.com/cert-manager/cert-manager/pull/5746).

Additionally, a number of flags have been added to cainjector that can be used
to scope down what resources it watches and caches.

If cainjector is only used as part of cert-manager installation, it only needs
to inject CA certs to cert-manager's `MutatingWebhookConfiguration` and
`ValidatingWebhookConfiguration` from a `Secret` in cert-manager's installation
namespace so all the other injectable/source types can be turned off and
cainjector can be scoped to a single namespace, see the relevant flags below:

```go
// cainjector flags
--namespace=<cert-manager-installation-namespace> \
--enable-customresourcedefinitions-injectable=false \
--enable-certificates-data-source=false \
--enable-apiservices-injectable=false
```

See [`cert-manager#5766`](https://github.com/cert-manager/cert-manager/pull/5766) for more detail.

A big thanks to everyone who put in time reporting and writing up issues
describing performance problems in large scale installations.

#### Faster Response to CVEs By Reducing Transitive Dependencies

In cert-manager 1.12, we have worked on reducing the impacts that unsupported
dependencies have on our ability to patch CVEs.

Each binary now has its own `go.mod` file. When a CVE is declared in an
unsupported minor version of a dependency, and that the only solution is to bump
the minor version of the dependency, we can now choose to make an exception and
bump that minor version but limit the impact to a single binary.

For example, in cert-manager 1.10, we chose not to fix a CVE reported in Helm
because it was forcing us to bump the minor versions of `k8s.io/api` and many
other dependencies.

A side effect of the new `go.mod` layout is that it's now easier to import
cert-manager in Go, in terms of transitive dependencies that might show up in
your `go.mod` files or potential version conflicts between cert-manager and your
other dependencies.

The caveat here is that we still only recommend importing cert-manager in [very
specific circumstances](../../contributing/importing.md), and the module changes
mean that if you imported some paths (specifically under `cmd` or some paths
under `test`) you might see broken imports when you try to upgrade.

If you experience a break as part of this, we're sorry and we'd be interested to
chat about it. The vast majority of projects using cert-manager should notice no
impact, and there should be no runtime impact either.

You can read more about this change in the design document
[`20230302.gomod.md`](https://github.com/cert-manager/cert-manager/blob/master/design/20230302.gomod.md).

#### Support for ephemeral service account tokens in Vault

cert-manager can now authenticate to Vault using ephemeral service account
tokens (JWT). cert-manager already knew to authenticate to Vault using the
[Vault Kubernetes Auth
Method](https://developer.hashicorp.com/vault/docs/auth/kubernetes) but relied
on insecure service account tokens stored in Secrets. You can now configure
cert-manager in a secretless manner. With this new feature, cert-manager will
create an ephemeral service account token on your behalf and use that to
authenticate to Vault.

> 📖 Read about [Secretless Authentication with a Service Account](../../configuration/vault.md#secretless-authentication-with-a-service-account).

This change was implemented in the pull request
[`cert-manager#5502`](https://github.com/cert-manager/cert-manager/pull/5502).

#### Support for `ingressClassName` in the HTTP-01 solver

cert-manager now supports the `ingressClassName` field in the HTTP-01 solver. We
recommend using `ingressClassName` instead of the field `class` in your Issuers
and ClusterIssuers.

> 📖 Read more about `ingressClassName` in the documentation page [HTTP01](../../configuration/acme/http01/#ingressclassname).

#### Liveness probe and healthz endpoint in the controller

A healthz HTTP server has been added to the controller component.
It serves a `/livez`  endpoint, which reports the health status of the leader election system.
If the leader process has failed to renew its lease but has unexpectedly failed to exit,
the `/livez` endpoint will return an error code and an error message.
In conjunction with a new liveness probe in the controller Pod,
this will cause the controller to be restarted by the kubelet.

> 📖 Read more about this new feature in [Best Practice: Use Liveness Probes](../../installation/best-practice.md#use-liveness-probes).

### Community

We extend our gratitude to all the open-source contributors who have made
commits in this release, including:

- [@andrewsomething](https://github.com/andrewsomething)
- [@avi-08](https://github.com/avi-08)
- [@dsonck92](https://github.com/dsonck92)
- [@e96wic](https://github.com/e96wic)
- [@ExNG](https://github.com/ExNG)
- [@erikgb](https://github.com/erikgb)
- [@g-gaston](https://github.com/g-gaston)
- [@james-callahan](https://github.com/james-callahan)
- [@jkroepke](https://github.com/jkroepke)
- [@lucacome](https://github.com/lucacome)
- [@malovme](https://github.com/malovme)
- [@maumontesilva](https://github.com/maumontesilva)
- [@tobotg](https://github.com/tobotg)
- [@TrilokGeer](https://github.com/TrilokGeer)
- [@vidarno](https://github.com/vidarno)
- [@vinzent](https://github.com/vinzent)
- [@waterfoul](https://github.com/waterfoul)
- [@yanggangtony](https://github.com/yanggangtony)
- [@yulng](https://github.com/yulng)

Thanks also to the following cert-manager maintainers for their contributions during this release:

- [@inteon](https://github.com/inteon)
- [@wallrj](https://github.com/wallrj)
- [@maelvls](https://github.com/maelvls)
- [@SgtCoDFish](https://github.com/SgtCoDFish)
- [@irbekrm](https://github.com/irbekrm)
- [@jakexks](https://github.com/jakexks)
- [@JoshVanL](https://github.com/JoshVanL)
- [@munnerz](https://github.com/munnerz)

Equally thanks to everyone who provided feedback, helped users and raised issues
on GitHub and Slack, joined our meetings and talked to us at KubeCon!

Special thanks to [@erikgb](https://github.com/erikgb) for continuously great
input and feedback and to [@lucacome](https://github.com/lucacome) for always
ensuring that our Kubernetes dependencies are up to date!

Thanks also to the CNCF, which provides resources and support, and to the AWS
open source team for being good community members and for their maintenance of
the Private CA Issuer.

In addition, massive thanks to Jetstack (by Venafi) for contributing developer
time and resources towards the continued maintenance of cert-manager projects.

### Changes

#### Feature

- Helm: Added PodDisruptionBudgets for cert-manager components to the Helm chart (disabled by default). ([#3931](https://github.com/cert-manager/cert-manager/pull/3931), [@e96wic](https://github.com/e96wic))
- Added support for JSON logging (using `--logging-format=json`) ([#5828](https://github.com/cert-manager/cert-manager/pull/5828), [@malovme](https://github.com/malovme))
- Added the --concurrent-workers flag that lets you control the number of concurrent workers for each of our controllers. ([#5936](https://github.com/cert-manager/cert-manager/pull/5936), [@inteon](https://github.com/inteon))
- Adds `acme.solvers.http01.ingress.podTemplate.spec.imagePullSecrets` field to issuer spec to allow to specify image pull secrets for the ACME HTTP01 solver pod. ([#5801](https://github.com/cert-manager/cert-manager/pull/5801), [@malovme](https://github.com/malovme))
- cainjector:
  - New flags were added to the cainjector binary. They can be used to modify what injectable kinds are enabled. If cainjector is only used as a cert-manager's internal component it is sufficient to only enable validatingwebhookconfigurations and mutatingwebhookconfigurations injectable resources; disabling the rest can improve memory consumption. By default all are enabled.
  - The `--watch-certs` flag was renamed to `--enable-certificates-data-source`. ([#5766](https://github.com/cert-manager/cert-manager/pull/5766), [@irbekrm](https://github.com/irbekrm))
- Helm: you can now add volumes and volume mounts via Helm variables for the cainjector, webhook, and startupapicheck. ([#5668](https://github.com/cert-manager/cert-manager/pull/5668), [@waterfoul](https://github.com/waterfoul))
- Helm: you can now enable the flags `--dns01-recursive-nameservers`, `--enable-certificate-owner-ref`, and `--dns01-recursive-nameservers-only` through Helm values. ([#5614](https://github.com/cert-manager/cert-manager/pull/5614), [@jkroepke](https://github.com/jkroepke))
- **POTENTIALLY BREAKING**: the cert-manager binaries and some tests have been split into separate Go modules, allowing them to be easily patched independently. This should have no impact if you simply run cert-manager in your cluster. If you import cert-manager binaries, integration tests or end-to-end tests in Go, you may need to make code changes in response to this. See https://cert-manager.io/docs/contributing/importing/ for more details. ([#5880](https://github.com/cert-manager/cert-manager/pull/5880), [@SgtCoDFish](https://github.com/SgtCoDFish))
- The DigitalOcean issuer now sets a cert-manager user agent string. ([#5869](https://github.com/cert-manager/cert-manager/pull/5869), [@andrewsomething](https://github.com/andrewsomething))
- The HTTP-01 solver can now be configured to create Ingresses with an `ingressClassName`. The credit goes to @dsonck92 for implementing the initial PR. ([#5849](https://github.com/cert-manager/cert-manager/pull/5849), [@maelvls](https://github.com/maelvls))
- The Vault issuer can now be used with ephemeral Kubernetes tokens. With the new `serviceAccountRef` field, cert-manager generates a short-lived token associated to the service account to authenticate to Vault. Along with this new feature, we have added validation logic in the webhook in order to check the `vault.auth` field when creating an Issuer or ClusterIssuer. Previously, it was possible to create an Issuer or ClusterIssuer with an invalid value for `vault.auth`. ([#5502](https://github.com/cert-manager/cert-manager/pull/5502), [@maelvls](https://github.com/maelvls))
- The cert-manager controller container of the controller Pod now has a `/livez` endpoint and a default liveness probe, which fails if leader election has been lost and for some reason the process has not exited. The liveness probe is disabled by default. ([#5962](https://github.com/cert-manager/cert-manager/pull/5962), [@wallrj](https://github.com/wallrj))
- Upgraded Gateway API to v0.6.0. ([#5768](https://github.com/cert-manager/cert-manager/pull/5768), [@yulng](https://github.com/yulng))
- Webhook now logs requests to mutating/validating webhook (with `--v=5` flag) ([#5975](https://github.com/cert-manager/cert-manager/pull/5975), [@tobotg](https://github.com/tobotg))
- Certificate issuances are always failed (and retried with a backoff) for denied or invalid CertificateRequests.
  This is not necessarily a breaking change as due to a race condition this may already have been the case. ([#5887](https://github.com/cert-manager/cert-manager/pull/5887), [@irbekrm](https://github.com/irbekrm))
- The cainjector controller can now use server-side apply to patch mutatingwebhookconfigurations, validatingwebhookconfigurations, apiservices, and customresourcedefinitions. This feature is currently in alpha and is not enabled by default. To enable server-side apply for the cainjector, add the flag --feature-gates=ServerSideApply=true to the deployment. ([#5991](https://github.com/cert-manager/cert-manager/pull/5991), [@inteon](https://github.com/inteon))
- Helm: Egress 6443/TCP is now allowed in the webhook. This is required for OpenShift and OKD clusters for which the Kubernetes API server listens on port 6443 instead of 443. ([#5788](https://github.com/cert-manager/cert-manager/pull/5788), [@ExNG](https://github.com/ExNG))

#### Documentation

- Helm: the dead links in `values.yaml` are now working ([#5999](https://github.com/cert-manager/cert-manager/pull/5999), [@SgtCoDFish](https://github.com/SgtCoDFish))

#### Bug or Regression

- When using the `literalSubject` field on a Certificate resource, the IPs, URIs, DNS names, and email addresses segments are now properly compared. ([#5747](https://github.com/cert-manager/cert-manager/pull/5747), [@inteon](https://github.com/inteon))
- When using the `jks` and `pkcs12` fields on a Certificate resource with a CA issuer that doesn't set the `ca.crt` in the Secret resource, cert-manager no longer loop trying to copy `ca.crt` into `truststore.jks` or `truststore.p12`. ([#5972](https://github.com/cert-manager/cert-manager/pull/5972), [@vinzent](https://github.com/vinzent))
- Cmctl renew now prints an error message unless Certificate name(s) or --all are supplied ([#5896](https://github.com/cert-manager/cert-manager/pull/5896), [@maumontesilva](https://github.com/maumontesilva))
- Fix development environment and go vendoring on Linux arm64. ([#5810](https://github.com/cert-manager/cert-manager/pull/5810), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fix ordering of remote git tags when preparing integration tests ([#5910](https://github.com/cert-manager/cert-manager/pull/5910), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Helm: the flag `--acme-http01-solver-image` given to the variable `acmesolver.extraArgs` now has precedence over the variable `acmesolver.image`. ([#5693](https://github.com/cert-manager/cert-manager/pull/5693), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Ingress and Gateway resources will not be synced if deleted via [foreground cascading](https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion). ([#5878](https://github.com/cert-manager/cert-manager/pull/5878), [@avi-08](https://github.com/avi-08))
- The auto-retry mechanism added in VCert 4.23.0 and part of cert-manager 1.11.0 (#5674) has been found to be faulty. Until this issue is fixed upstream, we now use a patched version of VCert. This patch will slowdown the issuance of certificates by 9% in case of heavy load on TPP. We aim to release at an ulterior date a patch release of cert-manager to fix this slowdown. ([#5805](https://github.com/cert-manager/cert-manager/pull/5805), [@inteon](https://github.com/inteon))
- Upgrade to go 1.19.6 along with newer helm and containerd versions and updated base images ([#5813](https://github.com/cert-manager/cert-manager/pull/5813), [@SgtCoDFish](https://github.com/SgtCoDFish))
- cmctl: In order work around a hardcoded Kubernetes version in Helm, we now use a fake kube-apiserver version when generating the helm template when running `cmctl x install`. ([#5720](https://github.com/cert-manager/cert-manager/pull/5720), [@irbekrm](https://github.com/irbekrm))

#### Other (Cleanup or Flake)

- ACME account registration is now re-verified if account key is manually changed. ([#5949](https://github.com/cert-manager/cert-manager/pull/5949), [@TrilokGeer](https://github.com/TrilokGeer))
- Add `make go-workspace` target for generating a go.work file for local development ([#5935](https://github.com/cert-manager/cert-manager/pull/5935), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Added a Makefile target to build a standalone E2E test binary: make e2e-build ([#5804](https://github.com/cert-manager/cert-manager/pull/5804), [@wallrj](https://github.com/wallrj))
- Bump keystore-go to v4.4.1 to work around an upstream rewrite of history ([#5724](https://github.com/cert-manager/cert-manager/pull/5724), [@g-gaston](https://github.com/g-gaston))
- Bump the distroless base images ([#5929](https://github.com/cert-manager/cert-manager/pull/5929), [@maelvls](https://github.com/maelvls))
- Bumps base images ([#5793](https://github.com/cert-manager/cert-manager/pull/5793), [@irbekrm](https://github.com/irbekrm))
- The memory usage of the controller has been reduced by only caching the metadata of Pods and Services. ([#5976](https://github.com/cert-manager/cert-manager/pull/5976), [@irbekrm](https://github.com/irbekrm))
- Cainjector memory improvements: removes second cache of secrets, CRDs, validating/mutatingwebhookconfigurations and APIServices that should reduce memory consumption by about half.
  **BREAKING:** users who are relying on cainjector to work when `certificates.cert-manager.io` CRD is not installed in the cluster, now need to pass `--watch-certificates=false` flag to cainjector else it will not start.
  Users who only use cainjector as cert-manager's internal component and have a large number of `Certificate` resources in cluster can pass `--watch-certificates=false` to avoid cainjector from caching `Certificate` resources and save some memory. ([#5746](https://github.com/cert-manager/cert-manager/pull/5746), [@irbekrm](https://github.com/irbekrm))
- Cainjector now only reconciles annotated objects of injectable kind. ([#5764](https://github.com/cert-manager/cert-manager/pull/5764), [@irbekrm](https://github.com/irbekrm))
- Container images are have an OCI source label ([#5722](https://github.com/cert-manager/cert-manager/pull/5722), [@james-callahan](https://github.com/james-callahan))
- The acmesolver pods created by cert-manager now have `automountServiceAccountToken` turned off. ([#5754](https://github.com/cert-manager/cert-manager/pull/5754), [@wallrj](https://github.com/wallrj))
- The controller memory usage has been further decreased by ignoring annotations, labels and managed fields when caching Secret resources. ([#5966](https://github.com/cert-manager/cert-manager/pull/5966), [@irbekrm](https://github.com/irbekrm))
- The controller binary now uses much less memory on Kubernetes clusters with large or numerous Secret resources. The controller now ignores the contents of Secrets that aren't relevant to cert-manager. This functionality is currently placed behind `SecretsFilteredCaching` feature flag. The filtering mechanism might, in some cases, slightly slow down issuance or cause additional requests to kube-apiserver because unlabelled Secret resources that cert-manager controller needs will now be retrieved from kube-apiserver instead of being cached locally. To prevent this from happening, users can label all issuer Secret resources with the `controller.cert-manager.io/fao: true` label. ([#5824](https://github.com/cert-manager/cert-manager/pull/5824), [@irbekrm](https://github.com/irbekrm))
- The controller now makes fewer calls to the ACME server.
  **POTENTIALLY BREAKING**: this PR slightly changes how the name of the Challenge resources are calculated. To avoid duplicate issuances due to the Challenge resource being recreated, ensure that there is no in-progress ACME certificate issuance when you upgrade to this version of cert-manager. ([#5901](https://github.com/cert-manager/cert-manager/pull/5901), [@irbekrm](https://github.com/irbekrm))
- The number of calls made to the ACME server during the controller startup has been reduced by storing the private key hash in the Issuer's status. ([#6006](https://github.com/cert-manager/cert-manager/pull/6006), [@vidarno](https://github.com/vidarno))
- We are now testing with Kubernetes v1.27.1 by default. ([#5979](https://github.com/cert-manager/cert-manager/pull/5979), [@irbekrm](https://github.com/irbekrm))
- Updates Kubernetes libraries to `v0.26.2`. ([#5820](https://github.com/cert-manager/cert-manager/pull/5820), [@lucacome](https://github.com/lucacome))
- Updates Kubernetes libraries to `v0.26.3`. ([#5907](https://github.com/cert-manager/cert-manager/pull/5907), [@lucacome](https://github.com/lucacome))
- Updates Kubernetes libraries to `v0.27.1`. ([#5961](https://github.com/cert-manager/cert-manager/pull/5961), [@lucacome](https://github.com/lucacome))
- Updates base images ([#5832](https://github.com/cert-manager/cert-manager/pull/5832), [@irbekrm](https://github.com/irbekrm))
- Upgrade to Go 1.20 ([#5969](https://github.com/cert-manager/cert-manager/pull/5969), [@wallrj](https://github.com/wallrj))
- Upgrade to go 1.19.5 ([#5712](https://github.com/cert-manager/cert-manager/pull/5712), [@yanggangtony](https://github.com/yanggangtony))
- Validates that `certificate.spec.secretName` is a valid `Secret` name ([#5967](https://github.com/cert-manager/cert-manager/pull/5967), [@avi-08](https://github.com/avi-08))
- `certificate.spec.secretName` Secrets will now be labelled with `controller.cert-manager.io/fao` label ([#5660](https://github.com/cert-manager/cert-manager/pull/5660), [@irbekrm](https://github.com/irbekrm))

#### Uncategorized

- We have replaced our python boilerplate checker with an installed Go version, removing the need to have Python installed when developing or building cert-manager. ([#6000](https://github.com/cert-manager/cert-manager/pull/6000), [@SgtCoDFish](https://github.com/SgtCoDFish))

[^1]: fao = 'for attention of'
