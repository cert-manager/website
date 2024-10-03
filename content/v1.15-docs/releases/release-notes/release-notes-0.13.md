---
title: Release Notes
description: 'cert-manager release notes: cert-manager v0.13'
---

The `v0.13` contains a number of important bug-fixes and a few notable feature additions. It is a minor, incremental
update over `v0.12` and does not require any special upgrade steps.

## ACME External Account Binding support

Users that wish to use cert-manager with ACME servers other than Let's Encrypt may have found themselves unable to
register an account due to the lack of (EAB) 'External Account Binding' support. This allows an ACME server to validate
that a user is somehow associated with some other entity, like an account in the CAs customer management system.

With EAB support, it's now possible to specify additional parameters (`spec.acme.externalAccountBinding`) on your ACME
Issuer resource and utilize cert-manager with your preferred ACME provider.

## Support for full set of X.509 'subject' parameters

In this release, support for the full range of 'subject' parameters as per the X.509 specification has been added.
This means you can set fields like `organizationalUnit`, `provinces`, `serialNumber`, `country`, and all other standard
X.509 subject fields.

A big thanks to [`@mathianasj`](https://github.com/mathianasj) for this addition!

## `InvalidRequest` status condition for `CertificateRequest` resources

For the growing ecosystem of developers creating their own 'external issuer types' for cert-manager, we have added
support for a new 'status condition' type `InvalidRequest` - this can be used to signal from your signer/issuer to
cert-manager that the parameters that the user has requested on the X.509 CSR are 'invalid' and the CSR should **not**
be retried.

This prevents users expending API quotas and making requests that will never succeed.

### Bug Fixes

- Fix invalid service account name used in RBAC resources when manually specifying a service account name ([#2509](https://github.com/cert-manager/cert-manager/pull/2509), [`@castlemilk`](https://github.com/castlemilk))
- fixed a bug that in certain cases could cause HTTP01 ingress `serviceName` fields to be incorrectly set ([#2460](https://github.com/cert-manager/cert-manager/pull/2460), [`@greywolve`](https://github.com/greywolve))
- Fix bug causing ever-increasing CPU usage in webhook component ([#2467](https://github.com/cert-manager/cert-manager/pull/2467), [`@munnerz`](https://github.com/munnerz))
- Fix bug causing temporary certificates to overwrite previously issued certificates when adding a new `dnsName` to an existing Certificate resource ([#2469](https://github.com/cert-manager/cert-manager/pull/2469), [`@munnerz`](https://github.com/munnerz))
- Fix `certmanager_certificate_expiration_timestamp_seconds` metric recording ([#2416](https://github.com/cert-manager/cert-manager/pull/2416), [`@munnerz`](https://github.com/munnerz))
- Fixes `ClusterIssuers` not finding the secret when the secret is in a different namespace than the certificate request using the Venafi issuer type ([#2520](https://github.com/cert-manager/cert-manager/pull/2520), [`@mathianasj`](https://github.com/mathianasj))
- Fixes generation if invalid certificate name the the 52nd character in a domain name is a symbol. ([#2516](https://github.com/cert-manager/cert-manager/pull/2516), [`@meyskens`](https://github.com/meyskens))


### Other Notable Changes

- Adds `InvalidRequest` condition type to `CertificateRequest`, signaling to not retry the request. ([#2508](https://github.com/cert-manager/cert-manager/pull/2508), [`@JoshVanL`](https://github.com/JoshVanL))
- Add volume and volume mounts field to cert-manager helm chart ([#2504](https://github.com/cert-manager/cert-manager/pull/2504), [`@joshuastern`](https://github.com/joshuastern))
- Add support for additional X.509 'subject' fields ([#2518](https://github.com/cert-manager/cert-manager/pull/2518), [`@mathianasj`](https://github.com/mathianasj))
- Bump `k8s.io/*` dependencies to Kubernetes 1.17.0 ([#2452](https://github.com/cert-manager/cert-manager/pull/2452), [`@munnerz`](https://github.com/munnerz))
- It is now possible to disable `AppArmor` when Pod Security Policies are used. ([#2489](https://github.com/cert-manager/cert-manager/pull/2489), [`@czunker`](https://github.com/czunker))
- Support for arbitrary `securityContext` parameters ([#2455](https://github.com/cert-manager/cert-manager/pull/2455), [`@nefischer`](https://github.com/nefischer))
- Remove misleading 'error decoding X.509 certificate' message ([#2470](https://github.com/cert-manager/cert-manager/pull/2470), [`@munnerz`](https://github.com/munnerz))
- Remove IP address validation on `dns01-recursive-nameservers` to allow domain names ([#2428](https://github.com/cert-manager/cert-manager/pull/2428), [`@haines`](https://github.com/haines))
- Optional `webhook.securityContext` and `cainjector.securityContext` chart parameters to specify pods security context. ([#2449](https://github.com/cert-manager/cert-manager/pull/2449), [`@nefischer`](https://github.com/nefischer))
- webhook: register HTTP handlers for `pprof` debug endpoints ([#2450](https://github.com/cert-manager/cert-manager/pull/2450), [`@munnerz`](https://github.com/munnerz))
- Adds support for chart configurable parameters  `deploymentAnnotations`, `webhook.deploymentAnnotations` and `cainjector.deploymentAnnotations` ([#2447](https://github.com/cert-manager/cert-manager/pull/2447), [`@nefischer`](https://github.com/nefischer))
- Adds ACME external account binding support ([#2392](https://github.com/cert-manager/cert-manager/pull/2392), [`@JoshVanL`](https://github.com/JoshVanL))
- Fix false-y values in helm chart to mitigate [`kubernetes/kubernetes#66450`](https://github.com/kubernetes/kubernetes/issues/66450) ([#2383](https://github.com/cert-manager/cert-manager/pull/2383), [`@colek42`](https://github.com/colek42))
- Explicitly define `containerPort` protocol in helm chart ([#2405](https://github.com/cert-manager/cert-manager/pull/2405), [`@bouk`](https://github.com/bouk))
- Switch to using upstream `golang.org/x/crypto/acme` ACME client library ([#2422](https://github.com/cert-manager/cert-manager/pull/2422), [`@munnerz`](https://github.com/munnerz))