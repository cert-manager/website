---
title: Release Process
description: 'cert-manager contributing: Release process'
---

This document aims to outline the process that should be followed for
cutting a new release of cert-manager. If you would like to know more about
current releases and the timeline for future releases, take a look at the
[Supported Releases](../installation/supported-releases.md) page.

## Prerequisites

⛔️ Do not proceed with the release process if you do not meet all of the
following conditions:

1. The relevant [testgrid dashboard](https://testgrid.k8s.io/cert-manager) should not be failing for the release you're trying to perform.
2. The release process **takes about 40 minutes**. You must have time to complete all the steps.
3. You currently need to be at Jetstack to get the required GitHub and GCP
   permissions. (we'd like contributors outside Jetstack to be able to get
   access; if that's of interest to you, please let us know).
4. You need to have the GitHub `admin` permission on the cert-manager project.
   To check that you have the `admin` role, run:

    ```bash
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

This guide applies for versions of cert-manager released using `make`, which should be every version from cert-manager 1.8 and later.

**If you need to release a version of cert-manager 1.7 or earlier** see [older releases](#older-releases).

First, ensure that you have all the tools required to perform a cert-manager release:

1. Install the [`release-notes`](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md) CLI:

   ```bash
   go install k8s.io/release/cmd/release-notes@v0.13.0
   ```

2. Install our [`cmrel`](https://github.com/cert-manager/release) CLI:

   ```bash
   go install github.com/cert-manager/release/cmd/cmrel@latest
   ```

3. Clone the `cert-manager/release` repo:

   ```bash
   # Don't clone it from inside the cert-manager repo folder.
   git clone https://github.com/cert-manager/release
   cd release
   ```

4. Install the [`gcloud`](https://cloud.google.com/sdk/) CLI.
5. [Login](https://cloud.google.com/sdk/docs/authorizing#running_gcloud_auth_login)
   to `gcloud`:

   ```bash
   gcloud auth application-default login
   ```

6. Make sure `gcloud` points to the cert-manager-release project:

   ```bash
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
    | (optional) patch pre-release[^1]   | `v1.3.1-beta.0`    |
    | patch release (or "point release") | `v1.3.1`           |

[^1]: One or more "patch pre-releases" may be created to allow voluntary community testing of a bug fix or security fix before the fix is made generally available. The suffix `-beta` must be used for patch pre-releases.

2. **(final release only)** Make sure that a PR with the new upgrade
   document is ready to be merged on
   [cert-manager/website](https://github.com/cert-manager/website). See for
   example, see
   [upgrading-1.0-1.1](https://cert-manager.io/docs/installation/upgrading/upgrading-1.0-1.1/).

3. Check that the `origin` remote is correct. To do that, run the following
   command and make sure it returns the upstream
   `https://github.com/cert-manager/cert-manager.git`:

    ```bash
    # Must be run from the cert-manager repo folder.
    git remote -v | grep origin
    ```

    It should show:

    ```text
    origin  https://github.com/jetstack/cert-manager (fetch)
    origin  https://github.com/jetstack/cert-manager (push)
    ```

4. Place yourself on the correct branch:

   - **(initial alpha and subsequent alpha)**: place yourself on the `master`
     branch:

      ```bash
      git checkout master
      git pull origin master
      ```

   - **(initial beta only)** The release branch doesn't exist yet, so let's
     create it and push it:

      ```bash
      # Must be run from the cert-manager repo folder.
      git checkout master
      git pull origin master
      git checkout -b release-1.12 master
      git push origin release-1.12
      ```

      **GitHub permissions**: `git push` will only work if you have the `admin`
      GitHub permission on the cert-manager repo to create or push to the
      branch, see [prerequisites](#prerequisites). If you do not have this
      permission, you will have to open a PR to merge master into the release
      branch), and wait for the PR checks to become green.

    - **(subsequent beta, patch release and final release)**: place yourself on
      the release branch:

      ```bash
      git checkout release-1.12
      git pull origin release-1.12
      ```

      You don't need to fast-forward the branch because things have been merged
      using `/cherry-pick release-1.0`.

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

   > Note about branch protection: The release branches are protected by [GitHub branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule), which is [configured automatically by Prow](https://github.com/jetstack/testing/blob/500b990ad1278982b10d57bf8fbca383040d2fe8/config/config.yaml#L27-L36).
   >  This prevents anyone *accidentally* pushing changes directly to these branches, even repository administrators.
   >  If you need, for some reason, to fast forward the release branch,
   >  you should delete the branch protection for that release branch, using the [GitHub branch protection web UI](https://github.com/cert-manager/cert-manager/settings/branches).
   >  This is only a temporary change to allow you to update the branch.
   >  [Prow will re-apply the branch protection within 24 hours](https://docs.prow.k8s.io/docs/components/optional/branchprotector/#updating).

5. Ensure that cert-manager library dependency in `cmctl` refers to the latest
cert-manager commit on the branch you want to release from. See comment
[here](https://github.com/cert-manager/cert-manager/blob/v1.12.1/cmd/ctl/go.mod#L5-L12).
You must bump the cert-manager version in `cmctl` `go.mod` file and cherry-pick
that commit to the release branch _before_ pushing the tag for the new release.

6. Create the required tags for the new release locally and push it upstream (starting the cert-manager build):

     ```bash
     RELEASE_VERSION=v1.8.0-beta.0
     git tag -m"$RELEASE_VERSION" $RELEASE_VERSION
     # be sure to push the named tag explicitly; you don't want to push any other local tags!
     git push origin $RELEASE_VERSION
     ```

      **GitHub permissions**: `git push` will only work if you have the
      `admin` GitHub permission on the cert-manager repo to create or push to
      the branch, see [prerequisites](#prerequisites). If you do not have this
      permission, you will have to open a PR to merge master into the release
      branch, and wait for the PR checks to become green.

      For recent versions of cert-manager, the tag being pushed will trigger a Google Cloud Build job to start,
      kicking off a build using the steps in `gcb/build_cert_manager.yaml`. Users with access to
      the cert-manager-release project on GCP should be able to view logs in [GCB build history](https://console.cloud.google.com/cloud-build/builds?project=cert-manager-release).

Add the tag for cmctl:
     ```bash
     # This tag is required to be able to go install cmctl
     # See https://stackoverflow.com/questions/60601011/how-are-versions-of-a-sub-module-managed/60601402#60601402
     git tag -m"cmd/ctl/$RELEASE_VERSION" "cmd/ctl/$RELASE_VERSION"
     git push origin "cmd/ctl/$RELEASE_VERSION"
     ```

7. Generate and edit the release notes:

    1. Use the following two tables to understand how to fill in the four
       environment variables needed for the next step. These four environment
       variables are documented on the
       [README](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md#options)
       for the Kubernetes `release-notes` tool.

        | Variable          | Description                             |
        | ----------------- | --------------------------------------- |
        | `RELEASE_VERSION` | The git tag                             |
        | `START_TAG`\*     | The git tag of the "previous"\* release |
        | `END_REV`         | Name of your release branch (inclusive) |
        | `BRANCH`          | Name of your release branch             |

        Examples for each release type (e.g., initial alpha release):

        | Variable          | Example 1        | Example 2        | Example 2        | Example 3     | Example 4     |
        | ----------------- | ---------------- | ---------------- | ---------------- | ------------- | ------------- |
        |                   |                  |                  |                  |               |               |
        |                   | initial alpha    | subsequent alpha | beta release     | final release | patch release |
        | `RELEASE_VERSION` | `v1.3.0-alpha.0` | `v1.3.0-alpha.1` | `v1.3.0-beta.0`  | `v1.3.0`      | `v1.3.1`      |
        | `START_TAG`\*     | `v1.2.0`         | `v1.3.0-alpha.0` | `v1.3.0-alpha.1` | `v1.2.0`\*\*  | `v1.3.0`      |
        | `END_REV`         | `master`         | `master`         | `release-1.3`    | `release-1.3` | `release-1.3` |
        | `BRANCH`          | `master`         | `master`         | `release-1.3`    | `release-1.3` | `release-1.3` |

        > \*The git tag of the "previous" release (`START_TAG`) depends on which
        > type of release you count on doing. Look at the above examples to
        > understand a bit more what those are.

        > \*\*Do not use a patch here (e.g., no `v1.2.3`). It must be `v1.2.0`:
        > you must use the latest tag that belongs to the release branch you are
        > releasing on; in the above example, the release branch is
        > `release-1.3`, and the latest tag on that branch is `v1.2.0`.

        After finding out the value for each of the 4 environment variables, set
        the variables in your shell (for example, following the example 1):

        ```bash
        export RELEASE_VERSION="v1.3.0-alpha.0"
        export START_TAG="v1.2.0"
        export END_REV="release-1.3"
        export BRANCH="release-1.3"
        ```

    2. Generate `release-notes.md` at the root of your cert-manager repo folder
       with the following command:

        ```bash
        # Must be run from the cert-manager folder.
        export GITHUB_TOKEN=*your-token*
        git fetch origin $BRANCH
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

8. Check that the build is complete and send Slack messages about the release:

    1. For recent versions of cert-manager, the build will have been automatically
       triggered by the tag being pushed earlier. You can check if it's complete on
       the [GCB Build History](https://console.cloud.google.com/cloud-build/builds?project=cert-manager-release).

    2. If you're releasing an older version of cert-manager (earlier than 1.10) then the automatic build
       will failed because the GCB config for that build wasn't backported.
       In this case, you'll need to trigger the build manually using `cmrel`, which takes about 5 minutes:

        ```bash
        # Must be run from the "cert-manager/release" repo folder.
        cmrel makestage --ref=$RELEASE_VERSION
        ```

        This build takes ~5 minutes. It will build all container images and create
        all the manifest files, sign Helm charts and upload everything to a storage
        bucket on Google Cloud. These artifacts will then be published and released
        in the next steps.

    3. In any case, send a first Slack message to `#cert-manager-dev`:

        <div className="pageinfo pageinfo-primary"><p>
        Releasing <code>1.2.0-alpha.2</code> 🧵
        </p></div>

        <div className="pageinfo pageinfo-info"><p>
        🔰 Please have a quick look at the build log as it might contain some unredacted
        data that we forgot to hide. We try to make sure the sensitive data is
        properly redacted but sometimes we forget to update this.
        </p></div>

    3. Send a second Slack message in reply to this first message with the
       Cloud Build job link. For example, the message might look like:

        <div className="pageinfo pageinfo-info"><p>
        Follow the <code>cmrel makestage</code> build: https://console.cloud.google.com/cloud-build/builds/7641734d-fc3c-42e7-9e4c-85bfc4d1d547?project=1021342095237
        </p></div>

9. Run `cmrel publish`:

    1. Do a `cmrel publish` dry-run to ensure that all the staged resources are
       valid. Run the following command:

        ```bash
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

10. Publish the GitHub release:

    1. Visit the draft GitHub release and paste in the release notes that you
       generated earlier. You will need to manually edit the content to match
       the style of earlier releases. In particular, remember to remove
       package-related changes.

    2. **(initial alpha, subsequent alpha and beta only)** Tick the box "This is
       a pre-release".

    3. **(final release and patch release)** Tick the box "Set as the latest
       release".

    4. Click "Publish" to make the GitHub release live.

11. Merge the pull request containing the Helm chart:

   The Helm charts for cert-manager are served using Cloudflare pages
   and the Helm chart files and metadata are stored in the [Jetstack charts repository](https://github.com/jetstack/jetstack-charts).
   The `cmrel publish --nomock` step (above) will have created a PR in this repository which you now have to review and merge, as follows:

    1. [Visit the pull request](https://github.com/jetstack/jetstack-charts/pulls)
    2. Review the changes
    3. Fix any failing checks
    4. Merge the PR
    5. Check that the [cert-manager Helm chart is visible on ArtifactHUB](https://artifacthub.io/packages/helm/cert-manager/cert-manager).

12. **(final release only)** Add the new final release to the
    [supported-releases](../installation/supported-releases.md) page.

13. Open a PR for a [Homebrew](https://github.com/Homebrew/homebrew-core/pulls) formula update for `cmctl`.

    Assuming you have `brew` installed, you can use the `brew bump-formula-pr`
    command to do this. You'll need the new tag name and the commit hash of that
    tag. See `brew bump-formula-pr --help` for up to date details, but the command
    will be of the form:

    ```bash
    brew bump-formula-pr --dry-run --tag v0.10.0 --revision da3265115bfd8be5780801cc6105fa857ef71965 cmctl
    ```

    Replacing the tag and revision with the new ones.

    This will take time for the Homebrew team to review. Once the pull reqeust
    against https://github.com/homebrew/homebrew-core has been opened, continue
    with further release steps.

14. Post a Slack message as an answer to the first message. Toggle the check
   box "Also send to `#cert-manager-dev`" so that the message is well
   visible. Also cross-post the message on `#cert-manager`.

    <div className="pageinfo pageinfo-primary"><p>
    https://github.com/cert-manager/cert-manager/releases/tag/v1.0.0 🎉
    </p></div>

15. **(final release only)** Show the release to the world:

    1. Send an email to
       [`cert-manager-dev@googlegroups.com`](https://groups.google.com/g/cert-manager-dev)
       with the `release` label
       ([examples](https://groups.google.com/g/cert-manager-dev?label=release)).

    2. Send a tweet on the cert-manager Twitter account! Login details are in Jetstack's 1password (for now).
       ([Example tweet](https://twitter.com/CertManager/status/1612886311957831680)). Make sure [@JetstackHQ](https://twitter.com/JetstackHQ) retweets it!

    3. Send a toot from the cert-manager Mastodon account! Login details are in Jetstack's 1password (for now).
       ([Example toot](https://infosec.exchange/@CertManager/109666434738850493))

16. Proceed to the post-release steps:

    1. **(initial beta only)** Create a PR on
       [cert-manager/release](https://github.com/cert-manager/release) in order to
       add the new release to our list of periodic ProwJobs. Use [this PR](https://github.com/jetstack/testing/pull/774/) as an example.

    2. **(initial beta only)** Run `cmrel generate-prow --branch='*' -o file` with the new version from the previous step and
       open a PR to [cert-manager/testing](https://github.com/jetstack/testing) adding the generated prow configs.
       Use [this PR](https://github.com/jetstack/testing/pull/766) as an example.

    3. If needed, open a PR to
       [`cert-manager/website`](https://github.com/cert-manager/website) in
       order to:

       - Update the section "How we determine supported Kubernetes versions" on
         the [supported-releases](../installation/supported-releases.md) page.
       - Add any new release notes, if needed.

    4. **(final release only)** Create a PR on
       [cert-manager/release](https://github.com/cert-manager/release),
       removing the now unsupported release version (2 versions back) in this file:

       ```plain
       prowspecs/specs.go
       ```

       This will remove the periodic ProwJobs for this version as they're no longer needed.

    5. **(final release only)** Run `cmrel generate-prow --branch='*' -o file` with the new version from the previous step and
       open a PR to [jetstack/testing](https://github.com/jetstack/testing) adding the generated prow configs.

    6. **(final release only)** Open a PR to [`jetstack/testing`](https://github.com/jetstack/testing)
       and update the [milestone_applier](https://github.com/jetstack/testing/blob/3110b68e082c3625bf0d26265be2d29e41da14b2/config/plugins.yaml#L69)
       config so that newly raised PRs on master are applied to a new milestone
       for the next release. E.g. if master currently points at the `v1.10` milestone, change it to point at `v1.11`.

       If the [milestone](https://github.com/cert-manager/cert-manager/milestones) for the next release doesn't exist,
       create it first. If you consider the milestone for the version you just released to be complete, close it.

    7. **(final release only)** Open a PR to
       [`cert-manager/website`](https://github.com/cert-manager/website) in
       order to:

       - Update the section "Supported releases" in the
         [supported-releases](../installation/supported-releases.md) page.
       - Update the section "How we determine supported Kubernetes versions" on
         the [supported-releases](../installation/supported-releases.md) page.
         In the table, set "n/a" for the line where "next periodic" is since
         these tests will be disabled until we do our first alpha.
       - Update the [API docs](../reference/api-docs.md) and [CLI docs](../cli/README.md) by running `scripts/gendocs/generate`
         and commit any changes to a branch and create a PR to merge those into
         `master` or `release-next` depending on whether this is a minor or
         patch release.

    8. Ensure that any installation commands in
       [`cert-manager/website`](https://github.com/cert-manager/website) install
       the latest version. This should be done after every release, including
       patch releases as we want to encourage users to always install the latest
       patch. In addition, ensure that release notes for the latest version are added.

    9. Open a PR against the Krew index such as [this one](https://github.com/kubernetes-sigs/krew-index/pull/1724),
      bumping the versions of our kubectl plugins. This is likely only worthwhile if
      cmctl / kubectl plugin functionality has changed significantly or after the first release of a new major version.

    10. Create a new OLM package and publish to OperatorHub

       cert-manager can be [installed](https://cert-manager.io/docs/installation/operator-lifecycle-manager/) using Operator Lifecycle Manager (OLM)
       so we need to create OLM packages for each cert-manager version and publish them to both
       [`operatorhub.io`](https://operatorhub.io/operator/cert-manager) and the equivalent package index for RedHat OpenShift.

       Follow [the cert-manager OLM release process](https://github.com/cert-manager/cert-manager-olm#release-process) and, once published,
       [verify that the cert-manager OLM installation instructions](https://cert-manager.io/docs/installation/operator-lifecycle-manager/) still work.

## Older Releases

The above guide only applies for versions of cert-manager from v1.8 and newer.

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
