---
title: Troubleshooting Issuing ACME Certificates
description: 'cert-manager FAQ: ACME Certificates'
---

When requesting ACME certificates, cert-manager will create `Order` and
`Challenges` to complete the request. As such, there are more resources to
investigate and debug if there is a problem during the process. You can read
more about these resources in the [concepts
pages](../concepts/acme-orders-challenges.md).

Before you start here you should probably take a look at our [general troubleshooting guide](./troubleshooting.md)

## 1. Troubleshooting Orders

When we run a describe on the `CertificateRequest` resource we see that an `Order` that has
been created:

```bash
$ kubectl describe certificaterequest example-com-2745722290
...
Events:
  Type    Reason        Age   From          Message
  ----    ------        ----  ----          -------
  Normal  OrderCreated  5s    cert-manager  Created Order resource default/example-com-2745722290-439160286
```

Orders are a request to an ACME instance to issue a certificate. 
By running `kubectl describe order` on a particular order,
information can be gleaned about failures in the process:

```console
$ kubectl describe order example-com-2745722290-439160286
...
Reason:
State:         pending
URL:           https://acme-v02.api.letsencrypt.org/acme/order/41123272/265506123
Events:
  Type    Reason   Age   From          Message
  ----    ------   ----  ----          -------
  Normal  Created  1m    cert-manager  Created Challenge resource "example-com-2745722290-439160286-0" for domain "test1.example.com"
  Normal  Created  1m    cert-manager  Created Challenge resource "example-com-2745722290-439160286-1" for domain "test2.example.com"
```

Here we can see that cert-manager has created two Challenge resources to verify we control specific domains, 
a requirements of the ACME order to obtain a signed certificate.

You can then go on to run
`kubectl describe challenge example-com-2745722290-439160286-0` to further debug the
progress of the Order.

Once an Order is successful, you should see an event like the following:

```bash
$ kubectl describe order example-com-2745722290-439160286
...
Reason:
State:         valid
URL:           https://acme-v02.api.letsencrypt.org/acme/order/41123272/265506123
Events:
  Type    Reason      Age   From          Message
  ----    ------      ----  ----          -------
  Normal  Created     72s   cert-manager  Created Challenge resource "example-com-2745722290-439160286-0" for domain "test1.example.com"
  Normal  Created     72s   cert-manager  Created Challenge resource "example-com-2745722290-439160286-1" for domain "test2.example.com"
  Normal  OrderValid  4s    cert-manager  Order completed successfully
```

If the Order is not completing successfully, you can debug the challenges
for the Order by running `kubectl describe` on the `Challenge` resource which is described in the following steps.

## 2. Troubleshooting Challenges

In order to determine why an ACME Order is not being finished, we can debug
using the `Challenge` resources that cert-manager has created.

In order to determine which `Challenge` is failing, you can run
`kubectl get challenges`:


```console
$ kubectl get challenges
...
NAME                                 STATE     DOMAIN            REASON                                     AGE
example-com-2745722290-4391602865-0  pending   example.com       Waiting for dns-01 challenge propagation   22s
```

This shows that the challenge has been presented using the DNS01 solver
successfully and now cert-manager is waiting for the 'self check' to pass.

You can get more information about the challenge and it's lifecycle by using `kubectl describe`:

```bash
$ kubectl describe challenge example-com-2745722290-4391602865-0
...
Status:
  Presented:   true
  Processing:  true
  Reason:      Waiting for dns-01 challenge propagation
  State:       pending
Events:
  Type    Reason     Age   From          Message
  ----    ------     ----  ----          -------
  Normal  Started    19s   cert-manager  Challenge scheduled for processing
  Normal  Presented  16s   cert-manager  Presented challenge using dns-01 challenge mechanism
```

Progress about the state of each challenge will be recorded either as Events
or on the Challenge's `status` block (as shown above).

In case of DNS01 you will find any errors from your DNS provider here.

Both HTTP01 and DNS01 go through a "self-check" first before cert-manager presents the challenge to the ACME provider.
This is done not to overload the ACME provider with failed challenges due to DNS or loadbalancer propagations.
The status of this can be found in the Status block of the describe:
```console
$ kubectl describe challenge 
[...]
Status:
  Presented:   true
  Processing:  true
  Reason:      Waiting for http-01 challenge propagation: failed to perform self check GET request 'http://example.com/.well-known/acme-challenge/_fgdLz0i3TFiZW4LBjuhjgd5nTOkaMBhxYmTY': Get "http://example.com/.well-known/acme-challenge/_fgdLz0i3TFiZW4LBjuhjgd5nTOkaMBhxYmTY: remote error: tls: handshake failure
  State:       pending
[...]
```

In this example our HTTP01 check fails due a network issue.
You will also see any errors coming from your DNS provider here.

### HTTP01 troubleshooting
First of all check if you can see the challenge URL from the public internet, if this does not work check your Ingress and firewall configuration as well as the service and pod cert-manager created to solve the ACME challenge.
If this does work check if your cluster can see it too. It is important to test this from inside a Pod. If you get a connection error it is suggested to check the cluster's network configuration.

#### Got 404 status code
If your challenge self-check fails with a 404 not found error. Make sure to check the following:

* you can access the URL from the public internet
* the the ACME solver pod is up and running
* use `kubectl describe ingress` to check the status of the HTTP01 solver ingress. (unless you use `acme.cert-manager.io/http01-edit-in-place`, then check the same ingress as your domain)

### DNS01 troubleshooting
If you see no error events about your DNS provider you can check the following
Check if you can see the `_acme_challenge.domain` TXT DNS record from the public internet, or in your DNS provider's interface.
cert-manager will check if a DNS record has been propagated by querying the cluster's DNS solver. If you are able to see it from the public internet but not from inside the cluster you might want to change [the DNS server for self-check](../configuration/acme/dns01/README.md#setting-nameservers-for-dns01-self-check) as some cloud providers overwrite DNS internally. 

## March 2020 Let's Encrypt CAA Rechecking Bug
Following the [announcement on March 4](https://community.letsencrypt.org/t/revoking-certain-certificates-on-march-4/114864) Let's Encrypt will be revoking a number of certificates due to a bug in the way they validate CAA records, we have created a tool to analyse your existing cert-manager managed certificates and compare their serial numbers to the publicised list of revoked certificates.
It's advised that all users of Let's Encrypt & cert-manager run a check using this tool to ensure they do not experience any invalid certificate errors in clusters.
You can find a copy of the checker tool here: https://github.com/jetstack/letsencrypt-caa-bug-checker.