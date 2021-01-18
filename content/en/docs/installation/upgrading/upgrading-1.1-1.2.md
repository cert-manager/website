---
title: "Upgrading from v1.1 to v1.2"
linkTitle: "v1.1 to v1.2"
weight: 810
type: "docs"
---

> The upgrade process for upgrading to `v1.2` is very Kubernetes version specific. Please check the version of your cluster using `kubectl version` and follow the steps required for your version of Kubernetes.

### Kubernetes `1.15.x` and below

cert-manager `v1.2` will no longer support Kubernetes `v1.15` and below following the Kubernetes upstream version support. We advise you to consider upgrading to Kubernetes 1.16 or above. If this isn't possible we advise you to stay with the cert-manager `v1.1.x` releases.

### Kubernetes `1.16.x` and above

When upgrading from `v1.1` to `v1.2`, no special upgrade steps are required 🎉.
From here on you can follow the [regular upgrade process](../).
