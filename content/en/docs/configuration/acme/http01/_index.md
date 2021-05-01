---
title: "HTTP01"
linkTitle: "HTTP01"
weight: 10
type: "docs"
---

## Configuring HTTP01 Provider

This page contains details on the different options available on the `Issuer`
resource's HTTP01 challenge solver configuration. For more information on
configuring ACME issuers and their API format, read the [ACME Issuers](../)
documentation.

You can read about how the HTTP01 challenge type works on the [Let's Encrypt
challenge types
page](https://letsencrypt.org/docs/challenge-types/#http-01-challenge).

Here is an example of a simple `HTTP01` Ingress ACME issuer:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: example-issuer-account-key
    solvers:
    - http01:
       ingress:
         class: nginx
```

## Supported HTTP01 providers

A number of different HTTP providers are supported for the ACME `Issuer`. Below
is a listing of available providers, their `.yaml` configurations, along with
additional Kubernetes and provider specific notes regarding their usage. A HTTP01
challenge solver configuration has to specify exactly one HTTP01 provider configuration.

- [Ingress](./ingress/)
- [Istio](./istio/)
