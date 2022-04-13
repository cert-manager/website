---
title: HTTP01
description: 'cert-manager configuration: ACME HTTP-01 challenges'
---

## Configuring HTTP01 Ingress Provider

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
apiVersion: cert-manager.io/v1alpha2
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
documentation](../../reference/api-docs.md#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01).

### `ingressClass`

If the `ingressClass` field is specified, cert-manager will create new `Ingress`
resources in order to route traffic to the `acmesolver` pods, which are
responsible for responding to ACME challenge validation requests.

If this field is not specified, and `ingressName` is also not specified,
cert-manager will default to create *new* `Ingress` resources but will **not**
set the ingress class on these resources, meaning *all* ingress controllers
installed in your cluster will serve traffic for the challenge solver,
potentially occurring additional cost.


### `ingressName`

If the `ingressName` field is specified, cert-manager will edit the named
ingress resource in order to solve HTTP01 challenges.

This is useful for compatibility with ingress controllers such as `ingress-gce`,
which utilize a unique IP address for each `Ingress` resource created.

This mode should be avoided when using ingress controllers that expose a single
IP for all ingress resources, as it can create compatibility problems with
certain ingress-controller specific annotations.

### `servicePort`

In rare cases it might be not possible/desired to use `NodePort` as type for the
HTTP01 challenge response service, e.g. because of Kubernetes limit
restrictions. To define which Kubernetes service type to use during challenge
response specify the following HTTP01 configuration:

```yaml
    http01:
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
apiVersion: cert-manager.io/v1alpha2
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
apiVersion: cert-manager.io/v1alpha2
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