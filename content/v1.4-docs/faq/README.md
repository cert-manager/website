---
title: FAQ
description: 'cert-manager FAQ: Overview / General Questions'
---

Below is an aggregation of solutions to some issues that cert-manager users may
face:

- [TLS Terminology, including commonly misused terms](./terminology.md)
- [Troubleshooting issuing ACME certificates](./acme.md)
- [How to change the Cluster Resource Namespace](./cluster-resource.md)
- [How to sync secrets across namespaces](./kubed.md)
- [Failing to create resources due to Webhook](./webhook.md)

## Certificates

### Can I trigger a renewal from cert-manager at will?

This is a feature in cert-manager starting in `v0.16` using the kubectl plugin. More information can be found on [the renew command's page](../usage/kubectl-plugin.md#renew)

### Why isn't my root certificate in my issued Secret's `tls.crt`?

Occasionally, people work with systems which have made a flawed choice regarding TLS chains. The [TLS spec](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.2)
has the following section for the "Server Certificate" section of the TLS handshake:

> This is a sequence (chain) of certificates.  The sender's
> certificate MUST come first in the list.  Each following
> certificate MUST directly certify the one preceding it.  Because
> certificate validation requires that root keys be distributed
> independently, the self-signed certificate that specifies the root
> certificate authority MAY be omitted from the chain, under the
> assumption that the remote end must already possess it in order to
> validate it in any case.

In a standard, secure and correctly configured TLS environment, adding a root certificate to the chain is
almost always unnecessary and wasteful.

There are two ways that a certificate can be trusted:

- explicitly, by including it in a trust store.
- through a signature, by following the certificate's chain back up to an explicitly trusted certificate.

Crucially, root certificates are by definition self-signed and they cannot be validated through a signature.

As such, if we have a client trying to validate the certificate chain sent by the server, the client must already have the
root before the connection is started. If the client already has the root, there was no point in it being sent by the server!

The same logic with not sending root certificates applies for servers trying to validate client certificates;
the [same justification](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.6) is given in the TLS RFC.

### How can I see all the historic events related to a certificate object?

cert-manager publishes all events to the Kubernetes events mechanism, you can get the events for your specific resources using `kubectl describe <resource> <name>`.

Due to the nature of the Kubernetes event mechanism these will be purged after a while. If you're using a dedicated logging system it might be able or is already also storing Kubernetes events.

### What happens if a renewal doesn't happen? Will it be tried again after some time?

cert-manager will retry renewal if it encounters temporary failures. It uses an exponential backoff algorithm to calculate the delay between each retry.

A temporary failure is one that doesn't mark the `CertificateRequest` as failed. If the `CertificateRequest` is marked as failed, issuance will be re-tried in 1 hour.

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
[limited experimental support]: ../usage/kube-csr.md