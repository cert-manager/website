---
title: Approval Policy
description: 'Restricting who can request which certificates.'
---

![issuance flow: policy](/images/issuance-flow-policy.png)

In the issuance flow, there are typically two places where non-conforming certificate
requests can be rejected: before sending the X.509 Certificate Signing Request (CSR) to the
issuer, and after receiving the X.509 Certificate by the issuer. In the first case,
it is cert-manager that rejects the request. In the second case, it is the issuer
that rejects the request.

## Rejecting requests before sending the X.509 Certificate Signing Request (CSR) to the issuer

cert-manager requires that a [CertificateRequest](../../usage/certificaterequest.md)
is approved before it is sent to the issuer. Also, CertificateSigningRequests must
be approved before they are sent to the issuer. This approval is done by adding an
[approval condition](../../usage/certificaterequest.md#approval) to the resource.

In a default installation, cert-manager automatically approves all CertificateRequests
and CertificateSigningRequests that use any of its built-in issuers. This is done to
simplify the first-time experience of using cert-manager. However, this is not
recommended for production environments. Instead, you should configure a more strict
auto-approver that limits who can request which certificates. [approver-policy](approver-policy)
is an example of such an auto-approver.

## Rejecting requests after receiving the X.509 Certificate Signing Request (CSR) by the issuer

After receiving the X.509 Certificate Signing Request (CSR), the logic to reject requests
is up to the issuer. cert-manager supports a large number of issuers, each issuer
has full autonomy over what requests are rejected and what error messages are returned.
Additionally, an issuer could also choose accept all requests and instead
override the non-conforming properties in the CSR. More generally,
the issuer is free to use any logic to map the properties in the X.509 Certificate Signing Request (CSR)
to the properties in the X.509 Certificate (see [Issuing Policy](../issuing.md).
