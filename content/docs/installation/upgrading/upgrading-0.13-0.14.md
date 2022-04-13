---
title: Upgrading from v0.13 to v0.14
description: 'cert-manager installation: Upgrading v0.13 to v0.14'
---

Due to changes in the Deployment selector you will need to remove the deployments first before being able to upgrade.


You should run the following before upgrading:
```bash
$ kubectl delete -n cert-manager deployment cert-manager cert-manager-cainjector cert-manager-webhook
```

If you're using Helm to install cert-manager with a deployment name different than `cert-manager` you might need to change the deployment names in the command above.

This will delete the deployment so they can be replaced when you apply the upgrade.
This step will not affect any existing certificates but will stop renewal or new issuance while upgrading.

Version `v0.14` now comes in 2 versions of static manifests, you will need to use the correct new one:

* Kubernetes 1.15 or higher: you can use the normal `cert-manager.yaml`
* Kubernetes 1.14 or lower: you have to now use the `cert-manager-legacy.yaml` version
* OpenShift 4: you can now use the normal `cert-manager.yaml`
* OpenShift 3: you have to now use the `cert-manager-legacy.yaml` version instead of the OpenShift version

> **Note**: If you're using the `cert-manager-legacy.yaml` version you will not have API version conversion and thus only support `cert-manager.io/v1alpha2` API resources.

The webhook is now a required component, meaning that `no-webhook` variant of the manifests are no longer available in this release. Please use the appropriate manifests as mentioned above according to your Kubernetes version.

From here on you can follow the [regular upgrade process](./README.md).