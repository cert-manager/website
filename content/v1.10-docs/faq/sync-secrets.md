---
title: Syncing Secrets Across Namespaces
description: 'cert-manager FAQ: Syncing secrets across namespaces'
---

It may be required for multiple components across namespaces to consume the same
`Secret` that has been created by a single `Certificate`. The recommended way to
do this is to use extensions such as:
  - [reflector](https://github.com/emberstack/kubernetes-reflector) with support
   for auto secret reflection
  - [kubed](https://github.com/appscode/kubed) with its 
  [secret syncing feature](https://appscode.com/products/kubed/v0.11.0/guides/config-syncer/intra-cluster/)
  - [kubernetes-replicator](https://github.com/mittwald/kubernetes-replicator) secret replication

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


## Syncing arbitrary secrets across namespaces using extensions

In order for the target Secret to be synced, you can use the `secretTemplate` field 
for annotating the generated secret with the extension specific annotation (See [CertificateSecretTemplate]).


### Using `reflector`
 The example below shows syncing a certificate's secret from the `cert-manager` namespace to multiple namespaces (i.e. `dev`, `staging`, `prod`).
 Reflector will ensure that any namespace (existing or new) matching the allowed condition (with regex support) will get a copy of the certificate's secret and will keep it up to date.
 You can also sync other secrets (different name) using `reflector` (consult the extension's [README](https://github.com/emberstack/kubernetes-reflector/blob/main/README.md))

```yaml
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: source
  namespace: cert-manager
spec:
  secretName: source-tls
  commonName: source
  issuerRef:
    name: source-ca
    kind: Issuer
    group: cert-manager.io
  secretTemplate:
    annotations:
      reflector.v1.k8s.emberstack.com/reflection-allowed: "true"  
      reflector.v1.k8s.emberstack.com/reflection-allowed-namespaces: "dev,staging,prod"  # Control destination namespaces
      reflector.v1.k8s.emberstack.com/reflection-auto-enabled: "true" # Auto create reflection for matching namespaces
      reflector.v1.k8s.emberstack.com/reflection-auto-namespaces: "dev,staging,prod" # Control auto-reflection namespaces
```


### Using `kubed`
 The example below shows syncing
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


### Using `kubernetes-replicator`
Replicator supports both push- and pull-based replication. Push-based
replication will "push out" the TLS secret into namespaces when new ones are
created, or when the secret changes. Pull-based replication makes it possible
to create an empty TLS secret in the destination namespace and select a
"source" resource from which the data is replicated from. The following example
shows the pull-based approach:
```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: source
  namespace: cert-manager
spec:
  secretName: source-tls
  commonName: source
  issuerRef:
    name: source-ca
    kind: Issuer
  secretTemplate:
    annotations:
      replicator.v1.mittwald.de/replication-allowed: "true"  # permit replication
      replicator.v1.mittwald.de/replication-allowed-namespaces: "dev,test,prod-[0-9]*"  # comma separated list of namespaces or regular expressions
---
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret-replica
  namespace: prod-1
  annotations:
    replicator.v1.mittwald.de/replicate-from: cert-manager/source-tls
type: kubernetes.io/tls
# Normally, we'd create an empty destination secret, but secrets of type
# 'kubernetes.io/tls' are treated in a special way and need to have properties
# data["tls.crt"] and data["tls.key"] to begin with, though they may be empty.
data:
  tls.key: ""
  tls.crt: ""
```

[CertificateSecretTemplate]: ../reference/api-docs.md#cert-manager.io/v1.CertificateSecretTemplate
