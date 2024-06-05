---
title: kubectl apply
description: Learn how to install cert-manager using kubectl and static manifests
---

Learn how to install cert-manager using kubectl and static manifests.

## Prerequisites

- [Install `kubectl` version `>= v1.19.0`](https://kubernetes.io/docs/tasks/tools/). (otherwise, you'll have issues updating the CRDs - see [v0.16 upgrade notes](../releases/upgrading/upgrading-0.15-0.16.md#issue-with-older-versions-of-kubectl))
- Install a [supported version of Kubernetes or OpenShift](../releases/README.md).
- Read [Compatibility with Kubernetes Platform Providers](./compatibility.md) if you are using Kubernetes on a cloud platform.

## Steps

### 1. Install from the cert-manager release manifest

All resources (the CustomResourceDefinitions and the cert-manager, cainjector and webhook components)
are included in a single YAML manifest file:

Install all cert-manager components:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/[[VAR::cert_manager_latest_version]]/cert-manager.yaml
```

By default, cert-manager will be installed into the `cert-manager`
namespace. It is possible to run cert-manager in a different namespace, although
you'll need to make modifications to the deployment manifests.

Once you've installed cert-manager, you can verify it is deployed correctly by
checking the `cert-manager` namespace for running pods:

```bash
$ kubectl get pods --namespace cert-manager

NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-5c6866597-zw7kh               1/1     Running   0          2m
cert-manager-cainjector-577f6d9fd7-tr77l   1/1     Running   0          2m
cert-manager-webhook-787858fcdb-nlzsq      1/1     Running   0          2m
```

You should see the `cert-manager`, `cert-manager-cainjector`, and
`cert-manager-webhook` pods in a `Running` state. The webhook might take a
little longer to successfully provision than the others.

If you experience problems, first check the [FAQ](../faq/README.md).

### 2. (optional) Wait for cert-manager webhook to be ready

The webhook component can take some time to start, and make the Kubernetes API server trust the webhook's certificate.

First, make sure that [cmctl is installed](../reference/cmctl.md#installation).

cmctl performs a dry-run certificate creation check against the Kubernetes cluster.
If successful, the message `The cert-manager API is ready` is displayed.

```bash
$ cmctl check api
The cert-manager API is ready
```

The command can also be used to wait for the check to be successful.
Here is an output example of running the command at the same time that cert-manager is being installed:

```bash
$ cmctl check api --wait=2m
Not ready: the cert-manager CRDs are not yet installed on the Kubernetes API server
Not ready: the cert-manager CRDs are not yet installed on the Kubernetes API server
Not ready: the cert-manager webhook deployment is not ready yet
Not ready: the cert-manager webhook deployment is not ready yet
Not ready: the cert-manager webhook deployment is not ready yet
Not ready: the cert-manager webhook deployment is not ready yet
The cert-manager API is ready
```

<a id="verify"></a>
### 2. (optional) End-to-end verify the installation

Best way to fully verify the installation is to issue a test certificate. For this, we will create a self-signed issuer and a certificate resource in a test namespace.


```bash
$ cat <<EOF > test-resources.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cert-manager-test
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: test-selfsigned
  namespace: cert-manager-test
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: selfsigned-cert
  namespace: cert-manager-test
spec:
  dnsNames:
    - example.com
  secretName: selfsigned-cert-tls
  issuerRef:
    name: test-selfsigned
EOF
```

Create the test resources.
```bash
$ kubectl apply -f test-resources.yaml
```

Check the status of the newly created certificate. You may need to wait a few
seconds before cert-manager processes the certificate request.
```bash
$ kubectl describe certificate -n cert-manager-test

...
Spec:
  Common Name:  example.com
  Issuer Ref:
    Name:       test-selfsigned
  Secret Name:  selfsigned-cert-tls
Status:
  Conditions:
    Last Transition Time:  2019-01-29T17:34:30Z
    Message:               Certificate is up to date and has not expired
    Reason:                Ready
    Status:                True
    Type:                  Ready
  Not After:               2019-04-29T17:34:29Z
Events:
  Type    Reason      Age   From          Message
  ----    ------      ----  ----          -------
  Normal  CertIssued  4s    cert-manager  Certificate issued successfully
```

Clean up the test resources.
```bash
$ kubectl delete -f test-resources.yaml
```

If all the above steps have completed without error, you're good to go!

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
If you plan on reinstalling later and don't want to lose some custom resources, you can keep them.
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
kubectl delete validatingwebhookconfigurations cert-manager-webhook
```

Then change the `.metadata.finalizers` field to an empty list by editing the challenge resource:

```bash
kubectl edit challenge <the-challenge>
```
