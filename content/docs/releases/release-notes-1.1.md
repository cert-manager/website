---
title: Release Notes
description: 'cert-manager release notes: cert-manager v1.1'
---

The `v1.1` release is our first release in the `v1` series with a few focus areas:

* New features and fixes in the ACME Issuer
* Improved Venafi TPP Authentication

We also want to thank several new contributors to the project for their PRs!

* `alrs`
* `raphink`
* `renan`
* `sharmaansh21`
* `supriya-premkumar`

All help is very appreciated and very welcome!

Interested in knowing what will happen in the next releases of cert-manager? Go check out [our road map](https://github.com/cert-manager/cert-manager/blob/master/ROADMAP.md)!

As usual, please read the [upgrade notes](../installation/upgrading/upgrading-1.0-1.1.md) before upgrading.

## ACME Improvements

The ACME issuer is the most used cert-manager issuer. While most use it to talk to Let's Encrypt we are seeing a growing number of new ACME endpoints by certificate authorities,
PKI software exposing ACME endpoints and even ACME proxies to allow ACME being used to talk to other APIs.
In this release we focused on adding new features into the ACME issuer to make even more possible!

### IP Addresses

In [RFC8738](https://tools.ietf.org/html/rfc8738) the support for IP Address validation was added to the ACME spec. This allows cert-manager to use HTTP-01 validation to get certificates for the IP(s) of your ingress controller.
This can be done using the `ipAddresses` field of the Certificate resource.

*Note:* Let's Encrypt has announced plans to support this soon!

### Duration

cert-manager now allows you to request certificates with a certain validity period from an ACME issuer. This allows you to get shorter or longer lived certificates from ACME solutions such as [Step-CA](https://smallstep.com/blog/private-acme-server/). You can enable this by setting `enableDurationFeature` to `true` in the ACME Issuer configuration. Be careful, if your ACME issuer does not support this feature it is allowed by the ACME spec to hard fail the Order causing your certificate renewal or creation to stop.

*Note:* Let's Encrypt has announced intention to look into the possibilities of implementing this.

### Error handling

We improved the recognition and handling of errors given by the ACME server. We are now able to quickly retry transient errors and surface any fatal errors faster in the Kubernetes events and logs.
This allows you to get more insight into any rate limiting or other errors your ACME issuer provides us.

## Improvements for Venafi TPP Authentication

It is now possible to use a long lived access-token for authentication when configuring [Venafi TPP `Issuer` and `ClusterIssuer` types](../configuration/venafi.md).
This authentication mechanism is supported by `Venafi TPP >= 19.2`.