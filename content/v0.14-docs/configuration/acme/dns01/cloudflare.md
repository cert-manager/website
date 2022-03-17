---
title: CloudFlare
description: 'cert-manager configuration: ACME DNS-01 challenges using Cloudflare DNS'
---

To use CloudFlare, you may use one of two types of tokens. **API Tokens** allow application-scoped keys bound to specific zones and permissions, while **API Keys** are globally-scoped keys that carry the same permissions as your account.

**API Tokens** are recommended for higher security, since they have more restrictive permissions and are more easily revocable.

## API Tokens

Tokens can be created at **User Profile > API Tokens > API Tokens**. The following settings are recommended:

- Permissions:
  - `Zone - DNS - Edit`
  - `Zone - Zone - Read`
- Zone Resources:
  - `Include - All Zones`

To create a new `Issuer`, first make a Kubernetes secret containing your new API token:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-api-token-secret
type: Opaque
stringData:
  api-token: <API Token>
```

Then in your `Issuer` manifest:

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    ...
    solvers:
    - dns01:
        cloudflare:
          email: my-cloudflare-acc@example.com
          apiTokenSecretRef:
            name: cloudflare-api-token-secret
            key: api-token
```

## API Keys

API keys can be retrieved at **User Profile > API Tokens > API Keys > Global API Key > View**.

To create a new `Issuer`, first make a Kubernetes secret containing your API key:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-api-key-secret
type: Opaque
stringData:
  api-key: <API Key>
```

Then in your `Issuer` manifest:

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    ...
    solvers:
    - dns01:
        cloudflare:
          email: my-cloudflare-acc@example.com
          apiKeySecretRef:
            name: cloudflare-api-key-secret
            key: api-key
```