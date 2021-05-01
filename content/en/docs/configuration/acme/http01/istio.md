---
title: "Istio"
linkTitle: "Istio"
weight: 30
type: "docs"
---

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: example-issuer-account-key
    solvers:
    - http01:
        istio:
          gateways:
          - gateway-ns/gateway-name
```

## Options

The Istio virtualservice based HTTP01 challenge solver will solve challenges by creating an
Istio `VirtualService` resource that is connected to the specified Istio `Gateways` in order to
route requests for '/.well-known/acme-challenge/XYZ' to 'challenge solver' pods, that are 
provisioned by cert-manager for each challenge to be completed.

The HTTP01 Istio issuer requires the following options to be configured. For full details on
the range of options available, read the [reference
documentation](../../../../reference/api-docs/#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01Istio).

### `gateways`

`gateways` is an optional field that is passed directly to the `VirtualService` that configures the HTTP01 challenge routes.
The gateways identifiers are formatted as `<gateway namespace>/<gateway name>` or `<gateway name>`.
Specifying a gateway with no namespace qualifier, is the same as specifying the `VirtualService`'s namespace.
More information on this field can be found in the Istio documentation:
https://istio.io/latest/docs/reference/config/networking/virtual-service/#VirtualService.

<!---
### `podTemplate`

You may wish to change or add to the labels and annotations of solver pods.
These can be configured under the `metadata` field under `podTemplate`.

Similarly, you can set the `nodeSelector`, tolerations and affinity of solver
pods by configuring under the `spec` field of the `podTemplate`. No other
spec fields can be edited.

An example of how you could configure the template is as so:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: ...
spec:
  acme:
    server: ...
    privateKeySecretRef:
      name: ...
    solvers:
    - http01:
        istio:
          gateways: ...
          podTemplate:
            metadata:
              labels:
                foo: "bar"
                env: "prod"
            spec:
              nodeSelector:
                bar: baz
```
-->

### `serviceType`

In rare cases it might be not possible/desired to use `NodePort` as type for the
HTTP01 challenge response service, e.g. because of Kubernetes limit
restrictions. To define which Kubernetes service type to use during challenge
response, specify the following HTTP01 configuration:

```yaml
    http01:
      istio:
        # Valid values are ClusterIP and NodePort or the value can be omitted
        serviceType: ClusterIP
```

By default, type `ClusterIP` will be used when you don't set `serviceType` or when
you set `serviceType` to an empty string. Normally there's no need to change this.

## Installing Istio after installing cert-manager

On startup, the cert-manager controller detects if Istio is installed in the cluster. If Istio
is installed after the cert-manger controller starts, the controller will not detect this. In this case,
a restart of the cert-manager controller is required.

## Disabling Istio support in cert-manager

On startup, the cert-manager controller detects if Istio is installed in the cluster. It will also
check whether it is allowed to retrieve a list of Istio `VirtualService` resources. If a permission
error is detected, Istio support is disabled. Disabling Istio support in cert-manager can thus be
done by removing [these RBAC entries from the controller's `ClusterRole` resource](https://github.com/jetstack/cert-manager/blob/7ff54e61e97cf622a7a1f4cee141f8773daafd8b/deploy/charts/cert-manager/templates/rbac.yaml#L226-L233).
Alternatively, when using helm to setup cert-manager, the `rbac.allowIstioResourceAccess` helm
option can be changed to `false` to disable Istio support.

## HTTPS redirect on the Istio gateway

If the Istio gateway is configured to redirect HTTP traffic to HTTPS, a certificate has to be present
in order for the HTTP01 challenge to complete. Therefore, a temporary self-signed certificate can
be created by cert-manager. This way HTTPS requests can be served and the HTTP01 challenge can succeed.

This can be done by adding the `"cert-manager.io/issue-temporary-certificate": "true"` annotation to
the `Certificate`. Below, for an example setup, the Istio `Gateway`, `Issuer` and `Certificate` are given.

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: example-gateway
  namespace: example-ns
spec:
  selector:
    istio: ingressgateway # use istio default controller
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - example.com
    tls:
      httpsRedirect: true # https redirect is enabled
  - port:
      number: 443
      name: https
      protocol: HTTPS
    hosts:
    - example.com
    tls:
      credentialName: example-cert-secret
      mode: SIMPLE
      privateKey: sds
      serverCertificate: sds
```

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
  namespace: istio-system
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: example-issuer-account-key
    solvers:
    - http01:
        istio:
          gateways:
          - example-ns/example-gateway
```

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-cert
  namespace: istio-system
  annotations:
    "cert-manager.io/issue-temporary-certificate": "true"
spec:
  secretName: example-cert-secret
  dnsNames:
  - example.com
  issuerRef:
    kind: Issuer
    name: example-issuer
```

