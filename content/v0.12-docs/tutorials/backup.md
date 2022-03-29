---
title: Backup and Restore Resources
description: 'cert-manager tutorials: Backing up your cert-manager installation'
---

If you need to uninstall cert-manager, or transfer your installation to a new
cluster, you can backup all of cert-manager's configuration in order to later
re-install.

## Backing up

To backup all of your cert-manager configuration resources, run:

```bash
$ kubectl get -o yaml \
     --all-namespaces \
     issuer,clusterissuer,certificates,certificaterequests > cert-manager-backup.yaml
```

If you are transferring data to a new cluster, you may also need to copy across
additional Secret resources that are referenced by your configured Issuers, such
as:

### CA Issuers

- The root CA Secret referenced by `issuer.spec.ca.secretName`

### Vault Issuers

- The token authentication Secret referenced by
  `issuer.spec.vault.auth.tokenSecretRef`
- The AppRole configuration Secret referenced by
  `issuer.spec.vault.auth.appRole.secretRef`

### ACME Issuers

- The ACME account private key Secret referenced by `issuer.acme.privateKeySecretRef`
- Any Secrets referenced by DNS providers configured under the
  `issuer.acme.dns01.providers` and `issuer.acme.solvers.dns01` fields.

## Restoring Resources

In order to restore your configuration, you can simply `kubectl apply` the files
created above after installing cert-manager.

```bash
$ kubectl apply -f cert-manager-backup.yaml
```

If you have migrated from an old cluster, you will need to make sure to run a
similar `kubectl apply` command to restore your Secret resources too.