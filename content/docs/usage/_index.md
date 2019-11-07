---
title: "Usage"
linkTitle: "usage"
weight: 40
type: "docs"
---

## Issuing Certificates with cert-manager

Once [`Issuers`](../configuration/index.md) have been configured, certificates
are able to begin to be requested from cert-manager that can be signed by these
issuers. The cert-manager project enables multiple use-cases and methods for
requesting certificates. Shown below is a list of use cases and methods for
requesting certificates through cert-manager:

- [Certificates Resources](./certificate.md): The simplest and most common method for
  requesting singed certificates.
- [Securing Ingress Resources](./ingress.md): A method to secure ingress edges
  for you cluster.
- [Securing Knative](./knative.md): Secure your Knative installation with
  trusted HTTPS connection.
- [Enable mTLS on Pods with CSI](./csi.md): Using the cert-manager CSI
  driver to provide unique keys and certificates that share the life cycle of
  pods.
- [Securing Istio Service Mesh](./istio.md): Using the cert-manager
  [Istio](https://istio.io) integration, secure the mTLS PKI for each pod
  through cert-manager managed certificates.
