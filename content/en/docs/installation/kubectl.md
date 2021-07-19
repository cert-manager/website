---
title: "Kubectl apply"
linkTitle: "Kubectl apply"
weight: 20
type: "docs"
---

> Note: From cert-manager `v1.2.0` onward, the minimum supported version of
> Kubernetes is `v1.16.0`. Users still running Kubernetes `v1.15` or below should
> upgrade to a supported version before installing cert-manager.

> **Warning**: You should not install multiple instances of cert-manager on a single
> cluster. This will lead to undefined behavior and you may be banned from
> providers such as Let's Encrypt.

## Installing with regular manifests

All resources (the [`CustomResourceDefinitions`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions) and the cert-manager, cainjector and webhook components)
are included in a single YAML manifest file:

> **Note**: If you're using a `kubectl` version below `v1.19.0-rc.1` you will have issues updating the CRDs.
> For more info see the [v0.16 upgrade notes](../upgrading/upgrading-0.15-0.16/#issue-with-older-versions-of-kubectl)


Install all cert-manager components:

```bash
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.4.0/cert-manager.yaml
```

> **Note**: When running on GKE (Google Kubernetes Engine), you may encounter a
> 'permission denied' error when creating some of these resources. This is a
> nuance of the way GKE handles RBAC and IAM permissions, and as such you should
> 'elevate' your own privileges to that of a 'cluster-admin' **before** running
> the above command. If you have already run the above command, you should run
> them again after elevating your permissions:
```bash
  kubectl create clusterrolebinding cluster-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value core/account)
```

> **Note**: By default, cert-manager will be installed into the `cert-manager`
> namespace. It is possible to run cert-manager in a different namespace, although you
> will need to make modifications to the deployment manifests.


Once you have deployed cert-manager, you can verify the installation
[here](../verify/).

## Uninstalling
> **Warning**: To uninstall cert-manger you should always use the same process for
> installing but in reverse. Deviating from the following process whether
> cert-manager has been installed from static manifests or Helm can cause issues
> and potentially broken states. Please ensure you follow the below steps when
> uninstalling to prevent this happening.

Before continuing, ensure that all cert-manager resources that have been created
by users have been deleted. You can check for any existing resources with the
following command:

```bash
$ kubectl get Issuers,ClusterIssuers,Certificates,CertificateRequests,Orders,Challenges --all-namespaces
```

Once all these resources have been deleted you are ready to uninstall
cert-manager using the procedure determined by how you installed.

### Uninstalling with regular manifests

Uninstalling from an installation with regular manifests is a case of running
the installation process, *in reverse*, using the delete command of `kubectl`.

Delete the installation manifests using a link to your currently running version
`vX.Y.Z` like so:
> **Warning**: This command will also remove installed cert-manager CRDs. All
> cert-manager resources (e.g. `certificates.cert-manager.io` resources) will
> be removed by Kubernetes' garbage collector.

```bash
$ kubectl delete -f https://github.com/jetstack/cert-manager/releases/download/vX.Y.Z/cert-manager.yaml
```

### Namespace Stuck in Terminating State

If the namespace has been marked for deletion without deleting the cert-manager
installation first, the namespace may become stuck in a terminating state. This
is typically due to the fact that the [`APIService`](https://kubernetes.io/docs/tasks/access-kubernetes-api/setup-extension-api-server) resource still exists
however the webhook is no longer running so is no longer reachable. To resolve
this, ensure you have run the above commands correctly, and if you're still
experiencing issues then run:

```bash
$ kubectl delete apiservice v1beta1.webhook.cert-manager.io
```
