---
title: Syncing Secrets Across Namespaces
description: 'cert-manager FAQ: Kubed'
---

It may be required for multiple components across namespaces to consume the same
`Secret` that has been created by a single `Certificate`. The recommended way to
do this is to use [kubed](https://github.com/appscode/kubed) with its [secret
syncing
feature](https://appscode.com/products/kubed/v0.11.0/guides/config-syncer/intra-cluster/). However if your use case is a wildcard certificate another approach may meet your needs.

## Serving a wildcard to ingress resources in different namespaces (default SSL certificate)

Most ingress controllers, including [ingress-nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/#default-ssl-certificate), [Traefik](https://docs.traefik.io/https/tls/#default-certificate), and [Kong](https://docs.konghq.com/2.0.x/configuration/#ssl_cert) support specifying a _single_ certificate to be used for ingress resources which request TLS but do not specify `tls.[].secretName`. This is often referred to as a "default SSL certificate". As long as this is correctly configured, ingress resources in any namespace will be able to use a single wildcard certificate. Wildcard certificates are not supported with HTTP01 validation and require DNS01.

Sample ingress snippet:

```
apiVersion: networking.k8s.io/v1
kind: Ingress
#[...]
spec:
  rules:
  - host: service.example.com
  #[...]
  tls:
  - hosts:
    - service.example.com
    #secretName omitted to use default wildcard certificate
```

## Syncing arbitrary secrets across namespaces using kubed

In order for the target Secret to be synced, you can use the `secretTemplate` field for annotating the generated secret with the kubed sync annotation (See [CertificateSecretTemplate]). The example below shows syncing
a certificate belonging to the `sandbox` Certificate from the `cert-manager`
namespace, into the `sandbox` namespace.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sandbox
  labels:
    cert-manager-tls: sandbox # Define namespace label for kubed
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: sandbox
  namespace: cert-manager
spec:
  secretName: sandbox-tls
  commonName: sandbox
  issuerRef:
    name: sandbox-ca
    kind: Issuer
    group: cert-manager.io
  secretTemplate:
    annotations:
      kubed.appscode.com/sync: "cert-manager-tls=sandbox" # Sync certificate to matching namespaces
```

[CertificateSecretTemplate]: ../reference/api-docs.md#cert-manager.io/v1.CertificateSecretTemplate