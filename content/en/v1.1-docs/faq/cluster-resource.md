---
title: "Cluster Resource Namespace"
linkTitle: "Cluster Resource Namespace"
weight: 60
type: "docs"
---

The `ClusterIssuer` resource is cluster scoped. This means that when referencing
a secret via the `secretName` field, secrets will be looked for in the `Cluster
Resource Namespace`. By default, this namespace is `cert-manager` however can be
changed via a flag on the cert-manager-controller component:

```bash
--cluster-resource-namespace=my-namespace
```
