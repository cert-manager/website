---
title: Feature flags
description: Using feature gated functionality
---

New cert-manager features and functionality are often initially implemented behind a feature gate. This is so as to not break users with functionality that has not yet been tested in production as well as to give us a chance to remove or modify API fields and functionality following user feedback.

We have alpha and beta features. We do not aim to keep any of the features in alpha or beta stage indefinitely. Feature gating should only be used for functionality that can eventually be turned on by default for all users (or, if it is opt-in, can be safely toggled on by any user with a supported cert-manager installation).

A feature gate can be toggled on/off using `--feature-gates` flags on cert-manager controller. For feature gated functionality that comes with new API fields there is also a corresponding feature gate on webhook that also needs to be enabled using a `--feature-gates` flag if you want to use it.

**Alpha**

All alpha features are off by default. We retain the right to change or remove
alpha features without warning. An API field that is part of an alpha feature
and requires a webhook feature flag to be used also can also be removed from the
API without warning. An alpha feature might not work for all cert-manager's
supported Kubernetes versions. If you want to disable a previously enabled alpha
feature gate, you should make sure that you have updated any resources that have API
fields set that are only valid if the feature gate is enabled, else the resources
will end up in an invalid state.

**Beta**

All beta features are off by default. Beta features will not be removed, but may
be changed. If the feature gets changed in incompatible ways, we will provide
migration instructions. A beta feature will work with all cert-manager's
supported Kubernetes versions. If you want to disable a previously enabled beta
feature gate, you should make sure that you have updated any resources that have API
fields set that are only valid if the beta feature gate is on, else the resources
will end up in invalid state.

**GA**

A feature that is GA is on by default and cannot be disabled (unless it's opt in and toggled on/off by another mechanism, such as a flag).
With regards to API fields and their functionality, we keep Kubernetes API compatibility promise, see [API compatibility](./api-compatibility.md).
The feature flag for a GA feature might be left in place to avoid breaking folks, but will be non-functional. 

## Graduation

The graduation criteria can be different for each feature.
Generally, we find user feedback most valuable when determining if a feature is sufficiently mature to graduate. If you are using an alpha or beta feature and would like to see it graduate, it would be great if you could give us some feedback about how you use it and whether you find the API useful to initiate graduation process. Feel free to [open a GitHub issue](https://github.com/cert-manager/cert-manager/issues/new/choose) or [join one of our meetings](../contributing/#meetings) to talk about this.

## List of current feature gates

### Alpha

See `--feature-gates` flags on cert-manager controller and webhook to enable any of these features.

- `AdditionalCertificateOutputFormats`. Added in cert-manager 1.7.0. Allows to specify additional formats in which cert-manager will store issued certificates and keys. See [release note](../release-notes/release-notes-1.7.md#additional-certificate-output-formats). Requires the feature to be enabled on both cert-manager controller and webhook

- `ExperimentalCertificateSigningRequestControllers`. Added in cert-manager
  1.4.0. Allows to use Kubernetes
  [CertificateSigningRequest](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/)
  resources with cert-manager. See [release notes](../release-notes/release-notes-1.4.md#experimental-support-for-kubernetes-certificatesigningrequests)

- `ExperimentalGatewayAPISupport`. Added in cert-manager 1.5.0. Allows to use cert-manager to automatically issue certificates for `Gateway` resources as well as use `Gateway`s and `HTTPRoute`s to solve ACME HTTP-01 challenges. See [Securing Gateway resources](../usage/gateway.md)

- `LiteralCertificateSubject`. Added in cert-manager 1.9.0. Allows to specify certificate subject in a form that can be used to define a location in LDAP directory tree. See [release notes](../release-notes/release-notes-1.9.md#literal-certificate-subjects)

- `ServerSideApply`. Added in cert-manager 1.8.0. If this feature is enabled, cert-manager uses [Server side apply](https://kubernetes.io/docs/reference/using-api/server-side-apply/) when creating or updating API resources. This will speed cert-manager operations and prevent the resource version conflict errors. See [release notes](../release-notes/release-notes-1.8.md#server-side-apply)

- `StableCertificateRequestName`. Added in cert-manager 1.10.0. Will enable generation of `CertificateRequest` resources with a fixed name. See [`cert-manager#5487`](https://github.com/cert-manager/cert-manager/pull/5487)

- `UseCertificateRequestBasicConstraints`. Added in cert-manager 1.12.0. Makes cert-manager add a basic constraints section to certificate signing requests with the CA constraint set to the correct value. See [`cert-manager#5552`](https://github.com/cert-manager/cert-manager/pull/5552)

- `ValidateCAA`. Added in cert-manager 0.7.2. CAA checking when issuing a certificate.


### Beta

There are currently no beta feature gates
