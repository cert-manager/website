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
5. Install [Gcloud SDK / CLI](https://cloud.google.com/sdk/)
5.1. [Run gcloud auth login](https://cloud.google.com/sdk/docs/authorizing#running_gcloud_auth_login)
6. Get a GitHub access token 
   Go to your GitHub profile page and set up a token. 
   It does not need any privileges. 
   It is used only by the release-notes tool to avoid API rate limiting.

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
   (not necessary for alpha releases)

2. Fast forward the release branch to master (e.g. `release-0.5`)

git merge --ff-only origin/master

3. Push it to the `jetstack/cert-manager` repository

git push --set-upstream origin

4. Run `cmrel stage`

To stage a release of the 'release-1.0' branch to the default staging bucket,
overriding the release version as 'v1.0.0':

```#bash
cmrel stage --branch=release-1.0 --release-version=v1.0.0
```

Look for a build URL and visit it in Google Cloud Console.

5. Run `cmrel publish`

5.1. First do a dry-run, to ensure that all the staged resources are valid.

```
cmrel publish --release-name <RELEASE_NAME>
```

You can view the progress by clicking the Google Cloud Build URL in the output of this command.

5.2 Next publish the release artifacts for real

If the last step succeeded, you can now re-run the `cmrel publish` with the `--nomock` argument to actually publish the release articacts to Github, quay.io, helm hub etc.

```
cmrel publish --nomock --release-name <RELEASE_NAME>
```

NOTE: At this stage there will be a draft release on Github and a live release on HelmHub.
So you must now complete the release process quickly otherwise users of the latest release on HelmHub will encounter errors.

4. [Create release notes](#release-notes)


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

The process for cutting a patch release is as follows:

1. Ensure that all PRs have been cherry-picked into the release branch.

Bugs that need to be fixed in a patch release should be [cherry picked into the appropriate release branch](contributing-flow.md#cherry-picking).

2. [Create release notes](#release-notes)

Sanity check the notes, checking that the notes contain details of all the PRs that have been cherry-picked into the release branch.

3. Run `cmrel stage`

To stage a release of the 'release-1.0' branch to the default staging bucket,
overriding the release version as 'v1.0.2':

```#bash
cmrel stage --branch=release-1.0 --release-version=v1.0.2
```

This step takes ~10 minutes.
It will build all Docker images and create all the manifest files and upload them to a storage bucket on Google Cloud.
These artifacts will be published / released in the next steps.

The final line of output contains URL of the bucket containing the release artifacts.
The final segment in that URL contains the RELEASE_NAME, which you will need in the next step.

3. Run `cmrel publish`

3.1. First do a dry-run, to ensure that all the staged resources are valid.

```
cmrel publish --release-name <RELEASE_NAME>
```
Where `<RELEASE_NAME>` is the unique build ID printed by the earlier `cmrel stage` command.
E.g. Given gs://cert-manager-release/stage/gcb/release/v1.0.2-219b7934ac499c7818526597cf635a922bddd22e, 
the RELEASE_NAME would be v1.0.2-219b7934ac499c7818526597cf635a922bddd22e.

3.2 Next publish the release artifacts for real

If the last step succeeded, you can now re-run the `cmrel publish` with the `--nomock` argument to actually publish the release articacts to Github, quay.io, helm hub etc.

```
cmrel publish --nomock --release-name <RELEASE_NAME>
```

NOTE: At this stage there will be a draft release on Github and a live release on HelmHub.
So you must now complete the release process quickly otherwise users of the latest release on HelmHub will encounter errors.

4. Publish the GitHub release

4.1 Visit the draft GithHub release and paste in the release notes that you generated earlier.

You will need to manually edit the content to match the style of earlier releases.
In particular:
 * Remove package related changes
 * Replace links to @jetstack-bot, in cherry-pick PRs, with links to the GitHub handle of the author of the original PR.

4.2 Click "publish" to make the GitHub release live.

This will create a Git tag automatically.

5. Finally post a link to the release tag to all cert-manager channels on Slack

E.g. https://github.com/jetstack/cert-manager/releases/tag/v1.0.2 :tada:

## Release Notes

1. Download and install the latest version of [Kubernetes Release Notes Generator](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md).

2. Run as follows, substituting the current and last versions where appropriate:

```bash
export GITHUB_TOKEN=*your-token*
export RELEASE_VERSION=1.0.0
export BRANCH=release-1.0
export END_REV=release-1.0
export START_REV=v0.16.1
$GOPATH/bin/release-notes --github-repo cert-manager --github-org jetstack --required-author "jetstack-bot" --output release-notes.md
```

NOTE: The GitHub token needs only readonly permission to the cert-manager repository. 
The token is required only to avoid rate-limits imposed on anonymous API users.

3. Add additional blurb, notable items and characterize change log.



## Final Release

* Same as alpha beta release, but also
* Release notes back to last minor release

### Rollover testing infra
* Remove last release (0.16.x)
* Make release-1.0 the last release
    * Copy release-next > release-previous
* Make PR
* Before merging, 
    * Create new release branches in cert-manager and website repos
* https://github.com/jetstack/testing/pull/397
### Rollover documentation

* Merge master into release-next
* Merge release-next into master
* https://github.com/cert-manager/website/pull/309
