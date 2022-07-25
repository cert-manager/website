---
title: Release 1.9
description: 'cert-manager release notes: cert-manager v1.9'
---

## v1.9.0

cert-manager v1.9.0 adds alpha support for using cert-manager `Certificate`s in scenarios where the ordering of the Relative Distinguished Names (RDN) sequence that constitutes an X.509 certificate's subject needs to be preserved; improves the ability to configure the `Certificate` created via ingress-shim using annotations on the `Ingress` resource; introduces various changes/improvements in contributor flow; and finishes the  new make-based contributor workflow.

### Major Themes

#### Literal Certificate Subjects

cert-manager's `Certificate` allows users to configure the subject fields of the X.509 certificate via `spec.subject` and `spec.commonName` fields. The [X.509 spec](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1.2.6) states that the subject is an (ordered) sequence of Relative Distinguished Names (RDN).

cert-manager does not strictly abide by this spec when encoding the subject fields from the `Certificate` spec. For example, the order of the RDN sequence may not be preserved. This is because cert-manager uses Go's libraries for X.509 certificates, and the Go libraries don't preserve ordering.

For the vast majority of users this does not matter, but there are specific cases that require defining the exact ordered RDN sequence. For example, if the certificate is used for LDAP authentication and the RDN sequence represents a [location in LDAP directory tree](https://ldapwiki.com/wiki/Directory%20Information%20Tree). See [`cert-manager#3203`](https://github.com/cert-manager/cert-manager/issues/3203).

For these use cases, a new alpha `LiteralSubject` field has been added to the `Certificate` spec where users can pass a literal RDN sequence:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: test
spec:
  secretName: test
  literalSubject: "C=US,O=myOrg,CN=someName"
```

To use this field, the alpha feature gate `LiteralCertificateSubject` needs to be enabled on both the cert-manager controller and webhook. Bear in mind that `spec.literalSubject` is mutually exclusive with `spec.commonName` and `spec.subject`.

This feature is aimed at the specific scenario where an exact RDN sequence needs to be defined. We do not intend to deprecate the existing `spec.subject` and `spec.commonName` fields and we recommend that folks keep using those fields in all other cases; they're simpler, have better validation and are more obvious to read and change.

#### ingress-shim `Certificate` Configuration

cert-manager 1.9 adds the ability to configure an ingress-shim `Certificate`'s `spec.revisionHistoryLimit` and `spec.privateKey` via [annotations on the `Ingress` resource](https://cert-manager.io/docs/usage/ingress/#supported-annotations).

This should allow folks to configure ingress-shim `Certificate`s according to best practices (i.e by setting `Certificate`'s `spec.privateKey.rotationPolicy` to `Always`).

In the future we would like to design a better mechanism to configure these `Certificate`s. We advise caution when using `Ingress` annotations as there is no validation of the annotations at `Ingress` creation time.

#### Contribution Workflow

Over the past couple of months there have been a number of discussions in regards to contributor experience and project health, partially triggered by the awesome community discussions in cert-manager's KubeCon booth and also by the work done to move cert-manager to CNCF's incubating stage.

For example, we've [clarified our feature policy](https://cert-manager.io/docs/contributing/policy/) and discussed the process of building cert-manager's [roadmap](https://github.com/cert-manager/cert-manager/blob/master/ROADMAP.md). If you're interested in these topics, we're happy to chat about them!

#### `make` Workflow

cert-manager 1.8 introduced a new `make` based workflow alongside the existing Bazel workflow. The work to improve the `make` workflow was continued in 1.9 and our [contributor documentation](https://cert-manager.io/docs/contributing/building/) has been redefined to use `make` commands. This should make building and testing cert-manager easier with faster build and test times, easier debugging and less complexity.

As part of this, Bazel has now been fully deprecated for building and testing cert-manager.

As usual, we welcome any feedback in regards to further improving contributor experience.

## Changes since v1.8.0

### Feature

- Added support for pulling both AWS access key IDs and secret keys from Kubernetes secrets (#5194, @Compy)
- Adds `make clean-all` for starting a fresh development environment and `make which-go` for getting go version information when developing cert-manager (#5118, @SgtCoDFish)
- Adds `make upload-release` target for publishing cert-manager releases to GCS, simplifying the cert-manager release process simpler and making it easier to change (#5205, @SgtCoDFish)
- Adds a new alpha Prometheus summary vector metric `certmanager_http_venafi_client_request_duration_seconds` which allows tracking the latency of Venafi API calls. The metric is labelled by the type of API call. Example PromQL query: `certmanager_http_venafi_client_request_duration_seconds{api_call="request_certificate"}` will show the average latency of calls to the Venafi certificate request endpoint (#5053, @irbekrm)
- Adds more verbose logging info for certificate renewal in the DynamicSource webhook to include `DNSNames` (#5142, @AcidLeroy)
- Adds new LICENSES format and ability to verify and update licenses through make (#5243, @SgtCoDFish)
- Adds private key Ingress annotations to set private key properties for Certificate (#5239, @oGi4i)
- Adds the `cert-manager.io/revision-history-limit` annotation for Ingress resources, to limit the number of CertificateRequests which are kept for a Certificate (#5221, @oGi4i)
- Adds the `literalSubject` field for Certificate resources. This is an alpha feature, enabled by passing the flag `--feature-gates=LiteralCertificateSubject=true` to the cert-manager controller and webhook. `literalSubject` allows fine-grained control of the subject a certificate should have when issued and is intended for power-users with specific use cases in mind (#5002, @spockz)
- Change default build dir from `bin` to `_bin`, which plays better with certain tools which might treat `bin` as just another source directory (#5130, @SgtCoDFish)
- Helm: Adds a new `namespace` parameter which allows users to override the namespace in which resources will be created. This also allows users to set the namespace of the chart when using cert-manager as a sub chart. (#5141, @andrewgkew)
- Helm: Allow for users to not auto-mount service account tokens [see also `k/k#57601`](https://github.com/kubernetes/kubernetes/issues/57601) (#5016, @sveba)
- Use multiple retries when provisioning tools using `curl`, to reduce flakes in tests and development environments (#5272, @SgtCoDFish)

### Bug or Regression

- CertificateRequests controllers must wait for the core secrets informer to be synced (#5224, @rodrigorfk)
- Ensure that `make release-artifacts` only builds unsigned artifacts as intended (#5181, @SgtCoDFish)
- Ensure the startupapicheck is only scheduled on Linux nodes in the helm chart (#5136, @craigminihan)
- Fixed a bug where the Venafi Issuer would not verify its access token (TPP) or API key (Cloud) before becoming ready. Venafi Issuers now remotely verify the access token or API key (#5212, @jahrlin)
- Fixed release artifact archives generated by Make so that a leading `./` is stripped from paths. This ensures that behavior is the same as v1.7 and earlier (#5050, @jahrlin)
- Increase timeouts for `Issuer` and `ClusterIssuer` controllers to 2 minutes and increase ACME client HTTP timeouts to 90 seconds, in order to enable the use of slower ACME issuers which take a long time to process certain requests. (#5226, @SgtCoDFish)
- Increases Venafi Issuer timeout for retrieving a certificate increased to 60 seconds, up from 10. This gives TPP instances longer to complete their workflows and make the certificate available before cert-manager times out and re-queues the request. (#5247, @hawksight)
- Remove `pkg/util/coverage` which broke compatibility with go 1.18; thanks @davidsbond for finding the issue! (#5032, @SgtCoDFish)
- `cmctl` and `kubectl cert-manager` now report their actual versions instead of "canary", fixing issue [#5020](https://github.com/cert-manager/cert-manager/issues/5020) (#5286, @jetstack-bot)

### Other (Cleanup or Flake)

- Adds `make update-all` as a convenience target to run before raising a PR (#5251, @SgtCoDFish)
- Adds make targets for updating and verifying CRDs and codegen (#5242, @SgtCoDFish)
- Bump cert-manager's version of Go to 1.18 (#5152, @lucacome)
- Bumps distroless base images to their latest versions (#5222, @irbekrm)
- CertificateSigningRequest: no longer mark a request as failed when using the SelfSigned issuer, and the Secret referenced in `experimental.cert-manager.io/private-key-secret-name` doesn't exist. (#5332, @jetstack-bot)
- Only require python for the one test we have which needs it, rather than requiring it globally (#5245, @SgtCoDFish)
- Remove deprecated field `securityContext.enabled` from helm chart (#4721, @Dean-Coakley)
- Removes support for `networking/v1beta` Ingresses in ingress-shim. (#5250, @irbekrm)
- Reverts additional check for `ServiceMonitor` (#5202, @irbekrm)
- Updates Kubernetes libraries to `v0.24.2`. (#5097, @lucacome)
- Updates warning message that is thrown if issuance fails because private key does not match spec, but private key regeneration is disabled. See https://github.com/cert-manager/cert-manager/pull/5199. (#5199, @irbekrm)
