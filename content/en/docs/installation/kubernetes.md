---
title: "Kubernetes"
linkTitle: "Kubernetes"
weight: 20
type: "docs"
---

cert-manager runs within your Kubernetes cluster as a series of deployment
resources. It utilizes
[`CustomResourceDefinitions`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources)
to configure Certificate Authorities and request certificates.

It is deployed using regular YAML manifests, like any other application on
Kubernetes.

Once cert-manager has been deployed, you must configure `Issuer` or `ClusterIssuer`
resources which represent certificate authorities.  More information on
configuring different `Issuer` types can be found in the [respective configuration
guides](../../configuration/).


> Note: From cert-manager `v1.2.0` onward, the minimum supported version of
> Kubernetes is `v1.16.0`. Users still running Kubernetes `v1.15` or below should
> upgrade to a supported version before installing cert-manager.

> **Warning**: You should not install multiple instances of cert-manager on a single
> cluster. This will lead to undefined behavior and you may be banned from
> providers such as Let's Encrypt.

## Installing with regular manifests

All resources (the `CustomResourceDefinitions`, cert-manager, namespace, and the webhook component)
are included in a single YAML manifest file:

> **Note**: If you're using a `kubectl` version below `v1.19.0-rc.1` you will have issues updating the CRDs.
> For more info see the [v0.16 upgrade notes](../upgrading/upgrading-0.15-0.16/#issue-with-older-versions-of-kubectl)


Install the `CustomResourceDefinitions` and cert-manager itself:

```bash
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.2.0/cert-manager.yaml
```

> **Note**: When running on GKE (Google Kubernetes Engine), you may encounter a
> 'permission denied' error when creating some of these resources. This is a
> nuance of the way GKE handles RBAC and IAM permissions, and as such you should
> 'elevate' your own privileges to that of a 'cluster-admin' **before** running
> the above command. If you have already run the above command, you should run
> them again after elevating your permissions:
```bash
  kubectl create clusterrolebinding cluster-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value core/account)
```

> **Note**: By default, cert-manager will be installed into the `cert-manager`
> namespace. It is possible to run cert-manager in a different namespace, although you
> will need to make modifications to the deployment manifests.



Once you have deployed cert-manager, you can verify the installation
[here](./#verifying-the-installation).

## Installing with Helm

As an alternative to the YAML manifests referenced above, we also provide an
official Helm chart for installing cert-manager.

> **Note**: cert-manager should never be embedded as a sub-chart into other Helm charts.
> cert-manager manages non-namespaced resources in your cluster and should only be installed once.

### Prerequisites

- Helm v3 installed

### Steps

In order to install the Helm chart, you must follow these steps:

Create the namespace for cert-manager:
```bash
$ kubectl create namespace cert-manager
```

Add the Jetstack Helm repository:

> **Warning**: It is important that this repository is used to install
> cert-manager. The version residing in the helm stable repository is
> *deprecated* and should *not* be used.

```bash
$ helm repo add jetstack https://charts.jetstack.io
```

Update your local Helm chart repository cache:

```bash
$ helm repo update
```

cert-manager requires a number of CRD resources to be installed into your
cluster as part of installation.

This can either be done manually, using `kubectl`, or using the `installCRDs`
option when installing the Helm chart.

> **Note**: If you're using a `helm` version based on Kubernetes `v1.18` or below (Helm `v3.2`) `installCRDs` will not work with cert-manager `v0.16`.
> For more info see the [v0.16 upgrade notes](../upgrading/upgrading-0.15-0.16/#helm)

#### Option 1: installing CRDs with `kubectl`

Install the `CustomResourceDefinition` resources using `kubectl`:

```bash
$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.2.0/cert-manager.crds.yaml
```

#### Option 2: install CRDs as part of the Helm release

To automatically install and manage the CRDs as part of your Helm release, you
must add the `--set installCRDs=true` flag to your Helm installation command.

Uncomment the relevant line in the next steps to enable this.

---

To install the cert-manager Helm chart:

```bash
$ helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.2.0 \
  --create-namespace \
  # --set installCRDs=true
```

The default cert-manager configuration is good for the majority of users, but a
full list of the available options can be found in the [Helm chart
README](https://hub.helm.sh/charts/jetstack/cert-manager).

## Verifying the installation

Once you've installed cert-manager, you can verify it is deployed correctly by
checking the `cert-manager` namespace for running pods:

```bash
$ kubectl get pods --namespace cert-manager

NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-5c6866597-zw7kh               1/1     Running   0          2m
cert-manager-cainjector-577f6d9fd7-tr77l   1/1     Running   0          2m
cert-manager-webhook-787858fcdb-nlzsq      1/1     Running   0          2m
```

You should see the `cert-manager`, `cert-manager-cainjector`, and
`cert-manager-webhook` pod in a `Running` state.
It may take a minute or so for the TLS assets required for the webhook to
function to be provisioned. This may cause the webhook to take a while longer
to start for the first time than other pods. If you experience problems, please
check the [FAQ guide](../../faq/).

The following steps will confirm that cert-manager is set up correctly and able
to issue basic certificate types.

Create an `Issuer` to test the webhook works okay.
```bash
$ cat <<EOF > test-resources.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cert-manager-test
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: test-selfsigned
  namespace: cert-manager-test
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: selfsigned-cert
  namespace: cert-manager-test
spec:
  dnsNames:
    - example.com
  secretName: selfsigned-cert-tls
  issuerRef:
    name: test-selfsigned
EOF
```

Create the test resources.
```bash
$ kubectl apply -f test-resources.yaml
```

Check the status of the newly created certificate. You may need to wait a few
seconds before cert-manager processes the certificate request.
```bash
$ kubectl describe certificate -n cert-manager-test

...
Spec:
  Common Name:  example.com
  Issuer Ref:
    Name:       test-selfsigned
  Secret Name:  selfsigned-cert-tls
Status:
  Conditions:
    Last Transition Time:  2019-01-29T17:34:30Z
    Message:               Certificate is up to date and has not expired
    Reason:                Ready
    Status:                True
    Type:                  Ready
  Not After:               2019-04-29T17:34:29Z
Events:
  Type    Reason      Age   From          Message
  ----    ------      ----  ----          -------
  Normal  CertIssued  4s    cert-manager  Certificate issued successfully
```

Clean up the test resources.
```bash
$ kubectl delete -f test-resources.yaml
```

If all the above steps have completed without error, you are good to go!

Optionally the whole verification flow is automated by running tool maintained by the community [cert-manager-verifier](https://github.com/alenkacz/cert-manager-verifier).

If you experience problems, please check the
[FAQ](../../faq/).

## Configuring your first Issuer

Before you can begin issuing certificates, you must configure at least one
`Issuer` or `ClusterIssuer` resource in your cluster.

You should read the [configuration](../../configuration/) guide to
learn how to configure cert-manager to issue certificates from one of the
supported backends.

## Installing the kubectl plugin

cert-manager also has a kubectl plugin which can be used to help you to manage cert-manager resources in the cluster.
Installation instructions for this can be found in the [kubectl plugin](../../usage/kubectl-plugin/) documentation.

## Alternative installation methods

### kubeprod

[Bitnami Kubernetes Production
Runtime](https://github.com/bitnami/kube-prod-runtime) (`BKPR`, `kubeprod`) is a
curated collection of the services you would need to deploy on top of your
Kubernetes cluster to enable logging, monitoring, certificate management,
automatic discovery of Kubernetes resources via public DNS servers and other
common infrastructure needs.

It depends on `cert-manager` for certificate management, and it is [regularly
tested](https://github.com/bitnami/kube-prod-runtime/blob/master/Jenkinsfile) so
the components are known to work together for GKE, AKS, and EKS clusters. For
its ingress stack it creates a DNS entry in the configured DNS zone and requests
a TLS certificate from the Let's Encrypt staging server.

BKPR can be deployed using the `kubeprod install` command, which will deploy
`cert-manager` as part of it. Details available in the [BKPR installation
guide](https://github.com/bitnami/kube-prod-runtime/blob/master/docs/install.md).


### Debugging installation issues

If you have any issues with your installation, please refer to the
[FAQ](../../faq/).
