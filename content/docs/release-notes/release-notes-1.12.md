---
title: Release 1.12
description: 'cert-manager release notes: cert-manager 1.12'
---

cert-manager 1.12 brings support for JSON logging, a lower memory footprint, the
support for ephemeral service account tokens with Vault, and the support of the
`ingressClassName` field.

## Major Themes

### Support for JSON logging

TBD

### Lower memory footprint

TBD

### Support for ephemeral service account tokens in Vault

cert-manager can now authenticate to Vault using ephemeral service account
tokens. cert-manager already knew to authenticate to Vault using the [Vault
Kubernetes Auth
Method](https://developer.hashicorp.com/vault/docs/auth/kubernetes) but relied
on insecure service account tokens stored in Secrets. You can now configure
cert-manager in a secretless manner. With this new feature, cert-manager will
create an ephemeral service account token on your behalf and use that to
authenticate to Vault.

> 📖 Read about [Secretless Authentication with a Service Account](../configuration/vault.md#secretless-authentication-with-a-service-account).

### Support for `ingressClassName` in the HTTP-01 solver

cert-manager now supports the `ingressClassName` field in the HTTP-01 solver. We
recommend using `ingressClassName` instead of the field `class` in your Issuers
and ClusterIssuers.

## Community

Once again, we extend our gratitude to all the open-source contributors who have made commits in this release, including:

- [@andrewsomething](https://github.com/andrewsomething)
- [@avi-08](https://github.com/avi-08)
- [@e96wic](https://github.com/e96wic)
- [@ExNG](https://github.com/ExNG)
- [@g-gaston](https://github.com/g-gaston)
- [@james-callahan](https://github.com/james-callahan)
- [@jkroepke](https://github.com/jkroepke)
- [@lucacome](https://github.com/lucacome)
- [@malovme](https://github.com/malovme)
- [@maumontesilva](https://github.com/maumontesilva)
- [@tobotg](https://github.com/tobotg)
- [@TrilokGeer](https://github.com/TrilokGeer)
- [@waterfoul](https://github.com/waterfoul)
- [@yanggangtony](https://github.com/yanggangtony)
- [@yulng](https://github.com/yulng)

## Changes since v1.11.0

### Feature

- Added PodDisruptionBudgets for cert-manager components to the Helm chart (disabled by default). (#3931, @e96wic)
- Added the --concurrent-workers flag that lets you control the number of concurrent workers for each of our controllers. (#5936, @inteon)
- Adds `acme.solvers.http01.ingress.podTemplate.spec.imagePullSecrets` field to issuer spec to allow to specify image pull secrets for the ACME HTTP01 solver pod. (#5801, @malovme)
- Cainjector: 
  - adds a couple new flags to cainjector that can be used to modify what injectable kinds are enabled. If cainjector is only used as a cert-manager's internal component it is sufficient to only enable validatingwebhookconfigurations and mutatingwebhookconfigurations injectables- disabling the rest can improve memory consumption. By default all are enabled.
  - renames --watch-certs flag to --enable-certificates-data-source (#5766, @irbekrm)
- Helm: you can now add volumes and volumeMounts via Helm variables for the cainjector, webhook, and startupapicheck. (#5668, @waterfoul)
- Helm: you can now enable the flags `--dns01-recursive-nameservers`, `--enable-certificate-owner-ref`, and `--dns01-recursive-nameservers-only` through Helm values. (#5614, @jkroepke)
- POTENTIALLY BREAKING: Separates cert-manager binaries and some tests into separate go modules, allowing them to be easily patched independently. This should have no impact if you simply run cert-manager in your cluster. If you import cert-manager binaries, integration tests or end-to-end tests in Golang, you may need to make code changes in response to this. See https://cert-manager.io/docs/contributing/importing/ for more details (#5880, @SgtCoDFish)
- The DigitalOcean issuer now sets a cert-manager user agent string. (#5869, @andrewsomething)
- The HTTP-01 solver can now be configured to create Ingresses with an `ingressClassName`. The credit goes to @dsonck92 for implementing the initial PR. (#5849, @maelvls)
- The Vault issuer can now be used with ephemeral Kubernetes tokens. With the new `serviceAccountRef` field, cert-manager generates a short-lived token associated to the service account to authenticate to Vault. Along with this new feature, we have added validation logic in the webhook in order to check the `vault.auth` field when creating an Issuer or ClusterIssuer. Previously, it was possible to create an Issuer or ClusterIssuer with an invalid value for `vault.auth`. (#5502, @maelvls)
- Upgraded Gateway API to v0.6.0. (#5768, @yulng)
- Webhook now logs requests to mutating/validating webhook (with `--v=5` flag) (#5975, @tobotg)

### Bug or Regression

- Certificate issuances are always failed (and retried with a backoff) for denied or invalid CertificateRequests.
  This is not necessarily a breaking change as due to a race condition this may already have been the case. (#5887, @irbekrm)
- Cmctl renew now prints an error message unless Certificate name(s) or --all are supplied (#5896, @maumontesilva)
- Fix development environment and go vendoring on Linux ARM64. (#5810, @SgtCoDFish)
- Fix ordering of remote git tags when preparing integration tests (#5910, @SgtCoDFish)
- Helm: the flag `--acme-http01-solver-image` given to the variable `acmesolver.extraArgs` now has precedence over the variable `acmesolver.image`. (#5693, @SgtCoDFish)
- Ingress and Gateway resources will not be synced if deleted via [foreground cascading](https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion). (#5878, @avi-08)
- The auto-retry mechanism added in VCert 4.23.0 and part of cert-manager 1.11.0 (#5674) has been found to be faulty. Until this issue is fixed upstream, we now use a patched version of VCert. This patch will slowdown the issuance of certificates by 9% in case of heavy load on TPP. We aim to release at an ulterior date a patch release of cert-manager to fix this slowdown. (#5805, @inteon)
- Upgrade to go 1.19.6 along with newer helm and containerd versions and updated base images (#5813, @SgtCoDFish)
- Use a fake kube apiserver version when generating helm template in `cmctl x install`, to work around a hardcoded Kubernetes version in Helm. (#5720, @irbekrm)

### Other (Cleanup or Flake)

- ACME account registration is now re-verified if account key is manually changed. (#5949, @TrilokGeer)
- Add `make go-workspace` target for generating a go.work file for local development (#5935, @SgtCoDFish)
- Added a Makefile target to build a standalone E2E test binary: make e2e-build (#5804, @wallrj)
- Bump keystore-go to v4.4.1 to work around an upstream rewrite of history (#5724, @g-gaston)
- Bump the distroless base images (#5929, @maelvls)
- Bumps base images (#5793, @irbekrm)
- Cainjector memory improvements: removes second cache of secrets, CRDs, validating/mutatingwebhookconfigurations and APIServices that should reduce memory consumption by about half.
  BREAKING: users who are relying on cainjector to work when `certificates.cert-manager.io` CRD is not installed in the cluster, now need to pass `--watch-certificates=false` flag to cainjector else it will not start.
  Users who only use cainjector as cert-manager's internal component and have a large number of `Certificate` resources in cluster can pass `--watch-certificates=false` to avoid cainjector from caching `Certificate` resources and save some memory. (#5746, @irbekrm)
- Cainjector now only reconciles annotated objects of injectable kind. (#5764, @irbekrm)
- Container images are have an OCI source label (#5722, @james-callahan)
- Disable automountServiceAccountToken in the ACME HTTP01 solver Pod (#5754, @wallrj)
- Ensures that annotations, labels and managed fields are not cached for partial metadata `Secret`s. (#5966, @irbekrm)
- Filters Secret caching to ensure only relevant Secrets are cached in full. This should reduce controller's memory consumption in clusters with a large number of cert-manager unrelated `Secret` resources. The filtering functionality is currently placed behind `SecretsFilteredCaching` feature flag.
  The filtering mechanism might, in some cases, slightly slow down issuance or cause additional requests to kube apiserver, because unlabelled `Secret`s that cert-manager controller needs will now be retrieved from kube apiserver instead of being cached locally. To prevent this from happening, users can label all issuer `Secret`s with `controller.cert-manager.io/fao: true` label. (#5824, @irbekrm)
- Reduces the amount of ACME calls during an ACME certificate issuance.
  **Warning**: this PR slightly changes how `Challenge` names are calculated. To avoid duplicate issuances due to `Challenge`s being recreated, ensure that there is no in-progress ACME certificate issuance when you upgrade to this version of cert-manager. (#5901, @irbekrm)
- Tests on Kubernetes v1.27.1 by default. (#5979, @irbekrm)
- Updates Kubernetes libraries to `v0.26.2`. (#5820, @lucacome)
- Updates Kubernetes libraries to `v0.26.3`. (#5907, @lucacome)
- Updates base images (#5832, @irbekrm)
- Upgrade to Go 1.20 (#5969, @wallrj)
- Upgrade to go 1.19.5 (#5712, @yanggangtony)
- Validates that `certificate.spec.secretName` is a valid `Secret` name (#5967, @avi-08)
- `certificate.spec.secretName` Secrets will now be labelled with `controller.cert-manager.io/fao` label (#5660, @irbekrm)

### Uncategorized

- Add 6443/TCP to webhook egress rules (#5788, @ExNG)
