---
title: Getting Started
description: Learn how to deploy cert-manager in your Kubernetes cluster and how to configure it to sign SSL certificates using Let's Encrypt
---

## Introduction
In this section, we will discuss how to deploy a cert-manager for your Kubernetes cluster. Typically, the TLS or SSL certificates are stored as Kubernetes secrets. These certificates are utilized by various namespaces to further be consumed by applications or ingress controllers. However, these certificates come with an expiry date which can vary for each certificate. Not timely updating these certificates can cause issues and disruptions.

## The Challenge
There can be two main reasons for the disruption:
* The first reason is human error. The more Kubernetes cluster or namespaces there are, the more effort it would take to put in to manually update and maintain them. Also, there can be chances of missing out on one or more clusters and it can cause downtime.
* The second reason is the security of the certificates. Long-term certificates that have an expiry date of two years have more chances of security breaches. Kubernetes provides a way to protect the certificates using RBAC, but cluster administrators still have access to them.

### What is Let’s Encrypt?
Let’s Encrypt is a certificate authority that allows to generate free short-lived certificates automatically. To get a certificate, run a certbot on the server. It forwards a request for certificate to Let’s Encrypt which in return provides a challenge. The certbot successfully fulfills the challenge, upon which Let’s Encrypt provides the certificate. You can automate this process using a cron job.

In case, you have multiple domains and want multiple SSL certificates for each, how to automate the certificate lifecycle to keep them secure? This is where cert-manager comes in. It lives in your Kubernetes clusters. It is wired up to a certificate authority such as Let’s Encrypt, Vault, etc. The certificate request can be forwarded using a YAML file.


### How is YAML File Used?
In the Yaml file, simply specify the domain for which the certificate is required, along with the secret for where the certificate will be stored in. The cert-manager will interact with the CA and place the newly issued certificate in the specified Kubernetes secret. It will also replace the Kubernetes secret with a new one when it is about to expire. This means you can get free and automated SSL certificate generation with complete certificate lifecycle management.

### What is cert-manager?
Cert-manager is a Kubernetes add-on that automates the management and issuance of TLS certificate. It looks at different issuers, certificate objects, and pods. We can use the cert-managr using a yaml file. The [cert-manager documentation](https://cert-manager.io/docs/) provides a good description about how to use Let’s encrypt, create certificate objects, and pull up certificate requests.

## Step-by-Step Process
### Prerequisites
* You must have a working container
* Mount Kubeconfig file and code using the command:
  `docker run -it --rm -v ${HOME}:/root/ -v ${PWD}:/work -w /work --net host alpine sh`
* Install kubectl

### Create a Kubernetes Cluster

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
