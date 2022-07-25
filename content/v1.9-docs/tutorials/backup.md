---
title: Backup and Restore Resources
description: 'cert-manager tutorials: Backing up your cert-manager installation'
---

If you need to uninstall cert-manager, or transfer your installation to a new
cluster, you can backup all of cert-manager's configuration in order to later
re-install.

## Backing up cert-manager resource configuration

The following commands will back up the configuration of `cert-manager`
resources. Doing that might be useful before upgrading `cert-manager`. As
this backup does not include the `Secrets` containing the X.509
certificates, restoring to a cluster that does not already have those
`Secret` objects will result in the certificates being reissued.

### Backup

To backup all of your cert-manager configuration resources, run:

```bash
kubectl get --all-namespaces -oyaml issuer,clusterissuer,cert > backup.yaml
```

If you are transferring data to a new cluster, you may also need to copy across
additional `Secret` resources that are referenced by your configured Issuers, such
as:

#### CA Issuers

- The root CA `Secret` referenced by `issuer.spec.ca.secretName`

#### Vault Issuers

- The token authentication `Secret` referenced by
  `issuer.spec.vault.auth.tokenSecretRef`
- The AppRole configuration `Secret` referenced by
  `issuer.spec.vault.auth.appRole.secretRef`

#### ACME Issuers

- The ACME account private key `Secret` referenced by `issuer.acme.privateKeySecretRef`
- Any `Secret`s referenced by DNS providers configured under the
  `issuer.acme.dns01.providers` and `issuer.acme.solvers.dns01` fields.

### Restore

In order to restore your configuration, you can `kubectl apply` the files
created above after installing cert-manager, with the exception of the
`uid` and `resourceVersion` fields that do not need to be restored:

```bash
kubectl apply -f <(awk '!/^ *(resourceVersion|uid): [^ ]+$/' backup.yaml)
```

## Full cluster backup and restore

This section refers to backing up and restoring 'all' Kubernetes resources in a
cluster — including some `cert-manager` ones — for scenarios such as disaster
recovery, cluster migration etc.

*Note*: We have tested this process on simple Kubernetes test clusters with a limited set of Kubernetes releases. To avoid data loss, please test both the backup and the restore strategy on your own cluster before depending upon it in production. If you encounter any errors, please open a GitHub issue or a PR to document variations on this process for different Kubernetes environments. 

### Avoiding unnecessary certificate reissuance

#### Order of restore

If `cert-manager` does not find a Kubernetes `Secret` with an X.509 certificate
for a `Certificate`, reissuance will be triggered. To avoid unnecessary
reissuance after a restore, ensure that `Secret`s are restored before
`Certificate`s. Similarly, `Secret`s should be restored before `Ingress`es if you
are using [`ingress-shim`](../usage/ingress.md).

#### Excluding some cert-manager resources from backup

`cert-manager` has a number of custom resources that are designed to represent a
point-in-time operation. An example would be a `CertificateRequest` that
represents a one-time request for an X.509 certificate. The status of these
resources can depend on other ephemeral resources (such as a temporary `Secret`
holding a private key) so `cert-manager` might not be able to correctly recreate
the state of these resources at a later point.

In most cases backup and restore tools will not restore the statuses of custom resources,
so including such one-time resources in a backup can result in an unnecessary reissuance
after a restore as without the status fields `cert-manager` will not be able to tell that,
for example, an `Order` has already been fulfilled.
To avoid unnecessary reissuance, we recommend that `Order`s and `Challenge`s are excluded
from the backup. We also don't recommend backing up `CertificateRequest`s, see [Backing up CertificateRequests](#backing-up-certificaterequests)

### Restoring Ingress Certificates

A `Certificate` created for an `Ingress` via [`ingress-shim`](../usage/ingress.md) will have an [owner
reference](https://kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents)
pointing to the `Ingress` resource. `cert-manager` uses the owner reference to
verify that the `Certificate` 'belongs' to that `Ingress` and will not attempt to
create/correct it for an existing `Certificate`. After a full
cluster recreation, a restored owner reference would probably be incorrect
(`Ingress` UUID will have changed). The incorrect owner reference could lead
to a situation where updates to the `Ingress` (i.e a new DNS name) are not
applied to the `Certificate`.

To avoid this issue, in most cases `Certificate`s created via `ingress-shim`
can be excluded from the backup. Given that the restore happens
in the correct order (`Secret` with the X.509 certificate restored before
the `Ingress`) `cert-manager` will be able to create a new `Certificate`
for the `Ingress` and determine that the existing `Secret` is for that `Certificate`.

### Velero

We have briefly tested backup and restore with `velero` `v1.5.3` and
`cert-manager` versions `v1.3.1` and `v1.3.0` as well as `velero` `v1.3.1`
 and `cert-manager` `v1.1.0`.

 A few potential edge cases:

- Ensure that the backups include `cert-manager` CRDs.
  For example, we have seen that if `--exclude-namespaces` flag is passed to
  `velero backup create`, CRDs for which there are no actual resources to be
  included in the backup might also not be included in backup unless
  `--include-cluster-resources=true` flag is also passed to the backup command.

-  Velero does not restore statuses of custom resources, so you should probably
   exclude `Order`s, `Challenge`s and `CertificateRequest`s from the backup, see
   [Excluding some cert-manager resources from backup](#excluding-some-cert-manager-resources-from-backup).

- Velero's [default restore order](https://github.com/vmware-tanzu/velero/blob/main/pkg/cmd/server/server.go#L470)(`Secrets` before `Ingress`es, Custom Resources
  restored last), should ensure that there is no unnecessary certificate reissuance
  due to the order of restore operation, see [Order of restore](#order-of-restore).

- When restoring the deployment of `cert-manager` itself, it may be necessary to
  restore `cert-manager`'s RBAC resources before the rest of the deployment.
  This is because `cert-manager`'s controller needs to be able to create
  `Certificate`'s for the `cert-manager`'s webhook before the webhook can become
  ready. In order to do this, the controller needs the right permissions. Since
  Velero by default restores pods before RBAC resources, the restore might get
  stuck waiting for the webhook pod to become ready.

- Velero does not restore owner references, so it may be necessary to exclude
  `Certificate`s created for `Ingress`es from the backup even when not
  re-creating the `Ingress` itself. See [Restoring Ingress Certificates](#restoring-ingress-certificates).

## Backing up CertificateRequests

 We no longer recommend including `CertificateRequest` resources in a backup
 for most scenarios.
 `CertificateRequest`s are designed to represent a one-time
 request for an X.509 certificate. Once the request has been fulfilled,
 `CertificateRequest` can usually be safely deleted[^1]. In most cases (such as when
 a `CertificateRequest` has been created for a `Certificate`) a new
 `CertificateRequest` will be created when needed (i.e at a time of a renewal
 of a `Certificate`).
 In `v1.3.0` , as part of our work towards [policy
 implementation](https://github.com/cert-manager/cert-manager/pull/3727) we
 introduced identity fields for `CertificateRequest` resources where, at a time
 of creation, `cert-mananager`'s webhook updates `CertificateRequest`'s spec
 with immutable identity fields, representing the identity of the creator of
 the `CertificateRequest`.
 This introduces some extra complexity for backing up
 and restoring `CertificateRequest`s as the identity of the restorer might
 differ from that of the original creator and in most cases a restored
 `CertificateRequest` would likely end up with incorrect state.

 [^1]: there is an edge case where certain changes to `Certificate` spec may not
    trigger re-issuance if there is no `CertificateRequest` for that
    `Certificate`. See [documentation on when do certificates get
    re-issued](../faq/README.md#when-do-certs-get-re-issued).