---
title: Cert-Manager
image: /img/jpg/certm.jpg
weight: 3
getting_started: http://docs.cert-manager.io
github: https://github.com/jetstack/cert-manager
---

Cert-Manager is a powerful, general-purpose certificate management controller for Kubernetes. It will obtain certificates, from a variety of Issuers, and ensure these are valid and up-to-date, attempting to renew certificates at a configured time before expiry.

A major use-case is the automated issuance and renewal of Let's Encrypt certificates for Ingress, as a drop-in replacement for Kube-Lego. However, there are also additional Issuers, including a simple signing keypair, with more in development.