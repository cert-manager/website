---
title: Akamai
description: 'cert-manager configuration: ACME DNS-01 challenges using Akamai DNS'
---

## Akamai FastDNS

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
        akamai:
          serviceConsumerDomain: akab-tho6xie2aiteip8p-poith5aej0ughaba.luna.akamaiapis.net
          clientTokenSecretRef:
            name: akamai-dns
            key: clientToken
          clientSecretSecretRef:
            name: akamai-dns
            key: clientSecret
          accessTokenSecretRef:
            name: akamai-dns
            key: accessToken
```