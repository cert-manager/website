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

## Certificates

### Can I trigger a renewal from cert-manager at will?

This is a feature in cert-manager starting in `v0.16` using the kubectl plugin. More information can be found on [the renew command's page](../usage/kubectl-plugin/#renew)

### How can I see all the historic events related to a certificate object ?

cert-manager publishes all events to the Kubernetes events mechanism, you can get the events for your specific resources using `kubectl describe <resource> <name>`.
Due to the nature of the Kubernetes event mechanism these will be purged after a while. If you're using a dedicated logging system it might be able or is already also storing Kubernetes events.

### What happens if a renewal is doesn't happen due to issues? Will it be tried again after sometime?

cert-manager makes use of exponential back off to retry non-fatal failures (ones that didn't mark the `CertificateRequest` as failed). If the `CertificateRequest` was marked as failed, issuance will be re-tried in 1 hour.

### Is ECC (elliptic-curve cryptography) supported?

cert-manager supports ECDSA key pairs! You can set your certificate to use ECDSA  in the `privateKey` part of your Certificate resource.
For example:
```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ecdsa
spec:
  secretName: ecdsa-cert
  isCA: false
  privateKey:
    algorithm: ECDSA
    size: 256
  dnsNames:
    - ecdsa.example.com
  issuerRef:
    [...]
```

### If `renewBefore` or `duration` is not defined, what will be the default value?
Default `duration` is [90 days](https://github.com/jetstack/cert-manager/blob/v1.2.0/pkg/apis/certmanager/v1/const.go#L26). If `renewBefore` has not been set, `Certificate` will be renewed 2/3 through its _actual_ duration.

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

cert-manager currently has some [limited experimental support] for this resource.

[Certificate Signing Requests API]: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#certificatesigningrequest-v1-certificates-k8s-io
[`kubectl certificates` command]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#certificate
[Request signing process]: https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process
[limited experimental support]: ../usage/kube-csr/
