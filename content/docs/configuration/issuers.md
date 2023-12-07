---
title: Issuers
description: 'cert-manager configuration: Issuers'
---

The following list contains all known cert-manager issuer integrations.

<div className="rotate">
| Tier | Controller | Docs | Issuer | cert-manager<br/>version used<br/>in tutorial[^1] | Released within<br/>12 months[^2] | Is Open Source |
|------|------------|------|--------|--------|--------|--------|
| 🥇 | acme-issuer (in-tree)        | [📄][config:acme-issuer] | [ACME](https://datatracker.ietf.org/doc/html/rfc8555) | [latest][production:acme-issuer] | [✔️][release:cert-manager] | ✔️ |
| 🥇 | venafi-enhanced-issuer       | [📄][config:venafi-enhanced-issuer] | [Venafi TLS Protect](https://venafi.com/tls-protect/) | [v1.12.1][production:venafi-enhanced-issuer] | [✔️][release:venafi-enhanced-issuer] | ❌ |
| 🥈 | aws-privateca-issuer         | [📄][config:aws-privateca-issuer] | [AWS Private Certificate Authority](https://aws.amazon.com/certificate-manager/private-certificate-authority/) | - | [✔️][release:aws-privateca-issuer] | ✔️ |
| 🥈 | ca-issuer (in-tree)          | [📄][config:ca-issuer] | CA issuer | - | [✔️][release:cert-manager] | ✔️ |
| 🥈 | command-issuer               | [📄][config:command-issuer] | [Keyfactor Command](https://www.keyfactor.com/products/command/) | - | [✔️][release:command-issuer] | ✔️ |
| 🥈 | ejbca-issuer                 | [📄][config:ejbca-issuer] | [EJBCA](https://www.ejbca.org/) | - | [✔️][release:ejbca-issuer] | ✔️ |
| 🥈 | google-cas-issuer            | [📄][config:google-cas-issuer] | [Google Cloud Certificate<br/>Authority Service](https://cloud.google.com/certificate-authority-service/) | - | [✔️][release:google-cas-issuer] | ✔️ |
| 🥈 | horizon-issuer               | [📄][config:horizon-issuer] | [EVERTRUST Horizon](https://evertrust.fr/horizon) | - | [✔️][release:horizon-issuer] | ✔️ |
| 🥈 | ncm-issuer                   | [📄][config:ncm-issuer] | [Nokia Netguard Certificate Manager](https://www.nokia.com/networks/security-portfolio/netguard/certificate-manager) | - | [✔️][release:ncm-issuer] | ✔️ |
| 🥈 | selfsigned-issuer (in-tree)  | [📄][config:selfsigned-issuer] | Self-Signed issuer | - | [✔️][release:cert-manager] | ✔️ |
| 🥈 | step-issuer                  | [📄][config:step-issuer] | [Certificate Authority server](https://github.com/smallstep/certificates) | - | [✔️][release:step-issuer] | ✔️ |
| 🥈 | tcs-issuer                   | [📄][config:tcs-issuer] | [Intel's SGX technology](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html) | - | [✔️][release:tcs-issuer] | ✔️ |
| 🥈 | vault-issuer (in-tree)       | [📄][config:vault-issuer] | [HashiCorp Vault](https://www.vaultproject.io/) | - | [✔️][release:cert-manager] | ✔️ |
| 🥈 | venafi-issuer (in-tree)      | [📄][config:venafi-issuer] | [Venafi TLS Protect](https://venafi.com/tls-protect/) | - | [✔️][release:cert-manager] | ✔️ |
| 🥉 | adcs-issuer                  | [📄][config:adcs-issuer] | [Microsoft Active Directory<br/>Certificate Service](https://docs.microsoft.com/en-us/windows-server/networking/core-network-guide/cncg/server-certs/install-the-certification-authority) | - | [❌][release:adcs-issuer] | ✔️ |
| 🥉 | cfssl-issuer                 | [📄][config:cfssl-issuer] | [CFSSL](https://github.com/cloudflare/cfssl) | - | [❌][release:cfssl-issuer] | ✔️ |
| 🥉 | freeipa-issuer               | [📄][config:freeipa-issuer] | [FreeIPA](https://www.freeipa.org) | - | [❌][release:freeipa-issuer] | ✔️ |
| 🥉 | kms-issuer                   | [📄][config:kms-issuer] | [AWS KMS](https://aws.amazon.com/kms/) | - | [❌][release:kms-issuer] | ✔️ |
| 🥉 | origin-ca-issuer             | [📄][config:origin-ca-issuer] | [Cloudflare Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca) | - | [❌][release:origin-ca-issuer] | ✔️ |
</div>

[production:venafi-enhanced-issuer]: https://platform.jetstack.io/documentation/academy/issue-and-approve-certificates-with-venafi-control-plane
[production:acme-issuer]: ../tutorials/getting-started-aks-letsencrypt/README.md

[//]: # (Configuration docs)

[config:venafi-enhanced-issuer]: https://docs.venafi.cloud/vaas/k8s-components/t-vei-install/
[config:acme-issuer]: ./acme.md

[config:aws-privateca-issuer]: https://github.com/cert-manager/aws-privateca-issuer
[config:selfsigned-issuer]: ./selfsigned.md
[config:ca-issuer]: ./ca.md
[config:vault-issuer]: ./vault.md
[config:venafi-issuer]: ./venafi.md
[config:step-issuer]: https://github.com/smallstep/step-issuer
[config:origin-ca-issuer]: https://github.com/cloudflare/origin-ca-issuer
[config:ncm-issuer]: https://github.com/nokia/ncm-issuer
[config:tcs-issuer]: https://github.com/intel/trusted-certificate-issuer
[config:google-cas-issuer]: https://github.com/jetstack/google-cas-issuer
[config:ejbca-issuer]: https://github.com/Keyfactor/ejbca-cert-manager-issuer
[config:command-issuer]: https://github.com/Keyfactor/command-cert-manager-issuer
[config:horizon-issuer]: https://github.com/evertrust/horizon-issuer

[config:kms-issuer]: https://github.com/Skyscanner/kms-issuer
[config:freeipa-issuer]: https://github.com/guilhem/freeipa-issuer
[config:adcs-issuer]: https://github.com/nokia/adcs-issuer
[config:cfssl-issuer]: https://gerrit.wikimedia.org/r/plugins/gitiles/operations/software/cfssl-issuer

[//]: # (Release pages)

[release:venafi-enhanced-issuer]: https://platform.jetstack.io/documentation/installation/venafi-enhanced-issuer/
[release:cert-manager]: ../releases/README.md

[release:aws-privateca-issuer]: https://github.com/cert-manager/aws-privateca-issuer/releases
[release:step-issuer]: https://github.com/smallstep/step-issuer/releases
[release:origin-ca-issuer]: https://github.com/cloudflare/origin-ca-issuer/releases
[release:ncm-issuer]: https://github.com/nokia/ncm-issuer/releases
[release:tcs-issuer]: https://github.com/intel/trusted-certificate-issuer/releases
[release:google-cas-issuer]: https://github.com/jetstack/google-cas-issuer/releases
[release:ejbca-issuer]: https://github.com/Keyfactor/ejbca-cert-manager-issuer/tags
[release:command-issuer]: https://github.com/Keyfactor/command-cert-manager-issuer/releases
[release:horizon-issuer]: https://github.com/evertrust/horizon-issuer/releases

[release:kms-issuer]: https://github.com/Skyscanner/kms-issuer/releases
[release:freeipa-issuer]: https://github.com/guilhem/freeipa-issuer/releases
[release:adcs-issuer]: https://github.com/nokia/adcs-issuer/releases
[release:cfssl-issuer]: https://gerrit.wikimedia.org/r/plugins/gitiles/operations/software/cfssl-issuer/+refs

- The issuers are sorted by their tier and then alphabetically.
- "in-tree" issuers are issuers that are shipped with cert-manager itself.
- These issuers are known to support and honor [approval](https://cert-manager.io/docs/concepts/certificaterequest/#approval).

If you've created an issuer which you'd like to share,
[raise a Pull Request](https://github.com/cert-manager/website/pulls) to have it added here!

## Issuer Tier system

The cert-manager project has a tier system for issuers. This is to help users
understand the maturity of the issuer.
The tiers are 🥇, 🥈 and 🥉.

NOTE: The cert-manager maintainers can decide to change the criteria and number
of tiers at any time.

### 🥇 Tier (Production-ready)

- 🥈 Tier criteria.
- The issuer has an end-to-end tutorial on how to set it up with cert-manager for use in production.
At the time of checking[^1], the used cert-manager version has to be still supported (see [Supported Releases](../releases/README.md)).  
An end-to-end tutorial must include:
  1. a short explanation on how to install cert-manager (including the used version and a link to [https://cert-manager.io/docs/installation/](../installation/))
  2. all required steps to install the issuer
  3. an explanation on how to configure the issuer's Custom Resources
  4. an explanation on how to issue a certificate using the issuer (using a Certificate resource)

### 🥈 Tier (Maintained)

- The issuer has had a release in the last 12 months (at the time of checking all issuers[^2]).

### 🥉 Tier (Unmaintained)

Other

[^1]: checked on 12th of October 2023
[^2]: checked on 12th of October 2023

## Building New External Issuers

If you're interested in building a new external issuer, check the [development documentation](../contributing/external-issuers.md).
