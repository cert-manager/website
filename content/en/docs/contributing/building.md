---
title: "Building cert-manager"
linkTitle: "Building cert-manager"
weight: 70
type: "docs"
---

cert-manager makes use of [Bazel](https://bazel.build/) to build the project. 
Bazel manages all developer dependencies, Helm chart building, Docker images and the code itself. 
We try to use it as much as possible.
We currently use Bazel `v3.7.2`. The minimum supported version is `v3.5.0`.

> **TIP**: are you using GoLand? Make sure to exclude the `bazel-` folders! You can do this by right clicking on the folder -> Mark Directory As -> Excluded
> This will save you a ton of CPU time!

> **TIP**: are you sitting on a corporate network with internal PKI? Bazel does not honor custom CA certificates by default, but depending on your OS
> a [clean workaround might be available](https://groups.google.com/g/bazel-discuss/c/13uPDObyfQg/m/UjPbalztCQAJ).

## A quick intro to Bazel

Bazel has 3 main commands which we use:

`bazel build [...]` will build and compile code for you e.g. `bazel build //cmd/ctl` will build our CLI. 
`bazel test [...]` will run any tests for a given package
`bazel run [...]` is only used to run certain scripts not the compiled code (unlike Go). e.g. `bazel run //hack/bin:helm` will download and run Helm.

### Package format

After any Bazel command you will see something that looks like a path.
Let's take `bazel run //hack/bin:helm` as an example:

* `//` is the cert-manager project root, no matter in which directory under cert-manager you are it will find it
* `hack/bin` is the path where the code is to execute/build/test you will for example see `pkg/acme/` to run ACME tests
* `:helm` is the part of the Bazel file to execute, these are defined in the Bazel config themselves.

> **TIP**: `...` is a recursive lookup in Bazel, it will run al tests in all subfolders when set, it is also the easiest way to invoke them.
> For example `bazel test //pkg/...` will test all tests in all packages.

## Help so much Bazel!

No worries we have a lot of helper scripts for you!
Need to set up a local cluster and install cert-manager in it? Take a look at [our kind documentation](../kind/).

We also have a few very handy tools inside `./hack` and `./devel`. These are the most common ones which you can use:

### Just update everything you can!

Bazel takes care of a lot of automatic code generation for us, from generating CRD updates to updating its own `BUILD.bazel` files.
If you just want to do everything at once (and have 5 minutes of your time) you can run:

```bash 
$ ./hack/update-all.sh
```

This will update everything you need without having to care about what needs changing.

> **NOTE:** we strongly recommend running this before you create a PR!

### I need granular control 

You can also pick and mix the individual bash helper scripts:

* `update-bazel.sh`: updates the all `*.bazel` files including formatting them
* `update-codegen.sh`: runs all code generation
* `update-crds.sh`: updates all CRD files to the latest scheme
* `update-deps-licenses.sh`: updates the `LICENCES` file, needed when adding/updating dependencies
* `update-deps.sh`: installs new dependencies declared in the code and adds them into the Bazel and Go module files
* `update-gofmt.sh`: runs `go fmt` on all code

Most of these have a `verify-*` equivalent which will run inside our CI to verify all the scripts ran before merging the PR.

## Building the project

You can ask Bazel to build the code for you to run in your local machine.
The output will end up in `bazel-out` on your disk.

You can get the exact path by looking at the Bazel output:
```
Target //cmd/ctl:ctl up-to-date:
  bazel-out/k8-fastbuild-ST-4c64f0b3d5c7/bin/cmd/ctl/kubectl-cert_manager
```

### Building the Go binaries (for local OS)

You can build the controllers to run them locally using:
```bash
$ bazel build //cmd/...
```
If you need them inside a local cluster check out [our kind documentation](../kind/).

### Building the CLI

You can use `go run ./cmd/ctl` to quickly run the CLI.
You can also compile it using Bazel:
```bash
$ bazel build //cmd/ctl
```

### Building images

If you need the Docker images you can generate these using:
```bash
$ export APP_VERSION="dev"
$ export DOCKER_REGISTRY="quay.io/jetstack/"
$ bazel run \
		--stamp \
		--platforms=@io_bazel_rules_go//go/toolchain:linux_amd64 \
		//build:server-images
```

`--stamp` enables reproducible builds while `--platforms` defines which images to build, in this example for AMD64 Linux.

## Testing the project 

cert-manager has 3 kinds of tests, which can each be invoked separately to give you granular control.

* Unit tests: you can either use `go test` (or your IDE) here, or Bazel. For example `bazel test //pkg/acme/...` runs all tests in the ACME package
* Integration tests: `bazel test //test/integration/...` will run all integration tests against a Bazel operated `kube-apiserver`
* End-to-end tests: see the [e2e documentation](../e2e/)

> **TIP**: `...` is a recursive lookup in Bazel, it will run all tests in all subfolders when set, it is also the easiest way to invoke them.


## But... I like Makefiles more

We got you covered! The root of the repo has a `Makefile` which you can use for quick actions. Which will use Bazel in the background.
We recommend [looking at the file](https://github.com/jetstack/cert-manager/blob/master/Makefile) to learn all possible options.
