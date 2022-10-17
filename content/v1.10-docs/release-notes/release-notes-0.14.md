---
title: Release Notes
description: 'cert-manager release notes: cert-manager v0.14'
---

The `v0.14` release has a few focus areas:

* Improving the deployment/installation process
* Improving the release process
* `CustomResourceDefinition` conversion
* Support for older Kubernetes and OpenShift versions
* Experimental 'bundle' output format for Certificates

As usual, please read the [upgrade notes](../installation/upgrading/upgrading-0.13-0.14.md) before upgrading.

## Webhook changes

**The webhook component is now required.** The webhook will be automatically enabled by the `v0.14` manifests, so no additional action is required.

If you have issues running the webhook in your environment, we'd like to hear from you! We are aware of issues relating
to firewall rules from the Kubernetes API server to the webhook pod(s) - we would like to gather together a corpus of
configuration snippets that can be used to ensure the webhook is successfully deployed in these environments too.

This change is required in order to support the upcoming changes to our API versions, as we introduce `v1alpha3`,
`v1beta1` and `v1` over the coming months!

## Improving our deployment and release process

After reports of various issues installing on older Kubernetes and OpenShift versions, we've taken some time to revise
our installation manifests.

There are now two 'variants' to choose from, 'standard' and the 'legacy', with a simple way to know which to use:

| Environment          | Variant to use             |
| -------------------- | -------------------------- |
| Kubernetes 1.15+     | `cert-manager.yaml`        |
| OpenShift 4          | `cert-manager.yaml`        |
| Kubernetes 1.11-1.14 | `cert-manager-legacy.yaml` |
| OpenShift 3.11       | `cert-manager-legacy.yaml` |

Please be sure to read the upgrade guide for more information on how to upgrade from a previous release.

## `CustomResourceDefinition` conversion webhook + `v1alpha3` API version

As part of the effort to mature our API, we are releasing the `v1alpha3` API version. This contains a number of small
changes, notably moving some fields to the `subject` stanza on the Certificate resource to be more consistent with how
certain options are specified.

With this we have enabled the 'conversion webhook', which enables API clients to utilize both the `v1alpha2` and
`v1alpha3` APIs simultaneously, similar to other core resources in Kubernetes.

Thanks to this conversion webhook, this upgrade and future upgrades after it should be seamless. The ability to make
these kinds of changes to our API will enable the `v1beta1` API version to be released in a seamless manner in an
upcoming release too.

More information on the webhook can be found in the [concepts section](../concepts/webhook.md).

## Support for Kubernetes 1.11 and OpenShift 3.11

We've had a number of users who are using OpenShift 3.11 & Kubernetes 1.11 reach out requesting support with
installation. In this release, we've expanded the range of Kubernetes versions we support to once again include 1.11,
as well as adding support for OpenShift 3.11.

A big thanks to [`@meyskens`](https://github.com/meyskens) for putting this together!

## Experimental 'bundle format' support (JKS and PKCS#12)

One of our top feature requests has been for support for [JKS and PKCS#12](https://github.com/cert-manager/cert-manager/issues/586)
bundle files as an output from Certificate resources.

In this release, we've added experimental support for both of these bundle formats. This can currently only be
configured globally with flags provided to the `cert-manager` pod (`--experimental-issue-jks` and
`--experimental-issue-pkcs12`). The password used for this bundle must _also_ be configured using the flags
`--experimental-jks-password` and `--experimental-pkcs12-keystore-password` respectively.

In the next release, we are aiming to provide native support for these bundle format types as part of the Certificate
resource configuration. We have added these flags now in order to gather feedback on the way this feature works, and
help guide how this feature should work in future.

## Extended support for Venafi features

Users of the Venafi issuer often need to set custom metadata on their certificate requests in order to better associate
each request with different business areas, or in order to validate & authorize whether a request should be signed.

In this release, we've added support for setting custom metadata by adding the `venafi.cert-manager.io/custom-fields`
annotation on `Certificate` and `CertificateRequest` resources. If using the Venafi TPP integration, version 19.2 or
greater is required.

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

- Update Deployment selector to follow Helm chart best practices. This will require deleting the three cert-manager Deployment resources before upgrading. ([#2654](https://github.com/cert-manager/cert-manager/pull/2654), [`@munnerz`](https://github.com/munnerz))

## Changes by Kind

### Feature

- Add `--experimental-issue-jks` flag to enable JKS bundle generation in generated Secret resources. This flag will be replaced with native support for JKS bundles in future and is currently an experimental feature. If enabled, the `--experimental-jks-password` flag must also be set to the password used to encrypt JKS bundles. ([#2647](https://github.com/cert-manager/cert-manager/pull/2647), [`@munnerz`](https://github.com/munnerz))
- Add `--experimental-issue-pkcs12` flag to enable PKCS12 bundle generation in generated Secret resources. This flag will be replaced with native support for PKCS12 bundles in future and is currently an experimental feature. If enabled, the `--experimental-pkcs12-keystore-password` flag must also be set to the password used to encrypt PKCS12 bundles. ([#2643](https://github.com/cert-manager/cert-manager/pull/2643), [`@munnerz`](https://github.com/munnerz))
- Add `venafi.cert-manager.io/custom-fields` annotation for Venafi custom fields ([#2573](https://github.com/cert-manager/cert-manager/pull/2573), [`@meyskens`](https://github.com/meyskens))
- Add `emailSANs` field to Certificate resource ([#2597](https://github.com/cert-manager/cert-manager/pull/2597), [`@meyskens`](https://github.com/meyskens))
- Added `--tls-cipher-suites` command line flag to the webhook binary with sensible defaults ([#2562](https://github.com/cert-manager/cert-manager/pull/2562), [`@willthames`](https://github.com/willthames))
- Build OpenShift 3.11 compatible CRDs ([#2609](https://github.com/cert-manager/cert-manager/pull/2609), [`@meyskens`](https://github.com/meyskens))
- Enable CRD conversion webhook and begin serving `v1alpha3` ([#2563](https://github.com/cert-manager/cert-manager/pull/2563), [`@munnerz`](https://github.com/munnerz))
- Improve startup time for webhook pod. ([#2574](https://github.com/cert-manager/cert-manager/pull/2574), [`@JoshVanL`](https://github.com/JoshVanL))
- Replace `00-crds.yaml` file with a manifest file published as part of the release ([#2665](https://github.com/cert-manager/cert-manager/pull/2665), [`@munnerz`](https://github.com/munnerz))

### Other (Bug, Cleanup or Flake)

- Bump `Venafi/vcert` dependency to support custom fields in Venafi TPP 19.2 ([#2663](https://github.com/cert-manager/cert-manager/pull/2663), [`@munnerz`](https://github.com/munnerz))
- Fix `GroupVersionKind` set on `OwnerReference` of resources created by HTTP01 challenge solver, causing HTTP01 validations to fail on OpenShift 4 ([#2546](https://github.com/cert-manager/cert-manager/pull/2546), [`@munnerz`](https://github.com/munnerz))
- Fix Venafi Cloud URL field being marked required ([#2568](https://github.com/cert-manager/cert-manager/pull/2568), [`@munnerz`](https://github.com/munnerz))
- Fix bug in ingress-shim causing Certificate resources to be rapidly updated if multiple `spec.tls[].hosts` entries refer to the same Secret name but a different set of hosts ([#2611](https://github.com/cert-manager/cert-manager/pull/2611), [`@munnerz`](https://github.com/munnerz))
- Fix bug that could cause certificates to be incorrectly issued with an invalid public key ([#2539](https://github.com/cert-manager/cert-manager/pull/2539), [`@munnerz`](https://github.com/munnerz))
- Fix `cainjector.enabled=False` override being ignored by the Helm Chart ([#2544](https://github.com/cert-manager/cert-manager/pull/2544), [`@gtaylor`](https://github.com/gtaylor))
- Include license header in manifests attached to GitHub releases ([#2684](https://github.com/cert-manager/cert-manager/pull/2684), [`@munnerz`](https://github.com/munnerz))
- Make the webhook `RoleBinding` the leader election namespace instead of hard-coded `kube-system` ([#2621](https://github.com/cert-manager/cert-manager/pull/2621), [`@travisghansen`](https://github.com/travisghansen))
- Replace `openshift` and `no-webhook` manifest variants with a "legacy" variant ([#2648](https://github.com/cert-manager/cert-manager/pull/2648), [`@meyskens`](https://github.com/meyskens))
- Truncate message display if HTTP01 self check fails ([#2613](https://github.com/cert-manager/cert-manager/pull/2613), [`@munnerz`](https://github.com/munnerz))
- Upgrade to Go 1.14 ([#2656](https://github.com/cert-manager/cert-manager/pull/2656), [`@munnerz`](https://github.com/munnerz))

## Other Changes

- Add `//build/release-tars` targets for generating release artifacts ([#2556](https://github.com/cert-manager/cert-manager/pull/2556), [`@munnerz`](https://github.com/munnerz))
- Improve local testing and development environment setup code ([#2534](https://github.com/cert-manager/cert-manager/pull/2534), [`@munnerz`](https://github.com/munnerz))
- Remove `isOpenShift` from Helm chart ([#2642](https://github.com/cert-manager/cert-manager/pull/2642), [`@meyskens`](https://github.com/meyskens))
- Remove `webhook.enabled` variable in Helm chart as the webhook now is a required component ([#2649](https://github.com/cert-manager/cert-manager/pull/2649), [`@meyskens`](https://github.com/meyskens))