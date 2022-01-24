---
title: Upgrading from v1.5 to v1.6
description: >-
  Upgrading cert-manager CRDs and stored versions of cert-manager custom
  resources
---

### Upgrading cert-manager CRDs and stored versions of cert-manager custom resources

Following their deprecation in version 1.4, the cert-manager API versions
`v1alpha2, v1alpha3, and v1beta1` are no longer served.

This means if your deployment manifests contain any of these API versions, you
will not be able to deploy them after upgrading. Our new `cmctl` utility or old
`kubectl cert-manager` plugin can [convert](../../../usage/cmctl/#convert) old
manifests to `v1` for you.

{{% pageinfo color="warning" %}}

⛔️ If you are upgrading cert-manager on a cluster which has previously had
cert-manager < `v1.0.0`, you will need to ensure that all cert-manager custom
resources are stored in `etcd` at `v1` version and that cert-manger CRDs do not
reference the deprecated APIs **before you upgrade to `v1.6`**.

This is explained in more detail in the
[Upgrading existing cert-manager resources](../remove-deprecated-apis/#upgrading-existing-cert-manager-resources)
page.

{{% /pageinfo %}}

## Now Follow the Regular Upgrade Process

From here on you can follow the [regular upgrade process](../).
