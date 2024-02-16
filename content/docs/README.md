---
title: cert-manager
description: |
    cert-manager creates TLS certificates for workloads in your Kubernetes or OpenShift cluster
    and renews the certificates before they expire.
---

cert-manager creates TLS certificates for workloads in your Kubernetes or OpenShift cluster
and renews the certificates before they expire.
The private key and certificate are stored in Kubernetes Secrets and used by applications or ingress controllers.

With the [csi-driver](projects/csi-driver.md), [csi-driver-spiffe](projects/csi-driver-spiffe.md), or [istio-csr](projects/istio-csr.md) addons,
the private key is generated on-demand, before the application starts up;
the private key never leaves the node and it is not stored a Kubernetes Secret.

cert-manager can obtain certificates from a variety of certificate authorities, including:
[Let's Encrypt](configuration/acme/README.md), [HashiCorp Vault](configuration/vault.md),
[Venafi](configuration/venafi.md) and [private PKI](configuration/ca.md).

![High level overview diagram explaining cert-manager architecture](/images/high-level-overview.svg)

This website provides the full technical documentation for the project, and can be
used as a reference; if you feel that there's anything missing, please let us know
or [raise a PR](https://github.com/cert-manager/website/pulls) to add it.
