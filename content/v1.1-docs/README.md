---
title: Welcome to cert-manager
description: cert-manager documentation
---

cert-manager is a native [Kubernetes](https://kubernetes.io) certificate
management controller. It can help with issuing certificates from a
variety of sources, such as [Let's Encrypt](https://letsencrypt.org),
[HashiCorp Vault](https://www.vaultproject.io),
[Venafi](https://www.venafi.com/), a simple signing key pair, or self
signed.

It will ensure certificates are valid and up to date, and attempt to
renew certificates at a configured time before expiry.

It is loosely based upon the work of
[kube-lego](https://github.com/jetstack/kube-lego) and has borrowed some
wisdom from other similar projects such as
[kube-cert-manager](https://github.com/PalmStoneGames/kube-cert-manager).

![High level overview diagram explaining cert-manager architecture](/images/high-level-overview.svg)

This is the full technical documentation for the project, and should be
used as a source of references when seeking help with the project.