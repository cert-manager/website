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

## Full cluster backup and restore

This section refers to backing up and restoring 'all' Kubernetes resources in a
cluster- including some `cert-manager` ones- for scenarios such as disaster
recovery, cluster migration etc.

Note that we have not done any extensive testing, only a few common scenarios-
it is recommended that to test the backup and restore strategy before relying
on it as there are likely to be some other edge cases.
We would like to ensure that users can reliably backup and restore `cert-manager`
resources using common tools- if you encounter any errors, please do open a
GitHub issue or PR an update to this document.

### Avoiding unnecessary certificate re-issuances

#### Order of restore

If `cert-manager` does not find a Kubernetes secret with an X.509 certificate
for a `Certificate`, re-issuance will be triggered. To avoid unnecessary
re-issuances after a restore, ensure that secrets are restored before
`Certificate`s. Similarly secrets should be restored before `Ingress`es if you
are using [ingress-shim](../usage/ingress.md))

#### Excluding one-time `cert-manager` resources from backup

`cert-manager` has a number of resources- `Order`s, `Challenge`s and
`CertificateRequest`s -that are designed to represent a point-in-time operation
such as a request for a certificate. As such their status often depends on other
ephemeral resources (i.e a temporary Secret holding a private key), so
`cert-manager` cannot always correctly re-create the status of these resources
by just looking at the cluster state. In most cases backup tools will not
restore the statuses of custom resources so including such one-time resource in a
backup can result in an unnecessary re-issuance after a restore. For example, a
restored `Order` often ends up in a 'pending' state which results in new
`Challenge`s being created and re-issuance. To avoid re-issuances, we recommend
that `Order`s and `Challenge`s are excluded from the backup. We also don't
recommend backing up `CertificateRequest`s, see [Backing up and Restoring
CertificateRequests](#Backing-up-and Restoring-CertificateRequests)

### Restoring ingress-shim Certificates

A `Certificate` created for an `Ingress` via `ingress-shim` will have an [owner
reference](https://kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents)
pointing to the owning `Ingress`. `cert-manager` uses the owner reference to
verify that the `Certificate` 'belongs' to an `Ingress` and will not attempt to
create/correct it for an existing `Certificate`. After a full
cluster recreation, a restored owner reference would probably be incorrect
(`Ingress` UUID will have changed). The owner reference not matching could lead
to a situation where updates to the `Ingress` (i.e a new DNS name) are not
applied to the `Certificate`.
In most cases it would make sense to exclude the `Certificate`s created for
`Ingresses` by `ingress-shim` from the backup- given that the restore happens
in the correct order- Secret with the X.509 certificate restored before
the `Ingress`- `cert-manager` will be able to create a new `Certificate`
for the `Ingress` and determine that the existing secret is for that `Certificate`.

### Velero

We have briefly tested backup and restore with `velero` `v1.5.3` and
`cert-manager` `v1.3.1` and `v1.3.0` as well as `velero` `v1.3.1` and
`cert-manager` `v1.1.0` `velero` `v1.3.1`.

 A few potential edge cases:

- Ensure that the backups include `cert-manager` CRDs. We have seen that if
  `--exclude-namespaces` flag is passed to `velero backup create`, CRDs for
  which there are no actual custom resources included in the backup might not be
  included in backup unless ``--include-cluster-resources=true` flag is also passed.

-  Velero does not restore statuses of custom resources, so you should probably
   exclude `Order`s, `Challenge`s and `CertificateRequest`s from the backup, see
   [Excluding one-time `cert-manager` resources from backup](#Excluding one-time
   `cert-manager` resources from backup).

- Velero's default restore order is such that Secrets will be restored before
  `Ingress`es and Custom Resources will be restored last, so there should be no
  unnecessary certificate re-issuances due to `Certificate`s whose `Secret`s
  have not yet been restored, see [Order of restore](#Order of restore).

- When restoring the deployment of `cert-manager` itself, it may be necessary to
  restore `cert-manager`'s RBAC resources before the rest of the deployment.
  This is because `cert-manager`'s controller needs to be able to create
  `Certificate`'s for the `cert-manager`'s webhook before the webhook can become
  ready. In order to do this, the controller needs the right permissions. Since
  Velero by default restores pods before RBAC resources, the restore might get
  stuck waiting for the webhook pod to become ready.

- Velero does not restore owner references, so it may be necessary to exclude
  `Certificate`s created for `Ingress`es from the backup even when not
  re-creating the `Ingress` itself. See [Restoring ingress-shim
  Certificates](### Restoring ingress-shim Certificates).

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
