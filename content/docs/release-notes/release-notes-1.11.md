---
title: Release 1.11
description: 'cert-manager release notes: cert-manager 1.11'
---

> ⚠️ This release is not yet ready for production.
> The first stable version is due to be published in January 2023.
> The latest **pre-release** version is [`v1.11.0-beta.0`](https://github.com/cert-manager/cert-manager/releases/tag/v1.11.0-beta.0).

## Community

Thanks again to all open-source contributors with commits in this release, including:

- [@cmcga1125](https://github.com/cmcga1125)
- [@karlschriek](https://github.com/karlschriek)
- [@lvyanru8200](https://github.com/lvyanru8200)
- [@mmontes11](https://github.com/mmontes11)
- [@pinkfloydx33](https://github.com/pinkfloydx33)
- [@sathyanarays](https://github.com/sathyanarays)
- [@weisdd](https://github.com/weisdd)
- [@yann-soubeyrand](https://github.com/yann-soubeyrand)

## Changes since 1.10.1

### Feature

- Helm: allow configuring the image used by ACME HTTP-01 solver ([#5554](https://github.com/cert-manager/cert-manager/pull/5554), [@yann-soubeyrand](https://github.com/yann-soubeyrand))
- Add the `--max-concurrent-challenges` controller flag to the helm chart ([#5638](https://github.com/cert-manager/cert-manager/pull/5638), [@lvyanru8200](https://github.com/lvyanru8200))
- Adds the ability to specify a custom CA bundle in Issuers when connecting to an ACME server ([#5644](https://github.com/cert-manager/cert-manager/pull/5644), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Enable testing against Kubernetes 1.26 and test with Kubernetes 1.26 by default ([#5646](https://github.com/cert-manager/cert-manager/pull/5646), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Experimental make targets for pushing images to an OCI registry using `ko` and redeploying cert-manager to the cluster referenced by your current KUBECONFIG context. ([#5655](https://github.com/cert-manager/cert-manager/pull/5655), [@wallrj](https://github.com/wallrj))
- Add ability to run acmesolver pods as root if desired. The default is still to run as non-root. ([#5546](https://github.com/cert-manager/cert-manager/pull/5546), [@cmcga1125](https://github.com/cmcga1125))
- Add support for DC and UID in `LiteralSubject` field, all mandatory OIDs are now supported for LDAP certificates (rfc4514). ([#5587](https://github.com/cert-manager/cert-manager/pull/5587), [@SpectralHiss](https://github.com/SpectralHiss))
- Add support for Workload Identity to AzureDNS resolver ([#5570](https://github.com/cert-manager/cert-manager/pull/5570), [@weisdd](https://github.com/weisdd))
- Breaking: updates the gateway API integration to use the more stable v1beta1 API version. Any users of the cert-manager `ExperimentalGatewayAPISupport` alpha feature must ensure that `v1beta` of Gateway API is installed in cluster. ([#5583](https://github.com/cert-manager/cert-manager/pull/5583), [@lvyanru8200](https://github.com/lvyanru8200))
- Certificate secrets get refreshed if the keystore format change ([#5597](https://github.com/cert-manager/cert-manager/pull/5597), [@sathyanarays](https://github.com/sathyanarays))
- Introducing UseCertificateRequestBasicConstraints feature flag to enable Basic Constraints in the Certificate Signing Request ([#5552](https://github.com/cert-manager/cert-manager/pull/5552), [@sathyanarays](https://github.com/sathyanarays))
- Return error when Gateway has a cross-namespace secret ref ([#5613](https://github.com/cert-manager/cert-manager/pull/5613), [@mmontes11](https://github.com/mmontes11))
- Signers fire an event on CertificateRequests which have not been approved yet. Used for informational purposes so users understand why a request is not progressing. ([#5535](https://github.com/cert-manager/cert-manager/pull/5535), [@JoshVanL](https://github.com/JoshVanL))

### Bug or Regression

- Don't log errors relating to self-signed issuer checks for external issuers ([#5681](https://github.com/cert-manager/cert-manager/pull/5681), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fixed a bug in AzureDNS resolver that led to early reconciliations in misconfigured Workload Identity-enabled setups (when Federated Identity Credential is not linked with a controller's k8s service account) ([#5663](https://github.com/cert-manager/cert-manager/pull/5663), [@weisdd](https://github.com/weisdd))
- Use manually specified temporary directory template when verifying CRDs ([#5680](https://github.com/cert-manager/cert-manager/pull/5680), [@SgtCoDFish](https://github.com/SgtCoDFish))
- `vcert` was upgraded to `v4.23.0`, fixing two bugs in cert-manager. The first bug was preventing the Venafi issuer from renewing certificates when using TPP has been fixed. You should no longer see your certificates getting stuck with `WebSDK CertRequest Module Requested Certificate` or `This certificate cannot be processed while it is in an error state. Fix any errors, and then click Retry.`. The second bug that was fixed prevented the use of `algorithm: Ed25519` in Certificate resources with VaaS. ([#5674](https://github.com/cert-manager/cert-manager/pull/5674), [@maelvls](https://github.com/maelvls))
- Upgrade `golang/x/net` to fix CVE-2022-41717 ([#5632](https://github.com/cert-manager/cert-manager/pull/5632), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Bug fix: When using feature gates with the helm chart, enable feature gate flags on webhook as well as controller ([#5584](https://github.com/cert-manager/cert-manager/pull/5584), [@lvyanru8200](https://github.com/lvyanru8200))
- Fix `golang.org/x/text` vulnerability ([#5562](https://github.com/cert-manager/cert-manager/pull/5562), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fixes a bug that caused the Vault issuer to omit the Vault namespace in requests to the Vault API. ([#5591](https://github.com/cert-manager/cert-manager/pull/5591), [@wallrj](https://github.com/wallrj))
- The Venafi Issuer now supports TLS 1.2 renegotiation, so that it can connect to TPP servers where the vedauth API endpoints are configured to *accept* client certificates. (Note: This does not mean that the Venafi Issuer supports client certificate authentication). ([#5568](https://github.com/cert-manager/cert-manager/pull/5568), [@wallrj](https://github.com/wallrj))
- Upgrade to go 1.19.4 to fix CVE-2022-41717 ([#5619](https://github.com/cert-manager/cert-manager/pull/5619), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Upgrade to latest go minor release ([#5559](https://github.com/cert-manager/cert-manager/pull/5559), [@SgtCoDFish](https://github.com/SgtCoDFish))
