---
title: Release 1.19
description: 'cert-manager release notes: cert-manager 1.19'
---

cert-manager is the easiest way to automatically manage certificates in Kubernetes and OpenShift clusters.

This release focuses on expanding platform compatibility, improving deployment flexibility, enhancing observability, and addressing key reliability issues.

Be sure to review all new features and changes below, and read the full release notes carefully before upgrading.

## Major Themes

###  Deployment and Platform Compatibility
- The default network policy now includes `IPv6` rules to improve support for dual-stack and `IPv6` enabled clusters.
- The Helm chart has a new `global.nodeSelector` value, to set a single node selector across all cert-manager components. This simplifies the deployment of cert-manager.
- The Helm chart has a new (experimental) `global.hostUsers` flag which, if set to `false`, configures all the cert-manager Pods to use the [User Namespace feature of Kubernetes `>= 1.33`](https://kubernetes.io/docs/tasks/configure-pod-container/user-namespaces/). You can use this feature to reduce the damage a compromised container can do to the host or other pods in the same node. This new feature is disabled by default to maintain compatibility with Kubernetes `< 1.33`. In the future, when Kubernetes 1.32 reaches its end-of-life, the Helm chart value may be removed (or become a no-op) and cert-manager Pods will be configured to use user-namespaces by default.

### ACME and Certificate Management
- There is a new feature gate `ACMEHTTP01IngressPathTypeExact`, to allow `ingress-nginx` users to turn off the new default Ingress `PathType: Exact` setting. This is useful if you are using an old version of `ingress-nginx` which does not properly support `PathType: Exact`.
- The Issuer and ClusterIssuer custom resources have new fields which allow you to configure resource requests and resource limits for ACME HTTP-01 solver pods. This allows teams to override the global `--acme-http01-solver-resource-*` flag values which are set by the platform administrator.
- The ACME challenge authorization timeout has been increased to two minutes to reduce `error waiting for authorization` failures.
- There is now stricter solver validation to reject configurations that specify multiple ingress selection options (e.g. `class`, `ingressClassName`, `name`).
- There are DNS and API improvements. A new `protocol` field was added for the `rfc2136` DNS01 provider.
- The `CAInjectorMerging` feature has been promoted to BETA which means it is enabled by default. This means the feature, which configures the CA Injector to merges new CA certificates with existing ones instead of replacing them outright, is now considered stable and will be active unless explicitly disabled.
- There are various reliability fixes related to certificates and CSRs: increased maximum parsable PEM sizes, corrected permitted URI domain handling in CSR name constraints, and improved admission error messages for malformed PEM data.

### Observability, Reliability, and Maintenance
- There is a new Prometheus metric called `certmanager_certificate_challenge_status`.
- POTENTIALLY BREAKING: A high cardinality label, called `path`, was removed from the `certmanager_acme_client_request_count` and `certmanager_acme_client_request_duration_seconds` metrics. It is replaced with a new bounded cardinality label called `action`. This may require updates to dashboards and alerts.

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:
{/* BEGIN contributors */}
- [`@StingRayZA`](https://github.com/StingRayZA)
- [`@armagankaratosun`](https://github.com/armagankaratosun)
- [`@hjoshi123`](https://github.com/hjoshi123)
- [`@jcpunk`](https://github.com/jcpunk)
- [`@kinolaev`](https://github.com/kinolaev)
- [`@lunarwhite`](https://github.com/lunarwhite)
- [`@mladen-rusev-cyberark`](https://github.com/mladen-rusev-cyberark)
- [`@prasad89`](https://github.com/prasad89)
- [`@quantpoet`](https://github.com/quantpoet)
- [`@sspreitzer`](https://github.com/sspreitzer)
{/* END contributors */}
for their contributions, comments and support!

Also, thanks to the cert-manager maintainer team for their help in this release:
{/* BEGIN maintainers */}
- [`@SgtCoDFish`](https://github.com/SgtCoDFish)
- [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot)
- [`@erikgb`](https://github.com/erikgb)
- [`@inteon`](https://github.com/inteon)
- [`@maelvls`](https://github.com/maelvls)
- [`@munnerz`](https://github.com/munnerz)
- [`@wallrj`](https://github.com/wallrj)
{/* END maintainers */}

And finally, thanks to the cert-manager steering committee for their feedback in this release cycle:
{/* BEGIN steerers */}
- [`@FlorianLiebhart`](https://github.com/FlorianLiebhart)
- [`@TrilokGeer`](https://github.com/TrilokGeer)
- [`@ianarsenault`](https://github.com/ianarsenault)
- [`@ssyno`](https://github.com/ssyno)
{/* END steerers */}

{/* BEGIN changelog v1.19.0 */}
## `v1.19.0`

Changes since `v1.18.0`:

### Feature

- Add IPv6 rules to the default network policy ([`#7726`](https://github.com/cert-manager/cert-manager/pull/7726), [`@jcpunk`](https://github.com/jcpunk))
- Add `global.nodeSelector` to helm chart to allow for a single `nodeSelector` to be set across all services. ([`#7818`](https://github.com/cert-manager/cert-manager/pull/7818), [`@StingRayZA`](https://github.com/StingRayZA))
- Add a feature gate to default to Ingress `pathType` `Exact` in ACME HTTP01 Ingress challenge solvers. ([`#7795`](https://github.com/cert-manager/cert-manager/pull/7795), [`@sspreitzer`](https://github.com/sspreitzer))
- Add generated `applyconfigurations` allowing clients to make type-safe server-side apply requests for cert-manager resources. ([`#7866`](https://github.com/cert-manager/cert-manager/pull/7866), [`@erikgb`](https://github.com/erikgb))
- Added API defaults to issuer references group (cert-manager.io) and kind (Issuer). ([`#7414`](https://github.com/cert-manager/cert-manager/pull/7414), [`@erikgb`](https://github.com/erikgb))
- Added `certmanager_certificate_challenge_status` Prometheus metric. ([`#7736`](https://github.com/cert-manager/cert-manager/pull/7736), [`@hjoshi123`](https://github.com/hjoshi123))
- Added `protocol` field for `rfc2136` DNS01 provider ([`#7881`](https://github.com/cert-manager/cert-manager/pull/7881), [`@hjoshi123`](https://github.com/hjoshi123))
- Added experimental field `hostUsers` flag to all pods. Not set by default. ([`#7973`](https://github.com/cert-manager/cert-manager/pull/7973), [`@hjoshi123`](https://github.com/hjoshi123))
- Support configurable resource requests and limits for ACME HTTP01 solver pods through ClusterIssuer and Issuer specifications, allowing granular resource management that overrides global `--acme-http01-solver-resource-*` settings. ([`#7972`](https://github.com/cert-manager/cert-manager/pull/7972), [`@lunarwhite`](https://github.com/lunarwhite))
- The `CAInjectorMerging` feature has been promoted to BETA and is now enabled by default ([`#8017`](https://github.com/cert-manager/cert-manager/pull/8017), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- The controller, webhook and ca-injector now log their version and git commit on startup for easier debugging and support. ([`#8072`](https://github.com/cert-manager/cert-manager/pull/8072), [`@prasad89`](https://github.com/prasad89))
- Updated `certificate` metrics to the collector approach. ([`#7856`](https://github.com/cert-manager/cert-manager/pull/7856), [`@hjoshi123`](https://github.com/hjoshi123))

### Bug or Regression

- ACME: Increased challenge authorization timeout to 2 minutes to fix `error waiting for authorization` ([`#7796`](https://github.com/cert-manager/cert-manager/pull/7796), [`@hjoshi123`](https://github.com/hjoshi123))
- BUGFIX: permitted URI domains were incorrectly used to set the excluded URI domains in the CSR's name constraints ([`#7816`](https://github.com/cert-manager/cert-manager/pull/7816), [`@kinolaev`](https://github.com/kinolaev))
- Enforced ACME HTTP-01 solver validation to properly reject configurations when multiple ingress options (`class`, `ingressClassName`, `name`) are specified simultaneously ([`#8021`](https://github.com/cert-manager/cert-manager/pull/8021), [`@lunarwhite`](https://github.com/lunarwhite))
- Increase maximum sizes of PEM certificates and chains which can be parsed in cert-manager, to handle leaf certificates with large numbers of DNS names or other identities ([`#7961`](https://github.com/cert-manager/cert-manager/pull/7961), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Reverted adding the `global.rbac.disableHTTPChallengesRole` Helm option. ([`#7836`](https://github.com/cert-manager/cert-manager/pull/7836), [`@inteon`](https://github.com/inteon))
- This change removes the `path` label of core ACME client metrics and will require users to update their monitoring dashboards and alerting rules if using those metrics. ([`#8109`](https://github.com/cert-manager/cert-manager/pull/8109), [`@mladen-rusev-cyberark`](https://github.com/mladen-rusev-cyberark))
- Use the latest version of `ingress-nginx` in E2E tests to ensure compatibility ([`#7792`](https://github.com/cert-manager/cert-manager/pull/7792), [`@wallrj`](https://github.com/wallrj))

### Other (Cleanup or Flake)

- Helm: Fix naming template of `tokenrequest` RoleBinding resource to improve consistency ([`#7761`](https://github.com/cert-manager/cert-manager/pull/7761), [`@lunarwhite`](https://github.com/lunarwhite))
- Improve error messages when certificates, CRLs or private keys fail admission due to malformed or missing PEM data ([`#7928`](https://github.com/cert-manager/cert-manager/pull/7928), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Major upgrade of Akamai SDK. NOTE: The new version has not been fully tested end-to-end due to the lack of cloud infrastructure. ([`#8003`](https://github.com/cert-manager/cert-manager/pull/8003), [`@hjoshi123`](https://github.com/hjoshi123))
- Update kind images to include the Kubernetes 1.33 node image ([`#7786`](https://github.com/cert-manager/cert-manager/pull/7786), [`@wallrj`](https://github.com/wallrj))
- Use `maps.Copy` for cleaner map handling ([`#8092`](https://github.com/cert-manager/cert-manager/pull/8092), [`@quantpoet`](https://github.com/quantpoet))
- Vault: Migrate Vault E2E add-on tests from deprecated `vault-client-go` to the new `vault/api` client. ([`#8059`](https://github.com/cert-manager/cert-manager/pull/8059), [`@armagankaratosun`](https://github.com/armagankaratosun))
{/* END changelog v1.19.0 */}
