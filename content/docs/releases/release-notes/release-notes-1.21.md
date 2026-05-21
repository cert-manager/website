---
title: Release 1.21
description: 'cert-manager release notes: cert-manager 1.21'
---

cert-manager v1.21 includes:

- TODO

## Major Themes

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

TODO
