---
title: "Cluster Resource Namespace"
linkTitle: "cluster-resource-namespace"
weight: 60
type: "docs"
---

The `ClusterIssuer` resource is cluster scoped. This means that when referencing
a secret via the `secretName` field, secrets will be looked for in the `Cluster
Resource Namespace`. By default, this namespace is `kube-system` however can be
changed via a flag on the cert-manager-controller component:

```bash
--cluster-resource-namespace=my-namespace
```
