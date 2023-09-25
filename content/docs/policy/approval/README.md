---
title: Policy for cert-manager certificates
description: 'cert-manager usage: approver-policy'
---

cert-manager [CertificateRequests](../usage/certificaterequest.md) can be
rejected from being signed by using the [approval
API](../usage/certificaterequest.md#approval).
[approver-policy](https://github.com/cert-manager/approver-policy) is a
cert-manager project that enables you to write policy to automatically manage
this approval mechanism.

Please read the [project page](../projects/approver-policy/README.md) for more
information on how to install and use approver-policy.
