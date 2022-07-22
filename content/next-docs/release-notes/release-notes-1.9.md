---
title: Release 1.9
description: 'cert-manager release notes: cert-manager v1.9'
---

## v1.9.0

cert-manager 1.9 adds alpha support for using cert-manager `Certificate`s in scenarios where the ordering of the Relative Distinguished Names sequence that constitutes an X.509 certificate's subject needs to be preserved, improves ability to configure the `Certificate` created via ingress-shim using annotations on the `Ingress` resource and introduces various changes/improvements in contributor flow, most importantly defines a new make based contributor workflow.

### Major Themes

#### `LiteralCertificateSubject` feature

cert-manager's `Certificate` allows to configure the subject fields of the X.509 certificate via `spec.subject` and `spec.commonName` fields. The [X.509 spec](https://datatracker.ietf.org/doc/html/rfc5280#section-4.1.2.6) states that the subject is an (ordered) sequence of Relative Distinguished Names (RDN). cert-manager does not strictly abide by the spec when encoding the subject fields from the `Certificate` spec, for example, the order of the RDN sequence may not be preserved.
For the vast majority of the users this does not matter, but there are specific cases that require defining the exact ordered RDN sequence, for example, if the certificate is used for LDAP authentication and the RDN sequence represents a [location in LDAP directory tree](https://ldapwiki.com/wiki/Directory%20Information%20Tree). See [`cert-manager#3203`](https://github.com/cert-manager/cert-manager/issues/3203).
For these use cases, a new alpha `LiteralSubject` field has been added to the `Certificate` spec where users can pass an RDN sequence, for example:
```
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: test
spec:
  secretName: test
  literalSubject: "C=US,O=myOrg,CN=someName"
...
To use this field, the alpha `LiteralCertificateSubject` feature gate needs to be enabled both on cert-manager [controller](../cli/controller.md) and [webhook](../cli/webhook/).
`spec.literalSubject` is mutually exclusive with `spec.commonName` and `spec.subject`.
```
This feature is aimed at the specific scenario where an exact RDN sequence needs to be defined. We do not intend to deprecate the existing `spec.subject` and `spec.commonName` fields and we recommend that folks keep using those fields in all other cases as they have better validation and visibility.

#### ingress-shim `Certificate`'s configuration

cert-manager 1.9 adds the ability to configure `Certificate`'s `spec.revisionHistoryLimit` and `spec.privateKey` for [ingress-shim](../usage/ingress/) `Certificate`s via [annotations on the `Ingress` resource](../usage/ingress/#supported-annotations).
This should allow folks to configure ingress-shim `Certificate`s according to best practices (i.e by setting `Certificate`'s `spec.privateKey.rotationPolicy` to `Always`). In the future we would like to design a better mechanism to configure these `Certificate`s.
We advise caution when using `Ingress` annotations as there is no validation of the annotations at `Ingress` creation time.

#### contribution workflow

Over the past couple of months there have been a number of discussions in regards to contributor experience and project health, partially triggered by the awesome community discussions in cert-manager's KubeCon booth and also by the work done to move cert-manager to CNCF's incubating stage.
For example, we've [clarified our feature policy](../contributing/policy.md) and discussed the process of building cert-manager's roadmap.

##### make workflow

cert-manager 1.8 introduced a new `make` based workflow alongside the existing Bazel workflow. The work to improve the `make` workflow was continued in 1.9 and our [contributor flow](../contributing/building.md) has been redefined to use `make` commands. This should make building and testing cert-manager easier with faster build and test times, easier debugging and less complexity.

As usual, we welcome any feedback in regards to further improving contributor experience.

## Changelog since v1.8.0


### Feature

- Added support for pulling both AWS access key IDs and secret keys from Kubernetes secrets ([#5194](https://github.com/cert-manager/cert-manager/pull/5194), [@Compy](https://github.com/Compy))
- Adds `make clean-all` for starting a fresh development environment and `make which-go` for getting go version information when developing cert-manager ([#5118](https://github.com/cert-manager/cert-manager/pull/5118), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Adds `make upload-release` target for publishing cert-manager releases to GCS, simplifying the cert-manager release process simpler and making it easier to change ([#5205](https://github.com/cert-manager/cert-manager/pull/5205), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Adds a new alpha Prometheus summary vector metric `certmanager_http_venafi_client_request_duration_seconds` which allows tracking the latency of Venafi API calls. The metric is labelled by the type of API call. Example PromQL query: `certmanager_http_venafi_client_request_duration_seconds{api_call="request_certificate"}` will show the average latency of calls to the Venafi certificate request endpoint ([#5053](https://github.com/cert-manager/cert-manager/pull/5053), [@irbekrm](https://github.com/irbekrm))
- Adds more verbose logging info for certificate renewal in the DynamicSource webhook to include DNS names ([#5142](https://github.com/cert-manager/cert-manager/pull/5142), [@AcidLeroy](https://github.com/AcidLeroy))
- Adds new LICENSES format and ability to verify and update licenses through make ([#5243](https://github.com/cert-manager/cert-manager/pull/5243), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Adds private key Ingress annotations to set private key properties for Certificate ([#5239](https://github.com/cert-manager/cert-manager/pull/5239), [@oGi4i](https://github.com/oGi4i))
- Adds the `cert-manager.io/revision-history-limit` annotation for Ingress resources, to limit the number of CertificateRequests which are kept for a Certificate ([#5221](https://github.com/cert-manager/cert-manager/pull/5221), [@oGi4i](https://github.com/oGi4i))
- Adds the `literalSubject` field for Certificate resources. This is an alpha feature, enabled by passing the flag `--feature-gates=LiteralCertificateSubject=true` to the cert-manager controller and webhook. `literalSubject` allows fine-grained control of the subject a certificate should have when issued and is intended for power-users with specific use cases in mind ([#5002](https://github.com/cert-manager/cert-manager/pull/5002), [@spockz](https://github.com/spockz))
- Change default build dir from `bin` to `_bin`, which plays better with certain tools which might treat `bin` as just another source directory ([#5130](https://github.com/cert-manager/cert-manager/pull/5130), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Helm: Adds a new `namespace` parameter which allows users to override the namespace in which resources will be created. This also allows users to set the namespace of the chart when using cert-manager as a sub chart. ([#5141](https://github.com/cert-manager/cert-manager/pull/5141), [@andrewgkew](https://github.com/andrewgkew))
- Helm: Allow for users to not auto-mount service account tokens [see also `k/k#57601`](https://github.com/kubernetes/kubernetes/issues/57601) ([#5016](https://github.com/cert-manager/cert-manager/pull/5016), [@sveba](https://github.com/sveba))
- Use multiple retries when provisioning tools using `curl`, to reduce flakes in tests and development environments ([#5272](https://github.com/cert-manager/cert-manager/pull/5272), [@SgtCoDFish](https://github.com/SgtCoDFish))

### Bug or Regression

- CertificateRequests controllers must wait for the core secrets informer to be synced ([#5224](https://github.com/cert-manager/cert-manager/pull/5224), [@rodrigorfk](https://github.com/rodrigorfk))
- Ensure that `make release-artifacts` only builds unsigned artifacts as intended ([#5181](https://github.com/cert-manager/cert-manager/pull/5181), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Ensure the startupapicheck is only scheduled on Linux nodes in the helm chart ([#5136](https://github.com/cert-manager/cert-manager/pull/5136), [@craigminihan](https://github.com/craigminihan))
- Fixed a bug where the Venafi Issuer would not verify its access token (TPP) or API key (Cloud) before becoming ready. Venafi Issuers now remotely verify the access token or API key ([#5212](https://github.com/cert-manager/cert-manager/pull/5212), [@jahrlin](https://github.com/jahrlin))
- Fixed release artifact archives generated by Make so that a leading `./` is stripped from paths. This ensures that behavior is the same as v1.7 and earlier ([#5050](https://github.com/cert-manager/cert-manager/pull/5050), [@jahrlin](https://github.com/jahrlin))
- Increase timeouts for cert-manager issuer controllers to 2 minutes and increase ACME client HTTP timeouts to 90 seconds, in order to enable the use of slower ACME issuers which take a long time to process certain requests. ([#5226](https://github.com/cert-manager/cert-manager/pull/5226), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Increases Venafi Issuer timeout for retrieving a certificate increased to 60 seconds, up from 10. This gives TPP instances longer to complete their workflows and make the certificate available before cert-manager times out and re-queues the request. ([#5247](https://github.com/cert-manager/cert-manager/pull/5247), [@hawksight](https://github.com/hawksight))
- Remove `pkg/util/coverage` which broke compatibility with go 1.18; thanks @davidsbond for finding the issue! ([#5032](https://github.com/cert-manager/cert-manager/pull/5032), [@SgtCoDFish](https://github.com/SgtCoDFish))
- `cmctl` and `kubectl cert-manager` now report their actual versions instead of "canary", fixing issue [#5020](https://github.com/cert-manager/cert-manager/issues/5020) ([#5286](https://github.com/cert-manager/cert-manager/pull/5286), [@jetstack-bot](https://github.com/jetstack-bot))

### Other (Cleanup or Flake)

- Adds `make update-all` as a convenience target to run before raising a PR ([#5251](https://github.com/cert-manager/cert-manager/pull/5251), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Adds make targets for updating and verifying CRDs and codegen ([#5242](https://github.com/cert-manager/cert-manager/pull/5242), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Bump cert-manager's version of Go to 1.18 ([#5152](https://github.com/cert-manager/cert-manager/pull/5152), [@lucacome](https://github.com/lucacome))
- Bumps distroless base images to their latest versions ([#5222](https://github.com/cert-manager/cert-manager/pull/5222), [@irbekrm](https://github.com/irbekrm))
- CertificateSigningRequest: no longer mark a request as failed when using the SelfSigned issuer, and the Secret referenced in `experimental.cert-manager.io/private-key-secret-name` doesn't exist. ([#5332](https://github.com/cert-manager/cert-manager/pull/5332), [@jetstack-bot](https://github.com/jetstack-bot))
- Only require python for the one test we have which needs it, rather than requiring it globally ([#5245](https://github.com/cert-manager/cert-manager/pull/5245), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Remove deprecated field `securityContext.enabled` from helm chart ([#4721](https://github.com/cert-manager/cert-manager/pull/4721), [@Dean-Coakley](https://github.com/Dean-Coakley))
- Removes support for `v1beta1` networking API in ingress-shim. ([#5250](https://github.com/cert-manager/cert-manager/pull/5250), [@irbekrm](https://github.com/irbekrm))
- Reverts additional check for `ServiceMonitor` ([#5202](https://github.com/cert-manager/cert-manager/pull/5202), [@irbekrm](https://github.com/irbekrm))
- Updates Kubernetes libraries to `v0.24.2`. ([#5097](https://github.com/cert-manager/cert-manager/pull/5097), [@lucacome](https://github.com/lucacome))
- Updates warning message that is thrown if issuance fails because private key does not match spec, but private key regeneration is disabled. See https://github.com/cert-manager/cert-manager/pull/5199. ([#5199](https://github.com/cert-manager/cert-manager/pull/5199), [@irbekrm](https://github.com/irbekrm))


Thank you to the following community members who had a merged PR for this version - your contributions are at the heart of everything we do!

@AcidLeroy

@oGi4i

@spockz (and @yongk802 who raised a similar PR)

@andrewgkew

@sveba

@rodrigorfk

@craigminihan

@lucacome

@Dean-Coakley


Thanks also to the following maintainers who worked on cert-manager 1.9:

@SgtCoDFish

@jakexks

@wallrj

@maelvls

@JoshVanL

@jahrlin

@munnerz

@irbekrm
