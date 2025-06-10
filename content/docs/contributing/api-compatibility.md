---
title: API compatibility
description: cert-manager API compatibility guarantees
---

cert-manager aims to abide by the same API compatibility policy as upstream Kubernetes APIs as documented in the [Kubernetes Deprecation Policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api).

This is to ensure a smooth upgrade and downgrade experience for users, i.e to make sure that users' cert-manager custom resources keep functioning in the same way
after an upgrade or downgrade of cert-manager.

In some cases, we may need to require users to take actions before upgrading or may need to diverge from the API compatibility promise but we'll treat this as an absolute
last resort. In general the main criteria by which we'd determine whether a change is acceptable would be user value.

Here are the breaking changes we have made to the `v1` API:
* [cert-manger 1.18](../releases/release-notes/release-notes-1.18.md): The default value of `Certificate.Spec.PrivateKey.RotationPolicy` changed from `Never` to `Always`.

## Alpha / Beta API Versions

As in upstream Kubernetes, We don't commit to preserving alpha or beta API versions indefinitely.

In cert-manager v1.7 [all alpha and beta API versions prior to `v1` were removed](https://github.com/cert-manager/cert-manager/pull/4635).

NB: The Kubernetes deprecation policy notes that API removal introduces an issue with objects stored at the removed versions. To fix this, we wrote a [custom tool](https://cert-manager.io/docs/releases/upgrading/remove-deprecated-apis/) that users could run once to migrate their resources.
