---
title: Release 1.21
description: 'cert-manager release notes: cert-manager 1.21'
---

cert-manager v1.21 includes:

- Removal of the default `tokenrequest` RBAC from the Helm chart (breaking change)

## Major Themes

### Default `tokenrequest` RBAC removed from Helm chart

> ⚠️ Breaking change

The Helm chart no longer creates a default `Role` and `RoleBinding` granting
the cert-manager controller permission to create tokens for its own
ServiceAccount (`serviceaccounts/token: create`).

This RBAC was added in v1.16
([cert-manager/cert-manager#7213](https://github.com/cert-manager/cert-manager/pull/7213))
to support a "Using the cert-manager ServiceAccount" section in the Route53
documentation. That docs section was subsequently removed
([cert-manager/website#1555](https://github.com/cert-manager/website/pull/1555))
when the Route53 page was restructured, and no documented workflow — Route53
IRSA ambient, Vault Kubernetes auth, or any other issuer — requires the
controller to mint tokens for its own ServiceAccount.

If you use `serviceAccountRef.name` pointing at the controller ServiceAccount,
you must now either:

- create your own `Role` and `RoleBinding` granting
  `serviceaccounts/token: create` on that ServiceAccount, or
- migrate to a dedicated ServiceAccount with its own RBAC (recommended — see
  the [Vault](../../configuration/vault.md) or
  [Route53](../../configuration/acme/dns01/route53.md) documentation).

Credit to **@everping** and **@kodareef5** for independently identifying (via
privately reported security advisories) that this default RBAC widened the trust
boundary beyond what cert-manager's published
[threat model](../../devops-tips/threat-modelling.md) documents.

### Skip the self-check with `waitInsteadOfSelfCheck`

cert-manager 1.21 adds the `waitInsteadOfSelfCheck` solver option for ACME
HTTP01 and DNS01 challenges. When set, cert-manager skips its own self-check
and instead waits the configured duration after presentation before asking the
ACME server to validate. This is an escape hatch for environments where
cert-manager cannot reliably observe the same validation path as the ACME
server, such as split-horizon DNS or NAT loopback (or hairpinning).

See [Skip the self-check with
`waitInsteadOfSelfCheck`](../../configuration/acme/README.md#skip-the-self-check-with-waitinsteadofselfcheck)
for configuration details.

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:

- TODO

for their contributions, comments and support!

Also, thanks to the cert-manager maintainer team for their help in this release:

- [@inteon](https://github.com/inteon)
- [@erikgb](https://github.com/erikgb)
- [@SgtCoDFish](https://github.com/SgtCoDFish)
- [@ThatsMrTalbot](https://github.com/ThatsMrTalbot)
- [@munnerz](https://github.com/munnerz)
- [@maelvls](https://github.com/maelvls)

And finally, thanks to the cert-manager steering committee for their feedback in this release cycle:

- [@FlorianLiebhart](https://github.com/FlorianLiebhart)
- [@ssyno](https://github.com/ssyno)
- [@ianarsenault](https://github.com/ianarsenault)
- [@TrilokGeer](https://github.com/TrilokGeer)

## `v1.21.0`

### Feature

- Add the `waitInsteadOfSelfCheck` solver option for ACME HTTP01 and DNS01 challenges, allowing cert-manager to skip its own self-check and ask the ACME server to validate after a configured wait. See the [ACME issuer documentation](../../configuration/acme/README.md#skip-the-self-check-with-waitinsteadofselfcheck) for configuration details.

### Documentation

TODO

### Bug or Regression

TODO

### Other (Cleanup or Flake)

- Removed the default `tokenrequest` Role and RoleBinding from the Helm chart
  that granted the controller ServiceAccount permission to mint tokens for
  itself. No documented workflow requires this RBAC. Users who relied on the
  undocumented pattern of pointing `serviceAccountRef.name` at the controller
  ServiceAccount must create their own Role and RoleBinding, or migrate to a
  dedicated ServiceAccount. See the
  [upgrading notes](../upgrading/upgrading-1.20-1.21.md) for details.
  ([cert-manager/cert-manager#8931](https://github.com/cert-manager/cert-manager/pull/8931),
  [@wallrj-cyberark](https://github.com/wallrj-cyberark))
