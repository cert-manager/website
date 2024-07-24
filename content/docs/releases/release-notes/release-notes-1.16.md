---
title: Release 1.16
description: 'cert-manager release notes: cert-manager 1.16'
---

cert-manager 1.16 includes various improvements to the metrics in the cert-manager components.

## Themes

### Extended Metrics

The webhook and cainjector components now have metrics servers,
so that platform teams can monitor the performance of all the cert-manager components
and gain more information about the underlying Go runtime in the event of a problem.
Read the [Prometheus Metrics](../../devops-tips/prometheus-metrics.md) page to learn more.

## Community

Thanks again to all open-source contributors with commits in this release, including: TODO

Thanks also to the following cert-manager maintainers for their contributions during this release: TODO

Equally thanks to everyone who provided feedback, helped users and raised issues on GitHub and Slack and joined our meetings!

Thanks also to the CNCF, which provides resources and support, and to the AWS open source team for being good community members and for their maintenance of the PrivateCA Issuer.

In addition, massive thanks to Venafi for contributing developer time and resources towards the continued maintenance of cert-manager projects.

## Changes since `v1.15.0`

### Feature

- Add `SecretRef` support for Venafi TPP issuer CA Bundle ([#7036](https://github.com/cert-manager/cert-manager/pull/7036), [`@sankalp-at-gh`](https://github.com/sankalp-at-gh))
- Add a metrics server to the cainjector ([#7194](https://github.com/cert-manager/cert-manager/pull/7194), [`@wallrj`](https://github.com/wallrj))
- Add a metrics server to the webhook ([#7182](https://github.com/cert-manager/cert-manager/pull/7182), [`@wallrj`](https://github.com/wallrj))
- Add client certificate auth method for Vault issuer ([#4330](https://github.com/cert-manager/cert-manager/pull/4330), [`@joshmue`](https://github.com/joshmue))
- Add process and go runtime metrics for controller ([#6966](https://github.com/cert-manager/cert-manager/pull/6966), [`@mindw`](https://github.com/mindw))
- Add `renewBeforePercentage` alternative to `renewBefore` ([#6987](https://github.com/cert-manager/cert-manager/pull/6987), [`@cbroglie`](https://github.com/cbroglie))
- Default `config.apiVersion` and `config.kind` within the Helm chart ([#7126](https://github.com/cert-manager/cert-manager/pull/7126), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- Helm: adds JSON schema validation for the Helm values. ([#7069](https://github.com/cert-manager/cert-manager/pull/7069), [`@inteon`](https://github.com/inteon))
- If the `--controllers` flag only specifies disabled controllers, the default controllers are now enabled implicitly.
  Added `disableAutoApproval` and `approveSignerNames` Helm chart options. ([#7049](https://github.com/cert-manager/cert-manager/pull/7049), [`@inteon`](https://github.com/inteon))
- Reduce the memory usage of `cainjector`, by only caching the metadata of Secret resources.
  Reduce the load on the K8S API server when `cainjector` starts up, by only listing the metadata of Secret resources. ([#7161](https://github.com/cert-manager/cert-manager/pull/7161), [`@wallrj`](https://github.com/wallrj))

### Bug or Regression

- BUGFIX `route53`: explicitly set the `aws-global` STS region which is now required by the `github.com/aws/aws-sdk-go-v2` library. ([#7108](https://github.com/cert-manager/cert-manager/pull/7108), [`@inteon`](https://github.com/inteon))
- BUGFIX: fix issue that caused Vault issuer to not retry signing when an error was encountered. ([#7105](https://github.com/cert-manager/cert-manager/pull/7105), [`@inteon`](https://github.com/inteon))
- Bump `grpc-go` to fix `GHSA-xr7q-jx4m-x55m` ([#7164](https://github.com/cert-manager/cert-manager/pull/7164), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Bump the `go-retryablehttp` dependency to fix `CVE-2024-6104` ([#7125](https://github.com/cert-manager/cert-manager/pull/7125), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Fix Azure DNS causing panics whenever authentication error happens ([#7177](https://github.com/cert-manager/cert-manager/pull/7177), [`@eplightning`](https://github.com/eplightning))
- Fix incorrect indentation of `endpointAdditionalProperties` in the `PodMonitor` template of the Helm chart ([#7190](https://github.com/cert-manager/cert-manager/pull/7190), [`@wallrj`](https://github.com/wallrj))
- Fixes ACME HTTP01 challenge behavior when using Gateway API to prevent unbounded creation of HTTPRoute resources ([#7178](https://github.com/cert-manager/cert-manager/pull/7178), [`@miguelvr`](https://github.com/miguelvr))
- Helm BUGFIX: the cainjector ConfigMap was not mounted in the cainjector deployment. ([#7052](https://github.com/cert-manager/cert-manager/pull/7052), [`@inteon`](https://github.com/inteon))
- Improve the startupapicheck: validate that the validating and mutating webhooks are doing their job. ([#7057](https://github.com/cert-manager/cert-manager/pull/7057), [`@inteon`](https://github.com/inteon))
- Update `github.com/Azure/azure-sdk-for-go/sdk/azidentity` to address `CVE-2024-35255` ([#7087](https://github.com/cert-manager/cert-manager/pull/7087), [`@dependabot[bot]`](https://github.com/apps/dependabot))
