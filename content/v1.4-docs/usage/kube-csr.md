---
title: Kubernetes CertificateSigningRequests
description: 'cert-manager usage: Kubernetes CertificateSigningRequest resources'
---

Kubernetes has an in-built
[CertificateSigningRequest](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/)
resource. This resource is similar to the cert-manager
[CertificateRequest](../concepts/certificaterequest.md) in that it is used to
request an X.509 signed certificate from a referenced Certificate Authority
(CA).

Using this resource may be useful for users who are using an application that
supports this resource, and not the cert-manager CertificateRequest resource,
but they still wish for certificates to be signed through cert-manager.

#### Feature State

This feature is currently in an _experimental_ state, and its behavior is
subject to change in further releases.

<div className="warning">

⛔️ This feature is only enabled by adding it to the `--feature-gates` flag on
the cert-manager controller:

```bash
--feature-gates=ExperimentalCertificateSigningRequestControllers=true
```

Which can be added using Helm:

```bash
$ helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set featureGates="ExperimentalCertificateSigningRequestControllers=true" \
  # --set installCRDs=true
```

> Note: cert-manager currently only supports signing CertificateSigningRequests
> using the [CA issuer](../configuration/ca.md).

> Note: cert-manager _does not_ automatically approve CertificateSigningRequests
> that reference a cert-manager [Issuer](../configuration/README.md). Please refer to
> the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
> for the request process of CertificateSigningRequests.


</div>


## Signer Name

CertificateSigningRequests contain a
[`spec.signerName`](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
field to reference a CA to sign the request. cert-manager Issuers or
ClusterIssuers are referenced in the following form:

```
<resource type>.cert-manager.io/<signer namespace (if namespaced)>.<signer name>
```

For example, a namespaced Issuer in the namespace `sandbox` with the name
`my-issuer` would be referenced via:

```yaml
    signerName: issuers.cert-manager.io/sandbox.my-issuer
```

A ClusterIssuer with the name `my-cluster-issuer` would be referenced via:

```yaml
    signerName: clusterissuers.cert-manager.io/my-cluster-issuer
```

### Referencing Namespaced Issuers

Unlike CertificateRequests, CertificateSigningRequests are cluster scoped
resources. To prevent users from requesting certificates from a namespaced
Issuer in a namespace that they otherwise would not have access to, cert-manager
performs a
[SubjectAccessReview](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#checking-api-access).
This review ensures that the requesting user has the permission to `reference`
the `signers` resource in the given namespace. The name should be either the
name of the Issuer, or `"*"` to reference all Issuers in that namespace.

An example Role to give permissions to reference Issuers in the `sandbox`
namespace would look like the following:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: cert-manager-referencer:my-issuer
  namespace: sandbox
rules:
- apiGroups: ["cert-manager.io"]
  resources: ["signers"]
  verbs:     ["reference"]
  resourceNames:
  - "my-issuer" # To give permission to _only_ reference Issuers with the name 'my-issuer'
  - "*" # To give permission to reference Issuers with any name in this namespace
```

## Annotations

To keep feature parity with CertificateRequests, annotations are used to store
values that do not exist as `spec` or `status` fields on the
CertificateSigningRequest resource. These fields are either set by the
_requester_ or by the _signer_ as labelled below.

- `experimental.cert-manager.io/request-duration`: **Set by the requester**. Accepts
    a [Go time duration](https://golang.org/pkg/time/#ParseDuration) string
    specifying the requested certificate duration. Defaults to 90 days.

- `experimental.cert-manager.io/request-is-ca`: **Set by the requester**. If set to
    `"true"`, will request for a CA certificate.

- `experimental.cert-manager.io/ca`: **Set by the signer**. Once signed, the
    signer will populate this annotation with the base 64 encode CA certificate
    of the signing chain.