---
title: "Project Maturity"
linkTitle: "Project Maturity"
weight: 0
type: "docs"
---

cert-manager has wide adoption in the Kubernetes community with it being in use
in both production and non-production clusters.

## API

The cert-manager API is currently at `v1` and is stable.

## Compatibility

cert-manager has a hard guarantee of compatibility with the current stable upstream
Kubernetes version. Beyond this, cert-manager also aims to be compatible with
versions down to `N-4`, where `N` is the current upstream version release. This
means that if the current version is `v1.20`, cert-manager aims to be compatible
with versions down to `v1.16`. This is done by running periodic end-to-end test
jobs against each version of Kubernetes.

Versions lower than the current Kubernetes version down to `N-4` is *not
guaranteed*. Although considerations will be made to ensure compatibility with as
many versions as possible, it is sometimes required to lose compatibility in
the interest of furthering the feature set of cert-manager and making use of
newer features available in upstream Kubernetes.

As of cert-manager version `v1.2`, the lowest Kubernetes version supported is
`v1.16`.
