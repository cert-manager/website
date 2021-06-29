# Quick Start: Install cert-manager and get a TLS certificate from Let's Encrypt

## Prerequisites

You will need a Kubernetes cluster (>v1.16) which can be reached by a public IP address.
And if you use Let's Encrypt DNS based verification,
you will need your DNS "zone" to be hosted by one of the DNS providers supported by cert-manager,
and you will need an account with permission to add TXT records to that zone,
and credentials which cert-manager can use to interact with the DNS providers API.

## Install the cert-manager CLI

There is a cert-manager command line interface (CLI), which you can use to install it in your Kubernetes cluster.
This is the simplest and safest way to install cert-manager,
because it will install the latest stable version of cert-manager
and perform pre-flight checks, to ensure that you have a compatible Kubernetes cluster.

The CLI tool can also be used to configure cert-manager for Let's Encrypt,
and it can be used to gather diagnostic information if there is a problem with cert-manager.

For these reasons, we recommend that you start by installing the cert-manager CLI.
The CLI is designed to be used as a `kubectl` plugin
and it is packaged for easy installation with `krew`.
Install it as follows:

```console
$ kubectl krew install cert-manager
```

Try typing `kubectl cert-manager --help` to see all the available options.

## Install cert-manager

Use the cert-manager CLI to install the latest stable version of cert-manager in your cluster, as follows:

```console
$ kubectl cert-manager install
```

You will see a series of progress messages as it performs pre-flight checks,
installs cert-manager and then checks the health of all the cert-manager components.

If any of the checks fail, you will see a detailed error message explaining what went wrong.


## Configure cert-manager for Let's Encrypt

Next we need to configure cert-manager to use the Let's Encrypt API.
The simplest way to do this is to use the CLI, as follows:

```console
$ kubectl cert-manager create issuer lets-encrypt
```

The command will prompt you for your email address, which is required to interact with the Let's Encrypt API,
and it will prompt you to select one or more "solver" configurations,
which controls how Let's Encrypt will verify that you control the domain and website for the TLS certificate which you are requesting them to sign.

The command will validate the settings you supplied,
create an `Issuer` resource in your current Kubernetes namespace,
and check whether cert-manager has successfully connected to Let's Encrypt.

## Request a Certificate

We're almost there.
The final step is to create a `Certificate`, and once again, the CLI provides a quick and easy way to create a simple Certificate.

```console
kubectl cert-manager create certificate
```

This command will prompt you for:
* DNS name
  (it will offer a choice of hostnames found in the Ingress resources in your current namespace),
* Issuer
  (it will offer a choice of names of any Issuers in your current namespace,
   ordered by creation date so that the Issuer you created earlier is the first choice),

The command will validate the settings you supplied,
create a `Certificate` resource in your current Kubernetes namespace,
and check whether cert-manager has successfully signed it with the Let's Encrypt settings that you entered earlier.

It will print out the name of a `Secret` which contains the TLS private key (`tls.key`) and the signed certificate (`tls.crt`).


## Troubleshooting

If any of the steps fails, the CLI will print helpful diagnostic information about what went wrong.
And if you need to contact your Kubernetes cluster administrator for support,
you can use the `kubectl cert-manager cluster-info` command to gather machine readable diagnostic information,
about the Kubernetes cluster and about the cert-manager related components.

```console
kubectl cert-manager cluster-info
```
