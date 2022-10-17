---
title: Release Notes
description: 'cert-manager release notes: cert-manager v0.12'
---

The `v0.12.0` release is finally ready! After a KubeCon-induced delay, this
version focuses on usability, user experience, bug-fixes and documentation.

A big notable feature in this release is the new [`cert-manager.io`](https://cert-manager.io)
website - this has been a long time coming, but we hope that the information
on this site should more clearly walk new and experienced users alike through
the tool, and with it the rewrite into Markdown (with [Hugo](https://gohugo.io))
should make external contributions easier!

The rest of the notable features below are all focused on usability, and as
such, the upgrade process from `v0.11` should be nice and easy :holiday:.

We'll be doing an in-depth walk-through of this release and what's planned for
for the next release during the next community call on Wednesday 4th December!
For more details on joining and getting involved, see the
[community section](https://github.com/cert-manager/cert-manager#community).

## Contributors

This release has seen code contributions from a number of people in the
community:

* `Adrian Mouat`
* `Benjamin P. Jung`
* `Bouke van der Bijl`
* `Christian Groschupp`
* `Christophe Courtaut`
* `Eric Bailey`
* `Harold Drost`
* `Ingo Gottwald`
* `James Munnelly`
* `JayatiGoyal`
* `Joshua Van Leeuwen`
* `Krishna Durai`
* `Luca Berneking`
* `Matevz Mihalic`
* `Max Goltzsche`
* `Nick Parker`
* `Nils Cant`
* `Nolan Reisbeck`
* `Pierre Dorbais`
* `Sam Cogan`
* `Thomas`
* `chenjun.cj`
* `ismail BASKIN`
* `walter.goulet`

As always, a big thank you to those opening issues, replying to issues and
helping out in the Slack channel. As well as working in other projects to help
users secure services running on Kubernetes.

## Notable changes

### New website

We have launched a new website to better showcase cert-manager, which can be
found at [`cert-manager.io`](https://cert-manager.io).

With this new site, we have also significantly restructured and rewritten the
documentation for the site in order to flow better, and hopefully inform users
more on the inner-workings of cert-manager whilst still making on-boarding to
the project easy.

Whilst this is the first launch of the new website, there is still lots to do!
If you have any feedback, ideas or expertise to improve the site, please open
an issue or make a contribution over in the new
[cert-manager/website](https://github.com/cert-manager/website) repository.

### Multi-architecture images

If you run a non-homogeneous or alt-architecture cluster (i.e. `arm` or `arm64`)
then you may have run into issues when deploying cert-manager.

For almost a year now, we have published Docker images built for these
architectures, but due to limitations in `quay.io`, using these images has
required changing deployment manifests and passing additional flags to
different cert-manager components.

As of `v0.12`, we make use of [`Docker Image Manifests v2.2`](https://docs.docker.com/registry/spec/manifest-v2-2/),
which means that you will no longer have to make *any changes* to the
deployment manifests in order to deploy cert-manager into your cluster!

This is a big usability win for users of non-`amd64` systems, and a big +1
for usability!

### Making it easier to debug failing ACME challenges

During the ACME authorization flow, a number of issues can arise such as
misconfigured DNS records or ingress controllers.

This release makes it simpler to identify these issues when they occur,
providing additional debugging information through the user of
`kubectl describe challenge <name-of-failing-challenge>`.

Whilst this is a small addition, it vastly improves the user experience for
first time users who may have configuration issues with their DNS records or
cert-manager installation, another win for usability!

### Simplifying the webhook component

For those of you upgrading from older versions of cert-manager, you may already
be aware of some of the deployment issues with the 'webhook' component in
cert-manager.

In previous releases, this component relied on the creation of an `APIService`
resource in order for the Kubernetes apiserver to utilize the webhook and
provide additional validation for our `CustomResourceDefinition` types.

An `APIService` is a powerful resource, however, due to its nature, can cause
certain core operations (such as garbage collection) to not function if the
webhook becomes unavailable at any point, which can in turn cause cascading
failures in your Kubernetes cluster in the worst of cases.

In `v0.12`, we have rewritten this component almost entirely, and we no longer
make use of the `APIService` resource in order to expose it.

This should mean deploying the webhook is far easier, and far less likely to
cause cluster-wide issues.

We have also extended the webhook to support 'API conversions' for our CRD
types. Whilst we don't currently make use of this functionality, when we
release the `v1beta1` we **will** make use of it, at which point the webhook
will be a required component in clusters running Kubernetes 1.15 or greater.

## Changelog

### Action Required

- ACTION REQUIRED
  Users who have previously set the Kubernetes Auth Mount Path will need to update their manifests to include the entire mount path. The `/login` endpoint is added for you.

  Changes the Vault Kubernetes Auth Path to require the entire mount path. `/login` is added to all mount paths when authenticating.
  The default auth path has now changed from `kubernetes` to `/v1/auth/kubernetes` ([#2349](https://github.com/cert-manager/cert-manager/pull/2349), [`@JoshVanL`](https://github.com/JoshVanL))


### Bug Fixes

- Fixes issues with Pod Security Policies that prevented pods from running when Pod Security Policy is enabled in Kubernetes ([#2234](https://github.com/cert-manager/cert-manager/pull/2234),
[`@sam-cogan`](https://github.com/sam-cogan))
- Fix issue causing certificates not to be issued when running with `OwnerReferencesPermissionEnforcement` admission controller enabled ([#2325](https://github.com/cert-manager/cert-manager/pull/2325),
[`@CoaxVex`](https://github.com/CoaxVex))
- Fix bug causing SIGTERM and SIGINT signals to not be respected whilst the controller is performing leader election ([#2236](https://github.com/cert-manager/cert-manager/pull/2236),
[`@munnerz`](https://github.com/munnerz))
- Fix setting `ownerReference` on Challenge resources created by Orders controller ([#2324](https://github.com/cert-manager/cert-manager/pull/2324), [`@CoaxVex`](https://github.com/CoaxVex))
- Allow `CloudDNS` resolvers to be validated correctly without `serviceAccountSecretRef` to allow ambient permissions to be used. ([#2250](https://github.com/cert-manager/cert-manager/pull/2250),
[`@baelish`](https://github.com/baelish))
- Add missing `apiVersion` to `Chart.yaml` ([#2270](https://github.com/cert-manager/cert-manager/pull/2270), [`@yurrriq`](https://github.com/yurrriq))
- Perform API resource validation of the 'status' subresource on cert-manager resources ([#2283](https://github.com/cert-manager/cert-manager/pull/2283), [`@munnerz`](https://github.com/munnerz))
- Fix outdated documentation for solver configuration in `Issuers` and `ClusterIssuers` ([#2210](https://github.com/cert-manager/cert-manager/pull/2210), [`@nickbp`](https://github.com/nickbp))


### Other Notable Changes

- Explicitly define `containerPort` protocol in helm chart ([#2405](https://github.com/cert-manager/cert-manager/pull/2405), [`@bouk`](https://github.com/bouk))
- Allow permissive acceptance for matching Certificates with Secrets that are using legacy annotations to reduce non-required certificate reissue.
([#2400](https://github.com/cert-manager/cert-manager/pull/2400), [`@JoshVanL`](https://github.com/JoshVanL))
- Add API token authentication option to CloudFlare issuer ([#2170](https://github.com/cert-manager/cert-manager/pull/2170), [`@matevzmihalic`](https://github.com/matevzmihalic))
- Bump Kubernetes client library dependencies to 1.16.3 ([#2290](https://github.com/cert-manager/cert-manager/pull/2290), [`@munnerz`](https://github.com/munnerz))
- Build using go 1.13.4 ([#2366](https://github.com/cert-manager/cert-manager/pull/2366), [`@munnerz`](https://github.com/munnerz))
- Mark `certificaterequest.spec.csr` field as required in OpenAPI schema ([#2368](https://github.com/cert-manager/cert-manager/pull/2368), [`@munnerz`](https://github.com/munnerz))
- Add `serverAuth` extended key usage to Certificates by default ([#2351](https://github.com/cert-manager/cert-manager/pull/2351), [`@JoshVanL`](https://github.com/JoshVanL))
- Surface more information about ACME authorization failures on Challenge resources ([#2261](https://github.com/cert-manager/cert-manager/pull/2261), [`@munnerz`](https://github.com/munnerz))
- Add documentation for the webhook ([#2252](https://github.com/cert-manager/cert-manager/pull/2252), [`@cgroschupp`](https://github.com/cgroschupp))
- Add support for API resource conversion to the webhook. NOTE: this feature is **not** currently utilized by cert-manager ([#2001](https://github.com/cert-manager/cert-manager/pull/2001),
[`@munnerz`](https://github.com/munnerz))
- Remove nested `cainjector` sub chart and include it in main chart ([#2285](https://github.com/cert-manager/cert-manager/pull/2285), [`@munnerz`](https://github.com/munnerz))
- Change the default webhook listen address to 10250 for better compatibility with GKE private clusters ([#2278](https://github.com/cert-manager/cert-manager/pull/2278),
[`@munnerz`](https://github.com/munnerz))
- Bump Helm & Tiller version used during end-to-end tests to 2.15.1 ([#2275](https://github.com/cert-manager/cert-manager/pull/2275), [`@munnerz`](https://github.com/munnerz))
- Make `spec.csr`, `status.url`, `status.finalizeURL`, `status.certificate`, `status.authorizations`, `status.authorizations[].url`, `status.authorizations[].identifier`,
`status.authorizations[].wildcard`, `status.authorizations[].challenges`, `status.authorizations[].challenges[].url`, `status.authorizations[].challenges[].type`,
`status.authorizations[].challenges[].token` fields on Order resources immutable ([#2219](https://github.com/cert-manager/cert-manager/pull/2219), [`@munnerz`](https://github.com/munnerz))
- No longer use architecture specific `acmesolver` images ([#2242](https://github.com/cert-manager/cert-manager/pull/2242), [`@munnerz`](https://github.com/munnerz))
- enable cert-manager using `--kubeconfig` to connect API Server with `kubeconfig` file ([#2224](https://github.com/cert-manager/cert-manager/pull/2224), [`@answer1991`](https://github.com/answer1991))
- Publish multi-architecture docker manifest lists ([#2230](https://github.com/cert-manager/cert-manager/pull/2230), [`@munnerz`](https://github.com/munnerz))
- Make `order.status.authorizations[].wildcard` field a `*bool` ([#2225](https://github.com/cert-manager/cert-manager/pull/2225), [`@munnerz`](https://github.com/munnerz))
- [Kubernetes APIServer dry-run](https://kubernetes.io/docs/reference/using-api/api-concepts/&#35;dry-run) is supported. ([#2206](https://github.com/cert-manager/cert-manager/pull/2206),
[`@ismailbaskin`](https://github.com/ismailbaskin))