---
title: "Release Process"
linkTitle: "Release Process"
weight: 70
type: "docs"
---

This document aims to outline the process that should be followed for cutting a
new release of cert-manager.

## Prerequisites

First ensure that you have all the tools and permissions required to
perform a cert-manager release:

1. Install the [`release-notes`](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md) CLI:
   ```sh
   (cd && GO111MODULE=on go get k8s.io/release/cmd/release-notes@latest)
   ```
2. Install our [`cmrel`](https://github.com/cert-manager/release) CLI:
   ```sh
   (cd && GO111MODULE=on go get github.com/cert-manager/release/cmd/cmrel@latest)
   ```
3. Make sure you are granted these roles on the GCP project [cert-manager-release](https://console.cloud.google.com/?project=cert-manager-release):

   - "Cloud Build Editor" (`roles/cloudbuild.builds.builder`),
   - "Storage Object Viewer" (`roles/storage.objectViewer`), and
   - "Cloud KMS CryptoKey Encrypter" `roles/cloudkms.cryptoKeyEncrypter`.

   As a quick check, check that you can open [this Cloud
   Build](https://console.cloud.google.com/cloud-build?project=cert-manager-release)
   page.
4. You must have time to complete all the steps in the release process (~1 hour).
5. Install the [`gcloud`](https://cloud.google.com/sdk/) CLI.
6. [Login](https://cloud.google.com/sdk/docs/authorizing#running_gcloud_auth_login)
   to `gcloud`:

   ```sh
   gcloud auth application-default login
   ```

7. Make sure `gcloud` points to the cert-manager-release project:

   ```sh
   gcloud config set project cert-manager-release
   ```

8. Get a GitHub access token [here](https://github.com/settings/tokens)
   with the `public_repo` scope. It is used only by the `release-notes` CLI
   to avoid API rate limiting.

## Minor releases

A minor release is a backwards-compatible 'feature' release.  It can contain new
features and bug fixes.

### Release schedule

We aim to cut a new minor release once per month. The rough goals for each
release are outlined as part of a GitHub milestone. We cut a release even if
some of these goals are missed, in order to keep up release velocity.

### Process for releasing a minor version

> Note: please click on the "Edit this page" button on the top-right corner
> of this page if a step is missing or if it is outdated.

The process for cutting a minor release is as follows:

1. Ensure upgrading document exists. See for example, see
   [upgrading-1.0-1.1](https://cert-manager.io/docs/installation/upgrading/upgrading-1.0-1.1/)
   (not necessary for alpha and patch releases)

2. Create or update the release branch

   If this is the first alpha release (`alpha.0`), then you will need to create
   the release branch:

   ```bash
   git fetch --all
   git checkout -b release-1.0 origin/master
   ```

   If there has already been an alpha release, the release branch will
   already exist, so you will need to update it with the latest commits
   from the master branch, as follows:

   ```bash
   git fetch --all
   git branch --force release-1.0 origin/release-1.0
   git checkout release-1.0
   git merge --ff-only origin/master
   ```

3. Push it to the `jetstack/cert-manager` repository

   > Note: make sure that the `origin` remote points to the upstream <https://github.com/jetstack/cert-manager.git> with `git remote -v`.

   > Note 2: uou need to be an "admin" of the GitHub project to be able to
   > push to the release branch.

   ```bash
   git push --set-upstream origin
   ```

4. [Generate and edit the release notes](#generating-and-editing-the-release-notes)

5. Run `cmrel stage`

   1. In this example we stage a release using the 'release-1.0' branch,
      setting  the release version to `v1.0.0`:

      ```bash
      cmrel stage --branch=release-1.0 --release-version=v1.0.0
      ```

      This step takes ~10 minutes. It will build all Docker images and
      create all the manifest files and upload them to a storage bucket on
      Google Cloud. These artifacts will be published and released in the
      next steps.

      The final line of output contains URL of the bucket
      containing the release artifacts. The final segment in that URL
      contains the `RELEASE_NAME`, which you will need in the next step.

   2. While the build is running, send a first Slack message to
      `#cert-manager-dev`:

      > Releasing `1.2.0-alpha.2` 🧵

      ⚠️ Please have a quick look at the build log as it might contain some
      unredacted data that we forgot to redact. We try to make sure the
      sensitive data is properly redacted but sometimes we forget to update
      this.

   3. Send a second Slack message in reply to this first message with the
      Cloud Build job link that `cmrel` displayed in "View logs at". For
      example, the message would look like:

      > Stage step: <https://console.cloud.google.com/cloud-build/builds/7641734d-fc3c-42e7-9e4c-85bfc4d1d547?project=1021342095237>

6. Run `cmrel publish`

   1. First do a dry-run, to ensure that all the staged resources are valid.

       ```bash
       cmrel publish --release-name <RELEASE_NAME>
       ```

        Where `<RELEASE_NAME>` is the unique build ID printed by the earlier `cmrel stage` command.
        E.g. Given `gs://cert-manager-release/stage/gcb/release/v1.0.0-219b7934ac499c7818526597cf635a922bddd22e`,
        the `RELEASE_NAME` would be `v1.0.0-219b7934ac499c7818526597cf635a922bddd22e`.

        You can view the progress by clicking the Google Cloud Build URL in the output of this command.

   2. While the build is running, send a third Slack message in reply to
      the first message:

      > Publish dry-run step: <https://console.cloud.google.com/cloud-build/builds/16f6f875-0a23-4fff-b24d-3de0af207463?project=1021342095237>

   3. Next publish the release artifacts for real.

      If the last step succeeded, you can now re-run the `cmrel publish`
      with the `--nomock` argument to actually publish the release
      artifacts to GitHub, `Quay.io`, [ArtifactHub][] etc.

      ```bash
      cmrel publish --nomock --release-name <RELEASE_NAME>
      ```

      NOTE: At this stage there will be a draft release on GitHub and a
      live release on [ArtifactHub][]. So you must now complete the release
      process quickly otherwise users of the latest release on
      [ArtifactHub][] will encounter errors, because the manual CRD install
      URL will not be available yet.

   4. While the build is running, send a fourth Slack message in reply to
      the first message:

      > Publish step: <https://console.cloud.google.com/cloud-build/builds/b6fef12b-2e81-4486-9f1f-d00592351789?project=1021342095237>

7. Publish the GitHub release

   1. Visit the draft GitHub release and paste in the release notes that you generated earlier.

      You will need to manually edit the content to match the style of earlier releases.
      In particular, remember to remove package-related changes.

   2. Tick the box "This is a pre-release" if your release is an alpha.
      (not necessary for final releases)

   3. Click "publish" to make the GitHub release live.
      This will create a Git tag automatically.

8. Finally, post a Slack message as an answer to the first message. Toggle
   the check box "Also send to `#cert-manager-dev`" so that the message is
   well visible. Also cross-post the message on `#cert-manager`.

   > <https://github.com/jetstack/cert-manager/releases/tag/v1.0.0> 🎉

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

### Process for releasing a patch version

The process for cutting a patch release is as follows:

1. Ensure that all PRs have been cherry-picked into the release branch, e.g. `release-1.0`

   Bugs that need to be fixed in a patch release should be [cherry picked into the appropriate release branch](../contributing-flow/#cherry-picking).

2. Then, continue with the instructions in [process for releasing a minor version](#process-for-releasing-a-minor-version).

## Generating and editing the release notes

1. Run as follows, substituting the current and last versions where appropriate:

    ```bash
    export GITHUB_TOKEN=*your-token*
    export RELEASE_VERSION=1.0.0
    export BRANCH=release-1.0
    export END_REV=release-1.0
    export START_REV=v0.16.1
    release-notes --github-repo cert-manager --github-org jetstack --required-author "jetstack-bot" --output release-notes.md
    ```

    > Note: the GitHub token needs the `public_repo` scope. The token is
    required only to avoid rate-limits imposed on anonymous API users.

2. Sanity check the notes, checking that the notes contain details of all
   the features and bug fixes that you expect to be in the release. Add
   additional blurb, notable items and characterize change log.

   You can see the commits that will go into this release by using the
   [GitHub compare](https://github.com/jetstack/cert-manager/compare). For
   example, while releasing `v1.0.0`, you want to compare it with the
   latest pre-released version `v1.0.0-beta.1`:

   > <https://github.com/jetstack/cert-manager/compare/v1.0.0-beta.1...master>

## Links

 [ArtifactHub]: https://charts.jetstack.io
