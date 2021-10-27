---
title: "Release 1.6"
linkTitle: "v1.6"
weight: 770
type: "docs"
---

## Breaking Changes (You **MUST** read this before you upgrade!)

### Legacy cert-manager API versions are no-longer served

Following their deprecation in version 1.5, the cert-manager API versions `v1alpha2, v1alpha3, and v1beta1` are no longer served.

This means if your deployment manifests contain any of these API versions, you will not be able to deploy them after upgrading. Our new `cmctl` utility or old `kubectl cert-manager` plugin can [convert](https://cert-manager.io/docs/usage/kubectl-plugin/#convert) old manifests to `v1` for you.

### JKS Keystore Minimum Password Length

[JKS Keystores][jks-keystore] now have a minimum password length of 6 characters,
as an unintended side effect of [upgrading keystore-go from `v2` to `v4`][jks-keystore-upgrade-pr].
If you are using a shorter password, certificates will fail to renew,
and the only observable error will be in the cert-manager logs.
We are discussing the best remediation for a future `v1.6.1` release.

[jks-keystore]: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.CertificateKeystores
[jks-keystore-upgrade-pr]: https://github.com/jetstack/cert-manager/pull/4428

## Major Themes

### Command-line tool User Experience

The cert-manager kubectl plugin has been redesigned as a standalone utility: `cmctl`

While the kubectl plugin functionality remains intact, using `cmctl` allows for full tab completion. See the docs: (Alan please add link)

### Supply Chain Security

As part of the wider ecosystem's push for greater supply chain security we are aiming to achieve [SLSA 3](https://slsa.dev/levels#level-requirements) by the 1.7 release date. cert-manager 1.6 has achieved the requirements for SLSA 2 when installed via helm. Our helm chart's signature can be verified with the cert-manager maintainers' public key [published on our website](../../installation/code-signing/).

Our container images will be signed using sigstore's [cosign](https://github.com/sigstore/cosign) as soon as our OCI registry supports it.

### Tool Chain Updates

cert-manager is now built with go 1.17 ([#4478](https://github.com/jetstack/cert-manager/pull/4478), [@irbekrm](https://github.com/irbekrm))
and can now be compiled on Apple Silicon ([#4485](https://github.com/jetstack/cert-manager/pull/4485), [@munnerz](https://github.com/munnerz)).

## Changes by Kind

### Feature

- Add Certificate `RenewBefore` Prometheus metrics ([#4419](https://github.com/jetstack/cert-manager/pull/4419), [@artificial-aidan](https://github.com/artificial-aidan))
- Add option to specify managed identity id when using Azure DNS DNS01 solver ([#4332](https://github.com/jetstack/cert-manager/pull/4332), [@tomasfreund](https://github.com/tomasfreund))
- Add support for building & developing on M1 macs ([#4485](https://github.com/jetstack/cert-manager/pull/4485), [@munnerz](https://github.com/munnerz))
- Adds release targets for both `cmctl` as well as `kubectl-cert_manager` ([#4523](https://github.com/jetstack/cert-manager/pull/4523), [@JoshVanL](https://github.com/JoshVanL))
- Allow setting Helm chart service annotations ([#3639](https://github.com/jetstack/cert-manager/pull/3639), [@treydock](https://github.com/treydock))
- CLI: Adds `cmctl completion` command for generating shell completion scripts for Bash, ZSH, Fish, and PowerShell ([#4408](https://github.com/jetstack/cert-manager/pull/4408), [@JoshVanL](https://github.com/JoshVanL))
- CLI: Adds support for auto-completion on runtime objects (Namespaces, CertificateRequests, Certificates etc.) ([#4409](https://github.com/jetstack/cert-manager/pull/4409), [@JoshVanL](https://github.com/JoshVanL))
- CLI: Only expose Kubernetes related flags on commands that use them ([#4407](https://github.com/jetstack/cert-manager/pull/4407), [@JoshVanL](https://github.com/JoshVanL))
- Enable configuring CLI command name and registering completion sub-command at build time. ([#4522](https://github.com/jetstack/cert-manager/pull/4522), [@JoshVanL](https://github.com/JoshVanL))

### Bug or Regression

- FIX: Prevent Vault Client panic when request to Vault health endpoint fails. ([#4456](https://github.com/jetstack/cert-manager/pull/4456), [@JoshVanL](https://github.com/JoshVanL))
- Fix CRDs which were accidentally changed in cert-manager `v1.5.0` ([#4353](https://github.com/jetstack/cert-manager/pull/4353), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fix regression in Ingress `PathType` introduced in `v1.5.0` ([#4373](https://github.com/jetstack/cert-manager/pull/4373), [@jakexks](https://github.com/jakexks))
- Fixed the HTTP-01 solver creating `ClusterIP` instead of `NodePort` services by default. ([#4393](https://github.com/jetstack/cert-manager/pull/4393), [@jakexks](https://github.com/jakexks))
- Fixes renewal time issue for certs with skewed duration period. ([#4399](https://github.com/jetstack/cert-manager/pull/4399), [@irbekrm](https://github.com/irbekrm))
- Pod Security Policy for startup API check job ([#4364](https://github.com/jetstack/cert-manager/pull/4364), [@ndegory](https://github.com/ndegory))
- The `startupapicheck` post-install hook in the Helm chart now deletes any post-install hook resources left after a previous failed install allowing helm install to be re-run after a previous failure. ([#4433](https://github.com/jetstack/cert-manager/pull/4433), [@wallrj](https://github.com/wallrj))
- The defaults for leader election parameters are now consistent across cert-manager and cainjector. ([#4359](https://github.com/jetstack/cert-manager/pull/4359), [@johanfleury](https://github.com/johanfleury))
- Use `GetAuthorization` instead of `GetChallenge` when querying the current state of an ACME challenge. ([#4430](https://github.com/jetstack/cert-manager/pull/4430), [@JoshVanL](https://github.com/JoshVanL))

### Other (Cleanup or Flake)

- Adds middleware logging back to ACME client for debugging ([#4429](https://github.com/jetstack/cert-manager/pull/4429), [@JoshVanL](https://github.com/JoshVanL))
- Deprecation: The API versions: `v1alpha2`, `v1alpha3`, and `v1beta1`, are no longer served in cert-manager 1.6 and will be removed in cert-manager 1.7. ([#4482](https://github.com/jetstack/cert-manager/pull/4482), [@wallrj](https://github.com/wallrj))
- Expose error messages (e.g., invalid access token) from the Cloudflare API to users; allow live testing using Cloudflare API token (not just key). ([#4465](https://github.com/jetstack/cert-manager/pull/4465), [@andrewmwhite](https://github.com/andrewmwhite))
- Fix manually specified `PKCS#10` CSR and X.509 Certificate version numbers (although these were ignored in practice) ([#4392](https://github.com/jetstack/cert-manager/pull/4392), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Improves logging for 'owner not found' errors for `CertificateRequest`s owning `Order`s. ([#4369](https://github.com/jetstack/cert-manager/pull/4369), [@irbekrm](https://github.com/irbekrm))
- Refactor: move from `io/ioutil` to `io` and `os` package ([#4402](https://github.com/jetstack/cert-manager/pull/4402), [@Juneezee](https://github.com/Juneezee))
- Removes status fields from CRD manifests ([#4379](https://github.com/jetstack/cert-manager/pull/4379), [@irbekrm](https://github.com/irbekrm))
- Update cert-manager base image versions ([#4474](https://github.com/jetstack/cert-manager/pull/4474), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Uses Go 1.17 ([#4478](https://github.com/jetstack/cert-manager/pull/4478), [@irbekrm](https://github.com/irbekrm))
