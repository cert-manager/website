---
title: Upgrading from v0.8 to v0.9
description: 'cert-manager installation: Upgrading v0.8 to v0.9'
---

Due to a change in the API group that cert-manager deployments use
(`apps/v1beta1` to `apps/v1`), cert-manager deployments must first be deleted
before applying the new version. This will cause downtime until the new version
has been applied. No data loss will occur during this operation however it is
always advised to backup your data during an upgrade, which you can follow
[here](../../tutorials/backup.md). To perform this action run:

```bash
$ kubectl delete deployments --namespace cert-manager \
    cert-manager \
    cert-manager-cainjector \
    cert-manager-webhook
```

After this operation, follow the standard upgrade process as defined in the
[upgrade guide](./README.md).