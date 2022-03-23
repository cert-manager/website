---
title: Kubectl plugin
description: 'cert-manager usage: The cert-manager kubectl plugin'
---

`kubectl cert-manager` is a [kubectl plugin](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/) that can help you to manage cert-manager resources inside your cluster.

## Installation
You need the `kubectl-cert-manager.tar.gz` file for the platform you're using, these can be found on our [GitHub releases page](https://github.com/jetstack/cert-manager/releases).
In order to use the kubectl plugin you need its binary to be accessible under the name `kubectl-cert_manager` in your `$PATH`.
Run the following commands to set up the plugin:
```console
$ curl -L -o kubectl-cert-manager.tar.gz https://github.com/jetstack/cert-manager/releases/download/v0.16.1/kubectl-cert_manager-linux-amd64.tar.gz
$ tar xzf kubectl-cert-manager.tar.gz
$ sudo mv kubectl-cert_manager /usr/local/bin
```

You can run `kubectl cert-manager help` to test the plugin is set up properly:
```console
$ kubectl cert-manager help

kubectl cert-manageris a CLI tool manage and configure cert-manager resources for Kubernetes

Usage:
  kubectl cert-manager [command]

Available Commands:
  convert     Convert cert-manager config files between different API versions
  create      Create cert-manager resources
  help        Help about any command
  renew       Mark a Certificate for manual renewal
  status      Get details on current status of cert-manager resources
  version     Print the kubectl cert-manager version

Use "kubectl cert-manager [command] --help" for more information about a command.
```

## Commands

### Renew
> **Note**: for cert-manager `v0.15` this feature requires the `ExperimentalCertificateControllers` feature gate set.
> From cert-manager `v0.16` onward, the experimental certificate controller is the default.

`kubectl cert-manager renew` allows you to manually trigger a renewal of a specific certificate. 
This can be done either one certificate at a time, using label selectors (`-l app=example`), or with the `--all` flag:

For example you can renew the certificate `example-com-tls`:
```console
$ kubectl get certificate
NAME                       READY   SECRET               AGE
example-com-tls            True    example-com-tls      1d

$ kubectl cert-manager renew example-com-tls
Manually triggered issuance of Certificate default/example-com-tls

$ kubectl get certificaterequest
NAME                              READY   AGE
example-com-tls-tls-8rbv2         False    10s
```

You can also renew all certificates in a given namespace:
```console
$ kubectl cert-manager renew --namespace=app --all
```

The renew command allows several options to be specified:
* `--all` renew all Certificates in the given Namespace, or all namespaces when combined with `--all-namespaces`
* `-A` or  `--all-namespaces` mark Certificates across namespaces for renewal
* `-l` `--selector` allows set a label query to filter on
as well as `kubectl` global flags like `--context` and `--namespace`.

### Convert
`kubectl cert-manager convert` can be used to convert cert-manager manifest files between different API versions. Both YAML and JSON formats are accepted.
The command takes file name, directory, or URL as input, and converts into the
format of the latest version or the one specified by --output-version flag. 

The default output will be printed to stdout in YAML format. One can use -o option to change the output destination.

For example this will output `cert.yaml` in the latest API version:
```console
kubectl cert-manager convert -f cert.yaml
```

### Create
`kubectl cert-manager create` can be used to create cert-manager resources manually. Sub-commands are available
to create different resources:
#### CertificateRequest
To create a cert-manager CertificateRequest, use `kubectl cert-manager create certificaterequest`. The command takes in the name of the CertificateRequest to be created, 
and creates a new CertificateRequest resource based on the YAML manifest of a Certificate resource as specified by `--from-certificate-file` flag, by generating a private key locally and creating a 'certificate signing request' 
to be submitted to a cert-manager Issuer. The private key will be written to a local file, where the default is `<name_of_cr>.key`, or it can be specified using the `--output-key-file` flag.

If you wish to wait for the CertificateRequest to be signed and store the x509 certificate in a file, you can set
the `--fetch-certificate` flag. The default timeout when waiting for the issuance of the certificate is 5 minutes,
but can be specified with the `--timeout` flag. The default name of the file storing the x509 certificate
is `<name_of_cr>.crt`, you can use the ` --output-certificate-file` flag to specify otherwise.

Note that the private key and the x509 certificate are both written to file, and are **not** stored inside Kubernetes.

For example this will create a CertificateRequest resource with the name "my-cr" based on the cert-manager Certificate described in `my-certificate.yaml` while storing the
private key and x509 certificate in `my-cr.key` and `my-cr.crt` respectively.
```console
kubectl cert-manager create certificaterequest my-cr --from-certificate-file my-certificate.yaml --fetch-certificate --timeout 20m
```