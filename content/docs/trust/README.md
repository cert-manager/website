---
title: Trusting certificates
description: "Managing client trust stores"
---

:::danger

If you're using private CAs, clients need to know the CA to be able to connect to servers.

With cert-manager, `ca.crt` will likely contain the certificate you need to trust,
but __do not mount the same `Secret` as the server__ to access `ca.crt`.

This is because:

1. That `Secret` also contains the private key of the server, which should only be accessible to the server.
   You should use RBAC to ensure that the `Secret` containing the serving certificate and private key are only accessible to Pods that need it.
2. Rotating CA certificates safely relies on being able to have both the old and new CA certificates trusted at the same time. See [the FAQ](../faq/README.md#chain-cacrt) for more details.

:::

When configuring the client you should independently choose and fetch the CA certificates that you want to trust.
Download the CA out of band and store it in a `Secret` or `ConfigMap` separate from the `Secret` containing the server's private key and certificate.

[trust-manager](./trust-manager/README.md) can be used to manage these certificates and automatically distribute them to multiple namespaces.

This ensures that if the material in the `Secret` containing the server key and certificate is tampered with,
the client will fail to connect to the compromised server.

The same concept also applies when configuring a server for mutually-authenticated TLS;
don't give the server access to Secret containing the client certificate and private key.
