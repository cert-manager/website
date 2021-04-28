---
title: "Akamai"
linkTitle: "Akamai"
weight: 30
type: "docs"
---

## Edge DNS

Use Edge DNS to solve DNS01 ACME challenges by creating a `Secret` using [Akamai API credentials](https://developer.akamai.com/getting-started/edgegrid) and an `Issuer` that references the `Secret` and sets akamai as the dns01 solver.

### Create a Secret

The `Secret` should look like the following for the `Issuer` to reference. Replace `client_secret`, `access_token` and `client_token` with the respective Akamai API credential values.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: akamai-secret
type: Opaque
stringData:
  clientSecret: <client_secret>
  accessToken: <access_token>
  clientToken: <client_token>
```

### Create an Issuer

To set Edge DNS for challenge tokens, `cert-manager` uses an `Issuer` that references the above `Secret` and other attributes such as the solver type of dns01 and akamai. The `Issuer` should look like the following. Replace `<host>` with the Akamai API credential `host` value.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-akamai-dns
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: contact@me.com
    privateKeySecretRef:
      name: letsencrypt-akamai-issuer-account-key
    solvers:
    - dns01:
        akamai:
          serviceConsumerDomain: <host>
          clientTokenSecretRef:
            name: akamai-secret
            key: clientToken
          clientSecretSecretRef:
            name: akamai-secret
            key: clientSecret
          accessTokenSecretRef:
            name: akamai-secret
            key: accessToken
```

### Create a Certificate

The `Certificate` should look like the following and reference the Akamai Edge DNS `Issuer` above.

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-zone
spec:
  secretName: akamai-crt-secret
  dnsNames:
  - '*.example.zone'
  issuerRef:
    name: letsencrypt-akamai-dns
    kind: Issuer
```

> Note: `cert-manager` will wait for challenge tokens to propagate across the Edge DNS network. Follow the `certificate` status with a command such as the following.

```bash
kubectl describe certificate example.zone. -n cert-manager
```

### Troubleshooting

Follow the `cert-manager` logs to identify any issues. These commands will show the running `cert-manager` pod and its logs assuming a namespace of `cert-manager`.

```bash
kubectl get pods -n cert-manager
kubectl logs cert-manager-dddddddddd-ddddd -n cert-manager
```
