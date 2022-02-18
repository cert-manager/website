---
title: "Certificate"
linkTitle: "Certificate"
weight: 200
type: "docs"
---

cert-manager has the concept of `Certificates` that define a desired X.509
certificate which will be renewed and kept up to date. A `Certificate` is a
namespaced resource that references an `Issuer` or `ClusterIssuer` that
determine what will be honoring the certificate request.

When a `Certificate` is created, a corresponding `CertificateRequest` resource
is created by cert-manager containing the encoded X.509 certificate request,
`Issuer` reference, and other options based upon the specification of the
`Certificate` resource.

Here is one such example of a `Certificate` resource.

```yaml
apiVersion: cert-manager.io/v1
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
and `bar.example.com` domains. If successful, resulting TLS key and certificate 
will be stored in a secret named `acme-crt-secret`, with keys of `tls.key`, and
`tls.crt` respectively. This secret will live in the same namespace as the
`Certificate` resource.

Additionally, if the Certificate Authority is known, the corresponding CA 
certificate will be stored in the secret with key `ca.crt`. For example, with 
the ACME issuer, the CA is not known and `ca.crt` will not exist in 
`acme-crt-secret`.

When a certificate is issued by intermediates of the CA and the `Issuer` knows the
intermediates, the content of `tls.crt` will be a resulting certificate followed by
a certificate chain. The certificate chain doesn't include a root CA certificate, as
it is stored in `ca.crt`.

This format is used as it allows TLS implementations to validate the leaf certificate
as long as the root CA is already trusted. During the TLS handshake, peers construct
a full trust chain by checking the issuer of each certificate until they end up at a 
root in their trust store. If the intermediates aren't sent along with the leaf,
there's no way to know that the issuing CA was signed by the root, and the
certificate won't be trusted.

The `dnsNames` field specifies a list of [`Subject Alternative
Names`](https://en.wikipedia.org/wiki/Subject_Alternative_Name) to be associated
with the certificate.

The referenced `Issuer` must exist in the same namespace as the `Certificate`.
A `Certificate` can alternatively reference a `ClusterIssuer` which is
non-namespaced and so can be referenced from any namespace.

You can read more on how to configure your `Certificate` resources
[here](../../usage/certificate/).
