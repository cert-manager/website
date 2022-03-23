---
title: External
description: 'cert-manager configuration: External Issuers'
---

cert-manager supports external `Issuer` types. These external `Issuer` types are
issuers that are not support by cert-manager by default, or are 'out of tree',
however are treated the exact same as any other internal `Issuer` type. External
issuer types are typically installed by deploying another pod into your cluster
that will watch `CertificateRequest` resources and honor them based on
configured `Issuer` resources. These issuer types exist outside of the
`cert-manager.io` group.

As of `v0.11`, no changes need to be made to cert-manager to support external
issuers.

The recommended installation process and configuration options for these
external issuer types can be found in the documentation of that external issuer
project. A list of known external issuer projects that are maintained by their
authors are as follows:

# Issuers that Honour Approval

- [aws-pca-issuer](https://github.com/jniebuhr/aws-pca-issuer): Used to
  request certificates from [AWS Private Certificate Authority]
  (https://aws.amazon.com/certificate-manager/private-certificate-authority/)
  for cloud native/hybrid environments.

- [google-cas-issuer](https://github.com/jetstack/google-cas-issuer): Used
  to request certificates signed by private CAs managed by the
  [Google Cloud Certificate Authority Service](https://cloud.google.com/certificate-authority-service/).

- [origin-ca-issuer](https://github.com/cloudflare/origin-ca-issuer): Used
  to request certificates signed by
  [Cloudflare Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca)
  to enable TLS between Cloudflare edge and your Kubernetes workloads.

- [step-issuer](https://github.com/smallstep/step-issuer): Used to request
  certificates from the [Smallstep](https://smallstep.com) [Certificate
  Authority server](https://github.com/smallstep/certificates).


# Issuers that do NOT Honour Approval
A list of known external issuer projects that are maintained by their authors
are as follows. These issuers do _not_ honour
[approval](../concepts/certificaterequest.md#approval).

- [awskms-issuer](https://github.com/Skyscanner/kms-issuer): Used to request
  certificates signed using an [AWS KMS](https://aws.amazon.com/kms/) asymmetric key.

- [freeipa-issuer](https://github.com/guilhem/freeipa-issuer): Used to
  request certificates signed by [FreeIPA](https://www.freeipa.org).

- [ADCS Issuer](https://github.com/nokia/adcs-issuer): Used
  to request certificates signed by 
  [Microsoft Active Directory Certificate Service](https://docs.microsoft.com/en-us/windows-server/networking/core-network-guide/cncg/server-certs/install-the-certification-authority).


To create your own external issuer type, please follow the guidance in the
[development documentation](../contributing/external-issuers.md).