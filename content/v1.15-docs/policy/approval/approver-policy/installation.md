---
title: Installing approver-policy
description: 'Installation guide for the approver-policy policy plugin for cert-manager'
---

## Installation Steps

### 1. Install cert-manager

[cert-manager must be installed](../../../installation/README.md), and
the [the default approver in cert-manager must be disabled](../../../usage/certificaterequest.md#approver-controller).

> ⚠️ If the default approver is not disabled in cert-manager, approver-policy will
> race with cert-manager and policy will be ineffective.

If you install cert-manager using `helm install` or `helm upgrade`,
you can disable the default approver by [Customizing the Chart Before Installing](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing) using the `--set` or `--values` command line flags:

```
# ⚠️ This Helm option is only available in cert-manager v1.15.0 and later.

# Example --set value
--set disableAutoApproval=true
```

```yaml
# ⚠️ This Helm option is only available in cert-manager v1.15.0 and later.

# Example --values file content
disableAutoApproval: true
```

Here's a example which reconfigure an installed cert-manager to run without auto-approver:

```terminal
# ⚠️ This Helm option is only available in cert-manager v1.15.0 and later.

existing_cert_manager_version=$(helm get metadata -n cert-manager cert-manager | grep '^VERSION' | awk '{ print $2 }')
helm upgrade cert-manager jetstack/cert-manager \
  --reuse-values \
  --namespace cert-manager \
  --version $existing_cert_manager_version \
  --set disableAutoApproval=true
```

### 2. Install approver-policy

To install approver-policy:

```terminal
helm repo add jetstack https://charts.jetstack.io --force-update

helm upgrade cert-manager-approver-policy jetstack/cert-manager-approver-policy \
  --install \
  --namespace cert-manager \
  --wait
```

If you are using approver-policy with [external
issuers](../../../configuration/issuers.md), you _must_
include their signer names so that approver-policy has permissions to approve
and deny CertificateRequests that
[reference them](../../../usage/certificaterequest.md#rbac-syntax).
For example, if using approver-policy for the internal issuer types, along with
[google-cas-issuer](https://github.com/jetstack/google-cas-issuer), and
[aws-privateca-issuer](https://github.com/cert-manager/aws-privateca-issuer),
set the following values when installing:

```terminal
helm upgrade cert-manager-approver-policy jetstack/cert-manager-approver-policy \
  --install \
  --namespace cert-manager \
  --wait \
  --set app.approveSignerNames="{\
issuers.cert-manager.io/*,clusterissuers.cert-manager.io/*,\
googlecasclusterissuers.cas-issuer.jetstack.io/*,googlecasissuers.cas-issuer.jetstack.io/*,\
awspcaclusterissuers.awspca.cert-manager.io/*,awspcaissuers.awspca.cert-manager.io/*\
}"
```

## Uninstalling

To uninstall approver-policy installed via Helm, run:

```terminal
$ helm uninstall cert-manager-approver-policy --namespace cert-manager
These resources were kept due to the resource policy:
[CustomResourceDefinition] certificaterequestpolicies.policy.cert-manager.io

release "cert-manager-approver-policy" uninstalled
```

As shown in the output, the `CustomResourceDefinition` for `CertificateRequestPolicy`
is not removed by the Helm uninstall command. This to prevent data loss, as removing
the `CustomResourceDefinition` will also remove all `CertificateRequestPolicy` resources.

> ☢️ This will remove all `CertificateRequestPolicy` resources from the cluster:
> 
> ```terminal
> $ kubectl delete crd certificaterequestpolicies.policy.cert-manager.io
> ```

> ⚠️ approver-policy versions prior to `v0.13.0` do not keep the `CustomResourceDefinition` on uninstall
> and will remove all `CertificateRequestPolicy` resources from the cluster. Make sure to back up your
> `CertificateRequestPolicy` resources before uninstalling approver-policy if you are using a version
> prior to `v0.13.0`. Or upgrade to `v0.13.0` before uninstalling.

## Usage

> 📖 Read the [approver-policy docs](./README.md).
