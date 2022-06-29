---
title: Building cert-manager
description: 'cert-manager contributing guide: Building cert-manager'
---

cert-manager is built and tested using [make](https://www.gnu.org/software/make/manual/make.html), with a focus on using the standard Go tooling
where possible and keeping system dependencies to a minimum. The cert-manager build system can provision most of its dependencies - including Go -
automatically if required.

cert-manager's build system fully supports developers who use `Linux amd64`, `macOS amd64` and `macOS arm64`. Other operating systems and architectures may
work, but are largely untested.

## Prerequisites

There are very few other requirements needed for developing cert-manager, and crucially the build system should tell you with a friendly error
message if there's anything missing. If you think an error message which relates to a missing dependency is unhelpful, we consider that a bug and
we'd appreciate if you raised [an issue](https://github.com/cert-manager/cert-manager/issues/new?assignees=&labels=&template=bug.md) to tell us about it!

You should install the following tools before you start developing cert-manager:

- [git](https://git-scm.com/)
- [curl](https://curl.se/)
- [GNU make](https://www.gnu.org/software/make/manual/make.html), `v3.82` or newer
- GNU Coreutils (usually already installed on Linux, available via [homebrew](https://formulae.brew.sh/formula/coreutils) for macOS)
- `jq` (available in Linux package managers and in [homebrew](https://formulae.brew.sh/formula/jq))
- `docker` (or `podman`, see [Container Engines](#container-engines) below)
- `Go` (optional; see [Go Versions](#go-versions) below)

## Getting Started

The vast majority of commands which you're likely to need to use are documented via `make help`. That's probably the first place to start if you're
developing cert-manager. We'll also provide an overview on this page of some of the key targets and things to bear in mind.

### Go Versions

cert-manager defaults to using whatever version of Go you've installed locally on your system. If you want to use your system Go, that's totally fine.

Alternatively, make can provision and "vendor" Go specifically for cert-manager, helping to ensure you use the same version that's used in CI and to
make it easier to get started developing.

To start using a vendored Go, run: `make vendor-go`.

You only need to run `vendor-go` once and it'll be "sticky", being used for all future make invocations in your local checkout.

To return to using your system version of go, run: `make unvendor-go`.

To check which version of Go is _currently_ being used, run: `make which-go`, which prints the version number of Go and the path to the Go binary.

```console
# Use a vendored version of go
$ make vendor-go
cd _bin/tools/ && ln -f -s ../downloaded/tools/_go-1.XY.Z-linux-amd64/goroot .
cd _bin/tools/ && ln -f -s ../downloaded/tools/_go-1.XY.Z-linux-amd64/goroot/bin/go .

# A path to go inside the cert-manager directory indicates that a vendored Go is being used
$ make which-go
go version go1.XY.Z linux/amd64
go binary used for above version information: /home/user/workspace/cert-manager/_bin/tools/go

# Go back to the system Go
$ make unvendor-go
rm -rf _bin/tools/go _bin/tools/goroot

# The binary is now "go" which should be found in $PATH
$ make which-go
go version go1.AB.C linux/amd64
go binary used for above version information: go
```

### Parallelism

The cert-manager Makefile is designed to be highly parallel wherever possible. Any build and test commands should be able to be executed in parallel using
standard Make functionality.

One important caveat is that that Go will default to detecting the number of cores available on the system and spinning up as many threads as it can. If you're
using Make functionality to run multiple builds in parallel, this number of threads can be excessive and actually lead to slower builds.

It's possible to limit the number of threads Go uses we'd generally recommend doing so when using Make parallelism.

The best values to use will depend on your system, but we've had success using around half of the available number of cores for Make and limiting Go to between
2 and 4 threads per core.

For example, using an 8-core machine:

```bash
# Run 4 make targets in parallel, and limit each `go build` to 2 threads.
make GOMAXPROCS=2 -j4 release-artifacts
```

## Testing

cert-manager's build pipeline and <abbr title="continuous integration">CI</abbr> infrastructure uses the same Makefile that you use when developing locally,
so there should be no divergence between what the tests run and what you run. That means you should be able to be pretty confident that any changes you make
won't break when tested in CI.

### Running Local Changes in a Cluster

It's common that you might want to run a local Kubernetes cluster with your locally-changed copy of cert-manager in it, for manual testing.

There are make targets to help with this; see [Developing with Kind](./kind.md) for more information.

### Unit and Integration Tests

First of all: If you want to test using `go test`, feel free! For unit tests (which we define as any test outside of the `test/` directory), `go test` will
work on a fresh checkout.

Integration tests may require some external tools to be set up first, so to run the integration tests inside `test/` you might need to run:

```bash
make setup-integration-tests
```

Helper targets are also available which use [`gotestsum`](https://github.com/gotestyourself/gotestsum) for prettier output. It's also possible to
configure these targets to run specific tests:

```bash
# Run all unit and integration tests
make test

# Run only unit tests
make unit-test

# Run only integration tests
make integration-test

# Run all tests in pkg
make WHAT=./pkg/... test

# Run unit and integration tests exactly as run in CI
# (NB: usually not needed - this is mostly for JUnit test output for dashboards)
make test-ci
```

### End-to-End Testing

cert-manager's end-to-end tests are a little more involved and have [dedicated documentation](./e2e.md) describing their use.

### Other Checks

We run a variety of other tools on every Pull Request to check things like formatting, import ordering and licensing. These checks can all be run locally:

```bash
make ci-presubmit
```

NB: One of these checks currently requires Python 3 to be installed, which is a unique requirement in the code base. We'd like to remove that requirement in the future.

## Updating CRDs and Code Generation

Changes to cert-manager's CRDs require some code generation to be done, which will be checked on every pull request.

If you make changes to cert-manager CRDs, you'll need to run some commands locally before raising your PR.

This is documented in our [CRDs](./crds.md) section.

## Building

cert-manager produces many artifacts for a lot of different OS / architecture combinations, including:

- Container images
- Client binaries (`cmctl` and `kubectl_cert-manager`)
- Manifests (Helm charts, static YAML)

All of these artifacts can be built locally using make.

### Containers

cert-manager's most important artifacts are the containers which actually run cert-manager in a cluster. We default to using `docker` for this,
but aim to support docker-compatible CLI tools such as `podman`, too. See [Container Engines](#container-engines) for more info.

There are several targets for building different cert-manager containers locally. These will all default to using `docker`:

```bash
# Build everything for every architecture
make all-containers

# Build just the controller containers on every architecture
make cert-manager-controller-linux

# As above, but for the webhook, cainjector, acmesolver and cmctl containers
make cert-manager-webhook-linux
make cert-manager-cainjector-linux
make cert-manager-acmesolver-linux
make cert-manager-ctl-linux
```

#### Container Engines

NB: This section doesn't apply to end-to-end tests, which might not work outside of Docker at the time of writing. See the [end-to-end documentation](./e2e.md#container-engines)
for more information.

It's possible to use an alternative container engine to build cert-manager containers. This has been successfully tested using `podman`.

Configure an alternative container engine by setting the `CTR` variable:

```bash
# Build everything for every architecture, using podman
make CTR=podman all-containers
```

### Client Binaries

Both `cmctl` and `kubectl_cert-manager` can be built locally for a release. These binaries are built for Linux, macOS and Windows across several architectures.

```bash
# Build all cmctl binaries for all platforms, then for linux only, then for macOS only, then for Windows only
make cmctl
make cmctl-linux
make cmctl-darwin
make cmctl-windows

# As above but for kubectl_cert-manager
make kubectl_cert-manager
make kubectl_cert-manager-linux
make kubectl_cert-manager-darwin
make kubectl_cert-manager-windows
```

### Manifests

We use "manifests" as a catch-all term for non-binary artifacts which we build as part of a release including static installation YAML and our Helm chart.

Everything can be built using make:

```bash
make helm-chart
make static-manifests
```

### Everything

Sometimes it's useful to build absolutely everything locally, to be sure that a change didn't break some obscure architecture and to build confidence when raising a PR.

It's not easy to build a _complete_ release locally since a full release includes signatures which depend on KMS keys being configured. Most users probably don't
need that, though, and for this use case there's a make target which will build everything except the signed artifacts:

```bash
make GOMAXPROCS=2 -j4 release-artifacts
```
