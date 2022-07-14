---
title: Getting Started
description: Learn how to deploy cert-manager in your Kubernetes cluster and how to configure it to sign SSL certificates using Let's Encrypt
---

In this tutorial you will learn how to deploy and configure cert-manager on Kubernetes in Google Cloud (GKE).
You will learn how to create an SSL certificate using Let's Encrypt using cert-manager.
And finally you will learn how that certificate can be used in Kubernetes to serve an HTTPS website with a public domain name.

> **Let’s Encrypt**: An Internet service. Allows you to generate free short-lived SSL certificates.<br/>
> **Kubernetes**: Runs on your servers. Automates the deployment, scaling, and management of containerized applications.<br/>
> **cert-manager**: Runs in Kubernetes. Obtains TLS / SSL certificates and ensures the certificates are valid and up-to-date.<br/>
> **Google Cloud**: A suite of cloud computing services by Google.

You will create a Kubernetes cluster, install cert-manager, deploy a sample web server, set up Ingress and load balancers so that Internet clients can connect to the web server using HTTP. Finally you will use cert-manager to create an SSL certificate signed by Let's Encrypt and configure the load balancer to use that certificate allowing Internet clients to connect to the web server using HTTPS by visiting https://$DOMAIN_NAME.

## Prerequisites

You will need a Google Cloud account.
Registration requires a credit card or bank account details.
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

> ℹ️ Try running `gcloud components install kubectl` to quickly install `kubectl`.

This tutorial requires you to run certain commands and you will need to adapt some of them for your environment.
Where ever you see a `$VARIABLE_NAME` in a command, you need to either replace the variable before you execute the command,
or assign a value to the variable and export it so that the value can be substituted automatically by your shell.
E.g. Here are the values that I used while writing this tutorial:

```bash
export PROJECT=jetstack-richard
export REGION=europe-west1
export CLUSTER=test-cluster-1
export ZONE=jetstacker-richard
export DOMAIN_NAME=www.richard-gcp.jetstacker.net
export EMAIL_ADDRESS=richard.wall@jetstack.io
```

Once you've installed `gcloud` configure it to use your preferred project and region:

```bash
gcloud config set project $PROJECT
gcloud config set compute/region $REGION
```

## 1. Create a Kubernetes Cluster

To get started, let's create a Kubernetes cluster in Google Cloud:

```bash
gcloud container clusters create $CLUSTER --preemptible --num-nodes=1
```

Set up the [Google Kubernetes Engine auth plugin for kubectl](https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke):

```bash
gcloud components install gke-gcloud-auth-plugin
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
gcloud container clusters get-credentials $CLUSTER
```

Now check that you can connect to the cluster:

```bash
kubectl get nodes -o wide
```

> ℹ️ To minimise your cloud bill, this command creates a 1-node cluster using a
> [preemptible virtual
> machine](https://cloud.google.com/kubernetes-engine/docs/how-to/preemptible-vms)
> which is cheaper than a normal virtual machine.
>
> ⏲️It will take 4-5 minutes to create the cluster.

## 2. Install cert-manager

Install cert-manager using `kubectl` as follows:

```
kubectl apply \
  -f https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml
```

You can view some of the resources that have been installed as follows:

```bash
kubectl -n cert-manager get all
```

> 🔰 Read about [other ways to install cert-manager](../installation).

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

> 🔰 Read more about [Kubernetes Secrets and how to use them](https://kubernetes.io/docs/concepts/configuration/secret/).

## 4. Deploy a sample web server

We will deploy a very simple web server which responds to HTTP requests with the message "hello world!".

```bash
kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
```

We also need to create a Kubernetes Service, so that connections can be routed to the web server Pods:

```bash
kubectl expose deployment web --port=8080
```

> 🔰 Read more about [Using a Service to Expose Your App](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/).

## 5. Create a static external IP address

Create a static IP address as follows:

```bash
gcloud compute addresses create web-ip --global
```

You should see the new IP address listed:

```bash
gcloud compute addresses list
```

> ⚠️ You MUST create a `global` IP address because that is a prerequisite of the [External HTTP(S) Load Balancer](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress-xlb) which we will be using in this tutorial.
>
> 💵 Global static IP addresses are only available in the Premium network service tier and are more expensive than ephemeral and standard public IP addresses.
>
> 🔰 Read more about [Network service tiers in Google Cloud](https://cloud.google.com/network-tiers).
>
> 🔰 Read more about [Reserving a static external IP address in Google Cloud](https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address)

## 6. Create a domain name for your website

You will need a domain name for your website and Let's Encrypt checks your domain before it signs your SSL certificate,
so the domain name needs to be reachable from the Internet.

If your top-level domain name is registered with Google cloud you will have a Google Cloud DNS zone for it.
And within that zone you can create a sub-domain DNS record and associate it with the IP address that we created earlier.
For example, if your top-level domain name is example.com, you might create a sub-domain `www.example.com` for your web server.
Here's how you might do that using `gcloud`.

Get the IP address of the global static address you created in the previous step:
```bash
export IP_ADDRESS=$(gcloud compute addresses describe web-ip --format='value(address)' --global)
echo ${IP_ADDRESS}
```

Create an A record:
```bash
gcloud dns record-sets create $DOMAIN_NAME \
    --rrdatas=$IP_ADDRESS \
    --type=A \
    --ttl=60 --zone=$ZONE
```

> ℹ️ Every Google Cloud address has an automatically generated reverse DNS name like `51.159.120.34.bc.googleusercontent.com`,
> but the parent domain `googleusercontent.com` has a CAA record which prevents
> Let's Encrypt from signing certificates for the sub-domains.
> See [Certificate Authority Authorization (CAA)](https://letsencrypt.org/docs/caa/) in the Let's Encrypt documentation.
>
> 🔰 Read more about how to [Add, modify, and delete DNS records in Google Cloud](https://cloud.google.com/dns/docs/records/)

## 7. Create an Ingress

You won't be able to reach your website yet.
Your web server is running inside your Kubernetes cluster but there is no route or proxy through which Internet clients can connect to it, yet!
Now we will create a Kubernetes Ingress object and in Google Cloud this will trigger the creation of a various services which together allow Internet clients to reach your web server running inside your Kubernetes cluster.

Initially we are going to create an HTTP (not an HTTPS) Ingress so that we can test the basic connectivity before adding the SSL layer.

Copy the following YAML into a file called `ingress.yaml` and apply it:

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    # This tells Google Cloud to create an External Load Balancer to realize this Ingress
    kubernetes.io/ingress.class: gce
    # This enables HTTP connections from Internet clients
    kubernetes.io/ingress.allow-http: "true"
    # This tells Google Cloud to associate the External Load Balancer with the static IP which we created earlier
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

This will trigger the creation of a Google HTTP(S) loadbalancer associated with the IP address that you created earlier.
You can watch the progress and the resources that are being created:

```bash
kubectl describe ingress web-ingress
```

Within 4-5 minutes all the load balancer components should be ready and you should be able to connect to the DNS name and see the response from the hello-world web server that we deployed earlier:

```
curl $DOMAIN_NAME
```

Example output:

```console
$ curl  http://www.richard-gcp.jetstacker.net
Hello, world!
Version: 1.0.0
Hostname: web-79d88c97d6-t8hj2
```

At this point we have a Google load balancer which is forwarding HTTP traffic to the hello-world web server running in a Pod in our cluster.

> ⏲️ It may take 4-5 minutes for the load balancer components to be created and
> configured and for Internet clients to be routed to your web server.
>
> 🔰 Read about how to [Use a static IP addresses for HTTP(S) load balancers via Ingress annotation](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress-xlb#static_ip_addresses_for_https_load_balancers)
>
> 🔰 Read a [Summary of external Ingress annotations for GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress#summary_of_external_ingress_annotations)
>
> 🔰 Read about [Troubleshooting Ingress with External HTTP(S) Load Balancing on GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress#testing_the)
>
> ℹ️ There are two Ingress classes available for GKE Ingress. The `gce` class deploys an external load balancer and the `gce-internal` class deploys an internal load balancer. Ingress resources without a class specified default to `gce`.
>
> ⚠️Contrary to the Kubernetes Ingress documentation, you MUST use the `kubernetes.io/ingress.class` annotation rather than the `Ingress.Spec.IngressClassName` field.
> See [kubernetes/ingress-gce/issues#1301](https://github.com/kubernetes/ingress-gce/issues/1301#issuecomment-1133356812) and [kubernetes/ingress-gce#1337](https://github.com/kubernetes/ingress-gce/pull/1337).


## 8. Create an Issuer for Let's Encrypt Staging

Now you need to create a Let's Encrypt SSL certificate so that you can use HTTPS to connect to your web server.
This involves creating an Issuer and then updating the Ingress object.

An Issuer is a custom resource which tells cert-manager how to sign a Certificate.
In this case the Issuer will be configured to connect to the Let's Encrypt staging server,
which allows us to test everything without using up our Let's Encrypt certificate quota for the domain name.

Save the following content to a file called `issuer-lets-encrypt-staging.yaml` and apply it:

```yaml
# issuer-lets-encrypt-staging.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: $EMAIL_ADDRESS # ❗ Replace this with your email address
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          name: web-ingress
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


## 9. Re-configure the Ingress for SSL

Create an empty Secret for your SSL certificate **before reconfiguring the Ingress** and apply it:

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

Now make the following changes to the Ingress and apply them:

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
+        - $DOMAIN_NAME
   defaultBackend:
     service:
       name: web
```

```
kubectl apply -f ingress.yaml
```

This triggers a complex set of operations which may take many minutes to eventually complete.
Here's a brief summary:

* cert-manager connects to Let's Encrypt and sends an SSL certificate signing request..
* Let's Encrypt responds with a "challenge", which is a unique token that cert-manager must make available at a well-known location on the target web site. This proves that you are an administrator of that web site and domain name.
* cert-manager deploys a Pod containing a temporary web server that serves the Let's Encrypt challenge token.
* cert-manager reconfigures the Ingress, adding a `rule` to route requests for from Let's Encrypt to that temporary web server.
* Google Cloud ingress controller reconfigures the external HTTP load balancer with that new rule.
* Let's Encrypt now connects and receives the expected challenge token and the signs the SSL certificate and returns it to cert-manager.
* cert-manager stores the signed SSL certificate in the Kubernetes Secret called `web-ssl`.
* Google Cloud ingress controller uploads the signed certificate and associated private key to a Google Cloud certificate.
* Google Cloud ingress controller reconfigures the external load balancer to serve the uploaded SSL certificate.

Some of these steps take 2-3 minutes and some will initially fail but then subsequently succeed when either cert-manager or the Google ingress controller re-reconciles.
In short, you should expect this to take around 10 minutes and you should expect to see some errors and warnings when you run `kubectl describe ingress web-ingress`. Eventually you should see something like:

```console
$ kubectl describe ingress web-ingress
Name:             web-ingress
Labels:           <none>
Namespace:        default
Address:          34.120.159.51
Ingress Class:    <none>
Default backend:  web:8080 (10.52.0.13:8080)
TLS:
  web-ssl terminates www.richard-gcp.jetstacker.net
Rules:
  Host        Path  Backends
  ----        ----  --------
  *           *     web:8080 (10.52.0.13:8080)
Annotations:  cert-manager.io/issuer: letsencrypt-staging
              ingress.kubernetes.io/backends: {"k8s1-01784147-default-web-8080-1647ccd2":"HEALTHY"}
              ingress.kubernetes.io/forwarding-rule: k8s2-fr-1lt9dzcy-default-web-ingress-yteotwe4
              ingress.kubernetes.io/https-forwarding-rule: k8s2-fs-1lt9dzcy-default-web-ingress-yteotwe4
              ingress.kubernetes.io/https-target-proxy: k8s2-ts-1lt9dzcy-default-web-ingress-yteotwe4
              ingress.kubernetes.io/ssl-cert: k8s2-cr-1lt9dzcy-4gjeakdb9n7k6ls7-a257650b5fefd174
              ingress.kubernetes.io/target-proxy: k8s2-tp-1lt9dzcy-default-web-ingress-yteotwe4
              ingress.kubernetes.io/url-map: k8s2-um-1lt9dzcy-default-web-ingress-yteotwe4
              kubernetes.io/ingress.allow-http: true
              kubernetes.io/ingress.class: gce
              kubernetes.io/ingress.global-static-ip-name: web-ip
Events:
  Type     Reason             Age                 From                       Message
  ----     ------             ----                ----                       -------
  Normal   CreateCertificate  28m                 cert-manager-ingress-shim  Successfully created Certificate "web-ssl"
  Normal   Sync               28m                 loadbalancer-controller    UrlMap "k8s2-um-1lt9dzcy-default-web-ingress-yteotwe4" updated
  Warning  Sync               24m (x16 over 28m)  loadbalancer-controller    Error syncing to GCP: error running load balancer syncing routine: loadbalancer 1lt9dzcy-default-web-ingress-yteotwe4 does not exist: googleapi: Error 404: The resource 'projects/jetstack-richard/global/sslCertificates/k8s2-cr-1lt9dzcy-4gjeakdb9n7k6ls7-e3b0c44298fc1c14' was not found, notFound
  Normal   Sync               34s (x16 over 65m)  loadbalancer-controller    Scheduled for sync
```

And if you have installed the cert-manager CLI (cmctl) you will see some temporary errors, like:

```console
$ cmctl status certificate web-ssl
Name: web-ssl
Namespace: default
Created at: 2022-07-14T17:30:06+01:00
Conditions:
  Ready: False, Reason: MissingData, Message: Issuing certificate as Secret does not contain a private key
  Issuing: True, Reason: MissingData, Message: Issuing certificate as Secret does not contain a private key
DNS Names:
- www.richard-gcp.jetstacker.net
Events:
  Type    Reason     Age    From                                       Message
  ----    ------     ----   ----                                       -------
  Normal  Issuing    4m37s  cert-manager-certificates-trigger          Issuing certificate as Secret does not contain a private key
  Normal  Generated  4m37s  cert-manager-certificates-key-manager      Stored new private key in temporary Secret resource "web-ssl-8gsqc"
  Normal  Requested  4m37s  cert-manager-certificates-request-manager  Created new CertificateRequest resource "web-ssl-dblrj"
Issuer:
  Name: letsencrypt-staging
  Kind: Issuer
  Conditions:
    Ready: True, Reason: ACMEAccountRegistered, Message: The ACME account was registered with the ACME server
  Events:  <none>
error: 'tls.crt' of Secret "web-ssl" is not set
Not Before: <none>
Not After: <none>
Renewal Time: <none>
CertificateRequest:
  Name: web-ssl-dblrj
  Namespace: default
  Conditions:
    Approved: True, Reason: cert-manager.io, Message: Certificate request has been approved by cert-manager.io
  Ready: False, Reason: Pending, Message: Waiting on certificate issuance from order default/web-ssl-dblrj-327645514: "pending"
  Events:
    Type    Reason           Age    From                                          Message
    ----    ------           ----   ----                                          -------
    Normal  cert-manager.io  4m37s  cert-manager-certificaterequests-approver     Certificate request has been approved by cert-manager.io
    Normal  OrderCreated     4m37s  cert-manager-certificaterequests-issuer-acme  Created Order resource default/web-ssl-dblrj-327645514
    Normal  OrderPending     4m37s  cert-manager-certificaterequests-issuer-acme  Waiting on certificate issuance from order default/web-ssl-dblrj-327645514: ""
Order:
  Name: web-ssl-dblrj-327645514
  State: pending, Reason:
  Authorizations:
    URL: https://acme-staging-v02.api.letsencrypt.org/acme/authz-v3/3008789144, Identifier: www.richard-gcp.jetstacker.net, Initial State: pending, Wildcard: false
Challenges:
- Name: web-ssl-dblrj-327645514-2671694319, Type: HTTP-01, Token: TKspp86xMjQzTvMVXWkezEA2sE2GSWjnld5Lt4X13ro, Key: TKspp86xMjQzTvMVXWkezEA2sE2GSWjnld5Lt4X13ro.f4bppCOm-jXasFGMKjpBE5aQlhiQBeTPIs0Lx822xao, State: pending, Reason: Waiting for HTTP-01 challenge propagation: did not get expected response when querying endpoint, expected "TKspp86xMjQzTvMVXWkezEA2sE2GSWjnld5Lt4X13ro.f4bppCOm-jXasFGMKjpBE5aQlhiQBeTPIs0Lx822xao" but got: Hello, world!
Version: 1... (truncated), Processing: true, Presented: true
```

But eventually you will see that the Certificate is Ready and signed:

```console
$ cmctl status certificate web-ssl
Name: web-ssl
Namespace: default
Created at: 2022-07-14T17:30:06+01:00
Conditions:
  Ready: True, Reason: Ready, Message: Certificate is up to date and has not expired
DNS Names:
- www.richard-gcp.jetstacker.net
Events:
  Type    Reason     Age   From                                       Message
  ----    ------     ----  ----                                       -------
  Normal  Issuing    31m   cert-manager-certificates-trigger          Issuing certificate as Secret does not contain a private key
  Normal  Generated  31m   cert-manager-certificates-key-manager      Stored new private key in temporary Secret resource "web-ssl-8gsqc"
  Normal  Requested  31m   cert-manager-certificates-request-manager  Created new CertificateRequest resource "web-ssl-dblrj"
  Normal  Issuing    26m   cert-manager-certificates-issuing          The certificate has been successfully issued
Issuer:
  Name: letsencrypt-staging
  Kind: Issuer
  Conditions:
    Ready: True, Reason: ACMEAccountRegistered, Message: The ACME account was registered with the ACME server
  Events:  <none>
Secret:
  Name: web-ssl
  Issuer Country: US
  Issuer Organisation: (STAGING) Let's Encrypt
  Issuer Common Name: (STAGING) Artificial Apricot R3
  Key Usage: Digital Signature, Key Encipherment
  Extended Key Usages: Server Authentication, Client Authentication
  Public Key Algorithm: RSA
  Signature Algorithm: SHA256-RSA
  Subject Key ID: a51e3621f5c1138947810f27dce425b33c88cb16
  Authority Key ID: de727a48df31c3a650df9f8523df57374b5d2e65
  Serial Number: fa8bb0b603ca2cdbfdfb2872d05ee52cda10
  Events:  <none>
Not Before: 2022-07-14T16:34:52+01:00
Not After: 2022-10-12T16:34:51+01:00
Renewal Time: 2022-09-12T16:34:51+01:00

```

You will see a certificate in Google Cloud:

```console
$ gcloud compute ssl-certificates list
NAME                                                TYPE          CREATION_TIMESTAMP             EXPIRE_TIME                    MANAGED_STATUS
k8s2-cr-1lt9dzcy-4gjeakdb9n7k6ls7-a257650b5fefd174  SELF_MANAGED  2022-07-14T09:37:06.920-07:00  2022-10-12T08:34:51.000-07:00
```

And you will see a forwarding-rule for the SSL connections:

```console
$ gcloud compute forwarding-rules describe k8s2-fs-1lt9dzcy-default-web-ingress-yteotwe4 --global
IPAddress: 34.120.159.51
IPProtocol: TCP
creationTimestamp: '2022-07-14T09:37:12.362-07:00'
description: '{"kubernetes.io/ingress-name": "default/web-ingress"}'
fingerprint: oBTg7dRaIqI=
id: '2303318464959215831'
kind: compute#forwardingRule
labelFingerprint: 42WmSpB8rSM=
loadBalancingScheme: EXTERNAL
name: k8s2-fs-1lt9dzcy-default-web-ingress-yteotwe4
networkTier: PREMIUM
portRange: 443-443
selfLink: https://www.googleapis.com/compute/v1/projects/jetstack-richard/global/forwardingRules/k8s2-fs-1lt9dzcy-default-web-ingress-yteotwe4
target: https://www.googleapis.com/compute/v1/projects/jetstack-richard/global/targetHttpsProxies/k8s2-ts-1lt9dzcy-default-web-ingress-yteotwe4
```

When all these pieces are in place you should eventually be able to
use curl to check the HTTPS connection to your website:

```bash
curl -v --insecure https://$DOMAIN_NAME
```

You should see that the HTTPS connection is established but that the SSL certificate is not trusted,
that's why you use the `--insecure` flag at this stage:

```console
* Server certificate:
*  subject: CN=www.richard-gcp.jetstacker.net
*  start date: Jul 14 08:52:29 2022 GMT
*  expire date: Oct 12 08:52:28 2022 GMT
*  issuer: C=US; O=(STAGING) Let's Encrypt; CN=(STAGING) Artificial Apricot R3
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
```

> ⏲️You will have to wait 5-10 minutes for the SSL certificate to be signed and then loaded by the Google Cloud load balancer.
>
> 🔰 Read about how to [Specify certificates for your Ingress in GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-multi-ssl#specifying_certificates_for_your_ingress)

## 10. Create a production ready SSL certificate

Now that everything is working with the Let's Encrypt staging server, we can switch to the production server and get a trusted SSL certificate.

Create a Let's Encrypt production Issuer and apply it:

```yaml
# issuer-lets-encrypt-production.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: $EMAIL_ADDRESS
    privateKeySecretRef:
      name: letsencrypt-production
    solvers:
    - http01:
        ingress:
          name: web-ingress
```

```bash
kubectl apply -f issuer-lets-encrypt-production.yaml
```

Then update the Ingress annotation to use the production Issuer:

```bash
kubectl annotate ingress web-ingress cert-manager.io/issuer=letsencrypt-production --overwrite
```

And finally renew the certificate:

```bash
cmctl renew web-ssl
```

This will trigger cert-manager to get a new SSL certificate signed by the Let's Encrypt production CA and store it to the `web-ssl` Secret.
Within about 10 minutes, this new certificate will be synced to the Google Cloud load balancer and you will be able to connect to the website using secure HTTPS:

```bash
curl -v https://$DOMAIN_NAME
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
