---
title: cert-manager
description: |
    cert-manager creates TLS certificates for workloads in your Kubernetes or OpenShift cluster
    and renews the certificates before they expire.
---

cert-manager creates TLS certificates for workloads in your Kubernetes or OpenShift cluster
and renews the certificates before they expire.
The private key and certificate are stored in Kubernetes secrets and used by applications or ingress controllers.
The csi-driver addon instead lets applications mount these certificates in its container directly, ideal for short-lived certificates.

cert-manager can obtain certificates from a variety of certificate authorities, including:
[Let's Encrypt](configuration/acme/README.md), [HashiCorp Vault](configuration/vault.md),
[Venafi](configuration/venafi.md) and [private PKI](configuration/ca.md).


![High level overview diagram explaining cert-manager architecture](/images/high-level-overview.svg)

This website provides the full technical documentation for the project, and can be
used as a reference; if you feel that there's anything missing, please let us know
or [raise a PR](https://github.com/cert-manager/website/pulls) to add it.
