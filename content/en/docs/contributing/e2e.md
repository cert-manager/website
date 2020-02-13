---
title: "Running End-to-End Tests"
linkTitle: "Running End-to-End Tests"
weight: 70
type: "docs"
---

cert-manager has an end-to-end test suite that verifies functionality against a
real Kubernetes cluster.

This document explains how you can run the end-to-end tests yourself.  This is
useful when you have added or changed functionality in cert-manager and want to
verify the software still works as expected.

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
  not required. For non-Linux hosts (i.e. OSX), you will need to ensure you have
  a relatively new version of `kubectl` available on your PATH.

- `kind`: We use kind to provision a Kubernetes cluster.

- An internet connection: tests require access to DNS, and optionally CloudFlare
  APIs (if a CloudFlare API token is provided).

Bazel, Docker and `kubectl` should be installed through your preferred means.

## Set up End-to-End Tests

You need to have a Kind cluster running, if you don't have one set up you can set one up using:
```bash
$ ./devel/setup-e2e-tests.sh
```

Once you have one set up you need to install all dependancies in the cluster using:
```bash
$ ./devel/create.sh
```

## Run End-to-End Tests

You can run the end-to-end tests by executing the following:

```bash
$ ./devel/run-e2e.sh
```

The full suite may take up to 30 minutes to run.
You can monitor output of this command to track progress.

You can also run a specific part of the test using `--ginkgo.focus`
```bash
$ ./devel/run-e2e.sh --ginkgo.focus "<text regex>"
```
More info on how to use this can be found in the [Ginkgo documentation](https://onsi.github.io/ginkgo/#focused-specs)


## End-to-End Test Structure

The ent-to-end tests consist of 2 big parts: the isssuer specific tests and the conformance suite. These tests use the [Ginkgo library](https://onsi.github.io/ginkgo/#getting-ginkgo) to run tests.

### Conformance suite
### RBAC
This suite tests all RBAC permissions granted to cert-manager on the cluster to check that it is able to operate correctly.
### Certificates
This suite tests certificate functionality against all issuers.
#### Feature sets
This exists to only test a certain feature (eg. Email SAN) against issuers that support this feature.
Each test specifies a used feature using `s.checkFeatures(feature)`, this is then checked against the issuer's `UnsupportedFeatures` list to check if it can be ran against the issuer.