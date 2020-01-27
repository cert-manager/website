---
title: Preflight
image: /img/jpg/preflight.jpg
weight: 3
getting_started: https://blog.jetstack.io/blog/introducing-preflight/
github: https://github.com/jetstack/preflight
---

Preflight performs automatic configuration checks in a Kubernetes cluster.

Preflight packages use Open Policy Agent and its REGO language to define the policy that is going to be checked.

The tools is designed to be completely pluggable and can be used in a variety of scenarios from checking arbitrary Kubernetes workloads to making sure your GKE clusters are configured according to a certain policy.
