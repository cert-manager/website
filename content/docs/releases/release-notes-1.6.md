---
title: Release 1.6
description: 'cert-manager release notes: cert-manager v1.6'
---

## v1.6.3

### Changes since 1.6.2

#### Bug or Regression

- Bumps the version of Go used to build the cert-manager binaries to 1.17.8, to fix a slew of CVEs (none of which were likely to be exploited) ([#4975](https://github.com/cert-manager/cert-manager/pull/4975), [@vhosakot](https://github.com/vhosakot))
- Fixes an expired hardcoded certificate which broke unit tests ([#4977](https://github.com/cert-manager/cert-manager/pull/4977), [@SgtCoDFish](https://github.com/SgtCoDFish), [@jakexks](https://github.com/jakexks))

## v1.6.2

In 1.6.2, we reverted a change that caused a regression in the ACME Issuer. In 1.6.0 and 1.6.1, the Ingress created by cert-manager while solving an HTTP-01 challenge contained the `kubernetes.io/ingress.class` annotation:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: istio # The `class` present on the Issuer.
```

After 1.5, the Ingress does not contain the annotation anymore. Instead, cert-manager uses the `ingressClassName` field:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
spec:
  ingressClassName: istio # 🔥 Breaking change!
```

This broke many users that either don't use an Ingress controller that supports the field (such as ingress-gce and Azure AGIC), as well as people who did not need to create an IngressClass previously (such as with Istio and Traefik).

The regression is present in cert-manager 1.5.4, 1.6.0, and 1.6.1. It is only present on Kubernetes 1.19+ and only appears when using an Issuer or ClusterIssuer with an ACME HTTP-01 solver configured.

In 1.6.2, we restored the original behavior which is to use the annotation. This patch is also available in 1.5.5 and in 1.7.0.

Most people won't have any trouble upgrading from 1.6.0 or 1.6.1 to 1.6.2. If you are using Gloo, Contour, Skipper, or kube-ingress-aws-controller, you shouldn't have any issues. If you use the default "class" (e.g., `istio` for Istio) for Traefik, Istio, Ambassador, or ingress-nginx, then these should also continue to work without issue.

If you are using Traefik, Istio, Ambassador, or ingress-nginx _and_ you are using a non-default value for the class (e.g., `istio-internal`), or if you experience any issues with your HTTP-01 challenges please read the [notes on Ingress v1 compatibility].

[notes on Ingress v1 compatibility]: https://cert-manager.io/docs/installation/upgrading/ingress-class-compatibility/

### Changelog since v1.6.1

#### Bug or Regression

- The HTTP-01 ACME solver now uses the `kubernetes.io/ingress.class` annotation instead of the `spec.ingressClassName` in created Ingress resources. ([#4785](https://github.com/cert-manager/cert-manager/pull/4785), [@maelvls](https://github.com/maelvls))

#### Other (Cleanup or Flake)

- cert-manager now does one call to the ACME API instead of two when an Order fails. This fix is part of the effort towards mitigating [the high load](https://github.com/cert-manager/cert-manager/issues/3298) that cert-manager deployments have on the Let's Encrypt API ([#4619](https://github.com/cert-manager/cert-manager/pull/4619), [@irbekrm](https://github.com/irbekrm))
- Bump base images to latest versions ([#4707](https://github.com/cert-manager/cert-manager/pull/4707), [@SgtCoDFish](https://github.com/SgtCoDFish))

## v1.6.1

### Changelog since v1.6.0

#### Bug or Regression

- Fixes an issue in `cmctl` that prevented displaying the Order resource with cert-manager 1.6 when running `cmctl status certificate`. ([#4572](https://github.com/cert-manager/cert-manager/pull/4572), [@maelvls](https://github.com/maelvls))
- Update to latest version of keystore-go to address a backwards incompatible change introduced in v1.6.0 ([#4564](https://github.com/cert-manager/cert-manager/pull/4564), [@SgtCoDFish](https://github.com/SgtCoDFish))

## v1.6.0

### Breaking Changes (You **MUST** read this before you upgrade!)

#### Legacy cert-manager API versions are no-longer served

Following their deprecation in version 1.4, the cert-manager API versions `v1alpha2, v1alpha3, and v1beta1` are no longer served.

This means if your deployment manifests contain any of these API versions, you will not be able to deploy them after upgrading. Our new `cmctl` utility or old `kubectl cert-manager` plugin can [convert](../usage/cmctl.md#convert) old manifests to `v1` for you.

<div className="warning">

⛔️  If you are upgrading cert-manager on a cluster which has previously had
cert-manager < `v1.0.0`, you will need to ensure that all cert-manager custom
resources are stored in `etcd` at `v1` version and that cert-manger CRDs do not
reference the deprecated APIs **before you upgrade to `v1.6`**.

This is explained in more detail in the [Upgrading existing cert-manager resources](../installation/upgrading/remove-deprecated-apis.md#upgrading-existing-cert-manager-resources)
page.

</div>

#### JKS Keystore Minimum Password Length

ℹ️ This no longer applies as it was fixed in `v1.6.1`, but will remain here for
informational purposes. If you haven't upgraded cert-manager to `v1.6.0` from any `v1.5`
release, we recommend upgrading straight to the latest version, skipping `v1.6.0`.

In cert-manager `v1.6.0` [JKS Keystores][jks-keystore] had a minimum password length of 6 characters,
as an unintended side effect of [upgrading keystore-go from `v2` to `v4`][jks-keystore-upgrade-pr].
If you are using a shorter password, certificates would have failed to renew,
and the only observable error was in the cert-manager logs.
This was fixed in cert-manager `v1.6.1`.

[jks-keystore]: ../reference/api-docs.md#cert-manager.io/v1.CertificateKeystores
[jks-keystore-upgrade-pr]: https://github.com/cert-manager/cert-manager/pull/4428

### Major Themes

#### Command-line tool User Experience

The cert-manager kubectl plugin has been redesigned as a [standalone utility: `cmctl`][cmctl]

While the kubectl plugin functionality remains intact, using `cmctl` allows for full tab completion.

[cmctl]: ../usage/cmctl.md

#### Supply Chain Security

As part of the wider ecosystem's push for greater supply chain security we are aiming to achieve [SLSA 3](https://slsa.dev/levels#level-requirements) by the 1.7 release date. cert-manager 1.6 has achieved the requirements for SLSA 2 when installed via helm. Our helm chart's signature can be verified with the cert-manager maintainers' public key [published on our website](../installation/code-signing.md).

Our container images will be signed using sigstore's [cosign](https://github.com/sigstore/cosign) as soon as our OCI registry supports it.

#### Tool Chain Updates

cert-manager is now built with go 1.17 ([#4478](https://github.com/cert-manager/cert-manager/pull/4478), [@irbekrm](https://github.com/irbekrm))
and can now be compiled on Apple Silicon ([#4485](https://github.com/cert-manager/cert-manager/pull/4485), [@munnerz](https://github.com/munnerz)).

### Changelog since v1.5.0

#### Feature

- Add Certificate `RenewBefore` Prometheus metrics ([#4419](https://github.com/cert-manager/cert-manager/pull/4419), [@artificial-aidan](https://github.com/artificial-aidan))
- Add option to specify managed identity id when using Azure DNS DNS01 solver ([#4332](https://github.com/cert-manager/cert-manager/pull/4332), [@tomasfreund](https://github.com/tomasfreund))
- Add support for building & developing on M1 macs ([#4485](https://github.com/cert-manager/cert-manager/pull/4485), [@munnerz](https://github.com/munnerz))
- Adds release targets for both `cmctl` as well as `kubectl-cert_manager` ([#4523](https://github.com/cert-manager/cert-manager/pull/4523), [@JoshVanL](https://github.com/JoshVanL))
- Allow setting Helm chart service annotations ([#3639](https://github.com/cert-manager/cert-manager/pull/3639), [@treydock](https://github.com/treydock))
- CLI: Adds `cmctl completion` command for generating shell completion scripts for Bash, ZSH, Fish, and PowerShell ([#4408](https://github.com/cert-manager/cert-manager/pull/4408), [@JoshVanL](https://github.com/JoshVanL))
- CLI: Adds support for auto-completion on runtime objects (Namespaces, CertificateRequests, Certificates etc.) ([#4409](https://github.com/cert-manager/cert-manager/pull/4409), [@JoshVanL](https://github.com/JoshVanL))
- CLI: Only expose Kubernetes related flags on commands that use them ([#4407](https://github.com/cert-manager/cert-manager/pull/4407), [@JoshVanL](https://github.com/JoshVanL))
- Enable configuring CLI command name and registering completion sub-command at build time. ([#4522](https://github.com/cert-manager/cert-manager/pull/4522), [@JoshVanL](https://github.com/JoshVanL))

#### Bug or Regression

- Fix a bug in the Vault client that led to a panic after a request to Vault health endpoint failed. ([#4456](https://github.com/cert-manager/cert-manager/pull/4456), [@JoshVanL](https://github.com/JoshVanL))
- Fix CRDs which were accidentally changed in cert-manager `v1.5.0` ([#4353](https://github.com/cert-manager/cert-manager/pull/4353), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fix a regression in Ingress `PathType` introduced in `v1.5.0` ([#4373](https://github.com/cert-manager/cert-manager/pull/4373), [@jakexks](https://github.com/jakexks))
- Fixed the HTTP-01 solver creating `ClusterIP` instead of `NodePort` services by default. ([#4393](https://github.com/cert-manager/cert-manager/pull/4393), [@jakexks](https://github.com/jakexks))
- Fix a bug where a Certificate may not get renewed when the issued Certificate has a one-second skew between `notBefore` and `notAfter` and `spec.duration` is not used. This one-second skew can be observed on certificates issued with Let's Encrypt and caused a mismatch in time precision between the time stored in `status.renewalTime` and the time internally computed by cert-manager. ([#4399](https://github.com/cert-manager/cert-manager/pull/4399), [@irbekrm](https://github.com/irbekrm))
- Helm chart: the post-install hook `startupapicheck` is now compatible with PodSecurityPolicy. ([#4364](https://github.com/cert-manager/cert-manager/pull/4364), [@ndegory](https://github.com/ndegory))
- Helm chart: the post-install hook `startupapicheck` now deletes any post-install hook resources left after a previous failed install allowing `helm install` to be re-run after a failed attempt. ([#4433](https://github.com/cert-manager/cert-manager/pull/4433), [@wallrj](https://github.com/wallrj))
- The defaults for leader election parameters are now consistent across cert-manager and cainjector. ([#4359](https://github.com/cert-manager/cert-manager/pull/4359), [@johanfleury](https://github.com/johanfleury))
- Use `GetAuthorization` instead of `GetChallenge` when querying the current state of an ACME challenge. ([#4430](https://github.com/cert-manager/cert-manager/pull/4430), [@JoshVanL](https://github.com/JoshVanL))

#### Other (Cleanup or Flake)

- Adds middleware logging back to ACME client for debugging ([#4429](https://github.com/cert-manager/cert-manager/pull/4429), [@JoshVanL](https://github.com/JoshVanL))
- Deprecation: The API versions: `v1alpha2`, `v1alpha3`, and `v1beta1`, are no longer served in cert-manager 1.6 and will be removed in cert-manager 1.7. ([#4482](https://github.com/cert-manager/cert-manager/pull/4482), [@wallrj](https://github.com/wallrj))
- Expose error messages (e.g., invalid access token) from the Cloudflare API to users; allow live testing using Cloudflare API token (not just key). ([#4465](https://github.com/cert-manager/cert-manager/pull/4465), [@andrewmwhite](https://github.com/andrewmwhite))
- Fix manually specified `PKCS#10` CSR and X.509 Certificate version numbers (although these were ignored in practice) ([#4392](https://github.com/cert-manager/cert-manager/pull/4392), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Improves logging for 'owner not found' errors for `CertificateRequest`s owning `Order`s. ([#4369](https://github.com/cert-manager/cert-manager/pull/4369), [@irbekrm](https://github.com/irbekrm))
- Refactor: move from `io/ioutil` to `io` and `os` package ([#4402](https://github.com/cert-manager/cert-manager/pull/4402), [@Juneezee](https://github.com/Juneezee))
- Helm chart and static manifest: the pointless `status` field is now stripped from the CRD manifests. ([#4379](https://github.com/cert-manager/cert-manager/pull/4379), [@irbekrm](https://github.com/irbekrm))
- Update cert-manager base image versions ([#4474](https://github.com/cert-manager/cert-manager/pull/4474), [@SgtCoDFish](https://github.com/SgtCoDFish))
- cert-manager now uses Go 1.17. ([#4478](https://github.com/cert-manager/cert-manager/pull/4478), [@irbekrm](https://github.com/irbekrm))