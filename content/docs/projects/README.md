---
title: Projects
description: 'Satellite projects of cert-manager'
---

The cert-manager project has a number of [satellite
projects](https://github.com/cert-manager) that extend the project's
functionality, and complement the core cert-manager feature-set.

These tools help with security, compliance and control.

- [Apply Policy to cert-manager Certificates](./approver-policy.md):
  [approver-policy](https://github.com/cert-manager/policy-approver) is a
  cert-manager
  [approver](https://cert-manager.io/docs/concepts/certificaterequest/#approval)
  that will approve or deny CertificateRequests based on CRD defined policies.
- [Distributing Trust Bundles in Kubernetes](./trust.md): Using the trust
    operator to distribute trust bundles, like CA certificates, across a
    Kubernetes cluster.
- [Secure Istio mesh with cert-manager](./istio-csr.md): istio-csr is an agent
  that allows for [Istio](https://istio.io) workload and control plane
  components to be secured using [cert-manager](https://cert-manager.io).
