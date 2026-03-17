---
title: Annotations
description: 'cert-manager configuration: Annotations'
# This list corresponds to items in public/_redirects `# Document cert-manager.io annotations`
# Items come from https://github.com/search?q=repo%3Acert-manager%2Fcert-manager%20%22AnnotationKey%20%3D%20%22&type=code
# Please keep these sections synced date
---

You can generally tune [Certificate](../usage/certificate.md) requests by adding annotations to
[Ingress](../usage/ingress.md) and [Gateway](../usage/gateway.md) resources.

## acme.cert-manager.io/http01-edit-in-place
- [Ingress](../usage/ingress.md)

this controls whether the ingress is modified 'in-place', or a new one is created
specifically for the HTTP01 challenge. If present, and set to `"true"`, the existing
ingress will be modified. Any other value, or the absence of the annotation assumes
`"false"`.
This annotation will also add the annotation
`"cert-manager.io/issue-temporary-certificate": "true"` onto created certificates
which will cause a
[temporary certificate](../usage/certificate.md#temporary-certificates-whilst-issuing)
to be set on the resulting `Secret` until the final signed certificate has been
returned.
This is useful for keeping compatibility with the `ingress-gce` component.

## acme.cert-manager.io/http01-ingress-class
- [Ingress](../usage/ingress.md)

Allows the `kubernetes.io/ingress.class` annotation to be configured.
Customizing this is useful when you are trying
to secure internal services, and need to solve challenges using a different ingress class
to that of the ingress. If not specified and the `acme-http01-edit-in-place` annotation is
not set, this defaults to the `http01.ingress.class` defined in the Issuer resource.

## acme.cert-manager.io/http01-ingress-ingressclassname

- [Ingress](../usage/ingress.md)

Allows the Ingress's `spec.ingressClassName` to be configured.
Customizing this is useful when you are trying
to secure internal services, and need to solve challenges using a different ingress class
to that of the ingress. If not specified and the `acme-http01-edit-in-place` annotation is
not set, this defaults to the `http01.ingress.ingressClassName` defined in the Issuer resource.

## acme.cert-manager.io/http01-parentrefkind

- [Certificate](../usage/certificate.md)

This annotation is automatically added by cert-manager to Certificate resources
when they are created from a [Gateway](../usage/gateway.md) or
[ListenerSet](../usage/gateway.md#listenerset) resource. It stores the kind of
the parent resource (either `Gateway` or `ListenerSet`) that triggered the
creation of the Certificate. This is used internally by the ACME HTTP-01 solver
to know where to attach the temporary HTTPRoute for the challenge.

## acme.cert-manager.io/http01-parentrefname

- [Certificate](../usage/certificate.md)

This annotation is automatically added by cert-manager to Certificate resources
when they are created from a [Gateway](../usage/gateway.md) or
[ListenerSet](../usage/gateway.md#listenerset) resource. It stores the name of
the parent resource that triggered the creation of the Certificate. This is used
internally by the ACME HTTP-01 solver to know where to attach the temporary
HTTPRoute for the challenge.

## cert-manager.io/allow-direct-injection
- `Secret`

allows the `cainjector` to inject secret `CA certificate` contents into other objects that have `cert-manager.io/inject-ca-from-secret`.

## cert-manager.io/alt-names
- [Certificate](../usage/certificate.md)

this annotation allows you to configure `spec.dnsNames` field for
the Certificate to be generated.
Supports comma-separated values e.g. "example.com,example.org"

## cert-manager.io/certificate-name
- [CertificateRequest](../usage/certificaterequest.md)

name of the related certificate.

## cert-manager.io/certificate-revision
- [CertificateRequest](../usage/certificaterequest.md)

the iteration the certificate request.

## cert-manager.io/cluster-issuer
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

the name of a cert-manager.io ClusterIssuer that should issue the required certificate.

## cert-manager.io/common-name
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.commonName` for the Certificate
to be generated.

## cert-manager.io/duration
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.duration` field for the
Certificate to be generated.

## cert-manager.io/email-sans
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.emailAddresses` field for
the Certificate to be generated.
Supports comma-separated values e.g. "me@example.com,you@example.com"

## cert-manager.io/ip-sans
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.ipAddresses` field for
the Certificate to be generated.
Supports comma-separated values e.g. "198.51.100.1,198.51.100.2"

## cert-manager.io/issuer-group
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

the API group of the external issuer controller, for example
`awspca.cert-manager.io`. This is only necessary for out-of-tree issuers.

## cert-manager.io/issuer-kind
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

the kind of the external issuer resource, for example `AWSPCAIssuer`. This
is only necessary for out-of-tree issuers.

## cert-manager.io/issuer-name
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

the name of a cert-manager.io Issuer that should issue the required certificate.

## cert-manager.io/issuer
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

the name of the issuer that should issue the required certificate.

## cert-manager.io/issue-temporary-certificate
- [Certificate](../usage/certificate.md)

cause a [temporary
certificate](../usage/certificate.md#temporary-certificates-whilst-issuing) to
be set on the resulting `Secret` until the final signed certificate has been
returned.
This is useful for keeping compatibility with the `ingress-gce` component.

## cert-manager.io/inject-apiserver-ca

cause the `cainjector` to inject the **CA certificate** for the Kubernetes apiserver into the resource.

## cert-manager.io/inject-ca-from

cause the `cainjector` to inject a certificate with **CA certificate**. ??

## cert-manager.io/inject-ca-from-secret

cause the `cainjector` to inject a **CA Certificate** from a secret.

## cert-manager.io/private-key-algorithm
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.privateKey.algorithm` field to set
the algorithm for private key generation for a Certificate.
Valid values are `RSA`, `ECDSA` and `Ed25519`.
If unset an algorithm `RSA` will be used.

## cert-manager.io/private-key-encoding
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.privateKey.encoding` field to set
the encoding for private key generation for a Certificate.
Valid values are `PKCS1` and `PKCS8`. If unset an algorithm `PKCS1` will be used.

## cert-manager.io/private-key-rotation-policy
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.privateKey.rotationPolicy` field
to set the rotation policy of the private key for a Certificate.
Valid values are `Never` and `Always`. If unset a rotation policy `Never` will
be used.

## cert-manager.io/private-key-secret-name
- [CertificateRequest](../usage/certificaterequest.md)

references the secret that stores the private key used to sign a x509
certificate signing request.

## cert-manager.io/private-key-size
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.privateKey.size` field to set the
size of the private key for a Certificate.
If algorithm is set to `RSA`, valid values are `2048`, `4096` or `8192`, and
will default to `2048` if not specified.
If algorithm is set to `ECDSA`, valid values are `256`, `384` or `521`, and
will default to `256` if not specified.
If algorithm is set to `Ed25519`, size is ignored.

## cert-manager.io/renew-before
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.renewBefore` field for the
Certificate to be generated.

## cert-manager.io/renew-before-percentage
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.renewBeforePercentage` field for the
Certificate to be generated.

## cert-manager.io/revision-history-limit
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.revisionHistoryLimit` field to
limit the number of CertificateRequests to be kept for a Certificate.
Minimum value is 1. If unset all CertificateRequests will be kept.

## cert-manager.io/secret-template
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to set the secretTemplate field in the generated Certificate.

## cert-manager.io/subject-countries
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.subject.countries` field for the
Certificate to be generated.
Supports comma-separated values e.g. "Country 1,Country 2"

## cert-manager.io/subject-localities
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.subject.localities` field for the
Certificate to be generated.
Supports comma-separated values e.g. "City 1,City 2"

## cert-manager.io/subject-organizationalunits
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.subject.organizationalUnits` field
for the Certificate to be generated.
Supports comma-separated values e.g. "IT Services,Cloud Services"

## cert-manager.io/subject-organizations
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.subject.organizations` field for
the Certificate to be generated.
Supports comma-separated values e.g. "Company 1,Company 2"

## cert-manager.io/subject-postalcodes
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.subject.postalCodes` field for
the Certificate to be generated.
Supports comma-separated values e.g. "123ABC,456DEF"

## cert-manager.io/subject-provinces
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to
configure `spec.subject.provinces` field for the Certificate to be generated.
Supports comma-separated values e.g. "Province 1,Province 2"

## cert-manager.io/subject-serialnumber
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to
configure `spec.subject.serialNumber` field for the Certificate to be
generated.
Supports comma-separated values e.g. "10978342379280287615,1111144445555522228888"

## cert-manager.io/subject-streetaddresses
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to
configure `spec.subject.streetAddresses` field for the Certificate to be
generated.
Supports comma-separated values e.g. "123 Example St,456 Other Blvd"

## cert-manager.io/uri-sans
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.uris` field for
the Certificate to be generated.
Supports comma-separated values e.g. "spiffe://cluster.local/ns/sandbox/sa/example"

## cert-manager.io/usages
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

this annotation allows you to configure `spec.usages` field for the Certificate
to be generated. Pass a string with comma-separated values i.e.
"key agreement,digital signature, server auth".

## experimental.cert-manager.io/request-duration
- [CertificateRequest](../usage/certificaterequest.md)

annotation used to request a particular duration.

## experimental.cert-manager.io/request-is-ca
- [CertificateRequest](../usage/certificaterequest.md)

annotation used to request a certificate be marked as CA.

## experimental.cert-manager.io/private-key-secret-name
- [CertificateRequest](../usage/certificaterequest.md)

annotation key used by the 'self signing' issuer type to self-sign certificates to reference a Secret resource containing the private key used to sign the request.

## kubernetes.io/ingress.class
- [Ingress](../usage/ingress.md)

[deprecated](https://kubernetes.io/docs/concepts/services-networking/ingress/#deprecated-annotation). You should use `spec`.`ingressClassName` instead.

## kubernetes.io/tls-acme
- [Ingress](../usage/ingress.md)

this annotation requires additional configuration of the
[ingress-shim](../usage/ingress.md#optional-configuration).
Namely, a default `Issuer` must be specified as arguments to the ingress-shim
container.

## venafi.cert-manager.io/custom-fields
- [Certificate](../usage/certificate.md)
- [Ingress](../usage/ingress.md)
- [Gateway](../usage/gateway.md)

pass JSON encoded custom fields to the CyberArk issuer.

## venafi.cert-manager.io/pickup-id
- [CertificateRequest](../usage/certificaterequest.md)

records the Pickup ID of a certificate signing request in CyberArk Certificate Manager.
