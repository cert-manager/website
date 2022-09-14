---
title: Issuer Configuration
description: |
    Learn how to configure cert-manager using Issuer and ClusterIssuer resources
---

Learn how to configure cert-manager using Issuer and ClusterIssuer resources.

## Overview

The first thing you'll need to configure after you've installed cert-manager is an `Issuer` or a `ClusterIssuer`.
These are resources that represent certificate authorities (CAs)
able to sign certificates in response to certificate signing requests.

This section documents how the different issuer types can be configured. You might want to
[read more about `Issuer` and `ClusterIssuer` resources](../concepts/issuer.md).

cert-manager comes with a number of built-in certificate issuers which are denoted by being in
the `cert-manager.io` group. You can also install external issuers in addition to the built-in types.
Built-in and external issuers are treated the same and are configured similarly.

## ACME / Let's Encrypt

Learn how to use the ACME Issuer / ClusterIssuer fields to configure how cert-manager connects to Let's Encrypt
or any ACME compliant certificate authority.

📖 Read the [ACME / Let's Encrypt Issuer section](./acme/README.md).

## SelfSigned

Learn about the SelfSigned Issuer which is useful for bootstrapping a root certificate for custom Public Key Infrastructure,
or for creating simple ad-hoc certificates.

📖 Read the [SelfSigned Issuer section](./selfsigned.md).

## CA

Learn about the CA Issuer which generates a Certificate Authority whose certificate and
private key are stored inside the cluster as a Kubernetes `Secret`.

📖 Read the [CA Issuer section](./ca.md).

## Vault

Learn about the Vault Issuer which signs certificates using HashiCorp Vault.

📖 Read the [Vault Issuer section](./vault.md).

## Venafi

Learn about the Venafi Issuer which signs certificates using Venafi TPP or Venafi-as-a-Service.

📖 Read the [Venafi Issuer section](./venafi.md).


## External

Learn about external issuers which are extensions for cert-manager and allow it to get signed certificates from a variety of other certificate authorities.

📖 Read the [External Issuer section](./external.md).

## Cluster Resource Namespace

When using `ClusterIssuer` resource types, ensure you understand the purpose of the
Cluster Resource Namespace; this can be a common source
of issues for people getting started with cert-manager.

The `ClusterIssuer` resource is cluster scoped. This means that when referencing
a secret via the `secretName` field, secrets will be looked for in the `Cluster
Resource Namespace`. By default, this namespace is `cert-manager` however it can be
changed via a flag on the cert-manager-controller component:

```bash
--cluster-resource-namespace=my-namespace
```
