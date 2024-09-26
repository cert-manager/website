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
- Add `renewBeforePercentage` alternative to `renewBefore` ([#6987](https://github.com/cert-manager/cert-manager/pull/6987), [`@cbroglie`](https://github.com/cbroglie))
- Add a metrics server to the cainjector ([#7194](https://github.com/cert-manager/cert-manager/pull/7194), [`@wallrj`](https://github.com/wallrj))
- Add a metrics server to the webhook ([#7182](https://github.com/cert-manager/cert-manager/pull/7182), [`@wallrj`](https://github.com/wallrj))
- Add client certificate auth method for Vault issuer ([#4330](https://github.com/cert-manager/cert-manager/pull/4330), [`@joshmue`](https://github.com/joshmue))
- Add process and go runtime metrics for controller ([#6966](https://github.com/cert-manager/cert-manager/pull/6966), [`@mindw`](https://github.com/mindw))
- Added `app.kubernetes.io/managed-by: cert-manager` label to the cert-manager-webhook-ca Secret ([#7154](https://github.com/cert-manager/cert-manager/pull/7154), [`@jrcichra`](https://github.com/jrcichra))
- Allow the user to specify a Pod template when using GatewayAPI HTTP01 solver, this mirrors the behavior when using the Ingress HTTP01 solver. ([#7211](https://github.com/cert-manager/cert-manager/pull/7211), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- Create token request RBAC for the cert-manager ServiceAccount by default ([#7213](https://github.com/cert-manager/cert-manager/pull/7213), [`@Jasper-Ben`](https://github.com/Jasper-Ben))
- Feature: Add a new `ClientWatchList` feature flag to cert-manager controller, cainjector and webhook, which allows the components to use of the ALPHA `WatchList` / Streaming list feature of the Kubernetes API server. This reduces the load on  the Kubernetes API server when cert-manager starts up and reduces the peak memory usage in the cert-manager components. ([#7175](https://github.com/cert-manager/cert-manager/pull/7175), [`@wallrj`](https://github.com/wallrj))
- Feature: Append cert-manager user-agent string to all AWS API requests, including IMDS and STS requests. ([#7295](https://github.com/cert-manager/cert-manager/pull/7295), [`@wallrj`](https://github.com/wallrj))
- Feature: Log AWS SDK warnings and API requests at cert-manager debug level to help debug AWS Route53 problems in the field. ([#7292](https://github.com/cert-manager/cert-manager/pull/7292), [`@wallrj`](https://github.com/wallrj))
- Feature: The Route53 DNS solver of the ACME Issuer will now use regional STS endpoints computed from the region that is supplied in the Issuer spec or in the `AWS_REGION` environment variable.
  Feature: The Route53 DNS solver of the ACME Issuer now uses the "ambient" region (`AWS_REGION` or `AWS_DEFAULT_REGION`) if `issuer.spec.acme.solvers.dns01.route53.region` is empty; regardless of the flags `--issuer-ambient-credentials` and `--cluster-issuer-ambient-credentials`. ([#7299](https://github.com/cert-manager/cert-manager/pull/7299), [`@wallrj`](https://github.com/wallrj))
- Helm: adds JSON schema validation for the Helm values. ([#7069](https://github.com/cert-manager/cert-manager/pull/7069), [`@inteon`](https://github.com/inteon))
- If the `--controllers` flag only specifies disabled controllers, the default controllers are now enabled implicitly.
  Added `disableAutoApproval` and `approveSignerNames` Helm chart options. ([#7049](https://github.com/cert-manager/cert-manager/pull/7049), [`@inteon`](https://github.com/inteon))
- Make it easier to configure cert-manager using Helm by defaulting `config.apiVersion` and `config.kind` within the Helm chart. ([#7126](https://github.com/cert-manager/cert-manager/pull/7126), [`@ThatsMrTalbot`](https://github.com/ThatsMrTalbot))
- Now passes down specified duration to Venafi client instead of using the CA default only. ([#7104](https://github.com/cert-manager/cert-manager/pull/7104), [`@Guitarkalle`](https://github.com/Guitarkalle))
- Reduce the memory usage of `cainjector`, by only caching the metadata of Secret resources.
  Reduce the load on the K8S API server when `cainjector` starts up, by only listing the metadata of Secret resources. ([#7161](https://github.com/cert-manager/cert-manager/pull/7161), [`@wallrj`](https://github.com/wallrj))
- The Route53 DNS01 solver of the ACME Issuer can now detect the AWS region from the `AWS_REGION` and `AWS_DEFAULT_REGION` environment variables, which is set by the IAM for Service Accounts (IRSA) webhook and by the Pod Identity webhook.
  The `issuer.spec.acme.solvers.dns01.route53.region` field is now optional.
  The API documentation of the `region` field has been updated to explain when and how the region value is used. ([#7287](https://github.com/cert-manager/cert-manager/pull/7287), [`@wallrj`](https://github.com/wallrj))
- Venafi TPP issuer can now be used with a username & password combination with OAuth. Fixes #4653.
  Breaking: cert-manager will no longer use the API Key authentication method which was deprecated in 20.2 and since removed in 24.1 of TPP. ([#7084](https://github.com/cert-manager/cert-manager/pull/7084), [`@hawksight`](https://github.com/hawksight))
- You can now configure the pod security context of HTTP-01 solver pods. ([#5373](https://github.com/cert-manager/cert-manager/pull/5373), [`@aidy`](https://github.com/aidy))

### Bug or Regression

- Adds support (behind a flag) to use a domain qualified finalizer. If the feature is enabled (which is not by default), it should prevent Kubernetes from reporting: `metadata.finalizers: "finalizer.acme.cert-manager.io": prefer a domain-qualified finalizer name to avoid accidental conflicts with other finalizer writers` ([#7273](https://github.com/cert-manager/cert-manager/pull/7273), [`@jsoref`](https://github.com/jsoref))
- BUGFIX Route53: explicitly set the `aws-global` STS region which is now required by the `github.com/aws/aws-sdk-go-v2` library. ([#7108](https://github.com/cert-manager/cert-manager/pull/7108), [`@inteon`](https://github.com/inteon))
- BUGFIX: fix issue that caused Vault issuer to not retry signing when an error was encountered. ([#7105](https://github.com/cert-manager/cert-manager/pull/7105), [`@inteon`](https://github.com/inteon))
- BUGFIX: the dynamic certificate source used by the webhook TLS server failed to detect a root CA approaching expiration, due to a calculation error. This will cause the webhook TLS server to fail renewing its CA certificate. Please upgrade before the expiration of this CA certificate is reached. ([#7230](https://github.com/cert-manager/cert-manager/pull/7230), [`@inteon`](https://github.com/inteon))
- Bugfix: Prevent aggressive Route53 retries caused by IRSA authentication failures by removing the Amazon Request ID from errors wrapped by the default credential cache. ([#7291](https://github.com/cert-manager/cert-manager/pull/7291), [`@wallrj`](https://github.com/wallrj))
- Bugfix: Prevent aggressive Route53 retries caused by STS authentication failures by removing the Amazon Request ID from STS errors. ([#7259](https://github.com/cert-manager/cert-manager/pull/7259), [`@wallrj`](https://github.com/wallrj))
- Bump `grpc-go` to fix `GHSA-xr7q-jx4m-x55m` ([#7164](https://github.com/cert-manager/cert-manager/pull/7164), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Bump the `go-retryablehttp` dependency to fix `CVE-2024-6104` ([#7125](https://github.com/cert-manager/cert-manager/pull/7125), [`@SgtCoDFish`](https://github.com/SgtCoDFish))
- Fix Azure DNS causing panics whenever authentication error happens ([#7177](https://github.com/cert-manager/cert-manager/pull/7177), [`@eplightning`](https://github.com/eplightning))
- Fix incorrect indentation of `endpointAdditionalProperties` in the `PodMonitor` template of the Helm chart ([#7190](https://github.com/cert-manager/cert-manager/pull/7190), [`@wallrj`](https://github.com/wallrj))
- Fixes ACME HTTP01 challenge behavior when using Gateway API to prevent unbounded creation of HTTPRoute resources ([#7178](https://github.com/cert-manager/cert-manager/pull/7178), [`@miguelvr`](https://github.com/miguelvr))
- Handle errors arising from challenges missing from the ACME server ([#7202](https://github.com/cert-manager/cert-manager/pull/7202), [`@bdols`](https://github.com/bdols))
- Helm BUGFIX: the cainjector ConfigMap was not mounted in the cainjector deployment. ([#7052](https://github.com/cert-manager/cert-manager/pull/7052), [`@inteon`](https://github.com/inteon))
- Improve the startupapicheck: validate that the validating and mutating webhooks are doing their job. ([#7057](https://github.com/cert-manager/cert-manager/pull/7057), [`@inteon`](https://github.com/inteon))
- The `KeyUsages` X.509 extension is no longer added when there are no key usages set (in accordance to RFC 5280 Section 4.2.1.3) ([#7250](https://github.com/cert-manager/cert-manager/pull/7250), [`@inteon`](https://github.com/inteon))
- Update `github.com/Azure/azure-sdk-for-go/sdk/azidentity` to address `CVE-2024-35255` ([#7087](https://github.com/cert-manager/cert-manager/pull/7087), [`@dependabot[bot]`](https://github.com/apps/dependabot))

### Other (Cleanup or Flake)

- Old API versions were removed from the codebase.
  Removed:
  (acme.)cert-manager.io/v1alpha2
  (acme.)cert-manager.io/v1alpha3
  (acme.)cert-manager.io/v1beta1 ([#7278](https://github.com/cert-manager/cert-manager/pull/7278), [`@inteon`](https://github.com/inteon))
- Upgrading to client-go `v0.31.0` removes a lot of noisy `reflector.go: unable to sync list result: internal error: cannot cast object DeletedFinalStateUnknown` errors from logs. ([#7237](https://github.com/cert-manager/cert-manager/pull/7237), [`@inteon`](https://github.com/inteon))
