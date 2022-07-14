---
title: Getting Started
description: Learn how to deploy cert-manager in your Kubernetes cluster and how to configure it to sign SSL certificates using Let's Encrypt
---

In this tutorial you will learn how to deploy and configure cert-manager on Kubernetes in Google Cloud (GKE).
You will learn how to create an SSL certificate using Let's Encrypt using cert-manager.
And finally you will learn how that certificate can be used in Kubernetes to serve an HTTPS website.

> **Let’s Encrypt**: An Internet service. Allows you to generate free short-lived SSL certificates.<br/>
> **Kubernetes**: Runs on your servers. Automates the deployment, scaling, and management of containerized applications.<br/>
> **cert-manager**: Runs in Kubernetes. Obtains TLS / SSL certificates and ensures the certificates are valid and up-to-date.
> **Google Cloud**:

## Prerequisites

You will need a Google Cloud account.
Visit the [Get started with Google Cloud](https://cloud.google.com/docs/get-started) page and follow the instructions.

> ℹ️ If you have never used Google Cloud before, you may be eligible for the
> [Google Cloud Free
> Program](https://cloud.google.com/free/docs/gcp-free-tier/#free-trial), which
> gives you a 90-day trial period that includes $300 in free Cloud Billing
> credits to explore and evaluate Google Cloud.

You will also need to install the following software on your laptop:

1. [gcloud](https://cloud.google.com/sdk/docs/install): A set of tools to create and manage Google Cloud resources.
2. [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl): The Kubernetes command-line tool which allows you to configure Kubernetes clusters.
3. [curl](https://everything.curl.dev/get): A command-line tool for connecting to a web server using HTTP and HTTPS.

## 1. Create a Kubernetes Cluster

To get started, let's create a Kubernetes cluster in Google Cloud:

```bash
gcloud container clusters create test-cluster-1 --preemptible --num-nodes=1
```

> ℹ️ To minimise your cloud bill, this command creates a 1-node cluster using a
> [preemptible virtual
> machine](https://cloud.google.com/kubernetes-engine/docs/how-to/preemptible-vms)
> which is cheaper than a normal virtual machine.

Set up the [Google Kubernetes Engine auth plugin for kubectl](https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke):

```bash
gcloud components install gke-gcloud-auth-plugin
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
gcloud container clusters get-credentials test-cluster-1
```

Now check that you can connect to the cluster:

```bash
kubectl get nodes
```

> ⚠️ It may take 2-3 minutes to create the cluster.

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

Delete the test configuration afterwards:

```bash
kubectl delete -f cert-manager-test.yaml
```

> ℹ️ Read more about [Kubernetes Secrets and how to use them](https://kubernetes.io/docs/concepts/configuration/secret/).


### Deploy a hello world app

```bash
kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
```

Create a service too:

```bash
kubectl expose deployment web --port=8080
```

### Create a static external IP address

Create a static IP address as follows:

```bash
gcloud compute addresses create web-ip --global
```

You should see it listed:

```bash
gcloud compute addresses list
```

> 🔰 Read more about [Reserving a static external IP address in Google Cloud](https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address)

### Create a DNS name

You will need a DNS record for the ingress.
The DNS record should by associated with the IP address that we created earlier.

Print the IP address:

```bash
ip_address=$(gcloud compute addresses describe web-ip --format='value(address)' --global)
echo ${ip_address}
```

Create an A record:
```bash
gcloud dns record-sets create www.richard-gcp.jetstacker.net. \
    --rrdatas=${ip_address} \
    --type=A \
    --ttl=60 --zone=jetstacker-richard
```

> ⚠️You can't use the reverse DNS name for a Google Cloud address because the parent domain has a CAA record
> which prevents Let's Encrypt from signing certificates for that domain. E.g.
> `CAA record for 51.159.120.34.bc.googleusercontent.com prevents issuance`.
>
> 🔰 Read more about how to [Add, modify, and delete DNS records in Google Cloud](https://cloud.google.com/dns/docs/records/)

### Create an Ingress

Copy the DNS name into the "host"  field below and save it to a file called `ingress.yaml`.

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  annotations:
    kubernetes.io/ingress.class: gce
    kubernetes.io/ingress.allow-http: "true"
    kubernetes.io/ingress.global-static-ip-name: web-ip
spec:
  defaultBackend:
    service:
      name: web
      port:
        number: 8080
```

```bash
kubectl apply -f ingress.yaml
```
> ℹ️ There are two Ingress classes available for GKE Ingress. The `gce` class deploys an external load balancer and the `gce-internal` class deploys an internal load balancer. Ingress resources without a class specified default to gce.
> Read more about [Configuring Ingress for external load balancing in GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress#creating_an_ingress)
>
> ⚠️Contrary to the Kubernetes Ingress documentation, you MUST use the `kubernetes.io/ingress.class` annotation rather than the `Ingress.Spec.IngressClassName` field.
> See [kubernetes/ingress-gce/issues#1301](https://github.com/kubernetes/ingress-gce/issues/1301#issuecomment-1133356812) and [kubernetes/ingress-gce#1337](https://github.com/kubernetes/ingress-gce/pull/1337).

This will trigger the creation of a Google HTTP(S) loadbalancer associated with the IP address that you created earlier.
This will take 2-3 minutes.
You can watch the progress

```bash
kubectl describe ingress example-ingress
```

Within 4-5 minutes all the load balancer components should be ready and you should be able to connect to the DNS name and see the response from the hello-world app that we deployed earlier:

```
curl http://www.richard-gcp.jetstacker.net
```

Example output:

```console
$ curl  http://www.richard-gcp.jetstacker.net
Hello, world!
Version: 1.0.0
Hostname: web-79d88c97d6-t8hj2
```

At this point we have a Google loadbalancer which is forwarding HTTP traffic to the hello-world web server running in a Pod in our cluster.

> 🔰 Read about how to [Specify certificates for your Ingress in GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-multi-ssl#specifying_certificates_for_your_ingress)
> 🔰 Read about how to [Use a static IP addresses for HTTP(S) load balancers via Ingress annotation](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress-xlb#static_ip_addresses_for_https_load_balancers)
> 🔰 Read a [Summary of external Ingress annotations for GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress#summary_of_external_ingress_annotations)
> 🔰 Read about [Troubleshooting Ingress with External HTTP(S) Load Balancing on GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress#testing_the)

### Set up a Let's Encrypt Staging Issuer

Now we want to create a Let's Encrypt SSL certificate so that we can use HTTPS to connect to our web server.
This Issuer will be configured to connect to the Let's Encrypt staging server,
which allows us to test everything is working without using up our Let's Encrypt certificate quota for the domain name.

Save the following content to a file called `issuer-lets-encrypt-staging.yaml`:

```yaml
# issuer-lets-encrypt-staging.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: le1+richard.wall@jetstack.io
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          name: example-ingress
```


```bash
kubectl apply -f issuer-lets-encrypt-staging.yaml
```

You can check the status of the Issuer:

```bash
kubectl describe issuers.cert-manager.io letsencrypt-staging
```

Example output

```console
Status:
  Acme:
    Last Registered Email:  le1+richard.wall@jetstack.io
    Uri:                    https://acme-staging-v02.api.letsencrypt.org/acme/acct/60706744
  Conditions:
    Last Transition Time:  2022-07-13T16:13:25Z
    Message:               The ACME account was registered with the ACME server
    Observed Generation:   1
    Reason:                ACMEAccountRegistered
    Status:                True
    Type:                  Ready
```


### Configure the Ingress for SSL

Create an empty Secret before reconfiguring the Ingress:

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: web-ssl
type: kubernetes.io/tls
stringData:
  tls.key: ""
  tls.crt: ""
```

```bash
kubectl apply -f secret.yaml
```

> ℹ️ This is a work around for a chicken-and-egg problem, where the ingress-gce
> controller won't update its forwarding rules unless it can first find the
> Secret that will eventually contain the SSL certificate. But Let's Encrypt
> won't sign the SSL certificate until it can get the special
> `.../.well-known/acme-challenge/...` URL which cert-manager adds to the
> Ingress and which must then be translated into Google Cloud forwarding rules,
> by the ingress-gce controller.

Make the following changes to the Ingress:

```diff

--- a/ingress.yaml
+++ b/ingress.yaml
@@ -7,7 +7,12 @@ metadata:
     kubernetes.io/ingress.class: gce
     kubernetes.io/ingress.allow-http: "true"
     kubernetes.io/ingress.global-static-ip-name: web-ip
+    cert-manager.io/issuer: letsencrypt-staging
 spec:
+  tls:
+    - secretName: web-ssl
+      hosts:
+        - www.richard-gcp.jetstacker.net
   defaultBackend:
     service:
       name: web
```

Apply the new config:

```
kubectl apply -f ingress.yaml
```

> ⚠️ You will have to wait 5-10 minutes for the SSL certificate to be signed and then loaded by the Google Cloud load balancer.

Use curl to check the HTTPS connection to your website:

```bash
curl -v --insecure https://www.richard-gcp.jetstacker.net
```

You should see that the HTTPS connection is established but that the SSL certificate is not trusted, that's why you use the `--insecure` flag at this stage.:

```console
* Server certificate:
*  subject: CN=www.richard-gcp.jetstacker.net
*  start date: Jul 14 08:52:29 2022 GMT
*  expire date: Oct 12 08:52:28 2022 GMT
*  issuer: C=US; O=(STAGING) Let's Encrypt; CN=(STAGING) Artificial Apricot R3
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
```


Now that everything is working with the Let's Encrypt staging server, we can switch to the production server and get a trusted SSL certificate.

Create a Let's Encrypt production Issuer:

```yaml
# issuer-lets-encrypt-production.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: le1+richard.wall@jetstack.io
    privateKeySecretRef:
      name: letsencrypt-production
    solvers:
    - http01:
        ingress:
          name: example-ingress
```

```bash
kubectl apply -f issuer-lets-encrypt-production.yaml
```

Then update the Ingress annotation to use the production Issuer:

```bash
kubectl annotate ingress example-ingress cert-manager.io/issuer=letsencrypt-production --overwrite
```

And finally renew the certificate:

```bash
cmctl renew web-ssl
```

This will trigger cert-manager to get a new SSL certificate signed by the Let's Encrypt production CA and store it to the `web-ssl` Secret.
Within about 10 minutes, this new certificate will be synced to the Google Cloud load balancer and you will be able to connect to the website using secure HTTPS:

```bash
curl -v https://www.richard-gcp.jetstacker.net/
```


```console
...
* Server certificate:
*  subject: CN=www.richard-gcp.jetstacker.net
*  start date: Jul 14 09:44:29 2022 GMT
*  expire date: Oct 12 09:44:28 2022 GMT
*  subjectAltName: host "www.richard-gcp.jetstacker.net" matched cert's "www.richard-gcp.jetstacker.net"
*  issuer: C=US; O=Let's Encrypt; CN=R3
*  SSL certificate verify ok.
...
Hello, world!
Version: 1.0.0
Hostname: web-79d88c97d6-t8hj2
```
