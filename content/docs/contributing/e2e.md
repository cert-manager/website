---
title: Running End-to-End Tests
description: 'cert-manager contribuing guide: End-to-end (E2E) tests'
---

cert-manager has an extensive end-to-end (e2e) test suite that verifies functionality against a
real Kubernetes cluster.

The full end-to-end test suite can take a long time to complete and is run against every pull
request made to the cert-manager project.

Unless you've made huge changes to the cert-manager codebase --- or to the end-to-end
tests themselves --- you probably don't _need_ to run the tests locally. If you do want to
run the tests, though, this document explains how.

<div className="alert">
The status of each commit on the master branch is reported on
[`testgrid.k8s.io`](https://testgrid.k8s.io/jetstack-cert-manager-master). Join the
[`cert-manager-dev-alerts`](https://groups.google.com/g/cert-manager-dev-alerts)
Google group to receive email notifications when tests fail.
</div>

## Requirements

There are no special requirements for the end-to-end tests. All dependencies can be
provisioned automatically through the make build system.

## Set up End-to-End Tests

### Create a Cluster

You can create a kind cluster using Make:

```console
# Create a cluster using whatever K8s version is default, named "kind"
make e2e-setup-kind

# Create a cluster using K8s 1.23 named "keith"
make K8S_VERSION=1.23 KIND_CLUSTER_NAME=keith e2e-setup-kind
```

**IMPORTANT:** the kind cluster will be set up using a specific service CIDR range to enable certain functionality in end-to-end tests. This CIDR range is not currently configurable.

Once complete, the cluster is available via `kubectl` as you'd expect.

### Install Test Dependencies

There are various dependencies which the end-to-end tests require, all of which can also
be installed via Make:

```console
make e2e-setup
```

If you only need to update or reinstall one of these dependencies in your test cluster, you can instead install named components explicitly to save some time.

The most common use case for this is to **reinstall cert-manager itself**, say if you've made a change
locally and want to test that change in a cluster:

```console
# Most important: reinstall cert-manager, including rebuilding changed containers locally
make e2e-setup-certmanager

# An example of reinstalling something else; reinstall bind
make e2e-setup-bind

# More generally, see make/e2e-setup.mk for different targets!
```

## Run End-to-End Tests

As with setup, running tests is available through make. In fact, you can just run `make e2e` directly
and avoid having to set anything up manually!

```console
# Set up a cluster using the defaults if one's not already present, and then run the end-to-end tests
make e2e

# Set up a K8s 1.23 cluster and then run tests
make K8S_VERSION=1.23 e2e

# Run tests exactly as they're run in CI; usually not needed
make e2e-ci
```

If you don't want to run every test you can focus on specific tests using `GINKGO_FOCUS` syntax, as described in the
[Ginkgo documentation](https://onsi.github.io/ginkgo/#focused-specs):

```console
make GINKGO_FOCUS=".*my test description" e2e
```

## Cluster IP Details

As mentioned above, the end-to-end tests expect that certain components are deployed in a
specific way and even at specific IP addresses.

By way of illustration, the following cluster components are deployed with specific IPs:

| Component / Make Target    | Used in                    | IP          | DNS A Record                            |
| -------------------------- | -------------------------- | ----------- | --------------------------------------- |
| `e2e-setup-bind`           | DNS-01 tests               | `10.0.0.16` |                                         |
| `e2e-setup-ingressnginx`   | HTTP-01 `Ingress` tests    | `10.0.0.15` | `*.ingress-nginx.db.http01.example.com` |
| `e2e-setup-projectcontour` | HTTP-01 `GatewayAPI` tests | `10.0.0.14` | `*.gateway.db.http01.example.com`       |

If you don't set these components up correctly, you might see that the ACME HTTP01 (and other) end-to-end tests fail.

## End-to-End Test Structure

The end-to-end tests consist of 2 main parts: issuer specific tests and the conformance suite.

Both parts use [Ginkgo](https://onsi.github.io/ginkgo/#getting-ginkgo) to run their tests under the hood.

### Conformance Suite

#### RBAC

This suite tests all RBAC permissions granted to cert-manager on the cluster to check that it is able to operate correctly.

#### Certificates

This suite tests certificate functionality against all issuers.

#### Feature Sets

Some issuers don't support certain features, such as for example issuing Ed25519 certificates or adding an email address
to the X.509 SAN extension.

Each test specifies a used feature using `s.checkFeatures(feature)`, which is then checked against the issuer's
`UnsupportedFeatures` list. Tests which use a feature unsupported by an issuer are skipped for that issuer.

### Cloud Provider Tests

The master branch of cert-manager can also be tested against different cloud providers. Currently, tests for [EKS](https://aws.amazon.com/eks/) are present which run as a periodic job once every two days.

#### Extending The Cloud Provider Tests

The infrastructure used to run the e2e tests on cloud providers is present in the [cert-manager/test-infra](https://github.com/cert-manager/test-infra) repository. More cloud providers can be added by creating infrastructure for them using [Terraform](https://www.terraform.io/).

Apart from that, tests for the existing infrastructure can be customized by editing their respective prow jobs present in the [Jetstack testing repository](https://github.com/jetstack/testing/tree/master/config/jobs/cert-manager) repository. Values like the cert-manager version or the cloud provider version are present as variables in Terraform so their values can be changed when using `terraform apply` in the prow jobs, for example, for the [EKS prow job](https://github.com/jetstack/testing/blob/master/config/jobs/cert-manager/cert-manager-periodics.yaml#L524) the cert-manager version being tested can be changed using

```console
terraform apply -var="cert_manager_version=v1.3.3" -auto-approve
```

To see a list of all configurable variables present for a particular infrastructure you can see the `variables.tf` file for that cloud provider's [infrastructure](https://github.com/cert-manager/test-infra).

> Please note that the cloud provider tests run the e2e tests present in the **master** branch of cert-manager on a predefined version of cert-manager (can be changed in the prow job). Currently, they do **not** test code in a PR, but we have an [issue](https://github.com/cert-manager/cert-manager/issues/4349) tracking that request.
