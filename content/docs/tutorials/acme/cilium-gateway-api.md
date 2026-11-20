---
title: Securing Cilium Gateway API
description: 'cert-manager tutorials: Using Cilium Gateway API to solve Automatic Certificate Management Environment (ACME) challenges'
---

This tutorial will specify how to automate ingress traffic encryption to your Kubernetes cluster with `Kubernetes Gateway API`, `Cilium` and `cert-manager`.

## Steps

* [Step 1 - Install Helm](#step-1---install-helm)
* [Step 2 - Deploy Kubernetes Gateway API](#step-2---deploy-kubernetes-gateway-api)
* [Step 3 - Deploy Cilium](#step-3---deploy-cilium)
* [Step 4 - Deploy cert-manager and Configure an Issuer](#step-4---deploy-cert-manager-and-configure-an-issuer)
* [Step 5 - Configure a Gateway and HTTPRoute](#step-5---configure-a-gateway-and-httproute)

## Step 1 - Install Helm

> *Skip this step if you have helm already installed on your client.*

The easiest way to install and manage `cert-manager` and `Cilium` is to use [`Helm`](https://helm.sh), a templating and deployment tool for Kubernetes resources.

First, ensure the Helm client is installed on your client by following the [Helm installation instructions](https://helm.sh/docs/intro/install/).

For example, on MacOS:

```shell
$ brew install helm
```

For a detailed description read the documentation provided at: https://helm.sh/docs/intro/install/

## Step 2 - Deploy Kubernetes Gateway API

> *In this tutorial we are focusing on Cilium version `1.17.5`, which supports Gateway API version `1.2.0`.*

Install the Gateway API Custom Resource Definitions (CRDs):

```shell
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.2.0/config/crd/standard/gateway.networking.k8s.io_gatewayclasses.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.2.0/config/crd/standard/gateway.networking.k8s.io_gateways.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.2.0/config/crd/standard/gateway.networking.k8s.io_httproutes.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.2.0/config/crd/standard/gateway.networking.k8s.io_referencegrants.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.2.0/config/crd/standard/gateway.networking.k8s.io_grpcroutes.yaml
```

Optionally the *experimental* TLSRoute CRD:

```shell
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.2.0/config/crd/experimental/gateway.networking.k8s.io_tlsroutes.yaml
```

This is also described in the [cilium docs](https://docs.cilium.io/en/stable/network/servicemesh/gateway-api/gateway-api/#prerequisites).

## Step 3 - Deploy Cilium

Install the cilium cli either via your package manager or GitHub releases. For example:

```shell
 $ brew install cilium-cli
```

Install cilium on a newly deployed Kubernetes cluster with the Gateway API integration enabled:

```shell
$ cilium install \
  --set kubeProxyReplacement=true \
  --set gatewayAPI.enabled=true

$ cilium status --wait
```

There is a detailed description in the [cilium docs](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/).

## Step 4 - Deploy cert-manager and Configure an Issuer

Install the Helm repository:

```shell
$ helm repo add jetstack https://charts.jetstack.io --force-update
```

Install cert-manager:

```shell
$ helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true
```

There is also a detailed installation documentation with [Helm](/docs/installation/helm/).

Defining a letsencrypt ACME HTTP01 cluster issuer:

`custerissuer-letsencrypt.yaml`
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    email: noreply@example.com
    privateKeySecretRef:
      name: letsencrypt-clusterissuer
    server: https://acme-v02.api.letsencrypt.org/directory
    solvers:
      - http01:
          ingress: {}
```

Apply it to the cluster:
```shell
$ kubectl apply -f clusterissuer-letsencrypt.yaml
```

## Step 5 - Configure a Gateway and HTTPRoute

