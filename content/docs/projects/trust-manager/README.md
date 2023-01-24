---
title: trust-manager
description: 'Distributing Trust Bundles in Kubernetes'
---

## Distributing Trust Bundles in Kubernetes

trust-manager is an operator for distributing trust bundles across a Kubernetes cluster.
trust-manager is designed to complement
[cert-manager](https://github.com/cert-manager/cert-manager) by enabling services to
trust X.509 certificates signed by Issuers, as well as external CAs which may
not be known to cert-manager at all.

## Usage

trust ships with a single cluster scoped `Bundle` resource. A Bundle represents
a set of data that should be distributed and made available across the cluster.
There are no constraints on what data can be distributed.

The Bundle gathers and appends trust data from a number of `sources` located in
the trust namespace (where the trust controller is deployed), and syncs them to
a `target` in every namespace.

A typical Bundle looks like the following:

```yaml
apiVersion: trust.cert-manager.io/v1alpha1
kind: Bundle
metadata:
  name: my-org.com
spec:
  sources:
  # A Secret in the trust namespace created via a cert-manager Certificate
  - secret:
      name: "my-db-tls"
      key: "ca.crt"
  # A ConfigMap in the trust namespace
  - configMap:
      name: "my-org.net"
      key: "root-certs.pem"
  # An In Line
  - inLine: |
      # my-org.com CA
      -----BEGIN CERTIFICATE-----
      MIIC5zCCAc+gAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
      ....
      0V3NCaQrXoh+3xrXgX/vMdijYLUSo/YPEWmo
      -----END CERTIFICATE-----
  target:
    # Data synced to the ConfigMap `my-org.com` at the key `root-certs.pem` in
    # every namespace that has the label "linkerd.io/inject=enabled".
    configMap:
      key: "root-certs.pem"
    namespaceSelector:
      matchLabels:
        linkerd.io/inject: "enabled"
```

Bundle currently supports the source types `configMap`, `secret` and `inLine`,
and target type `configMap`.

#### Namespace Selector

The target `namespaceSelector` can be used for scoping which Namespaces targets
are synced to, supporting the field `matchLabels`. Please see
[here](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors)
for more information and how label selectors are configured.

If `namespaceSelector` is empty, a bundle target will be synced to all
Namespaces.

---

## Installation

First, install [cert-manager](https://cert-manager.io/docs/installation/) to the
cluster, and then the trust operator. It is advised to run the trust operator in
the `cert-manager` namespace.

```bash
helm repo add jetstack https://charts.jetstack.io --force-update
helm upgrade -i -n cert-manager cert-manager jetstack/cert-manager --set installCRDs=true --wait --create-namespace
helm upgrade -i -n cert-manager trust-manager jetstack/trust-manager --wait
```

#### Quick Start Example

```bash
kubectl create -n cert-manager configmap source-1 --from-literal=cm-key=123
kubectl create -n cert-manager secret generic source-2 --from-literal=sec-key=ABC
kubectl apply -f - <<EOF
apiVersion: trust.cert-manager.io/v1alpha1
kind: Bundle
metadata:
  name: example-bundle
spec:
  sources:
  - configMap:
      name: "source-1"
      key: "cm-key"
  - secret:
      name: "source-2"
      key: "sec-key"
  - inLine: |
      hello world!
  target:
    configMap:
      key: "target-key"
EOF
```

```bash
kubectl get bundle
NAME             TARGET       SYNCED   REASON   AGE
example-bundle   target-key   True     Synced   5s
```

```bash
kubectl get cm -A --field-selector=metadata.name=example-bundle
NAMESPACE            NAME             DATA   AGE
cert-manager         example-bundle   1      2m18s
default              example-bundle   1      2m18s
kube-node-lease      example-bundle   1      2m18s
kube-public          example-bundle   1      2m18s
kube-system          example-bundle   1      2m18s
local-path-storage   example-bundle   1      2m18s
```

```bash
kubectl get cm -n kube-system example-bundle -o jsonpath="{.data['target-key']}"
123
ABC
hello world!
```
