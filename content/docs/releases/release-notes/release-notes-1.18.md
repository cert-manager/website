---
title: Release 1.18
description: 'cert-manager release notes: cert-manager 1.18'
---

cert-manager v1.18 includes:

- TODO

## Major Themes

### Copy annotations from Ingress or Gateway to the Certificate

We've added a new configuration option to the cert-manager controller: `--extra-certificate-annotations`, which allows you to specify annotation keys to be copied from an Ingress or Gateway resource to the resulting Certificate object.
Read [Annotated Ingress resource: Copy annotations to the Certificate](../../usage/ingress.md#copy-annotations-to-the-certificate ), and
[Annotated Gateway resource: Copy annotations to the Certificate](../../usage/gateway.md#copy-annotations-to-the-certificate), to learn more.

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


## `v1.18.0`

### Feature

TODO

### Documentation

TODO

### Bug or Regression

TODO

### Other (Cleanup or Flake)

TODO
