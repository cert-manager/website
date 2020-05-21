---
title: "Developing with Kind"
linkTitle: "Developing with Kind"
weight: 70
type: "docs"
---

Kind is a tool to quickly provision Kubernetes clusters locally using nested
docker containers with no requirement for virtual machines. These clusters can
be easily created and destroyed and are useful for simple testing for
development.

To setup the development cluster and building cert-manager you will need the
following installed:

- [Bazel](https://docs.bazel.build/versions/master/install.html)
- [Docker](https://store.docker.com/search?type=edition&offering=community) (and
  enable for non-root user)
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Start Kind Cluster

To start the development cluster run the following:

```bash
$ ./devel/cluster/create.sh
```

Once complete, the cluster is able to be interacted with `kubectl`.

## Building and deploying cert-manager

You can build a development build of cert-manager that will be loaded into your
`kind` cluster.

```bash
$ ./devel/addon/certmanager/install.sh 
```

The images are now available on the cluster with the following tags:

```
quay.io/jetstack/cert-manager-controller:build
quay.io/jetstack/cert-manager-cainjector:build
quay.io/jetstack/cert-manager-acmesolver:build
quay.io/jetstack/cert-manager-webhook:build
```

## Generating CRDs

After changes have been made to the API, the Custom Resource Definitions can be
re-generated with the following command:

```bash
./hack/update-crds.sh
```

## Destroy the Cluster

To clean up the development cluster run the following kind command:

```bash
$ kind delete cluster
```
