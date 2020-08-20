---
title: "Upgrading from v0.16 to v1.0"
linkTitle: "v0.15 to v0.16"
weight: 830
type: "docs"
---

> The upgrade process for upgrading to v1.0 is very Kubernetes version specific. Please check the version of you cluster using `kubectl version` and follow the steps required for your version of Kubernetes.

## Issue with older versions of `kubectl`
`kubectl` versions with patch versions lower than `v1.18.8` `v1.17.11` or `v1.16.14` have issues updating from the `v0.16` CRD files, due to [a bug when handling deeply nested CRDs](https://github.com/kubernetes/kubernetes/issues/91615).
This bug will make `kubectl apply -f [...]` hang. 

This bug only happens during a re-apply of the v0.16 CRDs or upgrading from it. Upgrade from lower versions do not cause issues. If you have this issue please upgrade your `kubectl` to the latest patch release.
Versions of `kubectl` of `v1.15.x` or below are not being supported anymore as these are unsupported by the Kubernetes community.

### Helm
Helm users who use `installCRDs=true` should **not YET** upgrade to `v1.0` until a Helm `v3.3.1` is released.
At time of writing a PR has been merged for this but is not yet released.
This issue only affects `v3.1+` however, we don't currently advise using `installCRDs=true`

## Upgrade instructions per Kubernetes version

### Kubernetes 1.16 and above
No special requirements, you can follow the [regular upgrade process](../).

### Kubernetes 1.15.x

cert-manager now uses `apiextensions.k8s.io/v1` to install CRDs inside Kubernetes. This got added in Kubernetes `1.16`.
Our legacy installation will stil be using `apiextensions.k8s.io/v1beta1`. For this reason Kubernetes 1.15 now needs to be using the legacy version of cert-manager.
You can follow the instructions of "Kubernetes 1.14" below on how to upgrade to the lagacy version of v1.0.

> **Note**: The legacy version only supports a single CRD version. We advice you to consider upgrading to Kubernetes 1.16 or above for an easier migration.

### Kubernetes 1.14 and below

> **Note**: Due to the lack of support for conversion webhooks in your Kubernetes version this will not be an easy migration. We advice you to consider upgrading to Kubernetes 1.16 or higher before upgrading. Upgrading your Kubernetes cluster might be easier than upgrading cert-manager.

We have released our `cert-manager.io/v1` API that replaces `cert-manager.io/v1alpha2`.
Since the legacy version for Kubernetes 1.15 and below only supports one CRD version
you have to transition all resources to `cert-manager.io/v1`.


This makes for a fairly significant breaking change for users, as **all**
cert-manager resources will need to be updated to reflect these changes.
Ingress annotations will stay the same, this means if you only use ingress-shim 
you do not have to convert these resources over but it is recommended. 
However you should convert the (Cluster)Issuers and delete the old CRD versions.

This upgrade should be performed in a few steps:

1. Back up existing cert-manager resources. See the backup section.

2. [Uninstall cert-manager](../../uninstall/).

3. Ensure the old cert-manager CRD resources have also been deleted: `kubectl get crd | grep cert-manager.io`

4. Update the `apiVersion` on all your backed up resources from
   `cert-manager.io/v1alpha2` to `cert-manager.io/v1`. See the converting section for that.

5. Re-install cert-manager v1.0 from scratch according to the [installation
   guide](../../).

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

#### Uninstall cert-manager
Next step is to uninstall cert-manager. 
This will cause a temporary halt to renewal of certificates but will not affect any TLS traffic.

On how to do this depends on how you installed cert-manager.

Using Helm:
```bash
$ helm --namespace cert-manager delete cert-manager
```

Using `kubectl`:
```bash
kubectl delete -f https://github.com/jetstack/cert-manager/releases/download/vX.Y.Z/cert-manager.yaml
```

Make sure you also have delete the CRDs. This will delete all cert-manager resources also, make sure your backup is complete.
You can do this manual doing:
```bash
kubectl delete crd certificaterequests.cert-manager.io
kubectl delete crd certificates.cert-manager.io
kubectl delete crd challenges.acme.cert-manager.io
kubectl delete crd clusterissuers.cert-manager.io 
kubectl delete crd issuers.cert-manager.io
kubectl delete crd orders.acme.cert-manager.io
```

For more info see the [uninstall cert-manager guide](../../uninstall/).

#### Converting resources

You can use our [kubectl plugin](../../../usage/kubectl-plugin/) to automatically convert you backup from v1alpha2 to v1 using the following command:

```bash
kubectl cert-manager convert --output-version cert-manager.io/v1 -f cert-manager-backup.yaml > cert-manager-v1.yaml
```

#### Reinstall and restore
To install cert-manager again you can follow the normal [installation guide](../../).

Once it has been fully installed you can re-apply the converted resources:
```bash
kubectl apply -f cert-manager-v1.yaml
```

Congratulations you're now fully upgraded to cert-manager v1.0