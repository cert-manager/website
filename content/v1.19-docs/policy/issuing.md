---
title: Issuing Policy
description: 'Configuring how requests are mapped to Certificates.'
---

![issuance flow: policy](/images/issuance-flow-policy.png)

cert-manager integrates with a large number of different certificate issuers, each
issuer has full autonomy over what issued certificates look like and what properties
they have. cert-manager does not require or enforce any specific relationship between
the properties in a CertificateRequest/ CertificateSigningRequest and the properties
in the issued certificate (except for the public key which must match).

For the core [SelfSigned](../configuration/selfsigned.md) and [CA](../configuration/ca.md) issuers,
cert-manager implements its own issuing policy. This policy is very simple and is not configurable.
All the requested properties will be copied into the issued certificate.

Another example is the [Let's Encrypt CA issuer](https://letsencrypt.org/) which also implements its own issuing policy. This policy is more complex than a 1:1
copy of the requested properties. For example, the Let's Encrypt issuer will always
[issue certificates with a 90 day validity period](https://letsencrypt.org/2015/11/09/why-90-days).
Also, it only supports a [limited set of (extended) key usages](https://community.letsencrypt.org/t/custom-extendedkeyusage-stripped-from-csr-while-generating-cert/17759/2).