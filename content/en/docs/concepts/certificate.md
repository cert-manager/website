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
and `bar.example.com` domains. If successful, the resulting TLS key and certificate
will be stored in a secret named `acme-crt-secret`, with keys of `tls.key`, and
`tls.crt` respectively. This secret will live in the same namespace as the
`Certificate` resource.

When a certificate is issued by an intermediate CA and the `Issuer` can provide
the issued certificate's chain, the contents of `tls.crt` will be the requested
certificate followed by the certificate chain.

Additionally, if the Certificate Authority is known, the corresponding CA
certificate will be stored in the secret with key `ca.crt`. For example, with
the ACME issuer, the CA is not known and `ca.crt` will not exist in
`acme-crt-secret`.

cert-manager intentionally avoids adding root certificates to `tls.crt`, because they
are useless in a situation where TLS is being done securely. For more information,
see [RFC 5246 section 7.4.2](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.2)
which contains the following explanation:

> Because certificate validation requires that root keys be distributed
> independently, the self-signed certificate that specifies the root
> certificate authority MAY be omitted from the chain, under the
> assumption that the remote end must already possess it in order to
> validate it in any case.

The `dnsNames` field specifies a list of [`Subject Alternative
Names`](https://en.wikipedia.org/wiki/Subject_Alternative_Name) to be associated
with the certificate.

The referenced `Issuer` must exist in the same namespace as the `Certificate`.
A `Certificate` can alternatively reference a `ClusterIssuer` which is
non-namespaced and so can be referenced from any namespace.

You can read more on how to configure your `Certificate` resources
[here](../../usage/certificate/).

## Certificate Lifecycle

This diagram shows the lifecycle of a Certificate named `cert-1` using an
ACME / Let's Encrypt issuer. You don't need to understand all of these steps
to use cert-manager; this is more of an explanation of the logic which happens
under the hood for those curious about the process.

![Life of a Certificate](/images/letsencrypt-flow-cert-manager.png)
