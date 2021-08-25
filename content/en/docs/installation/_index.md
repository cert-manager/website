---
title: "Installation"
linkTitle: "Installation"
weight: 10
type: "docs"
---

Below you will find details on various scenarios we aim to support and that are
compatible with the documentation on this website. Furthermore, the most applicable
install methods are listed below for each of the situations.

## Default static install

> You don't require any tweaking of the cert-manager install parameters.

The default static configuration can be installed as follows:
```bash
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.4.4/cert-manager.yaml
```
More information on this install method [can be found here](./kubectl/).

## Getting started

> You quickly want to learn how to use cert-manager and what it can be used for.

The [Helm chart](./helm/) allows installing cert-managers resources customized based on the provided Helm values.

The [kubectl plugin](../usage/kubectl-plugin/) can be used for more easily interacting with cert-manager resources.

In case you are running on an OpenShift cluster, consider installing via [cert-manager on OperatorHub.io](./operator-lifecycle-manager/).

## Continuous deployment

> You know how to configure your cert-manager setup and want to automate this.

The Helm template command can export [generated YAML to stdout](./helm/#output-yaml).
This templated cert-manager manifest can be piped into your preferred deployment tool.

In case you are using Helm for automation, cert-manager [supports installing using Helm](./helm/).
