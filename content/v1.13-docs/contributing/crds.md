---
title: CRDs
description: 'cert-manager contribution guide: CRDs'
---

cert-manager uses [Kubernetes Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to define
the resources which users interact with when using cert-manager, such as `Certificate`s and `Issuer`s.

When changes are made to the CRDs in code, there are a couple of extra steps which are required.

## Generating CRD Updates

We use [`controller-gen`](https://book.kubebuilder.io/reference/controller-gen.html) to update our CRDs, and [`k8s-code-generator`](https://github.com/kubernetes/code-generator)
for code generation.

Verifying and updating CRDs and generated code can be done entirely through make. There are two steps; one will update CRDs and one will update generated code:

```bash
# Check that CRDs and codegen are up to date
make verify-crds verify-codegen

# Update CRDs based on code
make update-crds

# Update generated code based on CRD defintions in code
make update-codegen
```

## Versions

cert-manager currently has a single `v1` API version for public use.

cert-manager API types are defined in [`pkg/apis/certmanager`](https://github.com/cert-manager/cert-manager/tree/master/pkg/apis/certmanager).

ACME related resources are in [`pkg/apis/acme`](https://github.com/cert-manager/cert-manager/tree/master/pkg/apis/acme).

### Code Comments

Code comments on API type fields are converted into documentation on this website as well as appearing in the output of `kubectl explain`.

That means that `go doc`-style comments on API fields should be written to be user-facing and not developer-facing. For this reason it's also fine to break from
usual Go standards regarding code comments when editing these fields.

### Internal API Versions

cert-manager also has an internal API version which lives under [`internal/apis`](https://github.com/cert-manager/cert-manager/tree/master/internal/apis).

The internal version is only used for validation and conversion and controllers should not generally use it; it's not intended to be user-friendly or stable and can change.
However all new fields also have to be added here for the conversion logic to work.

For details on conversion and versions, see the [official Kubernetes docs for CRD versioning](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/).

## Kubebuilder

While cert-manager doesn't fully use Kubebuilder, CRDs can make use of special Kubebuilder flags such as [validation flags](https://book.kubebuilder.io/reference/markers/crd-validation.html).

## Making Changes to APIs

Please see our [API compatibility promise](../installation/api-compatibility.md) for details on which types of changes to APIs are acceptable.

Generally, the gist is that new fields can be added but that existing fields cannot be removed.

This also means that when a field is added to a version of the API, it's permanent and its name cannot be changed. Because of this, we try to be cautious when adding new fields.

The same principles apply to [constants and enumerated types](https://kubernetes.io/docs/reference/using-api/deprecation-policy/#enumerated-or-constant-values).
