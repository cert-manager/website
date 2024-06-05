---
title: Installing trust-manager
description: 'Installation guide for trust-manager'
---

## Installation Steps

### 1. Install trust-manager

Helm is the easiest way to install trust-manager and comes with a publicly trusted certificate bundle package
(for the`useDefaultCAs` source) derived from Debian containers.

```bash
helm repo add jetstack https://charts.jetstack.io --force-update
```

When installed via Helm, trust-manager has a dependency on cert-manager for provisioning an application certificate,
and as such cert-manager must also be installed into the cert-manager namespace.
If you have not already installed cert-manager, you can install it using the following command:

```bash
# Run this command only if you haven't installed cert-manager already
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version [[VAR::cert_manager_latest_version]] \
  --set installCRDs=true
```

```bash
helm upgrade trust-manager jetstack/trust-manager \
  --install \
  --namespace cert-manager \
  --wait
```

## Installation Options

#### Enable Secret targets

`Secret` targets are supported as of trust-manager v0.7.0, but need to be explicitly enabled on the controller.
The feature can be enabled with a Helm value `--set secretTargets.enabled=true`, but since the controller needs
RBAC to read and update secrets, you also need to set `secretTargets.authorizedSecretsAll` or `secretTargets.authorizedSecrets`.
Please consult the
[trust-manager Helm chart docs](https://github.com/cert-manager/trust-manager/blob/main/deploy/charts/trust-manager/README.md#values)
for details and trade-offs.

#### approver-policy Integration

If you're running [approver-policy](../../policy/approval/approver-policy/README.md) then cert-manager's default approver will be disabled which will mean that
trust-manager's webhook certificate will - by default - block when you install the Helm chart until it's manually approved.

As of trust-manager v0.6.0 you can choose to automatically add an approver-policy `CertificateRequestPolicy` which
will approve the trust-manager webhook certificate:

```bash
helm upgrade trust-manager jetstack/trust-manager \
  --install \
  --namespace cert-manager \
  --wait \
  --set app.webhook.tls.approverPolicy.enabled=true \
  --set app.webhook.tls.approverPolicy.certManagerNamespace=cert-manager
```

Note that if you've installed cert-manager to a different namespace, you'll need to pass that namespace in `app.webhook.tls.approverPolicy.certManagerNamespace`!

#### Trust Namespace

One of the more important configuration options you might need to consider at install time is which "trust namespace" to use,
which can be set via the Helm value `app.trust.namespace`.

By default, the trust namespace is the only namespace where`Secret`s will be read. This restriction is in place
for security reasons - we don't want to give trust-manager the permission to read all `Secret`s in all namespaces. With additional configuration, secrets may be read from or written to other namespaces.

The trust namespace defaults to `cert-manager`, but there's no need for it to be set to the namespace that cert-manager
is installed in - trust-manager has no runtime dependency on cert-manager at all! - so we'd recommend setting the trust
namespace to whichever is most appropriate for your environment.

An ideal deployment would be a fresh namespace dedicated entirely to trust-manager, to minimize the number of actors in your
cluster that can modify your trust sources.

## Uninstalling

To uninstall trust-manager installed via Helm, run:

```terminal
$ helm uninstall trust-manager -n cert-manager

These resources were kept due to the resource policy:
[CustomResourceDefinition] bundles.trust.cert-manager.io

release "trust-manager" uninstalled
```

As shown in the output, the `CustomResourceDefinition` for `Bundle` is not removed by the Helm uninstall command.
This is to prevent data loss, as removing the `CustomResourceDefinition` would also remove all `Bundle` resources.

> ☢️ This will remove all `Bundle` resources from the cluster:
>
> ```terminal
> kubectl delete crd bundles.trust.cert-manager.io
> ```

> ⚠️ trust-manager versions prior to `v0.9.0` do not keep the `CustomResourceDefinition` on uninstall
> and will remove all `Bundle` resources from the cluster. Make sure to back up your `Bundle` resources
> before uninstalling trust-manager if you are using a version prior to `v0.9.0`. Or upgrade to `v0.9.0`
> before uninstalling.

## Usage

> 📖 Read the [trust-manager docs](./README.md).
