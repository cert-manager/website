---
title: "Upgrading from v0.15 to v0.16"
linkTitle: "v0.15 to v0.16"
weight: 840
type: "docs"
---

## Issue with older versions of `kubectl`
`kubectl` versions lower than `v1.19.0-rc.1` have issues updating the `v0.16` CRD files, due to [a bug when handling deeply nested CRDs](https://github.com/kubernetes/kubernetes/issues/91615).
This patch is being backported into older versions of `kubectl` as new patch releases soon, however this is not the case at the time of writing.
This bug will make `kubectl apply -f [...]` hang. 

This bug only happens during a re-apply of the v0.16 CRDs. Initial upgrade does not cause issues. If you have this issue please use the `v1.19.0-rc.2` version of `kubectl` to apply this.
*Note: cert-manager does not recommend using this version to operate older Kubernetes clusters apart from applying the CRD updates.*
```console
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.19.0-rc.2/bin/$(uname | tr '[:upper:]' '[:lower:]')/amd64/kubectl
$ chmod +x ./kubectl
$ ./kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.16.1/cert-manager.crds.yaml
# If you use the static manifest install
$ ./kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.16.1/cert-manager.yaml
```

### Helm
Helm users who use `installCRDs=true` should **not** upgrade to `v0.16` until a Helm version built upon Kubernetes `v1.19` is released.
This issue only affects `v3.1+` however, we don't currently advise using `installCRDs=true`

From here on you can follow the [regular upgrade process](../).
