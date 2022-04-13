---
title: Release Notes
description: 'cert-manager release notes: cert-manager v0.1'
---

This is the first release of cert-manager. It is currently still not in a production ready state, and features are subject to change.

Notable features:

- *Automated certificate renewal*
- *ACME DNS01 challenge mechanism*
  - CloudDNS
  - Route53
  - CloudFlare
- *ACME HTTP01 challenge mechanism*
  - Should be compatible with all ingress controllers following ingress spec (GCE & NGINX tested)
- *Simple CA based issuance*
  - Create an Issuer that references a Secret resource containing a signing key pair, and issue/renew certificates from that.
- *Cluster-wide issuers (aka `ClusterIssuer`)*
- *Backed by CRDs*
  - Events logged to the Kubernetes API
  - Status block utilized to store additional state about resources

Please check the [README(https://github.com/jetstack-experimental/cert-manager) for a quick-start guide.

We really value any feedback and contributions to the project. If you'd like to get involved, please open some issues, comment or pick something up and get started!