---
title: "Upgrading from v0.13 to v0.14"
linkTitle: "v0.13 to v0.14"
weight: 30
type: "docs"
---

Due to changes in the Deployment selector you will need to remove the deployments first before being able to upgrade.

If you are using a deployment tool that automatically handles this (i.e. Helm),
there should be no additional action to take.

If you are using the 'static manifests' to install, you should run the following
before upgrading:

```bash
$ kubectl delete -n cert-manager deployment cert-manager cert-manager-cainjector cert-manager-webhook
```

This will delete the deployment so they can be replaced when you apply the upgrade.
This step will not affect any existing certificates but will stop renewal or new issuance while upgrading.


Version `v0.14` now comes in 2 versions of static manifests, you will need to use the correct new one:
* Kubernetes 1.15 or higher: you can use the normal `cert-manager.yaml`
* Kubernetes 1.14 or lower: you have to now use the `cert-manager-legacy.yaml` version
* OpenShift 4: you can now the normal `cert-manager.yaml`
* OpenShift 3: you have to now use the `cert-manager-legacy.yaml` version instead of the OpenShift version

> **Note**: If you're using the `cert-manager-legacy.yaml` version you will not have API version conversion and thus only support `cert-manager.io/v1apha2` API resources.

The webhook is now a required component, meaning that `no-webhook` variant of the manifests are no longer available in this release. Please use the appropriate manifests as mentioned above according to your Kubernetes version.

From here on you can follow the [regular upgrade process(../).