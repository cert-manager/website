---
title: "Syncing Secrets Across Namespaces using Kubed"
linkTitle: "syncing-secrets-across-namespaces-using-kubed"
weight: 60
type: "docs"
---

It may be required for multiple components across namespaces to consume the same
secret that has been created by a single certificate. The recommended way to do
this is to use [kubed](https://github.com/appscode/kubed) with its [secret
syncing
feature](https://appscode.com/products/kubed/v0.11.0/guides/config-syncer/intra-cluster/).
