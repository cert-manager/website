---
title: Upgrading from v1.8 to v1.9
description: 'cert-manager installation: Upgrading v1.8 to v1.9'
---

If running Kubernetes versions before `v1.22`, the
[`ServerSideApply`](https://kubernetes.io/docs/reference/using-api/server-side-apply/)
feature gate _must_ be enabled in the cluster. This beta feature is enabled by default
on supported versions before `v1.22`.

From here on you can follow the [regular upgrade process](./README.md).
