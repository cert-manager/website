---
title: Alternative installation methods
description: 'cert-manager installation: Other tools'
---

### kubeprod

[Bitnami Kubernetes Production
Runtime](https://github.com/bitnami/kube-prod-runtime) (`BKPR`, `kubeprod`) is a
curated collection of the services you would need to deploy on top of your
Kubernetes cluster to enable logging, monitoring, certificate management,
automatic discovery of Kubernetes resources via public DNS servers and other
common infrastructure needs.

It depends on `cert-manager` for certificate management, and it is [regularly
tested](https://github.com/bitnami/kube-prod-runtime/blob/master/Jenkinsfile) so
the components are known to work together for GKE, AKS, and EKS clusters. For
its ingress stack it creates a DNS entry in the configured DNS zone and requests
a TLS certificate from the Let's Encrypt staging server.

BKPR can be deployed using the `kubeprod install` command, which will deploy
`cert-manager` as part of it. Details available in the [BKPR installation
guide](https://github.com/bitnami/kube-prod-runtime/blob/master/docs/install.md).