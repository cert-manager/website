---
title: "Certificate Resources"
linkTitle: "Certificate Resources"
weight: 10
type: "docs"
---

In cert-manager, the [`Certificate`](../../concepts/certificate/) resource
represents a human readable definition of a certificate request that is to be
honored by an issuer which is to be kept up-to-date. This is the usual way that
you will interact with cert-manager to request signed certificates.

In order to issue any certificates, you'll need to configure an
[`Issuer`](../../configuration/) resource first.


## Creating Certificate Resources

A Certificate resource specifies fields that are used to generated certificate
signing requests which are then fulfilled by the issuer type you have
referenced. Certificates specify which issuer they want to obtain the
certificate from by specifying the `certificate.spec.issuerRef` field.

A basic Certificate resource, for the `example.com` and `www.example.com` DNS
names, `spiffe://cluster.local/ns/sandbox/sa/example` URI Subject Alternative
Name, that is valid for 90 days and renews 15 days before expiry is below:


```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: example-com
  namespace: default
spec:
  secretName: example-com-tls
  duration: 2160h # 90d
  renewBefore: 360h # 15d
  dnsNames:
  - example.com
  - www.example.com
  uriSANs:
  - spiffe://cluster.local/ns/sandbox/sa/example
  issuerRef:
    name: ca-issuer
    # We can reference ClusterIssuers by changing the kind here.
    # The default value is Issuer (i.e. a locally namespaced Issuer)
    kind: Issuer
    # This is optional since cert-manager will default to this value however if you
    # are using an external issuer, change this to that issuer group.
    group: cert-manager.io
```

The signed certificate will be stored in a `Secret` resource named
`example-com-tls` in the same namespace as the `Certificate` once the issuer has
successfully issued the requested certificate.

The Certificate will be issued using the issuer named `ca-issuer` in the
`default` namespace (the same namespace as the Certificate resource).

> Note: If you want to create an Issuer that can be referenced by Certificate
> resources in *all* namespaces, you should create a
> [`ClusterIssuer`](../../configuration/) resource and set the
> `certificate.spec.issuerRef.kind` field to `ClusterIssuer`.



> Note: The `renewBefore` and `duration` fields must be specified using [Go
> `time.Duration`](https://golang.org/pkg/time/#ParseDuration) string format,
> which does not allow the `d` (days) suffix. You must specify these values
> using `s`, `m`, and `h` suffixes instead. Failing to do so without installing
> the [`webhook component`](../../concepts/webhook/) can prevent cert-manager
> from functioning correctly
> [`#1269`](https://github.com/jetstack/cert-manager/issues/1269).


> Note: Take care when setting the `renewBefore` field to be very close to the
> `duration` as this can lead to a renewal loop, where the Certificate is always
> in the renewal period. Some `Issuers` set the `notBefore` field on their
> issued x509 certificates before the issue time to fix clock-skew issues,
> leading to the working duration of a certificate to be less than the full
> duration of the certificate. For example, Let's Encrypt sets it to be one hour
> before issue time, so the actual *working duration* of the certificate is 89
> days, 23 hours (the *full duration* remains 90 days).

A full list of the fields supported on the Certificate resource can be found in
the [API reference documentation](https://docs.cert-manager.io/en/release-0.11/reference/api-docs/#certificatespec-v1alpha2).

## Temporary Certificates whilst Issuing

When [requesting certificates using ingress-shim](../ingress/), the component
`ingres-gce`, if used, requires that a temporary certificate is present while
waiting for issuance of a signed certificate when serving. To facilitate this,
if the annotation `"cert-manager.io/issue-temporary-certificate": "true"` is
present on the certificate, a self signed temporary certificate will be present
on the `Secret` until it is overwritten once the signed certificate has been
issued.
