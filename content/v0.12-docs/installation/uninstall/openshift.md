---
title: Uninstalling on OpenShift
description: 'cert-manager installation: Uninstalling cert-manager from OpenShift'
---

Below is the processes for uninstalling cert-manager on OpenShift.

> *Warning*: To uninstall cert-manger you should always use the same process for
> installing but in reverse. Deviating from the following process can cause
> issues and potentially broken states. Please ensure you follow the below steps
> when uninstalling to prevent this happening.

## Login to your OpenShift cluster

Before you can uninstall cert-manager, you must first ensure your local machine
is configured to talk to your OpenShift cluster using the `oc` tool.

Login to the OpenShift cluster as the system:admin user
```bash
$ oc login -u system:admin
```

## Uninstalling with regular manifests

Before continuing, ensure that all cert-manager resources that have been created
by users have been deleted. You can check for any existing resources with the
following command:

```bash
$ oc get Issuers,ClusterIssuers,Certificates,CertificateRequests,Orders,Challenges --all-namespaces
```

Once all these resources have been deleted you are ready to uninstall
cert-manager.

Uninstalling from an installation with regular manifests is a case of running
the installation process, *in reverse*, using the delete command of `oc`.

Delete the installation manifests using a link to your currently running version
`vX.Y.Z` like so:

```bash
$ oc delete -f https://github.com/jetstack/cert-manager/releases/download/vX.Y.Z/cert-manager-openshift.yaml
```

## Namespace Stuck in Terminating State

If the namespace has been marked for deletion without deleting the cert-manager
installation first, the namespace may become stuck in a terminating state. This
is typically due to the fact that the
[`APIService`](https://kubernetes.io/docs/tasks/access-kubernetes-api/setup-extension-api-server)
resource still exists however the webhook is no longer running so is no longer
reachable. To resolve this, ensure you have run the above commands correctly,
and if you're still experiencing issues then run:

```bash
$ oc delete apiservice v1beta1.webhook.cert-manager.io
```