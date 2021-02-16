---
title: "CRDs"
linkTitle: "CRDs"
weight: 70
type: "docs"
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

cert-manager at time of writing has 4 CRD versions in use.

These versions are defined in [`//pkg/apis/certmanager`](https://github.com/jetstack/cert-manager/tree/master/pkg/apis/certmanager). ACME related resources are in `//pkg/apis/acme`.

This has the versions `v1alpha2`, `v1alpha3`, `v1beta1` and `v1`.
If you need to introduce a new field in any of them it **must** be present in all 4 versions so conversion can be used.

Code comments on these fields are being converted into documentation on our website and text of `kubectl explain`.
These comments should be written to be user-facing not developer-facing, they also break the Go standards of code comments on purpose for this reason.

We also have an internal API version, it lives at [`//pkg/internal/apis`](https://github.com/jetstack/cert-manager/tree/master/pkg/internal/apis).
This is a version that is only used for validation and conversion, controllers should not use it as it is not meant to be user-friendly and not stable.
However all new fields also have to be added here for the conversion logic to work.


## Kubebuilder

While cert-manager doesn't fully use Kubebuilder for everything CRDs can make use of special Kubebuilder flags such as [validation flags](https://book.kubebuilder.io/reference/markers/crd-validation.html). We recommend reading the Kubebuilder book to learn more about them!
