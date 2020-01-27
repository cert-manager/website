---
title: Kube-Lego
image: /img/jpg/open-source-kube.jpg
weight: 6
getting_started: https://github.com/jetstack/kube-lego#usage
github: https://github.com/jetstack/kube-lego
---

Kube-Lego is an open source project, started by Jetstack, for automating Let’s Encrypt TLS-enabled web services running in Kubernetes. Kube-Lego automates the process in Kubernetes by watching ingress resources and automatically requesting missing or expired TLS certificates from Let’s Encrypt.

* Negotiates with an ACME server to obtain certificates for Ingress
* Performs domain validations via ACME HTTP-01
* Automates renewal process
