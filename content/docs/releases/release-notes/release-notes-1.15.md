---
title: Release 1.15
description: 'cert-manager release notes: cert-manager 1.14'
---

> 📢 The cert-manager CLI has moved to a new GitHub repository
>
> From this release, `cmctl` is no longer be released with `cert-manager` itself,
> and there will no further `quay.io/jetstack/cert-manager-ctl` OCI images. 
>
> For the startupapicheck Job you should update references to point at
> `quay.io/jetstack/cert-manager-startupapicheck`
>
> Read [The cert-manager Command Line Tool (cmctl) page](../../reference/cmctl.md) to learn more.

> 📢 Change in how the Helm chart manages CRDs
>
> From this release, the Helm chart will no longer uninstall the CRDs when the 
> chart is uninstalled. If you want the CRDs to be removed on uninstall use 
> `crds.keep=false` when installing the Helm chart.

cert-manager 1.15 promotes several features to beta, including GatewayAPI support (`ExperimentalGatewayAPISupport`), the ability to provide a subject in the Certificate that will be used literally in the CertificateSigningRequest (`LiteralCertificateSubject`) and the outputting of additional certificate formats (`AdditionalCertificateOutputFormats`).

## Community

Thanks again to all open-source contributors with commits in this release, including: [@Pionerd](https://github.com/Pionerd), [@SgtCoDFish](https://github.com/SgtCoDFish), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot), [@andrey-dubnik](https://github.com/andrey-dubnik), [@bwaldrep](https://github.com/bwaldrep), [@eplightning](https://github.com/eplightning), [@erikgb](https://github.com/erikgb), [@findnature](https://github.com/findnature), [@gplessis](https://github.com/gplessis), [@import-shiburin](https://github.com/import-shiburin), [@inteon](https://github.com/inteon), [@jkroepke](https://github.com/jkroepke), [@lunarwhite](https://github.com/lunarwhite), [@mangeshhambarde](https://github.com/mangeshhambarde), [@pwhitehead-splunk](https://github.com/pwhitehead-splunk) & [@rodrigorfk](https://github.com/rodrigorfk), [@wallrj](https://github.com/wallrj).

Thanks also to the following cert-manager maintainers for their contributions during this release: [@SgtCoDFish](https://github.com/SgtCoDFish), [@SpectralHiss](https://github.com/SpectralHiss), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot), [@hawksight](https://github.com/hawksight), [@inteon](https://github.com/inteon), [@maelvls](https://github.com/maelvls) & [@wallrj](https://github.com/wallrj).

Equally thanks to everyone who provided feedback, helped users and raised issues on GitHub and Slack and joined our meetings!

Thanks also to the CNCF, which provides resources and support, and to the AWS open source team for being good community members and for their maintenance of the PrivateCA Issuer.

In addition, massive thanks to Venafi for contributing developer time and resources towards the continued maintenance of cert-manager projects.

## Changes by Kind

### Feature

- GatewayAPI support has graduated to Beta. Add the `--enable-gateway-api` flag to enable the integration. ([#6961](https://github.com/cert-manager/cert-manager/pull/6961), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot))
- Add support to specify a custom key alias in a JKS Keystore ([#6807](https://github.com/cert-manager/cert-manager/pull/6807), [@bwaldrep](https://github.com/bwaldrep))
- Add the ability to communicate with Vault via mTLS when strict client certificates is enabled at Vault server side ([#6614](https://github.com/cert-manager/cert-manager/pull/6614), [@rodrigorfk](https://github.com/rodrigorfk))
- Added option to provide additional audiences in the service account auth section for vault ([#6718](https://github.com/cert-manager/cert-manager/pull/6718), [@andrey-dubnik](https://github.com/andrey-dubnik))
- Venafi Issuer now sends a cert-manager HTTP User-Agent header in all Venafi Rest API requests.
  For example: `cert-manager-certificaterequests-issuer-venafi/v1.15.0+(linux/amd64)+cert-manager/ef068a59008f6ed919b98a7177921ddc9e297200`. ([#6865](https://github.com/cert-manager/cert-manager/pull/6865), [@wallrj](https://github.com/wallrj))
- Add hint to validation error message to help users of external issuers more easily fix the issue if they specify a Kind but forget the Group ([#6913](https://github.com/cert-manager/cert-manager/pull/6913), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Add support for numeric OID types in LiteralSubject. Eg. "1.2.3.4=String Value" ([#6775](https://github.com/cert-manager/cert-manager/pull/6775), [@inteon](https://github.com/inteon))
- Promote the `LiteralCertificateSubject` feature to Beta. ([#7030](https://github.com/cert-manager/cert-manager/pull/7030), [@inteon](https://github.com/inteon))
- Promoted the `AdditionalCertificateOutputFormats` feature gate to Beta (enabled by default). ([#6970](https://github.com/cert-manager/cert-manager/pull/6970), [@erikgb](https://github.com/erikgb))
- The Helm chart now allows you to supply `extraObjects`; a list of YAML manifests which will helm will install and uninstall with the cert-manager manifests. ([#6424](https://github.com/cert-manager/cert-manager/pull/6424), [@gplessis](https://github.com/gplessis))
- Update the Route53 provider to support fetching credentials using AssumeRoleWithWebIdentity ([#6878](https://github.com/cert-manager/cert-manager/pull/6878), [@pwhitehead-splunk](https://github.com/pwhitehead-splunk))
- Helm can now add optional hostAliases to cert-manager Pod to allow the DNS self-check to pass in custom scenarios. ([#6456](https://github.com/cert-manager/cert-manager/pull/6456), [@Pionerd](https://github.com/Pionerd))
- Added a new Ingress annotation for copying specific Ingress annotations to Certificate's secretTemplate ([#6839](https://github.com/cert-manager/cert-manager/pull/6839), [@mangeshhambarde](https://github.com/mangeshhambarde))
- Added option to define additional token audiences for the Vault Kubernetes auth ([#6744](https://github.com/cert-manager/cert-manager/pull/6744), [@andrey-dubnik](https://github.com/andrey-dubnik))
- Allow `cert-manager.io/allow-direct-injection` in annotations ([#6801](https://github.com/cert-manager/cert-manager/pull/6801), [@jkroepke](https://github.com/jkroepke))

### Design

- Remove repetitive words ([#6949](https://github.com/cert-manager/cert-manager/pull/6949), [@findnature](https://github.com/findnature))

### Bug or Regression

- BUGFIX: Fixes issue with JSON-logging, where only a subset of the log messages were output as JSON. ([#6779](https://github.com/cert-manager/cert-manager/pull/6779), [@inteon](https://github.com/inteon))
- BUGFIX: JKS and PKCS12 stores now contain the full set of CAs specified by an issuer ([#6806](https://github.com/cert-manager/cert-manager/pull/6806), [@bwaldrep](https://github.com/bwaldrep))
- BUGFIX: cainjector leader election flag/config option defaults are missing ([#6816](https://github.com/cert-manager/cert-manager/pull/6816), [@inteon](https://github.com/inteon))
- BUGFIX: cert-manager issuers incorrectly copied the critical flag from the CSR instead of re-calculating that field themselves. ([#6724](https://github.com/cert-manager/cert-manager/pull/6724), [@inteon](https://github.com/inteon))
- Breaking Change: Fixed unintended certificate chain is used if `preferredChain` is configured. ([#6755](https://github.com/cert-manager/cert-manager/pull/6755), [@import-shiburin](https://github.com/import-shiburin))
- Bugfix: LiteralSubjects with a #= value can result in memory issues due to faulty BER parser (`github.com/go-asn1-ber/asn1-ber`). ([#6770](https://github.com/cert-manager/cert-manager/pull/6770), [@inteon](https://github.com/inteon))
- DigitalOcean: Ensure that only TXT records are considered for deletion when cleaning up after an ACME challenge ([#6875](https://github.com/cert-manager/cert-manager/pull/6875), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fix backwards incompatible removal of default Prometheus Service resource. ([#6699](https://github.com/cert-manager/cert-manager/pull/6699), [@inteon](https://github.com/inteon))
- Fix broken cainjector image value in Helm chart ([#6692](https://github.com/cert-manager/cert-manager/pull/6692), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Helm: Fix a bug in the logic that differentiates between 0 and an empty value. ([#6713](https://github.com/cert-manager/cert-manager/pull/6713), [@inteon](https://github.com/inteon))
- Make sure the Azure SDK error messages are stable. ([#6676](https://github.com/cert-manager/cert-manager/pull/6676), [@inteon](https://github.com/inteon))
- When using the literalSubject on a Certificate, the webhook validation for the common name now also points to the literalSubject. ([#6767](https://github.com/cert-manager/cert-manager/pull/6767), [@lunarwhite](https://github.com/lunarwhite))
- Bump `golang.org/x/net` to fix `CVE-2023-45288` ([#6929](https://github.com/cert-manager/cert-manager/pull/6929), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fix ACME issuer being stuck waiting for DNS propagation when using Azure DNS with multiple instances issuing for the same FQDN ([#6351](https://github.com/cert-manager/cert-manager/pull/6351), [@eplightning](https://github.com/eplightning))
- Fix cainjector ConfigMap not mounted in the cainjector deployment. ([#7055](https://github.com/cert-manager/cert-manager/pull/7055), [@inteon](https://github.com/inteon))
- Added `disableAutoApproval` and `approveSignerNames` Helm chart options. ([#7054](https://github.com/cert-manager/cert-manager/pull/7054), [@inteon](https://github.com/inteon))

### Other (Cleanup or Flake)

- Bump base images ([#6840](https://github.com/cert-manager/cert-manager/pull/6840), [@inteon](https://github.com/inteon))
- Bump `github.com/go-jose/go-jose` to `v3.0.3` to fix `CVE-2024-28180` ([#6854](https://github.com/cert-manager/cert-manager/pull/6854), [@wallrj](https://github.com/wallrj))
- Removed deprecated util functions that have been replaced by the `slices` and `k8s.io/apimachinery/pkg/util` packages.
  Removed deprecated CSR functions which have been replaced with other functions in the `pkg/util/pki` package. ([#6730](https://github.com/cert-manager/cert-manager/pull/6730), [@inteon](https://github.com/inteon))
- Upgrade go to 1.21.8: fixes `CVE-2024-24783` ([#6823](https://github.com/cert-manager/cert-manager/pull/6823), [@inteon](https://github.com/inteon))
- Upgrade go to latest version 1.22.1 ([#6831](https://github.com/cert-manager/cert-manager/pull/6831), [@inteon](https://github.com/inteon))
- Upgrade `google.golang.org/protobuf`: fixing `GO-2024-2611` ([#6827](https://github.com/cert-manager/cert-manager/pull/6827), [@inteon](https://github.com/inteon))
- `cmctl` and `kubectl cert-manger` have been moved to the https://github.com/cert-manager/cmctl repo and will be versioned separately starting with `cmctl` `v2.0.0` ([#6663](https://github.com/cert-manager/cert-manager/pull/6663), [@inteon](https://github.com/inteon))
- ⚠️ Possibly breaking: Helm will now keep the CRDs when you uninstall cert-manager by default to prevent accidental data loss
  Add new `crds.keep` and `crds.enabled` Helm options which will replace the `installCRDs` option. ([#6760](https://github.com/cert-manager/cert-manager/pull/6760), [@inteon](https://github.com/inteon))
- Graduate the `DisallowInsecureCSRUsageDefinition` feature gate to GA. (part 2) ([#6963](https://github.com/cert-manager/cert-manager/pull/6963), [@inteon](https://github.com/inteon))
- Remove deprecated `pkg/util/pki/ParseSubjectStringToRawDERBytes` function. ([#6994](https://github.com/cert-manager/cert-manager/pull/6994), [@inteon](https://github.com/inteon))
- Upgrade Kind to `v0.23.0` and update supported node image digests ([#7020](https://github.com/cert-manager/cert-manager/pull/7020), @github-actions[bot])
- If the `--controllers` flag only specifies disabled controllers, the default controllers are now enabled implicitly. ([#7054](https://github.com/cert-manager/cert-manager/pull/7054), [@inteon](https://github.com/inteon))
- Upgrade to Go 1.22.3, fixing `GO-2024-2824`. ([#6996](https://github.com/cert-manager/cert-manager/pull/6996), @github-actions[bot])