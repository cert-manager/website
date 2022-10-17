---
title: Projects
description: 'Satellite projects of cert-manager'
---

The cert-manager project has a number of [satellite
projects](https://github.com/cert-manager) that extend the project's
functionality, and complement the core cert-manager feature-set.

These tools help with security, compliance and control.

- [istio-csr](./istio-csr.md): Secure Istio service mesh with istio-csr which is
  an agent that allows for [Istio](https://istio.io) workload and control plane
  components to be secured using cert-manager.
- [approver-policy](./approver-policy.md):
  a cert-manager **approver** that will automatically approve or deny
  certificate requests based on defined policy.
- [csi-driver](./csi-driver.md):
  a Container Storage Interface (CSI) driver plugin for Kubernetes to work along
  cert-manager. The goal for this plugin is to seamlessly request and mount
  certificate key pairs to pods. This is useful for facilitating mTLS, or
  otherwise securing connections of pods with guaranteed present certificates
  whilst having all of the features that cert-manager provides.
- [csi-driver-spiffe](./csi-driver-spiffe.md):
  another CSI driver plugin to work along cert-manager. This CSI driver
  transparently delivers [SPIFFE](https://spiffe.io/)
  [SVIDs](https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/#spiffe-verifiable-identity-document-svid)
  in the form of X.509 certificate key pairs to mounting Kubernetes Pods. The
  end result is all and any Pod running in Kubernetes can securely request their
  SPIFFE identity document from a Trust Domain with minimal configuration.
- [trust](./trust.md): an
  operator to distribute trust bundles, like CA certificates, across a
  Kubernetes cluster.
