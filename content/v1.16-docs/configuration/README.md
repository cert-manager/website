---
title: Issuer Configuration
description: Learn about configuring cert-manager using Issuer and ClusterIssuer resources.
---

The first thing you'll need to configure after you've installed cert-manager is an `Issuer` or a `ClusterIssuer`.
These are resources that represent certificate authorities (CAs)
able to sign certificates in response to certificate signing requests.

This section documents how the different issuer types can be configured. You might want to
[read more about `Issuer` and `ClusterIssuer` resources](../concepts/issuer.md).

cert-manager comes with a number of built-in certificate issuers which are denoted by being in
the `cert-manager.io` group. You can also install external issuers in addition to the built-in types.
Built-in and external issuers are treated the same and are configured similarly.

## Cluster Resource Namespace

When using `ClusterIssuer` resource types, ensure you understand the purpose of the
Cluster Resource Namespace; this can be a common source
of issues for people getting started with cert-manager.

The `ClusterIssuer` resource is cluster scoped. This means that when referencing
a secret via the `secretName` field, secrets will be looked for in the `Cluster
Resource Namespace`. By default, this namespace is `cert-manager` however it can be
changed via a flag on the cert-manager-controller component:

```bash
--cluster-resource-namespace=my-namespace
```
