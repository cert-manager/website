---
title: "Kubectl plugin"
linkTitle: "Kubectl plugin"
weight: 100
type: "docs"
---

`kubectl cert-manager` is a [kubectl plugin](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/) that can help you to manage cert-manager resources inside your cluster.

## Installation
You need the `kubectl-cert-manager.tar.gz` file for the platform you're using, these can be found on our [GitHub releases page](https://github.com/jetstack/cert-manager/releases).
In order to use the kubectl plugin you need its binary to be accessible under the name `kubectl-cert_manager` in your `$PATH`.
Run the following commands to set up the plugin:
```console
$ curl -L -o kubectl-cert-manager.tar.gz https://github.com/jetstack/cert-manager/releases/download/v1.2.0/kubectl-cert_manager-linux-amd64.tar.gz
$ tar xzf kubectl-cert-manager.tar.gz
$ sudo mv kubectl-cert_manager /usr/local/bin
```

You can run `kubectl cert-manager help` to test the plugin is set up properly:
```console
$ kubectl cert-manager help

kubectl cert-manager is a CLI tool manage and configure cert-manager resources for Kubernetes

Usage:
  kubectl cert-manager [command]

Available Commands:
  convert     Convert cert-manager config files between different API versions
  create      Create cert-manager resources
  help        Help about any command
  renew       Mark a Certificate for manual renewal
  status      Get details on current status of cert-manager resources
  version     Print the kubectl cert-manager version

Flags:
      --as string                      Username to impersonate for the operation
      --as-group stringArray           Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string               Default cache directory (default "~/.kube/cache")
      --certificate-authority string   Path to a cert file for the certificate authority
      --client-certificate string      Path to a client certificate file for TLS
      --client-key string              Path to a client key file for TLS
      --cluster string                 The name of the kubeconfig cluster to use
      --context string                 The name of the kubeconfig context to use
  -h, --help                           help for cert-manager
      --insecure-skip-tls-verify       If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string              Path to the kubeconfig file to use for CLI requests.
      --log-flush-frequency duration   Maximum number of seconds between log flushes (default 5s)
      --match-server-version           Require server version to match client version
  -n, --namespace string               If present, the namespace scope for this CLI request
      --request-timeout string         The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                  The address and port of the Kubernetes API server
      --tls-server-name string         Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
      --token string                   Bearer token for authentication to the API server
      --user string                    The name of the kubeconfig user to use

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

If you wish to wait for the CertificateRequest to be signed and store the X.509 certificate in a file, you can set
the `--fetch-certificate` flag. The default timeout when waiting for the issuance of the certificate is 5 minutes,
but can be specified with the `--timeout` flag. The default name of the file storing the X.509 certificate
is `<name_of_cr>.crt`, you can use the ` --output-certificate-file` flag to specify otherwise.

Note that the private key and the X.509 certificate are both written to file, and are **not** stored inside Kubernetes.

For example this will create a CertificateRequest resource with the name "my-cr" based on the cert-manager Certificate described in `my-certificate.yaml` while storing the
private key and X.509 certificate in `my-cr.key` and `my-cr.crt` respectively.
```console
kubectl cert-manager create certificaterequest my-cr --from-certificate-file my-certificate.yaml --fetch-certificate --timeout 20m
```

### Status Certificate
`kubectl cert-manager status certificate` outputs the details of the current status of a Certificate resource and related resources like CertificateRequest, Secret, Issuer, as well as Order and Challenges if it is a ACME Certificate.
The command outputs information about the resources, including Conditions, Events and resource specific fields like Key Usages and Extended Key Usages of the Secret or Authorizations of the Order. This will be helpful for troubleshooting a Certificate.

The command takes in one argument specifying the name of the Certificate resource and the namespace
can be specified as usual with the `-n` or `--namespace` flag.

This example queries the status of the Certificate named `my-certificate` in namespace `my-namespace`.
```console
kubectl cert-manager status certificate my-certificate -n my-namespace
```
