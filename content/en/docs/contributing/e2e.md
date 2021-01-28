---
title: "Running End-to-End Tests"
linkTitle: "Running End-to-End Tests"
weight: 70
type: "docs"
---

cert-manager has an end-to-end test suite that verifies functionality against a
real Kubernetes cluster.

This test takes around 30 minutes, it will be run on every PR in our cluster.

> Note: you can see the status of each commit on the master branch at
> [`testgrid.k8s.io`](https://testgrid.k8s.io/jetstack-cert-manager-master).
> You can join the Google group
> [`cert-manager-dev-alerts`](https://groups.google.com/g/cert-manager-dev-alerts)
> in order to receive a notification by email whenever a commit on master
> fails.

It is only advised to run this locally when you made big changes to the
codebase. This document explains how you can run the end-to-end tests yourself.

## Requirements

Currently, a number of tools **must** be installed on your machine in order to
run the tests:

- `bazel`: As with all other development, Bazel is required to actually build
  the project as well as end-to-end test framework. Bazel will also retrieve
  appropriate versions of any other dependencies depending on what 'target' you
  choose to run.

- `docker`: We provision a whole Kubernetes cluster within Docker, and so an up
  to date version of Docker must be installed. The oldest Docker version we have
  tested is 17.09.

- `kubectl`:  If you are running the tests on Linux, this step is technically
  not required. For non-Linux hosts (i.e. macOS), you will need to ensure you have
  a relatively new version of `kubectl` available on your PATH.

- `kind`: We use kind to provision a Kubernetes cluster.


Bazel, Docker and `kubectl` should be installed through your preferred means.

## Set up End-to-End Tests

You need to have a Kind cluster running, if you don't have one set up you can set one up using:
```bash
export K8S_VERSION=1.19 # optional: this allows you to test different Kubernetes versions
$ ./devel/cluster/create.sh
```

Once you have one set up you need to install all dependencies (including cert-manager) in the cluster using:

```bash
$ ./devel/setup-e2e-deps.sh
```

**TIP**: if you only need to update one dependency you can run `./devel/addon/<name>/install.sh` 

## Run End-to-End Tests

You can run the end-to-end tests by executing the following:

```bash
$ ./devel/run-e2e.sh
```

The full suite may take up to 30 minutes to run.
You can monitor output of this command to track progress.

Note: *If you did not use `create.sh` to create the cluster you will notice that ACME HTTP01 end-to-end tests will fail, as they require the 'service CIDR' to be set to 10.0.0.0/16 as the ingress controller is deployed with the fixed IP 10.0.0.15 to allow [Pebble](https://github.com/letsencrypt/pebble) to access it on a predictable address for end-to-end tests as our test DNS name `certmanager.kubernetes.network` points to 10.0.0.15.*

You can also run a specific part of the test using `--ginkgo.focus`
```bash
$ ./devel/run-e2e.sh --ginkgo.focus "<text regex>"
```
More info on how to use this can be found in the [Ginkgo documentation](https://onsi.github.io/ginkgo/#focused-specs)


## End-to-End Test Structure

The end-to-end tests consist of 2 big parts: the issuer specific tests and the conformance suite. These tests use the [Ginkgo library](https://onsi.github.io/ginkgo/#getting-ginkgo) to run tests.

### Conformance suite
### RBAC
This suite tests all RBAC permissions granted to cert-manager on the cluster to check that it is able to operate correctly.
### Certificates
This suite tests certificate functionality against all issuers.
#### Feature sets
This exists to only test a certain feature (e.g. Email SAN) against issuers that support this feature.
Each test specifies a used feature using `s.checkFeatures(feature)`, this is then checked against the issuer's `UnsupportedFeatures` list to check if it can be ran against the issuer.

## External dependencies for running end-to-end tests

The Venafi TPP issuer is the only component that requires an "external"
resource. The CI uses a Venafi TPP server that is maintained by Venafi. The
credentials are stored in Jetstack's Vault server. Note that we have no
admin privileges over this server. Our contact point regarding this
external dependency is Paul Cleary (`paul cleary at venafi com`).
