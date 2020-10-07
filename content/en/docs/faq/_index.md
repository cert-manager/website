---
title: "FAQ"
linkTitle: "FAQ"
weight: 60
type: "docs"
---

Below is an aggregation of solutions to some issues that cert-manager users may
face:


- [Troubleshooting issuing ACME certificates](./acme/)
- [How to change the Cluster Resource Namespace](./cluster-resource/)
- [How to sync secrets across namespaces](./kubed/)
- [Failing to create resources due to Webhook](./webhook/)

## Miscellaneous

### Kubernetes has a builtin `CertificateSigningRequest` API. Why not use that?

Kubernetes has a [Certificate Signing Requests API],
and a [`kubectl certificates` command] which allows you to approve certificate signing requests
and have them signed by the certificate authority (CA) of the Kubernetes cluster.

This API and CLI have occasionally been misused to sign certificates for use by non-control-plane Pods but this is a mistake.
For the security of the Kubernetes cluster, it is important to limit access to the Kubernetes certificate authority,
and it is important that you do not use that certificate authority to sign certificates which are used outside of the control-plane,
because such certificates increase the opportunity for attacks on the Kubernetes API server.

In Kubernetes 1.19 the [Certificate Signing Requests API] has reached V1
and it can be used more generally by following (or automating) the [Request Signing Process].
There are plans for cert-manager make greater use of this API now that it is stable.

[Certificate Signing Requests API]: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#certificatesigningrequest-v1-certificates-k8s-io
[`kubectl certificates` command]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#certificate
[Request signing process]: https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process
