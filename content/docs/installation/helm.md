---
title: Helm
description: 'cert-manager installation: Using Helm'
---

## Installing with Helm

cert-manager provides Helm charts as a first-class method of installation on both Kubernetes and OpenShift.

Be sure never to embed cert-manager as a sub-chart of other Helm charts; cert-manager manages
non-namespaced resources in your cluster and care must be taken to ensure that it is installed exactly once.

### Prerequisites

- [Install Helm version 3 or later](https://helm.sh/docs/intro/install/).
- Install a [supported version of Kubernetes or OpenShift](../releases/README.md).
- Read [Compatibility with Kubernetes Platform Providers](./compatibility.md) if you are using Kubernetes on a cloud platform.

### Installing cert-manager

#### 1. Add the Helm repository

This repository is the only supported source of cert-manager charts. There are some other mirrors and copies across the internet, but those are entirely unofficial and could present a security risk.

Notably, the "Helm stable repository" version of cert-manager is deprecated and should not be used.

```bash
helm repo add jetstack https://charts.jetstack.io --force-update
```

#### 2. Install cert-manager

To install the cert-manager Helm chart, use the [Helm install command](https://helm.sh/docs/helm/helm_install/) as described below.

```bash
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version [[VAR::cert_manager_latest_version]] \
  --set crds.enabled=true
```

#### 3. (optional) Verify installation

Once you have deployed cert-manager, you can [verify](./kubectl.md#verify) the installation.

### Installation options

A full list of available Helm values is on [cert-manager's ArtifactHub page](https://artifacthub.io/packages/helm/cert-manager/cert-manager).

The example below shows how to tune the cert-manager installation by overwriting the default Helm values:

```bash
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version [[VAR::cert_manager_latest_version]] \
  --set crds.enabled=true \
  --set prometheus.enabled=false \  # Example: disabling prometheus using a Helm parameter
  --set webhook.timeoutSeconds=4   # Example: changing the webhook timeout using a Helm parameter
```

### Installing cert-manager as subchart

If you have configured cert-manager as a subchart all the components of cert-manager will be installed into the namespace of the helm release you are installing.

There may be a situation where you want to specify the namespace to install cert-manager different to the umbrella chart's namespace.

This is a [known issue](https://github.com/helm/helm/issues/5358) with helm and subcharts, that you can't specify the namespace for the subchart and is being solved by most public charts by allowing users to set the namespace via the values file, but needs to be a capability added to the chart by the maintainers.

This capability is now available in the cert-manager chart and can be set either in the values file or via the `--set` switch.

#### Example usage

Below is an example `Chart.yaml` with cert-manager as a subchart

```yaml
apiVersion: v2
name: example_chart
description: A Helm chart with cert-manager as subchart
type: application
version: 0.1.0
appVersion: "0.1.0"
dependencies:
  - name: cert-manager
    version: [[VAR::cert_manager_latest_version]]
    repository: https://charts.jetstack.io
    alias: cert-manager
    condition: cert-manager.enabled
```

You can then override the namespace in 2 ways:

1. In `Values.yaml` file
```yaml
cert-manager: #defined by either the name or alias of your dependency in Chart.yaml
  namespace: security
```

2. In the helm command using `--set`
```bash
helm install example example_chart \
  --namespace example \
  --create-namespace \
  --set cert-manager.namespace=security
```

The above example will install cert-manager into the security namespace.

## Output YAML

Instead of directly installing cert-manager using Helm, a static YAML manifest can be created using the [Helm template command](https://helm.sh/docs/helm/helm_template/).
This static manifest can be tuned by providing the flags to overwrite the default Helm values:

```bash
helm template \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version [[VAR::cert_manager_latest_version]] \
  --set crds.enabled=true \
  # --set prometheus.enabled=false \   # Example: disabling prometheus using a Helm parameter
  > cert-manager.custom.yaml
```

## Uninstalling

> **Warning**: To uninstall cert-manager you should always use the same process for
> installing but in reverse. Deviating from the following process whether
> cert-manager has been installed from static manifests or Helm can cause issues
> and potentially broken states. Please ensure you follow the below steps when
> uninstalling to prevent this happening.

Before continuing, ensure that all cert-manager resources that have been created
by users have been deleted. You can check for any existing resources with the
following command:

```bash
kubectl get Issuers,ClusterIssuers,Certificates,CertificateRequests,Orders,Challenges --all-namespaces
```

Once all these resources have been deleted you are ready to uninstall
cert-manager using the procedure determined by how you installed.

### Uninstalling with Helm

Uninstalling cert-manager from a `helm` installation is a case of running the
installation process, *in reverse*, using the delete command on both `kubectl`
and `helm`.

```terminal
$ helm uninstall cert-manager -n cert-manager

These resources were kept due to the resource policy:
[CustomResourceDefinition] certificaterequests.cert-manager.io
[CustomResourceDefinition] certificates.cert-manager.io
[CustomResourceDefinition] challenges.acme.cert-manager.io
[CustomResourceDefinition] clusterissuers.cert-manager.io
[CustomResourceDefinition] issuers.cert-manager.io
[CustomResourceDefinition] orders.acme.cert-manager.io

release "cert-manager" uninstalled
```

As shown in the output, the `CustomResourceDefinition` for `Issuers`,`ClusterIssuers`,`Certificates`,`CertificateRequests`,`Orders` and `Challenges` are not removed by the Helm uninstall command.
This is to prevent data loss, as removing the `CustomResourceDefinition` would also remove all instances of those resources.

> ☢️ This will remove all `Issuers`,`ClusterIssuers`,`Certificates`,`CertificateRequests`,`Orders` and `Challenges` resources from the cluster:
>
> ```terminal
> kubectl delete crd \
>   issuers.cert-manager.io \
>   clusterissuers.cert-manager.io \
>   certificates.cert-manager.io \
>   certificaterequests.cert-manager.io \
>   orders.acme.cert-manager.io \
>   challenges.acme.cert-manager.io
> ```

> ⚠️ cert-manager versions prior to `v1.15.0` do not keep the `CustomResourceDefinition` on uninstall
> and will remove all `Issuers`,`ClusterIssuers`,`Certificates`,`CertificateRequests`,`Orders` and `Challenges`
> resources from the cluster. Make sure to back up your cert-manager resources
> before uninstalling cert-manager if you are using a version prior to `v1.15.0`. Or upgrade to `v1.15.0`
> before uninstalling.

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

## Using the Flux Helm Controller

The cert-manager Helm chart can be installed and upgraded by the Flux Helm Controller.

> 📖 Read more at [Continuous Deployment: Using the Flux Helm Controller](./continuous-deployment-and-gitops.md).
