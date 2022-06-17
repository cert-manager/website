---
title: Issuing Certificates
description: 'cert-manager usage: Overview'
---

Once an [`Issuer`](../configuration/README.md) has been configured, you're ready to issue your first certificate!

There are several use cases and methods for requesting certificates through cert-manager:

- [Certificate Resources](./certificate.md): The simplest and most common method for
  requesting signed certificates.
- [Securing Ingress Resources](./ingress.md): A method to secure ingress resources
  in your cluster.
- [Securing OpenFaaS functions](https://docs.openfaas.com/reference/ssl/kubernetes-with-cert-manager/):
  Secure your OpenFaaS services using cert-manager.
- [Integration with Garden](https://docs.garden.io/guides/cert-manager-integration): Garden is a
  developer tool for developing Kubernetes applications which has first class
  support for integrating cert-manager.
- [Securing Knative](https://knative.dev/docs/serving/using-auto-tls/): Secure
  your Knative services with trusted HTTPS certificates.
- [Enable mTLS on Pods with CSI](./csi.md): Using the cert-manager CSI
  driver to provide unique keys and certificates that share the lifecycle of
  pods.
- [Securing Istio Gateway](https://istio.io/docs/tasks/traffic-management/ingress/ingress-certmgr/):
  Secure your Istio Gateway in Kubernetes using cert-manager.
- [Securing Istio Service Mesh](./istio.md): Using the cert-manager
  [Istio](https://istio.io) integration, secure the mTLS PKI for each pod
  through cert-manager managed certificates.
- [Policy for cert-manager certificates](./approver-policy.md): Manage
  what cert-manager certificates are able to be signed or rejected through
  custom resource defined policy.
