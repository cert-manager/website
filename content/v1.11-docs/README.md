---
title: cert-manager
description: cert-manager documentation homepage
---

cert-manager adds certificates and certificate issuers as resource types in
Kubernetes clusters, and simplifies the process of obtaining, renewing and
using those certificates.

It can issue certificates from a variety of supported sources, including
[Let's Encrypt](https://letsencrypt.org), [HashiCorp Vault](https://www.vaultproject.io),
and [Venafi](https://www.venafi.com/) as well as private PKI.

It will ensure certificates are valid and up to date, and attempt to
renew certificates at a configured time before expiry.

It is loosely based upon the work of
[kube-lego](https://github.com/jetstack/kube-lego) and has borrowed some
wisdom from other similar projects such as
[kube-cert-manager](https://github.com/PalmStoneGames/kube-cert-manager).

![High level overview diagram explaining cert-manager architecture](/images/high-level-overview.svg)

This website provides the full technical documentation for the project, and can be
used as a reference; if you feel that there's anything missing, please let us know
or [raise a PR](https://github.com/cert-manager/website/pulls) to add it.
