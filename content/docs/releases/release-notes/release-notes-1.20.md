---
title: Release 1.20
description: 'cert-manager release notes: cert-manager 1.20'
---

## v1.20.2

v1.20.2 fixes invalid YAML generated in the Helm chart when both `webhook.config`
and `webhook.volumes` are defined, and bumps Go to 1.26.2 along with dependencies
to address reported vulnerabilities.

### Changelog since v1.20.1

#### Bug or Regression

- Helm: Fix invalid YAML generated when both `webhook.config` and `webhook.volumes` are defined. ([#8665](https://github.com/cert-manager/cert-manager/pull/8665), [`@cert-manager-bot`](https://github.com/cert-manager-bot))

#### Other (Cleanup or Flake)

- Bump go dependencies with reported vulnerabilities ([#8704](https://github.com/cert-manager/cert-manager/pull/8704), [`@erikgb`](https://github.com/erikgb))
- Bump go to 1.26.2 ([#8703](https://github.com/cert-manager/cert-manager/pull/8703), [`@erikgb`](https://github.com/erikgb))

## v1.20.1

v1.20.1 fixes a missing RBAC rule for the issuer finalizer which caused a
regression for OpenShift users, bumps gRPC to address a reported vulnerability
that doesn't directly affect cert-manager but was flagged by security scanners,
and fixes a duplicate `parentRef` bug when both issuer config and annotations
are present when using the ACME Issuer with Gateway API.

### Changelog since v1.20.0

#### Bug or Regression

- Add missing issuer finalizer RBAC to the order controller to support owner references ([#8655](https://github.com/cert-manager/cert-manager/pull/8655))
- Fixed duplicate `parentRef` bug when both issuer config and annotations are present. ([#8658](https://github.com/cert-manager/cert-manager/pull/8658))
- Bump google.golang.org/grpc to fix vulnerability reported by scanners ([#8657](https://github.com/cert-manager/cert-manager/pull/8657), [`@erikgb`](https://github.com/erikgb))

## v1.20.0

This release focuses on adding support for the new ListenerSet resource, as well
as features like Azure Private Zones in the DNS01 issuer and support for the
NetworkPolicy resource.

Be sure to review all new features and changes below, and read the full release
notes carefully before upgrading.

### Major Themes

#### Network Policy

The cert-manager Helm chart now allows you to create NetworkPolicy resources
for all the cert-manager Deployments.
This makes it easier to follow [best practices when deploying cert-manager in production](../../installation/best-practice.md#network-requirements-and-network-policy).

#### ListenerSet and `parentRef` override

cert-manager 1.20 now supports ListenerSet as part of its integration with
Gateway API. It was already possible to get cert-manager to create a Certificate
resource by annotating an Ingress or Gateway resource, but with this release,
cert-manager can now also create Certificates by annotating a ListenerSet
resource. For context, ListenerSet is a new resource in Gateway API that was
made stable in Gateway API 1.5. This is an alpha feature that is disabled by
default, but it can be enabled with the ListenerSet feature gate. To learn more
about this feature, check out the [ListenerSet
documentation](../../usage/gateway.md).

Another improvement we have made is the possibility to leave the `parentRefs`
field empty on the Issuer and ClusterIssuer; it will be automatically guessed by
cert-manager.

#### Azure DNS Private Zones for DNS-01

cert-manager 1.20 adds support for Azure DNS Private Zones in the DNS01 issuer.
This means that you can now use cert-manager to issue certificates for domains
that are hosted in Azure DNS Private Zones, which are not accessible from the
public internet. All you have to do to use this feature is to set the new
`zoneType` field:

```yaml
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    solvers:
    - dns01:
        azureDNS:
          zoneType: AzurePrivateZone # <- this field.
```

More details are available in the PR: https://github.com/cert-manager/cert-manager/pull/8494.

### Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:

{/* BEGIN contributors */}

- [`@LiquidPL`](https://github.com/LiquidPL)
- [`@mathieu`](https://github.com/mathieu)
- [`@mikeluttikhuis`](https://github.com/mikeluttikhuis)
- [`@iossifbenbassat123`](https://github.com/iossifbenbassat123)
- [`@shubham14bajpai`](https://github.com/shubham14bajpai)
- [`@changgesi`](https://github.com/changgesi)
- [`@eleanor`](https://github.com/eleanor)
- [`@jaxels10`](https://github.com/jaxels10)
- [`@WinterCabbage`](https://github.com/WinterCabbage)
- [`@calm329`](https://github.com/calm329)
- [`@majiayu000`](https://github.com/majiayu000)
- [`@FelixPhipps`](https://github.com/FelixPhipps)
- [`@SlashNephy`](https://github.com/SlashNephy)
- [`@dancmeyers`](https://github.com/dancmeyers)
- [`@alviss7`](https://github.com/alviss7)
- [`@tkna`](https://github.com/tkna)
- [`@robertlestak`](https://github.com/robertlestak)

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
- [`@hjoshi123`](https://github.com/hjoshi123) who just joined the team!
{/* END maintainers */}

And finally, thanks to the cert-manager steering committee for their feedback in this release cycle:

{/* BEGIN steerers */}
- [`@FlorianLiebhart`](https://github.com/FlorianLiebhart)
- [`@TrilokGeer`](https://github.com/TrilokGeer)
- [`@ianarsenault`](https://github.com/ianarsenault)
- [`@ssyno`](https://github.com/ssyno)
{/* END steerers */}

{/* BEGIN changelog v1.20.0 */}

### Changelog since v1.19.0

#### Feature

- Add a set of flags to permit setting NetworkPolicy across all deployed containers.
  Remove redundant global IP ranges from example policies. ([#8370](https://github.com/cert-manager/cert-manager/pull/8370), [`@jcpunk`](https://github.com/jcpunk))
- Add selectable fields to custom resource definitions for `.spec.issuerRef.{group, kind, name}` ([#8256](https://github.com/cert-manager/cert-manager/pull/8256), [`@tareksha`](https://github.com/tareksha))
- Add support for specifying `imagePullSecrets` in the `startupapicheck-job` Helm template to enable pulling images from private registries. ([#8186](https://github.com/cert-manager/cert-manager/pull/8186), [`@mathieu-clnk`](https://github.com/mathieu-clnk))
- Added `extraContainers` helm chart value, allowing the deployment of arbitrary sidecar containers within the cert-manager operator pod. This can be used to support, for e.g., AWS IAM Roles Anywhere for Route53 `dns01` verification. ([#8355](https://github.com/cert-manager/cert-manager/pull/8355), [`@dancmeyers`](https://github.com/dancmeyers))
- Added `parentRef` override annotations on the Certificate resource. ([#8518](https://github.com/cert-manager/cert-manager/pull/8518), [`@hjoshi123`](https://github.com/hjoshi123))
- Added support for azure private zones for `dns01` issuer. ([#8494](https://github.com/cert-manager/cert-manager/pull/8494), [`@hjoshi123`](https://github.com/hjoshi123))
- Added support for configuring PEM decoding size limits, allowing operators to handle larger certificates and keys. ([#7642](https://github.com/cert-manager/cert-manager/pull/7642), [`@robertlestak`](https://github.com/robertlestak))
- Added support for `unhealthyPodEvictionPolicy` in PodDisruptionBudget ([#7728](https://github.com/cert-manager/cert-manager/pull/7728), [`@jcpunk`](https://github.com/jcpunk))
- For Venafi provider, read `venafi.cert-manager.io/custom-fields` annotation on Issuer/ClusterIssuer and use it as base with override/append capabilities on Certificate level. ([#8301](https://github.com/cert-manager/cert-manager/pull/8301), [`@k0da`](https://github.com/k0da))
- Improve error message when CA issuers are misconfigured to use a clashing secret name ([#8374](https://github.com/cert-manager/cert-manager/pull/8374), [`@majiayu000`](https://github.com/majiayu000))
- Introduce a new Ingress annotation `acme.cert-manager.io/http01-ingress-ingressclassname` to override `http01.ingress.ingressClassName` field in HTTP-01 challenge solvers. ([#8244](https://github.com/cert-manager/cert-manager/pull/8244), [`@lunarwhite`](https://github.com/lunarwhite))
- Update `global.nodeSelector` to helm chart to perform a `merge` and allow for a single `nodeSelector` to be set across all services. ([#8195](https://github.com/cert-manager/cert-manager/pull/8195), [`@StingRayZA`](https://github.com/StingRayZA))
- Vault issuers will now include the Vault server address as one of the default audiences on generated service account tokens. ([#8228](https://github.com/cert-manager/cert-manager/pull/8228), [`@terinjokes`](https://github.com/terinjokes))
- Added experimental XListenerSet feature gate ( [#8394](https://github.com/cert-manager/cert-manager/pull/8394), [`@hjoshi123`](https://github.com/hjoshi123))
- Promoting `xlistenerset` feature gate to `listenerset` ([#8501](https://github.com/cert-manager/cert-manager/pull/8501), [`@hjoshi123`](https://github.com/hjoshi123))

#### Documentation

- Add GWAPI documentation to `NOTES.TXT` in helm chart ([#8353](https://github.com/cert-manager/cert-manager/pull/8353), [`@jaxels10`](https://github.com/jaxels10))

#### Bug or Regression

- Adds logs for cases when acme server returns us a fatal error in the order controller ([#8199](https://github.com/cert-manager/cert-manager/pull/8199), [`@Peac36`](https://github.com/Peac36))
- BUGFIX: in case kind or group in the `issuerRef` of a Certificate was omitted, upgrading to v1.19.x incorrectly caused the certificate to be renewed ([#8160](https://github.com/cert-manager/cert-manager/pull/8160), [`@inteon`](https://github.com/inteon))
- Changes to the Duration and `RenewBefore` annotations on ingress and `gateway-api` resources will now trigger certificate updates. ([#8232](https://github.com/cert-manager/cert-manager/pull/8232), [`@eleanor-merry`](https://github.com/eleanor-merry))
- Fix an issue where ACME challenge TXT records are not cleaned up when there are many resource records in CloudDNS. ([#8456](https://github.com/cert-manager/cert-manager/pull/8456), [`@tkna`](https://github.com/tkna))
- Fix unregulated retries with the DigitalOcean DNS-01 solver
  Add full detailed DNS-01 errors to the events attached to the Challenge, for easier debugging ([#8221](https://github.com/cert-manager/cert-manager/pull/8221), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- Fixed an infinite re-issuance loop that could occur when an issuer returns a certificate with a public key that doesn't match the CSR. The issuing controller now validates the certificate before storing it and fails with backoff on mismatch. ([#8403](https://github.com/cert-manager/cert-manager/pull/8403), [`@calm329`](https://github.com/calm329))
- Fixed an issue where HTTP-01 challenges failed when the Host header contains an IPv6 address. This means that users can now issue IP address certificates for IPv6 address subjects. ([#8424](https://github.com/cert-manager/cert-manager/pull/8424), [`@SlashNephy`](https://github.com/SlashNephy))
- Fixed the HTTP-01 Gateway solver creating invalid HTTPRoutes by not setting `spec.hostnames` when the challenge `DNSName` is an IP address. ([#8443](https://github.com/cert-manager/cert-manager/pull/8443), [`@alviss7`](https://github.com/alviss7))
- Revert API defaults for issuer reference kind and group introduced in 0.19.0 ([#8173](https://github.com/cert-manager/cert-manager/pull/8173), [`@erikgb`](https://github.com/erikgb))
- Security (MODERATE): Fix a potential panic in the cert-manager controller when a DNS response in an unexpected order was cached. If an attacker was able to modify DNS responses (or if they controlled the DNS server) it was possible to cause denial of service for the cert-manager controller. ([#8469](https://github.com/cert-manager/cert-manager/pull/8469), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Update Go to `v1.25.5` to fix `CVE-2025-61727` and `CVE-2025-61729` ([#8290](https://github.com/cert-manager/cert-manager/pull/8290), [`@octo-sts[bot]`](https://github.com/apps/octo-sts))
- When Prometheus monitoring is enabled, the metrics label is now set to the intended value of `cert-manager`. Previously, it was set depending on various factors (namespace cert-manager is installed in and/or Helm release name). ([#8162](https://github.com/cert-manager/cert-manager/pull/8162), [`@LiquidPL`](https://github.com/LiquidPL))

#### Other (Cleanup or Flake)

- Promoted the `OtherNames` feature to Beta and enabled it by default ([#8288](https://github.com/cert-manager/cert-manager/pull/8288), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- Rebranding of the Venafi Issuer to CyberArk ([#8215](https://github.com/cert-manager/cert-manager/pull/8215), [`@iossifbenbassat123`](https://github.com/iossifbenbassat123))
- Switched to SSA for challenge finalizer updates ([#8519](https://github.com/cert-manager/cert-manager/pull/8519), [`@inteon`](https://github.com/inteon))
- The default container user (UID) is now 65532 (previously 1000) and the default container group (GID) is now 65532 (previously 0) ([#8408](https://github.com/cert-manager/cert-manager/pull/8408), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- The feature-gate `DefaultPrivateKeyRotationPolicyAlways` moved from Beta to GA and can no longer be disabled. ([#8287](https://github.com/cert-manager/cert-manager/pull/8287), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- Update cert-manager's ACME client, forked from `golang/x/crypto` ([#8268](https://github.com/cert-manager/cert-manager/pull/8268), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Use the latest version of Kyverno (1.16.2) in the best-practice installation tests ([#8389](https://github.com/cert-manager/cert-manager/pull/8389), [`@wallrj-cyberark`](https://github.com/wallrj-cyberark))
- We stopped testing with Contour due to it not supporting the new XListenerSet resource, and moved to `kgateway`. ([#8426](https://github.com/cert-manager/cert-manager/pull/8426), [`@hjoshi123`](https://github.com/hjoshi123))
