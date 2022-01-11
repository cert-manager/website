---
title: "Migrating Deprecated API Resources"
linkTitle: "Migrating Deprecated API Resources"
weight: 20
type: "docs"
---

The following cert-manager APIs were deprecated in cert-manager `v1.4`:

- `cert-manager.io/v1alpha2`
- `cert-manager.io/v1alpha3`
- `cert-manager.io/v1beta1`
- `acme.cert-manager.io/v1alpha2`
- `acme.cert-manager.io/v1alpha3`
- `acme.cert-manager.io/v1beta1`

These APIs are no longer served in cert-manager `v1.6` and are fully removed in cert-manager `v1.7`. If you have a cert-manager installation that is using or has previously used these deprecated APIs you might need to upgrade your cert-manager custom resources and CRDs. This should be done before upgrading to cert-manager `v1.6` or later.

{{% alert title="Note" color="warning" %}}
An earlier version of this document listed a number of kubectl commands to run to migrate resources. These steps have now been encoded in [`cmctl upgrade migrate-api-version` command](https://cert-manager.io/docs/usage/cmctl/#migrate-api-version). If you have already run the kubectl commands, your resources should have been migrated and there should be no need to also run the `cmctl` command. However, if you are not sure, you can still run the `cmctl` command as well- it will be a no-op if no actions are needed.
{{% /alert %}}

# Upgrading existing cert-manager resources

1. Familiarize yourself with the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#writing-reading-and-updating-versioned-customresourcedefinition-objects) on CRD versioning.

2. Make sure your cert-manager deployment is currently at version `v1.0` or later.

3. Make sure that any cert-manager custom resource manifests that refer to the deprecated APIs are updated to use the `cert-manager.io/v1` API and re-applied. You can use the [cmctl convert command](https://cert-manager.io/docs/usage/cmctl/#convert)to convert manifests.

4. Run [cmctl upgrade migrate-api-version command](https://cert-manager.io/docs/usage/cmctl/#migrate-api-version) to migrate any resources that might be stored in `etcd` at the deprecated API versions and to patch the cert-manager CRDs.
