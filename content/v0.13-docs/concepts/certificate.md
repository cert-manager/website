---
title: Certificate
description: 'cert-manager core concepts: Certificates'
---

cert-manager has the concept of `Certificates` that define a desired x509
certificate which will be renewed and kept up to date. A `Certificate` is a
namespaced resource that references an `Issuer` or `ClusterIssuer` that
determine what will be honoring the certificate request.

When a `Certificate` is created, a corresponding `CertificateRequest` resource
is created by cert-manager containing the encoded x509 certificate request,
`Issuer` reference, and other options based upon the specification of the
`Certificate` resource.

Here is one such example of a `Certificate` resource.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: acme-crt
spec:
  secretName: acme-crt-secret
  dnsNames:
  - foo.example.com
  - bar.example.com
  issuerRef:
    name: letsencrypt-prod
    # We can reference ClusterIssuers by changing the kind here.
    # The default value is Issuer (i.e. a locally namespaced Issuer)
    kind: Issuer
    group: cert-manager.io
```

This `Certificate` will tell cert-manager to attempt to use the `Issuer` named
`letsencrypt-prod` to obtain a certificate key pair for the `foo.example.com`
and `bar.example.com` domains. If successful, the resulting key and certificate
will be stored in a secret named `acme-crt-secret` with keys of `tls.key` and
`tls.crt` respectively. This secret will live in the same namespace as the
`Certificate` resource.

The `dnsNames` field specifies a list of [`Subject Alternative
Names`](https://en.wikipedia.org/wiki/Subject_Alternative_Name) to be associated
with the certificate.

The referenced `Issuer` must exist in the same namespace as the `Certificate`.
A `Certificate` can alternatively reference a `ClusterIssuer` which is
non-namespaced and so can be referenced from any namespace.

You can read more on how to configure your `Certificate` resources
[here](../usage/certificate.md).