---
title: "Securing Gateway Resources"
linkTitle: "Securing Gateway Resources"
weight: 90
type: "docs"
---

Since 1.5, cert-manager supports requesting TLS certificates using annotations
on Gateway resources. The Gateway resource is part of the [Gateway API][gwapi],
a set of CRDs that can be installed to your Kubernetes cluster and that aim at
offering an richer alternative to the Ingress abstraction.

[gwapi]: https://gateway-api.sigs.k8s.io

The Gateway resource holds the TLS configuration, as illustrated in the
following diagram (source: https://gateway-api.sigs.k8s.io):

![](https://gateway-api.sigs.k8s.io/images/gateway-roles.png)

Note that cert-manager only supports setting up the TLS configuration on the
Gateway resource when the Gateway is configured to terminate the TLS connection.
There is still uncertainty around how the HTTPRoute TLS configuration should be
used (see
[gateway-api#577](https://github.com/kubernetes-sigs/gateway-api/issues/577)),
and no existing implementation supports the TLS passthrough mode in which the
HTTPRoute contains the TLS configuration and terminates the connection (see
[istio#31747](https://github.com/istio/istio/issues/31747)).

The Gateway support for Certificate shims must be enabled manually using a flag.
If you are using Helm:

```sh
helm upgrade --install cert-manager jetstack/cert-manager
  --set "extraArgs={--controllers=*\,gateway-shim}"
```

If you are using the raw cert-manager manifests, you can add the following like
to the cert-manager controller Deployment `args`:

```sh
--controllers=*,gateway-shim
```

Like with an Ingress, the annotations `cert-manager.io/issuer` or
`cert-manager.io/cluster-issuer` tells cert-manager that this Gateway should be
looked at to create Certificate shims. For example, the following Gateway should
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

A few moments later, cert-manager should create a Certificate shim:

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
    - example.com
  secretName: example-com-tls
```

Contrary to Ingresses, you can set the same secret name multiple times. Let us
imagine that you have these two listeners:

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
    - hostname: www.example.com
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

The Certificate "shim" created by cert-manager will looks like this:

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
    - example.com
    - www.example.com
  secretName: example-com-tls
```

The only kind and group supported in `certificateRef` is `Secret` and `core`,
and both fields are required for the creation of a Certificate shim:

```yaml
kind: Gateway
spec:
  listeners:
    - hostname: example.com
      tls:
        certificateRef:
          name: example-com-tls
          kind: Secret # ✅ Mandatory.
          group: core # ✅ Mandatory.
```

The only TLS mode allowed is `Terminate`, which must be set explicitly:

```yaml
kind: Gateway
spec:
  listeners:
    - hostname: example.com
      tls:
        mode: Terminate # ✅ Mandatory.
```

Like with an Ingress, any invalid listener is skipped. For example, a listener
that does not have a `tls` block won't be used to create a Certificate:

```yaml
# No Certificate will be created for this Gateway.
kind: Gateway
spec:
  listeners:
        - hostname: example.com
      tls:
        # ❌ Passthrough is not supported, this listener is skipped.
        mode:
        certificateRef:
          name: example-com-tls
          kind: Secret
          group: core
    - hostname: www.example.com
      tls:
        # ❌ Missing "mode", this listener is skipped.
        certificateRef:
          name: example-com-tls
          kind: Secret"
          group: core
```

## Supported Annotations

Two Ingress annotations are not available on Gateways:

- `acme.cert-manager.io/http01-ingress-class` since the Gateway resource does
  not have a `class` field.

  🔥 **TODO:** add an annotation `acme.cert-manager.io/http01-gateway-class` to
  override the `gatewayClass` defined on the Issuer.

- `acme.cert-manager.io/http01-edit-in-place` since this is specific to some
  ingress controllers like ingress-gce.
- `kubernetes.io/tls-acme`??

  🔥 **TODO:** should we keep this annotation for the Gateway support?

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
