---
title: Upgrading from v0.11 to v0.12
description: 'cert-manager installation: Upgrading v0.11 to v0.12'
---

The focus of this release has been on stability and bug fixes, as well as
overhauling and improving the documentation website. As such, there has been
minimal changes that effect end users bar two changes which require action when
upgrading.

After addressing the following points, you should then follow the standard
upgrade process [here](./README.md).

## Changes to the Vault Kubernetes Auth Mount Path
If you are using Kubernetes authentication for Vault `Issuers` then there has
been a change to the required mount path. This value now requires the entire
mount path. For example, if the previous path had been set to `kubernetes`, the
new path will now require `/v1/auth/kubernetes`. You can read why this change
was made [here](https://github.com/cert-manager/cert-manager/issues/2205).

## Removal of the Webhook API service
The Webhook component now no longer makes use of a Kubernetes `APIService`, and
as such, should be removed. This action is only required if you have installed
cert-manager using static manifests. The following command will delete the
service and can be done before or after applying the upgrade.

```bash
$ kubectl delete apiservice v1beta1.webhook.cert-manager.io
```