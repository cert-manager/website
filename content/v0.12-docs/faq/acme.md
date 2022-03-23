---
title: Troubleshooting Issuing ACME Certificates
description: 'cert-manager FAQ: ACME Certificates'
---

When requesting ACME certificates, cert-manager will create `Order` and
`Challenges` to complete the request. As such, there are more resources to
investigate and debug if there is a problem during the process. You can read
more about these resources in the [concepts
pages](../concepts/acme-orders-challenges.md).

## Orders

In order to debug why a certificate isn't being issued, we can first run
`kubectl describe` on the `Certificate` resource we're having issues with:


```bash
$ kubectl describe certificate example-com
...
Events:
  Type    Reason        Age   From          Message
  ----    ------        ----  ----          -------
  Normal  GeneratedKey  82s   cert-manager  Generated a new private key
  Normal  Requested     81s   cert-manager  Created new CertificateRequest resource "example-com-2745722290"
```

We can then run another describe on the `CertificateRequest` resource that has
been created:

```bash
$ kubectl describe certificaterequest example-com-2745722290
...
Events:
  Type    Reason        Age   From          Message
  ----    ------        ----  ----          -------
  Normal  OrderCreated  5s    cert-manager  Created Order resource default/example-com-2745722290-439160286
```


We can see here that `CertificateRequest` controller has created an Order
resource to request a new certificate from the ACME server.

Orders are a useful source of information when debugging failures issuing ACME
certificates. By running `kubectl describe order` on a particular order,
information can be gleaned about failures in the process:


```bash
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

Here we can see that cert-manager has created two Challenge resources in order
to complete the requirements of the ACME order to obtain a signed certificate.

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
for the Order by running `kubectl describe` on the Challenge resource.

## Challenges

In order to determine why an ACME Certificate is not being issued, we can debug
using the 'Challenge' resources that cert-manager has created.

In order to determine which Challenge is failing, you can run
`kubectl get challenges`:


```bash
$ kubectl get challenges
...
NAME                                 STATE     DOMAIN            REASON                                     AGE
example-com-2745722290-4391602865-0  pending   example.com       Waiting for dns-01 challenge propagation   22s
```

This shows that the challenge has been presented using the DNS01 solver
successfully and now cert-manager is waiting for the 'self check' to pass.

You can get more information about the challenge by using `kubectl describe`:

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