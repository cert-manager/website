---
title: "Upgrading from v1.7 to v1.8"
linkTitle: "v1.7 to v1.8"
weight: 750
type: "docs"
---

When upgrading from 1.7 to 1.8, no special upgrade steps are required 🎉. From
here on you can follow the [regular upgrade process](../).

#### Validation of the `rotationPolicy` field

The field `spec.privateKey.rotationPolicy` on Certificate resources is now validated. Valid options are Never and Always.

Before upgrading to 1.8.0, you will need to check that all the Certificate YAML manifests you have stored in Git if you are using a GitOps flow (or any other "source of truth") have a correct `rotationPolicy` value. To help you find out which Certificate YAML manifests need updating, you can run the following command:

```sh
kubectl get cert -A -ojson | jq -r \
  '.items[] | select(.spec.privateKey.rotationPolicy | . != "Always" and . != "Never") | "\(.metadata.name) in namespace \(.metadata.namespace) has rotationPolicy=\(.spec.privateKey.rotationPolicy)"'
```

This command will show you, the name and namespace of each Certificate resource that needs to be updated in Git. For example:

```text
smoketest-cert in namespace default has rotationPolicy=Foo
```

