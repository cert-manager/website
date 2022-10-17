---
title: Upgrading from v1.3 to v1.4
description: 'cert-manager installation: Upgrading v1.3 to v1.4'
---

## Removal of the cert-manager operator package on Red Hat Marketplace

Since cert-manager `v0.15` there has been a package for cert-manager on [Red Hat Marketplace][],
but this has now been removed because it was not maintained and was found to be unreliable:
[#4055](https://github.com/cert-manager/cert-manager/issues/4055)
[#3732](https://github.com/cert-manager/cert-manager/issues/3732)
[#436](https://github.com/cert-manager/website/issues/436)

[Red Hat Marketplace]: https://marketplace.redhat.com

It is replaced by a new package which is generated via the [Community Operators Repository][],
and which is therefore available on
[OperatorHub.io](https://operatorhub.io),
[OpenShift Container Platform](https://openshift.com) and
[OKD](https://okd.io).

[Community Operators Repository]: https://github.com/operator-framework/community-operators

Please uninstall the existing cert-manager package and re-install
by following the [OLM Installation Documentation][].

[OLM Installation Documentation]: ../operator-lifecycle-manager.md

## Now Follow the Regular Upgrade Process

From here on you can follow the [regular upgrade process](./README.md).