---
title: Developing with Kind
description: 'cert-manager contributing guide: Using Kind'
---

[Kind](https://kind.sigs.k8s.io/) allows you to provision Kubernetes clusters locally using nested Docker containers,
with no requirement for virtual machines.

These clusters are quick to create and destroy, and are useful for simple testing for
development. cert-manager also uses kind clusters in its [end-to-end tests](./e2e.md).

## Using Kind Locally

You should be able to make use of cert-manager's end-to-end test setup logic to create a local Kind cluster for
development. As such, if you want a local cluster you might want to follow some of the details in the
[end-to-end test documentation](./e2e.md).

If, though, you just want to get a cluster up and running with your local changes to cert-manager running inside
`kind`, try the following:

```console
make e2e-setup-kind e2e-setup-certmanager
```

Or, if you need a specific version of Kubernetes:

```console
make K8S_VERSION=1.xx e2e-setup-kind e2e-setup-certmanager
```

That should leave you with a working cluster which you can interact with using `kubectl`!
