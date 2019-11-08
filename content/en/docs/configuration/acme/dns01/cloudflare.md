---
title: "CloudFlare"
linkTitle: "CloudFlare"
weight: 30
type: "docs"
---

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
