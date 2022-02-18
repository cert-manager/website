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

A `Certificate` resource specifies fields that are used to generated certificate
signing requests which are then fulfilled by the issuer type you have
referenced. `Certificates` specify which issuer they want to obtain the
certificate from by specifying the `certificate.spec.issuerRef` field.

A `Certificate` resource, for the `example.com` and `www.example.com` DNS names,
`spiffe://cluster.local/ns/sandbox/sa/example` URI Subject Alternative Name,
that is valid for 90 days and renews 15 days before expiry is below. It contains
an exhaustive list of all options a `Certificate` resource may have however only
a subset of fields are required as labelled.

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com
  namespace: sandbox
spec:
  # Secret names are always required.
  secretName: example-com-tls
  duration: 2160h # 90d
  renewBefore: 360h # 15d
  subject:
    organizations:
    - jetstack
  # The use of the common name field has been deprecated since 2000 and is
  # discouraged from being used.
  commonName: example.com
  isCA: false
  privateKey:
    algorithm: RSA
    encoding: PKCS1
    size: 2048
  usages:
    - server auth
    - client auth
  # At least one of a DNS Name, URI, or IP address is required.
  dnsNames:
  - example.com
  - www.example.com
  uris:
  - spiffe://cluster.local/ns/sandbox/sa/example
  ipAddresses:
  - 192.168.0.5
  # Issuer references are always required.
  issuerRef:
    name: ca-issuer
    # We can reference ClusterIssuers by changing the kind here.
    # The default value is Issuer (i.e. a locally namespaced Issuer)
    kind: Issuer
    # This is optional since cert-manager will default to this value however
    # if you are using an external issuer, change this to that issuer group.
    group: cert-manager.io
```

The signed certificate will be stored in a `Secret` resource named
`example-com-tls` in the same namespace as the `Certificate` once the issuer has
successfully issued the requested certificate.

The `Certificate` will be issued using the issuer named `ca-issuer` in the
`sandbox` namespace (the same namespace as the `Certificate` resource).

> Note: If you want to create an `Issuer` that can be referenced by
> `Certificate` resources in *all* namespaces, you should create a
> [`ClusterIssuer`](../../concepts/issuer/#namespaces) resource and set the
> `certificate.spec.issuerRef.kind` field to `ClusterIssuer`.

> Note: The `renewBefore` and `duration` fields must be specified using a [Go
> `time.Duration`](https://golang.org/pkg/time/#ParseDuration) string format,
> which does not allow the `d` (days) suffix. You must specify these values
> using `s`, `m`, and `h` suffixes instead. Failing to do so without installing
> the [`webhook component`](../../concepts/webhook/) can prevent cert-manager
> from functioning correctly
> [`#1269`](https://github.com/jetstack/cert-manager/issues/1269).

> Note: Take care when setting the `renewBefore` field to be very close to the
> `duration` as this can lead to a renewal loop, where the `Certificate` is always
> in the renewal period. Some `Issuers` set the `notBefore` field on their
> issued X.509 certificates before the issue time to fix clock-skew issues,
> leading to the working duration of a certificate to be less than the full
> duration of the certificate. For example, Let's Encrypt sets it to be one hour
> before issue time, so the actual *working duration* of the certificate is 89
> days, 23 hours (the *full duration* remains 90 days).

A full list of the fields supported on the Certificate resource can be found in
the [API reference documentation](../../reference/api-docs/#cert-manager.io/v1alpha2.CertificateSpec)

## Key Usages

cert-manager supports requesting certificates that have a number of custom key
usages and extended key usages. Although cert-manager will attempt to honor this
request, some issuers will remove, add defaults, or otherwise completely ignore
the request and is determined on an issuer by issuer basis. The `CA` and
`SelfSigned` `Issuer` will always return certificates matching the usages you have
requested.

Unless any number of usages has been set, cert-manager will set the default
requested usages of "digital signature", "key encipherment", and "server auth".
cert-manager will not attempt to request a new certificate if the current
certificate does not match the current key usages set.

An exhaustive list of supported key usages can be found in the [API reference
documentation](../../reference/api-docs/#cert-manager.io/v1alpha2.KeyUsage).

## Temporary Certificates whilst Issuing

When [requesting certificates using ingress-shim](../ingress/), the component
`ingress-gce`, if used, requires that a temporary certificate is present while
waiting for issuance of a signed certificate when serving. To facilitate this,
if the annotation `"cert-manager.io/issue-temporary-certificate": "true"` is
present on the certificate, a self signed temporary certificate will be present
on the `Secret` until it is overwritten once the signed certificate has been
issued.

## Configuring private key rotation

> **WARNING**: This feature requires enabling the `ExperimentalCertificateControllers`
> feature gate by passing the `--feature-gates=ExperimentalCertificateControllers=true`
> flag to the controller component, or adding `--set featureGates=ExperimentalCertificateControllers=true`
> when deploying using the Helm chart.

When a certificate is re-issued for any reason, including because it is nearing
expiry, when a change to the spec is made or a re-issuance is manually
triggered, cert-manager supports configuring the 'private key rotation policy'
to either always re-use the existing private key (the default behavior) or to
regenerate a new private key on each issuance (the recommended behavior).

This is configured using the `spec.privateKey.rotationPolicy` like so:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-cert
  ...
spec:
  secretName: my-cert-tls
  dnsNames:
  - example.com
  privateKey:
    rotationPolicy: Always
```

There are two supported rotation policies:

* **Never** (default): a private key is only generated if one does not already exist in
  the target Secret resource (using the `tls.key` key). All further issuance's will re-use
  this private key. This is the default in order to maintain compatibility with previous releases.
* **Always**: a new private key will be generated each time a new certificate is issued.
  It is recommended you configure this `rotationPolicy` on your Certificate resources as it
  is good practice to rotate private keys when a certificate is renewed.

Some Issuer types may disallow re-using private keys. If this is the case, you must explicitly
configure the `rotationPolicy` for each of your Certificates accordingly.

## Cleaning up Secrets when Certificates are deleted

By default, cert-manager does not delete the `Secret` resource containing the signed certificate when the corresponding `Certificate` resource is deleted.
This means that deleting a `Certificate` won't take down any services that are currently relying on that certificate, but the certificate will no longer be renewed.
The `Secret` needs to be manually deleted if it is no longer needed.

If you would prefer the `Secret` to be deleted automatically when the `Certificate` is deleted, you need to configure your installation to pass the `--enable-certificate-owner-ref` flag to the controller.
