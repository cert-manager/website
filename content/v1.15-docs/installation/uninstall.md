---
title: Uninstalling cert-manager
description: 'cert-manager installation: Uninstalling cert-manager'
---

cert-manager supports running on [Kubernetes](https://kubernetes.io) and
[OpenShift](https://www.openshift.com). The uninstallation process between the
two platforms is similar. Select the method that was used for installing
cert-manager to go to the relevant uninstall documentation.

- [kubectl](./kubectl.md#uninstalling)
- [helm](./helm.md#uninstalling)

If you need to preserve cert-manager custom resources (`Certificate`s, `Issuer`s etc), that are not version controlled or backed up by other means, take a look at our [backup and restore guide](../devops-tips/backup.md).
