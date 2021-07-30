---
title: "Running End-to-End Tests"
linkTitle: "Running End-to-End Tests"
weight: 70
type: "docs"
---

cert-manager has an extensive end-to-end (e2e) test suite that verifies functionality against a
real Kubernetes cluster.

The full end-to-end test suite can take a long time to complete and is run against every pull
request made to the cert-manager project.

Unless you've made huge changes to the cert-manager codebase --- or to the end-to-end
tests themselves --- you probably don't _need_ to run the tests locally. If you do want to
run the tests, though, this document explains how.

{{% alert title="TestGrid Alerts"  %}}
The status of each commit on the master branch is reported on
[`testgrid.k8s.io`](https://testgrid.k8s.io/jetstack-cert-manager-master). Join the
[`cert-manager-dev-alerts`](https://groups.google.com/g/cert-manager-dev-alerts)
Google group to receive email notifications when tests fail.
{{% /alert %}}

## Requirements

There are a small number of required tools which **must** be installed on your machine
to run the tests:

- `bazel`: Builds cert-manager and the end-to-end tests themselves
- `kind`: Provisions a Kubernetes cluster inside docker.
- `docker`: Required by kind.
- `kubectl`: A relatively new version of `kubectl` should be available on your `$PATH`.

## Set up End-to-End Tests

The test requires a kind cluster to run against. Note that the tests assume a certain configuration
for the kind cluster, and you should be sure to use this script rather than creating a cluster manually
unless you're sure you've mimicked the required configuration:

```console
$ export K8S_VERSION=1.19 # optional: this allows you to test different Kubernetes versions
$ ./devel/cluster/create-kind.sh
...
```

There are also certain dependencies which the test requires, which can also be installed using
a helper script:

```console
$ ./devel/setup-e2e-deps.sh
```

**TIP**: If you only need to update one dependency in the testing cluster, you can instead run
`./devel/addon/<name>/install.sh` to save some time.

## Run End-to-End Tests

The following script will run the tests. Note that the tests produce a lot of output, and take
some time (often well over 30 minutes) to complete:

```console
$ ./devel/run-e2e.sh
... lots of output ...
```

**NB:** If you don't use `create-kind.sh` to create the kind cluster, the ACME HTTP01 end-to-end tests will fail,
as they require the 'service CIDR' to be set to `10.0.0.0/16`.

This is because the ingress controller is deployed with the fixed IP `10.0.0.15` to allow
[Pebble](https://github.com/letsencrypt/pebble) to access it on a predictable address for end-to-end tests; our
test DNS name `certmanager.kubernetes.network` points to `10.0.0.15`.

If you don't want to run every test, you can focus on specific parts using `--ginkgo.focus`:

```console
$ ./devel/run-e2e.sh --ginkgo.focus "<text regex>"

# example: run any test which has "basicConstraint" in the description
$ ./devel/run-e2e.sh --ginkgo.focus "basicConstraint"
```

More info on how to use this can be found in the [Ginkgo focused-specs documentation](https://onsi.github.io/ginkgo/#focused-specs)

## End-to-End Test Structure

The end-to-end tests consist of 2 big parts: the issuer specific tests and the conformance suite. Both parts use
[Ginkgo](https://onsi.github.io/ginkgo/#getting-ginkgo) to run their tests.

### Conformance Suite

### RBAC

This suite tests all RBAC permissions granted to cert-manager on the cluster to check that it is able to operate correctly.

### Certificates

This suite tests certificate functionality against all issuers.

#### Feature Sets

Some issuers don't support certain features, such as for example issuing Ed25519 certificates or adding an email address
to the X.509 SAN extension.

Each test specifies a used feature using `s.checkFeatures(feature)`, which is then checked against the issuer's
`UnsupportedFeatures` list. Tests which use a feature unsupported by an issuer are skipped for that issuer.
