---
title: Release 1.20
description: 'cert-manager release notes: cert-manager 1.20'
---

cert-manager is the easiest way to automatically manage certificates in
Kubernetes and OpenShift clusters.

TODO

Be sure to review all new features and changes below, and read the full release notes carefully before upgrading.

## Major Themes

### Network Policy

The cert-manager Helm chart now allows you to create `NetworkPolicy` resources
for all the cert-manager Deployments.
This makes it easier to follow [best practices when deploying cert-manager in production](../../installation/best-practice.md#network-requirements-and-network-policy).

### TODO ADD REMAINING THEMES

TODO

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:

{/* BEGIN contributors */}
- [`@LiquidPL`](https://github.com/LiquidPL)
- [`@Peac36`](https://github.com/Peac36)
- [`@mathieu-clnk`](https://github.com/mathieu-clnk)
- [`@mikeluttikhuis`](https://github.com/mikeluttikhuis)
- [`@wallrj-cyberark`](https://github.com/wallrj-cyberark)
{/* END contributors */}

...for their contributions, comments and support!

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

{/* BEGIN changelog v1.20.0-alpha.0 */}
## `v1.20.0-alpha.0`

Changes since `v1.19.0`:

### Feature

- Add built-in "Ready" status metrics for ClusterIssuer and Issuer resources. ([`#8188`](https://github.com/cert-manager/cert-manager/pull/8188), [`@mikeluttikhuis`](https://github.com/mikeluttikhuis))
- Add support for specifying `imagePullSecrets` in the `startupapicheck-job` Helm template to enable pulling images from private registries. ([`#8186`](https://github.com/cert-manager/cert-manager/pull/8186), [`@mathieu-clnk`](https://github.com/mathieu-clnk))

### Bug or Regression

- Adds logs for cases when acme server returns us a fatal error in the order controller ([`#8199`](https://github.com/cert-manager/cert-manager/pull/8199), [`@Peac36`](https://github.com/Peac36))
- BUGFIX: in case kind or group in the `issuerRef` of a Certificate was omitted, upgrading to `1.19.x` incorrectly caused the certificate to be renewed ([`#8160`](https://github.com/cert-manager/cert-manager/pull/8160), [`@inteon`](https://github.com/inteon))
- Fix unregulated retries with the DigitalOcean DNS-01 solver ([`#8221`](https://github.com/cert-manager/cert-manager/pull/8221), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- Add full detailed DNS-01 errors to the events attached to the Challenge, for easier debugging ([`#8221`](https://github.com/cert-manager/cert-manager/pull/8221), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- Revert API defaults for issuer reference kind and group introduced in `1.19.0` ([`#8173`](https://github.com/cert-manager/cert-manager/pull/8173), [`@erikgb`](https://github.com/erikgb))
- When Prometheus monitoring is enabled, the metrics label is now set to the intended value of `cert-manager`. Previously, it was set depending on various factors (namespace cert-manager is installed in and/or Helm release name). ([`#8162`](https://github.com/cert-manager/cert-manager/pull/8162), [`@LiquidPL`](https://github.com/LiquidPL))
{/* END changelog v1.20.0-alpha.0 */}
