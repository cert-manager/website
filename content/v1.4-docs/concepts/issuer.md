---
title: Issuer
description: 'cert-manager core concepts: Issuers and ClusterIssuers'
---

`Issuers`, and `ClusterIssuers`, are Kubernetes resources that represent
certificate authorities (CAs) that are able to generate signed certificates by honoring
certificate signing requests. All cert-manager certificates require a referenced
issuer that is in a ready condition to attempt to honor the request.

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

## Namespaces

An `Issuer` is a namespaced resource, and it is not possible to issue
certificates from an `Issuer` in a different namespace. This means you will need
to create an `Issuer` in each namespace you wish to obtain `Certificates` in.

If you want to create a single `Issuer` that can be consumed in multiple
namespaces, you should consider creating a `ClusterIssuer` resource. This is
almost identical to the `Issuer` resource, however is non-namespaced so it
can be used to issue `Certificates` across all namespaces.

## Supported Issuers

cert-manager supports a number of 'in-tree', as well as 'out-of-tree' `Issuer`
types. An exhaustive list of these `Issuer` types can be found in the
cert-manager [configuration documentation](../configuration.md).