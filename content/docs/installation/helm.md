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

### Steps

#### 1. Add the Helm repository

This repository is the only supported source of cert-manager charts. There are some other mirrors and copies across the internet, but those are entirely unofficial and could present a security risk.

Notably, the "Helm stable repository" version of cert-manager is deprecated and should not be used.

```bash
helm repo add jetstack https://charts.jetstack.io --force-update
```

#### 2. Install `CustomResourceDefinitions`

cert-manager requires a number of CRD resources, which can  be installed manually using `kubectl`,
or using the `installCRDs` option when installing the Helm chart. Both options
are described below and will achieve the same result but with varying
consequences. You should consult the [CRD Considerations](#crd-considerations)
section below for details on each method.

##### Option 1: installing CRDs with `kubectl`

> Recommended for production installations

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/[[VAR::cert_manager_latest_version]]/cert-manager.crds.yaml
```

##### Option 2: install CRDs as part of the Helm release

> Recommended for ease of use & compatibility

To automatically install and manage the CRDs as part of your Helm release, you
must add the `--set installCRDs=true` flag to your Helm installation command.

Uncomment the relevant line in the next steps to enable this.

Note that if you're using a `helm` version based on Kubernetes `v1.18` or below (Helm `v3.2`), `installCRDs` will not work with cert-manager `v0.16`. See the [v0.16 upgrade notes](../releases/upgrading/upgrading-0.15-0.16.md#helm) for more details.

#### 3. Install cert-manager

To install the cert-manager Helm chart, use the [Helm install command](https://helm.sh/docs/helm/helm_install/) as described below.

```bash
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version [[VAR::cert_manager_latest_version]] \
  # --set installCRDs=true
```

A full list of available Helm values is on [cert-manager's ArtifactHub page](https://artifacthub.io/packages/helm/cert-manager/cert-manager).

The example below shows how to tune the cert-manager installation by overwriting the default Helm values:

```bash
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version [[VAR::cert_manager_latest_version]] \
  # --set installCRDs=true
  --set prometheus.enabled=false \  # Example: disabling prometheus using a Helm parameter
  --set webhook.timeoutSeconds=4   # Example: changing the webhook timeout using a Helm parameter
```

Once you have deployed cert-manager, you can [verify](./kubectl.md#verify) the installation.

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
  # --set prometheus.enabled=false \   # Example: disabling prometheus using a Helm parameter
  # --set installCRDs=true \           # Uncomment to also template CRDs
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

```bash
helm --namespace cert-manager delete cert-manager
```

Next, delete the cert-manager namespace:

```bash
kubectl delete namespace cert-manager
```

Finally, delete the cert-manager
[`CustomResourceDefinitions`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
using the link to the version `vX.Y.Z` you installed:
> **Warning**: This command will also remove installed cert-manager CRDs. All
> cert-manager resources (e.g. `certificates.cert-manager.io` resources) will
> be removed by Kubernetes' garbage collector.

```bash
kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/vX.Y.Z/cert-manager.crds.yaml
```

*Note:* If you used `helm` to install the CRDs with the `installCRDs=true`
value for the chart, then the CRDs will have been automatically removed and
you do not need to run this final `kubectl` command.

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

## CRD considerations

### kubectl installation

When installing CRDs with `kubectl`, you will need to upgrade these in tandem
with your cert-manager installation upgrades. This approach may be useful when
you do not have the ability to install CRDs all the time in your environment.
If you do not upgrade these as you upgrade cert-manager itself, you may miss
out on new features for cert-manager.

Benefits:

- CRDs will not change once applied

Drawbacks:

- CRDs are not automatically updated and need to be reapplied before
  upgrading cert-manager
- You may have different installation processes for CRDs compared to
  the other resources.

### helm installation

cert-manager **does not use** the [official helm method](https://helm.sh/docs/chart_best_practices/custom_resource_definitions/ )
of installing CRD resources. This is because it makes upgrading CRDs
impossible with `helm` CLI alone. The helm team explain the limitations
of their approach [here](https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#some-caveats-and-explanations).

cert-manager actually bundles the CRDs along with the other templates
in the Helm chart. This means that Helm manages these resources so they are
upgraded with your cert-manager release when you use
`installCRDs: true` in your values file or CLI command. This does also mean
that if you uninstall the release, the CRDs will also be uninstalled. If that
happens then you will loose all instances of those CRDs, e.g. all `Certificate`
resources in the cluster. You should consider if this is likely to happen to
you and have a mitigation, such as
[backups](https://cert-manager.io/docs/tutorials/backup/#backing-up-cert-manager-resource-configuration)
or a means to reapply resources from an Infrastructure as Code (IaC) pattern.

**Note** this also means a typo like `installCRD: true` would be an invalid
value and helm would silently ignore this and remove the CRDs when you next
run your `helm upgrade`.

Benefits:

- CRDS are automatically updated when you upgrade cert-manager via `helm`
- Same action manages both CRDs and other installation resources

Drawbacks:

- If you uninstall cert-manager, the CRDs are also uninstalled.
- Helm values need to be correct to avoid accidental removal of CRDs.

### CRD Installation Advice

> You should follow the path that makes sense for your environment.

Generally we recommend:

- For **Safety**, install CRDs outside of Helm, e.g. `kubectl`
- For **Ease of use**, install CRDS with `helm`

You may want to consider your approach along with other tools that may offer
helm compatible installs, for a standardized approach to managing CRD
resources. If you have an approach that cert-manager does not currently
support, then please
[raise an issue](https://github.com/cert-manager/cert-manager/issues) to
discuss.

## Using the Flux Helm Controller

The cert-manager Helm chart can be installed and upgraded by the Flux Helm Controller.

> 📖 Read more at [Continuous Deployment: Using the Flux Helm Controller](./continuous-deployment-and-gitops.md).
