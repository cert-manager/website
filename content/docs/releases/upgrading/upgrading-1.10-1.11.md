---
title: Upgrading from v1.10 to v1.11
description: 'cert-manager installation: Upgrading v1.10 to v1.11'
---

There are no breaking changes between cert-manager `v1.10` and `v1.11` unless you're using
the experimental Gateway API support in cert-manager.

## Gateway API

Unless you've explicitly opted into using cert-manager's Gateway API experimental feature,
you don't need to worry about this change.

cert-manager `v1.11` updates cert-manager's supported version of the Gateway API CRDs to
`v1beta1`. Since Gateway API isn't yet entirely stable, you should expect some breakage as
the project evolves and when upgrading to new versions, currently.

You shouldn't need to change any config on your actual Gateway API resources because of this
upgrade, but you **must** ensure that you've installed the `v1beta1` Gateway API version.

There are additional details in the [Gateway API usage](../../usage/gateway.md) document.

## Next Steps

From here on you can follow the [regular upgrade process](../../installation/upgrade.md).
