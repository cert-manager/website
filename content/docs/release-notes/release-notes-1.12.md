---
title: Release 1.12
description: 'cert-manager release notes: cert-manager 1.12'
---

## Major Themes

### Support for ephemeral service account tokens in Vault

cert-manager can now authenticate to Vault using ephemeral service account
tokens. cert-manager already knew to authenticate to Vault using the [Vault
Kubernetes Auth
Method](https://developer.hashicorp.com/vault/docs/auth/kubernetes) but relied
on insecure service account tokens stored in Secrets. You can now configure
cert-manager in a secretless manner. With this new feature, cert-manager will
create an ephemeral service account token on your behalf and use that to
authenticate to Vault.

> 📖 Read about [Secretless Authentication with a Service Account](../configuration/vault#secretless-authentication-with-a-service-account).
