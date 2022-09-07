---
title: cert-manager
description: |
    cert-manager creates signed TLS / SSL certificates for workloads in your Kubernetes or OpenShift cluster
    and renews the certificates before they expire.
---

cert-manager creates signed TLS / SSL certificates for workloads in your Kubernetes or OpenShift cluster
and renews the certificates before they expire.
Typically, the private key and signed certificate are stored in Kubernetes secrets
and used by applications or ingress controllers.

cert-manager can obtain the signed certificates from a variety of certificate authorities, including:
[Let's Encrypt](configuration/acme/), [HashiCorp Vault](configuration/vault/),
[Venafi](configuration/venafi/) and [private PKI](configuration/ca/).


![High level overview diagram explaining cert-manager architecture](/images/high-level-overview.svg)

This website provides the full technical documentation for the project, and can be
used as a reference; if you feel that there's anything missing, please let us know
or [raise a PR](https://github.com/cert-manager/website/pulls) to add it.
