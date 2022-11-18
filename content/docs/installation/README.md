---
title: Installation
description: Learn about the various ways you can install cert-manager and how to choose between them
---

Learn about the various ways you can install cert-manager and how to choose between them.

## Default static install

> You don't require any tweaking of the cert-manager install parameters.

The default static configuration can be installed as follows:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.1/cert-manager.yaml
```

📖 Read more about [installing cert-manager using kubectl apply and static manifests](./kubectl.md).

## Getting started

> You quickly want to learn how to use cert-manager and what it can be used for.

📖 **kubectl apply**: For new users we recommend [installing cert-manager using kubectl apply and static manifests](./kubectl.md).

📖 **helm**: You can [use helm to install cert-manager](./helm.md) and this also allows you to customize the installation if necessary.

📖 **OperatorHub**: If you have an OpenShift cluster, consider [installing cert-manager via OperatorHub](./operator-lifecycle-manager.md),
which you can do from the OpenShift web console.

🚧 **cmctl**: Try the [experimental `cmctl x install` command](../reference/cmctl.md#install) to quickly install cert-manager.

## Continuous deployment

> You know how to configure your cert-manager setup and want to automate this.

📖 **helm**: You can use [the cert-manager Helm chart](./helm.md) directly with systems like Flux, ArgoCD and Anthos.

📖 **helm template**: You can use `helm template` to generate customized cert-manager installation manifests.
See [Output YAML using helm template](./helm.md#output-yaml) for more details.
This templated cert-manager manifest can be piped into your preferred deployment tool.
