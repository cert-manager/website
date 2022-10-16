---
title: Upgrading from v1.6 to v1.7
description: 'cert-manager installation: Upgrading v1.6 to v1.7'
---

⚠ Following their deprecation in version 1.5, the cert-manager API versions v1alpha2, v1alpha3, and v1beta1 have been removed.
You must ensure that all cert-manager custom resources are stored in etcd at version v1
and that all cert-manager `CustomResourceDefinition`s have only v1 as the stored version
**before** upgrading.
Please read [Migrating Deprecated API Resources] for full instructions.

[Migrating Deprecated API Resources]: ./remove-deprecated-apis.md

If you are currently using HTTP-01 challenges or the Ingress shim annotations, please read the [Ingress class compatibility](./ingress-class-compatibility.md)
notes to see if your Ingress controller has any known issues with the migration to Ingress v1.

If running Kubernetes versions before `v1.22`, the 
[`ServerSideApply`](https://kubernetes.io/docs/reference/using-api/server-side-apply/)
feature gate _must_ be enabled in the cluster. This beta feature is enabled by default
on supported versions before `v1.22`.

## Now Follow the Regular Upgrade Process

From here on you can follow the [regular upgrade process](./README.md).