---
title: "Helm"
linkTitle: "Helm"
weight: 22
type: "docs"
---

> Note: From cert-manager `v1.2.0` onward, the minimum supported version of
> Kubernetes is `v1.16.0`. Users still running Kubernetes `v1.15` or below should
> upgrade to a supported version before installing cert-manager.

> **Warning**: You should not install multiple instances of cert-manager on a single
> cluster. This will lead to undefined behavior and you may be banned from
> providers such as Let's Encrypt.

## Installing with Helm

> **Note**: cert-manager should never be embedded as a sub-chart into other Helm charts.
> cert-manager manages non-namespaced resources in your cluster and should only be installed once.

### Prerequisites

- Helm v3 installed

### Steps

In order to install the Helm chart, you must follow these steps:

#### 1. Add the Jetstack Helm repository:

> **Warning**: It is important that this repository is used to install
> cert-manager. The version residing in the [Helm stable repository](https://github.com/helm/charts/tree/master/stable/cert-manager) is
> *deprecated* and should *NOT* be used.

```bash
$ helm repo add jetstack https://charts.jetstack.io
```

#### 2. Update your local Helm chart repository cache:

```bash
$ helm repo update
```

#### 3. Install `CustomResourceDefinitions`

cert-manager requires a number of CRD resources to be installed into your
cluster as part of installation.

This can either be done manually, using `kubectl`, or using the `installCRDs`
option when installing the Helm chart.

> **Note**: If you're using a `helm` version based on Kubernetes `v1.18` or below (Helm `v3.2`) `installCRDs` will not work with cert-manager `v0.16`.
> For more info see the [v0.16 upgrade notes](../upgrading/upgrading-0.15-0.16/#helm)

##### Option 1: installing CRDs with `kubectl`

Install the `CustomResourceDefinition` resources using `kubectl`:

```bash
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.4.0/cert-manager.crds.yaml
```

##### Option 2: install CRDs as part of the Helm release

To automatically install and manage the CRDs as part of your Helm release, you
must add the `--set installCRDs=true` flag to your Helm installation command.

Uncomment the relevant line in the next steps to enable this.

#### 3. Install cert-manager

To install the cert-manager Helm chart, use the [Helm install command](https://helm.sh/docs/helm/helm_install/) as described below.

```bash
$ helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.4.0 \
  # --set installCRDs=true
```

On the [cert-manager's ArtifactHub page](https://artifacthub.io/packages/helm/cert-manager/cert-manager) a full list of the available **Helm values** can be found.

The example below shows how to tune the cert-manager installation by overwriting the default Helm values:

```bash
$ helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.4.0 \
  --set prometheus.enabled=false \  # Example: disabling prometheus using a Helm parameter
  --set webhook.timeoutSeconds=4s   # Example: changing the wehbook timeout using a Helm parameter
```

Once you have deployed cert-manager, you can verify the installation
[here](../verify/).

## Output YAML

Instead of directly installing cert-manager using Helm, a static YAML manifest can be created using the [Helm template command](https://helm.sh/docs/helm/helm_template/).
This static manifest can be tuned by providing the flags to overwrite the default Helm values:

```bash
$ helm template \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.4.0 \
  # --set prometheus.enabled=false \   # Example: disabling prometheus using a Helm parameter
  # --set installCRDs=true \           # Uncomment to also template CRDs
  > cert-manager.custom.yaml
```

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

### Uninstalling with Helm

Uninstalling cert-manager from a `helm` installation is a case of running the
installation process, *in reverse*, using the delete command on both `kubectl`
and `helm`.


```bash
$ helm --namespace cert-manager delete cert-manager
```

Next, delete the cert-manager namespace:

```bash
$ kubectl delete namespace cert-manager
```

Finally, delete the cert-manger
[`CustomResourceDefinitions`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
using the link to the version `vX.Y.Z` you installed:
> **Warning**: This command will also remove installed cert-manager CRDs. All
> cert-manager resources (e.g. `certificates.cert-manager.io` resources) will
> be removed by Kubernetes' garbage collector.

```bash
$ kubectl delete -f https://github.com/jetstack/cert-manager/releases/download/vX.Y.Z/cert-manager.crds.yaml
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
