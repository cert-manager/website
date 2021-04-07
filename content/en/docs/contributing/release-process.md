---
title: "Release Process"
linkTitle: "Release Process"
weight: 70
type: "docs"
---

This document aims to outline the process that should be followed for cutting a
new release of cert-manager.

## Prerequisites

<!--
About "alert" and "pageinfo": https://www.docsy.dev/docs/adding-content/shortcodes/#shortcode-helpers
-->

{{% pageinfo color="warning" %}}

⛔️ Do not proceed with the release process if you do not meet all of the
following conditions:

1. The release process **takes about 40 minutes**. You must have time to
   complete all the steps.
2. You currently need to be at Jetstack to get the required GitHub and GCP
   permissions. (we'd like contributors outside Jetstack to be able to get
   access; if that's of interest to you, please let us know)
3. You need to have the GitHub `write` permission on the cert-manager project.
   To check that you have the `write` role, [get a personal access
   token](https://github.com/settings/tokens) and run:
     ```sh
     GH_USER=maelvls
     curl -sH "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/jetstack/cert-manager/collaborators/$GH_USER/permission
     ```
     If your permission is `write` or `admin`, then you are good to go:
     ```json
     {
      "permission": "write",
      "user": {...}
     }
     ```

    To request the `write` permission on the cert-manager project, [open a
   PR](https://github.com/jetstack/platform-board/pulls/new) with a link to
   here.
4. You need to be added as an "Editor" to the GCP project
   [cert-manager-release](https://console.cloud.google.com/?project=cert-manager-release).
   To check if you do have access, try opening [the Cloud Build
   page](https://console.cloud.google.com/cloud-build?project=cert-manager-release).
   To get the "Editor" permission on the GCP project, open a [new
   PR](https://github.com/jetstack/platform-board/pulls/new) and copy-paste the
   below example template:
   ```markdown
   <!-- PR title: Access to the cert-manager-release GCP project -->

   Hi,

   As stated in step 4 under "Prerequisites" on the [release-process][1] page,
   I need access to the [cert-manager-release][2] project on GCP.

   I need to be an "Editor" on this project. More specifically, the roles
   I need are:

   - Cloud Build Editor (`roles/cloudbuild.builds.builder`),
   - Storage Object Viewer (`roles/storage.objectViewer`), and
   - Cloud KMS CryptoKey Encrypter (`roles/cloudkms.cryptoKeyEncrypter`)

   Thanks!

   [1]: https://cert-manager.io/docs/contributing/release-process/#prerequisites
   [2]: https://console.cloud.google.com/?project=cert-manager-release
   ```

{{% /pageinfo %}}

First, ensure that you have all the tools required to perform a cert-manager
release:

1. Install the [`release-notes`](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md) CLI:
   ```sh
   go install k8s.io/release/cmd/release-notes@v0.7.0
   ```
2. Install our [`cmrel`](https://github.com/cert-manager/release) CLI:
   ```sh
   go install github.com/cert-manager/release/cmd/cmrel@master
   ```
3. Clone and `cd` into the `cert-manager/release` repo. ⚠️ All the commands
   below have to be run from this  cloned folder as it contains the
   necessary `cloudbuild.yml` files.
     ```sh
     # Don't clone it from inside the cert-manager repo folder.
     git clone https://github.com/cert-manager/release
     cd release
     ```
6. Install the [`gcloud`](https://cloud.google.com/sdk/) CLI.
7. [Login](https://cloud.google.com/sdk/docs/authorizing#running_gcloud_auth_login)
   to `gcloud`:

   ```sh
   gcloud auth application-default login
   ```
8. Make sure `gcloud` points to the cert-manager-release project:

   ```sh
   gcloud config set project cert-manager-release
   ```
9.  Get a GitHub access token [here](https://github.com/settings/tokens)
   with no scope ticked. It is used only by the `release-notes` CLI to
   avoid API rate limiting since it will go through all the PRs one by one.

## Minor Releases

A minor release is a backwards-compatible 'feature' release.  It can contain new
features and bug fixes.

### Release Schedule

We aim to cut a new minor release once per month. The rough goals for each
release are outlined as part of a GitHub milestone. We cut a release even if
some of these goals are missed, in order to keep up release velocity.

### Process for Releasing a Minor Version

{{% pageinfo color="info" %}}
🔰 Please click on the **Edit this page** button on the top-right corner of this page if a step is missing or if it is outdated.
{{% /pageinfo %}}

The process for cutting a minor release is as follows:

1. Ensure upgrading document exists. See for example, see
   [upgrading-1.0-1.1](https://cert-manager.io/docs/installation/upgrading/upgrading-1.0-1.1/)
   (not necessary for alpha and patch releases)

2. Create or update the release branch

    If this is the first alpha release (`alpha.0`), then you will need to create
    the release branch:

    ```bash
    # Must be run from the cert-manager repo folder.
    git fetch --all
    git checkout -b release-1.0 origin/master
    ```

    If there has already been an alpha release, the release branch will
    already exist, so you will need to update it with the latest commits
    from the master branch, as follows:

    ```bash
    # Must be run from the cert-manager repo folder.
    git fetch --all
    git branch --force release-1.0 origin/release-1.0
    git checkout release-1.0
    git merge --ff-only origin/master
    ```

3. Push it to the `jetstack/cert-manager` repository

     **Note 1**: run `git remote -v` to check that `origin` points to the
     upstream <https://github.com/jetstack/cert-manager.git>.

     **Note 2:** if the branch doesn't already exist, you will need to have the
     `write` role on the GitHub project to be able to push to the release
     branch.

     ```bash
     # Must be run from the cert-manager repo folder.
     git push --set-upstream origin release-1.0
     ```

4. Generate and edit the release notes:

   1. Use the following two tables to understand how to fill in the four
      environment variables needed for the next step. These four environment
      variables are documented on the
      [README](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md#options)
      for the Kubernetes `release-notes` tool.

      | Variable          | Description                           |
      | ----------------- | ------------------------------------- |
      | `START_REV`\*     | The git tag of the "previous"\* release |
      | `END_REV`         | Name of your release branch           |
      | `BRANCH`          | Name of your release branch           |
      | `RELEASE_VERSION` | The git tag without the leading `v`   |

      Examples for each release type (e.g., initial alpha release):

      | Variable          | Example 1             | Example 2                | Example 3     | Example 4     |
      | ----------------- | --------------------- | ------------------------ | ------------- | ------------- |
      |                   |                       |                          |               |               |
      |                   | initial alpha release | subsequent alpha release | final release | patch release |
      |                   | `v1.3.0-alpha.0`      | `v1.3.0-alpha.1`         | `v1.3.0`      | `v1.3.1`      |
      |                   |                       |                          |               |               |
      | `START_REV`\*     | `v1.2.0`              | `v1.3.0-alpha.0`         | `v1.2.0`      | `v1.3.0`      |
      | `END_REV`         | `release-1.3`         | `release-1.3`            | `release-1.3` | `release-1.3` |
      | `BRANCH`          | `release-1.3`         | `release-1.3`            | `release-1.3` | `release-1.3` |
      | `RELEASE_VERSION` | `1.3.0-alpha.0`       | `1.3.0-alpha.1`          | `1.3.0`       | `1.3.1`       |


      > \*The git tag of the "previous" release (`START_REV`) depends on which
      > type of release you count on doing. Look at the above examples to
      > understand a bit more what those are.

      After finding out the value for each of the 4 environment variables, set
      the variables in your shell (for example, following the example 1):

        ```sh
        export START_REV="v1.2.0"
        export END_REV="release-1.3"
        export BRANCH="release-1.3"
        export RELEASE_VERSION="1.3.0-alpha.0"
        ```

   2. Generate `release-note.md` at the root of your cert-manager repo folder
      with the following command:

        ```sh
        # Must be run from the cert-manger folder.
        export GITHUB_TOKEN=*your-token*
        go install k8s.io/release/cmd/release-notes@v0.7.0
        release-notes --debug --repo-path cert-manager \
          --org jetstack --repo cert-manager \
          --required-author "jetstack-bot" \
          --output release-notes.md
        ```

        {{% pageinfo color="info" %}}
The GitHub token **does not need any scope**. The token is
required only to avoid rate-limits imposed on anonymous API users.
        {{% /pageinfo %}}

   3. Sanity check the notes, checking that the notes contain details of all
      the features and bug fixes that you expect to be in the release. Add
      additional blurb, notable items and characterize change log.

        You can see the commits that will go into this release by using the
        [GitHub compare](https://github.com/jetstack/cert-manager/compare). For
        example, while releasing `v1.0.0`, you want to compare it with the
        latest pre-released version `v1.0.0-beta.1`:

        <https://github.com/jetstack/cert-manager/compare/v1.0.0-beta.1...master>

5. Run `cmrel stage`

   1. In this example we stage a release using the 'release-1.0' branch,
      setting  the release version to `v1.0.0`:

        ```bash
        # Must be run from the "cert-manager/release" repo folder.
        cmrel stage --branch=release-1.0 --release-version=v1.0.0
        ```

        This step takes ~10 minutes. It will build all Docker images and
        create all the manifest files and upload them to a storage bucket on
        Google Cloud. These artifacts will be published and released in the
        next steps.

        {{% pageinfo color="info" %}}
🔰  Remember to keep open the terminal where you run `cmrel stage`. Its output
will be used in the next step.
        {{% /pageinfo %}}

   2. While the build is running, send a first Slack message to
      `#cert-manager-dev`:

         {{% pageinfo %}}
Releasing `1.2.0-alpha.2` 🧵
         {{% /pageinfo %}}


         {{% pageinfo color="info" %}}
🔰 Please have a quick look at the build log as it might contain some unredacted
data that we forgot to redact. We try to make sure the sensitive data is
properly redacted but sometimes we forget to update this.
         {{% /pageinfo %}}

   3. Send a second Slack message in reply to this first message with the
      Cloud Build job link that `cmrel` displayed in "View logs at". For
      example, the message would look like:

        {{% pageinfo %}}
Follow the `cmrel stage` build: <https://console.cloud.google.com/cloud-build/builds/7641734d-fc3c-42e7-9e4c-85bfc4d1d547?project=1021342095237>
        {{% /pageinfo %}}

6. Run `cmrel publish`

   1. Set the `RELEASE_NAME` variable in your shell. The value for the
      `RELEASE_NAME` variable is found in the output of the previous command,
      `cmrel stage`. Look for the line that contains the `gs://` link:

        ```sh
         gs://cert-manager-release/stage/gcb/release/v1.3.0-alpha.1-c2c0fdd78131493707050ffa4a7454885d041b08
                                                     <------------- RELEASE_NAME -------------------------->
         ```

        Copy that part into a variable in your shell:

        ```sh
        export RELEASE_NAME=v1.3.0-alpha.0-77b045d159bd20ce0ec454cd79a5edce9187bdd9
        ```

   1. Do a `cmrel publish` dry-run to ensure that all the staged resources are
      valid. Run the following command:

        ```bash
        # Must be run from the "cert-manager/release" repo folder.
        cmrel publish --release-name "$RELEASE_NAME"
        ```

        You can view the progress by clicking the Google Cloud Build URL in the
        output of this command.

   2. While the build is running, send a third Slack message in reply to
      the first message:

        {{% pageinfo %}}
Follow the `cmrel publish` dry-run build: <https://console.cloud.google.com/cloud-build/builds16f6f875-0a23-4fff-b24d-3de0af207463?project=1021342095237>
        {{% /pageinfo %}}


   3. Next publish the release artifacts for real.

        If the last step succeeded, you can now re-run the `cmrel publish` with
        the `--nomock` argument to actually publish the release artifacts to
        GitHub, `Quay.io`, to our [ChartMuseum](https://charts.jetstack.io)
        instance, etc.

        ```bash
        # Must be run from the "cert-manager/release" repo folder.
        cmrel publish --nomock --release-name "$RELEASE_NAME"
        ```

       {{% pageinfo color="warning" %}}
⏰ At this stage, there will be a draft release on GitHub and a live release on our [ChartMuseum](https://charts.jetstack.io) instance. So you must now complete the
release process quickly; otherwise, users of the latest release on our ChartMuseum instance will encounter errors because the manual CRD install URL will not be available yet.
      {{% /pageinfo %}}

   4. While the build is running, send a fourth Slack message in reply to
      the first message:

        {{% pageinfo %}}
Follow the `cmrel publish` build: <https://console.cloud.google.com/cloud-build/builds/b6fef12b-2e81-4486-9f1f-d00592351789?project=1021342095237>
        {{% /pageinfo %}}

7. Publish the GitHub release

   1. Visit the draft GitHub release and paste in the release notes that you generated earlier.

        You will need to manually edit the content to match the style of earlier releases.
        In particular, remember to remove package-related changes.

   2. Tick the box "This is a pre-release" if your release is an alpha.
      (not necessary for final releases)

   3. Click "publish" to make the GitHub release live.
      This will create a Git tag automatically.

8.  Finally, post a Slack message as an answer to the first message. Toggle
   the check box "Also send to `#cert-manager-dev`" so that the message is
   well visible. Also cross-post the message on `#cert-manager`.

      {{% pageinfo %}}
https://github.com/jetstack/cert-manager/releases/tag/v1.0.0 🎉
      {{% /pageinfo %}}

### Final Release

After releasing one or more alpha and beta releases,
you will release the final version.
For the final release, you should follow the process described above with the following changes and additional steps:

#### Full Release Notes

The release notes for the final release should include all changes since the last minor release.

#### Rollover Testing Infrastructure

After releasing the final release you will need to update the testing infrastructure,
so that it uses the latest release as `release-previous`,
and you will need to create a new release branch in the cert-manager repository which will be treated as `release-next`,
and both these branches will be tested periodically.

For example see the PR  [Prepare testing for the cert-manager `v1.0` release](https://github.com/jetstack/testing/pull/397).

#### Rollover Documentation

You will also need to update the versions and branches in the cert-manager website configuration.

For example see the PR [Configure website for the `v1.0` release](https://github.com/cert-manager/website/pull/309).

## Patch Releases

A patch release contains critical bug fixes for the project.  They are managed on
an ad-hoc basis, and should only be required when critical bugs/regressions are
found in the release.

We will only perform patch release for the **current** version of cert-manager.

Once a new minor release has been cut, we will stop providing patches for the
version before it.

### Release Schedule

Patch releases are cut on an ad-hoc basis, depending on recent activity on the
release branch.

### Process for Releasing a Patch Version

The process for cutting a patch release is as follows:

1. Ensure that all PRs have been cherry-picked into the release branch, e.g. `release-1.0`

   Bugs that need to be fixed in a patch release should be [cherry picked into the appropriate release branch](../contributing-flow/#cherry-picking).

2. Then, continue with the instructions in [process for releasing a minor version](#process-for-releasing-a-minor-version).
