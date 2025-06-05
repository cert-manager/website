---
title: Release 1.18
description: 'cert-manager release notes: cert-manager 1.18'
---

cert-manager is the easiest way to automatically manage certificates in Kubernetes and OpenShift clusters.

## Major Themes

### ACME Certificate Profile Selection

cert-manager now supports the selection of ACME certificate profiles, allowing
users to request different categories of certificates from their ACME
Certificate Authority.
This enhancement leverages the latest [ACME protocol extension for certificate profiles (IETF draft)][rfc] and is supported by Let's Encrypt and other providers.
For example, Let's Encrypt offers the [`tlsserver`][tlsserver] profile for
standard server certificates and the [`shortlived`][shortlived] profile for
short-lived six-day certificates.
These new options provide users with greater flexibility and improved security
for their certificate management needs.

[rfc]: https://datatracker.ietf.org/doc/draft-ietf-acme-profile/
[tlsserver]: https://letsencrypt.org/2025/01/09/acme-profiles/
[shortlived]: https://letsencrypt.org/2025/02/20/first-short-lived-cert-issued/

### The default value of `Certificate.Spec.PrivateKey.RotationPolicy` is now `Always`

> ⚠️ Breaking change

We have changed the default value of `Certificate.Spec.PrivateKey.RotationPolicy` from `Never` to `Always`.

Why? Because the old default was unintuitive and insecure.
For example, if a private key is exposed, users may (reasonably) assume that
re-issuing a certificate (e.g. using `cmctl renew`) will generate a new private
key, but it won't unless the user has explicitly set `rotationPolicy: Always` on the Certificate resource.

This change is feature gated and is enabled by default, because it has been fast-tracked to beta status.

Users who want to preserve the old default have two options:
1. Explicitly set `rotationPolicy: Never` on your Certificate resources.
2. Turn off the feature gate in this release and explicitly set
   `rotationPolicy: Never` on your Certificates before release 1.19.
   In release 1.19, the feature will be marked as GA and it will no longer be
   possible to turn off the feature.

The following Helm chart values can be used to turn off the feature gate:

```yaml
# values.yaml
config:
  featureGates:
    DefaultPrivateKeyRotationPolicyAlways: false
```

> ℹ️ The old default value `Never` was always intended to be changed before API `v1`, as can be seen in the description of the [original PR](https://github.com/cert-manager/cert-manager/pull/2814):
> > For backward compatibility, the empty value is treated as 'Never' which matches the behavior we have today.
> > In a future API version, we can flip this default to be Always.
>
> 📖 See [Issue: 7601: Change `PrivateKey.RotationPolicy` to default to Always](https://github.com/cert-manager/cert-manager/issues/7601) to read the proposal for this change and the discussion around it.
>
> 📖 Read [cert-manager component configuration](../../installation/configuring-components.md) to learn more about feature gates.
>
> 📖 Read our updated [API compatibility statement](../../contributing/api-compatibility.md) which now reflects our new, more flexible, approach to changing API defaults, with a view to introducing other "sane" default API values in future releases.
>
> 📖 Read [Issuance behavior: Rotation of the private key](../../usage/certificate.md#issuance-behavior-rotation-of-the-private-key) to learn more about private key rotation in cert-manager.


### The default value of `Certificate.Spec.RevisionHistoryLimit` is now `1`

The default value for the `Certificate` resource's `revisionHistoryLimit` field is now set to 1.
This ensures that old `CertificateRequest` revisions are automatically garbage collected, improving resource management and reducing clutter in clusters.
Previously, if not specified, no limit was applied, potentially leading to an accumulation of stale `CertificateRequest` resources.
With this update, users no longer need to manually configure the revision history limit to benefit from automated cleanup.

### Copy annotations from Ingress or Gateway to the Certificate

We've added a new configuration option to the cert-manager controller: `--extra-certificate-annotations`, which allows you to specify annotation keys to be copied from an Ingress or Gateway resource to the resulting Certificate object.
Read [Annotated Ingress resource: Copy annotations to the Certificate](../../usage/ingress.md#copy-annotations-to-the-certificate ), and
[Annotated Gateway resource: Copy annotations to the Certificate](../../usage/gateway.md#copy-annotations-to-the-certificate), to learn more.

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:

- [`@terinjokes`](https://github.com/terinjokes)
- [`@solidDoWant`](https://github.com/solidDoWant)
- [`@k0da`](https://github.com/k0da)
- [`@ali-hamza-noor`](https://github.com/ali-hamza-noor)
- [`@tareksha`](https://github.com/tareksha)
- [`@ThatsIvan`](https://github.com/ThatsIvan)
- [`@jsoref`](https://github.com/jsoref)
- [`@jcpunk`](https://github.com/jcpunk)
- [`@teslaedison`](https://github.com/teslaedison)
- [`@NicholasBlaskey`](https://github.com/NicholasBlaskey)
- [`@sspreitzer`](https://github.com/sspreitzer)
- [`@tsaarni`](https://github.com/tsaarni)
- [`@johnjcool`](https://github.com/johnjcool)
- [`@LukeCarrier`](https://github.com/LukeCarrier)
- [`@tobiasbp`](https://github.com/tobiasbp)
- [`@vehagn`](https://github.com/vehagn)
- [`@cuinix`](https://github.com/cuinix)

for their contributions, comments and support!

Also, thanks to the cert-manager maintainer team for their help in this release:

- [@inteon](https://github.com/inteon)
- [@erikgb](https://github.com/erikgb)
- [@SgtCoDFish](https://github.com/SgtCoDFish)
- [@ThatsMrTalbot](https://github.com/ThatsMrTalbot)
- [@munnerz](https://github.com/munnerz)
- [@maelvls](https://github.com/maelvls)

And finally, thanks to the cert-manager steering committee for their feedback in this release cycle:

- [@FlorianLiebhart](https://github.com/FlorianLiebhart)
- [@ssyno](https://github.com/ssyno)
- [@ianarsenault](https://github.com/ianarsenault)
- [@TrilokGeer](https://github.com/TrilokGeer)


## `v1.18.0`

Changes since `v1.17.0`:

### Feature

- Add config to the Vault issuer to allow the server-name to be specified when validating the certificates the Vault server presents. ([`#7663`](https://github.com/cert-manager/cert-manager/pull/7663), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- Added `app.kubernetes.io/managed-by: cert-manager` label to the created Let's Encrypt account keys ([`#7577`](https://github.com/cert-manager/cert-manager/pull/7577), [`@terinjokes`](https://github.com/terinjokes))
- Added certificate issuance and expiration time metrics (`certmanager_certificate_not_before_timestamp_seconds`, `certmanager_certificate_not_after_timestamp_seconds`). ([`#7612`](https://github.com/cert-manager/cert-manager/pull/7612), [`@solidDoWant`](https://github.com/solidDoWant))
- Added ingress-shim option `--extra-certificate-annotations`, which sets a list of annotation keys to be copied from Ingress-like to resulting Certificate object ([`#7083`](https://github.com/cert-manager/cert-manager/pull/7083), [`@k0da`](https://github.com/k0da))
- Added the `iss` short name for the cert-manager `Issuer` resource
- Added the `ciss` short name for the cert-manager `ClusterIssuer` resource ([`#7373`](https://github.com/cert-manager/cert-manager/pull/7373), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Adds the `global.rbac.disableHTTPChallengesRole` helm value to disable HTTP-01 ACME challenges. This allows cert-manager to drop its permission to create pods, improving security when HTTP-01 challenges are not required. ([`#7666`](https://github.com/cert-manager/cert-manager/pull/7666), [`@ali-hamza-noor`](https://github.com/ali-hamza-noor))
- Allow customizing signature algorithm ([`#7591`](https://github.com/cert-manager/cert-manager/pull/7591), [`@tareksha`](https://github.com/tareksha))
- Cache the full DNS response and handle TTL expiration in `FindZoneByFqdn` ([`#7596`](https://github.com/cert-manager/cert-manager/pull/7596), [`@ThatsIvan`](https://github.com/ThatsIvan))
- Cert-manager now uses a local fork of the `golang.org/x/crypto/acme` package ([`#7752`](https://github.com/cert-manager/cert-manager/pull/7752), [`@wallrj`](https://github.com/wallrj))
- Feature: Add support for [`ACME profiles extension`](https://datatracker.ietf.org/doc/draft-aaron-acme-profiles/). ([`#7777`](https://github.com/cert-manager/cert-manager/pull/7777), [`@wallrj`](https://github.com/wallrj))
- Promote the `UseDomainQualifiedFinalizer` feature to GA. ([`#7735`](https://github.com/cert-manager/cert-manager/pull/7735), [`@jsoref`](https://github.com/jsoref))
- Switched `service/servicemon` definitions to use port names instead of numbers. ([`#7727`](https://github.com/cert-manager/cert-manager/pull/7727), [`@jcpunk`](https://github.com/jcpunk))
- The default value of `Certificate.Spec.PrivateKey.RotationPolicy` changed from `Never` to `Always`. ([`#7723`](https://github.com/cert-manager/cert-manager/pull/7723), [`@wallrj`](https://github.com/wallrj))
- ⚠️ might be breaking: Set the default `revisionHistoryLimit` to 1 for the CertificateRequest revisions ([`#7758`](https://github.com/cert-manager/cert-manager/pull/7758), [`@ali-hamza-noor`](https://github.com/ali-hamza-noor))

### Documentation

- Fix some comments ([`#7620`](https://github.com/cert-manager/cert-manager/pull/7620), [`@teslaedison`](https://github.com/teslaedison))

### Bug or Regression

- Bump `go-jose` dependency to address `CVE-2025-27144`. ([`#7606`](https://github.com/cert-manager/cert-manager/pull/7606), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Bump `golang.org/x/oauth2` to patch `CVE-2025-22868`.
- Bump `golang.org/x/crypto` to patch `GHSA-hcg3-q754-cr77`.
- Bump `github.com/golang-jwt/jwt` to patch `GHSA-mh63-6h87-95cp`. ([`#7638`](https://github.com/cert-manager/cert-manager/pull/7638), [`@NicholasBlaskey`](https://github.com/NicholasBlaskey))
- Change of the Kubernetes Ingress `pathType` from `ImplementationSpecific` to `Exact` for a reliable handling of ingress controllers and enhanced security. ([`#7767`](https://github.com/cert-manager/cert-manager/pull/7767), [`@sspreitzer`](https://github.com/sspreitzer))
- Fix AWS Route53 error detection for not-found errors during deletion of DNS records. ([`#7690`](https://github.com/cert-manager/cert-manager/pull/7690), [`@wallrj`](https://github.com/wallrj))
- Fix behavior when running with `--namespace=<namespace>`: limit the scope of cert-manager to a single namespace and disable cluster-scoped controllers. ([`#7678`](https://github.com/cert-manager/cert-manager/pull/7678), [`@tsaarni`](https://github.com/tsaarni))
- Fix handling of certificates with IP addresses in the `commonName` field; IP addresses are no longer added to the DNS `subjectAlternativeName` list and are instead added to the `ipAddresses` field as expected. ([`#7081`](https://github.com/cert-manager/cert-manager/pull/7081), [`@johnjcool`](https://github.com/johnjcool))
- Fix issuing of certificates via DNS01 challenges on Cloudflare after a breaking change to the Cloudflare API ([`#7549`](https://github.com/cert-manager/cert-manager/pull/7549), [`@LukeCarrier`](https://github.com/LukeCarrier))
- Fixed the `certmanager_certificate_renewal_timestamp_seconds` metric help text indicating that the metric is relative to expiration time, rather than Unix epoch time. ([`#7609`](https://github.com/cert-manager/cert-manager/pull/7609), [`@solidDoWant`](https://github.com/solidDoWant))
- Fixing the service account template to incorporate boolean values for the annotations. ([`#7698`](https://github.com/cert-manager/cert-manager/pull/7698), [`@ali-hamza-noor`](https://github.com/ali-hamza-noor))
- Quote nodeSelector values in Helm Chart ([`#7579`](https://github.com/cert-manager/cert-manager/pull/7579), [`@tobiasbp`](https://github.com/tobiasbp))
- Skip Gateway TLS listeners in `Passthrough` mode. ([`#6986`](https://github.com/cert-manager/cert-manager/pull/6986), [`@vehagn`](https://github.com/vehagn))
- Upgrade `golang.org/x/net` fixing `CVE-2025-22870`. ([`#7619`](https://github.com/cert-manager/cert-manager/pull/7619), [`@depandabot[bot]`](https://github.com/apps/dependabot))

### Other (Cleanup or Flake)

- ACME E2E Tests: Upgraded Pebble to `v2.7.0` and modified the ACME tests to match latest Pebble behavior. ([`#7771`](https://github.com/cert-manager/cert-manager/pull/7771), [`@wallrj`](https://github.com/wallrj))
- Patch the `third_party/forked/acme` package with support for the ACME profiles extension. ([`#7776`](https://github.com/cert-manager/cert-manager/pull/7776), [`@wallrj`](https://github.com/wallrj))
- Promote the `AdditionalCertificateOutputFormats` feature to GA, making additional formats always enabled. ([`#7744`](https://github.com/cert-manager/cert-manager/pull/7744), [`@erikgb`](https://github.com/erikgb))
- Remove deprecated feature gate `ValidateCAA`. Setting this feature gate is now a no-op which does nothing but print a warning log line ([`#7553`](https://github.com/cert-manager/cert-manager/pull/7553), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Use `slices.Contains` to simplify code ([`#7753`](https://github.com/cert-manager/cert-manager/pull/7753), [`@cuinix`](https://github.com/cuinix))
