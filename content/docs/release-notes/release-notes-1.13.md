---
title: Release 1.13
description: 'cert-manager release notes: cert-manager 1.13'
---

## v1.13.1

v1.13.1 contains a bugfix for a name collision bug in the StableCertificateRequestName feature that was enabled by default in v1.13.0.

### Changes

#### Bug or Regression

- BUGFIX: fix CertificateRequest name collision bug in StableCertificateRequestName feature. (#6358, @jetstack-bot)

#### Other (Cleanup or Flake)

- Upgrade `github.com/emicklei/go-restful/v3` to `v3.11.0` because `v3.10.2` is labeled as "DO NOT USE". (#6368, @inteon)
- Upgrade Go from 1.20.7 to 1.20.8. (#6370, @jetstack-bot)

## v1.13.0

cert-manager 1.13 brings support for DNS over HTTPS, support for loading options from a versioned
config file for the cert-manager controller, and more. This release also includes the promotion of
the `StableCertificateRequestName` and `SecretsFilteredCaching` feature gates to Beta.

### Major Themes

#### Load cert-manager controller options from a versioned config file

It is now possible to load the cert-manager controller options from a versioned config file.
This was supported for the webhook already, but not for the controller. This is very useful
way to better manage these options and it allows us to change the options in the future without
breaking backwards compatibility by introducing a new config file version.

#### DNS over HTTPS (DoH) support

It is now possible to use DNS over HTTPS (DoH) for doing the self-checks during the ACME
DNS01 verification. The DNS self-check method to be used is controlled through the command line flag:
`--dns01-recursive-nameservers-only=true` in combination with
`--dns01-recursive-nameservers=https://<DoH RFC 8484 server address>` (e.g. `https://1.1.1.1/dns-query`)

This is very useful in case all traffic must be HTTP(S) traffic, e.g. when using a `HTTPS_PROXY`.

#### `StableCertificateRequestName` and `SecretsFilteredCaching` feature gates promoted to Beta

The `StableCertificateRequestName` and `SecretsFilteredCaching` feature gates have been promoted to Beta.
This means that they are enabled by default and that we will not remove them in the future. In case you
are experiencing issues with these features, please let us know. The feature gates can still be disabled
by setting the feature gate to false (e.g. in case you are experiencing issues with these features). We
plan to promote these feature gates to GA in the future, which will mean that they can no longer be disabled.

### Community

Welcome to these new cert-manager members (more info - https://github.com/cert-manager/cert-manager/pull/6260):  
@jsoref  
@FlorianLiebhart  
@hawksight  
@erikgb  

Thanks again to all open-source contributors with commits in this release, including:  
@AcidLeroy  
@FlorianLiebhart  
@lucacome  
@cypres  
@erikgb  
@ubergesundheit  
@jkroepke  
@jsoref  
@gdvalle  
@rouke-broersma  
@schrodit  
@zhangzhiqiangcs  
@arukiidou  
@hawksight  
@Richardds  
@kahirokunn  

Thanks also to the following cert-manager maintainers for their contributions during this release:
@SgtCoDFish
@maelvls
@irbekrm
@inteon

Equally thanks to everyone who provided feedback, helped users and raised issues on GitHub and Slack and joined our meetings!

Special thanks to @AcidLeroy for adding "load options from a versioned config file" support for the cert-manager controller! This has been on our wishlist for a very long time. (see https://github.com/cert-manager/cert-manager/pull/5337)

Also, thanks a lot to @FlorianLiebhart for adding support for DNS over HTTPS for the ACME DNS self-check. This is very useful in case all traffic must be HTTP(S) traffic, e.g. when using a `HTTPS_PROXY`. (see https://github.com/cert-manager/cert-manager/pull/5003)

Thanks also to the [CNCF](https://www.cncf.io/), which provides resources and support, and to the AWS open source team for being good community members and for their maintenance of the [PrivateCA Issuer](https://github.com/cert-manager/aws-privateca-issuer).

In addition, massive thanks to [Venafi](https://www.venafi.com/) for contributing developer time and resources towards the continued maintenance of cert-manager projects.

### Changes

#### Feature

- Add support for logging options to webhook config file. (https://github.com/cert-manager/cert-manager/pull/6243, https://github.com/inteon)
- Add view permissions to the well-known (OpenShift) user-facing `cluster-reader` aggregated cluster role (https://github.com/cert-manager/cert-manager/pull/6241, https://github.com/erikgb)
- Certificate Shim: distinguish DNS names and IP address in certificate (https://github.com/cert-manager/cert-manager/pull/6267, https://github.com/zhangzhiqiangcs)
- Cmctl can now be imported by third parties. (https://github.com/cert-manager/cert-manager/pull/6049, https://github.com/SgtCoDFish)
- Make `enableServiceLinks` configurable for all Deployments and `startupapicheck` Job in Helm chart. (https://github.com/cert-manager/cert-manager/pull/6292, https://github.com/ubergesundheit)
- Promoted the `StableCertificateRequestName` and `SecretsFilteredCaching` feature gates to Beta (enabled by default). (https://github.com/cert-manager/cert-manager/pull/6298, https://github.com/inteon)
- The cert-manager controller options are now configurable using a configuration file. (https://github.com/cert-manager/cert-manager/pull/5337, https://github.com/AcidLeroy)
- The `pki.CertificateTemplate*` functions now perform validation of the CSR blob, making sure we sign a Certificate that matches the `IsCA` and `(Extended)KeyUsages` that are defined in the CertificateRequest resource. (https://github.com/cert-manager/cert-manager/pull/6199, https://github.com/inteon)
- [helm] Add `prometheus.servicemonitor.endpointAdditionalProperties` to define additional properties on a ServiceMonitor endpoint, e.g. relabelings (https://github.com/cert-manager/cert-manager/pull/6110, https://github.com/jkroepke)

#### Design

- DNS over HTTPS (DoH) is now possible for doing the self-checks during the ACME verification.
  The DNS check method to be used is controlled through the command line flag: `--dns01-recursive-nameservers-only=true` in combination with `--dns01-recursive-nameservers=https://<<DoH RFC 8484 server address>` (e.g. `https://8.8.8.8/dns-query`). It keeps using DNS lookup as a default method. (https://github.com/cert-manager/cert-manager/pull/5003, https://github.com/FlorianLiebhart)

#### Bug or Regression

- Allow overriding default PDB `.minAvailable` with `.maxUnavailable` without setting `.minAvailable` to null (https://github.com/cert-manager/cert-manager/pull/6087, https://github.com/rouke-broersma)
- BUGFIX[ctl]: `cmctl check api --wait 0` exited without output and exit code 1; we now make sure we perform the API check at least once and return with the correct error code (https://github.com/cert-manager/cert-manager/pull/6109, https://github.com/inteon)
- BUGFIX[controller]: the issuer and certificate-name annotations on a Secret were incorrectly updated when other fields are changed. (https://github.com/cert-manager/cert-manager/pull/6147, https://github.com/inteon)
- BUGFIX[cainjector]: 1-character bug was causing invalid log messages and a memory leak (https://github.com/cert-manager/cert-manager/pull/6232, https://github.com/inteon)
- Fix CloudDNS issuers stuck in propagation check, when multiple instances are issuing for the same FQDN (https://github.com/cert-manager/cert-manager/pull/6088, https://github.com/cypres)
- Fix indentation of Webhook NetworkPolicy `matchLabels` in helm chart. (https://github.com/cert-manager/cert-manager/pull/6220, https://github.com/ubergesundheit)
- Fixed Cloudflare DNS01 challenge provider race condition when validating multiple domains (https://github.com/cert-manager/cert-manager/pull/6191, https://github.com/Richardds)
- Fixes a bug where webhook was pulling in controller's feature gates.
  ⚠️  ⚠️ BREAKING ⚠️ ⚠️ : If you deploy cert-manager using helm and have `.featureGates` value set, the features defined there will no longer be passed to cert-manager webhook, only to cert-manager controller. Use `webhook.featureGates` field instead to define features to be enabled on webhook.
  **Potentially breaking**: If you were, for some reason, passing cert-manager controller's features to webhook's `--feature-gates` flag, this will now break (unless the webhook actually has a feature by that name). (https://github.com/cert-manager/cert-manager/pull/6093, https://github.com/irbekrm)
- Fixes an issue where cert-manager would incorrectly reject two IP addresses as being unequal when they should have compared equal. This would be most noticeable when using an IPv6 address which doesn't match how Go's `net.IP.String()` function would have printed that address. (https://github.com/cert-manager/cert-manager/pull/6293, https://github.com/SgtCoDFish)
- We disabled the `enableServiceLinks` option for our ACME HTTP solver pods, because the option caused the pod to be in a crash loop in a cluster with lot of services. (https://github.com/cert-manager/cert-manager/pull/6143, https://github.com/schrodit)
- ⚠️ possibly breaking: Webhook validation of CertificateRequest resources is stricter now: all `KeyUsages` and `ExtendedKeyUsages` must be defined directly in the CertificateRequest resource, the encoded CSR can never contain more usages that defined there. (https://github.com/cert-manager/cert-manager/pull/6182, https://github.com/inteon)

#### Other (Cleanup or Flake)

- A subset of the klog flags have been deprecated and will be removed in the future. (https://github.com/cert-manager/cert-manager/pull/5879, https://github.com/maelvls)
- All service links in helm chart deployments have been disabled. (https://github.com/cert-manager/cert-manager/pull/6144, https://github.com/schrodit)
- Cert-manager will now re-issue a certificate if the public key in the latest CertificateRequest resource linked to a Certificate resource does not match the public key of the key encoded in the Secret linked to that Certificate resource (https://github.com/cert-manager/cert-manager/pull/6168, https://github.com/inteon)
- Chore: When `hostNetwork` is enabled, `dnsPolicy` is now set to `ClusterFirstWithHostNet`. (https://github.com/cert-manager/cert-manager/pull/6156, https://github.com/kahirokunn)
- Cleanup the controller config file structure by introducing nested structs. (https://github.com/cert-manager/cert-manager/pull/6242, https://github.com/inteon)
- Don't run API Priority and Fairness controller in webhook's extension apiserver (https://github.com/cert-manager/cert-manager/pull/6085, https://github.com/irbekrm)
- Helm: Add apache 2.0 license annotation (https://github.com/cert-manager/cert-manager/pull/6225, https://github.com/arukiidou)
- Make `apis/acme/v1/ACMEIssuer.PreferredChain` optional in JSON serialization. (https://github.com/cert-manager/cert-manager/pull/6034, https://github.com/gdvalle)
- The `SecretPostIssuancePolicyChain` now also makes sure that the `cert-manager.io/common-name`, `cert-manager.io/alt-names`, ... annotations on Secrets are kept at their correct value. (https://github.com/cert-manager/cert-manager/pull/6176, https://github.com/inteon)
- The cmctl logging has been improved and support for JSON logging has been added. (https://github.com/cert-manager/cert-manager/pull/6247, https://github.com/inteon)
- Updates Kubernetes libraries to `v0.27.2`. (https://github.com/cert-manager/cert-manager/pull/6077, https://github.com/lucacome)
- Updates Kubernetes libraries to `v0.27.4`. (https://github.com/cert-manager/cert-manager/pull/6227, https://github.com/lucacome)
- We now only check that the issuer name, kind and group annotations on a Secret match in case those annotations are set. (https://github.com/cert-manager/cert-manager/pull/6152, https://github.com/inteon)
