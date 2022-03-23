---
title: Installation
description: 'cert-manager installation: Overview'
---

Below you will find details on various scenarios we aim to support and that are
compatible with the documentation on this website. Furthermore, the most applicable
install methods are listed below for each of the situations.

## Default static install

> You don't require any tweaking of the cert-manager install parameters.

The default static configuration can be installed as follows:
```bash
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.6.3/cert-manager.yaml
```
More information on this install method [can be found here](./kubectl.md).

## Getting started

> You quickly want to learn how to use cert-manager and what it can be used for.

We recommend [cmctl x install](./cmctl.md) to quickly install cert-manager and [interact with cert-manager resources](../usage/cmctl.md) from the command line.

Or if you prefer Helm or if you don't want to install `cmctl`, you can [use helm to install cert-manager](./helm.md).

In case you are running on an OpenShift cluster, consider installing via [cert-manager on OperatorHub.io](./operator-lifecycle-manager.md).

## Continuous deployment

> You know how to configure your cert-manager setup and want to automate this.

You can use either `helm template` or `cmctl x install --dry-run` to generate customized cert-manager installation manifests.
See [Output YAML using cmctl x install](./cmctl.md#output-yaml) and [Output YAML using helm template](./helm.md#output-yaml) for more details.
This templated cert-manager manifest can be piped into your preferred deployment tool.

In case you are using Helm for automation, cert-manager [supports installing using Helm](./helm.md).