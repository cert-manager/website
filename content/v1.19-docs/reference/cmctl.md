---
title: The cert-manager Command Line Tool (cmctl)
description: |
    cmctl is a command line tool that can help you manage cert-manager and its resources inside your cluster
---

`cmctl` is a command line tool that can help you manage cert-manager and its resources inside your cluster.

> 📢 The cert-manager CLI is moving to a new GitHub repository
>
> The cert-manager team have decided to move the `cmctl` code to a new GitHub repository.
> This will allow us to release new features and bug fixes for `cmctl` independently of cert-manager.
> It will simplify the Go package dependencies of cert-manager
> so there should be fewer security patch releases of cert-manager.
> It will make it easier for us to extend `cmctl` with features for managing `trust-manager` and `approver-policy`.
> And it will allow us to write more E2E tests for `cmctl` without further slowing down the test suite of cert-manager.
>
> ⚠️ cert-manager 1.14 is the last release that will still include a `cert-manager-ctl` container image, go package and GitHub release binary.
>
> Visit the new [cmctl repository on GitHub to find out more](https://github.com/cert-manager/cmctl).

## Installation

### Homebrew

On Mac or Linux if you have [Homebrew](https://brew.sh) installed, you can
install `cmctl` with:

```console
brew install cmctl
```

This will also install shell completion.

### Manual Installation

You need the `cmctl` file for the platform you're using, these can be
found on our
[cmctl GitHub releases page](https://github.com/cert-manager/cmctl/releases).
In order to use `cmctl` you need its binary to be accessible under
the name `cmctl` in your `$PATH`.
Run the following commands to set up the CLI. Replace OS and ARCH with your
systems equivalents:

```console
OS=$(go env GOOS); ARCH=$(go env GOARCH); curl -fsSL -o cmctl https://github.com/cert-manager/cmctl/releases/latest/download/cmctl_${OS}_${ARCH}
chmod +x cmctl
sudo mv cmctl /usr/local/bin
```

Alternatively, you can install `cmctl` using `go`:

```bash
go install github.com/cert-manager/cmctl/v2@latest
```

You can run `cmctl help` to test the CLI is set up properly:

```console
$ cmctl help

cmctl is a CLI tool manage and configure cert-manager resources for Kubernetes

Usage: cmctl [command]

Available Commands:
  approve      Approve a CertificateRequest
  check        Check cert-manager components
  completion   Generate completion scripts for the cert-manager CLI
  convert      Convert cert-manager config files between different API versions
  create       Create cert-manager resources
  deny         Deny a CertificateRequest
  experimental Interact with experimental features
  help         Help about any command
  inspect      Get details on certificate related resources
  renew        Mark a Certificate for manual renewal
  status       Get details on current status of cert-manager resources
  upgrade      Tools that assist in upgrading cert-manager
  version      Print the cert-manager CLI version and the deployed cert-manager version

Flags:
  -h, --help                           help for cmctl
      --log-flush-frequency duration   Maximum number of seconds between log flushes (default 5s)

Use "cmctl [command] --help" for more information about a command.
```

>  There is also a [legacy kubectl plugin](#legacy-kubectl-plugin), but it is no longer recommended
> because the standalone `cmctl` binary provides better [auto-completion](#completion).

## Commands

### Approve and Deny CertificateRequests

CertificateRequests can be
[approved or denied](../usage/certificaterequest.md#approval) using their
respective cmctl commands:

> **Note**: The internal cert-manager approver may automatically approve all
> CertificateRequests unless disabled with the flag on the cert-manager-controller
> `--controllers=*,-certificaterequests-approver`

```bash
$ cmctl approve -n istio-system mesh-ca --reason "pki-team" --message "this certificate is valid"
Approved CertificateRequest 'istio-system/mesh-ca'
```

```bash
$ cmctl deny -n my-app my-app --reason "example.com" --message "violates policy"
Denied CertificateRequest 'my-app/my-app'
```

### Convert

`cmctl convert` can be used to convert cert-manager manifest files between
different API versions. Both YAML and JSON formats are accepted.  The command
either takes a file name, directory path, or a URL as input. The contents is
converted into the format of the latest API version known to cert-manager, or
the one specified by `--output-version` flag.

The default output will be printed to stdout in YAML format. One can use the
option `-o` to change the output destination.

For example, this will output `cert.yaml` in the latest API version:

```console
cmctl convert -f cert.yaml
```

### Create

`cmctl create` can be used to create cert-manager resources manually.
Sub-commands are available to create different resources:

#### CertificateRequest

To create a cert-manager CertificateRequest, use `cmctl create
certificaterequest`. The command takes in the name of the CertificateRequest to
be created, and creates a new CertificateRequest resource based on the YAML
manifest of a Certificate resource as specified by `--from-certificate-file`
flag, by generating a private key locally and creating a 'certificate signing
request' to be submitted to a cert-manager Issuer. The private key will be
written to a local file, where the default is `<name_of_cr>.key`, or it can be
specified using the `--output-key-file` flag.

If you wish to wait for the CertificateRequest to be signed and store the X.509
certificate in a file, you can set the `--fetch-certificate` flag. The default
timeout when waiting for the issuance of the certificate is 5 minutes, but can
be specified with the `--timeout` flag. The default name of the file storing the
X.509 certificate is `<name_of_cr>.crt`, you can use the `
--output-certificate-file` flag to specify otherwise.

Note that the private key and the X.509 certificate are both written to file,
and are **not** stored inside Kubernetes.

For example this will create a CertificateRequest resource with the name "my-cr"
based on the cert-manager Certificate described in `my-certificate.yaml` while
storing the private key and X.509 certificate in `my-cr.key` and `my-cr.crt`
respectively.

```console
cmctl create certificaterequest my-cr --from-certificate-file my-certificate.yaml --fetch-certificate --timeout 20m
```

### Renew

`cmctl` allows you to manually trigger a renewal of a specific certificate.
This can be done either one certificate at a time, using label selectors (`-l app=example`), or with the `--all` flag:

For example, you can renew the certificate `example-com-tls`:
```console
$ kubectl get certificate
NAME                       READY   SECRET               AGE
example-com-tls            True    example-com-tls      1d

$ cmctl renew example-com-tls
Manually triggered issuance of Certificate default/example-com-tls

$ kubectl get certificaterequest
NAME                              READY   AGE
example-com-tls-tls-8rbv2         False    10s
```

You can also renew all certificates in a given namespace:

```console
$ cmctl renew --namespace=app --all
```

The renew command allows several options to be specified:
* `--all` renew all Certificates in the given Namespace, or all namespaces when combined with `--all-namespaces`
* `-A` or  `--all-namespaces` mark Certificates across namespaces for renewal
* `-l` `--selector` allows set a label query to filter on
as well as `kubectl` like global flags like `--context` and `--namespace`.

### Status Certificate

`cmctl status certificate` outputs the details of the current status of a
Certificate resource and related resources like CertificateRequest, Secret,
Issuer, as well as Order and Challenges if it is a ACME Certificate.  The
command outputs information about the resources, including Conditions, Events
and resource specific fields like Key Usages and Extended Key Usages of the
Secret or Authorizations of the Order. This will be helpful for troubleshooting
a Certificate.

The command takes in one argument specifying the name of the Certificate
resource and the namespace can be specified as usual with the `-n` or
`--namespace` flag.

This example queries the status of the Certificate named `my-certificate` in
namespace `my-namespace`.

```console
cmctl status certificate my-certificate -n my-namespace
```

### Completion

`cmctl` supports auto-completion for both subcommands as well as suggestions for
runtime objects.

```console
$ cmctl approve -n <TAB> <TAB>
default             kube-node-lease     kube-public         kube-system         local-path-storage
```

Completion can be installed for your environment by following the instructions
for the shell you are using. It currently supports bash, fish, zsh, and
powershell.

```console
$ cmctl completion help
```

---

### Experimental
`cmctl x` has experimental sub-commands for operations which are currently under
evaluation to be included into cert-manager proper. The behavior and interface
of these commands are subject to change or removal in future releases.


#### Create
`cmctl x create` can be used to create cert-manager resources manually.
Sub-commands are available to create different resources:

##### CertificateSigningRequest
To create a [CertificateSigningRequest](../usage/kube-csr.md), use
```console
cmctl x create csr
```
This command takes the name of the CertificateSigningRequest to be created, as
well as a file containing a Certificate manifest (`-f,
--from-certificate-file`). This command will generate a private key, based on
the options of the Certificate, and write it to the local file `<name>.key`, or
specified by `-k, --output-key-file`.

```bash
$ cmctl x create csr -f my-cert.yaml my-req
```


<div className="warning">

cert-manager **will not** automatically approve CertificateSigningRequests. If
you are not running a custom approver in your cluster, you will likely need to
manually approve the CertificateSigningRequest:

```bash
$ kubectl certificate approve <name>
```

</div>

This command can also wait for the CertificateSigningRequest to be signed using
the flag `-w, --fetch-certificate`. Once signed it will write the resulting
signed certificate to the local file `<name>.crt`, or specified by `-c,
--output-certificate-file`.

```bash
$ cmctl x create csr -f my-cert.yaml my-req -w
```

#### Install

```bash
cmctl x install
```

This command makes sure that the required `CustomResourceDefinitions` are installed together with the cert-manager, cainjector and webhook components.
Under the hood, a procedure similar to the [Helm install procedure](../installation/helm.md#steps) is used.

You can also use `cmctl x install` to customize the installation of cert-manager.

The example below shows how to tune the cert-manager installation by overriding the default Helm values:

```bash
cmctl x install \
    --set prometheus.enabled=false \  # Example: disabling prometheus using a Helm parameter
    --set webhook.timeoutSeconds=4s   # Example: changing the wehbook timeout using a Helm parameter
```

You can find [a full list of the install parameters on cert-manager's ArtifactHub page](https://artifacthub.io/packages/helm/cert-manager/cert-manager#configuration). These are the same parameters that are available when using the Helm chart.
Once you have deployed cert-manager, you can [verify](../installation/kubectl.md#verify) the installation.

The CLI also allows the user to output the templated manifest to `stdout`, instead of installing the manifest on the cluster.

```bash
cmctl x install --dry-run > cert-manager.custom.yaml
```

#### Uninstall

```bash
cmctl x uninstall
```

This command uninstalls any Helm-managed release of cert-manager.

Starting from cmctl `v2.0.0`, the uninstall command is safe and will not delete the CRDs
by default, even if they were installed with a cert-manager Helm chart before v1.15.0 (using the option `--set installCRDs=true`).
Starting from cert-manager v1.15.0, the CRDs are not removed by default when uninstalling the Helm chart using Helm.

> 🕐 Before `v2.0.0`, cmctl would remove the CRDs if they were installed with the Helm chart (similar to Helm's behavior).

Most of the features supported by `helm uninstall` are also supported by this command.

Some example uses:

```bash
cmctl x uninstall

cmctl x uninstall --namespace my-cert-manager

cmctl x uninstall --dry-run
```

### Upgrade

Tools that assist in upgrading cert-manager

```bash
$ cmctl upgrade --help
```
##### Migrate API version

This command can be used to prepare a cert-manager installation that was created
before cert-manager `v1` for upgrading to a cert-manager version `v1.6` or later.
It ensures that any cert-manager custom resources that may have been stored in etcd at
a deprecated API version get migrated to `v1`. See [Migrating Deprecated API
Resources](https://cert-manager.io/docs/releases/upgrading/remove-deprecated-apis) for more context.

```bash
$ cmctl upgrade migrate-api-version --qps 5 --burst 10
```

## Kubectl plugin

Since kubectl 1.26, kubectl plugins support auto-completion, which means you will have the same
experience with the standalone `cmctl` binary and with the kubectl plugin.

To install the plugin you need the `kubectl_cert-manager` file for the platform you're using,
these can be found on our [cmctl GitHub releases page](https://github.com/cert-manager/cmctl/releases).
In order to use the kubectl plugin you need its binary to be accessible under the name `kubectl-cert_manager` in your `$PATH`.

You can run `kubectl cert-manager help` to test that the plugin is set up properly.

### Auto-completion with the kubectl plugin

Since kubectl 1.26, it is possible to enable auto-completion for plugins. Assuming that you installed
`kubectl_cert-manager` in `/usr/local/bin`, you can set up auto-completion by running the following command:

```bash
cat >kubectl_complete-cert_manager <<'EOF'
#!/usr/bin/env sh
kubectl cert-manager __complete "$@"
EOF
sudo install kubectl_complete-cert_manager /usr/local/bin
```
