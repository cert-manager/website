---
title: Upgrading from v0.15 to v0.16
description: 'cert-manager installation: Upgrading v0.15 to v0.16'
---

## Issue with older versions of `kubectl`
`kubectl` versions with patch versions lower than `v1.18.8` `v1.17.11` or `v1.16.14` have issues updating the `v0.16` CRD files, due to [a bug when handling deeply nested CRDs](https://github.com/kubernetes/kubernetes/issues/91615).
This bug will make `kubectl apply -f [...]` hang. 

This bug only happens during a re-apply of the v0.16 CRDs. Initial upgrade does not cause issues. If you have this issue please upgrade your `kubectl` to the latest patch release.
Versions of `kubectl` of `v1.15.x` or below are not being supported anymore as these are unsupported by the Kubernetes community.

### Helm
Helm users who use `installCRDs=true` MUST upgrade to Helm `v3.3.1` before upgrading.

From here on you can follow the [regular upgrade process](./README.md).