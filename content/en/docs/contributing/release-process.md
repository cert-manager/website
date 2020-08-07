---
title: "Release Process"
linkTitle: "Release Process"
weight: 70
type: "docs"
---

This document aims to outline the process that should be followed for cutting a
new release of cert-manager.

## Prerequisites

First ensure that you have all the tools and permissions required to perform a cert-manager release:

1. Install [Kubernetes Release Notes Generator](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md)
2. Install [cert-manager release tooling](https://github.com/cert-manager/release)
3. Get permission to use the "cert-manager-release" project in Google Cloud Platform.

## Minor releases

A minor release is a backwards-compatible 'feature' release.  It can contain new
features and bug fixes.

### Release schedule

We aim to cut a new minor release once per month. The rough goals for each
release are outlined as part of a GitHub milestone. We cut a release even if
some of these goals are missed, in order to keep up release velocity.

### Process

> Note: This process document is WIP and may be incomplete

The process for cutting a minor release is as follows:

1. Ensure upgrading document exists.

2. Create a new release branch (e.g. `release-0.5`)

3. Push it to the `jetstack/cert-manager` repository

4. [Create release notes](#release-notes)

Finally, create a new tag taken from the release branch, e.g.`v0.5.0`.

## Patch releases

A patch release contains critical bug fixes for the project.  They are managed on
an ad-hoc basis, and should only be required when critical bugs/regressions are
found in the release.

We will only perform patch release for the **current** version of cert-manager.

Once a new minor release has been cut, we will stop providing patches for the
version before it.

### Release schedule

Patch releases are cut on an ad-hoc basis, depending on recent activity on the
release branch.

### Process

> Note: This process document is WIP and may be incomplete

Bugs that need to be fixed in a patch release should be [cherry picked into the appropriate release branch](contributing-flow.md#cherry-picking).

The process for cutting a patch release is as follows:

1. Iterate on review feedback (hopefully this will be minimal) and submit
   changes to `master` of cert-manager, performing a rebase of release-x.y.

2. [Create release notes](#release-notes)

Finally, create a new tag taken from the release branch, e.g. `v0.5.1`.

## Release Notes

1. Download and install the latest version of [Kubernetes Release Notes Generator](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md).

2. Run as follows, substituting the current and last versions where appropriate:

```bash
export GITHUB_TOKEN=*your-token*
export RELEASE_VERSION=*x.y.z*
export BRANCH=*release-x.y*
export END_REV=*x.y.z*
export START_REV=*x.?.?*
$GOPATH/bin/release-notes --github-repo cert-manager --github-org jetstack --required-author "" --output release-notes.md
```

3. Add additional blurb, notable items and characterize change log.


