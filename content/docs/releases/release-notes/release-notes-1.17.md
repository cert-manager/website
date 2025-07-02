---
title: Release 1.17
description: 'cert-manager release notes: cert-manager 1.17'
---

cert-manager v1.17 includes:

- A helpful compliance change to RSA signatures on certificates
- An easier way to specify passwords for PKCS#12 and JKS keystores
- Feature flag promotions and a deprecation
- Dependency bumps and other smaller improvements

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

### RSA Certificate Compliance

The United States Department of Defense published a [memo: Department of Defense Transition to Stronger Public Key Infrastructure Algorithms](https://dl.dod.cyber.mil/wp-content/uploads/pki-pke/pdf/unclass-memo_dodcryptoalgorithms.pdf) in 2022 which introduced some requirements on the kinds of cryptography they require to be supported in software they use.

In effect, the memo requires that software be able to support larger RSA keys (3072-bit and 4096-bit) and hashing algorithms (SHA-384 at a minimum).

cert-manager supported large RSA keys long before the memo was published, but a quirk in implementation meant that cert-manager always used SHA-256 when signing with RSA.

In v1.17.0, cert-manager will choose a hash algorithm based on the RSA key length: 3072-bit keys will use SHA-384, and 4096-bit keys will use SHA-512. This matches similar behavior already present for ECDSA signatures.

Our expectation is that this change will have minimal impact beyond a slight increase in security and better compliance; we're not aware of Kubernetes-based environments which support RSA 2048 and SHA-256 but fail with RSA 4096 and SHA-512. However, if you're using larger RSA keys, you should be aware of the change.

### Easier Keystore Passwords for PKCS#12 and JKS

Specifying passwords on PKCS#12 and JKS keystores is supported in cert-manager
for compatibility reasons with software which expects or requires passwords to be set; however, these passwords are [not relevant to security](../../faq/README.md#why-are-passwords-on-jks-or-pkcs12-files-not-helpful) and never have been in cert-manager.

The initial implementation of the `keystores` feature required these "passwords" to be stored in a Kubernetes secret, which would then be read by cert-manager when creating the keystore after a certificate was issued. This is cumbersome, especially when many passwords are set to default values such as `changeit` or `password`.

In cert-manager v1.17, it's now possible to set a keystore password using a literal string value inside the `Certificate` resource itself, making this process much easier with no change to security.

For example:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-cert-password
spec:
  secretName: my-cert-password
  issuerRef:
    name: my-issuer
    kind: ClusterIssuer
  keystores:
    jks:
      create: true
      password: "abc123"
    pkcs12:
      create: true
      password: "password"
  dnsNames:
  - example.com
```

The new `password` field is mutually exclusive with the `passwordSecretRef` field, so be sure to only set one.

### Feature Flag Promotions / Deprecations

cert-manager's feature flags allow for easier testing and adoption of new features with a reduced risk of breaking changes. In cert-manager v1.17, two feature gates have been promoted to "beta", and as such are now enabled by default in all installations:

- `NameConstraints`, allowing users to specify the name constraints extension which can be helpful when creating CA certificates for private PKI
- `UseDomainQualifiedFinalizer`, which stops a Kubernetes warning from being printed in logs

In addition, we added a new feature gate: `CAInjectorMerging`, which intelligently combines certificates used by the [`CAInjector`](../../concepts/ca-injector.md) component, making it safer to use when issuing certificates are rotated. If you're making heavy use of the CA injector, you should consider enabling this feature gate.

Finally, we deprecated the `ValidateCAA` feature gate which will be removed entirely in cert-manager v1.18.0. This feature gate aimed to validate the `CAA` DNS record during ACME issuance, but has seen low adoption and limited testing since its introduction back in 2019.

### Other Changes

There are many other PRs which were merged in this release cycle and we'd encourage you to read the release notes below. One PR that's worth highlighting is a change to add more structured logging information to certain log lines.

If you were previously filtering logs using `grep` or similar tools (which is highly discouraged!) be aware that some log lines have changed format.

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:

- [@hawksight](https://github.com/hawksight)
- [@aidy](https://github.com/aidy)
- [@bashlion](https://github.com/bashlion)
- [@7ing](https://github.com/7ing)
- [@fadecore](https://github.com/fadecore)
- [@schedin](https://github.com/schedin)
- [@jkroepke](https://github.com/jkroepke)
- [@sdarwin](https://github.com/sdarwin)

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

## `v1.17.4`

We fixed a bug in the CSR's name constraints construction (only applies if you have enabled the `NameConstraints` feature gate).

Changes since `v1.17.3`:

### Bug or Regression

- BUGFIX: permitted URI domains were incorrectly used to set the excluded URI domains in the CSR's name constraints ([`#7832`][#7832])

[#7832]: https://github.com/cert-manager/cert-manager/issues/7832

## `v1.17.3`

This patch release addresses several vulnerabilities reported by the Trivy
security scanner. It is built with the latest version of Go 1.23.

We have increased the ACME challenge authorization timeout to two minutes, which we hope will fix a timeout error (`error waiting for authorization`), which has been reported by multiple users, since the release of cert-manager `v1.16.0`.
This change should fix the following issues: [`#7337`][#7337], [`#7444`][#7444], and [`#7685`][#7685].

[#7337]: https://github.com/cert-manager/cert-manager/issues/7337
[#7444]: https://github.com/cert-manager/cert-manager/issues/7444
[#7685]: https://github.com/cert-manager/cert-manager/issues/7685

Changes since `v1.17.2`:

### Bug or Regression

- Bump Go to `1.23.10` to fix `GO-2025-3749`, `GO-2025-3750`, and `GO-2025-3751` ([`#7799`](https://github.com/cert-manager/cert-manager/pull/7799), [`@wallrj`](https://github.com/wallrj))
- ACME: Increased challenge authorization timeout to 2 minutes to fix error `waiting for authorization` ([`#7798`](https://github.com/cert-manager/cert-manager/pull/7798), [`@hjoshi123`](https://github.com/hjoshi123))

### Other (Cleanup or Flake)

- Use the latest version of ingress-nginx in E2E tests to ensure compatibility ([`#7808`](https://github.com/cert-manager/cert-manager/pull/7808), [`@wallrj`](https://github.com/wallrj))

## `v1.17.2`

This patch release addresses several vulnerabilities reported by the Trivy
security scanner. It is built with the latest version of Go 1.23 and includes
various dependency updates. Changes since `v1.17.1`:

### Bug or Regression

- Bump Go to `v1.23.8` to fix `CVE-2025-22871` ([#7701](https://github.com/cert-manager/cert-manager/pull/7701), [`@wallrj`](https://github.com/wallrj))
- Bump `go-jose` dependency to address `CVE-2025-27144` ([#7603](https://github.com/cert-manager/cert-manager/pull/7603), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Bump `golang.org/x/net` to address `CVE-2025-22870` reported by Trivy ([#7622](https://github.com/cert-manager/cert-manager/pull/7622), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Bump `golang.org/x/net` to fix `CVE-2025-22872` ([#7703](https://github.com/cert-manager/cert-manager/pull/7703), [`@wallrj`](https://github.com/wallrj))
- Bump `golang.org/x/oauth2` to patch `CVE-2025-22868` ([#7692](https://github.com/cert-manager/cert-manager/pull/7692), [`@lentzi90`](https://github.com/lentzi90))
- Bump `golang.org/x/crypto` to patch `GHSA-hcg3-q754-cr77` ([#7692](https://github.com/cert-manager/cert-manager/pull/7692), [`@lentzi90`](https://github.com/lentzi90))
- Bump `github.com/golang-jwt/jwt` to patch `GHSA-mh63-6h87-95cp` ([#7692](https://github.com/cert-manager/cert-manager/pull/7692), [`@lentzi90`](https://github.com/lentzi90))

## `v1.17.1`

This patch release is primarily intended to address a [breaking change](https://github.com/cert-manager/cert-manager/issues/7540) in Cloudflare's API which impacted ACME DNS-01 challenges using Cloudflare.

### Bug or Regression

- Fix issuing of certificates via DNS01 challenges on Cloudflare after a breaking change to the Cloudflare API ([#7565](https://github.com/cert-manager/cert-manager/pull/7565), [@LukeCarrier](https://github.com/LukeCarrier))
- Bump go to 1.23.6 to address [`CVE-2025-22866`](https://github.com/advisories/GHSA-3whm-j4xm-rv8x) reported by Trivy ([#7563](https://github.com/cert-manager/cert-manager/pull/7563), [@SgtCoDFish](https://github.com/sgtcodfish))


## `v1.17.0`

### Feature

- Potentially BREAKING: The CA and SelfSigned issuers now use SHA-512 when signing with RSA keys 4096 bits and above, and SHA-384 when signing with RSA keys 3072 bits and above. If you were previously using a larger RSA key as a CA, be sure to check that your systems support the new hash algorithms. ([#7368](https://github.com/cert-manager/cert-manager/pull/7368), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Add `CAInjectorMerging` feature gate to the ca-injector, enabling this will change the behavior of the ca-injector to merge in new CA certificates instead of outright replacing the existing one. ([#7469](https://github.com/cert-manager/cert-manager/pull/7469), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot))
- Added image pull secrets to deployments when service accounts aren't created ([#7411](https://github.com/cert-manager/cert-manager/pull/7411), [@TheHenrick](https://github.com/TheHenrick))
- Added the ability to customize client ID when using username/password authentication for Venafi client ([#7484](https://github.com/cert-manager/cert-manager/pull/7484), [@ilyesAj](https://github.com/ilyesAj))
- Helm: New value `webhook.extraEnv` allows you to set custom environment variables in the webhook Pod.
  Helm: New value `cainjector.extraEnv` allows you to set custom environment variables in the cainjector Pod.
  Helm: New value `startupapicheck.extraEnv` allows you to set custom environment variables in the startupapicheck Pod. ([#7317](https://github.com/cert-manager/cert-manager/pull/7317), [@wallrj](https://github.com/wallrj))
- Increase the amount of PEM data `pki.DecodeX509CertificateSetBytes` is able to parse, to enable reading larger TLS trust bundles ([#7464](https://github.com/cert-manager/cert-manager/pull/7464), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Adds a new configuration option - `tenantID` - for the AzureDNS provider when using managed identities with service principals. This enhancement allows users to specify the tenant ID when using managed identities, offering better flexibility in multi-tenant environments. ([#7376](https://github.com/cert-manager/cert-manager/pull/7376), [@jochenrichter](https://github.com/jochenrichter))
- Promote the `UseDomainQualifiedFinalizer` feature to Beta. ([#7488](https://github.com/cert-manager/cert-manager/pull/7488), [@jsoref](https://github.com/jsoref))
- Allow JKS/PKCS12 keystore passwords to be set as literal values in Certificate resources, mutually exclusive with the existing `passwordSecretRef` field ([#6657](https://github.com/cert-manager/cert-manager/pull/6657), [@rquinio1A](https://github.com/rquinio1A))
- Allow templating ServiceAccount annotations by running the built-in Helm `tpl` function on keys and values, to aid with workload identity configuration ([#7501](https://github.com/cert-manager/cert-manager/pull/7501), [@fcrespofastly](https://github.com/fcrespofastly))
- Promote CA `NameConstraints` feature gate to Beta (enabled by default) ([#7494](https://github.com/cert-manager/cert-manager/pull/7494), [@tanujd11](https://github.com/tanujd11))

### Documentation

- Add example for IPv6 in `--dns01-recursive-nameservers` ([#7367](https://github.com/cert-manager/cert-manager/pull/7367), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Updated the chart documentation to show `enableGatewayAPI` in the config example. ([#7354](https://github.com/cert-manager/cert-manager/pull/7354), [@puerco](https://github.com/puerco))

### Bug or Regression

- BUGFIX: A change in v1.16.0 caused cert-manager's ACME ClusterIssuer to look in the wrong namespace for resources required for the issuance (e.g. credential Secrets). This is now fixed in v1.16.1+ and v1.17.0+ ([#7339](https://github.com/cert-manager/cert-manager/pull/7339), [@inteon](https://github.com/inteon))
- BUGFIX: Helm will now accept percentages for the `podDisruptionBudget.minAvailable` and `podDisruptionBudget.maxAvailable` values. ([#7343](https://github.com/cert-manager/cert-manager/pull/7343), [@inteon](https://github.com/inteon))
- Fix ACME HTTP-01 solver for IPv6 endpoints ([#7391](https://github.com/cert-manager/cert-manager/pull/7391), [@Peac36](https://github.com/Peac36))
- Fix the behavior of `renewBeforePercentage` to comply with its spec ([#7421](https://github.com/cert-manager/cert-manager/pull/7421), [@adam-sroka](https://github.com/adam-sroka))
- Helm: allow `enabled` to be set as a value to toggle cert-manager as a dependency. ([#7350](https://github.com/cert-manager/cert-manager/pull/7350), [@inteon](https://github.com/inteon))
- SECURITY (low risk): Limit maximum allowed PEM size to prevent potential DoS in cert-manager controller from attacker-controlled PEM. See [`GHSA-r4pg-vg54-wxx4`](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-r4pg-vg54-wxx4) ([#7400](https://github.com/cert-manager/cert-manager/pull/7400), [@SgtCoDFish](https://github.com/SgtCoDFish))
- The Certificate object will no longer create CertificateRequest or Secret objects while being deleted ([#7361](https://github.com/cert-manager/cert-manager/pull/7361), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot))
- The issuer will now more quickly retry when its linked Secret is updated to fix an issue that caused a high back-off timeout. ([#7455](https://github.com/cert-manager/cert-manager/pull/7455), [@inteon](https://github.com/inteon))
- Upgrades the Venafi `vCert` library, fixing a bug which caused the RSA 3072 bit key size for TPP certificate enrollment to not work. ([#7498](https://github.com/cert-manager/cert-manager/pull/7498), [@inteon](https://github.com/inteon))

### Other (Cleanup or Flake)

- ⚠️ Potentially BREAKING: Log messages that were not structured have now been replaced with structured logs. If you were matching on specific log strings, this could break your setup. ([#7461](https://github.com/cert-manager/cert-manager/pull/7461), [@inteon](https://github.com/inteon))
- DEPRECATION: The `ValidateCAA` feature gate is now deprecated, with removal scheduled for cert-manager 1.18. In 1.17, enabling this feature gate will print a warning. ([#7491](https://github.com/cert-manager/cert-manager/pull/7491), [@jsoref](https://github.com/jsoref))
- Remove `Neither --kubeconfig nor --master was specified` warning message when the controller and the webhook services boot ([#7457](https://github.com/cert-manager/cert-manager/pull/7457), [@Peac36](https://github.com/Peac36))
- Move 'live' DNS tests into a separate package to contain test flakiness and improve developer UX ([#7530](https://github.com/cert-manager/cert-manager/pull/7530), [@SgtCoDFish](https://github.com/SgtCoDFish))
