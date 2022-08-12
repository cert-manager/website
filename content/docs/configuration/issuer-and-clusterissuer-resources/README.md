---
title: Issuer and ClusterIssuer resources
description: Configure cert-manager to sign SSL / TLS certificates using the Issuer and ClusterIssuer resources.
---

`Issuers`, and `ClusterIssuers`, are Kubernetes resources that represent
certificate authorities (CAs) that are able to generate signed certificates by honoring
certificate signing requests. All cert-manager certificates require a referenced
issuer that is in a ready condition to attempt to honor the request.

> ℹ️ The `ClusterIssuer` resource is cluster scoped. This means that when referencing
> a secret via the `secretName` field, secrets will be looked for in the `Cluster
> Resource Namespace`. By default, this namespace is `cert-manager` however can be
> changed via a flag on the cert-manager-controller component:
>
> ```bash
> --cluster-resource-namespace=my-namespace
> ```

An example of an `Issuer` type is `CA`. A simple `CA` `Issuer` is as follows:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: ca-issuer
  namespace: mesh-system
spec:
  ca:
    secretName: ca-key-pair
```

This is a simple `Issuer` that will sign certificates based on a private key.
The certificate stored in the secret `ca-key-pair` can then be used to trust
newly signed certificates by this `Issuer` in a Public Key Infrastructure (PKI)
system.

## What is the difference between an Issuer and ClusterIssuer?

An `Issuer` is a namespaced resource, and it is not possible to issue
certificates from an `Issuer` in a different namespace. This means you will need
to create an `Issuer` in each namespace you wish to obtain `Certificates` in.

If you want to create a single `Issuer` that can be consumed in multiple
namespaces, you should consider creating a `ClusterIssuer` resource. This is
almost identical to the `Issuer` resource, however is non-namespaced so it
can be used to issue `Certificates` across all namespaces.

## Supported Issuer types

cert-manager comes with a number of built-in certificate issuers which are denoted by being in
the `cert-manager.io` group. You can also install external issuers in addition to the built-in types.
Both built-in and external issuers are treated the same and are configured similarly.

- [ACME]
- [SelfSigned]
- [CA]
- [Venafi]
- [Vault]
- [External]
