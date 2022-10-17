---
title: Upgrading from v0.16 to v1.0
description: 'cert-manager installation: Upgrading v0.16 to v1.0'
---

> The upgrade process for upgrading to `v1.0` is very Kubernetes version specific. Please check the version of your cluster using `kubectl version` and follow the steps required for your version of Kubernetes.

## Issue with older versions of `kubectl`
`kubectl` versions with patch versions lower than `v1.18.8` `v1.17.11` or `v1.16.14` have issues updating from the `v0.16` CRD files, due to [a bug when handling deeply nested CRDs](https://github.com/kubernetes/kubernetes/issues/91615).
This bug will make `kubectl apply -f [...]` hang. 

This bug only happens during a re-apply of the v0.16 CRDs or upgrading from it. Upgrades from lower versions do not cause issues. If you have this issue please upgrade your `kubectl` to the latest patch release.
Versions of `kubectl` of `v1.15.x` or below are not being supported anymore as these are unsupported by the Kubernetes community.

### Helm
Helm users who use `installCRDs=true` MUST upgrade to Helm `v3.3.1` or later before upgrading.

## Upgrade instructions per Kubernetes version

### Kubernetes `1.16` and above
These are the upgrade instructions to upgrade from cert-manager `v0.14.0` or higher, please consult other upgrade guides first before upgrading to `v1.0` if you run an older version of cert-manager.

No special requirements, you can follow the [regular upgrade process](./README.md).

### Kubernetes `1.15.x`

cert-manager now uses `apiextensions.k8s.io/v1` to install CRDs inside Kubernetes. This got added in Kubernetes `1.16`.
Our legacy installation will still be using `apiextensions.k8s.io/v1beta1`. For this reason Kubernetes 1.15 users now need to install the legacy version of the cert-manager manifests.
You can follow the instructions of "Kubernetes 1.14" below on how to upgrade to the legacy version of `v1.0`.

> **Note**: The legacy version only supports a single CRD version. We advise you to consider upgrading to Kubernetes 1.16 or above for an easier migration.

### Kubernetes `1.14` and below

These are the upgrade instructions to upgrade from cert-manager `v0.11.0` or higher, please consult other upgrade guides first before upgrading to `v1.0` if you run an older version of cert-manager.

> **Note**: Due to the lack of support for conversion webhooks in your Kubernetes version this will not be an easy migration. We advise you to consider upgrading to Kubernetes 1.16 or higher before upgrading. Upgrading your Kubernetes cluster might be easier than upgrading cert-manager.

We have released our `cert-manager.io/v1` API that replaces `cert-manager.io/v1alpha2`.
Since the legacy version for Kubernetes 1.15 and below only supports one CRD version
you have to transition all resources to `cert-manager.io/v1`.

This makes for a fairly significant breaking change for users, as **all**
cert-manager resources will need to be updated to reflect these changes.
Ingress annotations will stay the same, this means if you only use ingress-shim 
you do not have to convert these resources over but it is recommended. 
However you should convert the (Cluster)Issuers and delete the old CRD versions.

This upgrade MUST be performed in the following sequence of steps:

1. [Back up](../../tutorials/backup.md) existing cert-manager resources. See the backup section.

2. [Uninstall cert-manager](../uninstall.md).

3. Update the `apiVersion` on all your backed up resources from
   `cert-manager.io/v1alpha2` to `cert-manager.io/v1`. See the converting section for that.

4. Ensure the old cert-manager CRD resources have also been deleted: `kubectl get crd | grep cert-manager.io`


5. Re-install cert-manager `v1.0` from scratch according to the [installation
   guide](../README.md).

6. Apply the backed up resources again.

You must be sure to properly **backup**, **uninstall**, **re-install** and
**restore** your installation in order to ensure the upgrade is successful.

#### Backing up resources
You can backup the custom resources you or cert-manager created using the following `kubectl` command:
```bash
kubectl get -o yaml \
   --all-namespaces \
   issuer,clusterissuer,certificates,certificaterequests > cert-manager-backup.yaml
```

*Note that this will not export private keys or secrets.*

#### Converting resources

You can use our [kubectl plugin](../../usage/kubectl-plugin.md) to automatically convert your backup from `v1alpha2` to `v1` using the following command:

```bash
kubectl cert-manager convert --output-version cert-manager.io/v1 -f cert-manager-backup.yaml > cert-manager-v1.yaml
```

*Tip:* you can use `kubectl apply --dry-run` on a local/test cluster with cert-manager `v1.0` installed to validate your conversion 


#### Uninstall cert-manager
Next step is to uninstall cert-manager. 
This will cause a temporary halt to renewal of certificates but will not affect any TLS traffic.

How you do this depends on how you installed cert-manager.

Using Helm:
```bash
$ helm --namespace cert-manager delete cert-manager
```

Using `kubectl`:
```bash
kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/vX.Y.Z/cert-manager.yaml
```

Make sure you also delete the CRDs. This will delete all cert-manager resources, so make sure your backup is complete.
You can do this manually by executing the following commands:
```bash
kubectl delete crd certificaterequests.cert-manager.io
kubectl delete crd certificates.cert-manager.io
kubectl delete crd challenges.acme.cert-manager.io
kubectl delete crd clusterissuers.cert-manager.io 
kubectl delete crd issuers.cert-manager.io
kubectl delete crd orders.acme.cert-manager.io
```

For more info see the [uninstall cert-manager guide](../uninstall.md).

#### Reinstall and restore
To install cert-manager again you can follow the normal [installation guide](../README.md).

Once it has been fully installed you can re-apply the converted resources:
```bash
kubectl apply -f cert-manager-v1.yaml
```

Congratulations you're now fully upgraded to cert-manager `v1.0`