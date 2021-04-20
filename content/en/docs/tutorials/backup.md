---
title: "Backup and Restore Resources"
linkTitle: "Backup and Restore Resources"
weight: 10
type: "docs"
---

If you need to uninstall cert-manager, or transfer your installation to a new
cluster, you can backup all of cert-manager's configuration in order to later
re-install.

## Backing up cert-manager resource configuration

The following commands will back up the configuration of `cert-manager`
resources. This might be useful to back up before upgrading `cert-manager`. As
this backup does not include the secrets containing the X.509 certificates,
restoring to a cluster that does not already have those secrets will result in
the certificates being re-issued.

### Backup

To backup all of your cert-manager configuration resources, run:

```bash
$ kubectl get -o yaml \
     --all-namespaces \
     issuer,clusterissuer,certificates > cert-manager-backup.yaml
```

If you are transferring data to a new cluster, you may also need to copy across
additional Secret resources that are referenced by your configured Issuers, such
as:

#### CA Issuers

- The root CA Secret referenced by `issuer.spec.ca.secretName`

#### Vault Issuers

- The token authentication Secret referenced by
  `issuer.spec.vault.auth.tokenSecretRef`
- The AppRole configuration Secret referenced by
  `issuer.spec.vault.auth.appRole.secretRef`

#### ACME Issuers

- The ACME account private key Secret referenced by `issuer.acme.privateKeySecretRef`
- Any Secrets referenced by DNS providers configured under the
  `issuer.acme.dns01.providers` and `issuer.acme.solvers.dns01` fields.

### Restore

In order to restore your configuration, you can simply `kubectl apply` the files
created above after installing cert-manager.

```bash
$ kubectl apply -f cert-manager-backup.yaml
```

## Backing up and Restoring CertificateRequests 

 We no longer recommend including `CertificateRequest` resources in a backup
 for most scenarios.
 `CertificateRequest`s are designed to represent a one-time
 request for an X.509 certificate- once the request has been fulfilled,
 `CertificateRequest` can usually be safely deleted as in most cases (such as when
 a `CertificateRequest` has been created for a `Certificate`) a new
 `CertificateRequest` will be created when needed (i.e at a time of a renewal
 of a `Certificate`).
 In `v1.3.0` , as part of our work towards [policy
 implementation](https://github.com/jetstack/cert-manager/pull/3727) we
 introduced identity fields for `CertificateRequest` resources where, at a time
 of creation, `cert-mananager`'s webhook updates `CertificateRequest`'s spec
 with immutable identity fields, representing the identity of the creator of
 the `CertificateRequest`.
 This introduces some extra complexity for backing up
 and restoring `CertificateRequest`s as the identity of the restorer might
 differ from that of the original creator and we have seen some edge cases
 where this causes issues at restore time.
