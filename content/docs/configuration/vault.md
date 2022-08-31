---
title: Vault
description: 'cert-manager configuration: Vault Issuers'
---

The `Vault` `Issuer` represents the certificate authority
[Vault](https://www.vaultproject.io/) - a multi-purpose secret store that can be
used to sign certificates for your Public Key Infrastructure (PKI). Vault is an
external project to cert-manager and as such, this guide will assume it has been
configured and deployed correctly, ready for signing. You can read more on how
to configure Vault as a certificate authority
[here](https://www.vaultproject.io/docs/secrets/pki/).

This `Issuer` type is typically used when Vault is already being used within
your infrastructure, or you would like to make use of its feature set where the
CA issuer alone cannot provide.

## Deployment

All Vault issuers share common configuration for requesting certificates,
namely the server, path, and CA bundle:

- Server is the URL whereby Vault is reachable.
- Path is the Vault path that will be used for signing. Note that the path
  *must* use the `sign` endpoint.
- CA bundle denotes an optional field containing a base64 encoded string of the
  Certificate Authority to trust the Vault connection. This is typically
  _always_ required when using an `https` URL.

Below is an example of a configuration to connect a Vault server.

> **Warning**: This configuration is incomplete as no authentication methods have
> been added.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: vault-issuer
  namespace: sandbox
spec:
  vault:
    path: pki_int/sign/example-dot-com
    server: https://vault.local
    caBundle: <base64 encoded CA Bundle PEM file>
    auth:
      ...
```

## Authenticating

In order to request signing of certificates by Vault, the issuer must be able to
properly authenticate against it. cert-manager provides multiple approaches to
authenticating to Vault which are detailed below.

### Authenticating via an AppRole

An [AppRole](https://www.vaultproject.io/docs/auth/approle.html) is a method of
authenticating to Vault through use of its internal role policy system. This
authentication method requires that the issuer has possession of the `SecretID`
secret key, the `RoleID` of the role to assume, and the app role path. Firstly,
the secret ID key must be stored within a Kubernetes `Secret` that resides in the
same namespace as the `Issuer`, or otherwise inside the `Cluster Resource
Namespace` in the case of a `ClusterIssuer`.

```yaml
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: cert-manager-vault-approle
  namespace: sandbox
data:
  secretId: "MDI..."
```

Once the `Secret` has been created, the `Issuer` is ready to be deployed which
references this `Secret`, as well as the data key of the field that stores the
secret ID.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: vault-issuer
  namespace: sandbox
spec:
  vault:
    path: pki_int/sign/example-dot-com
    server: https://vault.local
    caBundle: <base64 encoded caBundle PEM file>
    auth:
      appRole:
        path: approle
        roleId: "291b9d21-8ff5-..."
        secretRef:
          name: cert-manager-vault-approle
          key: secretId
```

### Authenticating with a Token

This method of authentication uses a token string that has been generated from
one of the many authentication backends that Vault supports. These tokens have
an expiry and so need to be periodically refreshed. You can read more on Vault
tokens [here](https://www.vaultproject.io/docs/concepts/tokens.html).

> **Note**: cert-manager does not refresh these token automatically and so another
> process must be put in place to do this.

Firstly, the token is be stored inside a Kubernetes `Secret` inside the same
namespace as the `Issuer` or otherwise in the `Cluster Resource Namespace` in
the case of using a `ClusterIssuer`.

```yaml
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: cert-manager-vault-token
  namespace: sandbox
data:
  token: "MjI..."
```

Once submitted, the Vault issuer is able to be created using token
authentication by referencing this `Secret` along with the key of the field the
token data is stored at.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: vault-issuer
  namespace: sandbox
spec:
  vault:
    path: pki_int/sign/example-dot-com
    server: https://vault.local
    caBundle: <base64 encoded caBundle PEM file>
    auth:
      tokenSecretRef:
          name: cert-manager-vault-token
          key: token
```

### Authenticating with Kubernetes Service Accounts

Vault can be configured so that applications can authenticate using Kubernetes
[`Service Account
Tokens`](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin).
You find documentation on how to configure Vault to authenticate using Service
Account Tokens [here](https://www.vaultproject.io/docs/auth/kubernetes.html).

For the Vault issuer to use this authentication, cert-manager must get access to
the token that is stored in a Kubernetes `Secret`. Kubernetes Service Account
Tokens are already stored in `Secret` resources however, you must ensure that
it is present in the same namespace as the `Issuer`, or otherwise in the
`Cluster Resource Namespace` in the case of using a `ClusterIssuer`.

> **Note**: In Kubernetes 1.24 onwards, the token secret is no longer created
> by default for the Service Account. In this case you need to manually create
> the secret resource. See [this guide](https://kubernetes.io/docs/concepts/configuration/secret/#service-account-token-secrets)
> for more details.

This authentication method also expects a `role` field which is the Vault role
that the Service Account is to assume, as well as an optional `mountPath` field which
is the authentication mount path, defaulting to `kubernetes`.

#### Kubernetes version less than 1.24

The following example will be making use of the Service Account
`my-service-account`. The secret data field key will be `token` if the `Secret`
has been created by Kubernetes. The Vault role used is `my-app-1`, using the
default mount path of `/v1/auth/kubernetes`

1) Create the Service Account:

    ```shell
    kubectl create serviceaccount -n sandbox vault-issuer
    ```

1) Get the auto-generated Secret name:

    ```shell
    kubectl get secret -o json | jq -r '.items[] | select(.metadata.annotations["kubernetes.io/service-account.name"] == "vault-issuer") | .metadata.name'
    ```

1) Create the Issuer using that Secret name retrieved from the previous step:

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: vault-issuer
      namespace: sandbox
    spec:
      vault:
        path: pki_int/sign/example-dot-com
        server: https://vault.local
        caBundle: <base64 encoded caBundle PEM file>
        auth:
          kubernetes:
            role: my-app-1
            mountPath: /v1/auth/kubernetes
            secretRef:
              name: <auto-generated secret name>
              key: token
    ```

#### Kubernetes version 1.24 and greater

This example is almost the same as above but adjusted for the change in
Kubernetes 1.24 and above.

1) Create the Service Account:

    ```shell
    kubectl create serviceaccount -n sandbox vault-issuer
    ```

1) Create the Secret resource for Kubernetes to populate the `token` value:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: vault-issuer-token
      annotations:
        kubernetes.io/service-account.name: "vault-issuer"
    type: kubernetes.io/service-account-token
    data: {}
    ```

1) Create the Issuer resource referencing the Secret resource:
  
    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: vault-issuer
      namespace: sandbox
    spec:
      vault:
        path: pki_int/sign/example-dot-com
        server: https://vault.local
        caBundle: <base64 encoded caBundle PEM file>
        auth:
          kubernetes:
            role: my-app-1
            mountPath: /v1/auth/kubernetes
            secretRef:
              name: vault-issuer-token
              key: token
    ```

## Verifying the issuer Deployment

Once the Vault issuer has been deployed, it will be marked as ready if the
configuration is valid. Replace `issuers` here with `clusterissuers` if that is what has
been deployed.

```bash
$ kubectl get issuers vault-issuer -n sandbox -o wide
NAME          READY   STATUS          AGE
vault-issuer  True    Vault verified  2m
```

Certificates are now ready to be requested by using the Vault issuer named
`vault-issuer` within the `sandbox` namespace.