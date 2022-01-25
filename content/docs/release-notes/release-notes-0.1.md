---
title: Release Notes
description: >-
  This is the first release of cert-manager. It is currently still not in a
  production ready state, and features are subject to change.
---

This is the first release of cert-manager. It is currently still not in a
production ready state, and features are subject to change.

Notable features:

- _Automated certificate renewal_
- _ACME DNS01 challenge mechanism_
  - CloudDNS
  - Route53
  - CloudFlare
- _ACME HTTP01 challenge mechanism_
  - Should be compatible with all ingress controllers following ingress spec
    (GCE & NGINX tested)
- _Simple CA based issuance_
  - Create an Issuer that references a Secret resource containing a signing key
    pair, and issue/renew certificates from that.
- _Cluster-wide issuers (aka `ClusterIssuer`)_
- _Backed by CRDs_
  - Events logged to the Kubernetes API
  - Status block utilized to store additional state about resources

Please check the [README(https://github.com/jetstack-experimental/cert-manager)
for a quick-start guide.

We really value any feedback and contributions to the project. If you'd like to
get involved, please open some issues, comment or pick something up and get
started!
