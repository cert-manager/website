---
title: Configuration
description: cert-manager configuration
---

In order to configure cert-manager to begin issuing certificates, first
`Issuer` or `ClusterIssuer` resources must be created. These resources represent
a particular signing authority and detail how the certificate requests are going
to be honored. You can read more on the concept of `Issuers`
[here](../concepts/issuer.md).

cert-manager supports multiple issuer 'in-tree' types that are denoted by being
in the `cert-manager.io` group. cert-manager also supports external issuers than
can be installed into your cluster that belong to other groups. These external
issuer types behave no different and are treated equal to in tree issuer types.

## Supported Issuer Types