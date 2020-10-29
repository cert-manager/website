---
title: "Release Notes"
linkTitle: "v1.1"
weight: 820
type: "docs"
---

The `v1.1` release is our first release in the v1 series with a few focus areas:

* New features and fixes in the ACME Issuer
* Improvements for large scale deployments
* TPP Auth

We also want to thank several new contributors to the project for their PRs! 
* alrs
* raphink
* renan
* sharmaansh21
* supriya-premkumar

All help is very appreciated and very welcome! 

As usual, please read the [upgrade notes](/docs/installation/upgrading/upgrading-1.0-1.1/) before upgrading.

## ACME Improvements

The ACME issuer is the most used cert-manager issuer. While most use is to talk to Let's Encrypt we are seeing a growing number of new ACME endpoints by certificate authorities,
PKI sofware exposing ACME endpoints and even ACME proxies to allow ACME being used to talk to other APIs.
In this release we focussed on adding new features into the ACME issuer to make even more possible!

### IP Addresses

In [RFC8738](https://tools.ietf.org/html/rfc8738) the support for IP Address validatio was added to the ACME spec. This allows cert-manager to use HTTP-01 validation to get certificates for the IP(s) of your ingress controller.
This can be done using the `ipAddresses` field of the Certificate resource. 

*Note:* Let's Encrypt has announced plans to support this soon!

### Duration

cert-manager now allows you to request certificates with a certain validity period from an ACME issuer. This allows you to get shorter or longer lived certificates from ACME solutions such as [Step-CA](https://smallstep.com/blog/private-acme-server/). You can enable this by setting `enableNotAfterDate` to `true` in the ACME Issuer configuration. Be careful, if your ACME issuer does not spupport this feature it is allowed by the ACME spec to hard fail the Order causing your certificate renewal or creation to stop. 

*Note:* Let's Encrypt has announced intention to look into the possibilities of implementing this.

### Error handling

TODO

## Improvements for large scale deployments