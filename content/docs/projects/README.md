---
title: Projects
description: 'Satellite projects of cert-manager'
---

The cert-manager project has a number of [satellite
projects](https://github.com/cert-manager) that extend the project's
functionality, and complement the core cert-manager feature-set.

These tools help with security, compliance and control.

- [istio-csr](./istio-csr.md): Secure istio service mesh with istio-csr which is
  an agent that allows for [Istio](https://istio.io) workload and control plane
  components to be secured using cert-manager.
- [approver-policy](./approver-policy.md):
  a cert-manager **approver** that will automatically approve or deny
  certificate requests based on defined policy.
- [trust](./trust.md): an
  operator to distribute trust bundles, like CA certificates, across a
  Kubernetes cluster.
