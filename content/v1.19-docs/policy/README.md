---
title: Policy
description: 'Rules for guiding certificate self-service.'
---

![issuance flow: policy](/images/issuance-flow-policy.png)

To scale certificate management, it is critical to distribute the responsibility of
managing certificates to the teams that need them. To do this effectively, often a
self-service model is used, teams are considered "customers" of a platform team that
provides the Kubernetes infrastructure (including certificate management). This multi-tenant
model removes the bottleneck of a single team managing certificates for everyone.

However, to be successful, the platform team should guide its customers to follow best
practices, and ensure that certificates are issued in a secure and consistent way. These
best practices and rules are what we call "policy". Currently, cert-manager distinguishes
between three types of policy:
- [Defaulting Policy](defaulting.md): Defining defaults for Certificate properties.
- [Approval Policy](approval): Restricting who can request which certificates.
- [Issuing Policy](issuing.md): Configuring how requests are mapped to Certificates.
