---
title: Issuer Configuration
description: cert-manager configuration
---

The first thing you'll need to configure after you've installed cert-manager is an issuer
which you can then use to issue certificates.

This section documents how the different issuer types can be configured. You might want to
read more about `Issuer` and `ClusterIssuer` resources [here](../concepts/issuer.md).

cert-manager comes with a number of built-in certificate issuers which are denoted by being in
the `cert-manager.io` group. You can also install external issuers in addition to the built-in types.
Both built-in and external issuers are treated the same and are configured similarly.

When using `ClusterIssuer` resource types, ensure you understand the purpose of the
[`Cluster Resource Namespace`](../faq/cluster-resource.md); this can be a common source
of issues for people getting started with cert-manager.

