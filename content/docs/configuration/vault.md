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

<a id="authenticating-with-kubernetes-service-accounts"></a>

### Authenticating with Kubernetes Service Accounts

The [Vault Kubernetes
Auth](https://developer.hashicorp.com/vault/docs/auth/kubernetes) allows
cert-manager to authenticate to Vault using a Kubernetes Service Account Token
in order to issue certificates using Vault as a certification authority. The
Kubernetes service account token can be provided in two ways:

- [Secretless Authentication with a Service Account](#secretless-authentication-with-a-service-account) (recommended),
- [Authentication with a Static Service Account Token](#static-service-account-token).

#### Secretless Authentication with a Service Account

ℹ️ This feature is available in cert-manager >= v1.12.0.

With the secretless authentication with a service account, cert-manager creates
an ephemeral service account token using the TokenRequest API and uses it to
authenticate with Vault. These tokens are short-lived (10 minutes) and are
never stored to disk.

This is the recommended authentication method because it does not rely on the
deprecated static service account tokens. The static service account tokens pose
a threat due to their infinite lifetime. Static service account tokens have been
disabled by default on Kubernetes 1.24.

The first step is to create a `ServiceAccount` resource:

```sh
kubectl create serviceaccount -n sandbox vault-issuer
```

Then add an RBAC Role so that cert-manager can get tokens for the
ServiceAccount:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: vault-issuer
  namespace: sandbox
rules:
  - apiGroups: ['']
    resources: ['serviceaccounts/token']
    resourceNames: ['vault-issuer']
    verbs: ['create']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: vault-issuer
  namespace: sandbox
subjects:
  - kind: ServiceAccount
    name: cert-manager
    namespace: cert-manager
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: vault-issuer
```

Finally, create the Issuer resource:

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
    auth:
      kubernetes:
        role: my-app-1
        mountPath: /v1/auth/kubernetes
        serviceAccountRef:
          name: vault-issuer
```

> **Issuer vs. ClusterIssuer:** With an Issuer resource, you can only refer to a
> service account located in the same namespace as the Issuer. With a
> ClusterIssuer, the service account must be located in the namespace that is
> configured by the flag `--cluster-resource-namespace`.

To create the role in Vault, you can use the following command:

```bash
vault write auth/kubernetes/role/vault-issuer \
    bound_service_account_names=vault-issuer \
    bound_service_account_namespaces=sandbox \
    audience="vault://sandbox/vault-issuer" \
    policies=vault-issuer \
    ttl=1m
```

It is recommended to use a different Vault role each per Issuer or
ClusterIssuer. The `audience` allows you to restrict the Vault role to a single
Issuer or ClusterIssuer. The syntax is the following:

```yaml
"vault://<namespace>/<issuer-name>"   # For an Issuer.
"vault://<cluster-issuer-name>"       # For a ClusterIssuer.
```

The expiration duration for the Kubernetes tokens that are requested is
hard-coded to 10 minutes (that's the minimum accepted). The `ttl` field can be
as short as possible, since cert-manager requests a new token every time it
needs to talks to Vault.

Although it is not recommended, you can also use the same Vault role for all of
your Issuers and ClusterIssuers by omitting the `audience` field and re-using
the same service account.
<a name="static-service-account-token"></a>

#### Authentication with a Static Service Account Token

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
configuration is valid. Replace `issuers` below with `clusterissuers` if that is what has
been deployed.

The Vault issuer tests your Vault instance by querying the `v1/sys/health`
endpoint, to ensure your Vault instance is unsealed and initialized before
requesting certificates. The result of that query will populate the `STATUS`
column.

```bash
$ kubectl get issuers vault-issuer -n sandbox -o wide
NAME          READY   STATUS          AGE
vault-issuer  True    Vault verified  2m
```

Certificates are now ready to be requested by using the Vault issuer named
`vault-issuer` within the `sandbox` namespace.
