---
title: Feature Policy
description: 'cert-manager contributing guide: Contribution Policy'
---

We love to receive both feature requests and PRs which add to and improve cert-manager; the community is at the heart of what we do!

If you're thinking of adding a feature, we recommend you read this doc to maximize the chances of your contribution getting the attention it deserves and hopefully to get it merged quickly!

We recommend creating an issue first for it to be discussed with the cert-manager maintainers. Another possibility is bringing it up in a community meeting for an open discussion on the implementation.

## Feature Sizing: Getting Your Change Accepted

We evaluate new features and PRs based on their size and their significance; either they're small or large.

### Smaller Features

Many contributions are small. That usually - but not always - means that implementing them won't require many lines of code to be added or changed, and in any case they should be easy
for maintainers to review. A PR being small is a good thing; if you can down-scope your feature to make it smaller, we won't complain!

If you believe your feature is small, please feel free to just raise a PR and optionally also post a link to your PR in the [cert-manager-dev slack channel](./README.md#slack). Usually a sufficiently small PR can be merged without too much ceremony. If we think it's actually a larger piece of work, we'll let you know.

### Larger Features

If you're not sure whether your PR is small, or if you know it's bigger, you'll want to speak to us first before raising a PR. This
will help to ensure that your PR is something we're likely to merge to avoid wasting your time. It'll also make it easier
for us to do the design process.

#### Design Documents

Larger feature development should normally start with a design discussion. To get that started, you would raise a PR with a design document against [cert-manager/cert-manager/design](https://github.com/cert-manager/cert-manager/tree/master/design). This allows us to discuss the proposed functionality before starting the work to implement it and serves as a way to document the decisions and reasoning behind them. Ideally, a good design document should allow for faster and more consistent feature development and implementation process by providing a single place where all potential concerns and questions are answered.

We have a [design template](https://github.com/cert-manager/cert-manager/blob/master/design/template.md) that outlines the structure of the document.
(This is a simplified version of [Kubernetes enhancements KEP template](https://github.com/kubernetes/enhancements/tree/master/keps/NNNN-kep-template)).
Do reach out if you need help with the design.

Part of the process of discussing a design document may also include a video call with you included! That helps us to plan how a feature should
be implemented and approached. It'll be pretty informal and casual; we just want to make sure we're all on the same page. This call might be part
of a biweekly meeting.

#### Making Progress with Larger Features

Larger features with a design document are much more likely to be accepted, and in turn we're much more likely to commit a single
named cert-manager maintainer to the effort to help the PR to be successful. That maintainer might not be able to answer all your
questions, but they should certainly be able to point you in the right direction.

To get in touch to discuss a feature, please reach out on the [cert-manager-dev slack channel](./README.md#slack), or join a [cert-manager public meeting](./README.md#meetings) to talk about your proposal.

If you have an open PR with a design document (or have some questions about how to proceed with a design), you should absolutely feel free to add the PR with your design or a link to the relevant GitHub issue to the [meeting notes](https://docs.google.com/document/d/1Tc5t6ylY9dhXAan1OjOoldeaoys1Yh4Ir710ATfBa5U/edit) for our next biweekly meeting
and join in so we're sure to discuss it and so you can contribute to the discussion!

#### Large Feature Lifecycle

1. Informally ask about the feature in slack or a public meeting
2. Create a PR with a lightweight design document using the [design template](https://github.com/cert-manager/cert-manager/tree/master/design/template.md), for discussion
3. Design doc PR gets reviewed - possibly includes meeting or discussion in a biweekly meeting
4. Implement your feature, helped and reviewed by a named cert-manager maintainer

## Feature Requests We'll Likely Reject

In some cases, people will request features which we've previously rejected or which for some reason we have to reject.

It's nothing personal; sometimes we have to make tough choices and especially when it comes to security and maintainability we have to reject certain
proposals. If your feature request is listed below, there's a high chance we'll have to reject it.

That said, if you think we've made a mistake and that we should reconsider, we're open to chatting - consider joining our [biweekly meetings](./README.md#meetings) to discuss it with us!

### Vendoring Kubernetes related APIs outside of the `k8s.io/` namespace

Vendoring project APIs that also vendor `k8s.io/apimachinery`, such as OpenShift, Contour, or Velero, is not recommend because the Kubernetes dependency is likely to conflict with cert-manager's instance.
It could also cause a conflict with different Kubernetes client versions being used.

If this is needed it is suggested to use a "dynamic client" that converts the objects into internal structures copied into the cert-manager codebase.

### Additional configuration options for the Helm chart

cert-manager's Helm chart is intended to allow to create a standard, best practices cert-manager installation with basic configuration options, such as being able to provide flags to cert-manager components, label resources etc.
We do not aim to include every possible configuration option for resources that the chart creates to avoid maintenance burden and because we do not have automated testing for all chart configuration options. Therefore we are likely to not accept PRs that add advanced or niche configuration options to Helm charts- we recommend that users who require that configuration use another mechanism such as [Helm's post-install hooks](https://helm.sh/docs/topics/charts_hooks/).

### Helm + CRDs

Helm suggests that CRDs be included in a `crds/` subdirectory of a chart, with the `crd-install` annotation included. This has the unfortunate side effect that CRDs are not upgraded if changed in a later release.

CRDs being upgraded without being removed and re-installed is essential for cert-manager to move forward.

This was previously discussed [in the Helm community](https://github.com/helm/helm/issues/5871).

cert-manager works around this limitation by shipping CRDs in the templates.

### Helm Subchart capabilities

cert-manager now has the capability to be [installed as a subchart](../installation/helm.md#installing-cert-manager-as-subchart).

But you need to be careful when adding it to your umbrella chart.

This is because the cert-manager installation creates cluster scoped resources like admission webhooks and custom resource definitions. cert-manager should be seen as part of your cluster and should be treated as such for being installed. An apt comparison
to other Kubernetes components would be a LoadBalancer controller or a PV provisioner.

It is your responsibility to ensure that cert-manager is only installed once in your cluster.
This can be managed via the `condition` parameter of the dependency in your `Chart.yaml`, which allows users to disable the installation of a subchart. The condition parameter must be added when using cert-manager as a subchart to allow users to disable your dependency.

```yaml
apiVersion: v2
name: example_chart
description: A Helm chart with cert-manager as subchart
type: application
version: 0.1.0
appVersion: "0.1.0"
dependencies:
  - name: cert-manager
    version: v1.8.0
    repository: https://charts.jetstack.io
    alias: cert-manager
    condition: cert-manager.enabled
```

### Secret injection or copying

cert-manager deals with very sensitive information (all TLS certificates for your services) and has cluster-level access to secret resources. As such, when designing features we need to consider all of the ways these secrets might be abused to escalate privilege.

Secret data is meant to be securely stored in `Secret` resources and have narrow scoped access privileges for unauthorized users. Because of this, we won't usually add any functionality that allows this data to be copied/injected into any resource
other than a Kubernetes `Secret`.

#### cainjector

The cainjector component is a special exception to this rule as it deals in non-sensitive information (CAs, not cert/key pairs). This component is able to inject the `ca.crt` file into predefined fields on `ValidatingWebhookConfiguration`, `MutatingWebhookConfiguration`, and `CustomResourceDefinition` resources from Certificate resources.

These 3 components are already scoped only for privileged users, and will already give you cluster scoped access to resources.

If you’re designing a resource that needs a CA Certificate or TLS key pair it is strongly recommended to use a reference to a secret instead of embedding it in a resource.

### Cross namespace resources

Namespace boundaries in Kubernetes provide a barrier for access scopes. Apps or users can be limited to only access resources in a certain namespace.

cert-manager is a controller that operates on cluster wide resources however, and while it may seem interesting to allow access to copy or write certificate data from one namespace to the other, this can cause a bypass of the
namespace security model for all users, which is usually not intended and can be a major a security issue.

We don't support this behavior; if you believe you need it, and it's intended for your use case then there are other Kubernetes controllers that can do this, although we'd suggest extreme caution.

### Sign certificates using the Kubernetes CA

Kubernetes has a Certificate Signing Requests API, and a `kubectl certificates` command which allows you to approve certificate signing requests and have them signed by the certificate authority (CA) of the Kubernetes cluster. This
CA is generally used for your nodes.

This API and CLI have occasionally been misused to sign certificates for use by pods outside of the control plane; we believe this is a mistake.

For the security of the Kubernetes cluster it's important to limit access to the Kubernetes certificate authority; such certificates increase the attack surface for the Kubernetes API server since this CA signs certificates for
authorization against the API server. If cert-manager used this cert, it could allow any user with permission to create cert-manager resources to elevate privileges by signing certificates which are trusted for API access.

[See our FAQ](../faq/README.md#kubernetes-has-a-builtin-certificatesigningrequest-api-why-not-use-that) for more details on this.

### Integrations with third party infrastructure providers

We try to not include in core cert-manager new functionality that involves calling third party APIs that we don't have infrastructure to test (or that the maintainers don't have the skills to work with).

Instead we try to build interfaces such as [external DNS webhook solver](../configuration/acme/dns01/webhook.md) that can be implemented to use cert-manager with a particular third party implementation.
We believe that this is a more sustainable approach as that way folks who have knowledge and skills to work with particular infrastructure can own a project that interacts with it and it lets us avoid merging potentially untested code to core cert-manager.
An example of a PR that might be rejected would be adding a new external DNS solver kind, see https://github.com/cert-manager/cert-manager/pull/1088
