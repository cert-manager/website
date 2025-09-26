---
title: Release 1.19
description: 'cert-manager release notes: cert-manager 1.19'
---

cert-manager is the easiest way to automatically manage certificates in Kubernetes and OpenShift clusters.

This release focuses on expanding platform compatibility, improving deployment flexibility, enhancing observability, and addressing key reliability issues. Users should review breaking changes and new features before upgrading.

Be sure to review all new features and changes below, and read the full release notes carefully before upgrading.

## Major Themes

- **Expanded Platform Compatibility**
  - IPv6 rules have been added to the default network policy, improving support for dual-stack clusters and modern infrastructure.

- **Deployment Flexibility**
  - The Helm chart now supports a global `nodeSelector`, allowing users to easily target specific nodes for all cert-manager components.

- **ACME and Certificate Management Enhancements**
  - New feature gates for ACME HTTP01 challenge solvers, support for the ACME profiles extension, and more granular resource management for solver pods.
  - API defaults for issuer references and improved type safe server-side apply requests.

- **Observability and Metrics**
  - Introduction of new Prometheus metrics and updates to existing metrics for better monitoring.
  - The controller, webhook, and ca-injector now log their version and git commit on startup for improved debugging.

- **Reliability and Bug Fixes**
  - Increased ACME challenge authorization timeout, improved validation for ingress configurations, and support for larger PEM certificates.
  - Numerous bug fixes and improvements to error messages.

- **General Cleanup and Upgrades**
  - Major upgrade of Akamai SDK, improved Helm resource naming, and updated test infrastructure to use the latest Kubernetes node images.

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:

- [`@StingRayZA`](https://github.com/StingRayZA)
- [`@hjoshi123`](https://github.com/hjoshi123)
- [`@jcpunk`](https://github.com/jcpunk)
- [`@kinolaev`](https://github.com/kinolaev)
- [`@lunarwhite`](https://github.com/lunarwhite)
- [`@prasad89`](https://github.com/prasad89)
- [`@quantpoet`](https://github.com/quantpoet)
- [`@sspreitzer`](https://github.com/sspreitzer)

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


## `v1.19.0`

Changes since `v1.18.2`:

### Feature

- Add IPv6 rules to the default network policy ([`#7726`](https://github.com/cert-manager/cert-manager/pull/7726), [`@jcpunk`](https://github.com/jcpunk))
- Add `global.nodeSelector` to helm chart to allow for a single `nodeSelector` to be set across all services. ([`#7818`](https://github.com/cert-manager/cert-manager/pull/7818), [`@StingRayZA`](https://github.com/StingRayZA))
- Add generated `applyconfigurations` allowing clients to make type safe server-side apply requests for cert-manager resources. ([`#7866`](https://github.com/cert-manager/cert-manager/pull/7866), [`@erikgb`](https://github.com/erikgb))
- Added API defaults to issuer references group (cert-manager.io) and kind (Issuer). ([`#7414`](https://github.com/cert-manager/cert-manager/pull/7414), [`@erikgb`](https://github.com/erikgb))
- Added `certmanager_certificate_challenge_status` Prometheus metric. ([`#7736`](https://github.com/cert-manager/cert-manager/pull/7736), [`@hjoshi123`](https://github.com/hjoshi123))
- Added `protocol` field for `rfc2136` DNS01 provider ([`#7881`](https://github.com/cert-manager/cert-manager/pull/7881), [`@hjoshi123`](https://github.com/hjoshi123))
- `CAInjectorMerging` has been promoted to BETA and is now enabled by default ([`#8017`](https://github.com/cert-manager/cert-manager/pull/8017), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- Feature: Add support for [`ACME profiles extension`](https://datatracker.ietf.org/doc/draft-aaron-acme-profiles/). ([`#7777`](https://github.com/cert-manager/cert-manager/pull/7777), [`@wallrj`](https://github.com/wallrj))
- Support configurable resource requests and limits for ACME HTTP01 solver pods through ClusterIssuer and Issuer specifications, allowing granular resource management that overrides global `--acme-http01-solver-resource-*` settings. ([`#7972`](https://github.com/cert-manager/cert-manager/pull/7972), [`@lunarwhite`](https://github.com/lunarwhite))
- The controller, webhook and ca-injector now logs its version and git commit on startup for easier debugging and support. ([`#8072`](https://github.com/cert-manager/cert-manager/pull/8072), [`@prasad89`](https://github.com/prasad89))
- Updated `certificate` metrics to the collector approach. ([`#7856`](https://github.com/cert-manager/cert-manager/pull/7856), [`@hjoshi123`](https://github.com/hjoshi123))

### Bug or Regression

- ACME: Increased challenge authorization timeout to 2 minutes to fix `error waiting for authorization` ([`#7796`](https://github.com/cert-manager/cert-manager/pull/7796), [`@hjoshi123`](https://github.com/hjoshi123))
- BUGFIX: permitted URI domains were incorrectly used to set the excluded URI domains in the CSR's name constraints ([`#7816`](https://github.com/cert-manager/cert-manager/pull/7816), [`@kinolaev`](https://github.com/kinolaev))
- Enforced ACME HTTP-01 solver validation to properly reject configurations when multiple ingress options (`class`, `ingressClassName`, `name`) are specified simultaneously ([`#8021`](https://github.com/cert-manager/cert-manager/pull/8021), [`@lunarwhite`](https://github.com/lunarwhite))
- Increase maximum sizes of PEM certificates and chains which can be parsed in cert-manager, to handle leaf certificates with large numbers of DNS names or other identities ([`#7961`](https://github.com/cert-manager/cert-manager/pull/7961), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Reverted adding the `global.rbac.disableHTTPChallengesRole` Helm option. ([`#7836`](https://github.com/cert-manager/cert-manager/pull/7836), [`@inteon`](https://github.com/inteon))
- Use the latest version of ingress-nginx in E2E tests to ensure compatibility ([`#7792`](https://github.com/cert-manager/cert-manager/pull/7792), [`@wallrj`](https://github.com/wallrj))

### Other (Cleanup or Flake)

- Helm: Fix naming template of `tokenrequest` RoleBinding resource to improve consistency ([`#7761`](https://github.com/cert-manager/cert-manager/pull/7761), [`@lunarwhite`](https://github.com/lunarwhite))
- Improve error messages when certificates, CRLs or private keys fail admission due to malformed or missing PEM data ([`#7928`](https://github.com/cert-manager/cert-manager/pull/7928), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Major upgrade of Akamai SDK. NOTE: The new version has not been fully tested end-to-end due to the lack of cloud infrastructure. ([`#8003`](https://github.com/cert-manager/cert-manager/pull/8003), [`@hjoshi123`](https://github.com/hjoshi123))
- Update kind images to include the Kubernetes 1.33 node image ([`#7786`](https://github.com/cert-manager/cert-manager/pull/7786), [`@wallrj`](https://github.com/wallrj))
- Use `maps.Copy` for cleaner map handling ([`#8092`](https://github.com/cert-manager/cert-manager/pull/8092), [`@quantpoet`](https://github.com/quantpoet))
