---
title: Continuous Deployment
description: Learn how to automate the installation of cert-manager using tools like Flux and Argo CD
---

Learn how to automate the installation of cert-manager using tools like Flux and Argo CD.

## Introduction

You can use [the cert-manager Helm chart](./helm.md) directly with tools like Flux, ArgoCD and Anthos,
and you can [output YAML using helm template](./helm.md#output-yaml) to generate customized cert-manager installation manifests,
which can be piped into your preferred deployment tool.

This page contains notes about how to install cert-manager with *some* of these tools.

> 📢 Please help us improve this page
> by contributing notes or short tutorials about using cert-manager with common GitOps and continuous deployment tools.

## Using the Flux Helm Controller

The cert-manager Helm chart can be installed by the [Flux Helm Controller](https://fluxcd.io/flux/components/helm/).

First create a [`HelmRepository` resource](https://fluxcd.io/flux/components/source/helmrepositories/),
configured with URL of the cert-manager Helm repository.
Then create a [`HelmRelease` resource](https://fluxcd.io/flux/components/helm/helmreleases/),
configured with your desired cert-manager chart values and release.

Here is an example which installs the latest patch version of the cert-manager 1.12 release,
and then upgrades to the latest patch version of the 1.13 release.

> ⚠️ This is a simple example which may not be suitable for production use.
> You should also refer to the [official Flux example repo](https://github.com/fluxcd/flux2-kustomize-helm-example),
> where cert-manager is now fully integrated.
> It shows how to deploy ClusterIssuer resources in the right order,
> after cert-manager CRDs and controller have been installed.

### Prerequisites

You'll need the [`flux` CLI](https://fluxcd.io/flux/cmd/)
and a Kubernetes cluster with [Flux installed](https://fluxcd.io/flux/installation/).

Here's how to quickly install Flux on a [Kind](https://kind.sigs.k8s.io/) cluster:

```bash
kind create cluster
flux check --pre
flux install
flux check
```

### Create a `HelmRepository` resource

```bash
flux create source helm cert-manager --url oci://quay.io/jetstack/charts
```

### Create a `HelmRelease` resource

Put your Helm chart values in a `values.yaml` file.
Use the `crds.enabled` value, so that Flux can install and upgrade the CRD resources.

```yaml
# values.yaml
crds:
  enabled: true
```

```bash
flux create helmrelease cert-manager \
  --chart cert-manager \
  --source HelmRepository/cert-manager.flux-system \
  --release-name cert-manager \
  --target-namespace cert-manager \
  --create-target-namespace \
  --values values.yaml \
  --chart-version 1.12.x
```

### Updates and Upgrades

And when you want to upgrade to the cert-manager 1.13 release,
you can simply update the partial semantic version in the chart version:

```bash
flux create helmrelease cert-manager \
  --chart cert-manager \
  --source HelmRepository/cert-manager.flux-system \
  --release-name cert-manager \
  --target-namespace cert-manager \
  --create-target-namespace \
  --values values.yaml \
  --chart-version 1.13.x
```

### Troubleshooting

Check Flux events and logs for warnings and errors:

```bash
flux events
flux logs
```

Use `cmctl` to check for problems with the cert-manager webhook or CRDs:

```bash
cmctl check api
cmctl version -o yaml
```

Check the cert-manager logs for warnings and errors:

```bash
kubectl logs -n cert-manager -l app.kubernetes.io/instance=cert-manager --prefix --all-containers
```


## Using ArgoCD
Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes.

### Pre-requisites
Ensure the following are in place before proceeding:
- A Kubernetes cluster
- ArgoCD deployed on the Kubernetes cluster: [installation guide](https://argo-cd.readthedocs.io/en/stable/getting_started/)
- Optional: A GitOps repository connected with ArgoCD: [setup guide](https://argo-cd.readthedocs.io/en/stable/user-guide/private-repositories/)

### Setting up cert-manager
1. Create an [ArgoCD Application](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#applications) manifest file with the provided configuration to set up cert-manager.

    ```yaml
    # application.yaml
    apiVersion: argoproj.io/v1alpha1
    kind: Application
    metadata:
      name: cert-manager
      namespace: argocd
      annotations:
        argocd.argoproj.io/sync-options: SkipDryRunOnMissingResource=true
      finalizers:
        - resources-finalizer.argocd.argoproj.io
    spec:
      destination:
        namespace: cert-manager
        server: https://kubernetes.default.svc
      project: default
      source:
        chart: cert-manager
        repoURL: https://charts.jetstack.io
        targetRevision: [[VAR::cert_manager_latest_version]]
        helm:
          values: |
            installCRDs: true
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
        syncOptions:
          - CreateNamespace=true
    ```
2. Commit the manifest file and sync the changes in ArgoCD. If a GitOps repository is not set up, use `kubectl apply -f application.yaml` to apply the manifest [installation guide for kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl).
3. ArgoCD will synchronize the `DESIRED MANIFEST` and deploy cert-manager on Kubernetes based on the provided configuration.


### Troubleshooting

#### Scenario 1:
`OutOfSync` cert-manager in the AKS (Azure Kubernetes Service) cluster

##### Issue:
cert-manager in the AKS cluster remains `OutOfSync` due to discrepancies between the `DESIRED MANIFEST` and `LIVE MANIFEST` files.

##### Potential Reasons
Multiple factors could cause the `OutOfSync` issue; refer to [ArgoCD documentation](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/#diffing-customization) for potential causes.

##### Example configuration differences
The below configurations are observed to be present in the `LIVE MANIFEST` but not in the `DESIRED MANIFEST` file.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- admissionReviewVersions:
  namespaceSelector:
    matchExpressions:
        ...
        ...
        - key: control-plane
          operator: NotIn
          values:
            - 'true'
        - key: kubernetes.azure.com/managedby
          operator: NotIn
          values:
            - aks
```

##### Root Cause Analysis
The discrepancy stems from how AKS manages admission controllers to protect internal services in the `kube-system` namespace. More details can be found in [Frequently Asked Questions about Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/faq#can-admission-controller-webhooks-impact-kube-system-and-internal-aks-namespaces)

##### Suggested Fix
It is also possible to ignore differences from fields owned by specific managers defined in `metadata.managedFields` in live resources. More details can be found in [(ArgoCD) Diffing Customization](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/#application-level-configuration)

To resolve this issue, modify the cert-manager manifest file under spec to ignore specific differences:
```
ignoreDifferences:
  - group: admissionregistration.k8s.io
    kind: ValidatingWebhookConfiguration
    name: cert-manager-webhook
    jqPathExpressions:
      - .webhooks[].namespaceSelector.matchExpressions[] | select(.key == "control-plane")
      - .webhooks[].namespaceSelector.matchExpressions[] | select(.key == "kubernetes.azure.com/managedby")
```

In that case, the updated cert-manager manifest would be as follows:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cert-manager
  namespace: argocd
  annotations:
    argocd.argoproj.io/sync-options: SkipDryRunOnMissingResource=true
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  destination:
    namespace: cert-manager
    server: https://kubernetes.default.svc
  project: default
  source:
    chart: cert-manager
    repoURL: https://charts.jetstack.io
    targetRevision: [[VAR::cert_manager_latest_version]]
    helm:
      values: |
        installCRDs: true
  ignoreDifferences:
  - group: admissionregistration.k8s.io
    kind: ValidatingWebhookConfiguration
    name: cert-manager-webhook
    jqPathExpressions:
      - .webhooks[].namespaceSelector.matchExpressions[] | select(.key == "control-plane")
      - .webhooks[].namespaceSelector.matchExpressions[] | select(.key == "kubernetes.azure.com/managedby")
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Once ArgoCD syncs the updated manifest, the differences due to the above two keys will be ignored, and cert-manager will be in a complete synchronization state.
