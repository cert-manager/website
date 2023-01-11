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
supports this resource, but not the cert-manager CertificateRequest resource,
and they still wish for certificates to be signed through cert-manager.

CertificateSigningRequests reference a `SignerName` or signer as the entity it
wishes to sign its request from. For cert-manager, a signer can be mapped to
either an [Issuer or ClusterIssuer](../configuration/README.md).

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

> Note: cert-manager supports signing CertificateSigningRequests
> using all [internal Issuers](../configuration/README.md).

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

Requester annotations:

- `experimental.cert-manager.io/request-duration`: **Set by the requester**. Accepts
    a [Go time duration](https://golang.org/pkg/time/#ParseDuration) string
    specifying the requested certificate duration. Defaults to 90 days. Some
    signers such as Venafi or ACME typically _do not_ allow requesting a
    duration.

- `experimental.cert-manager.io/request-is-ca`: **Set by the requester**. If set to
    `"true"`, will request for a CA certificate.

- `experimental.cert-manager.io/private-key-secret-name`: **Set by the
    requester**. Required only for the SelfSigned signer. Used to reference a
    Secret which contains the PEM encoded private key of the requester's X.509
    certificate signing request at key `tls.key`. Used to sign the requester's
    request.

- `venafi.experimental.cert-manager.io/custom-fields`: **Set by the
    requester**. Optional for only the Venafi signer. Used for adding custom
    fields to the Venafi request. This will only work with Venafi TPP `v19.3`
    and higher. The value is a JSON array with objects containing the name and
    value keys, for example:
    ```
    venafi.experimental.cert-manager.io/custom-fields: |-
      [
        {"name": "field-name", "value": "field value"},
        {"name": "field-name-2", "value": "field value 2"}
      ]
    ```

Signer annotations:

- `venafi.experimental.cert-manager.io/pickup-id`: **Set by the signer**. Only
    used for the Venafi signer. Used to record the Venafi Pickup ID of a
    certificate signing request that has been submitted to the Venafi API for
    collection during issuance.

## Usage

CertificateSigningRequests can be manually created using
[cmctl](./cmctl.md#experimental).
This command takes a manifest file containing a
[Certificate](../usage/certificate.md) resource as input. This generates a
private key and creates a CertificateSigningRequest. CertificateSigningRequests
are not approved by default, so you will likely need to approve it manually:

```bash
$ kubectl certificate approve <name>
```