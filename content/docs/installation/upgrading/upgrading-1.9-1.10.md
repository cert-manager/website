---
title: Upgrading from v1.9 to v1.10
description: 'cert-manager installation: Upgrading v1.9 to v1.10'
---

## On OpenShift the cert-manager Pods may fail until you modify Security Context Constraints

In cert-manager 1.10 the [secure computing (seccomp) profile](https://kubernetes.io/docs/tutorials/security/seccomp/) for all the Pods
is set to `RuntimeDefault`.
On some versions and configurations of OpenShift this can cause the Pod to be rejected by the
[Security Context Constraints admission webhook](https://docs.openshift.com/container-platform/4.10/authentication/managing-security-context-constraints.html#admission_configuring-internal-oauth).

> 📖 Read the [Breaking Changes section in the 1.10 release notes](../../release-notes/release-notes-1.10.md) before upgrading.

## Next Steps

From here on you can follow the [regular upgrade process](./README.md).
