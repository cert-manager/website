---
title: Troubleshooting
description: 'cert-manager FAQ: Troubleshooting'
---

When troubleshooting cert-manager your best friend is `kubectl describe`, this will give you information on the resources as well as recent events. It is not advised to use the logs as these are quite verbose and only should be looked at if the following steps do not provide help.

cert-manager consists of multiple custom resources that live inside your Kubernetes cluster, these resources are linked together and are often created by one another. When such an event happens it will be reflected in a Kubernetes event, you can see these per-namespace using `kubectl get event`, or in the output of `kubectl describe` when looking at a single resource.

## Troubleshooting a failed certificate request

There are several resources that are involved in requesting a certificate.

```

  (  +---------+  )
  (  | Ingress |  ) Optional                                              ACME Only!
  (  +---------+  )
         |                                                     |
         |   +-------------+      +--------------------+       |  +-------+       +-----------+
         |-> | Certificate |----> | CertificateRequest | ----> |  | Order | ----> | Challenge | 
             +-------------+      +--------------------+       |  +-------+       +-----------+
                                                               |
```

The cert-manager flow all starts at a `Certificate` resource, you can create this yourself or your Ingress resource will do this for you if you have the [correct annotations](../usage/ingress.md) set. 

### 1. Checking the Certificate resource
First we have to check if we have a `Certificate` resource created in our namespace. We can get these using `kubectl get certificate`.
```console
$ kubectl get certificate
NAME                READY   AGE
example-com-tls     False   1h
```

If none is present and you plan to use the [ingress-shim](../usage/ingress.md): check the ingress annotations more about that is in the [ingress troubleshooting guide](../usage/ingress.md#troubleshooting).
If you are not using the ingress-shim: check the output of the command you used to create the certificate.

If you see one with ready status `False` you can get more info using `kubectl describe certificate`, if the status is `True` that means that cert-manager has successfully issued a certificate.
```console
$ kubectl describe certificate <certificate-name>
[...]
Status:
  Conditions:
    Last Transition Time:        2020-05-15T21:45:22Z
    Message:                     Issuing certificate as Secret does not exist
    Reason:                      DoesNotExist
    Status:                      False
    Type:                        Ready
  Next Private Key Secret Name:  example-tls-wtlww
Events:
  Type    Reason     Age   From          Message
  ----    ------     ----  ----          -------
  Normal  Issuing    105s  cert-manager  Issuing certificate as Secret does not exist
  Normal  Generated  105s  cert-manager  Stored new private key in temporary Secret resource "example-tls-wtlww"
  Normal  Requested  104s  cert-manager  Created new CertificateRequest resource "example-tls-bw5t9"
```

Here you will find more info about the current certificate status under `Status` as well as detailed information about what happened to it under `Events`. Both will help you determine the current state of the certificate.
The last status is `Created new CertificateRequest resource`, it is worth taking a look at in which state `CertificateRequest` is to get more info on why our `Certificate` isn't getting issued.

### 2. Checking the `CertificateRequest`
The `CertificateRequest` resource represents a CSR in cert-manager and passes this CSR on onto the issuer.
You can find the name of the `CertificateRequest` in the `Certificate` event log or using `kubectl get certificaterequest`

To get more info we again run `kubectl describe`:
```console
$ kubectl describe certificaterequest <CertificateRequest name>
API Version:  cert-manager.io/v1
Kind:         CertificateRequest
Spec:
  Request: [...]
  Issuer Ref:
    Group:  cert-manager.io
    Kind:   ClusterIssuer
    Name:   letencrypt-production
Status:
  Conditions:
    Last Transition Time:  2020-05-15T21:45:36Z
    Message:               Waiting on certificate issuance from order example-tls-fqtfg-1165244518: "pending"
    Reason:                Pending
    Status:                False
    Type:                  Ready
Events:
  Type    Reason        Age    From          Message
  ----    ------        ----   ----          -------
  Normal  OrderCreated  8m20s  cert-manager  Created Order resource example-tls-fqtfg-1165244518
```

Here we will see any issue regarding the Issuer configuration as well as Issuer responses. 

### 3. Check the issuer state
If in the above steps you saw an issuer not ready error you can do the same steps again for (cluster)issuer resources:
```console
$ kubectl describe issuer <Issuer name>
$ kubectl describe clusterissuer <ClusterIssuer name>
```

These will allow you to get any error messages regarding accounts or network issues with your issuer.
Troubleshooting ACME issuers is described in more detail in [Troubleshooting Issuing ACME Certificates](./acme.md).

### 4. ACME Troubleshooting
ACME (e.g. Let's Encrypt) issuers have 2 additional resources inside cert-manager: `Orders` and `Challenges`.
Troubleshooting these is described in [Troubleshooting Issuing ACME Certificates](./acme.md).