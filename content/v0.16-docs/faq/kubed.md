---
title: Syncing Secrets Across Namespaces using Kubed
description: 'cert-manager FAQ: Kubed'
---

It may be required for multiple components across namespaces to consume the same
`Secret` that has been created by a single `Certificate`. The recommended way to
do this is to use [kubed](https://github.com/appscode/kubed) with its [secret
syncing
feature](https://appscode.com/products/kubed/v0.11.0/guides/config-syncer/intra-cluster/).

In order for the target Secret to be synced, the Secret resource must first be
created with the correct annotations before the creation of the Certificate,
else the Secret will need to be edited instead. The example below shows syncing
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
apiVersion: v1
data:
  ca.crt: ''
  tls.crt: ''
  tls.key: ''
kind: Secret
metadata:
  name: sandbox-tls
  namespace: cert-manager
  annotations:
    kubed.appscode.com/sync: "cert-manager-tls=sandbox" # Sync certificate to matching namespaces
type: kubernetes.io/tls
---
apiVersion: cert-manager.io/v1alpha2
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
```