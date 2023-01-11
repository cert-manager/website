---
title: Certificate
description: 'cert-manager core concepts: Certificates'
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
  - example.com
  - foo.example.com
  issuerRef:
    name: letsencrypt-prod
    # We can reference ClusterIssuers by changing the kind here.
    # The default value is Issuer (i.e. a locally namespaced Issuer)
    kind: Issuer
    group: cert-manager.io
```

This `Certificate` will tell cert-manager to attempt to use the `Issuer` named
`letsencrypt-prod` to obtain a certificate key pair for the `example.com` and
`foo.example.com` domains. If successful, the resulting TLS key and certificate
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

<div className="alert">

When configuring a client to connect to a TLS server with a serving certificate that is signed by a private CA,
you will need to provide the client with the CA certificate in order for it to verify the server.
`ca.crt` will likely contain the certificate you need to trust,
but __do not mount the same `Secret` as the server__ to access `ca.crt`.
This is because:

1. That `Secret` also contains the private key of the server, which should only be accessible to the server.
   You should use RBAC to ensure that the `Secret` containing the serving certificate and private key are only accessible to Pods that need it.
2. Rotating CA certificates safely relies on being able to have both the old and new CA certificates trusted at the same time.
   By consuming the CA directly from the source, this isn't possible;
   you'll be _forced_ to have some down-time in order to rotate certificates.

When configuring the client you should independently choose and fetch the CA certificates that you want to trust.
Download the CA out of band and store it in a `Secret` or `ConfigMap` separate from the `Secret` containing the server's private key and certificate.

This ensures that if the material in the `Secret` containing the server key and certificate is tampered with,
the client will fail to connect to the compromised server.

The same concept also applies when configuring a server for mutually-authenticated TLS;
don't give the server access to Secret containing the client certificate and private key.

</div>

The `dnsNames` field specifies a list of [`Subject Alternative
Names`](https://en.wikipedia.org/wiki/Subject_Alternative_Name) to be associated
with the certificate.

The referenced `Issuer` must exist in the same namespace as the `Certificate`.
A `Certificate` can alternatively reference a `ClusterIssuer` which is
non-namespaced and so can be referenced from any namespace.

You can read more on how to configure your `Certificate` resources
[here](../usage/certificate.md).

## Certificate Lifecycle

This diagram shows the lifecycle of a Certificate named `cert-1` using an
ACME / Let's Encrypt issuer. You don't need to understand all of these steps
to use cert-manager; this is more of an explanation of the logic which happens
under the hood for those curious about the process.

![Life of a Certificate](/images/letsencrypt-flow-cert-manager.png)