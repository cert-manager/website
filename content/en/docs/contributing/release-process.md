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

1. Install [Kubernetes Release Notes Generator](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md).
2. Install [cert-manager release tooling](https://github.com/cert-manager/release).
3. Get permission to use the "cert-manager-release" project in Google Cloud Platform.
4. You must have time to complete all the steps in the release process (~1 hour).
5. Install [Gcloud SDK / CLI](https://cloud.google.com/sdk/).
   [Run gcloud auth login](https://cloud.google.com/sdk/docs/authorizing#running_gcloud_auth_login).
6. Get a GitHub access token.
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

2. Create or update the release branch

    If this is the first (`alpha1`) release, then you will need to create the release branch:

    ```bash
    git fetch --all
    git checkout -b release-1.0 origin/master
    ```

    If there has already been an `alpha1` release, the release branch will already exist,
    so you will need to update it with the latest commits from the master branch, as follows:

    ```bash
    git fetch --all
    git branch --force release-1.0 origin/release-1.0
    git checkout release-1.0
    git merge --ff-only origin/master
    ```

3. Push it to the `jetstack/cert-manager` repository

    ```bash
    git push --set-upstream origin
    ```

4. [Create release notes](#release-notes)

    Sanity check the notes, checking that the notes contain details of all the features and bug fixes that you expect to be in the release.

5. Run `cmrel stage`

    In this example we stage a release using the 'release-1.0' branch,
    setting  the release version to `v1.0.0`:

    ```bash
    cmrel stage --branch=release-1.0 --release-version=v1.0.0
    ```

    This step takes ~10 minutes.
    It will build all Docker images and create all the manifest files and upload them to a storage bucket on Google Cloud.
    These artifacts will be published / released in the next steps.

    The final line of output contains URL of the bucket containing the release artifacts.
    The final segment in that URL contains the `RELEASE_NAME`, which you will need in the next step.

6. Run `cmrel publish`

   1. First do a dry-run, to ensure that all the staged resources are valid.

       ```bash
       cmrel publish --release-name <RELEASE_NAME>
       ```

        Where `<RELEASE_NAME>` is the unique build ID printed by the earlier `cmrel stage` command.
        E.g. Given `gs://cert-manager-release/stage/gcb/release/v1.0.0-219b7934ac499c7818526597cf635a922bddd22e`,
        the `RELEASE_NAME` would be `v1.0.0-219b7934ac499c7818526597cf635a922bddd22e`.

        You can view the progress by clicking the Google Cloud Build URL in the output of this command.

   2. Next publish the release artifacts for real.

        If the last step succeeded, you can now re-run the `cmrel publish` with the `--nomock` argument to actually publish the release artifacts to GitHub, `Quay.io`, [Helm Hub] etc.

       ```bash
       cmrel publish --nomock --release-name <RELEASE_NAME>
       ```

        NOTE: At this stage there will be a draft release on GitHub and a live release on [Helm Hub].
        So you must now complete the release process quickly otherwise users of the latest release on [Helm Hub] will encounter errors,
        because the manual CRD install URL will not be available yet.

7. Publish the GitHub release

   1. Visit the draft GitHub release and paste in the release notes that you generated earlier.

        You will need to manually edit the content to match the style of earlier releases.
        In particular:

       * Remove package related changes
       * Replace links to `@jetstack-bot`, in cherry-pick PRs, with links to the GitHub handle of the author of the original PR.

   2. Click "publish" to make the GitHub release live.
      This will create a Git tag automatically.

8. Finally post a link to the release tag to all cert-manager channels on Slack.

    E.g. `https://github.com/jetstack/cert-manager/releases/tag/v1.0.0 :tada:`

### Final Release

After releasing one or more alpha and beta releases,
you will release the final version.
For the final release, you should follow the process described above with the following changes and additional steps:

#### Full Release notes

The release notes for the final release should include all changes since the last minor release.

#### Rollover testing infra

After releasing the final release you will need to update the testing infrastructure,
so that it uses the latest release as `release-previous`,
and you will need to create a new release branch in the cert-manager repository which will be treated as `release-next`,
and both these branches will be tested periodically.

For example see the PR  [Prepare testing for the cert-manager `v1.0` release](https://github.com/jetstack/testing/pull/397).

#### Rollover documentation

You will also need to update the versions and branches in the cert-manager website configuration.

For example see the PR [Configure website for the `v1.0` release](https://github.com/cert-manager/website/pull/309).

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

    Bugs that need to be fixed in a patch release should be [cherry picked into the appropriate release branch](../contributing-flow/#cherry-picking).

2. [Create release notes](#release-notes)

    Sanity check the notes, checking that the notes contain details of all the PRs that have been cherry-picked into the release branch.

3. Run `cmrel stage`

    In this example we stage a release using the 'release-1.0' branch,
    setting the release version to `v1.0.2`:

    ```bash
    cmrel stage --branch=release-1.0 --release-version=v1.0.2
    ```

    NOTE: This step takes ~10 minutes.
    It will build all Docker images and create all the manifest files and upload them to a storage bucket on Google Cloud.
    These artifacts will be published / released in the next steps.

    The final line of output contains URL of the bucket containing the release artifacts.
    The final segment in that URL contains the `RELEASE_NAME`, which you will need in the next step.

4. Run `cmrel publish`

   1. First do a dry-run, to ensure that all the staged resources are valid.

       ```bash
       cmrel publish --release-name <RELEASE_NAME>
       ```

        Where `<RELEASE_NAME>` is the unique build ID printed by the earlier `cmrel stage` command.
        E.g. Given `gs://cert-manager-release/stage/gcb/release/v1.0.2-219b7934ac499c7818526597cf635a922bddd22e`,
        the `RELEASE_NAME` would be `v1.0.2-219b7934ac499c7818526597cf635a922bddd22e`.

        You can view the progress by clicking the Google Cloud Build URL in the output of this command.

   2. Next publish the release artifacts for real.

        If the last step succeeded, you can now re-run the `cmrel publish` with the `--nomock` argument
        to actually publish the release artifacts to GitHub, `Quay.io`, [Helm Hub] etc.

        ```bash
        cmrel publish --nomock --release-name <RELEASE_NAME>
        ```

        NOTE: At this stage there will be a draft release on GitHub and a live release on [Helm Hub].
        So you must now complete the release process quickly otherwise users of the latest release on [Helm Hub] will encounter errors,
        because the manual CRD install URL will not be available yet.

5. Publish the GitHub release

   1. Visit the draft GitHub release and paste in the release notes that you generated earlier.

        You will need to manually edit the content to match the style of earlier releases.
      In particular:

      * Remove package related changes
      * Replace links to `@jetstack-bot`, in cherry-pick PRs, with links to the GitHub handle of the author of the original PR.

   2. Click "publish" to make the GitHub release live.
      This will create a Git tag automatically.

6. Finally post a link to the release tag to all cert-manager channels on Slack.

    E.g. `https://github.com/jetstack/cert-manager/releases/tag/v1.0.2 :tada:`

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

    NOTE: The GitHub token needs read-only permission to the cert-manager repository. 
    The token is required only to avoid rate-limits imposed on anonymous API users.

3. Add additional blurb, notable items and characterize change log.

## Links

 [Helm Hub]: https://charts.jetstack.io
