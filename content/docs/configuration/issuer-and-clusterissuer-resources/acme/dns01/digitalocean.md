---
title: DigitalOcean
description: 'cert-manager configuration: ACME DNS-01 challenges using DigitalOcean DNS'
---

This provider uses a Kubernetes `Secret` resource to work. In the following
example, the `Secret` will have to be named `digitalocean-dns` and have a
sub-key `access-token` with the token in it. For example:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: digitalocean-dns
data:
  # insert your DO access token here
  access-token: "base64 encoded access-token here"
  ```

The access token must have write access.

To create a Personal Access Token, see [DigitalOcean documentation](https://docs.digitalocean.com/reference/api/create-personal-access-token/).

Handy direct link: https://cloud.digitalocean.com/account/api/tokens/new

To encode your access token into base64, you can use the following

```bash
echo -n 'your-access-token' | base64
```

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
        digitalocean:
          tokenSecretRef:
            name: digitalocean-dns
            key: access-token
```