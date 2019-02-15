---
title: "cert-manager: native certificate management for Kubernetes"
person: James Munnelly
event: Kubecon Europe 2018
slides_link: https://docs.google.com/presentation/d/1Zg1LnkBNAql373vSh8zZBUvgpD2Qsfp_oJ1X8zVV4tk/edit#slide=id.g221fc420d8_0_61
video_link: https://www.youtube.com/watch?v=TuIycZeiNZM&feature=youtu.be
date: 2018-05-03
---

cert-manager is a new project, built to replace kube-lego and make x509 certificates first class citizens in Kubernetes. Using custom resource definitions to introduce the concept of Issuers into a cluster, end-users can request signed TLS certificates from an ACME server (e.g. Let’s Encrypt), a signing key pair, Hashicorp Vault, or your organisations custom CA through its extensible design.

This talk presents cert-manager and demonstrates its new features over its predecessor, and specifically our approach to migrate thousands of users from kube-lego to the new custom resource backed system, without hindering future cert-manager functionality or effecting production users. At the end, we’ll go over the roadmap and future plans for the project, as well as how you can get involved!