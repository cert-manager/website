---
title: "Securing Ingress Resources"
linkTitle: "Securing Ingress Resources"
weight: 100
type: "docs"
---

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
described on the `Ingress` exists. For example:

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
  tls: # < placing a host in the TLS config will indicate a certificate should be created
  - hosts:
    - example.com
    secretName: myingress-cert # < cert-manager will store the created certificate in this secret.
```

## Supported Annotations

You can specify the following annotations on `Ingress` resources in order to
trigger `Certificate` resources to be automatically created:

- `cert-manager.io/issuer`:  the name of an `Issuer` to acquire the certificate
  required for this `Ingress`. The Issuer *must* be in the same namespace as the
`Ingress` resource.

- `cert-manager.io/cluster-issuer`: the name of a `ClusterIssuer` to acquire the
  certificate required for this `Ingress`. It does not matter which namespace
  your `Ingress` resides, as `ClusterIssuers` are non-namespaced resources.

- `cert-manager.io/issuer-kind`: the name of an external `Issuer`
  controller's `CustomResourceDefinition` (only necessary for out-of-tree `Issuers`)

- `cert-manager.io/issuer-group`: the name of the API group of external
  `Issuer` controller (only necessary for out-of-tree `Issuers`)

- `kubernetes.io/tls-acme: "true"`: this annotation requires additional
  configuration of the ingress-shim [see below](./#optional-configuration).
  Namely, a default `Issuer` must be specified as arguments to the
  ingress-shim container.

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
  certificates which will cause a [temporary certificate](../certificate/#temporary-certificates-whilst-issuing)
  to be set on the resulting `Secret` until the final signed certificate has been
  returned.  This is useful for keeping compatibility with the `ingress-gce`
  component.

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

For more information on deploying cert-manager, read the [installation
guide](../../installation/).

## Troubleshooting

If you do not see a `Certificate` resource being created after applying the ingress-shim annotations check that at least `cert-manager.io/issuer` or `cert-manager.io/cluster-issuer` is set. If you want to use `kubernetes.io/tls-acme: "true"` make sure to have checked all steps above and you might want to look for errors in the cert-manager pod logs if not resolved.
