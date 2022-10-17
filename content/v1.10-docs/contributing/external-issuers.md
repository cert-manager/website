---
title: Implementing External Issuers
description: 'cert-manager contributing guide: External Issuers'
---

cert-manager offers a number of [core issuer types](../configuration/README.md) that represent
various certificate authorities.

Since the number of potential issuers is larger than what could reasonably be supported in the
main cert-manager repository, cert-manager also supports out-of-tree external issuers, and treats
them the same as in-tree issuer types.

This document is for people looking to _create_ external issuers. For more information on how to
install and configure external issuer types, read the [configuration documentation](../configuration/external.md).

## General Overview

An issuer represents a certificate authority that signs incoming certificate
requests. In cert-manager, the `CertificateRequest` resource represents a single
request for a signed certificate, containing the raw certificate request PEM
data as well as other information relating to the desired certificate.

In cert-manager, each issuer type has its own controller that watches these
`CertificateRequest` resources and checks to see if a given `CertificateRequest` is
configured to use the issuer.

This is done via the `issuerRef` stanza on the `CertificateRequest` which contains
an issuer `name`, `kind` and `group`.

`group` denotes an API group such as `cert-manager.io` (which is responsible for all core issuer types).

`kind` denotes the "kind" resource type of the issuer - usually `Issuer` or `ClusterIssuer`.

`name` denotes the name of the issuer resource of the specified kind. An example might be `my-ca-issuer`.

When an issuer controller observes a new `CertificateRequest` which refers to it,
it then ensures that the corresponding issuer resource exists in Kubernetes.

It then uses the information inside the issuer resource to attempt to create a
signed certificate, based upon the information inside the certificate request.

## Sample External Issuer

If you want to create an External Issuer, the best place to start is likely to be the [Sample External Issuer](https://github.com/cert-manager/sample-external-issuer).

The Sample External Issuer is maintained by the cert-manager team, and its README file has step-by-step instructions
on how to write an external issuer using Kubebuilder and controller-runtime.

## Approval

Before signing a certificate, Issuers **must** also ensure that the `CertificateRequest` is
[`Approved`](../concepts/certificaterequest.md#approval).

If the `CertificateRequest` is not `Approved`, the issuer **must** not process it. Issuers are not
responsible for approving `CertificateRequests` and should refuse to proceed if they find a certificate
that is not approved.

### Supporting Legacy cert-manager Releases

Certificate approval was added to cert-manager in `v1.3`. In order to support older versions of cert-manager,
external issuers may choose to sign `CertificateRequests` that will never have an approval
condition set, but this should be feature-gated and disabled by default.

If you're creating a new External Issuer today, we'd strongly recommend that you do not support such old
versions of cert-manager.

## Conditions

Once a signed certificate has been gathered by the issuer controller, it updates the status of the
`CertificateRequest` resource with the signed certificate. It is then important to update the condition
status of that resource to a ready state, as this is what is used to signal to higher order
controllers - such as the `Certificate` controller - that the resource is ready to be consumed.

Conversely, if the `CertificateRequest` fails, it is as important to mark the resource as such, as this will
also be used as a signal to higher order controllers. Valid condition states are listed under [concepts](../concepts/certificaterequest.md#conditions).

## Implementation

It is recommended that you make use of the [kubebuilder](https://github.com/kubernetes-sigs/kubebuilder) project in order
to implement your external issuer controller. This makes it very simple to generate `CustomResourceDefinitions` and gives
you a lot of controller functionality out of the box.

If you have further questions on how to implement an external issuer controller, it is best to reach out on [slack](./README.md#slack)
or to join a [community calls](./README.md#meetings).
