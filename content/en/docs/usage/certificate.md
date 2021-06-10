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

A `Certificate` resource specifies fields that are used to generate certificate
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

## Renewal

cert-manager automatically renews issued Certificates. It calculates when to
renew a Certificate based on its [`renewBefore`][certspec], which is a hint
indicating how long before we wish to have the Certificate renewed, as well as
on the [`notAfter`][notafter] field present on the issued X.509 certificate.

The `duration` field is used as a hint given to the issuer to set the expiry
time `notAfter`. The possible values for `duration` and `renewBefore` are:

|     Field     |      Default      |     Minimum      |        Requirement         |
|---------------|-------------------|------------------|----------------------------|
| `duration`    | 90 days (`2160h`) | 1 hour (`1h`)    |                            |
| `renewBefore` | 30 days (`720h`)  | 5 minutes (`5m`) | `duration` > `renewBefore` |

The remaining of this section details how cert-manager uses the `renewBefore`
hint to decide when to attempt renewing the Certificate.

[certspec]: /docs/reference/api-docs/#cert-manager.io/v1.CertificateSpec
[notafter]: https://www.rfc-editor.org/rfc/rfc5280.html#section-4.1.2.5

Let's imagine that we create a Certificate on the 1st of January. We want the
Certificate to expire after three months, and we want cert-manager to renew it
one month before expiry:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
spec:
  duration: 2160h          # 90 days
  renewBefore: 360h        # 15 days
```

With `renewBefore` set to `720h`, we are expecting the renewal to happen on the
15th of March:

```diagram
                                    duration (90 days)
     <------------------------------------------------------------------------------>

                                                                                expected
                                                              expected         certificate
 certificate                                                 reissuance          expiry
   issued                                                       time              time
     +-----------------------------------------------------------+------------------+
   1 Jan                                                       15 Mar            31 Mar

                                                                  <-----------------+
                                                                 renewBefore (15 days)
```

After issuing the Certificate, cert-manager looks at the
[`notAfter`](https://www.rfc-editor.org/rfc/rfc5280.html#section-4.1.2.5) field
(inside the X.509 certificate) in order to calculate what we call the
`actualDuration`.

{{% alert title="duration may be ignored by the issuer" color="warning" %}}
Some issuers might be configured to only issue certificates with a set expiry
duration, so the actual duration (calculated using the X.509 certificate's
`notAfter` field) may be different. The `duration` field is a "hint" given
to the issuer.

We call `actualDuration` the duration before expiry that was set be the issuer:

```
actualDuration = notAfter - issuanceTime
```

{{% /alert %}}

cert-manager computes a "safe" maximum duration that we call `maxRenewBefore`,
set to a third of the actual duration:

```
maxRenewBefore = actualDuration / 3
```

cert-manager picks the smallest value between the expected `renewBefore` and
`maxRenewBefore`:

```
renewalTime = issuanceTime + min(renewBefore, maxRenewBefore)
```

### Case 1

Let's imagine that the issuer issues a X.509 certificate that matches the
duration of 90 days. That means the actual duration is 90 days. And since the
given `renewBefore` is the smallest value, cert-manager sets the `renewalTime`
to the 15th of March:

```diagram
                                   actualDuration (90 days)
     <----------------------------------------------------------------------------->
                                                                                 actual
                                                                               certificate
                                                                                 expiry
 certificate                                                                      time
   issued                                                                      (notAfter)
     +-----------------+-------+------------------+--------------+------------------+
   1 Jan             10 Feb  15 Feb             1 Mar          15 Mar            31 Mar
                                                                 ^
                                                                 |
                                                                 |<-----------------+
                                                                 |renewBefore (15 days)
                                                                 |
                                                   <-------------|------------------+
                                                        maxRenewBefore (30 days)
                                                                 |
                                                                 |
                                                            renewalTime
```

This date is available in the Certificate's status:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
spec:
  ...
status:
  renewalTime: "2021-03-15T00:00:00Z"
```

### Case 2

Let's now imagine that the issuer did not follow the `duration` hint. Instead of
90 days, the issuer has set the expiry duration to 60 days:

```diagram
                 actualDuration (60 days)
     <-------------------------------------------->
                                                actual
                                              certificate
                                                expiry
 certificate                                     time
   issued                                     (notAfter)
     +-----------------+-------+------------------+--------------+------------------+
   1 Jan             10 Feb  15 Feb             1 Mar          15 Mar            31 Mar
                               ^
                               |
                               |<-----------------+
                               |renewBefore (15 days)
                               |
                        <------|------------------+
                          maxRenewBefore (20 days)
                               |
                               |
                          renewalTime
```

Since `renewBefore` is still smaller than `maxRenewBefore`, `renewBefore` is
picked and the `renewalTime` is set to the 15th of February.

Continuing with the above example, the `notAfter` time on the X.509 certificate
is 31st of March, which means cert-manager will attempt renewing on the 1st of
March. The status of the Certificate shows that information:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
spec:
  ...
status:
  renewalTime: "2021-03-01T00:00:00Z"
```

### Case 3

Let's change the Certificate a bit. Instead of a `renewBefore` of 15 days, let's
pick 30 days:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
spec:
  duration: 2160h          # 90 days
  renewBefore: 720h        # 30 days
```

Like before, let's imagine that the issuer did not follow the `duration` hint in
a similar way.

```diagram
     <-------------------------------------------->
                      actualDuration            actual
                        (60 days)             certificate
                                                expiry
 certificate                                     time
   issued                                     (notAfter)
     +----------+------+--------------------------+--------------+------------------+
   1 Jan      1 Feb  10 Feb                     1 Mar          15 Mar            31 Mar
                       ^
                       |
                 <--------------------------------+
                       |      renewBefore (30 days)
                       |
                       |<-------------------------+
                       |  maxRenewBefore (20 days)
                       |
                       |
                  renewalTime
```

This time around, `maxRenewBefore` is lower than our `renewBefore` duration.
That means cert-manager will use a duration of 20 days for calculating the
`renewalTime`, which leads to a planned renewal date of 10th February.
