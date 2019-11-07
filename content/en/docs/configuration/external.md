---
title: "External"
linkTitle: "External"
weight: 30
type: "docs"
---

cert-manager supports external issuer types. These external issuer types are
issuers that are not support by cert-manager by default, or are 'out of tree',
however are treated the exact same as any other internal issuer type. External
issuer types are typically installed by deploying another pod into your cluster
that will watch `CertificateRequest` resources and honour them based on
configured `Issuer` resources. These issuer type exist outside of the
`cert-manager.io` group.

As of 0.11, no changes need to be made to cert-manager to support external
issuers.

The recommended installation process and configuration options for these
external issuer types can be found in the documentation of that external issuer
project. A list of known external issuer projects that are maintained by their
authors are as follows:

- [step-issuer](https://github.com/smallstep/step-issuer): Used to request
  certificates from the [SmallStep](https://smallstep.com) [Certificate
  Authority ACME server](https://github.com/smallstep/certificates).

To create your own external issuer type, please follow the guidance in the
[development documentation](../../contributing/external-issuers/).
