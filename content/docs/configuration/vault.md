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

### Accessing a Vault Server with mTLS enforced

In certain use cases, the [Vault Server could be configured to enforce clients to present a
client certificates](https://developer.hashicorp.com/vault/docs/configuration/listener/tcp#tls_require_and_verify_client_cert), those client certificates are just a transport layer enforcement, 
it does not provide any authentication and authorization mechanism to the Vault APIs itself. 

> 📖 Read about [configuring the Vault server TCP listener](https://developer.hashicorp.com/vault/docs/configuration/listener/tcp).

Please follow the steps below to configure Vault with mTLS enforced:
- Generate the bundle CA and the server TLS certificate:
```shell
step certificate create "Example Server Root CA" server_ca.crt server_ca.key \
  --profile root-ca \
  --not-after=87600h \
  --no-password \
  --insecure
   

step certificate create vault.vault server.crt server.key \
  --profile leaf \
  --not-after=8760h \
  --ca ./server_ca.crt \
  --ca-key server_ca.key \
  --no-password \
  --insecure
```
- Generate Vault client certificate and CA: 
```shell
step certificate create "Example Client Root CA" client_ca.crt client_ca.key \
  --profile root-ca \
  --not-after=87600h \
  --no-password \
  --insecure 

step certificate create client.vault client.crt client.key \
  --profile leaf \
  --not-after=8760h \
  --ca ./client_ca.crt \
  --ca-key client_ca.key \
  --no-password \
  --insecure
```
- Prepare the Vault installation, assuming you would be installing Vault in the Kubernetes cluster using the [official Helm chart](https://github.com/hashicorp/vault-helm):
  - Create the Vault namespace
```shell
kubectl create ns vault
```
  - Create a Kubernetes Secret in the same namespace where Vault will be installed and add the generated PKI files as following:
```shell
kubectl create secret generic vault-tls \
  --namespace vault \
  --from-file=server.key \
  --from-file=server.crt \
  --from-file=client_ca.crt \
  --from-file=client.crt \
  --from-file=client.key
```
  - Deploy Vault using the following values file:
  
  > ⚠️ These settings are designed for quick local testing only. They are insecure and not suitable for production use. 
```yaml
# vault-values.yaml
global:
   tlsDisable: false
injector:
  enabled: false
server:
  dataStorage:
    enabled: false
  standalone:
    enabled: true
    config: |
      listener "tcp" {
        address = "[::]:8200"
        cluster_address = "[::]:8201"
        tls_disable = false
        tls_client_ca_file = "/vault/tls/client_ca.crt"
        tls_cert_file = "/vault/tls/server.crt"
        tls_key_file = "/vault/tls/server.key"
        tls_require_and_verify_client_cert = true
      }
  extraArgs: "-dev-tls -dev-listen-address=[::]:8202"
  extraEnvironmentVars:
    VAULT_TLSCERT: /vault/tls/server.crt
    VAULT_TLSKEY: /vault/tls/server.key
    VAULT_CLIENT_CERT: /vault/tls/client.crt
    VAULT_CLIENT_KEY: /vault/tls/client.key
  volumes:
    - name: vault-tls
      secret:
        defaultMode: 420
        secretName: vault-tls
  volumeMounts:
    - mountPath: /vault/tls
      name: vault-tls
      readOnly: true
```

```shell
helm upgrade vault hashicorp/vault --install --namespace vault --create-namespace --values vault-values.yaml
```

- Configure Vault server for Kubernetes auth
```shell
kubectl -n vault exec pods/vault-0  -- \
        vault auth enable --tls-skip-verify kubernetes

kubectl -n vault exec pods/vault-0  -- \
        vault write --tls-skip-verify \
        auth/kubernetes/role/vault-issuer \
        bound_service_account_names=vault-issuer \
        bound_service_account_namespaces=application-1 \
        audience="vault://application-1/vault-issuer" \
        policies=vault-issuer \
        ttl=1m

kubectl -n vault exec pods/vault-0 -- \
        vault write --tls-skip-verify \
        auth/kubernetes/config \
        kubernetes_host=https://kubernetes.default
```
- Create application namespace
```shell
kubectl create ns application-1
```
- Create Service account
```shell
kubectl create serviceaccount -n application-1 vault-issuer
```
- Create Role and Binding
```yaml
# rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: vault-issuer
  namespace: application-1
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
  namespace: application-1
subjects:
  - kind: ServiceAccount
    name: cert-manager
    namespace: cert-manager
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: vault-issuer
```
```shell
kubectl apply -f rbac.yaml
```
- Create Vault client certificate secret
```shell
kubectl create secret generic vault-client-tls \
  --namespace application-1 \
  --from-file=client.crt \
  --from-file=client.key \
  --from-file=server_ca.crt
```
- Create Issuer
```yaml
# vault-issuer.yaml 
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: vault-issuer
  namespace: application-1
spec:
  vault:
    path: pki_int/sign/application-1
    server: https://vault.vault:8200
    caBundleSecretRef:
      key: server_ca.crt
      name: vault-client-tls  
    clientCertSecretRef:
      name: vault-client-tls
      key: client.crt
    clientKeySecretRef:
      name: vault-client-tls
      key: client.key
    auth:
      kubernetes:
        role: vault-issuer
        mountPath: /v1/auth/kubernetes
        serviceAccountRef:
          name: vault-issuer
```
```shell
kubectl apply -f vault-issuer.yaml
```
- Check Issuer status
```shell
kubectl describe issuer -n application-1
```

## Authenticating

In order to request signing of certificates by Vault, the issuer must be able to
properly authenticate against it. cert-manager provides multiple approaches to
authenticating to Vault which are detailed below.

| Vault auth type                                                          | cert-manager issuer configuration |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| [AppRole](https://developer.hashicorp.com/vault/docs/auth/approle)       | [A. Authenticating with a Vault AppRole](#a-authenticating-via-an-approle)   |
| [Token](https://developer.hashicorp.com/vault/docs/auth/token)           | [B. Authenticating with a Vault Token](#b-authenticating-with-a-token)       |
| [JWT/OIDC](https://developer.hashicorp.com/vault/docs/auth/jwt/oidc-providers/kubernetes) | [C. Authenticating with Kubernetes Service Accounts](#c-authenticating-with-kubernetes-service-accounts) > [Use JWT/OIDC Auth](#option-1-vault-authentication-method-use-jwtoidc-auth)              |
| [Kubernetes](https://developer.hashicorp.com/vault/docs/auth/kubernetes)                  | [C. Authenticating with Kubernetes Service Accounts](#c-authenticating-with-kubernetes-service-accounts) > [Use Kubernetes Auth](#option-2-vault-authentication-method-use-kubernetes-auth) |

### A. Authenticating via an AppRole

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

### B. Authenticating with a Token

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

### C. Authenticating with Kubernetes Service Accounts

ℹ️ This documentation works for cert-manager >= v1.12.0.

The [Vault JWT/OIDC Auth](https://developer.hashicorp.com/vault/docs/auth/jwt/oidc-providers/kubernetes) and the [Vault Kubernetes Auth](https://developer.hashicorp.com/vault/docs/auth/kubernetes) allow
cert-manager to authenticate to Vault using a Kubernetes Service Account Token
in order to issue certificates using Vault as a certification authority.

Vault Authentication Method:
- [Option 1. Use JWT/OIDC Auth](#option-1-vault-authentication-method-use-jwtoidc-auth)
- [Option 2. Use Kubernetes Auth](#option-2-vault-authentication-method-use-kubernetes-auth)

#### Option 1. Vault Authentication Method: Use JWT/OIDC Auth

The [JWT/OIDC auth method](https://developer.hashicorp.com/vault/docs/auth/jwt/oidc-providers/kubernetes) should be used instead of the [Kubernetes auth method](#option-2-vault-authentication-method-use-kubernetes-auth) when:
- Your Kubernetes' cluster OIDC discovery endpoint is reachable from the Vault server (this is likely not the case if you are running a self-hosted Kubernetes or OpenShift cluster).
- Your Vault server is not running inside the Kubernetes cluster.

> **Note:** By using the JWT auth instead of the Kubernetes auth, the revocation of tokens will no longer be checked:  
> *"Note: The JWT auth engine does not use Kubernetes' TokenReview API during authentication, and instead uses public key cryptography to verify the contents of JWTs. This means tokens that have been revoked by Kubernetes will still be considered valid by Vault until their expiry time. To mitigate this risk, use short TTLs for service account tokens or use Kubernetes auth which does use the TokenReview API."*  
> That's not a problem because cert-manager uses short-lived tokens that expire after 10 minutes.

The steps below will guide you through the configuration of the JWT auth method (based on [the Vault documentation](https://developer.hashicorp.com/vault/docs/auth/jwt/oidc-providers/kubernetes)) and how to use it with cert-manager.

To configure Vault's JWT auth, you will need to fetch the issuer URL.

```bash
ISSUER="$(kubectl get --raw /.well-known/openid-configuration | jq -r '.issuer')"
```

Check that the URL works and is accessible from the Vault server. For example, the response should look something like this:

```console
$ curl "$ISSUER/.well-known/openid-configuration"
{
  "issuer": "https://container.googleapis.com/v1/projects/project001/locations/europe-west1-b/clusters/cert-manager-cluster",
  "jwks_uri": "https://container.googleapis.com/v1/projects/project001/locations/europe-west1-b/clusters/cert-manager-cluster/jwks",
  ...
}

$ curl "<jwks_uri value>"
{
  "keys": [
    {
      "kty": "RSA",
      "e": "AQAB",
      "use": "sig",
      "kid": "key-id",
      "alg": "RS256",
      "n": "..."
    }
  ]
}
```

The next step is to configure the JWT auth in Vault. You will need to create one JWT auth path per Kubernetes cluster since each cluster has its own JSON Web Key Set and OIDC discovery endpoint.

```bash
vault auth enable -path=jwt-cluster001 jwt
kubectl config view --minify --flatten -ojson \
  | jq -r '.clusters[].cluster."certificate-authority-data"' \
  | base64 -d >/tmp/cacrt
vault write auth/jwt-cluster001/config \
    oidc_discovery_url="${ISSUER}" \
    oidc_discovery_ca_pem=@/tmp/cacrt
```

Then, create a Kubernetes Service Account and a matching Vault role:

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

Then, create the Vault role:

```bash
vault write auth/jwt-cluster001/role/vault-issuer-role \
   role_type="jwt" \
   bound_audiences="vault://sandbox/vault-issuer" \
   user_claim="sub" \
   bound_subject="system:serviceaccount:sandbox:vault-issuer" \
   policies="default" \
   ttl=1m
```

It is recommended to use a different Vault role each per Issuer or
ClusterIssuer. The `audience` allows you to restrict the Vault role to a single
Issuer or ClusterIssuer. The syntax is the following:

```yaml
"vault://<namespace>/<issuer-name>"   # For an Issuer.
"vault://<cluster-issuer-name>"       # For a ClusterIssuer.
```

Finally, you can create your Issuer:

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
        role: vault-issuer-role
        mountPath: /v1/auth/jwt-cluster001
        serviceAccountRef:
          name: vault-issuer
```

#### Option 2. Vault Authentication Method: Use Kubernetes Auth

The [Kubernetes auth method](https://developer.hashicorp.com/vault/docs/auth/kubernetes) should be used when:
- Your Vault server is running inside the Kubernetes cluster.
- Or, your Kubernetes' cluster OIDC discovery endpoint is not reachable from the Vault server, but Vault can reach the Kubernetes API server.

The steps below will guide you through the configuration of the Kubernetes auth method (based on [the Vault documentation](https://developer.hashicorp.com/vault/docs/auth/kubernetes)) and how to use it with cert-manager.

The Kubernetes auth method requires a `token_reviewer_jwt`, which is a JWT token that is used
by Vault to call the TokenReview API of the Kubernetes API server. This endpoint is then used to verify the
JWT token that is provided by cert-manager. There are three ways to provide this `token_reviewer_jwt` token:
1. When running Vault inside the Kubernetes cluster, you can use the Kubernetes service account token that is mounted
   into the Vault pod.  
   ✅ is enabled when Vault auto-detects that it is running in a Kubernetes cluster
2. When running Vault outside the Kubernetes cluster, you can create a long-lived service account token and provide
   it to Vault.  
   ✅ is enabled when you set the `token_reviewer_jwt` parameter
3. When running Vault outside the Kubernetes cluster, you can re-use the JWT token that is provided by cert-manager
   to authenticate to Vault. In this case, the audiences of that JWT token must also include the Kubernetes API server audience.  
   ✅ is enabled when the `token_reviewer_jwt` parameter is omitted and Vault is not running in a Kubernetes cluster

```bash
vault auth enable -path=kubernetes-cluster001 kubernetes
kubectl config view --minify --flatten -ojson \
  | jq -r '.clusters[].cluster."certificate-authority-data"' \
  | base64 -d >/tmp/cacrt
vault write auth/kubernetes-cluster001/config \
    kubernetes_host=<kubernetes-api-server-url> \
    kubernetes_ca_cert=@/tmp/cacrt
```

> **Note**: If vault is running outside the Kubernetes cluster, you can provide a `token_reviewer_jwt` token which will
> be used by Vault to authenticate to the Kubernetes API server. This token can be a long-lived service account token
> that can [be obtained as explained here](https://kubernetes.io/docs/concepts/configuration/secret/#serviceaccount-token-secrets).
> Make sure the token is linked to a service account that has the necessary permissions to call the TokenReview API.
> The vault command will look like this:
> ```bash
> vault write auth/kubernetes-cluster001/config \
>    token_reviewer_jwt="<TokenReview API SA token>"
>    kubernetes_host=<kubernetes-api-server-url> \
>    kubernetes_ca_cert=@/tmp/cacrt 
> ```

Then, create a Kubernetes Service Account and a matching Vault role:

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

Then, create the Vault role:

```bash
vault write auth/kubernetes/role/vault-issuer-role \
    bound_service_account_names=vault-issuer \
    bound_service_account_namespaces=sandbox \
    audience="vault://sandbox/vault-issuer" \
    policies=default \
    ttl=1m
```

It is recommended to use a different Vault role each per Issuer or
ClusterIssuer. The `audience` allows you to restrict the Vault role to a single
Issuer or ClusterIssuer. The syntax is the following:

```yaml
"vault://<namespace>/<issuer-name>"   # For an Issuer.
"vault://<cluster-issuer-name>"       # For a ClusterIssuer.
```

Finally, you can create your Issuer:

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
        role: vault-issuer-role
        mountPath: /v1/auth/kubernetes-cluster001
        serviceAccountRef:
          name: vault-issuer
```

> **Note**: If you are re-using the JWT token that is provided by cert-manager to authenticate to Vault, you
> can omit the `token_reviewer_jwt` parameter when configuring the Kubernetes Vault auth method. But you must
> additionally configure cert-manager to include the Kubernetes API server audience in the JWT token. This is
> done by setting the `audiences` field in the `serviceAccountRef` field. This option is only available in
> cert-manager >= v1.15.0.
>
> ```bash
> KUBE_API_AUDIENCE="$(kubectl create token default | jq -R 'gsub("-";"+") | gsub("_";"/") | split(".") | .[1] | @base64d | fromjson | .aud[0]')"
> ```
>
> ```yaml
> ...
>       kubernetes:
>         ...
>         serviceAccountRef:
>           name: vault-issuer
>           audiences: [ $KUBE_API_AUDIENCE ]
> ```
>
> When using `audiences`, the JWT will still include the generated audience
> `vault://namespace/issuer-name` or `vault://cluster-issuer`. The generated
> audience is useful for restricting access to a Vault role to a certain issuer.

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
