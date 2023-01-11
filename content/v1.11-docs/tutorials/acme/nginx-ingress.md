---
title: Securing NGINX-ingress
description: 'cert-manager tutorials: Using ingress-nginx to solve an ACME HTTP-01 challenge'
---

This tutorial will detail how to install and secure ingress to your cluster
using NGINX.

## Step 1 - Install Helm

> *Skip this section if you have helm installed.*

The easiest way to install `cert-manager` is to use [`Helm`](https://helm.sh), a
templating and deployment tool for Kubernetes resources.

First, ensure the Helm client is installed following the [Helm installation
instructions](https://helm.sh/docs/intro/install/).

For example, on MacOS:

```bash
brew install kubernetes-helm
```

## Step 2 - Deploy the NGINX Ingress Controller

A [`kubernetes ingress controller`](https://kubernetes.io/docs/concepts/services-networking/ingress) is
designed to be the access point for HTTP and HTTPS traffic to the software
running within your cluster. The `ingress-nginx-controller` does this by providing
an HTTP proxy service supported by your cloud provider's load balancer.

You can get more details about `ingress-nginx` and how it works from the
[documentation for `ingress-nginx`](https://kubernetes.github.io/ingress-nginx/).

Add the latest helm repository for the ingress-nginx

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

Update the helm repository with the latest charts:

```bash
$ helm repo update
Hang tight while we grab the latest from your chart repositories...
...Skip local chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "ingress-nginx" chart repository
...Successfully got an update from the "coreos" chart repository
Update Complete. ⎈ Happy Helming!⎈
```

Use `helm` to install an NGINX Ingress controller:

```bash
$ helm install quickstart ingress-nginx/ingress-nginx

NAME: quickstart
... lots of output ...
```

It can take a minute or two for the cloud provider to provide and link a public
IP address. When it is complete, you can see the external IP address using the
`kubectl` command:

```bash
$ kubectl get svc
NAME                                            TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
kubernetes                                      ClusterIP      10.0.0.1       <none>        443/TCP                      13m
quickstart-ingress-nginx-controller             LoadBalancer   10.0.114.241   <pending>     80:31635/TCP,443:30062/TCP   8m16s
quickstart-ingress-nginx-controller-admission   ClusterIP      10.0.188.24    <none>        443/TCP                      8m16s
```

This command shows you all the services in your cluster (in the `default`
namespace), and any external IP addresses they have. When you first create the
controller, your cloud provider won't have assigned and allocated an IP address
through the `LoadBalancer` yet. Until it does, the external IP address for the
service will be listed as `<pending>`.

Your cloud provider may have options for reserving an IP address prior to
creating the ingress controller and using that IP address rather than assigning
an IP address from a pool. Read through the documentation from your cloud
provider on how to arrange that.

## Step 3 - Assign a DNS name

The external IP that is allocated to the ingress-controller is the IP to which
all incoming traffic should be routed. To enable this, add it to a DNS zone you
control, for example as `www.example.com`.

This quick-start assumes you know how to assign a DNS entry to an IP address and
will do so.

## Step 4 - Deploy an Example Service

Your service may have its own chart, or you may be deploying it directly with
manifests. This quick-start uses manifests to create and expose a sample service.
The example service uses [`kuard`](https://github.com/kubernetes-up-and-running/kuard),
a demo application.

The quick-start example uses three manifests for the sample. The first two are a
sample deployment and an associated service:

```yaml file=./example/deployment.yaml
```

```yaml file=./example/service.yaml
```

You can create download and reference these files locally, or you can
reference them from the GitHub source repository for this documentation.
To install the example service from the tutorial files straight from GitHub, do
the following:

```bash
kubectl apply -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/deployment.yaml
# expected output: deployment.extensions "kuard" created

kubectl apply -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/service.yaml
# expected output: service "kuard" created
```

An [Ingress resource](https://kubernetes.io/docs/concepts/services-networking/ingress/) is
what Kubernetes uses to expose this example service outside the cluster.  You
will need to download and modify the example manifest to reflect the domain that
you own or  control to complete this example.

A sample ingress you can start with is:

```yaml file=./example/ingress.yaml
```

You can download the sample manifest from GitHub , edit it, and submit the
manifest to Kubernetes with the command below. Edit the file in your editor, and once
it is saved:

```bash
kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/ingress.yaml
# expected output: ingress.extensions "kuard" created
```

> Note: The ingress example we show above has a `host` definition within it. The
> `ingress-nginx-controller` will route traffic when the hostname requested
> matches the definition in the ingress. You *can* deploy an ingress without a
> `host` definition in the rule, but that pattern isn't usable with a TLS
> certificate, which expects a fully qualified domain name.

Once it is deployed, you can use the command `kubectl get ingress` to see the status
 of the ingress:

```text
NAME      HOSTS     ADDRESS   PORTS     AGE
kuard     *                   80, 443   17s
```

It may take a few minutes, depending on your service provider, for the ingress
to be fully created. When it has been created and linked into place, the
ingress will show an address as well:

```text
NAME      HOSTS     ADDRESS         PORTS     AGE
kuard     *         203.0.113.2   80        9m
```

> Note: The IP address on the ingress *may not* match the IP address that the
> `ingress-nginx-controller` has. This is fine, and is a quirk/implementation detail
> of the service provider hosting your Kubernetes cluster. Since we are using
> the `ingress-nginx-controller` instead of any cloud-provider specific ingress
> backend, use the IP address that was defined and allocated for the
> `quickstart-ingress-nginx-controller ` `LoadBalancer` resource as the primary  access point for
> your service.

Make sure the service is reachable at the domain name you added above, for
example `http://www.example.com`. The simplest way is to open a browser
and enter the name that you set up in DNS, and for which we just added the
ingress.

You may also use a command line tool like `curl` to check the ingress.

```bash
$ curl -kivL -H 'Host: www.example.com' 'http://203.0.113.2'
```

The options on this curl command will provide verbose output, following any
redirects, show the TLS headers in the output,  and not error on insecure
certificates. With `ingress-nginx-controller`, the service will be available
with a TLS certificate, but it will be using a self-signed certificate
provided as a default from the `ingress-nginx-controller`. Browsers will show
a warning that this is an invalid certificate. This is expected and normal,
as we have not yet used cert-manager to get a fully trusted certificate
for our site.

> *Warning*: It is critical to make sure that your ingress is available and
> responding correctly on the internet. This quick-start example uses Let's
> Encrypt to provide the certificates, which expects and validates both that the
> service is available and that during the process of issuing a certificate uses
> that validation as proof that the request for the domain belongs to someone
> with sufficient control over the domain.

## Step 5 - Deploy cert-manager

We need to install cert-manager to do the work with Kubernetes to request a
certificate and respond to the challenge to validate it. We can use Helm or
plain Kubernetes manifests to install cert-manager.

Since we installed Helm earlier, we'll assume you want to use Helm; follow the
[Helm guide](../../installation/helm.md). For other methods, read the
[installation documentation](../../installation/README.md) for cert-manager.

cert-manager mainly uses two different custom Kubernetes resources - known as
[`CRDs`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) -
to configure and control how it operates, as well as to store state. These
resources are Issuers and Certificates.

### Issuers

An Issuer defines _how_ cert-manager will request TLS certificates. Issuers are
specific to a single namespace in Kubernetes, but there's also a `ClusterIssuer`
which is meant to be a cluster-wide version.

Take care to ensure that your Issuers are created in the same namespace as the
certificates you want to create. You might need to add `-n my-namespace` to your
`kubectl create` commands.

Your other option is to replace your `Issuers` with `ClusterIssuers`;
`ClusterIssuer` resources apply across all Ingress resources in your cluster.
If using a `ClusterIssuer`, remember to update the Ingress annotation `cert-manager.io/issuer` to
`cert-manager.io/cluster-issuer`.

If you see issues with issuers, follow the [Troubleshooting Issuing ACME Certificates](../../faq/acme.md) guide.

More information on the differences between `Issuers` and `ClusterIssuers` - including
when you might choose to use each can be found on [Issuer concepts](../../concepts/issuer.md#namespaces).

### Certificates

Certificates resources allow you to specify the details of the certificate you
want to request. They reference an issuer to define _how_ they'll be issued.

For more information, see [Certificate concepts](../../concepts/certificate.md).

## Step 6 - Configure a Let's Encrypt Issuer

We'll set up two issuers for Let's Encrypt in this example: staging and production.

The Let's Encrypt production issuer has [very strict rate limits](https://letsencrypt.org/docs/rate-limits/).
When you're experimenting and learning, it can be very easy to hit those limits. Because of that risk,
we'll start with the Let's Encrypt staging issuer, and once we're happy that it's working
we'll switch to the production issuer.

Note that you'll see a warning about untrusted certificates from the staging issuer, but that's totally expected.

Create this definition locally and update the email address to your own. This
email is required by Let's Encrypt and used to notify you of certificate
expiration and updates.

```yaml file=./example/staging-issuer.yaml
```

Once edited, apply the custom resource:

```bash
kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/staging-issuer.yaml
# expected output: issuer.cert-manager.io "letsencrypt-staging" created
```

Also create a production issuer and deploy it. As with the staging issuer, you
will need to update this example and add in your own email address.

```yaml file=./example/production-issuer.yaml
```

```bash
kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/production-issuer.yaml
# expected output: issuer.cert-manager.io "letsencrypt-prod" created
```

Both of these issuers are configured to use the [`HTTP01`](../../configuration/acme/http01/README.md) challenge provider.

Check on the status of the issuer after you create it:

```bash
$ kubectl describe issuer letsencrypt-staging
Name:         letsencrypt-staging
Namespace:    default
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"cert-manager.io/v1","kind":"Issuer","metadata":{"annotations":{},"name":"letsencrypt-staging","namespace":"default"},(...)}
API Version:  cert-manager.io/v1
Kind:         Issuer
Metadata:
  Cluster Name:
  Creation Timestamp:  2018-11-17T18:03:54Z
  Generation:          0
  Resource Version:    9092
  Self Link:           /apis/cert-manager.io/v1/namespaces/default/issuers/letsencrypt-staging
  UID:                 25b7ae77-ea93-11e8-82f8-42010a8a00b5
Spec:
  Acme:
    Email:  email@example.com
    Private Key Secret Ref:
      Key:
      Name:  letsencrypt-staging
    Server:  https://acme-staging-v02.api.letsencrypt.org/directory
    Solvers:
      Http 01:
        Ingress:
          Class:  nginx
Status:
  Acme:
    Uri:  https://acme-staging-v02.api.letsencrypt.org/acme/acct/7374163
  Conditions:
    Last Transition Time:  2018-11-17T18:04:00Z
    Message:               The ACME account was registered with the ACME server
    Reason:                ACMEAccountRegistered
    Status:                True
    Type:                  Ready
Events:                    <none>
```

You should see the issuer listed with a registered account.

## Step 7 - Deploy a TLS Ingress Resource

With all the prerequisite configuration in place, we can now do the pieces to
request the TLS certificate. There are two primary ways to do this: using
annotations on the ingress with [`ingress-shim`](../../usage/ingress.md) or
directly creating a certificate resource.

In this example, we will add annotations to the ingress, and take advantage
of ingress-shim to have it create the certificate resource on our behalf.
After creating a certificate, the cert-manager will update or create a ingress
resource and use that to validate the domain. Once verified and issued,
cert-manager will create or update the secret defined in the certificate.

> Note: The secret that is used in the ingress should match the secret defined
> in the certificate.  There isn't any explicit checking, so a typo will result
> in the `ingress-nginx-controller` falling back to its self-signed certificate.
> In our example, we are using annotations on the ingress (and ingress-shim)
> which will create the correct secrets on your behalf.

Edit the ingress add the annotations that were commented out in our earlier
example:

```yaml file=./example/ingress-tls.yaml
```

and apply it:

```bash
kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/ingress-tls.yaml
# expected output: ingress.extensions "kuard" configured
```

Cert-manager will read these annotations and use them to create a certificate,
which you can request and see:

```bash
$ kubectl get certificate
NAME                     READY   SECRET                   AGE
quickstart-example-tls   True    quickstart-example-tls   16m
```

cert-manager reflects the state of the process for every request in the
certificate object. You can view this information using the
`kubectl describe` command:

```bash
$ kubectl describe certificate quickstart-example-tls
Name:         quickstart-example-tls
Namespace:    default
Labels:       <none>
Annotations:  <none>
API Version:  cert-manager.io/v1
Kind:         Certificate
Metadata:
  Cluster Name:
  Creation Timestamp:  2018-11-17T17:58:37Z
  Generation:          0
  Owner References:
    API Version:           networking.k8s.io/v1
    Block Owner Deletion:  true
    Controller:            true
    Kind:                  Ingress
    Name:                  kuard
    UID:                   a3e9f935-ea87-11e8-82f8-42010a8a00b5
  Resource Version:        9295
  Self Link:               /apis/cert-manager.io/v1/namespaces/default/certificates/quickstart-example-tls
  UID:                     68d43400-ea92-11e8-82f8-42010a8a00b5
Spec:
  Dns Names:
    www.example.com
  Issuer Ref:
    Kind:       Issuer
    Name:       letsencrypt-staging
  Secret Name:  quickstart-example-tls
Status:
  Acme:
    Order:
      URL:  https://acme-staging-v02.api.letsencrypt.org/acme/order/7374163/13665676
  Conditions:
    Last Transition Time:  2018-11-17T18:05:57Z
    Message:               Certificate issued successfully
    Reason:                CertIssued
    Status:                True
    Type:                  Ready
Events:
  Type     Reason          Age                From          Message
  ----     ------          ----               ----          -------
  Normal   CreateOrder     9m                 cert-manager  Created new ACME order, attempting validation...
  Normal   DomainVerified  8m                 cert-manager  Domain "www.example.com" verified with "http-01" validation
  Normal   IssueCert       8m                 cert-manager  Issuing certificate...
  Normal   CertObtained    7m                 cert-manager  Obtained certificate from ACME server
  Normal   CertIssued      7m                 cert-manager  Certificate issued Successfully
```

The events associated with this resource and listed at the bottom
of the `describe` results show the state of the request. In the above
example the certificate was validated and issued within a couple of minutes.

Once complete, cert-manager will have created a secret with the details of
the certificate based on the secret used in the ingress resource. You can
use the describe command as well to see some details:

```bash
$ kubectl describe secret quickstart-example-tls
Name:         quickstart-example-tls
Namespace:    default
Labels:       cert-manager.io/certificate-name=quickstart-example-tls
Annotations:  cert-manager.io/alt-names=www.example.com
              cert-manager.io/common-name=www.example.com
              cert-manager.io/issuer-kind=Issuer
              cert-manager.io/issuer-name=letsencrypt-staging

Type:  kubernetes.io/tls

Data
====
tls.crt:  3566 bytes
tls.key:  1675 bytes
```

Now that we have confidence that everything is configured correctly, you
can update the annotations in the ingress to specify the production issuer:

```yaml file=./example/ingress-tls-final.yaml
```

```bash
$ kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/ingress-tls-final.yaml
ingress.extensions "kuard" configured
```

You will also need to delete the existing secret, which cert-manager is watching
and will cause it to reprocess the request with the updated issuer.

```bash
$ kubectl delete secret quickstart-example-tls
secret "quickstart-example-tls" deleted
```

This will start the process to get a new certificate, and using describe
you can see the status. Once the production certificate has been updated,
you should see the example KUARD running at your domain with a signed TLS
certificate.

```bash
$ kubectl describe certificate quickstart-example-tls
Name:         quickstart-example-tls
Namespace:    default
Labels:       <none>
Annotations:  <none>
API Version:  cert-manager.io/v1
Kind:         Certificate
Metadata:
  Cluster Name:
  Creation Timestamp:  2018-11-17T18:36:48Z
  Generation:          0
  Owner References:
    API Version:           networking.k8s.io/v1
    Block Owner Deletion:  true
    Controller:            true
    Kind:                  Ingress
    Name:                  kuard
    UID:                   a3e9f935-ea87-11e8-82f8-42010a8a00b5
  Resource Version:        283686
  Self Link:               /apis/cert-manager.io/v1/namespaces/default/certificates/quickstart-example-tls
  UID:                     bdd93b32-ea97-11e8-82f8-42010a8a00b5
Spec:
  Dns Names:
    www.example.com
  Issuer Ref:
    Kind:       Issuer
    Name:       letsencrypt-prod
  Secret Name:  quickstart-example-tls
Status:
  Conditions:
    Last Transition Time:  2019-01-09T13:52:05Z
    Message:               Certificate does not exist
    Reason:                NotFound
    Status:                False
    Type:                  Ready
Events:
  Type    Reason        Age   From          Message
  ----    ------        ----  ----          -------
  Normal  Generated     18s   cert-manager  Generated new private key
  Normal  OrderCreated  18s   cert-manager  Created Order resource "quickstart-example-tls-889745041"
```

You can see the current state of the ACME Order by running `kubectl describe`
on the Order resource that cert-manager has created for your Certificate:

```bash
$ kubectl describe order quickstart-example-tls-889745041
...
Events:
  Type    Reason      Age   From          Message
  ----    ------      ----  ----          -------
  Normal  Created     90s   cert-manager  Created Challenge resource "quickstart-example-tls-889745041-0" for domain "www.example.com"
```

Here, we can see that cert-manager has created 1 'Challenge' resource to fulfill
the Order. You can dig into the state of the current ACME challenge by running
`kubectl describe` on the automatically created Challenge resource:

```bash
$ kubectl describe challenge quickstart-example-tls-889745041-0
...
Status:
  Presented:   true
  Processing:  true
  Reason:      Waiting for http-01 challenge propagation
  State:       pending
Events:
  Type    Reason     Age   From          Message
  ----    ------     ----  ----          -------
  Normal  Started    15s   cert-manager  Challenge scheduled for processing
  Normal  Presented  14s   cert-manager  Presented challenge using http-01 challenge mechanism
```

From above, we can see that the challenge has been 'presented' and cert-manager
is waiting for the challenge record to propagate to the ingress controller.
You should keep an eye out for new events on the challenge resource, as a
'success' event should be printed after a minute or so (depending on how fast
your ingress controller is at updating rules):

```bash
$ kubectl describe challenge quickstart-example-tls-889745041-0
...
Status:
  Presented:   false
  Processing:  false
  Reason:      Successfully authorized domain
  State:       valid
Events:
  Type    Reason          Age   From          Message
  ----    ------          ----  ----          -------
  Normal  Started         71s   cert-manager  Challenge scheduled for processing
  Normal  Presented       70s   cert-manager  Presented challenge using http-01 challenge mechanism
  Normal  DomainVerified  2s    cert-manager  Domain "www.example.com" verified with "http-01" validation
```

> Note: If your challenges are not becoming 'valid' and remain in the 'pending'
> state (or enter into a 'failed' state), it is likely there is some kind of
> configuration error. Read the [Challenge resource reference
> docs](../../reference/api-docs.md#acme.cert-manager.io/v1.Challenge) for more
> information on debugging failing challenges.

Once the challenge(s) have been completed, their corresponding challenge
resources will be *deleted*, and the 'Order' will be updated to reflect the
new state of the Order:

```bash
$ kubectl describe order quickstart-example-tls-889745041
...
Events:
  Type    Reason      Age   From          Message
  ----    ------      ----  ----          -------
  Normal  Created     90s   cert-manager  Created Challenge resource "quickstart-example-tls-889745041-0" for domain "www.example.com"
  Normal  OrderValid  16s   cert-manager  Order completed successfully
```

Finally, the 'Certificate' resource will be updated to reflect the state of the
issuance process. If all is well, you should be able to 'describe' the Certificate
and see something like the below:

```bash
$ kubectl describe certificate quickstart-example-tls
Status:
  Conditions:
    Last Transition Time:  2019-01-09T13:57:52Z
    Message:               Certificate is up to date and has not expired
    Reason:                Ready
    Status:                True
    Type:                  Ready
  Not After:               2019-04-09T12:57:50Z
Events:
  Type    Reason         Age                  From          Message
  ----    ------         ----                 ----          -------
  Normal  Generated      11m                  cert-manager  Generated new private key
  Normal  OrderCreated   11m                  cert-manager  Created Order resource "quickstart-example-tls-889745041"
  Normal  OrderComplete  10m                  cert-manager  Order "quickstart-example-tls-889745041" completed successfully
```
