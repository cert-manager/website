---
title: Installing cert-manager csi-driver
description: 'Installation guide for cert-manager csi-driver'
---

## Installation Steps

You must have a working installation of cert-manager present on your cluster and be running at least Kubernetes `v1.19`.

Instructions on how to install cert-manager can be found [on this website](../../installation/README.md).

To install csi-driver, use helm:

```terminal
helm repo add jetstack https://charts.jetstack.io --force-update

helm upgrade cert-manager-csi-driver jetstack/cert-manager-csi-driver \
  --install \
  --namespace cert-manager \
  --wait
```

You can verify the installation has completed correctly by checking the presence
of the CSIDriver resource as well as a CSINode resource present for each node,
referencing `csi.cert-manager.io`.

```terminal
$ kubectl get csidrivers
NAME                     CREATED AT
csi.cert-manager.io   2019-09-06T16:55:19Z

$ kubectl get csinodes -o yaml
apiVersion: v1
items:
- apiVersion: storage.k8s.io/v1beta1
  kind: CSINode
  metadata:
    name: kind-control-plane
    ownerReferences:
    - apiVersion: v1
      kind: Node
      name: kind-control-plane
...
  spec:
    drivers:
    - name: csi.cert-manager.io
      nodeID: kind-control-plane
      topologyKeys: null
...
```

## Usage

> 📖 Read the [csi-driver docs](./README.md).
