---
title: Release 1.21
description: 'cert-manager release notes: cert-manager 1.21'
---

cert-manager is the easiest way to automatically manage certificates in Kubernetes and OpenShift clusters.

cert-manager 1.21 brings ACME Renewal Information (ARI) support, AWS IAM authentication for the Vault issuer, several security hardening changes, and continued improvements to Gateway API integration and cainjector. There are three breaking changes related to Helm chart RBAC and metrics values — review them carefully before upgrading.

## Major Themes

### Default `tokenrequest` RBAC removed from Helm chart

> ⚠️ Breaking change

The Helm chart no longer creates a default `Role` and `RoleBinding` granting the cert-manager controller permission to create tokens for its own ServiceAccount (`serviceaccounts/token: create`). No documented workflow requires this RBAC — the Route53 docs section that motivated it was removed in 2024.

If you use `serviceAccountRef.name` pointing at the controller ServiceAccount, you must now either create your own `Role`/`RoleBinding` granting `serviceaccounts/token: create`, or migrate to a dedicated ServiceAccount (recommended — see the [Vault](../../configuration/vault.md) or [Route53](../../configuration/acme/dns01/route53.md) documentation).

### Restrict Challenge and Order RBAC in `cert-manager-edit` ClusterRole

> ⚠️ Potentially breaking change

The `cert-manager-edit` aggregate ClusterRole no longer grants `create` for `challenges.acme.cert-manager.io` or `create`, `patch`, `update` for `orders.acme.cert-manager.io` ([`GHSA-8rvj-mm4h-c258`](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258)). These resources are internal to cert-manager's ACME workflow. Challenge `patch` and `update` are retained because users may need them to remove stuck finalizers.

This change was already shipped in v1.20.3 and v1.19.6, so if you are running one of those versions this will not be a breaking change. If you have tooling that creates Challenge or Order resources directly, you will need to grant those permissions explicitly.

### Metrics port name and path Helm values removed

> ⚠️ Breaking change

The Helm values `prometheus.servicemonitor.targetPort`, `prometheus.servicemonitor.path`, and `prometheus.podmonitor.path` have been removed. The controller Service metrics port has been renamed from `tcp-prometheus-servicemonitor` to `http-metrics`. Because the Helm values schema uses `additionalProperties: false`, users who still have any of the removed keys in their values overrides will see a schema validation error on upgrade — remove them before upgrading. ([#8952](https://github.com/cert-manager/cert-manager/pull/8952))

### ACME and Certificate Management

- **ACME Renewal Information (ARI)**: experimental support for [RFC 9773](https://www.rfc-editor.org/rfc/rfc9773) behind the `ACMEUseARI` feature gate. When enabled, cert-manager queries the ACME server's `renewalInfo` endpoint for the recommended renewal window, allowing servers like Let's Encrypt to proactively prompt renewal during mass revocations or CA key rollovers. ([#8798](https://github.com/cert-manager/cert-manager/pull/8798))
- **`waitInsteadOfSelfCheck` solver option**: skip cert-manager's own self-check and instead wait a configured duration before asking the ACME server to validate. An escape hatch for split-horizon DNS and NAT hairpin environments. See [configuration details](../../configuration/acme/README.md#skip-the-self-check-with-waitinsteadofselfcheck). ([#8858](https://github.com/cert-manager/cert-manager/pull/8858))
- **AWS IAM authentication for Vault**: the Vault issuer now supports IRSA, EKS Pod Identity, and ambient EC2/ECS credentials, removing the need for long-lived AWS Secrets. ([#8422](https://github.com/cert-manager/cert-manager/pull/8422))
- **Certificate renewal policies**: a new `renewal` field on the Certificate API provides more expressive control over renewal scheduling, complementing `renewBefore` and `renewBeforePercentage` — including scheduling renewal into approved maintenance windows and disabling automatic renewal entirely. See [renewal policies and renewal windows](../../usage/certificate.md#renewal-policies-and-renewal-windows). ([#8258](https://github.com/cert-manager/cert-manager/pull/8258))
- **Configurable CertificateRequest retry backoff**: the new `--certificate-request-maximum-backoff-duration` flag (default: 32 hours) caps the exponential backoff for failed CertificateRequests, useful for environments with scheduled CA maintenance windows. ([#8893](https://github.com/cert-manager/cert-manager/pull/8893))
- **Modern2026 PKCS#12 profile**: a new FIPS 140-3 compatible encoding profile using AES-256 + SHA-256 KDFs instead of legacy 3DES/RC2. ([#8841](https://github.com/cert-manager/cert-manager/pull/8841))
- **Webhook certificate renewal after system suspend**: the webhook now detects missed certificate renewals after system suspend (S3/S4) or VM live migration by polling wall-clock time, recovering within one minute of resume. ([#8464](https://github.com/cert-manager/cert-manager/pull/8464))

### Gateway API and cainjector

- **HTTP01 ListenerSet parentRef fallback**: the `acme.cert-manager.io/http01-parentreffallback: "true"` annotation causes cert-manager to use the parent Gateway for solver HTTPRoutes instead of the ListenerSet, enabling TLS-only ListenerSets to use a shared HTTP listener for ACME challenges. ([#8749](https://github.com/cert-manager/cert-manager/pull/8749))
- **`cert-manager.io/ignore-tls-listeners` annotation**: exclude specific Gateway TLS listeners from certificate management. ([#8727](https://github.com/cert-manager/cert-manager/pull/8727))
- **Additional listener protocols**: configurable listener protocols beyond the default set. ([#8683](https://github.com/cert-manager/cert-manager/pull/8683))
- **`enableGatewayAPI` configuration restructure**: `enableGatewayAPI` and `enableGatewayAPIListenerSet` are deprecated in favor of `gatewayAPI.enabled` / `gatewayAPI.enableListenerSet`. The old fields continue to work. ([#8732](https://github.com/cert-manager/cert-manager/pull/8732))
- **`CAInjectorMerging` promoted to GA**: unconditionally enabled; will be removed in a future release. ([#8583](https://github.com/cert-manager/cert-manager/pull/8583))
- **cainjector server-side apply unconditional**: the `ServerSideApply` feature gate is deprecated. ([#8692](https://github.com/cert-manager/cert-manager/pull/8692))
- **cainjector `--ignore-namespaces` flag**: skip specified namespaces when watching Secrets for injection. ([#8614](https://github.com/cert-manager/cert-manager/pull/8614))

### Deployment and Observability

- **Venafi OAuth token observability**: a new `AuthFailed` Issuer condition reason distinguishes bad credentials from transient errors. PANW NGTS is now supported as a Venafi backend. ([#8808](https://github.com/cert-manager/cert-manager/pull/8808), [#8779](https://github.com/cert-manager/cert-manager/pull/8779))
- **`runtimeClassName` support**: configurable for cert-manager components and ACME HTTP01 solver pods. ([#8791](https://github.com/cert-manager/cert-manager/pull/8791), [#8976](https://github.com/cert-manager/cert-manager/pull/8976))
- **`startupapicheck.ttlSecondsAfterFinished`**: opt-in automatic cleanup of the startupapicheck Job. ([#8523](https://github.com/cert-manager/cert-manager/pull/8523))
- **`--acme-http01-solver-extra-labels`**: propagate `global.commonLabels` to dynamically-created ACME HTTP01 solver resources. ([#8761](https://github.com/cert-manager/cert-manager/pull/8761))

### Notable Bug Fixes

- **Integer overflow in `renewBeforePercentage`**: Certificates with durations longer than approximately 3 years were incorrectly rejected or assigned incorrect renewal times. ([#8947](https://github.com/cert-manager/cert-manager/pull/8947))
- **Infinite re-issuance loop**: cert-manager no longer loops when an issuer returns an already-expired certificate. ([#8610](https://github.com/cert-manager/cert-manager/pull/8610))
- **ACME transient network errors**: challenges no longer permanently fail on TLS handshake timeouts, DNS resolution failures, or context cancellation during nonce fetches and authorization waits. ([#8760](https://github.com/cert-manager/cert-manager/pull/8760))
- **DNS-over-HTTPS response body cap**: response body reads are now bounded at 128 KB to prevent potential OOM. ([#8803](https://github.com/cert-manager/cert-manager/pull/8803))
- **Vault path traversal**: the Vault issuer webhook now rejects `..` path segments, preventing `path.Join` from silently resolving relative segments. ([#8930](https://github.com/cert-manager/cert-manager/pull/8930))
- **DNS issuer secrets validated before ready**: prevents silent misconfiguration. ([#8255](https://github.com/cert-manager/cert-manager/pull/8255))

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:

{/* BEGIN contributors */}
- [`@Copilot`](https://github.com/Copilot)
- [`@FelixPhipps`](https://github.com/FelixPhipps)
- [`@Peac36`](https://github.com/Peac36)
- [`@SebTardif`](https://github.com/SebTardif)
- [`@apkatsikas`](https://github.com/apkatsikas)
- [`@bitloi`](https://github.com/bitloi)
- [`@dap0am`](https://github.com/dap0am)
- [`@figaw`](https://github.com/figaw)
- [`@immanuwell`](https://github.com/immanuwell)
- [`@jabbrwcky`](https://github.com/jabbrwcky)
- [`@jnohlgard`](https://github.com/jnohlgard)
- [`@jsoref`](https://github.com/jsoref)
- [`@ltwongaa`](https://github.com/ltwongaa)
- [`@lunarwhite`](https://github.com/lunarwhite)
- [`@mateenali66`](https://github.com/mateenali66)
- [`@onurmicoogullari`](https://github.com/onurmicoogullari)
- [`@putongyong`](https://github.com/putongyong)
- [`@seanorama`](https://github.com/seanorama)
- [`@texasich`](https://github.com/texasich)
{/* END contributors */}

for their contributions, comments and support!

Also, thanks to the cert-manager maintainer team for their help in this release:

{/* BEGIN maintainers */}
- [`@SgtCoDFish`](https://github.com/SgtCoDFish)
- [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot)
- [`@erikgb`](https://github.com/erikgb)
- [`@hjoshi123`](https://github.com/hjoshi123)
- [`@inteon`](https://github.com/inteon)
- [`@maelvls`](https://github.com/maelvls)
- [`@munnerz`](https://github.com/munnerz)
- [`@wallrj`](https://github.com/wallrj)
- [`@wallrj-cyberark`](https://github.com/wallrj-cyberark)
{/* END maintainers */}

And finally, thanks to the cert-manager steering committee for their feedback in this release cycle:

{/* BEGIN steerers */}
- [`@FlorianLiebhart`](https://github.com/FlorianLiebhart)
- [`@TrilokGeer`](https://github.com/TrilokGeer)
- [`@ianarsenault`](https://github.com/ianarsenault)
- [`@ssyno`](https://github.com/ssyno)
{/* END steerers */}

{/* BEGIN changelog v1.21.0 */}
## `v1.21.0`

Changes since `v1.20.0`:

### Feature

- Add Venafi OAuth token request observability and a new `AuthFailed` Issuer condition reason to distinguish bad credentials from transient infrastructure errors. ([`#8808`](https://github.com/cert-manager/cert-manager/pull/8808), [`@FelixPhipps`](https://github.com/FelixPhipps))
- Add `certificateRequestMaximumBackoffDuration` controller configuration option to cap retry backoff time for failed CertificateRequests. Configurable via config file, `--certificate-request-maximum-backoff-duration` CLI flag, or Helm value `config.certificateRequestMaximumBackoffDuration`. Defaults to 32 hours for backward compatibility. ([`#8893`](https://github.com/cert-manager/cert-manager/pull/8893), [`@lunarwhite`](https://github.com/lunarwhite))
- Add an optional `waitInsteadOfSelfCheck` field to ACME HTTP01 and DNS01 solvers so cert-manager can skip its own self-check and ask the ACME server to validate after a configured wait. ([`#8858`](https://github.com/cert-manager/cert-manager/pull/8858), [`@wallrj`](https://github.com/wallrj))
- Add configurable `runtimeClassName` support for cert-manager components and ACME HTTP01 solver pods. ([`#8791`](https://github.com/cert-manager/cert-manager/pull/8791), [`@jsoref`](https://github.com/jsoref))
- Add direct configurable `runtimeClassName` support for ACME HTTP01 solver pods via the `acmesolver.runtimeClassName` Helm value. ([`#8976`](https://github.com/cert-manager/cert-manager/pull/8976), [`@erikgb`](https://github.com/erikgb))
- Add new controller flag `--acme-http01-solver-extra-labels`, allowing Helm's `global.commonLabels` to propagate to all dynamically-created ACME HTTP01 solver resources (Pods, Services, Ingresses, or Gateway API HTTPRoutes). ([`#8761`](https://github.com/cert-manager/cert-manager/pull/8761), [`@lunarwhite`](https://github.com/lunarwhite))
- Add opt-in `startupapicheck.ttlSecondsAfterFinished` Helm value to enable automatic cleanup of the startupapicheck Job via the Kubernetes TTL-after-finished controller. ([`#8523`](https://github.com/cert-manager/cert-manager/pull/8523), [`@dap0am`](https://github.com/dap0am))
- Added ARI support through the ACMEUseARI feature gate. ([`#8798`](https://github.com/cert-manager/cert-manager/pull/8798), [`@hjoshi123`](https://github.com/hjoshi123))
- Added AWS IAM authentication support for Vault issuer, including IRSA (IAM Roles for Service Accounts) and ambient credentials (EC2/ECS). ([`#8422`](https://github.com/cert-manager/cert-manager/pull/8422), [`@bitloi`](https://github.com/bitloi))
- Added `cert-manager.io/ignore-tls-listeners` annotation for ignoring gwapi listeners. ([`#8727`](https://github.com/cert-manager/cert-manager/pull/8727), [`@hjoshi123`](https://github.com/hjoshi123))
- Added option to specify additional listener protocols the GatewayAPI integration will consider when creating certificates. ([`#8683`](https://github.com/cert-manager/cert-manager/pull/8683), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- Adds support for the Modern2026 go-pkcs12 profile and FIPS 140-3 ([`#8841`](https://github.com/cert-manager/cert-manager/pull/8841), [`@seanorama`](https://github.com/seanorama))
- Cainjector:
  - A new flag `--ignore-namespaces` was added to the cainjector binary. It can be used to filter out namespaces from being watched for secrets to use for injectables. ([`#8614`](https://github.com/cert-manager/cert-manager/pull/8614), [`@figaw`](https://github.com/figaw))
- Disabled client side rate-limiting if AP&F is enabled. ([`#8757`](https://github.com/cert-manager/cert-manager/pull/8757), [`@hjoshi123`](https://github.com/hjoshi123))
- Extend the Venafi/CyberArk integration to also support PANW NGTS. ([`#8779`](https://github.com/cert-manager/cert-manager/pull/8779), [`@FelixPhipps`](https://github.com/FelixPhipps))
- Feat(certificate): adding certificate renewal policies ([`#8258`](https://github.com/cert-manager/cert-manager/pull/8258), [`@hjoshi123`](https://github.com/hjoshi123))
- Make cainjector use SSA unconditionally and deprecate the ServerSideApply feature gate ([`#8692`](https://github.com/cert-manager/cert-manager/pull/8692), [`@erikgb`](https://github.com/erikgb))
- Processed annotations `cert-manager.io/alt-names`, `cert-manager.io/ip-sans` to Certificates generated from ingress like objects in cert-shim controllers. ([`#8927`](https://github.com/cert-manager/cert-manager/pull/8927), [`@jabbrwcky`](https://github.com/jabbrwcky))
- Promote the CAInjectorMerging feature gate to GA ([`#8583`](https://github.com/cert-manager/cert-manager/pull/8583), [`@Copilot`](https://github.com/apps/copilot-swe-agent))
- When using ACME HTTP-01 with a ListenerSet, setting the annotation `acme.cert-manager.io/http01-parentreffallback: "true"` causes cert-manager to use the parent Gateway as the solver HTTPRoute parentRef instead of the ListenerSet. This enables TLS-only ListenerSets to rely on a shared Gateway HTTP listener for ACME challenges. ([`#8749`](https://github.com/cert-manager/cert-manager/pull/8749), [`@apkatsikas`](https://github.com/apkatsikas))

### Bug or Regression

- **BREAKING**: The Helm chart no longer ships a default `Role` and `RoleBinding` granting the cert-manager controller ServiceAccount permission to create tokens for itself (`serviceaccounts/token: create`). This RBAC was added in v1.16 (#7213) but no documented workflow requires it, and the motivating Route53 docs section was removed in Oct 2024. If you rely on `serviceAccountRef.name` pointing at the controller ServiceAccount (an undocumented pattern), you must now create your own `Role` and `RoleBinding` granting `serviceaccounts/token: create` on that ServiceAccount, or migrate to one of the documented patterns (IRSA ambient, or a dedicated ServiceAccount with its own RBAC). ([`#8931`](https://github.com/cert-manager/cert-manager/pull/8931), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- ACME challenges no longer terminally fail on transient network errors (TLS handshake timeouts, DNS failures, context cancellation) during nonce fetches and authorization waits. The challenge controller returns the error and lets the workqueue retry with backoff. ([`#8760`](https://github.com/cert-manager/cert-manager/pull/8760), [`@texasich`](https://github.com/texasich))
- Add dns issuer secrets validation before marking it as ready ([`#8255`](https://github.com/cert-manager/cert-manager/pull/8255), [`@Peac36`](https://github.com/Peac36))
- Add missing issuer finalizer RBAC to the order controller to support owner references ([`#8654`](https://github.com/cert-manager/cert-manager/pull/8654), [`@erikgb`](https://github.com/erikgb))
- ClusterIssuer metrics collector now correctly respects the enabled-controllers configuration, avoiding a redundant startup when only operating within a namespace. ([`#8822`](https://github.com/cert-manager/cert-manager/pull/8822), [`@lunarwhite`](https://github.com/lunarwhite))
- Fix Venafi TPP issuer setup and signing regression on master: restore authentication of the vcert connector in the client constructor, which was removed in #8808. ([`#8843`](https://github.com/cert-manager/cert-manager/pull/8843), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- Fix a performance issue in the certificateRequestApproval webhook where CertificateRequests referencing a GroupKind whose CRD is not yet installed would trigger repeated API server discovery queries on every admission request. Negative results are now cached for 30 seconds. ([`#8651`](https://github.com/cert-manager/cert-manager/pull/8651), [`@mateenali66`](https://github.com/mateenali66))
- Fix webhook serving certificate not being renewed after system suspend. ([`#8464`](https://github.com/cert-manager/cert-manager/pull/8464), [`@Peac36`](https://github.com/Peac36))
- Fixed a rare panic in the trigger controller when a Certificate is deleted from the informer cache while a reconcile is in progress (e.g. during namespace teardown). ([`#8962`](https://github.com/cert-manager/cert-manager/pull/8962), [`@hjoshi123`](https://github.com/hjoshi123))
- Fixed an integer overflow in `renewBeforePercentage` calculations that caused Certificates with durations longer than approximately 3 years to be incorrectly rejected by validation or assigned incorrect renewal times. ([`#8947`](https://github.com/cert-manager/cert-manager/pull/8947), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- Fixed duplicate `parentRef` bug when both issuer config and annotations are present. ([`#8619`](https://github.com/cert-manager/cert-manager/pull/8619), [`@hjoshi123`](https://github.com/hjoshi123))
- Fixed infinite re-issuance loop when issuer returns an already expired certificate ([`#8610`](https://github.com/cert-manager/cert-manager/pull/8610), [`@onurmicoogullari`](https://github.com/onurmicoogullari))
- Fixed local `e2e-setup-samplewebhook` installation to use the samplewebhook image repository and tag from the saved image tarball manifest. ([`#8821`](https://github.com/cert-manager/cert-manager/pull/8821), [`@wallrj`](https://github.com/wallrj))
- Fixed potential OOM in DNS-over-HTTPS client by bounding response body read with io.LimitReader (128 KB cap). ([`#8803`](https://github.com/cert-manager/cert-manager/pull/8803), [`@SebTardif`](https://github.com/SebTardif))
- Fixed validation of timezone-prefixed renewal window cron specs without a schedule. ([`#8813`](https://github.com/cert-manager/cert-manager/pull/8813), [`@immanuwell`](https://github.com/immanuwell))
- Helm chart bugfix: rename image helper to avoid umbrella chart conflicts ([`#8753`](https://github.com/cert-manager/cert-manager/pull/8753), [`@FelixPhipps`](https://github.com/FelixPhipps))
- Helm: Fix invalid YAML generated when both `webhook.config` and `webhook.volumes` are defined. ([`#8664`](https://github.com/cert-manager/cert-manager/pull/8664), [`@jnohlgard`](https://github.com/jnohlgard))
- Remove ACME Challenge `create` and Order `create`/`patch`/`update` from
  the cert-manager-edit aggregate ClusterRole to prevent direct
  manipulation of these internal resources (GHSA-8rvj-mm4h-c258). ([`#8958`](https://github.com/cert-manager/cert-manager/pull/8958), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- Remove issuer owner reference from challenges blocking challenge garbage collection ([`#8743`](https://github.com/cert-manager/cert-manager/pull/8743), [`@erikgb`](https://github.com/erikgb))
- Update logic to identify and preserve the secret matching nextPrivateKeySecretName ([`#8577`](https://github.com/cert-manager/cert-manager/pull/8577), [`@putongyong`](https://github.com/putongyong))
- Vault Issuer webhook validation now rejects `..` path segments in `spec.vault.path` and auth mount path fields, preventing `path.Join` from silently resolving relative segments before constructing the Vault API request. ([`#8930`](https://github.com/cert-manager/cert-manager/pull/8930), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))

### Other (Cleanup or Flake)

- API cleanup: removed deprecated ObjectReference ([`#8625`](https://github.com/cert-manager/cert-manager/pull/8625), [`@inteon`](https://github.com/inteon))
- Remove Helm values `prometheus.servicemonitor.targetPort`, `prometheus.servicemonitor.path`, and `prometheus.podmonitor.path`. The metrics path is always `/metrics` and the target port is always `http-metrics`. Rename the controller service metrics port from `tcp-prometheus-servicemonitor` to `http-metrics` for consistency with other workloads. Users must remove these keys from their value overrides before upgrading. ([`#8952`](https://github.com/cert-manager/cert-manager/pull/8952), [`@erikgb`](https://github.com/erikgb))
- The `enableGatewayAPI` and `enableGatewayAPIListenerSet` fields on `ControllerConfiguration` are deprecated and moved into the `gatewayAPI` sub-struct as `gatewayAPI.enabled` and `gatewayAPI.enableListenerSet`. The old fields continue to work. ([`#8732`](https://github.com/cert-manager/cert-manager/pull/8732), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- Update base images to Debian 13 ([`#8849`](https://github.com/cert-manager/cert-manager/pull/8849), [`@ltwongaa`](https://github.com/ltwongaa))
{/* END changelog v1.21.0 */}
