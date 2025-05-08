---
title: Release 1.18
description: 'cert-manager release notes: cert-manager 1.18'
---

cert-manager v1.18 includes:

- TODO

## Major Themes

### The default value of `Certificate.Spec.PrivateKey.RotationPolicy` is now `Always`

> ⚠️ Breaking change

We have changed the default value of `Certificate.Spec.PrivateKey.RotationPolicy` from `Never` to `Always`.

Why? Because the old default was unintuitive and insecure.
For example, if a private key is exposed, users may (reasonably) assume that
re-issuing a certificate (e.g. using `cmctl renew`) will generate a new private
key, but it won't unless the user has explicitly set `rotationPolicy: Always` on the Certificate resource.

This change is feature gated and is enabled by default, because it has been fast-tracked to beta status.

Users who want to preserve the old default have two options:
1. Explicitly set `rotationPolicy: Never` on your Certificate resources.
2. Turn off the feature gate in this release and explicitly set
   `rotationPolicy: Never` on your Certificates before release 1.19.
   In release 1.19, the feature will be marked as GA and it will no longer be
   possible to turn off the feature.

The following Helm chart values can be used to turn off the feature gate:

```yaml
# values.yaml
config:
  featureGates:
    DefaultPrivateKeyRotationPolicyAlways: false
```

> ℹ️ The old default value `Never` was always intended to be changed before API `v1`, as can be seen in the description of the [original PR](https://github.com/cert-manager/cert-manager/pull/2814):
> > For backward compatibility, the empty value is treated as 'Never' which matches the behavior we have today.
> > In a future API version, we can flip this default to be Always.
>
> 📖 See [Issue: 7601: Change `PrivateKey.RotationPolicy` to default to Always](https://github.com/cert-manager/cert-manager/issues/7601) to read the proposal for this change and the discussion around it.
>
> 📖 Read [cert-manager component configuration](../../installation/configuring-components.md) to learn more about feature gates.
>
> 📖 Read our updated [API compatibility statement](../../contributing/api-compatibility.md) which now reflects our new, more flexible, approach to changing API defaults, with a view to introducing other "sane" default API values in future releases.
>
> 📖 Read [Issuance behavior: Rotation of the private key](../../usage/certificate.md#issuance-behavior-rotation-of-the-private-key) to learn more about private key rotation in cert-manager.

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
