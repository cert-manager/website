---
title: Configuration
description: |
    Learn about how to configure cert-manager using Issuer, ClusterIssuer and Certificate resources.
---

Learn about how to configure cert-manager using Issuer, ClusterIssuer and Certificate resources.

## Overview

After installing cert-manager you will find that some new resource types have been added to the Kubernetes API server
such as `Issuer`, `ClusterIssuer`, and `Certificate`.
They all have `metadata`, `spec` and `status` fields, just like other Kubernetes resources.

You can create them by writing the content to a YAML file and using `kubectl apply` to send them to the Kubernetes API server.
Whenever you create or update one of these resources cert-manager will react;
it will do some work and it will update the status with information about what it has done.

Here is an overview of each of these resources explaining when you should create them and what cert-manager will do in each case.

## Issuer / ClusterIssuer Resources

The first thing you'll need to configure after you've installed cert-manager is an `Issuer` or a `ClusterIssuer`.
These are resources that represent certificate authorities (CAs)
which are able to sign certificates in response to certificate signing requests.

📖 [Learn more about Issuer and ClusterIssuer resources](issuer-and-clusterissuer-resources/README.md).


## Certificate Resources

Next you'll probably want to create a Certificate.
This resource represents a desired X.509 certificate which will be signed and renewed before it expires.
The private key and signed certificate will be stored in a Secret which you can then mount in to a Pod or use in an Ingress resource.

📖 [Learn more about Certificate resources](certificate-resources.md).
