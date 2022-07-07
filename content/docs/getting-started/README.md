---
title: Getting Started
description: Learn how to deploy cert-manager in your Kubernetes cluster and how to configure it to sign SSL certificates using Let's Encrypt
---

In this tutorial you will learn how to deploy and configure cert-manager.
You will learn how to create an SSL certificate using Let's Encrypt.
And finally you will learn how that certificate can be used in Kubernetes to serve an HTTPS website.

> **Let’s Encrypt**: An Internet service. Allows you to generate free short-lived SSL certificates.<br/>
> **Kubernetes**: Runs on your servers. Automates the deployment, scaling, and management of containerized applications.<br/>
> **cert-manager**: Runs in Kubernetes. Obtains TLS / SSL certificates and ensures the certificates are valid and up-to-date.

## Prerequisites

You will need to install the following software on your laptop:

1. [minikube](https://kubernetes.io/docs/tasks/tools/#minikube): Quickly set up a local Kubernetes cluster on macOS, Linux, and Windows.
2. [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl): The Kubernetes command-line tool which allows you to configure Kubernetes clusters.

## 1. Create a Kubernetes Cluster

To get started, let's create a Kubernetes cluster using `minikube`:

```bash
minikube start
```

Now check that you can connect to the cluster:

```bash
kubectl get nodes
```

> ⚠️ It may take 2-3 minutes to create the cluster because minikube will need to download and cache all the software.

## 2. Install cert-manager

Install cert-manager using `kubectl` as follows:

```
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml
```

You can view some of the resources that have been installed as follows:

```bash
kubectl -n cert-manager get all
```

> ℹ️ Learn about other ways to install cert-manager by reading the [Installing cert-manager Section](../installation).

## 3. Check that cert-manager is working

Once the cert-manager has been installed, you can check that it is working by configuring it to create a test SSL certificate in a temporary Kubernetes namespace.

Open a text editor and create a new file called `cert-manager-test.yaml` with the following content:

```yaml
# cert-manager-test.yaml
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
```

Now apply that configuration to the Kubernetes cluster:

```bash
kubectl apply -f cert-manager-test.yaml
```

An Issuer and a Certificate will be created.
You'll learn more about those resources shortly.
For now, you just need to check whether cert-manager has processed the Certificate.
It should have created a Secret called selfsigned-cert-tls containing a `tls.key` and a `tls.crt`.

```bash
kubectl describe secrets -n cert-manager-test selfsigned-cert-tls
```

The output should look something like this:

```console
Name:         selfsigned-cert-tls
Namespace:    cert-manager-test
Type:  kubernetes.io/tls

Data
====
ca.crt:   1021 bytes
tls.crt:  1021 bytes
tls.key:  1675 bytes
```

> ℹ️ Read more about [Kubernetes Secrets and how to use them](https://kubernetes.io/docs/concepts/configuration/secret/).




### Setup Ingress Controller
In Kubernetes Cluster, there is an Ingress Controller that accepts public traffic. In this example, we will use an existing ingress controller to accept the incoming web requests for the let’s encrypt challenge. This will allow us to solve the let’s encrypt challenge.

Let’s go ahead and deploy an Ingress controller to our cluster. If you already have an existing ingress controller, skip this section.

1. The first step is to create an ingress controller namespace.

        $ kubect create ns ingress-nginx

2. In this namespace, apply the installation YAML file for the ingress controller.

        kubectl -n ingress-nginx apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.2/deploy/static/provider/cloud/deploy.yaml

3. Now deploy the ingress controller in your kubernetes cluster that can be used to take the traffic. To view the ingress controller that is up and running, run the following command:

        $ kubectl -n ingress-nginx get pods

4. To view the type of the loadbalancer, execute the following command:

        $ kubectl -n ingress-nginx get svc

    In case you are managing it locally with no DNS name, you can bind it with an address and port forward to ingress controller using the following command:

        $ kubectl -n ingress-nginx --address 0.0.0.0 port-forward svc/ingress-nginx-controller 80
        $ kubectl -n ingress-nginx --address 0.0.0.0 port-forward svc/ingress-nginx-controller 443

### Setup DNS

1. Now that the ingress controller has been deployed, the next step is to get the public IP of this machine so we can link the DNS record with the IP address. To do so, run the following command:

        $ curl ifconfig.co

    This will return the public IP of the server. However, if you are already using a cloud platform, your ingress controller and cloud provider will provide you with the public IP. It is recommended that you link that IP to your DNS.

2. Sign into [Google Domains](https://domains.google/) and create a DNS.
3. Scroll down to the **Custom resource records** section.
4. Add an 'A' record followed by the IP returned by the server. Wait for a while for the DNS to be propagated.
5. Now try to access your DNS in your browser which will also be publically accessible.

### Setup Let's Encrypt

TBD
