---
title: Defaulting Policy
description: 'Defining defaults for Certificate properties.'
---

![issuance flow: policy](/images/issuance-flow-policy.png)

In the issuance flow, there are two places where defaults can be applied: before the X.509
CertificateSigningRequest is created, and before the X.509 Certificate is created. In
the first case, it is cert-manager that applies the defaults. In the second case, it is the
issuer that applies the defaults.

An important difference between these two cases is that in the first case, there are more
properties that can be defaulted. For example, since the private key still has to be generated,
all the properties of the private key can be defaulted. In the second case, the private key
has already been generated. Also, the issuer reference itself can be defaulted in the first
case, but not in the second case. For example, in a specific namespace, the issuer can be
defaulted to a specific issuer.

Defaulting is done to simplify the experience of the person requesting the certificate. It
does not prevent the person from overriding the defaults. Therefore, an approval policy can
be used (see [Approval Policy](approval) for more details).

## Defaults applied by cert-manager: before creating the X.509 Certificate Signing Request (CSR)

To apply defaults before the X.509 Certificate Signing Request (CSR) is created, defaults must be
applied to the inputs used to create the CSR. After the CSR is created, it cannot be modified without
invalidating the its signature. This means that defaults cannot be applied to any of the properties of
the CSR included in the CertificateRequest or CertificateSigningRequest resource.

Instead, defaults must be applied to the Certificate resource that is used to create the CertificateSigningRequest.
When using a CSI driver, defaults must be applied to CSI annotations or CSI driver configuration.
To dynamically apply defaults to these resources, you can use tools like [`kyverno`](https://kyverno.io/).
CI/CD tools like Helm, kustomize, ... can also be used to template and apply defaults to these resources.

## Defaults applied by the issuer: before creating the X.509 Certificate

Before creating the X.509 Certificate, the issuer can use default values for properties in
the resulting certificate. More generally, the issuer is free to use any logic to map the
properties in the X.509 Certificate Signing Request (CSR) to the properties in the X.509 Certificate
(see [Issuing Policy](issuing.md) for more details).
