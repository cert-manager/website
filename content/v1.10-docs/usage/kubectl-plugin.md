---
title: Kubectl plugin
description: 'cert-manager usage: The cert-manager kubectl plugin'
---

`kubectl cert-manager` is a [kubectl
plugin](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/) that
can help you to manage cert-manager resources inside your cluster.

While the kubectl plugin is supported, it is recommended to use
[cmctl](./cmctl.md) as this enables a better experience via tab auto-completion.

## Installation

You need the `kubectl-cert-manager.tar.gz` file for the platform you're using, these can be found on our [GitHub releases page](https://github.com/cert-manager/cert-manager/releases).
In order to use the kubectl plugin you need its binary to be accessible under the name `kubectl-cert_manager` in your `$PATH`.

### macOS/Linux

Run the following commands to set up the plugin:

```console
OS=$(go env GOOS); ARCH=$(go env GOARCH); curl -sSL -o kubectl-cert-manager.tar.gz https://github.com/cert-manager/cert-manager/releases/download/v1.7.2/kubectl-cert_manager-$OS-$ARCH.tar.gz
tar xzf kubectl-cert-manager.tar.gz
sudo mv kubectl-cert_manager /usr/local/bin
```

### Windows

1. Download the [latest version](https://github.com/cert-manager/cert-manager/releases/download/v1.7.2/kubectl-cert_manager-windows-amd64.tar.gz).
2. Extract the archive.
3. Add the `.exe` file extension to the extracted `kubectl-cert_manager`.
4. Copy `kubectl-cert_manager.exe` to a location which is also in your `PATH`.

You can run `kubectl cert-manager help` to test the plugin is set up properly:

```console
$ kubectl cert-manager help

kubectl cert-manager is a CLI tool manage and configure cert-manager resources for Kubernetes

Usage: kubectl cert-manager [command]

Available Commands:
  approve      Approve a CertificateRequest
  check        Check cert-manager components
  convert      Convert cert-manager config files between different API versions
  create       Create cert-manager resources
  deny         Deny a CertificateRequest
  experimental Interact with experimental features
  help         Help about any command
  inspect      Get details on certificate related resources
  renew        Mark a Certificate for manual renewal
  status       Get details on current status of cert-manager resources
  version      Print the cert-manager CLI version and the deployed cert-manager version

Flags:
  -h, --help                           help for kubectl cert-manager
      --log-flush-frequency duration   Maximum number of seconds between log flushes (default 5s)

Use "kubectl cert-manager [command] --help" for more information about a command.
```

## Commands

Please refer to [cmctl](./cmctl.md) for command documentation. The plugin
provides the same functionality bar the `completion` subcommand. Commands are
invoked with `kubectl cert-manager` rather than `cmctl`, but function the same
otherwise.