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

<a name="static-service-account-token"></a>

#### Secretless Authentication with a Service Account (In-Cluster Vault)

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

Next, you can either use `JWT` or `kubernetes` auth method in Vault.
This depends on several factors, for example:
- Whether Vault is running outside the cluster or not
- Whether you're running on a public cloud distribution of Kubernetes with `OIDC` discovery support
- If not, In Openshift for example whether the `apiserver` already exposes or can be configured to expose the `OIDC` discovery endpoint

| Vault deployment | Cloud managed K8s (EKS,GKE,AKS) | Admin platform rights | Best method                                                             |
| ---------------- | -------------------------- | ---------------------      | ------------                                                            |
| External         | Yes                        | Yes                        | [JWT auth](#jwt-auth-for-cloud-kubernetes-clusters)                     |
| External         | No                         | No                         | [Static token](#authentication-with-a-static-service-account-token)     |
| Internal         | Yes                        | No                         | [Kubernetes auth](#use-kubernetes-auth)                                 |
| Internal         | Yes                        | Yes                        | [Kubernetes auth](#use-kubernetes-auth)                                 |
| External         | No  (e.g. Openshift)       | Yes                        | [JWT pre-requisites + JWT auth](#jwt-auth-pre-requisites-e.g.-openshift)|

##### JWT auth for cloud Kubernetes clusters

> **Note:** This setup guide is also valid for any cluster with OIDC bound service account issuer configured to allow external usage.

Given Vault is external to your Kubernetes cluster, you can't use Vault's Kubernetes auth as explained in [this issue](https://github.com/cert-manager/cert-manager/issues/6150).

> **Note:** By using the JWT auth instead of the Kubernetes auth, the revocation of tokens will no longer be checked. That's not a problem because cert-manager uses short-lived tokens that expire after 10 minutes.

To configure Vault's JWT auth, you will need to fetch the JWKS URL:

```bash
JWKS_URL=$(curl -sS $(kubectl get --raw /.well-known/openid-configuration | jq .issuer -r)/.well-known/openid-configuration \
  | jq .jwks_uri -r)
```

> **Note:** The reason we get `/.well-known/openid-configuration` twice in a row is because `kubectl get` performs an HTTP call from within the cluster, which means the JWKS URL uses an internal domain or IP.

Check that the URL works. For example, it should look something like this:

```console
$ curl $JWKS_URL
{
  "keys": [
    {
      "kty": "RSA",
      "alg": "RS256",
      "use": "sig",
      ...
    }
  ]
}
```

The next step is to configure the JWT auth in Vault. You will need to create one JWT auth path per Kubernetes cluster since each cluster has its own JSON Web Key Set.

```bash
vault auth enable -path=jwt jwt
kubectl config view --minify --flatten -ojson \
  | jq -r '.clusters[].cluster."certificate-authority-data"' \
  | base64 -d >/tmp/cacrt
vault write auth/jwt/config \
    jwks_url="$JWKS_URL" \
    jwks_ca_pem=@/tmp/cacrt
```

Then, create a role:

```bash
vault write auth/jwt/role/vault-issuer \
   role_type="jwt" \
   bound_audiences="<AUDIENCE-FROM-PREVIOUS-STEP>" \
   user_claim="sub" \
   bound_subject="system:serviceaccount:sandbox:vault-issuer" \
   policies="default" \
   ttl="1h"
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
        role: my-app-1
        mountPath: /v1/auth/jwt
        serviceAccountRef:
          name: vault-issuer
```

##### JWT auth pre-requisites (e.g Openshift).

In the case of some Openshift installations for example, the cluster's `OIDC` provider may not be readily accessible to your external Vault instance.
This depends on many factors such as what kind of installer and where it's deployed.

You can manually configure service account issuer URL to generate your service accounts from a publicly exposed cluster `OIDC` provider.
You will need a few RBAC and potentially `apiserver` configurations to be applied to the cluster in order to allow you to use the JWT method in Vault.

> **Note:** If changes are required, it will likely need admin level permissions. 
Depending on your installation configuration you may not need to do all the changes below so make sure to check carefully before attempting any change.

For the examples below we have used an OpenShift Code Ready Containers (CRC) environment to represent the OpenShift environment.

###### 1) Openshift JWT Requirement: *OIDC Issuer* URL should be reachable:

First run the following to check your current clusters settings.

```bash
oc get --raw '/.well-known/openid-configuration' | jq .
```

Alternatively you can retrieve the cluster URI and use curl as follows:

```bash
oc cluster-info
```

Example Output:

Kubernetes control plane is running at https://api.crc.testing:6443

```bash
curl -v -k https://api.crc.testing:6443/.well-known/openid-configuration | jq .
```

Your output might be similar to this:

```yaml
{
  "issuer": "https://kubernetes.default.svc", # <- internal apiserver "kubernetes" service 
  "jwks_uri": "https://api-int.crc.testing:6443/openid/v1/jwks",
  "response_types_supported": [
    "id_token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256"
  ]
}
```

If you see the above, especially the line: `"issuer": "https://kubernetes.default.svc"`, then your Issuer URI may only be accessible from within the OpenShift cluster and therefore may not work with JWT authentication for Vault. The result will depend on the configuration of your OpenShift environment.

In order to set the issuer URI, which may be blank, please refer to the following Red Hat Documentation. Specifically see step b where the `serviceAccountIssuer` field is being set: https://docs.openshift.com/container-platform/4.13/authentication/bound-service-account-tokens.html

For example, you can use the following to set the issuer URI:

```bash
oc edit authentications cluster
```

In a CRC cluster the spec may look something like:

```yaml
spec:
  oauthMetadata:
    name: ""
  serviceAccountIssuer: https://api.crc.testing:6443 # <- This is the reachable FQDN
                                                     #    of the apiserver we set as
                                                     #    service account token issuer URL.
  type: ""
  webhookTokenAuthenticator:
    kubeConfig:
      name: webhook-authentication-integrated-oauth
```

Once configured, an example of a response to the original curl command would work is something like:

```json
{
  "issuer": "https://api.crc.testing:6443", // This is the reachable apiserver FQDN
  "jwks_uri": "https://api-int.crc.testing:6442/openid/v1/jwks", 
  "response_types_supported": [
    "id_token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256"
  ]
}
```

In that example the issuer field has a route-able DNS name that can be called from outside of the OpenShift cluster. You can test this manually with curl:

```bash
curl -s https://api.crc.testing:6443/.well-known/openid-configuration | jq .
```

###### 2) Openshift JWT Requirement: Vault should be authorized to use OIDC discovery 

You may be reading the correct `jwks_uri` from outside the cluster, but getting a 403 instead.
In this case you've hit another issue. An example might be:

```yaml
{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {},
  "status": "Failure",
  "message": "forbidden: User \"system:anonymous\" cannot get path \"/openid/v1/jwk\"",
  "reason": "Forbidden",
  "details": {},
  "code": 403
}
```

If you see this, then non-authenticated users are not able to call that API endpoint. You will need to allow unauthenticated users to access this endpoint.

Note: The YAML provided is an example and you should review fully before implementing.

Here is an example `ClusterRoleBinding` that would allow anyone to access that API endpoint:

```yaml
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: crb:oidc-viewer
subjects:
  - kind: Group
    name: system:unauthenticated
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: system:service-account-issuer-discovery
  apiGroup: rbac.authorization.k8s.io
```

Once applied try the `jwks_uri` again and validate you receive a JSON response.


###### 3) Openshift JWT Requirement: *JWKS* URI presented in discovery endpoint should be reachable:

Assuming you now get a response, you will want to ensure that the `jwks_uri` is also accessible from outside of the cluster. For example in CRC this might be configured to an internally routable DNS name only by default.

From your previous output try curl to access the endpoint:

```bash
curl -v -k https://api.crc.testing:6443/openid/v1/jwks | jq .
```

A successful response will return a JSON output with public keys, such as:

```json
{
  "keys": [
    {
      "use": "sig",
      "kty": "RSA",
      "kid": "JDH_TRZxYQt_C4h00XIty8lC73TI3eJ9GXCI0vsb_lw",
      ...
    }
  ]
}
```

If you do not get this response it is likely you will not be successful setting up a JWT mapping in Vault .

In case you still do not see a valid JWKS URI, you can try the following remediation.

> **Note:** Reconfiguring the `apiserver` as shown below should be carefully evaluated before use. This may not be a suitable solution for some production environment. 

You may need to manually override the `service-account-jwks-uri` field within the `kubeapiservers.operator.openshift.io` configuration for the cluster:

```yaml
spec:
  unsupportedConfigOverrides:
    apiServerArguments:
      service-account-jwks-uri:
      - https://api.crc.testing:6443/openid/v1/jwks
```

For example adding this via the `unsupportedConfigOverrides` field in the spec is possible. You will need to wait a few minutes for these changes to propagate and be ready for use. The domain would be one you own and currently use to access the OpenShift environment. Do not use the CRC domain in a real OpenShift environment.

###### Openshift JWT: Configure JWT auth in Openshift

Once the 3 above pre-requisites are fulfilled, you can follow [the exact same steps as the JWT method](#jwt-auth-for-cloud-kubernetes-clusters) for the public clouds using the issuer URL, which for example in our case is: `https://api.crc.testing:6443`

## Use Kubernetes auth

You can only use `serviceAccountRef` with Vault's Kubernetes auth when Vault is
installed in the same cluster as cert-manager, otherwise you would use the [JWT Vault auth](#jwt-auth-for-cloud-kubernetes-clusters).

To use the Kubernetes auth with `serviceAccountRef`, configure your issuer with
the following:

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

#### Secretless Authentication with a Service Account (External Vault)

ℹ️ This feature is available in cert-manager >= v1.15.0.

If you are using a Vault instance external to your cluster, you will need to set
the `audiences` to an audience accepted by your Kubernetes cluster. When using
an external Vault instance, the short-lived token created by cert-manager to
authenticate to Vault will be used by Vault for authenticating to Kubernetes.
First, find what your cluster's issuer is:

```sh
kubectl get --raw /.well-known/openid-configuration | jq .issuer -r
```

Then, set the `audiences` field to the issuer URL:

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
          audiences: [https://kubernetes.default.svc.cluster.local]
```

When using `audiences`, the JWT will still include the generated audience
`vault://namespace/issuer-name` or `vault://cluster-issuer`. The generated
audience is useful for restricting access to a Vault role to a certain issuer.

When configuring the Kubernetes Vault auth method, omit the `token_reviewer_jwt`
parameter so that Vault uses the token provided by cert-manager to authenticate
with the Kubernetes API server when reviewing the token.

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
