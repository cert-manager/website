---
title: Configuration
description: cert-manager configuration
---

After installing cert-manager you will find that some new resource types have been added to the Kubernetes API server
such as `Issuer`, `ClusterIssuer`, and `Certificate`.
They all have `metadata`, `spec` and `status` fields, just like other Kubernetes resources.

You can create them by writing the content to a YAML file and using `kubectl apply` to send them to the Kubernetes API server.
Whenever you create or update one of these resources cert-manager will react;
it will do some work and it will update the status with information about what it has done.

Here is an overview of each of these resources explaining when you should create them and what cert-manager will do in each case.

## Issuer and ClusterIssuer

The first thing you'll need to configure after you've installed cert-manager is an `Issuer` or a `ClusterIssuer`.
These are resources that represent certificate authorities (CAs)
which are able to sign certificates in response to certificate signing requests.

📖 [Learn more about Issuer and ClusterIssuer resources](issuer-and-clusterissuer-resources/README.md)

## Certificate

Next you'll probably want to create a `Certificate`.
This resource represents a desired X.509 certificate which will be signed and renewed before it expires.
The private key and signed certificate will be stored in a `Secret` which you can then mount in to a `Pod`
or use in an `Ingress` resource.

📖 [Learn more about Certificate resources](certificate-resources.md)

## Ingress

There are several ways to do this:

- [Securing Ingress Resources](./securing-ingress.md): A method to secure ingress resources
  in your cluster.

## mTLS

- [Enable mTLS on Pods with CSI](./csi.md): Using the cert-manager CSI
  driver to provide unique keys and certificates that share the lifecycle of
  pods.

- [Securing Istio Service Mesh](./istio.md): Using the cert-manager
  [Istio](https://istio.io) integration, secure the mTLS PKI for each pod
  through cert-manager managed certificates.


## Policy

Finally you can implement policies to restrict the configuration of certificates:

- [Policy for cert-manager certificates](./approver-policy.md): Manage
  what cert-manager certificates are able to be signed or rejected through
  custom resource defined policy.

## Miscellaneous

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
