---
title: ACME Orders and Challenges
description: 'cert-manager core concepts: ACME Orders and Challenges'
---

cert-manager supports requesting certificates from ACME servers, including from
[Let's Encrypt](https://letsencrypt.org/), with use of the [ACME
Issuer](../configuration/acme/README.md). These certificates are typically trusted on
the public Internet by most computers. To successfully request a certificate,
cert-manager must solve ACME Challenges which are completed in order to prove
that the client owns the DNS addresses that are being requested.

In order to complete these challenges, cert-manager introduces two
`CustomResource` types; `Orders` and `Challenges`.

## Orders

`Order` resources are used by the ACME issuer to manage the lifecycle of an ACME
'order' for a signed TLS certificate.  More details on ACME orders and domain
validation can be found on the Let's Encrypt website
[here](https://letsencrypt.org/how-it-works/). An order represents a single
certificate request which will be created automatically once a new
[`CertificateRequest`](./certificaterequest.md) resource referencing an ACME
issuer has been created. `CertificateRequest` resources are created
automatically by cert-manager once a [`Certificate`](./certificate.md) resource
is created, has its specification changed, or needs renewal.

As an end-user, you will never need to manually create an `Order` resource.
Once created, an `Order` cannot be changed. Instead, a new `Order` resource must
be created.

The `Order` resource encapsulates multiple ACME 'challenges' for that 'order',
and as such, will manage one or more `Challenge` resources.

## Challenges

`Challenge` resources are used by the ACME issuer to manage the lifecycle of an
ACME 'challenge' that must be completed in order to complete an 'authorization'
for a single DNS name/identifier.

When an `Order` resource is created, the order controller will create
`Challenge` resources for each DNS name that is being authorized with the ACME
server.

As an end-user, you will never need to manually create a `Challenge` resource.
Once created, a `Challenge` cannot be changed. Instead, a new `Challenge`
resource must be created.

### Challenge Lifecycle

After a `Challenge` resource has been created, it will be initially queued for
processing. Processing will not begin until the challenge has been 'scheduled'
to start.  This scheduling process prevents too many challenges being attempted
at once, or multiple challenges for the same DNS name being attempted at once.
For more information on how challenges are scheduled, read the [challenge
scheduling](#challenge-scheduling).

Once a challenge has been scheduled, it will first be 'synced' with the ACME
server in order to determine its current state. If the challenge is already
valid, its 'state' will be updated to 'valid', and will also set
`status.processing = false` to 'unschedule' itself.

If the challenge is still 'pending', the challenge controller will 'present' the
challenge using the configured solver, one of HTTP01 or DNS01.  Once the
challenge has been 'presented', it will set `status.presented = true`.

Once 'presented', the challenge controller will perform a 'self check' to
ensure that the challenge has 'propagated' (i.e. the authoritative DNS servers
have been updated to respond correctly, or the changes to the ingress resources
have been observed and in-use by the ingress controller).

If the self check fails, cert-manager will retry the self check with a fixed 10
second retry interval. Challenges that do not ever complete the self check will
continue retrying until the user intervenes by either retrying the `Order` (by
deleting the `Order` resource) or amending the associated `Certificate` resource
to resolve any configuration errors.

Once the self check is passing, the ACME 'authorization' associated with this
challenge will be 'accepted'.

The final state of the authorization after accepting it will be copied across to
the Challenge's `status.state` field, as well as the 'error reason' if an error
occurred whilst the ACME server attempted to validate the challenge.

Once a Challenge has entered the `valid`, `invalid`, `expired` or `revoked`
state, it will set `status.processing = false` to prevent any further processing
of the ACME challenge, and to allow another challenge to be scheduled if there
is a backlog of challenges to complete.

### Challenge Scheduling

Instead of attempting to process all challenges at once, challenges are
'scheduled' by cert-manager.

This scheduler applies a cap on the maximum number of simultaneous challenges
as well as disallows two challenges for the same DNS name and solver type
(`HTTP01` or `DNS01`) to be completed at once.

The maximum number of challenges that can be processed at a time is 60 as of
[`ddff78`](https://github.com/cert-manager/cert-manager/blob/ddff78f011558e64186d61f7c693edced1496afa/pkg/controller/acmechallenges/scheduler/scheduler.go#L31-L33).

## Troublshooting 1

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


## Troubleshooting 2


When requesting ACME certificates, cert-manager will create `Order` and
`Challenges` to complete the request. As such, there are more resources to
investigate and debug if there is a problem during the process. You can read
more about these resources in the [concepts
pages](../concepts/acme-orders-challenges.md).

Before you start here you should probably take a look at our [general troubleshooting guide](./troubleshooting.md)

## 1. Troubleshooting (Cluster)Issuers

First of all check if the (Cluster)Issuer you're using is in a ready state:
```bash
$ kubectl get issuer
$ kubectl get clusterissuer
NAME               READY   AGE
letsencrypt        True    38m
letsencrypt-http   False    32m
```

If you see `False` check the status using `kubectl describe`. For example:
```bash
$ kubectl describe issuer letsencrypt-http
$ kubectl describe clusterissuer letsencrypt-http
Name:         letsencrypt
API Version:  cert-manager.io/v1
Kind:         Issuer
Spec:
  Acme:
    Email:            cert-manager@example.com
    Private Key Secret Ref:
      Name:  letsencrypt
    Server:  https://acme-staging-v02.api.letsencrypt.org/directory
Status:
  Acme:
  Conditions:
    Message:               Failed to update ACME account:400 urn:ietf:params:acme:error:invalidEmail: Unable to update account :: invalid contact domain. Contact emails @example.com are forbidden
    Reason:                ErrUpdateACMEAccount
    Status:                False
    Type:                  Ready
Events:
  Type     Reason                Age                  From          Message
  ----     ------                ----                 ----          -------
  Warning  ErrUpdateACMEAccount  101s (x3 over 106s)  cert-manager  Failed to update ACME account:400 urn:ietf:params:acme:error:invalidEmail: Unable to update account :: invalid contact domain. Contact emails @example.com are forbidden
```

### Common errors

* `Failed to update ACME account:400 urn:ietf:params:acme:error:invalidEmail`: the email you specified in the Issuer configuration isn't valid.
* `Error initializing issuer: Failed to register ACME account: secrets "acme-key" already exists`: there might be a leftover account from a previous issuer that is no longer valid, you should remove the secret so it can be recreated.
* `Error accepting challenge: 400 urn:ietf:params:acme:error:malformed: Unable to update challenge :: authorization must be pending`: this suggests that the authorization was not in 'pending' state at a time when cert-manager sent a request to the ACME server to accept the challenge. This may be because the domain validation has already failed and the authorization has been marked as 'invalid'. Check the authorization URL on the status of the `Order` or `Challenge` to see the status of the authorization and any additional information.

## 2. Troubleshooting Orders

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

You can see some additional information about the state of the [ACME authorization](https://datatracker.ietf.org/doc/html/rfc8555#section-7.1.4) that needs to be validated as part of this order using the authorization URL from the status of the `Order`:

```bash
$ kubectl get order <order-name> -ojsonpath='{.status.authorizations[x].url}'
```

If the Order is not completing successfully, you can debug the challenges
for the Order by running `kubectl describe` on the `Challenge` resource which is described in the following steps.

## 3. Troubleshooting Challenges

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

You can also see some additional information about the state of the [ACME authorization](https://datatracker.ietf.org/doc/html/rfc8555#section-7.1.4) that the challenge should validate using the authorization URL on from the status of the `Challenge`:

```bash
$ kubectl get challenge <challenge-name> -ojsonpath='{.spec.authorizationURL}'
```

### HTTP01 troubleshooting
First of all check if you can see the challenge URL from the public internet, if this does not work check your Ingress and firewall configuration as well as the service and pod cert-manager created to solve the ACME challenge.
If this does work check if your cluster can see it too. It is important to test this from inside a Pod. If you get a connection error it is suggested to check the cluster's network configuration.
If you receive a `tls: handshake failure`, try setting the annotation `cert-manager.io/issue-temporary-certificate: "true"` on the Ingress or Certificate resource. This will issue a temporary self signed certificate for the ingress controller to use before the actual certificate is issued.
If you still are having issues, there may be an issue with your ingress controller handling multiple resources for the same hostname, in this case, the annotation `acme.cert-manager.io/http01-edit-in-place: "true"` is likely required.

For example when using GKE with the Google Cloud Loadbalancer it is recommended to set:
```
cert-manager.io/issue-temporary-certificate: "true"
acme.cert-manager.io/http01-edit-in-place: "true"
```
This will allow the Google Cloud Loadbalancer to propagate a HTTPS endpoint correctly with a temporary certificate, the `http01-edit-in-place` part will prevent GKE from assigning a 2nd IP address for the challenge endpoint.

#### Got 404 status code
If your challenge self-check fails with a 404 not found error. Make sure to check the following:

* you can access the URL from the public internet
* the ACME solver pod is up and running
* use `kubectl describe ingress` to check the status of the HTTP01 solver ingress. (unless you use `acme.cert-manager.io/http01-edit-in-place`, then check the same ingress as your domain)

### DNS01 troubleshooting
If you see no error events about your DNS provider you can check the following
Check if you can see the `_acme_challenge.domain` TXT DNS record from the public internet, or in your DNS provider's interface.
cert-manager will check if a DNS record has been propagated by querying the cluster's DNS solver. If you are able to see it from the public internet but not from inside the cluster you might want to change [the DNS server for self-check](../configuration/acme/dns01/README.md#setting-nameservers-for-dns01-self-check) as some cloud providers overwrite DNS internally.

#### cert-manager identifies the wrong zone for your domain name
cert-manager by default uses SOA (Start of Authority) records to determine which zone name to use at your DNS provider.
Some DNS resolvers will filter this information, if this is the case cert-manager cannot determine the zone and it is advised to [change the DNS server for DNS01 self-checks](../configuration/acme/dns01/README.md#setting-nameservers-for-dns01-self-check).

If you use `dnsmasq` as your DNS server, this may occur if you use the [`--filterwin2k` flag](http://www.thekelleys.org.uk/dnsmasq/docs/setup.html).
In [OpenWRT there is a `filterwin2k` configuration option](https://openwrt.org/docs/guide-user/base-system/dhcp#all_options).
And in [LuCI there is a "Filter useless" option](https://github.com/openwrt/luci/blob/15757dd5b18f9e00ba3c9b38af4d46702a31fe33/modules/luci-mod-network/htdocs/luci-static/resources/view/network/dhcp.js#L217-L219).
By enabling this flag, `dnsmasq` drops all `SOA` records.

## March 2020 Let's Encrypt CAA Rechecking Bug
Following the [announcement on March 4](https://community.letsencrypt.org/t/revoking-certain-certificates-on-march-4/114864) Let's Encrypt will be revoking a number of certificates due to a bug in the way they validate CAA records, we have created a tool to analyse your existing cert-manager managed certificates and compare their serial numbers to the publicised list of revoked certificates.
It's advised that all users of Let's Encrypt & cert-manager run a check using this tool to ensure they do not experience any invalid certificate errors in clusters.
You can find a copy of the checker tool here: https://github.com/jetstack/letsencrypt-caa-bug-checker.
