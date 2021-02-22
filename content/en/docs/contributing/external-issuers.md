---
title: "Implementing External Issuers"
linkTitle: "Implementing External Issuers"
weight: 70
type: "docs"
---

cert-manager offers a number of [core issuer
types](../../configuration/) that represent certificate authorities
that can sign certificates when requested. As of `v0.11`, cert-manager also
supports out-of-tree external issuers, and treats them the same as
in-tree issuer types. For more information on how to install and configure
external issuer types, read the documentation
[here](../../configuration/external/).

## Concepts

An issuer represents a certificate authority that signs incoming certificate
requests. In cert-manager, the `CertificateRequest` resource represents a single
request for a signed certificate, containing the raw certificate request PEM
data as well as other information that can be used to describe the designed
certificate.

In cert-manager, each issuer type has its own controller that watches these
`CertificateRequest` resources and waits for one to be created which is meant
for itself. This is done by the `issuerRef` stanza on the `CertificateRequest`
which inside contains - name, kind, group. The `group` denotes an API group, for
example `cert-manager.io` which is responsible for all core issuer types. `kind`
denotes the kind resource type of the issuer, such as an `Issuer` or
`ClusterIssuer`. Finally, the `name` denotes the name of the issuer resource
inside of that kind.

When an issuer controller observes a new `CertificateRequest`, it ensure that
the request is meant for its controller type, and if so, then ensures that the
corresponding issuer resource exists in Kubernetes. If these are both true, it
will then use the information inside that issuer resource to attempt to create a
signed certificate, based upon the certificate request.

Once a signed certificate has been gathered by the issuer controller, it then
updates the status of the `CertificateRequest` resource with the signed
certificate. It is then important to then update the condition status of that
resource to a ready state, as this is what is used to signal to higher order
controllers, such as the `Certificate` controller, that the resource is ready to
be consumed. Conversely, if the `CertificateRequest` fails, it is as important
to mark the resource as such, as this will also be used to signal to higher
order controllers. You can read the valid condition states
[here](../../concepts/certificaterequest/#conditions).

## Implementation

It is recommended that you make use of the
[kubebuilder](https://github.com/kubernetes-sigs/kubebuilder) project in order
to implement your external issuer controller. This makes it very simple to
generate `CustomResourceDefinitions` and gives you a lot of controller
functionality out of the box. If you have further questions on how to implement
an external issuer controller, it is best to reach out of the #cert-manager
[slack](https://slack.k8s.io) channel, or to join the weekly community calls which you
will be invited to once you join the [Google
Group](https://groups.google.com/forum/#!forum/cert-manager-dev).

## Sample External Issuer

There is a [Sample External Issuer](https://github.com/cert-manager/sample-external-issuer),
which is maintained by the cert-manager authors,
and which serves as an example of how to write an external issuer.

The README file has step-by-step instructions on how to write an external issuer using Kubebuilder and controller-runtime,
and contains detailed notes on all the tools you will need.
