---
title: "Upgrading from v0.14 to v0.15"
linkTitle: "v0.14 to v0.15"
weight: 850
type: "docs"
---

If you're using Helm to install cert-manager you now have the option `installCRDs`.
This will let Helm install CRDs like other cluster resources.
If you deployed cert-manager before do **NOT** use this option as it does not support
upgrading from manually installed CRDs.

>**Note**: If enabled, when uninstalling CRD resources will be deleted causing all installed custom resources to be DELETED. Full CRD support in Helm is pending on [this issue](https://github.com/helm/helm/issues/7735).

From here on you can follow the [regular upgrade process](../).
