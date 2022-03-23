---
title: API compatibility
description: cert-manager API compatibility guarantees
---

cert-manager aims to abide by the same API compatibility policy as upstream Kubernetes APIs, see [Kubernetes Deprecation Policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api).
The main purpose of this is to ensure a smooth upgrade and downgrade experience for users, i.e to make sure that users' cert-manager custom resources keep functioning as before after an upgrade or downgrade of cert-manager.

In some cases, we may need to require users to take actions before upgrading or may need to diverge from the API compatibility promise:

- In cert-manager v1.7 [all alpha and beta API versions were removed](https://github.com/cert-manager/cert-manager/pull/4635). The Kubernetes Deprecation policy notes that API removal introduces an issue with objects stored at the removed versions. To fix this, we wrote a [custom tool](https://cert-manager.io/docs/installation/upgrading/remove-deprecated-apis/) that users could run once to migrate their resources.

- In general, the main criteria of determining whether a change is acceptable should be user value. For example, in case of a critical bug, a fix that breaks the API compatibility promise by changing the default behavior of an API field _might_ be acceptable. (As of yet, there has not been a need for such a fix).