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

> **Note**: If you're using the `cert-manager-legacy.yaml` version you not have API version conversion and othus only support `cert-manager.io/v1apha2` API resources.

If you used the `no-webhook` version you will now have to install a version with the webhook.
The webhook is now a required component of cert-manager.

From here on you can find Follow the [regular upgrade process(../).