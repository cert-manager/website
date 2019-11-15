---
title: "Usage"
linkTitle: "Usage"
weight: 40
type: "docs"
---

## Issuing Certificates with cert-manager

Once [`Issuers`](../configuration/) have been configured, certificates
are able to begin to be requested from cert-manager that can be signed by these
issuers. Shown below is a list of use cases and methods for
requesting certificates through cert-manager:

- [Certificates Resources](./certificate/): The simplest and most common method for
  requesting singed certificates.
- [Securing Ingress Resources](./ingress/): A method to secure ingress resources
  in your cluster.
- [Securing OpenFaaS functions](https://docs.openfaas.com/reference/ssl/kubernetes-with-cert-manager/):
  Secure your OpenFaaS services using cert-manager.
- [Securing Knative](https://knative.dev/docs/serving/using-auto-tls/): Secure
  your Knative services with trusted HTTPS certificates.
- [Enable mTLS on Pods with CSI](./csi/): Using the cert-manager CSI
  driver to provide unique keys and certificates that share the lifecycle of
  pods.
- [Securing Istio Service Mesh](./istio/): Using the cert-manager
  [Istio](https://istio.io) integration, secure the mTLS PKI for each pod
  through cert-manager managed certificates.
