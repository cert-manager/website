---
title: "Release Notes"
linkTitle: "v1.2"
weight: 810
type: "docs"
---


# Deprecated Features

1. The `--renew-before-expiration-duration` flag of the cert-manager controller-manager has been deprecated. 
   Please set the `Certificate.Spec.RenewBefore` field instead.
   This flag will be removed in the next release.

1. In an effort to introduce new features whilst keeping the project
   maintainable, cert-manager now only supports Kubernetes down to version
   `v1.16`. This means the `legacy` manifests have now been removed. You can
   read more [here](../../../concepts/project-maturity).
