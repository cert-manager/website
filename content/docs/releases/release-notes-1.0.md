---
title: Release Notes
description: 'cert-manager release notes: cert-manager v1.0'
---

With cert-manager `v1.0` we're putting a seal of trust on 3 years of development on the cert-manager project.
In these 3 years cert-manager has grown in functionality and stability, but mostly in the community.
Today we see many people using cert-manager to secure their Kubernetes clusters, as well as cert-manager
being integrated into many other parts in the ecosystem.
In the past 16 releases many bugs got fixed, and things that needed to be broken were broken.
Several iterations on the API improved the user experience.
We solved 1500 GitHub Issues with even more PRs by 253 contributors.

With releasing `v1.0` we're officially making a statement that cert-manager is a mature project now.
We will also be making a compatibility promise with our `v1` API.

A big thank you to everyone who helped to build cert-manager in the past 3 years!
Let `v1.0` be the first of many big achievements!


The `v1.0` release is a stability release with a few focus areas:

* `v1` API
* `kubectl cert-manager status` command to help with investigating issues
* Using new and stable Kubernetes APIs
* Improved logging
* ACME improvements


As usual, please read the [upgrade notes](../installation/upgrading/upgrading-0.16-1.0.md) before upgrading.


## `v1` API

In `v0.16` we introduced the `v1beta1` API. This brought some structural changes as well as better documentation of the API fields.
In `v1.0` we build on this with the `v1` API. This API is our first "stable" API version, while our others were well used we had to already provide some compatibility guarantees with the `v1` API we promise compatibility for the API for years to come.

These are the changes made (for reference, our conversion will take care of everything for you):

Certificate:

* `emailSANs` is now named `emailAddresses`
* `uriSANs` is now named `uris`

This change makes these 2 SANs consistent with the other SANs as well as the Go API. Dropping the term SAN from our API.

### Upgrading
If you're using Kubernetes 1.16 or higher, conversion webhooks will allow you seamlessly interact with `v1alpha2`, `v1alpha3`, `v1beta1` and `v1` API versions at the same time. This allows you to use the new API version without having to modify or redeploy your older resources.
We highly recommend upgrading your manifests to the `v1` API as older versions will soon be deprecated.

Users of the `legacy` version of cert-manager will still only have the `v1` API, migration steps can be found in the [upgrade notes](../installation/upgrading/upgrading-0.16-1.0.md).


## `kubectl cert-manager status` command

With the new improvements to our `kubectl` plugin it is easier to investigate issues with certificates not being issued.
`kubectl cert-manager status` now displays a lot more information about what has been going on with your certificate and in which
stage of issuance it currently is in.

Once the plugin is installed, you can run `kubectl cert-manager status certificate <name-of-cert>`. That will then look for the Certificate with the name `<name-of-cert>` and any related resources like CertificateRequest, Secret, Issuer, as well as Order and Challenges if it is a ACME Certificate.
The command outputs information about the resources, including Conditions, Events and resource specific fields like Key Usages and Extended Key Usages of the Secret or Authorizations of the Order.


For example while debugging a not ready certificate:
```
$ kubectl cert-manager status certificate acme-certificate

Name: acme-certificate
Namespace: default
Created at: 2020-08-21T16:44:13+02:00
Conditions:
  Ready: False, Reason: DoesNotExist, Message: Issuing certificate as Secret does not exist
  Issuing: True, Reason: DoesNotExist, Message: Issuing certificate as Secret does not exist
DNS Names:
- example.com
Events:
  Type    Reason     Age   From          Message
  ----    ------     ----  ----          -------
  Normal  Issuing    18m   cert-manager  Issuing certificate as Secret does not exist
  Normal  Generated  18m   cert-manager  Stored new private key in temporary Secret resource "acme-certificate-tr8b2"
  Normal  Requested  18m   cert-manager  Created new CertificateRequest resource "acme-certificate-qp5dm"
Issuer:
  Name: acme-issuer
  Kind: Issuer
  Conditions:
    Ready: True, Reason: ACMEAccountRegistered, Message: The ACME account was registered with the ACME server
error when finding Secret "acme-tls": secrets "acme-tls" not found
Not Before: <none>
Not After: <none>
Renewal Time: <none>
CertificateRequest:
  Name: acme-certificate-qp5dm
  Namespace: default
  Conditions:
    Ready: False, Reason: Pending, Message: Waiting on certificate issuance from order default/acme-certificate-qp5dm-1319513028: "pending"
  Events:
    Type    Reason        Age   From          Message
    ----    ------        ----  ----          -------
    Normal  OrderCreated  18m   cert-manager  Created Order resource default/acme-certificate-qp5dm-1319513028
Order:
  Name: acme-certificate-qp5dm-1319513028
  State: pending, Reason:
  Authorizations:
    URL: https://acme-staging-v02.api.letsencrypt.org/acme/authz-v3/97777571, Identifier: example.com, Initial State: pending, Wildcard: false
Challenges:
- Name: acme-certificate-qp5dm-1319513028-1825664779, Type: DNS-01, Token: J-lOZ39yNDQLZTtP_ZyrYojDqjutMAJOxCL1AkOEZWw, Key: U_W3gGV2KWgIUonlO2me3rvvEOTrfTb-L5s0V1TJMCw, State: pending, Reason: error getting clouddns service account: secret "clouddns-accoun" not found, Processing: true, Presented: false

```

The command also can help looking into what is inside an issued certificate. This example looks at an issuer Let's Encrypt certificate in detail:
```
$ kubectl cert-manager status certificate example
Name: example
[...]
Secret:
  Name: example
  Issuer Country: US
  Issuer Organisation: Let's Encrypt
  Issuer Common Name: Let's Encrypt Authority X3
  Key Usage: Digital Signature, Key Encipherment
  Extended Key Usages: Server Authentication, Client Authentication
  Public Key Algorithm: RSA
  Signature Algorithm: SHA256-RSA
  Subject Key ID: 65081d98a9870764590829b88c53240571997862
  Authority Key ID: a84a6a63047dddbae6d139b7a64565eff3a8eca1
  Serial Number: 0462ffaa887ea17797e0057ca81d7ba2a6fb
  Events:  <none>
Not Before: 2020-06-02T04:29:56+02:00
Not After: 2020-08-31T04:29:56+02:00
Renewal Time: 2020-08-01T04:29:56+02:00
[...]
```

## Using new and stable Kubernetes APIs

cert-manager has been an early adopter of the Kubernetes CRDs. That and us supporting Kubernetes versions as for back as `v1.11`
made us use the now deprecated `apiextensions.k8s.io/v1beta1` for our CRDs and `admissionregistration.k8s.io/v1beta1` for our webhooks.
These are now deprecated and to be removed in Kubernetes `v1.22`. In `v1.0` we now offer full support for `apiextensions.k8s.io/v1` and
`admissionregistration.k8s.io/v1` for Kubernetes `v1.16` (where this got added) and above.
For users of Kubernetes `v1.15` we keep offering support for the `v1beta1` Kubernetes APIs in our legacy version.


## Improved logging

For this release we upgraded our logging library to `klog/v2` analog to Kubernetes `v1.19`.
We also reviewed every log we write to assign it an appropriate log level.

We followed the (Kubernetes logging guidelines)[https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md]. To come up with 5 log levels ranging from `Error` (level 0) which only prints important errors to `Trace` (level 5) which can help you to know exactly what is gong on.
With this change we reduced the number of logs when you don't need to have a debugging trace while running cert-manager.

Tip: My default cert-manager runs on level 2 (Info), you can set this using `global.logLevel` in the Helm chart.

*Note*: Looking at the logs while troubleshooting cert-manager should be last resort behavior, for more info check out our [troubleshooting guide](../faq/troubleshooting.md)

## ACME improvements

The most used use case of cert-manager is probably to issue certificates from Let's Encrypt using ACME. In `v1.0` we took took feedback from the community to add two small but important improvements to our ACME issuer.

### Disable Account Key Generation

If you deploy ACME issuer certs on a large scale you probably want to re-use your ACME account across multiple clusters
so your rate limit exceptions get applied everywhere.
While this was already possible in cert-manager by copying over the secret referenced in `privateKeySecretRef`.
However this process was quite error prone as cert-manager was trying to be helpful and was happy to create a new account key
for you if one was not found. This is why we added `disableAccountKeyGeneration` to safe guard you against this behavior,
if set to true it will not create a key and warn you if no account key was given to it.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt
spec:
  acme:
    privateKeySecretRef:
      name: example-issuer-account-key
    disableAccountKeyGeneration: false
```

### Preferred Chain

On September 29th Let's Encrypt will [change over](https://letsencrypt.org/2019/04/15/transitioning-to-isrg-root.html) to using its own `ISRG Root` CA.
This will replace the cross-signed certificates by `Identrust`. This change over needs no changes to your cert-manager configuration, any renewed or new certificates issued after this date will use the new CA root.

Let's encrypt currently already signs certificates using this CA and offers them as "alternative certificate chain" via ACME.
In this release cert-manager adds support for accessing these alternative chains in the issuer config.
The new `preferredChain` option will allow you to specify a CA's common name for the certificate to be issued by.
If there is a certificate available matching that request it will present you that certificate. Note that this is a Preferred option,
if none is found matching the request it will give you the default certificate as before. This makes sure you still get your certificate
renewed once the alternative chain gets removed on the ACME issuer side.

You can already today get certificates from the `ISRG Root` by using:
```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    preferredChain: "ISRG Root X1"
```

If you prefer to keep the `IdenTrust` chain you can do that by setting the option to `DST Root CA X3`:
```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    preferredChain: "DST Root CA X3"
```

Note that this Root CA is expiring soon, Let's Encrypt will keep this certificate chain active until September 29 2021.