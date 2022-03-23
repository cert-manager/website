---
title: Syncing Secrets Across Namespaces using Kubed
description: 'cert-manager FAQ: Kubed'
---

It may be required for multiple components across namespaces to consume the same
`Secret` that has been created by a single `Certificate`. The recommended way to
do this is to use [kubed](https://github.com/appscode/kubed) with its [secret
syncing
feature](https://appscode.com/products/kubed/v0.11.0/guides/config-syncer/intra-cluster/).