---
title: kubectl apply
description: Learn how to install cert-manager using kubectl and static manifests
---

Learn how to install cert-manager using kubectl and static manifests.

## Prerequisites

- [Install `kubectl` version `>= v1.19.0`](https://kubernetes.io/docs/tasks/tools/). (otherwise, you'll have issues updating the CRDs - see [v0.16 upgrade notes](./upgrading/upgrading-0.15-0.16.md#issue-with-older-versions-of-kubectl))
- Install a [supported version of Kubernetes or OpenShift](./supported-releases.md).
- Read [Compatibility with Kubernetes Platform Providers](./compatibility.md) if you are using Kubernetes on a cloud platform.

## Steps

All resources (the [`CustomResourceDefinitions`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions) and the cert-manager, cainjector and webhook components)
are included in a single YAML manifest file:

Install all cert-manager components:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.1/cert-manager.yaml
```

By default, cert-manager will be installed into the `cert-manager`
namespace. It is possible to run cert-manager in a different namespace, although
you'll need to make modifications to the deployment manifests.

Once you have deployed cert-manager, you can [verify the installation](./verify.md).

## Permissions Errors on Google Kubernetes Engine

When running on GKE (Google Kubernetes Engine), you might encounter a 'permission denied' error when creating some
of the required resources. This is a nuance of the way GKE handles RBAC and IAM permissions,
and as such you might need to elevate your own privileges to that of a "cluster-admin" **before**
running `kubectl apply`.

If you have already run `kubectl apply`, you should run it again after elevating your permissions:

```bash
kubectl create clusterrolebinding cluster-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value core/account)
```

## Uninstalling
> **Warning**: To uninstall cert-manager you should always use the same process for
> installing but in reverse. Deviating from the following process whether
> cert-manager has been installed from static manifests or Helm can cause issues
> and potentially broken states. Please ensure you follow the below steps when
> uninstalling to prevent this happening.

Before continuing, ensure that unwanted cert-manager resources that have been created
by users have been deleted. You can check for any existing resources with the
following command:

```bash
kubectl get Issuers,ClusterIssuers,Certificates,CertificateRequests,Orders,Challenges --all-namespaces
```
It is recommended that you delete all these resources before uninstalling cert-manager.
If plan on reinstalling later and don't want to lose some custom resources, you can keep them.
However, this can potentially lead to problems with finalizers. Some resources, like
`Challenges`, should be deleted to avoid [getting stuck in a pending state](#namespace-stuck-in-terminating-state).

Once the unneeded resources have been deleted, you are ready to uninstall
cert-manager using the procedure determined by how you installed.

> **Warning**: Uninstalling cert-manager or simply deleting a `Certificate` resource can result in
> TLS `Secret`s being deleted if they have `metadata.ownerReferences` set by cert-manager.
> You can control whether owner references are added to `Secret`s using the `--enable-certificate-owner-ref` controller flag.
> By default, this flag is set to false, which means that no owner references are added.
> However, in cert-manager v1.8 and older, changing the flag's value from true to false _did not_
> result in existing owner references being removed. This behavior was fixed in cert-manager v1.8.
> Do check the owner references to confirm that they actually are removed.

### Uninstalling with regular manifests

Uninstalling from an installation with regular manifests is a case of running
the installation process, *in reverse*, using the delete command of `kubectl`.

Delete the installation manifests using a link to your currently running version
`vX.Y.Z` like so:
> **Warning**: This command will also remove installed cert-manager CRDs. All
> cert-manager resources (e.g. `certificates.cert-manager.io` resources) will
> be removed by Kubernetes' garbage collector.
> You cannot keep any custom resources if you delete the `CustomResourceDefinition`s.
> If you want to keep resources, you should manage `CustomResourceDefinition`s separately.

```bash
kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/vX.Y.Z/cert-manager.yaml
```

### Namespace Stuck in Terminating State

If the namespace has been marked for deletion without deleting the cert-manager
installation first, the namespace may become stuck in a terminating state. This
is typically due to the fact that the [`APIService`](https://kubernetes.io/docs/tasks/access-kubernetes-api/setup-extension-api-server) resource still exists
however the webhook is no longer running so is no longer reachable. To resolve
this, ensure you have run the above commands correctly, and if you're still
experiencing issues then run:

```bash
kubectl delete apiservice v1beta1.webhook.cert-manager.io
```

#### Deleting pending challenges

`Challenge`s can get stuck in a pending state when the finalizer is unable to complete
and Kubernetes is waiting for the cert-manager controller to finish.
This happens when the controller is no longer running to remove the flag,
and the resources are defined as needing to wait.
You can fix this problem by doing what the controller does manually.

First, delete existing cert-manager webhook configurations, if any:

```bash
kubectl delete mutatingwebhookconfigurations cert-manager-webhook
```

Then change the `.metadata.finalizers` field to an empty list by editing the challenge resource:

```bash
kubectl edit challenge <the-challenge>
```
