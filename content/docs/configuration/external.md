---
title: External
description: 'cert-manager configuration: External Issuers'
---

cert-manager supports external `Issuer` types. While external issuers are not
implemented in the main cert-manager repository, they are otherwise treated the
same as any other issuer.

External issuers are typically deployed as a pod which is configured
to watch for `CertificateRequest` resources in the cluster whose `issuerRef`
matches the name of the issuer. External issuers exist outside of the
`cert-manager.io` group.

Installation for each issuer may differ; check the documentation for each
external issuer for more details on installing, configuring and using it.

## Known External Issuers

If you've created an external issuer which you'd like to share,
[raise a Pull Request](https://github.com/cert-manager/website/pulls) to have
it added here!

These external issuers are known to support and honor [approval](https://cert-manager.io/docs/concepts/certificaterequest/#approval).

- [kms-issuer](https://github.com/Skyscanner/kms-issuer): Requests
  certificates signed using an [AWS KMS](https://aws.amazon.com/kms/) asymmetric key.
- [aws-privateca-issuer](https://github.com/cert-manager/aws-privateca-issuer): Requests
  certificates from [AWS Private Certificate Authority](https://aws.amazon.com/certificate-manager/private-certificate-authority/)
  for cloud native/hybrid environments.
- [google-cas-issuer](https://github.com/jetstack/google-cas-issuer): Used
  to request certificates signed by private CAs managed by the
  [Google Cloud Certificate Authority Service](https://cloud.google.com/certificate-authority-service/).
- [origin-ca-issuer](https://github.com/cloudflare/origin-ca-issuer): Used
  to request certificates signed by
  [Cloudflare Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca)
  to enable TLS between Cloudflare edge and your Kubernetes workloads.
- [step-issuer](https://github.com/smallstep/step-issuer): Requests
  certificates from the [Smallstep](https://smallstep.com) [Certificate Authority server](https://github.com/smallstep/certificates).
- [freeipa-issuer](https://github.com/guilhem/freeipa-issuer): Requests
  certificates signed by [FreeIPA](https://www.freeipa.org).
- [ADCS Issuer](https://github.com/nokia/adcs-issuer): Requests
  certificates signed by [Microsoft Active Directory Certificate Service](https://docs.microsoft.com/en-us/windows-server/networking/core-network-guide/cncg/server-certs/install-the-certification-authority).
- [CFSSL Issuer](https://gerrit.wikimedia.org/r/plugins/gitiles/operations/software/cfssl-issuer/): Request certificates signed by a [CFSSL](https://github.com/cloudflare/cfssl) `multirootca` instance.
- [ncm-issuer](https://github.com/nokia/ncm-issuer): Requests certificates from the [Nokia](https://www.nokia.com/) [Netguard Certificate Manager](https://www.nokia.com/networks/security-portfolio/netguard/certificate-manager)

## Building New External Issuers

If you're interested in building a new external issuer, check the [development documentation](../contributing/external-issuers.md).
