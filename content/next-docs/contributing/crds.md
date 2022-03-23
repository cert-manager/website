---
title: CRDs
description: 'cert-manager contribution guide: CRDs'
---

cert-manager is a heavy user of [Kubernetes Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
Chances are high that you may need to change something in our Custom Resource Definition. This guide will give you some tips!

## Generating updates

We use [`controller-gen`](https://book.kubebuilder.io/reference/controller-gen.html) to update our CRDs.
This all is handled using Bazel, just run:
```bash
$ ./hack/update-all.sh
```

This will also update the version conversion code if needed.

## Versions

cert-manager currently has a single `v1` API version.

The API types are defined in [`//pkg/apis/certmanager`](https://github.com/cert-manager/cert-manager/tree/master/pkg/apis/certmanager). ACME related resources are in [`//pkg/apis/acme`](https://github.com/cert-manager/cert-manager/tree/master/pkg/apis/certmanager).

Code comments on API type fields are being converted into documentation on our website as well as the output of `kubectl explain`.
These comments should be written to be user-facing not developer-facing, they also break the Go standards of code comments on purpose for this reason.

We also have an internal API version, it lives at [`//pkg/internal/apis`](https://github.com/cert-manager/cert-manager/tree/master/pkg/internal/apis).
This is a version that is only used for validation and conversion, controllers should not use it as it is not meant to be user-friendly and not stable.
However all new fields also have to be added here for the conversion logic to work.

See the [official Kubernetes docs for CRD versioning](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/) to understand conversion, which versions are stored and served etc.


## Kubebuilder

While cert-manager doesn't fully use Kubebuilder for everything CRDs can make use of special Kubebuilder flags such as [validation flags](https://book.kubebuilder.io/reference/markers/crd-validation.html). We recommend reading the Kubebuilder book to learn more about them!


## Making changes to API

Please see our [API compatibility promise](../installation/api-compatibility.md) to understand what changes to API are acceptable- the gist of it is that new fields can be added, but not removed. This also means that when a field is added to a version of the API, it can no longer be removed and its name cannot be changed- so we try to be cautious when adding new fields. Same applies to [constants and enumerated types](https://kubernetes.io/docs/reference/using-api/deprecation-policy/#enumerated-or-constant-values).