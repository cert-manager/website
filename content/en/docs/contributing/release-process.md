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
4. You must have time to complete all the steps in the release process (~1h).

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

4. Run `cmrel stage`

To stage a release of the 'release-1.0' branch to the default staging bucket,
overriding the release version as 'v1.0.0':

```#bash
 cmrel stage --git-ref=release-1.0 --release-version=v1.0.0
```

4. [Create release notes](#release-notes)

5. Run `cmrel publish`

5.1. First do a dry-run, to ensure that all the staged resources are valid.

```
cmrel publish --release-name <RELEASE_NAME>
```
Where `<RELEASE_NAME>` is the unique build ID printed by the earlier `cmrel stage` command.

5.2 Next publish the release artifacts for real

If the last step succeeded, you can now re-run the `cmrel publish` with the `--nomock` argument to actually publish the release articacts to Github, quay.io, helm hub etc.

```
cmrel publish --nomock --release-name <RELEASE_NAME>
```

NOTE: At this stage there will be a draft release on Github and a live release on HelmHub.
So you must now complete the release process quickly otherwise users of the latest release on HelmHub will encounter errors.

6. Publish the GitHub release

6.1 Visit the draft GithHub release and paste in the release notes that you generated earlier.
6.2 Click "publish" to make the GitHub release live.

7. Finally, create a new tag taken from the release branch, e.g.`v0.5.0`.

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

1. Run `cmrel stage`

To stage a release of the 'release-0.16' branch to the default staging bucket,
overriding the release version as 'v0.16.1':

```#bash
 cmrel stage --git-ref=release-0.16 --release-version=v0.16.1
```

2. [Create release notes](#release-notes)

3. Run `cmrel publish`

3.1. First do a dry-run, to ensure that all the staged resources are valid.

```
cmrel publish --release-name <RELEASE_NAME>
```
Where `<RELEASE_NAME>` is the unique build ID printed by the earlier `cmrel stage` command.

3.2 Next publish the release artifacts for real

If the last step succeeded, you can now re-run the `cmrel publish` with the `--nomock` argument to actually publish the release articacts to Github, quay.io, helm hub etc.

```
cmrel publish --nomock --release-name <RELEASE_NAME>
```

NOTE: At this stage there will be a draft release on Github and a live release on HelmHub.
So you must now complete the release process quickly otherwise users of the latest release on HelmHub will encounter errors.

4. Publish the GitHub release

4.1 Visit the draft GithHub release and paste in the release notes that you generated earlier.
4.2 Click "publish" to make the GitHub release live.

5. Finally, create a new tag taken from the release branch, e.g. `v0.5.1`.

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


