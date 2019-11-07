---
title: "DigitalOcean"
linkTitle: "DigitalOcean"
weight: 30
type: "docs"
---

This provider uses a Kubernetes `Secret` Resource to work. In the following
example, the secret will have to be named `digitalocean-dns` and have a subkey
`access-token` with the token in it.

To create a Personnal Access Token, see [DigitalOcean documentation](https://www.digitalocean.com/docs/api/create-personal-access-token).

Handy direct link: https://cloud.digitalocean.com/account/api/tokens/new

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
        digitalocean:
          tokenSecretRef:
            name: digitalocean-dns
            key: access-token
```
