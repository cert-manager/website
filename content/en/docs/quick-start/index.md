# Install cert-manager and get a TLS certificate from Let's Encrypt


## Install the cert-manager CLI

There is a cert-manager command line interface (CLI), which you can use to install it in your Kubernetes cluster.
This is the simplest and safest way to install cert-manager,
because it will install the latest stable version of cert-manager
and perform pre-flight checks, to ensure that you have a compatible Kubernetes cluster.

The CLI tool can also be used to configure cert-manager for Let's Encrypt,
and it can be used to gather diagnostic information if there is a problem with cert-manager.

For these reasons, we recommend that you start by installing the cert-manager CLI, as follows:

```console
$ kubectl krew install cert-manager
```
