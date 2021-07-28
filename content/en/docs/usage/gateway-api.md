---
title: "Securing Gateway Resources"
linkTitle: "Securing Gateway Resources"
weight: 90
type: "docs"
---

Since 1.5, cert-manager supports requesting TLS certificates using annotations
on Gateway resources. The Gateway resource is part of the [Gateway API][gwapi],
a set of CRDs that can be installed to your Kubernetes cluster and that aim at
offering a richer alternative to the Ingress abstraction.

[gwapi]: https://gateway-api.sigs.k8s.io

The Gateway resource holds the TLS configuration, as illustrated in the
following diagram (source: https://gateway-api.sigs.k8s.io):

![](https://gateway-api.sigs.k8s.io/images/gateway-roles.png)

Note that cert-manager only supports setting up the TLS configuration on the
Gateway resource when the Gateway is configured to terminate the TLS connection.
There is still uncertainty around how the HTTPRoute TLS configuration should be
used (see [the discussion about TLS interaction between HTTPRoute and
Gateway][gateway-api#577]) and no existing implementation supports the TLS
pass-through mode in which the HTTPRoute contains the TLS configuration and
terminates the connection (see the [feature request for supporting `spec.tls` in
HTTPRoute for Istio][istio#31747]).

[istio#31747]: https://github.com/istio/istio/issues/31747
[gateway-api#577]: https://github.com/kubernetes-sigs/gateway-api/issues/577

Before enabling the Gateway support, you will have to install the Gateway API
CRDs:

```sh
kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v0.3.0" | kubectl apply -f -
```

You then need to manually enable the Gateway support for Certificate using a
flag:

- If you are using Helm:

  ```sh
  helm upgrade --install cert-manager jetstack/cert-manager
    --set "extraArgs={--controllers=*\,gateway-shim}"
  ```

- If you are using the raw cert-manager manifests, you can add the following
  argument to the cert-manager controller Deployment's `args`:

  ```yaml
  args:
    # ...
    - --controllers=*,gateway-shim
  ```

You can also install the CRDs after installing cert-manager. cert-manager will
pick up the Gateway CRD as soon as it is installed.

Like with an Ingress, the annotations `cert-manager.io/issuer` or
`cert-manager.io/cluster-issuer` tells cert-manager that this Gateway should be
looked at to create Certificate. For example, the following Gateway should
trigger the creation of the `example-com-tls` Certificate:

```yaml
apiVersion: networking.x-k8s.io/v1alpha1
kind: Gateway
metadata:
  name: example
  annotations:
    cert-manager.io/issuer: foo
spec:
  gatewayClassName: foo
  listeners:
    - hostname: example.com
      port: 443
      protocol: HTTPS
      routes:
        kind: HTTPRoute
        selector:
          matchLabels:
            app: foo
      tls:
        mode: Terminate
        certificateRef:
          name: example-com-tls
          kind: Secret
          group: core
```

A few moments later, cert-manager should create a Certificate. The Certificate
is named after the Secret name `example-com-tls`. The `dnsNames` field is set
with the above `hostname` field.

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

## Use cases

### Skipping of invalid listener blocks

Like with an Ingress, the invalid listeners are skipped. For example, no
Certificate will be created for the following Gateway since both listener that
does not have a `tls` block won't be used to create the Certificates.

In the below example, the three first listener blocks are invalid:

```yaml
apiVersion: networking.x-k8s.io/v1alpha1
kind: Gateway
metadata:
  annotations:
    cert-manager.io/issuer: my-issuer
spec:
  listeners:
    # ❌  Missing "tls" block, the following listener is skipped.
    - hostname: example.com

    # ❌  Missing "hostname", the following listener is skipped.
    - tls:
        certificateRef:
          name: example-com-tls
          kind: Secret"
          group: core

    # ❌  "mode: Passthrough" is not supported, the following listener is skipped.
    - hostname: example.com
      tls:
        mode: Passthrough
        certificateRef:
          name: example-com-tls
          kind: Secret
          group: core

    # ✅  The following listener is valid.
    - hostname: foo.example.com # ✅ Required.
      port: 443
      protocol: HTTPS
      routes:
        kind: HTTPRoute
        selector:
          matchLabels:
            app: foo
      tls:
        mode: Terminate # ✅ Required. "Terminate" is the only supported mode.
        certificateRef:
          name: example-com-tls # ✅ Required.
          kind: Secret  # ✅ Required. "Secret" is the only valid value.
          group: core # ✅ Required. "core" is the only valid value.
```

The above Gateway will have one Certificate created, named `example-com-tls`
after the only valid listener block:

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

Here is the list of requirements for a valid `listener` block:

|           Field            |                         Requirement                         |
|----------------------------|-------------------------------------------------------------|
| `tls.hostname`             | Must not be empty.                                          |
| `tls.mode`                 | Must be set to `Terminate`. `Passthrough` is not supported. |
| `tls.certificateRef.name`  | Cannot be left empty.                                       |
| `tls.certificateRef.kind`  | Must be set to `Secret`.                                    |
| `tls.certificateRef.group` | Must be set to `core`.                                      |

### Two listeners with the same Secret name

Contrary to with an Ingress, you can set the same Secret name multiple times
regardless of the hostname. Let us imagine that you have these two listeners:

```yaml
apiVersion: networking.x-k8s.io/v1alpha1
kind: Gateway
metadata:
  name: example
  annotations:
    cert-manager.io/issuer: my-issuer
spec:
  gatewayClassName: foo
  listeners:
    # Listener 1.
    - hostname: example.com
      port: 443
      protocol: HTTPS
      routes:
        kind: HTTPRoute
        selector:
          matchLabels:
            app: foo
      tls:
        mode: Terminate
        certificateRef:
          name: example-com-tls
          kind: Secret
          group: core

    # Listener 2: Same Secret name as Listener 1, with a different hostname.
    - hostname: *.example.com
      port: 443
      protocol: HTTPS
      routes:
        kind: HTTPRoute
        selector:
          matchLabels:
            app: foo
      tls:
        mode: Terminate
        certificateRef:
          name: example-com-tls
          kind: Secret
          group: core

    # Listener 3: also same Secret name, except the hostname is also the same.
    - hostname: *.example.com
      port: 8443
      protocol: HTTPS
      routes:
        kind: HTTPRoute
        selector:
          matchLabels:
            app: foo
      tls:
        mode: Terminate
        certificateRef:
          name: example-com-tls
          kind: Secret
          group: core

   # Listener 4: different Secret name.
    - hostname: site.org
      port: 443
      protocol: HTTPS
      routes:
        kind: HTTPRoute
        selector:
          matchLabels:
            app: foo
      tls:
        mode: Terminate
        certificateRef:
          name: site-org-tls
          kind: Secret
          group: core
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

Four Ingress annotations are not available on Gateways:

- `acme.cert-manager.io/http01-ingress-class`
- `acme.cert-manager.io/http01-edit-in-place`
- `kubernetes.io/tls-acme`
- `cert-manager.io/issue-temporary-certificate`

The following annotations are similar to the ones supported on the Ingress
resource:

- `cert-manager.io/issuer`: the name of an `Issuer` to acquire the certificate
  required for this Gateway. The Issuer _must_ be in the same namespace as the
  Gateway resource.

- `cert-manager.io/cluster-issuer`: the name of a `ClusterIssuer` to acquire the
  certificate required for this Gateway. It does not matter which namespace
  your Gateway resides, as `ClusterIssuers` are non-namespaced resources.

- `cert-manager.io/issuer-kind`: the name of an external `Issuer`
  controller's `CustomResourceDefinition` (only necessary for out-of-tree `Issuers`)

- `cert-manager.io/issuer-group`: the name of the API group of external
  `Issuer` controller (only necessary for out-of-tree `Issuers`)

- `cert-manager.io/common-name`: (optional) this annotation allows you to
  configure `spec.commonName` for the `Certificate` to be generated.

- ` cert-manager.io/duration`: (optional) this annotation allows you to
  configure `spec.duration` field for the `Certificate` to be generated.

- `cert-manager.io/renew-before`: (optional) this annotation allows you to
  configure `spec.renewBefore` field for the `Certificate` to be generated.

- `cert-manager.io/usages`: (optional) this annotation allows you to configure
  `spec.usages` field for the `Certificate` to be generated. Pass a string with
  comma-separated values i.e "key agreement,digital signature, server auth"

One annotation is specific to the Gateway resource:

- `acme.cert-manager.io/http01-gateway-class` allows you to configure the
  `spec.gatewayClass` of the created Gateway while solving the HTTP-01
  challenge.