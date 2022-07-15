---
title: Release Process
description: 'cert-manager contributing: Release process'
---

This document aims to outline the process that should be followed for
cutting a new release of cert-manager. If you would like to know more about
current releases and the timeline for future releases, take a look at the
[Supported Releases](../installation/supported-releases.md) page.

## Prerequisites

{/*
About "alert" and "pageinfo": https://www.docsy.dev/docs/adding-content/shortcodes/#shortcode-helpers
*/}

<div className="warning">

⛔️ Do not proceed with the release process if you do not meet all of the
following conditions:

1. The testgrid must not be failing for [cert-manager-jetstack-cert-manager-next](https://testgrid.k8s.io/cert-manager-jetstack-cert-manager-next)
2. The release process **takes about 40 minutes**. You must have time to
   complete all the steps.
3. You currently need to be at Jetstack to get the required GitHub and GCP
   permissions. (we'd like contributors outside Jetstack to be able to get
   access; if that's of interest to you, please let us know).
4. You need to have the GitHub `admin` permission on the cert-manager project.
   To check that you have the `admin` role, run:

    ```sh
    brew install gh
    gh auth login
    gh api /repos/cert-manager/cert-manager/collaborators/$(gh api /user | jq -r .login)/permission | jq .permission
    ```

    If your permission is `admin`, then you are good to go. To request the
    `admin` permission on the cert-manager project, [open a
    PR](https://github.com/jetstack/platform-board/pulls/new) with a link to
    here.

5. You need to be added as an "Editor" to the GCP project
   [cert-manager-release](https://console.cloud.google.com/?project=cert-manager-release).
   To check if you do have access, try opening [the Cloud Build
   page](https://console.cloud.google.com/cloud-build?project=cert-manager-release).
   To get the "Editor" permission on the GCP project, open a PR with your name
   added to the maintainers list in
   [`cert_manager_release.tf`](https://github.com/jetstack/terraform-jetstack/blob/master/cert_manager_release.tf)

    ```diff
    --- a/cert_manager_release.tf
    +++ b/cert_manager_release.tf
    @@ -17,6 +17,7 @@ locals {
         var.personal_email["..."],
         var.personal_email["..."],
         var.personal_email["..."],
    +    var.personal_email["mael-valais"],
       ])
     }
    ```

    You may use the following PR description:

    ```markdown
    Title: Access to the cert-manager-release GCP project

    Hi. As stated in "Prerequisites" on the [release-process][1] page,
    I need access to the [cert-manager-release][2] project on GCP in
    order to perform the release process. Thanks!

    [1]: https://cert-manager.io/docs/contributing/release-process/#prerequisites
    [2]: https://console.cloud.google.com/?project=cert-manager-release
    ```

</div>

This guide applies for versions of cert-manager released using `make`, which should be every version from cert-manger 1.8 and later.

**If you need to release a version of cert-manager 1.7 or earlier** see [older releases](#older-releases).

First, ensure that you have all the tools required to perform a cert-manager release:

1. Install the [`release-notes`](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md) CLI:

   ```sh
   go install k8s.io/release/cmd/release-notes@v0.7.0
   ```

2. Install our [`cmrel`](https://github.com/cert-manager/release) CLI:

   ```sh
   go install github.com/cert-manager/release/cmd/cmrel@latest
   ```

3. Clone the `cert-manager/release` repo:

   ```sh
   # Don't clone it from inside the cert-manager repo folder.
   git clone https://github.com/cert-manager/release
   cd release
   ```

4. Install the [`gcloud`](https://cloud.google.com/sdk/) CLI.
5. [Login](https://cloud.google.com/sdk/docs/authorizing#running_gcloud_auth_login)
   to `gcloud`:

   ```sh
   gcloud auth application-default login
   ```

6. Make sure `gcloud` points to the cert-manager-release project:

   ```sh
   gcloud config set project cert-manager-release
   export CLOUDSDK_CORE_PROJECT=cert-manager-release # this is used by cmrel
   ```

7. Get a GitHub access token [here](https://github.com/settings/tokens)
   with no scope ticked. It is used only by the `release-notes` CLI to
   avoid API rate limiting since it will go through all the PRs one by one.

## Minor releases

A minor release is a backwards-compatible 'feature' release. It can contain new
features and bug fixes.

### Release schedule

We aim to cut a new minor release once per month. The rough goals for each
release are outlined as part of a GitHub milestone. We cut a release even if
some of these goals are missed, in order to keep up release velocity.

### Process for releasing a version

<div className="info">
🔰 Please click on the **Edit this page** button on the top-right corner of this
page if a step is missing or if it is outdated.
</div>

1. Make sure to note which type of release you are doing. That will be helpful
   in the next steps.

    |          Type of release           | Example of git tag |
    |------------------------------------|--------------------|
    | initial alpha release              | `v1.3.0-alpha.0`   |
    | subsequent alpha release           | `v1.3.0-alpha.1`   |
    | initial beta release               | `v1.3.0-beta.0`    |
    | subsequent beta release            | `v1.3.0-beta.1`    |
    | final release                      | `v1.3.0`           |
    | patch release (or "point release") | `v1.3.1`           |

2. **(final release only)** Make sure that a PR with the new upgrade
   document is ready to be merged on
   [cert-manager/website](https://github.com/cert-manager/website). See for
   example, see
   [upgrading-1.0-1.1](https://cert-manager.io/docs/installation/upgrading/upgrading-1.0-1.1/).

3. Update the release branch:

   - **(initial alpha, subsequent alpha and initial beta)** The release branch
      should already exist (it was created at the end of the last final
      release). Update the release branch with the latest commits from the
      master branch, as follows:

       ```bash
       # Must be run from the cert-manager repo folder.
       git fetch --all
       git branch --force release-1.0 origin/release-1.0
       git checkout release-1.0
       git merge --ff-only origin/master # don't run for a point release!
       ```

    - **(subsequent beta, patch release and final release)**: do nothing since
      things have been merged using `/cherry-pick release-1.0`.

       **Note about the code freeze:**

       The first beta starts a new "code freeze" period that lasts until the
       final release. Just before the code freeze, we fast-forward everything
       from master into the release branch.

       During the code freeze, we continue merging PRs into master as usual.

       We don't fast-forward master into the release branch for the second (and
       subsequent) beta, and only `/cherry-pick release-1.0` the fixes that should be part
       of the subsequent beta.

       We don't fast-forward for patch releases and final releases; instead, we
       prepare these releases using the `/cherry-pick release-1.0` command.

4. Push the new or updated release branch and create the tag:

    1. Check that the `origin` remote is correct. To do that, run the following
        command and make sure it returns
        the upstream `https://github.com/cert-manager/cert-manager.git`:

        ```sh
        # Must be run from the cert-manager repo folder.
        git remote -v | grep origin
        ```

    2. Push the release branch:

        ```bash
        # Must be run from the cert-manager repo folder.
        git push --set-upstream origin release-1.0
        ```

        **GitHub permissions**: `git push` will only work if you have the
       `admin` GitHub permission on the cert-manager repo to create or push to
       the branch, see [prerequisites](#prerequisites). If you do not have this
       permission, you will have to open a PR to merge master into the release
       branch), and wait for the PR checks to become green.

    3. Create the tag for the new release locally and push it upstream:

       ```bash
       git tag -s -m"v1.8.0-beta.0" v1.8.0-beta.0
       # be sure to push the named tag explicitly; you don't want to push any other local tags!
       git push origin v1.8.0-beta.0
       ```

5. Generate and edit the release notes:

    1. Use the following two tables to understand how to fill in the four
       environment variables needed for the next step. These four environment
       variables are documented on the
       [README](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md#options)
       for the Kubernetes `release-notes` tool.

        | Variable          | Description                             |
        | ----------------- | --------------------------------------- |
        | `START_REV`\*     | The git tag of the "previous"\* release |
        | `END_REV`         | Name of your release branch (inclusive) |
        | `BRANCH`          | Name of your release branch             |
        | `RELEASE_VERSION` | The git tag                             |

        Examples for each release type (e.g., initial alpha release):

        | Variable          | Example 1        | Example 2        | Example 2        | Example 3     | Example 4     |
        | ----------------- | ---------------- | ---------------- | ---------------- | ------------- | ------------- |
        |                   |                  |                  |                  |               |               |
        |                   | initial alpha    | subsequent alpha | beta release     | final release | patch release |
        |                   | `v1.3.0-alpha.0` | `v1.3.0-alpha.1` | `v1.3.0-beta.0`  | `v1.3.0`      | `v1.3.1`      |
        |                   |                  |                  |                  |               |               |
        | `START_TAG`\*     | `v1.2.0`         | `v1.3.0-alpha.0` | `v1.3.0-alpha.1` | `v1.2.0`\*\*  | `v1.3.0`      |
        | `END_REV`         | `release-1.3`    | `release-1.3`    | `release-1.3`    | `release-1.3` | `release-1.3` |
        | `BRANCH`          | `release-1.3`    | `release-1.3`    | `release-1.3`    | `release-1.3` | `release-1.3` |
        | `RELEASE_VERSION` | `v1.3.0-alpha.0` | `v1.3.0-alpha.1` | `v1.3.0-beta.0`  | `v1.3.0`      | `v1.3.1`      |

        > \*The git tag of the "previous" release (`START_TAG`) depends on which
        > type of release you count on doing. Look at the above examples to
        > understand a bit more what those are.

        > \*\*Do not use a patch here (e.g., no `v1.2.3`). It must be `v1.2.0`:
        > you must use the latest tag that belongs to the release branch you are
        > releasing on; in the above example, the release branch is
        > `release-1.3`, and the latest tag on that branch is `v1.2.0`.

        After finding out the value for each of the 4 environment variables, set
        the variables in your shell (for example, following the example 1):

        ```sh
        export RELEASE_VERSION="v1.3.0-alpha.0"
        export BRANCH="release-1.3"
        export START_TAG="v1.2.0"
        export END_REV="release-1.3"
        ```

    2. Generate `release-notes.md` at the root of your cert-manager repo folder
       with the following command:

        ```sh
        # Must be run from the cert-manger folder.
        export GITHUB_TOKEN=*your-token*
        git fetch origin $BRANCH:$BRANCH
        export START_SHA="$(git rev-list --reverse --ancestry-path $(git merge-base $START_TAG $BRANCH)..$BRANCH | head -1)"
        release-notes --debug --repo-path cert-manager \
          --org cert-manager --repo cert-manager \
          --required-author "jetstack-bot" \
          --output release-notes.md
        ```

        <div className="pageinfo pageinfo-info"><p>
        The GitHub token **does not need any scope**. The token is required
        only to avoid rate-limits imposed on anonymous API users.
        </p></div>

    3. Sanity check the notes:

        - Make sure the notes contain details of all the features and bug
          fixes that you expect to be in the release.
        - Add additional blurb, notable items and characterize change log.

        You can see the commits that will go into this release by using the
        [GitHub compare](https://github.com/cert-manager/cert-manager/compare). For
        example, while releasing `v1.0.0`, you want to compare it with the
        latest pre-released version `v1.0.0-beta.1`:

        ```text
        https://github.com/cert-manager/cert-manager/compare/v1.0.0-beta.1...master
        ```

    4. **(final release only)** Check the release notes include all changes
       since the last final release.

6. Run `cmrel makestage`:

    1. In this example we stage a release using the `v1.8.0-beta.0` git ref:

        ```bash
        # Must be run from the "cert-manager/release" repo folder.
        cmrel makestage --ref=$RELEASE_VERSION
        ```

        This step takes ~5 minutes. It will build all container images and create
        all the manifest files, sign Helm charts and upload everything to a storage
        bucket on Google Cloud. These artifacts will then be published and released
        in the next steps.

    2. While the build is running, send a first Slack message to
       `#cert-manager-dev`:

        <div className="pageinfo pageinfo-primary"><p>
        Releasing <code>1.2.0-alpha.2</code> 🧵
        </p></div>

        <div className="pageinfo pageinfo-info"><p>
        🔰 Please have a quick look at the build log as it might contain some unredacted
        data that we forgot to redact. We try to make sure the sensitive data is
        properly redacted but sometimes we forget to update this.
        </p></div>

    3. Send a second Slack message in reply to this first message with the
       Cloud Build job link that `cmrel` displayed in "View logs at". For
       example, the message would look like:

        <div className="pageinfo pageinfo-info"><p>
        Follow the <code>cmrel stage</code> build: https://console.cloud.google.com/cloud-build/builds/7641734d-fc3c-42e7-9e4c-85bfc4d1d547?project=1021342095237
        </p></div>

7. Run `cmrel publish`:

    1. Do a `cmrel publish` dry-run to ensure that all the staged resources are
       valid. Run the following command:

        ```sh
        # Must be run from the "cert-manager/release" repo folder.
        cmrel publish --release-name "$RELEASE_VERSION"
        ```

        You can view the progress by clicking the Google Cloud Build URL in the
        output of this command.

    2. While the build is running, send a third Slack message in reply to the first message:

        <div className="pageinfo pageinfo-primary"><p>
        Follow the `cmrel publish` dry-run build: https://console.cloud.google.com/cloud-build/builds16f6f875-0a23-4fff-b24d-3de0af207463?project=1021342095237
        </p></div>

    3. Now publish the release artifacts for real. The following command will publish the artifacts to GitHub, `Quay.io` and to our
       [helm chart repository](https://charts.jetstack.io):

        ```bash
        # Must be run from the "cert-manager/release" repo folder.
        cmrel publish --nomock --release-name "$RELEASE_VERSION"
        ```

      <div className="info">
         ⏰ Upon completion there will be:
         <ol>
            <li>
               <a href="https://github.com/cert-manager/cert-manager/releases">A draft release of cert-manager on GitHub</a>
            </li>
            <li>
               <a href="https://github.com/jetstack/jetstack-charts/pulls">A pull request containing the new Helm chart</a>
            </li>
         </ol>
      </div>

    4. While the build is running, send a fourth Slack message in reply to the first message:

        <div className="pageinfo pageinfo-primary"><p>
        Follow the <code>cmrel publish</code> build: https://console.cloud.google.com/cloud-build/builds/b6fef12b-2e81-4486-9f1f-d00592351789?project=1021342095237
        </p></div>

8. Publish the GitHub release:

    1. Visit the draft GitHub release and paste in the release notes that you
       generated earlier. You will need to manually edit the content to match
       the style of earlier releases. In particular, remember to remove
       package-related changes.

    2. **(initial alpha, subsequent alpha and beta only)** Tick the box "This is
       a pre-release".

    3. Click "Publish" to make the GitHub release live. This will create a Git
       tag automatically.

9. Merge the pull request containing the Helm chart:

   The Helm charts for cert-manager are served using Cloudflare pages
   and the Helm chart files and metadata are stored in the [Jetstack charts repository](https://github.com/jetstack/jetstack-charts).
   The `cmrel publish --nomock` step (above) will have created a PR in this repository which you now have to review and merge, as follows:

    1. [Visit the pull request](https://github.com/jetstack/jetstack-charts/pulls)
    2. Review the changes
    3. Fix any failing checks
    4. Merge the PR
    5. Check that the [cert-manager Helm chart is visible on ArtifactHUB](https://artifacthub.io/packages/helm/cert-manager/cert-manager).

10. **(final release only)** Add the new final release to the
    [supported-releases](../installation/supported-releases.md) page.

11. Post a Slack message as an answer to the first message. Toggle the check
   box "Also send to `#cert-manager-dev`" so that the message is well
   visible. Also cross-post the message on `#cert-manager`.

    <div className="pageinfo pageinfo-primary"><p>
    https://github.com/cert-manager/cert-manager/releases/tag/v1.0.0 🎉
    </p></div>

12. **(final release only)** Show the release to the world:

    1. Send an email to
       [`cert-manager-dev@googlegroups.com`](https://groups.google.com/g/cert-manager-dev)
       with the `release` label
       ([examples](https://groups.google.com/g/cert-manager-dev?label=release)).

    2. Send a tweet
       ([example](https://twitter.com/MaartjeME/status/1286327362121084928))
       and make sure [@JetstackHQ](https://twitter.com/JetstackHQ) retweets it.

13. Proceed to the post-release steps:

    1. **(initial alpha only)** Create a PR on
       [`jetstack/testing`](https://github.com/jetstack/testing),
       changing the `release-next` periodic tests interval to `2h`, configured in:

       ```plain
       config/jobs/cert-manager/release-next/cert-manager-release-next-periodics.yaml
       ```

       Why? Because we increase the interval of the "next" periodic tests right after a final release
       since next periodics are only useful after we do the first alpha.

    2. **(initial alpha only)** Open a PR to
       [`cert-manager/website`](https://github.com/cert-manager/website) in
       order to:

       - Update the section "How we determine supported Kubernetes versions" on
         the [supported-releases](../installation/supported-releases.md) page.
         In the table, change the "next periodic" line with the correct links.

    3. **(final release only)** Create a PR on
       [`jetstack/testing`](https://github.com/jetstack/testing),
       changing the `release-next` periodic tests interval to 168h, configured in:

       ```plain
       config/jobs/cert-manager/release-next/cert-manager-release-next-periodics.yaml
       ```

       Why? Because that saves us compute time between a final release
       and the first alpha.

       ⛔️ Do not remove the file or comment out the file contents,
       because this will break [Test Grid](https://testgrid.k8s.io/jetstack-cert-manager-next),
       as happened in [kubernetes/test-infra #25035](https://github.com/kubernetes/test-infra/pull/25035).

    4. **(final release only)** Open a PR to
       [`cert-manager/website`](https://github.com/cert-manager/website) in
       order to:

       - Update the section "Supported releases" in the
         [supported-releases](../installation/supported-releases.md) page.
       - Update the section "Supported releases" in the
         [supported-releases](../installation/supported-releases.md) page.
       - Update the section "How we determine supported Kubernetes versions" on
         the [supported-releases](../installation/supported-releases.md) page.
         In the table, set "n/a" for the line where "next periodic" is since
         these tests will be disabled until we do our first alpha.

    5. **(final release only)** Open a PR to
       [`jetstack/testing`](https://github.com/jetstack/testing) and change Prow's
       config. To do this, take inspiration from [Maartje's PR
       example](https://github.com/jetstack/testing/pull/397/files).

    6. **(final release only)** Push a new release branch to
       [`cert-manager/cert-manager`](https://github.com/cert-manager/cert-manager). If the
       final release is `v1.0.0`, then push the new branch `release-1.1`:

        ```bash
        # Must be run from the cert-manager repo folder.
        git checkout -b release-1.1 v1.0.0
        git push origin release-1.1
        ```

    7. **(final release only)** Open a PR to
       [`cert-manager/website`](https://github.com/cert-manager/website) with
       updates to the website configuration. To do this, take inspiration from
       [Maartje's PR
       example](https://github.com/cert-manager/website/pull/309/files).

    8. Ensure that any installation commands in
       [`cert-manager/website`](https://github.com/cert-manager/website) install
       the latest version. This should be done after every release, including
       patch releases as we want to encourage users to always install the latest
       patch.

    9. Future: check that our Algolia search indexing is up-to-date for the website - i.e. that the new version of the docs
       is being indexed correctly. This is listed here as it's a step we should be checking after a release of a major version
       but at the time of writing we don't know how to do it!

    10. Open a PR against the Krew index such as [this one](https://github.com/kubernetes-sigs/krew-index/pull/1724),
        bumping the versions of our kubectl plugins.

    11. Create a new OLM package and publish to OperatorHub

        cert-manager can be [installed](https://cert-manager.io/docs/installation/operator-lifecycle-manager/) using Operator Lifecycle Manager (OLM)
        so we need to create OLM packages for each cert-manager version and publish them to both
        [operatorhub.io](https://operatorhub.io/operator/cert-manager) and the equivalent package index for RedHat OpenShift.

        Follow [the cert-manager OLM release process](https://github.com/cert-manager/cert-manager-olm#release-process) and, once published,
        [verify that the cert-manager OLM installation instructions](https://cert-manager.io/docs/installation/operator-lifecycle-manager/) still work.


## Older Releases

The above guide only applies for versions of cert-manager from v1.8 onwards.

Older versions were built using Bazel and this difference in build process is reflected in the release process.

### cert-manager 1.6 and 1.7

Follow [this older version][older-release-process] of the release process on GitHub, rather than the guide on this website.

The most notable difference is you'll call `cmrel stage` rather than `cmrel makestage`. You should be fine to use the latest
version of `cmrel` to do the release.

### cert-manager 1.5 and earlier

If you're releasing version 1.5 or earlier you must also be sure to install a different version of `cmrel`.

In the step where you install `cmrel`, you'll want to run the following instead:

```bash
go install github.com/cert-manager/release/cmd/cmrel@cert-manager-pre-1.6
```

This will ensure that the version of `cmrel` you're using is compatible with the version of cert-manager you're releasing.

In addition, when you check out the `cert-manager/release` repository you should be sure to check out the `cert-manager-pre-1.6` tag in that repo:

```bash
git checkout cert-manager-pre-1.6
```

Other than the different `cert-manager/release` tag and `cmrel` version, you can follow the [same older release documentation][older-release-process] as
is used for 1.6 and 1.7 - just remember to change the version of `cmrel` you install!

[older-release-process]: https://github.com/cert-manager/website/blob/6fa0db74de0ae17d7be638a08155d1b4e036aaa9/content/en/docs/contributing/release-process.md?plain=1
