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

1. [minikube](https://minikube.sigs.k8s.io/docs/start/): minikube quickly sets up a local Kubernetes cluster on macOS, Linux, and Windows.

To get started, let's create a Kubernetes cluster. If your Kubernetes cluster already exists, then skip the first step.

1. In the Kubernetes cluster, there is a utility called kind that will spin up lightweight Kubernetes cluster. Use the following command to create a Kubernetes cluster.

        $ kind create cluster --name certmanager --image kindest/node:v1.19.1

2. After the cluster has been created, access the up and running nodes that exist within that cluster. To do so, execute the following kubectl command:

        $ kubectl get nodes

### Install cert-manager
1. Visit the [cert-manager’s GitHub page](https://github.com/cert-manager/cert-manager).
2. Locate the release section, select the release to be downloaded.
3. Scroll down to the Assets section and download the `cert-manager.yaml` file. Alternatively, you can also run a curl command as shown below to download it.
    ```
    curl -LO https://github.com/jetstack/cert-manager/releases/download/v1.8.2/cert-manager.yaml
    ```

4. Create a new namespace.

        $ kubectl create ns cert-manager

5. The next step is to deploy cert-manager. Run the following command:

        $ kubectl apply --validate=false -f cert-manager.yaml

    Doing so will install all the required resources and packages. It will also create all the custom resources, bindings, and back permissions, with the service account.

6. To view all of the resources that have been downloaded with the cert-manager installation such as CA injector pods, webhook pods, etc., execute the following command:

        $ kubectl -n cert-manager get all

## Configure a Certificate Issuer

Once the cert-manager has been installed, we need to tie it with a certificate authority.  To do so, we need an issuer. An issuer is used to define the certificate authority to be used. If you already have an issuer, skip this section.

1. To test certificate generation, create a temporary namespace.

        $ kubectl create ns cert-manager-test

    The code below shows what information does an issuer have.

    TBD

2. To deploy the issuer, run the following command:

        $ kubectl apply -f ./selfsigned/issuer.yaml

    An issuer will be created.
    The next step is to request a certificate. To do so, we will use a `certificate.yaml` file. The code below shows how does the certificate.yaml file look like:

    TBD

    The cert-manager will go ahead and request a certificate from the issuer and place the certificate in the `secretName` which in this case is `selfsigned-cert-tls`. Similarly, the issuer being used `test-selfsigned` that we have just deployed.

## Generate a Certificate

1. With all the resources and issuers deployed, the next step is to generate a certificate.

        $ kubectl apply -f ./selfsigned/certificate.yaml

2. The cert-manager will now look at the **create a certiifcate request** for the issuer and then create a secret. You can then go ahead and describe that certificate using the following command:

        $ kubectl describe certificate -n cert-manager-test

3. To view the certificate, list the secrets in that namespace by executing the following:

        $ kubectl get secrets -n cert-manager-test

   A secret will be created in our cluster, ready to use.

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
