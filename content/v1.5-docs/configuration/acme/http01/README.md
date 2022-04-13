---
title: HTTP01
description: 'cert-manager configuration: ACME HTTP-01 challenges'
---

<div className="info">

📌  This page focuses on solving ACME HTTP-01 challenges. If you are looking for
how to automatically create Certificate resources by annotating Ingress or
Gateway resources, see [Securing Ingress Resources](../../../usage/ingress.md) and
[Securing Gateway Resources](../../../usage/gateway.md).

</div>

cert-manager uses your existing Ingress or Gateway configuration in order to
solve HTTP01 challenges.


## Configuring the HTTP01 Ingress solver

This page contains details on the different options available on the `Issuer`
resource's HTTP01 challenge solver configuration. For more information on
configuring ACME issuers and their API format, read the [ACME Issuers](../README.md)
documentation.

You can read about how the HTTP01 challenge type works on the [Let's Encrypt
challenge types
page](https://letsencrypt.org/docs/challenge-types/#http-01-challenge).

Here is an example of a simple `HTTP01` ACME issuer with more options for
configuration below:

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
       ingress:
         class: nginx
```

## Options

The HTTP01 Issuer supports a number of additional options.  For full details on
the range of options available, read the [reference
documentation](../../../reference/api-docs.md#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01).

### `class`

If the `class` field is specified, cert-manager will create new `Ingress`
resources in order to route traffic to the `acmesolver` pods, which are
responsible for responding to ACME challenge validation requests.

If this field is not specified, and `name` is also not specified,
cert-manager will default to create *new* `Ingress` resources but will **not**
set the ingress class on these resources, meaning *all* ingress controllers
installed in your cluster will serve traffic for the challenge solver,
potentially incurring additional cost.


### `name`

If the `name` field is specified, cert-manager will edit the named
ingress resource in order to solve HTTP01 challenges.

This is useful for compatibility with ingress controllers such as `ingress-gce`,
which utilize a unique IP address for each `Ingress` resource created.

This mode should be avoided when using ingress controllers that expose a single
IP for all ingress resources, as it can create compatibility problems with
certain ingress-controller specific annotations.

<h3 id="ingress-service-type">`serviceType`</h3>

In rare cases it might be not possible/desired to use `NodePort` as type for the
HTTP01 challenge response service, e.g. because of Kubernetes limit
restrictions. To define which Kubernetes service type to use during challenge
response specify the following HTTP01 configuration:

```yaml
    http01:
      ingress:
        # Valid values are ClusterIP and NodePort
        serviceType: ClusterIP
```

By default, type `NodePort` will be used when you don't set HTTP01 or when you set
`serviceType` to an empty string. Normally there's no need to change this.


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
        ingress:
          podTemplate:
            metadata:
              labels:
                foo: "bar"
                env: "prod"
            spec:
              nodeSelector:
                bar: baz
```

The added labels and annotations will merge on top of the cert-manager defaults,
overriding entries with the same key.

No other fields of the `podTemplate` exist.

### `ingressTemplate`

It is possible to add labels and annotations to the solver ingress resources.
These can be configured under the `metadata` field under `ingressTemplate`:

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
        ingress:
          ingressTemplate:
            metadata:
              labels:
                foo: "bar"
              annotations:
                "nginx.ingress.kubernetes.io/whitelist-source-range": "0.0.0.0/0,::/0"
                "nginx.org/mergeable-ingress-type": "minion"
                "traefik.ingress.kubernetes.io/frontend-entry-points": "http"
```

The added labels and annotations will merge on top of the cert-manager defaults,
overriding entries with the same key.

No other fields of the ingress can be edited.

## Configuring the HTTP-01 Gateway API solver

**FEATURE STATE**: cert-manager 1.5 [alpha]

The Gateway and HTTPRoute resources are part of the [Gateway API][gwapi], a set
of CRDs that you install on your Kubernetes cluster that provide various
improvements over the Ingress API.

[gwapi]: https://gateway-api.sigs.k8s.io

<div className="info">

📌  This feature requires the installation of the Gateway API CRDs and passing a
feature flag to the cert-manager controller.

To install the Gateway API CRDs, run the following command:

```sh
kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v0.3.0" | kubectl apply -f -
```

To enable the feature in cert-manager, turn on the `GatewayAPI` feature gate:

- If you are using Helm:

  ```sh
  helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager \
    --set "extraArgs={--feature-gates=ExperimentalGatewayAPISupport=true}"
  ```

- If you are using the raw cert-manager manifests, add the following flag to the
  cert-manager controller Deployment:

  ```yaml
  args:
    - --feature-gates=ExperimentalGatewayAPISupport=true
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

The Gateway API HTTPRoute HTTP-01 solver creates a temporary HTTPRoute using the
given labels. These labels must match a Gateway that contains a listener on port
80.

Here is an example of a HTTP-01 ACME Issuer using the Gateway API:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt
  namespace: default
spec:
  acme:
    solvers:
      - http01:
          gatewayHTTPRoute:
            labels:
              gateway: http01-solver
```

The Issuer relies on an existing Gateway present on the cluster. cert-manager
does not edit Gateway resources.

For example, the following Gateway will allow the Issuer to solve the challenge:

```yaml
apiVersion: networking.x-k8s.io/v1alpha1
kind: Gateway
metadata:
  name: traefik
  namespace: traefik
spec:
  gatewayClassName: traefik
  listeners:
  - protocol: HTTP
    port: 80
    routes:
      kind: HTTPRoute
      selector:
        matchLabels:
          gateway: http01-solver
      namespaces:
        from: All
```

In the above example, the Gateway has been specifically created for the purpose
of solving HTTP-01 challenges, but you can also choose to re-use your existing
Gateway, as long as it has a listener on port 80.

The `labels` on your Issuer may reference a Gateway that is on a separate
namespace, as long as the Gateway's port 80 listener is configured with `from:
All`. Note that the Certificate will still be created on the same namespace as
the Issuer, which means that you won't be able to reference this Secret in the
above-mentioned Gateway.

When the above Issuer is presented with a Certificate, cert-manager creates the
temporary HTTPRoute. For example, with the following Certificate:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-tls
  namespace: default
spec:
  issuerRef:
    name: letsencrypt
  dnsNames:
  - example.net
```

You will see an HTTPRoute appear. The `labels` given to this HTTPRoute are the
labels configured on the Issuer:

```yaml
kind: HTTPRoute
metadata:
  name: cm-acme-http-solver-gdhvg
  namespace: default
  labels:
    gateway: http01-solver # Copied from Issuer's `gatewayHTTPRoute.labels`.
spec:
  gateways:
    allow: All
  hostnames:
  - example.net
  rules:
  - forwardTo:
    - port: 8089
      serviceName: cm-acme-http-solver-gdhvg
      weight: 1
    matches:
    - path:
        type: Exact
        value: /.well-known/acme-challenge/YadC4gaAzqEPU1Yea0D2MrzvNRWiBCtUizCtpiRQZqI
```

After the Certificate is issued, the HTTPRoute is deleted.

<h3 id="gatewayhttproute-labels">`labels`</h3>

These labels are copied into the temporary HTTPRoute created by cert-manager for
solving the HTTP-01 challenge. These labels must match one of the Gateway
resources on your cluster. The matched Gateway have a listener on port 80.

Note that when the labels do not match any Gateway on your cluster, cert-manager
will create the temporary HTTPRoute challenge and nothing will happen.

<h3 id="gatewayhttproute-service-type">`serviceType`</h3>

This field has the same meaning as the
[`http01.ingress.serviceType`](#ingress-service-type).