---
title: cert-manager
description: |
    cert-manager creates TLS certificates for workloads in your Kubernetes or OpenShift cluster and renews the certificates before they expire.
---

cert-manager creates TLS certificates for workloads in your Kubernetes or OpenShift cluster
and renews the certificates before they expire.

cert-manager can obtain certificates from a [variety of certificate authorities](configuration/issuers.md), including:
[Let's Encrypt](configuration/acme/README.md), [HashiCorp Vault](configuration/vault.md),
[Venafi](configuration/venafi.md) and [private PKI](configuration/ca.md).

With cert-manager's [Certificate resource](usage/certificate.md), the private key and certificate are stored in a Kubernetes Secret
which is mounted by an application Pod or used by an Ingress controller.
With [csi-driver](usage/csi-driver/README.md), [csi-driver-spiffe](usage/csi-driver-spiffe/README.md), or [istio-csr](usage/istio-csr/README.md) ,
the private key is generated on-demand, before the application starts up;
the private key never leaves the node and it is not stored in a Kubernetes Secret.

![High level overview diagram explaining cert-manager architecture](/images/high-level-overview.svg)

This website provides the full technical documentation for the project, and can be
used as a reference; if you feel that there's anything missing, please let us know
or [raise a PR](https://github.com/cert-manager/website/pulls) to add it.

<img referrerPolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=3d7ab28a-5e59-4640-87ac-afa184b8c9dc" />
