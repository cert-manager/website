---
title: "Release 1.8"
linkTitle: "v1.8"
weight: 760
type: "docs"
---

<!--

Regenerate the release notes with:

GITHUB_TOKEN=$(lpass show -p github.com) START_SHA="$(git rev-list --reverse --ancestry-path $(git merge-base v1.7.0 master)..master | head -1)" END_REV="master" BRANCH="master" RELEASE_VERSION="1.8.0" release-notes --repo-path=cert-manager --org=cert-manager --repo=cert-manager --required-author=jetstack-bot --output /tmp/release-notes-1.8.0.md

 -->
## v1.8.0

### Changelog since v1.7.0

#### Feature

- Changes cert-manager controllers and ACME clients to use new user agent format "cert-manager<component name>/<version> (<os>/<arch>)  cert-manager/<git commit>". Field managers now take the form of "cert-manager<component name>. ([#4773](https://github.com/cert-manager/cert-manager/pull/4773), [@JoshVanL](https://github.com/JoshVanL))

#### Design

- ACTION REQURIED: The import path for cert-manager has been updated to "github.com/cert-manager/cert-manager". If you import cert-manager as a go module (which isn't currently recommended), you'll need to update the module import path in your code to import cert-manager 1.8 or later. ([#4587](https://github.com/cert-manager/cert-manager/pull/4587), [@SgtCoDFish](https://github.com/SgtCoDFish))

#### Bug or Regression

- Fix: The alpha feature Certificate's `additionalOutputFormats` is now correctly validated at admission time, and no longer _only_ validated if the `privateKey` field of the Certificate is set. The Webhook component now contains a separate feature set. `AdditionalCertificateOutputFormats` feature gate (disabled by default) has been added to the webhook. This gate is required to be enabled on both the controller and webhook components in order to make use of the Certificate's `additionalOutputFormat` feature. ([#4814](https://github.com/cert-manager/cert-manager/pull/4814), [@JoshVanL](https://github.com/JoshVanL))
- Use multi-value records instead of simple records for the AWS Route53 ACME DNS challenge solver, to allow for multiple challenges for the same domain at the same time ([#4793](https://github.com/cert-manager/cert-manager/pull/4793), [@fvlaicu](https://github.com/fvlaicu))

#### Other (Cleanup or Flake)

- Cleanup: No longer log an error when cert-manager encounters a conflict in the secrets manager, in favour of always force applying. ([#4815](https://github.com/cert-manager/cert-manager/pull/4815), [@JoshVanL](https://github.com/JoshVanL))
