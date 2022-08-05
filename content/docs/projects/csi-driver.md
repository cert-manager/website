---
title: csi-driver
description: ''
---

csi-driver is a Container Storage Interface (CSI) driver plugin for Kubernetes
to work along cert-manager. The goal for this plugin is to seamlessly request
and mount certificate key pairs to pods. This is useful for facilitating mTLS,
or otherwise securing connections of pods with guaranteed present certificates
whilst having all of the features that cert-manager provides.

## Why a CSI Driver?

- Ensure private keys never leave the node and are never sent over the network.
  All private keys are stored locally on the node.
- Unique key and certificate per application replica with a grantee to be
  present on application run time.
- Reduce resource management overhead by defining certificate request spec
  in-line of the Kubernetes Pod template.
- Automatic renewal of certificates based on expiry of each individual
  certificate.
- Keys and certificates are destroyed during application termination.
- Scope for extending plugin behavior with visibility on each replica's
  certificate request and termination.


## Next Steps

- [Learn how to install and configure the cert-manager CSI driver](../configuration/csi)
