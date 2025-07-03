---
title: Annotated Gateway resource
description: 'cert-manager usage: Kubernetes Gateways'
---

> **apiVersion:** gateway.networking.k8s.io/v1  
> **kind:** Gateway

<div style={{textAlign: "center"}}>
<object data="/images/request-certificate-overview/request-certificate-gateway.svg"></object>
</div>

**FEATURE STATE**: cert-manager 1.15 [beta]

<div className="info">

📌  This page focuses on automatically creating Certificate resources by
annotating Kubernetes Gateway resource. If you are looking for using an ACME Issuer along
with HTTP-01 challenges using the Kubernetes Gateway API, see [ACME
HTTP-01](../configuration/acme/http01/README.md).

</div>

<div className="info">

🚧   cert-manager 1.14+ is tested with v1 Kubernetes Gateway API. It should also work
with v1beta1 and v1alpha2 because of resource conversion, but has not been tested with it.

</div>

cert-manager can generate TLS certificates for Gateway resources. This is
configured by adding annotations to a Gateway and is similar to the process for
[Securing Ingress Resources](../usage/ingress.md).

The Gateway resource is part of the [Gateway API][gwapi], a set of CRDs that you
install on your Kubernetes cluster and which provide various improvements over
the Ingress API.

[gwapi]: https://gateway-api.sigs.k8s.io

The Gateway resource holds the TLS configuration, as illustrated in the
following diagram (source: https://gateway-api.sigs.k8s.io):

![Gateway vs. HTTPRoute](/images/gateway-roles.png)

<div className="info">

📌  This feature requires the installation of the [Gateway API bundle](https://gateway-api.sigs.k8s.io/guides/#installing-a-gateway-controller) and passing an
additional flag to the cert-manager controller.

To install v1.5.1 Gateway API bundle (Gateway CRDs and webhook), run the following command:

```sh
kubectl apply -f "https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml"
```

Since cert-manager 1.15, the Gateway API support is no longer gated behind a
feature flag, but you still need to enable the Gateway API support.

To enable the Gateway API support, use the [file-based
configuration](../installation/configuring-components.md#configuration-file) using the
following `config` Helm value:

```yaml
config:
  apiVersion: controller.config.cert-manager.io/v1alpha1
  kind: ControllerConfiguration
  enableGatewayAPI: true
```

The corresponding Helm command is:

```sh
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager \
  --set config.apiVersion="controller.config.cert-manager.io/v1alpha1" \
  --set config.kind="ControllerConfiguration" \
  --set config.enableGatewayAPI=true
```

The Gateway API CRDs should either be installed before cert-manager starts or
the cert-manager Deployment should be restarted after installing the Gateway API
CRDs. This is important because some of the cert-manager components only perform
the Gateway API check on startup. You can restart cert-manager with the
following command:

```sh
kubectl rollout restart deployment cert-manager -n cert-manager
```

</div>

The annotations `cert-manager.io/issuer` or `cert-manager.io/cluster-issuer`
tell cert-manager  to create a Certificate for a Gateway. For example, the
following Gateway will trigger the creation of a Certificate with the name
`example-com-tls`:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example
  annotations:
    cert-manager.io/issuer: foo
spec:
  gatewayClassName: foo
  listeners:
    - name: http
      hostname: example.com
      port: 443
      protocol: HTTPS
      allowedRoutes:
        namespaces:
          from: All
      tls:
        mode: Terminate
        certificateRefs:
          - name: example-com-tls
```

A few moments later, cert-manager will create a Certificate. The Certificate is
named after the Secret name `example-com-tls`. The `dnsNames` field is set with
the `hostname` field from the Gateway spec.

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com-tls
spec:
  issuerRef:
    name: my-issuer
    kind: Issuer
    group: cert-manager.io
  dnsNames:
    - example.com # ✅ Copied from the `hostname` field.
  secretName: example-com-tls
```

<div className="info">

🚧   this mechanism can only be used to create Secrets in the same namespace as the `Gateway`, see [`cert-manager#5610`](https://github.com/cert-manager/cert-manager/issues/5610)

</div>

## Use cases

### Generate TLS certs for selected TLS blocks

cert-manager skips any listener block that cannot be used for generating a
Certificate. For a listener block to be used for creating a Certificate, it must
meet the following requirements:

|           Field                |                         Requirement                         |
|--------------------------------|-------------------------------------------------------------|
| `tls.hostname`                 | Must not be empty.                                          |
| `tls.mode`                     | Must be set to `Terminate`. `Passthrough` is not supported. |
| `tls.certificateRef.name`      | Cannot be left empty.                                       |
| `tls.certificateRef.kind`      | If specified, must be set to `Secret`.                      |
| `tls.certificateRef.group`     | If specified, must be set to `core`.                        |
| `tls.certificateRef.namespace` | If specified, must be the same as the `Gateway`.            |

In the following example, the first four listener blocks will not be used to
generate Certificate resources:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: my-gateway
  namespace: default
  annotations:
    cert-manager.io/issuer: my-issuer
spec:
  gatewayClassName: foo
  listeners:
    # ❌  Missing "tls" block, the following listener is skipped.
    - name: example-1
      port: 80
      protocol: HTTP
      hostname: example.com

    # ❌  Missing "hostname", the following listener is skipped.
    - name: example-2
      port: 443
      protocol: HTTPS
      tls:
        certificateRefs:
          - name: example-com-tls
            kind: Secret
            group: ""

    # ❌  "mode: Passthrough" is not supported, the following listener is skipped.
    - name: example-3
      hostname: example.com
      port: 8443
      protocol: HTTPS
      tls:
        mode: Passthrough
        certificateRefs:
          - name: example-com-tls
            kind: Secret
            group: ""

    # ❌  Cross-namespace secret references are not supported, the following listener is skipped.
    - name: example-4
      hostname: foo.example.com
      port: 8443
      protocol: HTTPS
      allowedRoutes:
        namespaces:
          from: All
      tls:
        mode: Terminate
        certificateRefs:
          - name: example-com-tls
            kind: Secret
            group: ""
            namespace: other-namespace

    # ✅  The following listener is valid.
    - name: example-5
      hostname: bar.example.com # ✅ Required.
      port: 8443
      protocol: HTTPS
      allowedRoutes:
        namespaces:
          from: All
      tls:
        mode: Terminate # ✅ Required. "Terminate" is the only supported mode.
        certificateRefs:
          - name: example-com-tls # ✅ Required.
            kind: Secret  # ✅ Optional. "Secret" is the only valid value.
            group: "" # ✅ Optional. "" is the only valid value.
```

cert-manager has skipped over the first four listener blocks and has created a
single Certificate named `example-com-tls` for the last listener block:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com-tls
spec:
  issuerRef:
    name: my-issuer
    kind: Issuer
    group: cert-manager.io
  dnsNames:
    - foo.example.com
  secretName: example-com-tls
```

### Two listeners with the same Secret name

The same Secret name can be re-used in multiple TLS blocks, regardless of the
hostname. Let us imagine that you have these two listeners:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example
  annotations:
    cert-manager.io/issuer: my-issuer
spec:
  gatewayClassName: foo
  listeners:
    # Listener 1.
    - name: example-1
      hostname: example.com
      port: 443
      protocol: HTTPS
      tls:
        mode: Terminate
        certificateRefs:
          - name: example-com-tls

    # Listener 2: Same Secret name as Listener 1, with a different hostname.
    - name: example-2
      hostname: "*.example.com"
      port: 443
      protocol: HTTPS
      tls:
        mode: Terminate
        certificateRefs:
          - name: example-com-tls

    # Listener 3: also same Secret name, except the hostname is also the same.
    - name: example-3
      hostname: "*.example.com"
      port: 8443
      protocol: HTTPS
      tls:
        mode: Terminate
        certificateRefs:
          - name: example-com-tls

   # Listener 4: different Secret name.
    - name: example-4
      hostname: site.org
      port: 443
      protocol: HTTPS
      tls:
        mode: Terminate
        certificateRefs:
          - name: site-org-tls
```

cert-manager will create two Certificates since two Secret names are used:
`example-com-tls` and `site-org-tls`. Note the Certificate's `dnsNames` contains
a single occurrence of `*.example.com ` for both listener 2 and 3 (the
`hostname` values are de-duplicated).

The two Certificates look like this:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com-tls
spec:
  issuerRef:
    name: my-issuer
    kind: Issuer
    group: cert-manager.io
  dnsNames:
    - example.com # From listener 1.
    - *.example.com # From listener 2 and 3.
  secretName: example-com-tls
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: site-org-tls
spec:
  issuerRef:
    name: my-issuer
    kind: Issuer
    group: cert-manager.io
  dnsNames:
    - site.org # From listener 4.
  secretName: site-org-tls
```

## Supported Annotations

If you are migrating to Gateway resources from Ingress resources, be aware that
there are some differences between [the annotations for Ingress resources](./ingress.md#supported-annotations)
versus the annotations for Gateway resources.

The Gateway resource supports the following annotations for generating
Certificate resources:

- `cert-manager.io/issuer`: the name of an Issuer to acquire the certificate
  required for this Gateway. The Issuer _must_ be in the same namespace as the
  Gateway resource.

- `cert-manager.io/cluster-issuer`: the name of a ClusterIssuer to acquire the
  Certificate required for this Gateway. It does not matter which namespace your
  Gateway resides, as `ClusterIssuers` are non-namespaced resources.

- `cert-manager.io/issuer-kind`: the kind of the external issuer resource, for
  example `AWSPCACIssuer`. This is only necessary for out-of-tree issuers.

- `cert-manager.io/issuer-group`: the API group of the external issuer
  controller, for example `awspca.cert-manager.io`. This is only necessary for
  out-of-tree issuers.

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

- `cert-manager.io/duration`: (optional) this annotation allows you to
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

## Inner workings diagram for developers

<object data="/images/request-certificate-debug/gateway-shim-flow.svg"></object>

[1] https://cert-manager.io/docs/usage/certificate
