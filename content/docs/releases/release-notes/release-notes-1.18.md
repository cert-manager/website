---
title: Release 1.18
description: 'cert-manager release notes: cert-manager 1.18'
---

cert-manager is the easiest way to automatically manage certificates in Kubernetes and OpenShift clusters.

cert-manager 1.18 introduces several new features and breaking changes.
Highlights include support for ACME certificate profiles,
a new default for `Certificate.Spec.PrivateKey.RotationPolicy` now set to `Always` (breaking change), and
the default `Certificate.Spec.RevisionHistoryLimit` now set to `1` (potentially breaking).
Be sure to review all new features and changes below, and read the full release notes carefully before upgrading.

## Major Themes

### OperatorHub Packages Discontinued

We no longer publish OperatorHub packages for cert-manager.
Why? Because the cert-manager maintainers no longer have the time or resources to maintain and test those packages.
cert-manager `v1.16.5` is the last release on OperatorHub.

> ℹ️ [cert-manager `v1.16.5` for RedHat OpenShift OperatorHub](https://github.com/redhat-openshift-ecosystem/community-operators-prod/tree/main/operators/cert-manager/1.16.5).
>
> ℹ️ [cert-manager `v1.16.5` for `operatorhub.io`](https://github.com/k8s-operatorhub/community-operators/tree/main/operators/cert-manager/1.16.5).
>
> ℹ️ [Archived `cert-manager-olm` repository](https://github.com/cert-manager/cert-manager-olm).

### ACME HTTP01 challenge paths now use `PathType` `Exact` in Ingress routes

> ⚠️ Breaking change

We have changed the `PathType` for ACME HTTP01 Ingress-based challenges to `Exact`.
This security feature ensures that the challenge path (which is an exact path)
is not misinterpreted as a regular expression or some other Ingress-specific
(`ImplementationSpecific`) parsing.
This allows HTTP01 challenges to be solved when using standards compliant
Ingress controllers such as Cilium.

This change is incompatible with certain versions and configurations of the `ingress-nginx` Ingress controller.
Versions of [`ingress-nginx >=1.8.0`](https://github.com/kubernetes/ingress-nginx/blob/main/changelog/controller-1.8.0.md) support a [`strict-validate-path-type` configuration option](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#strict-validate-path-type) which, when enabled, disallows `.` (dot) in the path value. This is a [bug](https://github.com/kubernetes/ingress-nginx/issues/11176) which makes it impossible to use various legitimate URL paths, including the  `http://<YOUR_DOMAIN>/.well-known/acme-challenge/<TOKEN>` URLs used for [ACME HTTP01](https://letsencrypt.org/docs/challenge-types/#http-01-challenge).
To make matters worse, the buggy validation is [enabled by default](https://github.com/kubernetes/ingress-nginx/pull/11819) in [`ingress-nginx >= 1.12.0`](https://github.com/kubernetes/ingress-nginx/blob/main/changelog/controller-1.12.0.md).
You will see errors like this in the cert-manager controller logs:

> Error presenting challenge: admission webhook `validate.nginx.ingress.kubernetes.io` denied the request: ingress contains invalid paths: path `/.well-known/acme-challenge/oTw4h9_WsobTRn5COTSyaiAx3aWn0M7_aYisoz1gXQw` cannot be used with `pathType` Exact

If you use `ingress-nginx`, choose **one** of the following two options:

#### Option 1. Disable the `ACMEHTTP01IngressPathTypeExact` feature in cert-manager

To disable the `ACMEHTTP01IngressPathTypeExact` feature,
to reinstate the old `PathType: ImplementationSpecific` behavior,
use the following Helm values when installing cert-manager:

```yaml
# values.yaml
config:
  featureGates:
    # Disable the use of Exact PathType in Ingress resources, to work around a bug in ingress-nginx
    # https://github.com/kubernetes/ingress-nginx/issues/11176
    ACMEHTTP01IngressPathTypeExact: false
```

#### Option 2. Disable the `strict-validate-path-type` option in ingress-nginx

To disable the buggy strict path validation,
use the following Helm values when installing `ingress-nginx`:

```yaml
# values.yaml
controller:
  config:
    # Disable strict path validation, to work around a bug in ingress-nginx
    # https://github.com/kubernetes/ingress-nginx/issues/11176
    strict-validate-path-type: false
```

#### Option 3. Upgrade `ingress-nginx`

This issue is resolved in `ingress-nginx` versions `v1.13.2` and `v1.12.6`, both released on August 29, 2025.

If you are running ingress-nginx `v1.13.2+` or `v1.12.6+`, you do not need to apply the workarounds described above.  

See the [fix commit](https://github.com/kubernetes/ingress-nginx/commit/618aae18515213bcf3fb820e6f8c234703d844b2)  

### ACME Certificate Profiles

cert-manager now supports the selection of ACME certificate profiles, allowing
users to request different categories of certificates from their ACME
Certificate Authority.
This enhancement leverages the latest [ACME protocol extension for certificate profiles (IETF draft)][rfc] and is supported by Let's Encrypt and other providers.
For example, Let's Encrypt offers the [`tlsserver`][tlsserver] profile for
standard server certificates and the [`shortlived`][shortlived] profile for
short-lived six-day certificates.
These new options provide users with greater flexibility and improved security
for their certificate management needs.

[rfc]: https://datatracker.ietf.org/doc/draft-aaron-acme-profiles/
[tlsserver]: https://letsencrypt.org/docs/profiles/#tlsserver
[shortlived]: https://letsencrypt.org/docs/profiles/#shortlived

> 📖 Learn more by visiting the [ACME Issuer documentation](../../configuration/acme/README.md#acme-certificate-profiles).

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

> ⚠️ Potentially breaking change

The default value for the `Certificate` resource's `revisionHistoryLimit` field is now set to 1.
This ensures that old `CertificateRequest` revisions are automatically garbage collected, improving resource management and reducing clutter in clusters.
Previously, if not specified, no limit was applied, potentially leading to an accumulation of stale `CertificateRequest` resources.
With this update, users no longer need to manually configure the revision history limit to benefit from automated cleanup.

When you upgrade to cert-manager 1.18, all stale `CertificateRequest` resources will be garbage collected, unless you explicitly set the `revisionHistoryLimit` value on your `Certificate` resources.

### Copy annotations from Ingress or Gateway to the Certificate

We've added a new configuration option to the cert-manager controller: `--extra-certificate-annotations`, which allows you to specify annotation keys to be copied from an Ingress or Gateway resource to the resulting Certificate object.
Read [Annotated Ingress resource: Copy annotations to the Certificate](../../usage/ingress.md#copy-annotations-to-the-certificate ), and
[Annotated Gateway resource: Copy annotations to the Certificate](../../usage/gateway.md#copy-annotations-to-the-certificate), to learn more.

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:
{/* BEGIN contributors */}
- [`@LukeCarrier`](https://github.com/LukeCarrier)
- [`@NicholasBlaskey`](https://github.com/NicholasBlaskey)
- [`@ThatsIvan`](https://github.com/ThatsIvan)
- [`@ali-hamza-noor`](https://github.com/ali-hamza-noor)
- [`@cuinix`](https://github.com/cuinix)
- [`@hjoshi123`](https://github.com/hjoshi123)
- [`@jcpunk`](https://github.com/jcpunk)
- [`@johnjcool`](https://github.com/johnjcool)
- [`@jsoref`](https://github.com/jsoref)
- [`@k0da`](https://github.com/k0da)
- [`@solidDoWant`](https://github.com/solidDoWant)
- [`@sspreitzer`](https://github.com/sspreitzer)
- [`@tareksha`](https://github.com/tareksha)
- [`@terinjokes`](https://github.com/terinjokes)
- [`@teslaedison`](https://github.com/teslaedison)
- [`@tobiasbp`](https://github.com/tobiasbp)
- [`@tsaarni`](https://github.com/tsaarni)
- [`@vehagn`](https://github.com/vehagn)
{/* END contributors */}

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


{/* BEGIN changelog v1.18.2 */}
## `v1.18.2`

We fixed a bug in the CSR's name constraints construction (only applies if you have enabled the `NameConstraints` feature gate).
We dropped the new `global.rbac.disableHTTPChallengesRole` Helm option due to a bug we found, this feature will be released in `v1.19` instead.

Changes since `v1.18.1`:

### Bug or Regression

- BUGFIX: permitted URI domains were incorrectly used to set the excluded URI domains in the CSR's name constraints ([`#7833`][#7833])
- Reverted adding the `global.rbac.disableHTTPChallengesRole` Helm option. ([`#7837`][#7837])

[#7833]: https://github.com/cert-manager/cert-manager/issues/7833
[#7837]: https://github.com/cert-manager/cert-manager/issues/7837

{/* END changelog v1.18.2 */}
{/* BEGIN changelog v1.18.1 */}
## `v1.18.1`

We have added a new feature gate `ACMEHTTP01IngressPathTypeExact`, to allow
`ingress-nginx` users to turn off the new default Ingress `PathType: Exact`
behavior, in ACME HTTP01 Ingress challenge solvers.

We have increased the ACME challenge authorization timeout to two minutes, which we hope will fix a timeout error (`error waiting for authorization`), which has been reported by multiple users, since the release of cert-manager `v1.16.0`.
This change should fix the following issues: [`#7337`][#7337], [`#7444`][#7444], and [`#7685`][#7685].

[#7337]: https://github.com/cert-manager/cert-manager/issues/7337
[#7444]: https://github.com/cert-manager/cert-manager/issues/7444
[#7685]: https://github.com/cert-manager/cert-manager/issues/7685

Changes since `v1.18.0`:

### Feature

- Added a new feature gate `ACMEHTTP01IngressPathTypeExact`, to allow `ingress-nginx` users to turn off the new default Ingress `PathType: Exact` behavior, in ACME HTTP01 Ingress challenge solvers. ([`#7810`](https://github.com/cert-manager/cert-manager/pull/7810), [`@sspreitzer`](https://github.com/sspreitzer))

### Bug or Regression

- ACME: Increased challenge authorization timeout to 2 minutes to fix `error waiting for authorization`. ([`#7801`](https://github.com/cert-manager/cert-manager/pull/7801), [`@hjoshi123`](https://github.com/hjoshi123))

### Other (Cleanup or Flake)

- Use the latest version of ingress-nginx in E2E tests to ensure compatibility ([`#7807`](https://github.com/cert-manager/cert-manager/pull/7807), [`@wallrj`](https://github.com/wallrj))

{/* END changelog v1.18.1 */}
{/* BEGIN changelog v1.18.0 */}
## `v1.18.0`

Changes since `v1.17.2`:

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
- Add support for [`ACME profiles extension`](https://datatracker.ietf.org/doc/draft-aaron-acme-profiles/). ([`#7777`](https://github.com/cert-manager/cert-manager/pull/7777), [`@wallrj`](https://github.com/wallrj))
- Promote the `UseDomainQualifiedFinalizer` feature to GA. ([`#7735`](https://github.com/cert-manager/cert-manager/pull/7735), [`@jsoref`](https://github.com/jsoref))
- Switched `service/servicemon` definitions to use port names instead of numbers. ([`#7727`](https://github.com/cert-manager/cert-manager/pull/7727), [`@jcpunk`](https://github.com/jcpunk))
- The default value of `Certificate.Spec.PrivateKey.RotationPolicy` changed from `Never` to `Always`. ([`#7723`](https://github.com/cert-manager/cert-manager/pull/7723), [`@wallrj`](https://github.com/wallrj))
- Set the default `revisionHistoryLimit` to 1 for the CertificateRequest revisions ([`#7758`](https://github.com/cert-manager/cert-manager/pull/7758), [`@ali-hamza-noor`](https://github.com/ali-hamza-noor))

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
- Upgrade `golang.org/x/net` fixing `CVE-2025-22870`. ([`#7619`](https://github.com/cert-manager/cert-manager/pull/7619), [`@depandabot[bot]`](https://github.com/apps/dependabot))
- Update kind images to include the Kubernetes 1.33 node image ([`#7787`](https://github.com/cert-manager/cert-manager/pull/7787), [`@wallrj`](https://github.com/wallrj))
- Upgrade Go to `v1.24.4` ([`#7785`](https://github.com/cert-manager/cert-manager/pull/7785), [`@wallrj`](https://github.com/wallrj))
- Use `slices.Contains` to simplify code ([`#7753`](https://github.com/cert-manager/cert-manager/pull/7753), [`@cuinix`](https://github.com/cuinix))
{/* END changelog v1.18.0 */}
