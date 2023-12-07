---
title: Annotated Ingress resource
description: 'cert-manager usage: Kubernetes Ingress'
---

> **apiVersion:** networking.k8s.io/v1  
> **kind:** Ingress

<div style={{textAlign: "center"}}>
<object data="/images/request-certificate-overview/request-certificate-ingress.svg"></object>
</div>

A common use-case for cert-manager is requesting TLS signed certificates to
secure your ingress resources. This can be done by simply adding annotations to
your `Ingress` resources and cert-manager will facilitate creating the
`Certificate` resource for you. A small sub-component of cert-manager,
ingress-shim, is responsible for this.

## How It Works

The sub-component ingress-shim watches `Ingress` resources across your cluster.
If it observes an `Ingress` with annotations described in the [Supported
Annotations](#supported-annotations) section, it will ensure a `Certificate`
resource with the name provided in the `tls.secretName` field and configured as
described on the `Ingress` exists in the `Ingress`'s namespace. For example:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    # add an annotation indicating the issuer to use.
    cert-manager.io/cluster-issuer: nameOfClusterIssuer
  name: myIngress
  namespace: myIngress
spec:
  rules:
  - host: example.com
    http:
      paths:
      - pathType: Prefix
        path: /
        backend:
          service:
            name: myservice
            port:
              number: 80
  tls: # < placing a host in the TLS config will determine what ends up in the cert's subjectAltNames
  - hosts:
    - example.com
    secretName: myingress-cert # < cert-manager will store the created certificate in this secret.
```

## Supported Annotations

You can specify the following annotations on Ingress resources in order to
trigger Certificate resources to be automatically created:

- `cert-manager.io/issuer`:  the name of the issuer that should issue the certificate
  required for this Ingress.

  > ⚠️ This annotation does _not_ assume a namespace scoped issuer. It will
  default to cert-manager.io Issuer, however in case of external issuer types,
  this should be used for both namespaced and cluster scoped issuer types.

  > ⚠️ If a namespace scoped issuer is used then the issuer *must* be in
  the same namespace as the Ingress resource.

- `cert-manager.io/cluster-issuer`: the name of a cert-manager.io ClusterIssuer
  to acquire the certificate required for this Ingress. It does not matter which
  namespace your Ingress resides, as ClusterIssuers are non-namespaced
  resources.

  > ⚠️ This annotation is a shortcut to refer to to
  cert-manager.io ClusterIssuer without having to specify group and kind. It is
  _not_ intended to be used to specify an external cluster-scoped issuer- please
  use `cert-manager.io/issuer` annotation for those.

- `cert-manager.io/issuer-kind`: the kind of the external issuer resource, for
  example `AWSPCAIssuer`. This is only necessary for out-of-tree issuers.

- `cert-manager.io/issuer-group`: the API group of the external issuer
  controller, for example `awspca.cert-manager.io`. This is only necessary for
  out-of-tree issuers.

- `kubernetes.io/tls-acme: "true"`: this annotation requires additional
  configuration of the ingress-shim [see below](#optional-configuration).
  Namely, a default Issuer must be specified as arguments to the ingress-shim
  container.

- `acme.cert-manager.io/http01-ingress-class`: this annotation allows you to
  configure the ingress class that will be used to solve challenges for this
  ingress. Customizing this is useful when you are trying to secure internal
  services, and need to solve challenges using a different ingress class to that
  of the ingress. If not specified and the `acme-http01-edit-in-place` annotation
  is not set, this defaults to the ingress class defined in the Issuer resource.

- `acme.cert-manager.io/http01-edit-in-place: "true"`: this controls whether the
  ingress is modified 'in-place', or a new one is created specifically for the
  HTTP01 challenge. If present, and set to "true", the existing ingress will be
  modified. Any other value, or the absence of the annotation assumes "false".
  This annotation will also add the annotation
  `"cert-manager.io/issue-temporary-certificate": "true"` onto created
  certificates which will cause a [temporary
  certificate](../usage/certificate.md#temporary-certificates-whilst-issuing) to be set
  on the resulting Secret until the final signed certificate has been returned.
  This is useful for keeping compatibility with the `ingress-gce` component.

- `cert-manager.io/common-name`: (optional) this annotation allows you to
  configure `spec.commonName` for the Certificate to be generated.

- `cert-manager.io/email-sans`: (optional) this annotation allows you to
  configure `spec.emailAddresses` field for the Certificate to be generated.
  Supports comma-separated values e.g. "me@example.com,you@example.com"

- `cert-manager.io/subject-organizations`: (optional) this annotation allows you to
  configure `spec.subject.organizations` field for the Certificate to be generated.
  Supports comma-separated values e.g. "Company 1,Company 2"

- `cert-manager.io/subject-organizationalunits`: (optional) this annotation allows you to
  configure `spec.subject.organizationalUnits` field for the Certificate to be generated.
  Supports comma-separated values e.g. "IT Services,Cloud Services"

- `cert-manager.io/subject-countries`: (optional) this annotation allows you to
  configure `spec.subject.countries` field for the Certificate to be generated.
  Supports comma-separated values e.g. "Country 1,Country 2"

- `cert-manager.io/subject-provinces`: (optional) this annotation allows you to
  configure `spec.subject.provinces` field for the Certificate to be generated.
  Supports comma-separated values e.g. "Province 1,Province 2"

- `cert-manager.io/subject-localities`: (optional) this annotation allows you to
  configure `spec.subject.localities` field for the Certificate to be generated.
  Supports comma-separated values e.g. "City 1,City 2"

- `cert-manager.io/subject-postalcodes`: (optional) this annotation allows you to
  configure `spec.subject.postalCodes` field for the Certificate to be generated.
  Supports comma-separated values e.g. "123ABC,456DEF"

- `cert-manager.io/subject-streetaddresses`: (optional) this annotation allows you to
  configure `spec.subject.streetAddresses` field for the Certificate to be generated.
  Supports comma-separated values e.g. "123 Example St,456 Other Blvd"

- `cert-manager.io/subject-serialnumber`: (optional) this annotation allows you to
  configure `spec.subject.serialNumber` field for the Certificate to be generated.
  Supports comma-separated values e.g. "10978342379280287615,1111144445555522228888"

- ` cert-manager.io/duration`: (optional) this annotation allows you to
  configure `spec.duration` field for the Certificate to be generated.

- `cert-manager.io/renew-before`: (optional) this annotation allows you to
  configure `spec.renewBefore` field for the Certificate to be generated.

- `cert-manager.io/usages`: (optional) this annotation allows you to configure
  `spec.usages` field for the Certificate to be generated. Pass a string with
  comma-separated values i.e "key agreement,digital signature, server auth"

- `cert-manager.io/revision-history-limit`: (optional) this annotation allows you to
  configure `spec.revisionHistoryLimit` field to limit the number of CertificateRequests to be kept for a Certificate.
  Minimum value is 1. If unset all CertificateRequests will be kept.

- `cert-manager.io/private-key-algorithm`: (optional) this annotation allows you to
  configure `spec.privateKey.algorithm` field to set the algorithm for private key generation for a Certificate.
  Valid values are `RSA`, `ECDSA` and `Ed25519`. If unset an algorithm `RSA` will be used.

- `cert-manager.io/private-key-encoding`: (optional) this annotation allows you to
  configure `spec.privateKey.encoding` field to set the encoding for private key generation for a Certificate.
  Valid values are `PKCS1` and `PKCS8`. If unset an algorithm `PKCS1` will be used.

- `cert-manager.io/private-key-size`: (optional) this annotation allows you to
  configure `spec.privateKey.size` field to set the size of the private key for a Certificate.
  If algorithm is set to `RSA`, valid values are `2048`, `4096` or `8192`, and will default to `2048` if not specified.
  If algorithm is set to `ECDSA`, valid values are `256`, `384` or `521`, and will default to `256` if not specified.
  If algorithm is set to `Ed25519`, size is ignored.

- `cert-manager.io/private-key-rotation-policy`: (optional) this annotation allows you to
  configure `spec.privateKey.rotationPolicy` field to set the rotation policy of the private key for a Certificate.
  Valid values are `Never` and `Always`. If unset a rotation policy `Never` will be used.

## Generate multiple certificates with multiple ingresses

If you need to generate certificates from multiple ingresses make sure it has the issuer annotation.
Besides the annotation, it is necessary that each ingress possess a unique `tls.secretName`

## Optional Configuration

The ingress-shim sub-component is deployed automatically as part of
installation.

If you would like to use the old
[kube-lego](https://github.com/jetstack/kube-lego) `kubernetes.io/tls-acme:
"true"` annotation for fully automated TLS, you will need to configure a default
`Issuer` when deploying cert-manager. This can be done by adding the following
`--set` when deploying using Helm:

```bash
   --set ingressShim.defaultIssuerName=letsencrypt-prod \
   --set ingressShim.defaultIssuerKind=ClusterIssuer \
   --set ingressShim.defaultIssuerGroup=cert-manager.io
```

Or by adding the following arguments to the cert-manager deployment
`podTemplate` container arguments.

```
  - --default-issuer-name=letsencrypt-prod
  - --default-issuer-kind=ClusterIssuer
  - --default-issuer-group=cert-manager.io
```

In the above example, cert-manager will create `Certificate` resources that
reference the `ClusterIssuer` `letsencrypt-prod` for all Ingresses that have a
`kubernetes.io/tls-acme: "true"` annotation.

Issuers configured via annotations have a preference over the default issuer. If a default issuer is configured via CLI flags and a `cert-manager.io/cluster-issuer` or `cert-manager.io/issuer` annotation also has been added to an Ingress, the created `Certificate` will refer to the issuer configured via annotation.

For more information on deploying cert-manager, read the [installation
guide](../installation/README.md).

## Troubleshooting

If you do not see a `Certificate` resource being created after applying the ingress-shim annotations check that at least `cert-manager.io/issuer` or `cert-manager.io/cluster-issuer` is set. If you want to use `kubernetes.io/tls-acme: "true"` make sure to have checked all steps above and you might want to look for errors in the cert-manager pod logs if not resolved.

## Inner workings diagram for developers

<object data="/images/request-certificate-debug/ingress-shim-flow.svg"></object>

[1] https://cert-manager.io/docs/usage/certificate
