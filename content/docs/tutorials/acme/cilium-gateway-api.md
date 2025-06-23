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



## Step 3 - Deploy Cilium

## Step 4 - Deploy cert-manager and Configure an Issuer

## Step 5 - Configure a Gateway and HTTPRoute

