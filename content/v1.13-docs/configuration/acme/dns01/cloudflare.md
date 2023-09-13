---
title: Cloudflare
description: 'cert-manager configuration: ACME DNS-01 challenges using Cloudflare DNS'
---

To use Cloudflare, you may use one of two types of tokens. **API Tokens** allow application-scoped keys bound to specific zones and permissions, while **API Keys** are globally-scoped keys that carry the same permissions as your account.

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
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    ...
    solvers:
    - dns01:
        cloudflare:
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
apiVersion: cert-manager.io/v1
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

## Troubleshooting

### Actor `com.cloudflare.api.token.xxxx` requires permission `com.cloudflare.api.account.zone.list` to list zones
If you get the error that your token does not have the correct permission to list zones there can be 2 causes.
1. The token lacks the `Zone - Zone - Read` permission
2. cert-manager identified the wrong zone name for the domain due to DNS issues.

In the case of the 2nd issue you will see an error like below:
```
Events:
  Type     Reason        Age              From          Message
  ----     ------        ----             ----          -------
  Normal   Started       6s               cert-manager  Challenge scheduled for processing
  Warning  PresentError  3s (x2 over 3s)  cert-manager  Error presenting challenge: Cloudflare API Error for GET "/zones?name=<TLD>" 
            Error: 0: Actor 'com.cloudflare.api.token.xxxx' requires permission 'com.cloudflare.api.account.zone.list' to list zones
```

In this case we recommend [changing your DNS01 self-check nameservers](./README.md#setting-nameservers-for-dns01-self-check).

## `Cloudflare API error for POST "/zones/<id>/dns_records` generic error

You might be hitting this as Cloudflare blocks the use of the API to update DNS records for the following TLDs: `.cf`, `.ga`, `.gq`, `.ml` and `.tk`.
This is discussed in the [Cloudflare Community](https://community.cloudflare.com/t/unable-to-update-ddns-using-api-for-some-tlds/167228).
We recommend using an alternative DNS provider when using these TLDs.