---
title: Release Notes
description: 'cert-manager release notes: cert-manager v1.2'
---

⚠️ cert-manager `v1.2` release drops support for Kubernetes versions below `v1.16`. This allows new features to be introduced whilst keeping the project maintainable. ⚠️

This release adds new features for several issuers and fixes several bugs. 

Please read the [upgrade notes](../installation/upgrading/upgrading-1.1-1.2.md) before upgrading.

Aside from that, there have been numerous bug fixes and features summarized below. 

# Deprecated Features and Breaking Changes

1. The `--renew-before-expiration-duration` flag of the cert-manager controller-manager has been deprecated. Please set the `Certificate.Spec.RenewBefore` field instead. This flag will be removed in the next release.

2. As Kubernetes `v1.16` is now the earliest supported version, The `legacy` manifests have now been removed. You can read more [here](../installation/supported-releases.md).

3. The `User-Agent` request header has been changed from `jetstack-cert-manager/<version>` to `cert-manager/<version>`. This may affect functionality if you rely on an a User-Agent allowlist in a corporate environment.

# Copyright and Ownership

* As this is the first release prepared after the [acceptance of cert-manager into the CNCF sandbox](https://blog.jetstack.io/blog/cert-manager-cncf/), the copyright strings have been changed to remove references to Jetstack.

* The `User-Agent` request header has changed from `jetstack-cert-manager/<version>` to `cert-manager/<version>`.

# New Features

## Additional options for cert-manager controllers

* The cert-manager controller can now be configured to expose profiling information using the new `--enable-profiling` flag.

* cainjector leader election leases are now customizable using the new flags `--leader-election-lease-duration`, `--leader-election-renew-deadline` and `--leader-election-retry-period`.

## Usability improvements

* cert-manager can now create Java KeyStores that are compatible with Java 8 or greater. A file named `keystore.jks` will be added to the secret specified in the `Certificate.spec.secretName` encrypted with the password specified in the `Certificate.spec.jks.passwordSecretRef` secret.

  ```yaml
  apiVersion: cert-manager.io/v1
  kind: Certificate
  metadata:
    name: jks-example
  spec:
    secretName: jks-keystore
    jks:
      create: true
      passwordSecretRef:
        name: supersecret
        key: password
  ```

* ingress-shim now supports the new `cert-manager.io/usages` annotation for specifying custom key usages. If this isn't set, it defaults to `digital signature,key encipherment`, but a comma separated list of [any valid usages](https://pkg.go.dev/github.com/jetstack/cert-manager@v1.2.0/pkg/apis/certmanager/v1#KeyUsage) can be specified.

* ingress-shim now also checks for `cert-manager.io/duration` and `cert-manager.io/renew-before` annotations and uses those values to set the `Certificate.Spec.Duration` and `Certificate.Spec.RenewBefore` fields.

## Issuer Improvements

* The Vault issuer now stores the root CA in `ca.crt` rather than the issuing CA, moving the chain into `tls.crt`.

* The Venafi issuer now sets the `ca.crt` field of the secret.

* A list of OCSP server URLs can now be set on certificates issued by the CA issuer using the `Issuer.spec.ca.ocspServers` field.

## CLI User Experience

* The cert-manager `kubectl` plugin can now show you information about certificates in your cluster: 
   ```shell
   kubectl cert-manager inspect secret my-crt --namespace my-namespace
   ```

* cert-manager CRDs have been given categories so now they appear in `kubectl get cert-manager` and `kubectl get cert-manager-acme`.

## ACME

* The ACME spec allows for a `NotAfter` date, which is supported by Step CA but not Let's Encrypt. This is gated behind a boolean on `Issuer.spec.acme.enableDurationFeature`. When enabled, cert-manager
will pass through the requested Duration to the ACME server.

# Bug Fixes

* The AWS Route53 DNS01 challenge now uses exponential backoff on failure.

* Ingress validation rules have been relaxed to allow for Certificates to be created/updated for valid Ingress TLS entries even if the same Ingress contains some invalid TLS entries.

* OpenAPI validation has relaxed in the helm chart to work around a type conversion bug that prevented users from upgrading cert-manager with `helm upgrade`