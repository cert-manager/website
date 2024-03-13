---
title: Installing trust-manager
description: 'Installation guide for trust-manager'
---

## Installation Steps

### 1. Install trust-manager

Helm is the easiest way to install trust-manager and comes with a publicly trusted certificate bundle package
(for the`useDefaultCAs` source) derived from Debian containers.

When installed via Helm, trust-manager has a dependency on cert-manager for provisioning an application certificate,
and as such trust-manager is also installed into the cert-manager namespace.

```bash
helm repo add jetstack https://charts.jetstack.io --force-update

helm upgrade cert-manager jetstack/cert-manager \
  --install \
  --create-namespace \
  --namespace cert-manager \
  --set installCRDs=true

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

## Usage

> 📖 Read the [trust-manager docs](./README.md).
