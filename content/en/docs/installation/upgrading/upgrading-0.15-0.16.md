---
title: "Upgrading from v0.15 to v0.16"
linkTitle: "v0.15 to v0.16"
weight: 840
type: "docs"
---

## Issue with older versions of `kubectl`
`kubectl` versions lower than `v1.19.0-rc.1` have issues updating the `v0.16` CRD files, this is due to [a bug when handling deeply nested CRDs](https://github.com/kubernetes/kubernetes/issues/91615).
This patch is being backported into older versions of `kubectl` as new patch releases soon, at time of writing this was not the case.
This bug will make `kubectl apply -f [...]` hang. 

This bug only happens if you try to re-apply the `v0.16` CRDs, initial upgrade will not cause any issues. If you have this issue please use the `v1.19.0-rc.2` version of `kubectl` to apply this.
*Note: cert-manager does not recommend to use this version to operate older Kubernetes clusters apart from applying the CRD updates.*
```console
# On Linux
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.19.0-rc.2/bin/linux/amd64/kubectl
# On macOS
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.19.0-rc.2/bin/linux/amd64/kubectl
$ chmod +x ./kubectl
$ ./kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.16.0/cert-manager.crds.yaml
# If you use the static manifest install
$ ./kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.16.0/cert-manager.yaml
```

### Helm
Helm users who use `installCRDs=true` should **not** upgrade to `v0.16` until a Helm version built upon Kubernetes `v1.19` is releases.
Current testing points out that this issue is only helm `v3.1+` which is affected but we do not advice right now to use `installCRDs=true` in `v0.16`.

From here on you can follow the [regular upgrade process](../).
