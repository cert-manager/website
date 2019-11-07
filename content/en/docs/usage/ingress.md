---
title: "Securing Ingress Resources"
linkTitle: "Securing Ingress Resources"
weight: 40
type: "docs"
---

A common use-case for cert-manager is requesting TLS signed certificates to
secure your ingress resources. This can be done by simply adding annotations to
your `Ingress` resources and cert-manager will facilitate creating the
`Certificate` resource for you. A small sub-component of cert-manager,
ingress-shim, is responsible for this.

## How It Works

The sub-component ingress-shim watches `Ingress` resources across your cluster.
If it observes an `Ingress` with annotations described in the `Supported
Annotations` (TODO @joshvanl: add sub-title line) section, it will ensure a
`Certificate` resource with the same name as the Ingress, and configured as
described on the `Ingress` exists. For example:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    # add an annotation indicating the issuer to use.
    cert-manager.io/cluster-issuer: nameOfClusterIssuer
  name: myIngress
  namespace: myIngress
spec:
  rules:
  - host: myingress.com
    http:
      paths:
      - backend:
          serviceName: myservice
          servicePort: 80
        path: /
  tls: # < placing a host in the TLS config will indicate a certificate should be created
  - hosts:
    - myingress.com
    secretName: myingress-cert # < cert-manager will store the created certificate in this secret.
```

## Supported annotations

You can specify the following annotations on `Ingress` resources in order to
trigger `Certificate` resources to be automatically created:

- `cert-manager.io/issuer`:  the name of an Issuer to acquire the certificate
  required for this ingress from. The Issuer *must* be in the same namespace
  as the `Ingress` resource.

- `cert-manager.io/cluster-issuer`: the name of a `ClusterIssuer` to acquire the
  certificate required for this ingress from. It does not matter which namespace
  your `Ingress resides`, as `ClusterIssuers` are non-namespaced resources.

- `kubernetes.io/tls-acme: "true"`: this annotation requires additional
  configuration of the ingress-shim (see below(TODO @joshvanl: add sub-title
  link)). Namely, a default issuer must be specified as arguments to the
  ingress-shim container.

- `acme.cert-manager.io/http01-ingress-class`: this annotation allows you to
  configure the ingress class that will be used to solve challenges for this
  ingress. Customising this is useful when you are trying to secure internal
  services, and need to solve challenges using a different ingress class to that
  of the ingress. If not specified and the `acme-http01-edit-in-place` annotation
  is not set, this defaults to the ingress class of the ingress resource.

- `acme.cert-manager.io/http01-edit-in-place: "true"`: this controls whether the
  ingress is modified 'in-place', or a new one created specifically for the
  http01 challenge. If present, and set to "true", the existing ingress will be
  modified. Any other value, or the absence of the annotation assumes "false".
  This annotation will also add the annotation
  `"cert-manager.io/issue-temporary-certificate": "true"` onto created
  certificates which will cause a [temporary
  certificate](../certificate/) to be set on
  the resulting `Secret` until the final signed certificate has been returned.
  This is useful for keeping compatibility with the `ingress-gce` component.
  TODO: fix link #Temporary Certificates Whilst Issuing

## Optional Configuration

The ingress-shim sub-component is deployed automatically as part of a Helm chart
installation.

If you would like to use the old
[kube-lego](https://github.com/jetstack/kube-lego) `kubernetes.io/tls-acme:
"true"` annotation for fully automated TLS, you will need to configure a default
Issuer when deploying cert-manager. This can be done by adding the following
`--set` when deploying using Helm:

```bash
   --set ingressShim.defaultIssuerName=letsencrypt-prod \
   --set ingressShim.defaultIssuerKind=ClusterIssuer
```

In the above example, cert-manager will create `Certificate` resources that
reference the `ClusterIssuer` `letsencrypt-prod` for all Ingresses that have a
`kubernetes.io/tls-acme: "true"` annotation.

For more information on deploying cert-manager, read the [installation
guide](../../installation/).
