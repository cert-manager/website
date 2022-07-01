---
title: SelfSigned
description: 'cert-manager configuration: SelfSigned Issuers'
---

⚠️ `SelfSigned` issuers are generally useful for bootstrapping a PKI locally, which
is a complex topic for advanced users. To be used safely in production, running a PKI
introduces complex planning requirements around rotation, trust store distribution and disaster recovery.

If you're not planning to run your own PKI, use a different issuer type.

The `SelfSigned` issuer doesn't represent a certificate authority as such, but
instead denotes that certificates will "sign themselves" using a given private
key. In other words, the private key of the certificate will be used to sign
the certificate itself.

This `Issuer` type is useful for bootstrapping a root certificate for a
custom PKI (Public Key Infrastructure), or for otherwise creating simple
ad-hoc certificates for a quick test.

There are important [caveats](#caveats) - including security issues - to
consider with `SelfSigned` issuers; in general you'd likely  want to use a
[`CA`](./ca.md) issuer rather than a `SelfSigned` issuer. That said,
`SelfSigned` issuers are really useful for initially [bootstrapping](#bootstrapping-ca-issuers)
a `CA` issuer.

> Note: a `CertificateRequest` that references a self-signed certificate _must_
> also contain the `cert-manager.io/private-key-secret-name` annotation since
> the private key corresponding to the `CertificateRequest` is required to
> sign the certificate. This annotation is added automatically by the
> `Certificate` controller.

## Deployment

Since the `SelfSigned` issuer has no dependency on any other resource, it is
the simplest to configure. Only the `SelfSigned` stanza is required to be
present in the issuer spec, with no other configuration required:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned-issuer
  namespace: sandbox
spec:
  selfSigned: {}
```

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-cluster-issuer
spec:
  selfSigned: {}
```

Once deployed, you should be able to see immediately that the issuer is ready
for signing:

```bash
$ kubectl get issuers  -n sandbox -o wide selfsigned-issuer
NAME                READY   STATUS                AGE
selfsigned-issuer   True                          2m

$ kubectl get clusterissuers -o wide selfsigned-cluster-issuer
NAME                        READY   STATUS   AGE
selfsigned-cluster-issuer   True             3m
```

### Bootstrapping `CA` Issuers

One of the ideal use cases for `SelfSigned` issuers is to bootstrap a custom
root certificate for a private PKI, including with the cert-manager [`CA`](./ca.md)
issuer.

The YAML below will create a `SelfSigned` issuer, issue a root certificate and
use that root as a `CA` issuer:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sandbox
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-issuer
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-selfsigned-ca
  namespace: sandbox
spec:
  isCA: true
  commonName: my-selfsigned-ca
  secretName: root-secret
  privateKey:
    algorithm: ECDSA
    size: 256
  issuerRef:
    name: selfsigned-issuer
    kind: ClusterIssuer
    group: cert-manager.io
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: my-ca-issuer
  namespace: sandbox
spec:
  ca:
    secretName: root-secret
```

### CRL Distribution Points

You may also optionally specify [CRL](https://en.wikipedia.org/wiki/Certificate_revocation_list)
Distribution Points as an array of strings, each of which identifies the location of a CRL in
which the revocation status of issued certificates can be checked:

```yaml
...
spec:
  selfSigned:
    crlDistributionPoints:
    - "http://example.com"
```

## Caveats

### Trust

Clients consuming `SelfSigned` certificates have _no way_ to trust them
without already having the certificates beforehand. This becomes hard to
manage when the client of the server using the certificate exists in a
different namespace. This limitation can be tackled by using [trust](../projects/trust.md)
to distribute the `ca.crt` to other namespaces. The alternative is to use
"TOFU" (trust on first use), which has security implications in the event
of a man-in-the-middle attack.

### Certificate Validity

One side-effect of a certificate being self-signed is that its Subject DN and
its Issuer DN are identical. The X.509 [RFC 5280, section 4.1.2.4](https://tools.ietf.org/html/rfc5280#section-4.1.2.4)
requires that:

> The issuer field MUST contain a non-empty distinguished name (DN).

However, self-signed certs don't have a subject DN set by default. Unless you
manually set a certificate's Subject DN, the Issuer DN will be empty
and the certificate will technically be invalid.

Validation of this specific area of the spec is patchy and varies between TLS
libraries, but there's always the risk that a library will improve its
validation - entirely within spec - in the future and break your app if you're
using a certificate with an empty Issuer DN.

To avoid this, be sure to set a Subject for `SelfSigned` certs. This can be
done by setting the `spec.subject` on a cert-manager `Certificate` object
which will be issued by a `SelfSigned` issuer.

Starting in version 1.3, cert-manager will emit a Kubernetes [warning event](https://github.com/cert-manager/cert-manager/blob/45befd86966c563663d18848943a1066d9681bf8/pkg/controller/certificaterequests/selfsigned/selfsigned.go#L140)
of type `BadConfig` if it detects that a certificate is being created
by a `SelfSigned` issuer which has an empty Issuer DN.
