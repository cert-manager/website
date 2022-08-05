---
title: Configuration
description: cert-manager configuration
---

## Issuers

The first thing you'll need to configure after you've installed cert-manager is an issuer
which you can then use to issue certificates.

This section documents how the different issuer types can be configured. You might want to
read more about `Issuer` and `ClusterIssuer` resources [here](../concepts/issuer.md).

cert-manager comes with a number of built-in certificate issuers which are denoted by being in
the `cert-manager.io` group. You can also install external issuers in addition to the built-in types.
Both built-in and external issuers are treated the same and are configured similarly.

When using `ClusterIssuer` resource types, ensure you understand the purpose of the
[`Cluster Resource Namespace`](../faq/cluster-resource.md); this can be a common source
of issues for people getting started with cert-manager.

- [SelfSigned]
- [CA]
- [ACME]
- [Venafi]
- [Vault]
- [External]

## Certificate

Once an Issuer has been configured, you're ready to issue your first certificate!
There are several ways to do this:

- [Certificate Resources](./certificate.md): The simplest and most common method for
  requesting signed certificates.

- [Securing Ingress Resources](./securing-ingress.md): A method to secure ingress resources
  in your cluster.

- [Enable mTLS on Pods with CSI](./csi.md): Using the cert-manager CSI
  driver to provide unique keys and certificates that share the lifecycle of
  pods.

- [Securing Istio Service Mesh](./istio.md): Using the cert-manager
  [Istio](https://istio.io) integration, secure the mTLS PKI for each pod
  through cert-manager managed certificates.

And here are some external links explaining how to integrate cert-manager with other projects:

- [Securing OpenFaaS functions](https://docs.openfaas.com/reference/ssl/kubernetes-with-cert-manager/):
  Secure your OpenFaaS services using cert-manager.

- [Integration with Garden](https://docs.garden.io/guides/cert-manager-integration): Garden is a
  developer tool for developing Kubernetes applications which has first class
  support for integrating cert-manager.

- [Securing Knative](https://knative.dev/docs/serving/using-auto-tls/): Secure
  your Knative services with trusted HTTPS certificates.

- [Securing Istio Gateway](https://istio.io/docs/tasks/traffic-management/ingress/ingress-certmgr/):
  Secure your Istio Gateway in Kubernetes using cert-manager.


## Policy

Finally you can implement policies to restrict the configuration of certificates:

- [Policy for cert-manager certificates](./approver-policy.md): Manage
  what cert-manager certificates are able to be signed or rejected through
  custom resource defined policy.
