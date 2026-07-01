---
title: Release 1.21
description: 'cert-manager release notes: cert-manager 1.21'
---

:::warning
These are **draft release notes**. cert-manager v1.21 is currently a pre-release and is **not recommended for use in production**. The final release notes will be published when v1.21.0 is released.
:::

cert-manager v1.21 includes:

**New features:**
- ACME Renewal Information (ARI / RFC 9773) support via the `ACMEUseARI` feature gate
- AWS IAM authentication (IRSA, EKS Pod Identity, ambient EC2/ECS) for the Vault issuer
- Modern2026 PKCS#12 encoding profile (FIPS 140-3 compatible)
- Certificate renewal policies
- `waitInsteadOfSelfCheck` solver option — skip cert-manager's self-check for split-horizon DNS or NAT hairpin environments
- `--certificate-request-maximum-backoff-duration` flag — cap the exponential retry backoff for failed CertificateRequests
- Webhook serving certificate renewal fixed after system suspend or VM live migration
- Venafi OAuth token observability and `AuthFailed` Issuer condition; PANW NGTS support added
- Gateway API: HTTP01 ListenerSet parentRef fallback annotation; additional listener protocols; `CAInjectorMerging` promoted to GA
- cainjector `--ignore-namespaces` flag
- `runtimeClassName` support for cert-manager components and ACME HTTP01 solver pods
- `startupapicheck.ttlSecondsAfterFinished` Helm value for automatic Job cleanup
- `--acme-http01-solver-extra-labels` flag to propagate `global.commonLabels` to solver resources

**Breaking changes:**
- Removal of the default `tokenrequest` RBAC from the Helm chart
- Removal of Challenge and Order write permissions from the `cert-manager-edit` aggregate ClusterRole
- Removal of configurable metrics path and port name Helm values

## Major Themes

### Default `tokenrequest` RBAC removed from Helm chart

> ⚠️ Breaking change

The Helm chart no longer creates a default `Role` and `RoleBinding` granting
the cert-manager controller permission to create tokens for its own
ServiceAccount (`serviceaccounts/token: create`).

This RBAC was added in v1.16
([cert-manager/cert-manager#7213](https://github.com/cert-manager/cert-manager/pull/7213))
to support a "Using the cert-manager ServiceAccount" section in the Route53
documentation. That docs section was subsequently removed
([cert-manager/website#1555](https://github.com/cert-manager/website/pull/1555))
when the Route53 page was restructured, and no documented workflow — Route53
IRSA ambient, Vault Kubernetes auth, or any other issuer — requires the
controller to mint tokens for its own ServiceAccount.

If you use `serviceAccountRef.name` pointing at the controller ServiceAccount,
you must now either:

- create your own `Role` and `RoleBinding` granting
  `serviceaccounts/token: create` on that ServiceAccount, or
- migrate to a dedicated ServiceAccount with its own RBAC (recommended — see
  the [Vault](../../configuration/vault.md) or
  [Route53](../../configuration/acme/dns01/route53.md) documentation).

Credit to **@everping** and **@kodareef5** for independently identifying (via
privately reported security advisories) that this default RBAC widened the trust
boundary beyond what cert-manager's published
[threat model](../../devops-tips/threat-modelling.md) documents.

### Restrict Challenge and Order RBAC in `cert-manager-edit` ClusterRole

> ⚠️ Potentially breaking change

The `cert-manager-edit` aggregate ClusterRole no longer grants `create` for
`challenges.acme.cert-manager.io` or `create`, `patch`, `update` for
`orders.acme.cert-manager.io`. This fixes a security issue
([`GHSA-8rvj-mm4h-c258`](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258))
where these permissions allowed namespace users to bypass Issuer solver
selectors and abuse ClusterIssuer credentials.

These resources are internal to cert-manager's ACME workflow and are not
intended to be created or modified directly by users. Challenge `patch` and
`update` are retained because the Challenge spec is immutable after creation
and users may need these verbs to remove stuck finalizers
(cert-manager/cert-manager#3851, cert-manager/cert-manager#3870).

This change was already shipped in patch releases v1.20.3 and v1.19.6, so if
you are already running one of those versions this will not be a breaking
change.

If you have tooling or workflows that create Challenge or Order resources
directly (outside of the normal Certificate → CertificateRequest → Order →
Challenge flow), you will need to grant those permissions explicitly.

### Metrics port name and path Helm values removed

> ⚠️ Breaking change

The Helm values `prometheus.servicemonitor.targetPort`,
`prometheus.servicemonitor.path`, and `prometheus.podmonitor.path` have been
removed. The metrics path is always `/metrics` and the ServiceMonitor
`targetPort` is always the port named `http-metrics` — these were the defaults
and there was no supported reason to override them.

The controller Service metrics port has also been renamed from
`tcp-prometheus-servicemonitor` to `http-metrics`, aligning it with the webhook
and cainjector services.

Because the Helm values schema uses `additionalProperties: false`, users who
still have any of the removed keys in their values overrides will see a schema
validation error on upgrade. Remove these keys from your values file before
upgrading.

([cert-manager/cert-manager#8952](https://github.com/cert-manager/cert-manager/pull/8952),
[@erikgb](https://github.com/erikgb))

### Configurable CertificateRequest retry backoff duration

cert-manager 1.21 adds the `--certificate-request-maximum-backoff-duration`
controller flag (default: 32 hours), making the exponential backoff cap
configurable alongside the existing `--certificate-request-minimum-backoff-duration`
flag.

When a CertificateRequest fails, cert-manager backs off exponentially — by
default from 1 hour up to 32 hours. In environments with scheduled CA
maintenance windows, the backoff can grow so large that cert-manager does not
retry until hours after the CA comes back online. With this flag, cluster
operators can lower the ceiling to match their CA's maintenance schedule. For
example, `--certificate-request-maximum-backoff-duration=1h` ensures that
cert-manager retries at most every hour regardless of how many consecutive
failures have occurred.

The default of 32 hours preserves the behavior of previous releases. The flag
may also be set via the
[`certificateRequestMaximumBackoffDuration`](../../reference/api-docs.md#controller.config.cert-manager.io/v1alpha1.ControllerConfiguration)
field in the controller `ControllerConfiguration` API, or via the Helm chart:

```yaml
config:
  certificateRequestMaximumBackoffDuration: 1h
```

See the [controller CLI reference](../../cli/controller.md) for the full list of
flags, and [What happens if issuance fails? Will it be retried?](../../faq/README.md#what-happens-if-issuance-fails-will-it-be-retried)
for background on how cert-manager retries failed issuances.

([cert-manager/cert-manager#8893](https://github.com/cert-manager/cert-manager/pull/8893),
[@lunarwhite](https://github.com/lunarwhite))

### Skip the self-check with `waitInsteadOfSelfCheck`

cert-manager 1.21 adds the `waitInsteadOfSelfCheck` solver option for ACME
HTTP01 and DNS01 challenges. When set, cert-manager skips its own self-check
and instead waits the configured duration after presentation before asking the
ACME server to validate. This is an escape hatch for environments where
cert-manager cannot reliably observe the same validation path as the ACME
server, such as split-horizon DNS or NAT loopback (or hairpinning).

See [Skip the self-check with
`waitInsteadOfSelfCheck`](../../configuration/acme/README.md#skip-the-self-check-with-waitinsteadofselfcheck)
for configuration details.

### Webhook Serving Certificate Renewal After System Suspend

The cert-manager webhook generates and automatically renews its own self-signed
serving certificate. Prior to 1.21, the renewal timer relied solely on Go's
monotonic clock (`CLOCK_MONOTONIC`). During system suspend (S3/S4) or VM live
migration, `CLOCK_MONOTONIC` stops advancing while wall-clock time
(`CLOCK_REALTIME`) continues. When the system resumes, the renewal timer has not
yet reached its deadline, so the webhook's serving certificate is never renewed
— even though it has already expired. This causes `x509: certificate has expired
or is not yet valid` errors for all admission and conversion webhook calls.

cert-manager 1.21 adds a periodic ticker that polls wall-clock time against the
renewal deadline, detecting missed renewals regardless of whether
`CLOCK_MONOTONIC` advanced. The webhook now recovers within one minute of system
resume.

More details are available in the PR:
https://github.com/cert-manager/cert-manager/pull/8464.

### ACME Renewal Information (ARI) support

cert-manager 1.21 adds experimental support for RFC 9773 ACME Renewal
Information (ARI), behind the `ACMEUseARI` feature gate. When enabled, and when
the ACME server advertises a `renewalInfo` endpoint, cert-manager queries the
server for its recommended renewal window before deciding whether to re-issue a
certificate. This allows ACME servers — including Let's Encrypt — to proactively
prompt renewal of certificates affected by mass revocations or CA key rollovers,
without requiring operators to intervene.

([cert-manager/cert-manager#8798](https://github.com/cert-manager/cert-manager/pull/8798),
[@hjoshi123](https://github.com/hjoshi123))

### AWS IAM authentication for the Vault issuer

The Vault issuer now supports AWS IAM-based authentication in three modes:

- **IRSA (IAM Roles for Service Accounts)**: the cert-manager controller pod
  assumes an AWS IAM role via Kubernetes projected service account tokens.
- **EKS Pod Identity**: authentication via the EKS Pod Identity agent sidecar.
- **Ambient credentials**: uses the EC2/ECS instance metadata service when
  running on AWS without an explicitly configured role.

All three modes avoid the need to store long-lived AWS credentials as Kubernetes
Secrets.

([cert-manager/cert-manager#8422](https://github.com/cert-manager/cert-manager/pull/8422),
[@bitloi](https://github.com/bitloi))

### Modern2026 PKCS#12 encoding profile

cert-manager 1.21 adds the `Modern2026` profile for PKCS#12 output, based on
the `go-pkcs12` library's Modern2026 encoder. This profile uses FIPS 140-3
approved algorithms (AES-256 + SHA-256 KDFs) instead of the legacy 3DES/RC2
defaults. It is suitable for environments with FIPS or compliance requirements
that prohibit older cipher suites.

([cert-manager/cert-manager#8841](https://github.com/cert-manager/cert-manager/pull/8841),
[@seanorama](https://github.com/seanorama))

### Certificate renewal policies

cert-manager 1.21 adds `renewalPolicies` to the Certificate API, allowing
operators to fine-tune when cert-manager triggers a renewal. This complements the
existing `renewBefore` and `renewBeforePercentage` fields, providing more
expressive control over renewal scheduling.

([cert-manager/cert-manager#8258](https://github.com/cert-manager/cert-manager/pull/8258),
[@hjoshi123](https://github.com/hjoshi123))

### Gateway API improvements

Several improvements to the Gateway API integration land in 1.21:

- **HTTP01 ListenerSet parentRef fallback**: the new
  `acme.cert-manager.io/http01-parentreffallback: "true"` annotation causes
  cert-manager to use the parent Gateway as the solver HTTPRoute parentRef
  instead of the ListenerSet. This enables TLS-only ListenerSets (which cannot
  receive HTTP challenges) to rely on a shared Gateway HTTP listener for ACME
  validation.
  ([#8749](https://github.com/cert-manager/cert-manager/pull/8749),
  [@apkatsikas](https://github.com/apkatsikas))

- **`cert-manager.io/ignore-tls-listeners` annotation**: allows Gateway TLS
  listeners to be excluded from certificate management, useful when some
  listeners are managed by a different controller.
  ([#8727](https://github.com/cert-manager/cert-manager/pull/8727),
  [@hjoshi123](https://github.com/hjoshi123))

- **Additional listener protocols**: the Gateway API integration now recognizes
  configurable listener protocols beyond the default set, making cert-manager
  compatible with custom protocol extensions.
  ([#8683](https://github.com/cert-manager/cert-manager/pull/8683),
  [@ThatsMrTalbot](https://github.com/ThatsMrTalbot))

- **`enableGatewayAPI` configuration restructure**: the `enableGatewayAPI` and
  `enableGatewayAPIListenerSet` fields on `ControllerConfiguration` are
  deprecated in favor of a `gatewayAPI.enabled` / `gatewayAPI.enableListenerSet`
  sub-struct. The old fields continue to work.
  ([#8732](https://github.com/cert-manager/cert-manager/pull/8732),
  [@ThatsMrTalbot](https://github.com/ThatsMrTalbot))

### cainjector improvements

- **`CAInjectorMerging` promoted to GA**: the `CAInjectorMerging` feature gate is
  now unconditionally enabled and will be removed in a future release. This
  changes how cainjector merges CA data into webhook and API service objects.
  ([#8583](https://github.com/cert-manager/cert-manager/pull/8583))

- **Server-side apply unconditional**: cainjector now always uses server-side
  apply (SSA) to patch CA bundles, and the `ServerSideApply` feature gate is
  deprecated. SSA removes the last-applied-configuration annotation bloat and
  makes conflict detection more reliable.
  ([#8692](https://github.com/cert-manager/cert-manager/pull/8692),
  [@erikgb](https://github.com/erikgb))

- **`--ignore-namespaces` flag**: the new cainjector flag accepts a
  comma-separated list of namespace names that cainjector will skip when
  watching Secrets for injection. This reduces the number of watch events in
  clusters with a large number of namespaces or where some namespaces contain
  large secrets that cainjector does not need.
  ([#8614](https://github.com/cert-manager/cert-manager/pull/8614),
  [@figaw](https://github.com/figaw))

### Venafi integration updates

cert-manager 1.21 adds two improvements to the Venafi/CyberArk integration:

- **OAuth token observability**: a new `AuthFailed` reason on the Issuer
  `Ready` condition distinguishes authentication failures (bad or expired
  credentials) from transient infrastructure errors, making it easier to
  diagnose Venafi connectivity problems.
  ([#8808](https://github.com/cert-manager/cert-manager/pull/8808),
  [@FelixPhipps](https://github.com/FelixPhipps))

- **PANW NGTS support**: the Venafi issuer now supports PANW Next-Generation
  Trust Services as a backend, in addition to Venafi TPP and Venafi Control
  Plane.
  ([#8779](https://github.com/cert-manager/cert-manager/pull/8779),
  [@FelixPhipps](https://github.com/FelixPhipps))

### ACME security hardening

The ACME Challenge and Order controllers now enforce stricter resource
ownership rules (GHSA-8rvj-mm4h-c258):

- Challenges without a valid Order owner reference are rejected.
- Order specs are now immutable after creation.
- Pre-placed Challenges with a mismatched spec are detected and refused.

This prevents a malicious actor with write access to Order or Challenge
resources from influencing ACME validation in unexpected ways.

Additionally, ACME challenges no longer permanently fail on transient network
errors (TLS handshake timeouts, DNS resolution failures, context cancellation)
during nonce fetches or authorization waits. The workqueue retries with
exponential backoff instead.

([cert-manager/cert-manager#8948](https://github.com/cert-manager/cert-manager/pull/8948),
[#8760](https://github.com/cert-manager/cert-manager/pull/8760))

### Notable bug fixes

- **Integer overflow in `renewBeforePercentage`**: Certificates with durations
  longer than approximately 3 years were incorrectly rejected by validation or
  assigned incorrect renewal times due to a 32-bit integer overflow in the
  percentage arithmetic. Fixed in
  [#8947](https://github.com/cert-manager/cert-manager/pull/8947)
  ([@ThatsMrTalbot](https://github.com/ThatsMrTalbot)).

- **Infinite re-issuance loop**: cert-manager no longer enters an infinite
  re-issuance loop when an issuer returns an already-expired certificate.
  Fixed in
  [#8610](https://github.com/cert-manager/cert-manager/pull/8610)
  ([@onurmicoogullari](https://github.com/onurmicoogullari)).

- **DNS issuer secrets validated before ready**: the DNS issuer now validates
  that the referenced Secret exists and is well-formed before marking the issuer
  Ready, preventing silent misconfiguration.
  Fixed in
  [#8255](https://github.com/cert-manager/cert-manager/pull/8255)
  ([@Peac36](https://github.com/Peac36)).

- **Vault path traversal validation**: the Vault issuer webhook now rejects
  `..` path segments in `spec.vault.path` and auth mount path fields,
  preventing `path.Join` from silently resolving relative segments before
  constructing the Vault API URL.
  Fixed in
  [#8930](https://github.com/cert-manager/cert-manager/pull/8930).

- **DNS-over-HTTPS response body unbounded read**: the DNS-over-HTTPS client
  now caps response body reads at 128 KB, preventing a potential OOM from a
  malicious or misconfigured DoH resolver.
  Fixed in
  [#8803](https://github.com/cert-manager/cert-manager/pull/8803)
  ([@SebTardif](https://github.com/SebTardif)).

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
- Harden ACME Challenge and Order resources: reject user-created Challenges
  without Order ownership, enforce Order spec immutability, and detect
  pre-placed same-name Challenges with mismatched specs. ([`#8948`](https://github.com/cert-manager/cert-manager/pull/8948), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
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
