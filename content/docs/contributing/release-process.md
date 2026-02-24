---
title: Release Process
description: 'cert-manager contributing: Release process'
---

This document aims to outline the process that should be followed for
cutting a new release of cert-manager. If you would like to know more about
current releases and the timeline for future releases, take a look at the
[Supported Releases](../releases/README.md) page.

## Prerequisites

⛔️ Do not proceed with the release process if you do not meet all of the
following conditions:

1. The relevant [testgrid dashboard](https://testgrid.k8s.io/cert-manager) should not be failing for the release you're trying to perform.
2. The cert-manager [`govulncheck` GitHub Action](https://github.com/cert-manager/cert-manager/actions/workflows/govulncheck.yaml) must be passing on the branch you're trying to release. If necessary, run `make verify-govulncheck` locally.
3. The release process **takes about 40 minutes**. You must have time to complete all the steps.
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
   To check if you do have access, try opening [the Cloud Build page](https://console.cloud.google.com/cloud-build?project=cert-manager-release).
   To get the "Editor" permission on the GCP project, you need to be a maintainer. If you are, open a PR with your email address
   added to the release manager list in
   [`variables.tf`](https://github.com/cert-manager/infrastructure/blob/665d53cb01c871dc30232dfa84cde62effb0ab56/gcp/variables.tf#L3)

    You may use the following PR description:

    ```markdown
    Title: Access to the cert-manager-release GCP project

    Hi. As stated in "Prerequisites" on the [release-process][1] page,
    I need access to the [cert-manager-release][2] project on GCP in
    order to perform the release process. Thanks!

    [1]: https://cert-manager.io/docs/contributing/release-process/#prerequisites
    [2]: https://console.cloud.google.com/?project=cert-manager-release
    ```

This guide applies for versions of cert-manager released using `make`, which is every version from cert-manager 1.8 and newer.

If you need to release a version of cert-manager 1.7 or earlier see [older releases](#older-releases).

## Tool Setup

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

8. Ensure that you have `gsutil` installed; it's part of the Google Cloud SDK.

9. Ensure you have `cosign` installed. See [the cosign installation instructions](https://docs.sigstore.dev/cosign/system_config/installation/).

10. Ensure you have permissions to push to the OCI Helm chart registry, `quay.io/jetstack/charts`. You may need to run commands from [Helm's documentation](https://helm.sh/docs/topics/registries/#commands-for-working-with-registries).
    Specifically, you will need to have run `helm registry login -u=USERNAME -p=PASSWORD quay.io` to authenticate with the registry.
    Credentials can be obtained from the `quay.io` web UI if you're already a member of the `jetstack` organization on Quay.

## Minor releases

A minor release is a backwards-compatible 'feature' release. It can contain new
features and bug fixes.

### Process for releasing a version

:::info

🔰 Please click on the **Edit this page** button on the top-right corner of this
page if a step is missing or if it is outdated.

:::

1. Remind yourself of our release terminology by looking at the following table.
   This will allow you to know which steps to skip by looking the header of the
   step, e.g., **(final release only)** means that this step must only be
   performed when doing a final release.

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

2. Set the 4 environment variables by copying the following snippet in your
   shell table:

     ```bash
     export RELEASE_VERSION="v1.3.0-alpha.0"
     export START_TAG="v1.2.0"
     export END_REV="release-1.3"
     export BRANCH="release-1.3"
     ```

    > **Note:** To help you fill in the correct values, use the following
    > examples:
    >
    > | Variable          | Example 1        | Example 2        | Example 2        | Example 3     | Example 4     |
    > | ----------------- | ---------------- | ---------------- | ---------------- | ------------- | ------------- |
    > |                   | initial alpha    | subsequent alpha | beta release     | final release | patch release |
    > | `RELEASE_VERSION` | `v1.3.0-alpha.0` | `v1.3.0-alpha.1` | `v1.3.0-beta.0`  | `v1.3.0`      | `v1.3.1`      |
    > | `START_TAG`       | `v1.2.0`         | `v1.3.0-alpha.0` | `v1.3.0-alpha.1` | `v1.2.0`\*    | `v1.3.0`      |
    > | `END_REV`         | `master`         | `master`         | `release-1.3`    | `release-1.3` | `release-1.3` |
    > | `BRANCH`          | `master`         | `master`         | `release-1.3`    | `release-1.3` | `release-1.3` |
    >
    > \*Do not use a patch here (e.g., no `v1.2.3`). It must be `v1.2.0`:
    > you must use the latest tag that belongs to the release branch you are
    > releasing on; in the above example, the release branch is
    > `release-1.3`, and the latest tag on that branch is `v1.2.0`.

    > **Note:** The 4 variables are described in [the README of the
   `release-notes`
   tool](https://github.com/kubernetes/release/blob/master/cmd/release-notes/README.md#options).
   For your convenience, the following table summarizes what you need to know:
    >
    > | Variable          | Description                             |
    > | ----------------- | --------------------------------------- |
    > | `RELEASE_VERSION` | The git tag                             |
    > | `START_TAG`\*     | The git tag of the "previous"\* release |
    > | `END_REV`         | Name of your release branch (inclusive) |
    > | `BRANCH`          | Name of your release branch             |

3. **(final release only)** Prepare the Website "Upgrade Notes" PR.

   Make sure that a PR with the new upgrade
   document is ready to be merged on
   [cert-manager/website](https://github.com/cert-manager/website). See for
   example, see
   [upgrading-1.0-1.1](https://cert-manager.io/docs/releases/upgrading/upgrading-1.0-1.1.md).

   This can be prepared ahead of time.

4. **(final + patch releases)** Prepare the Website "Release Notes" PR.

     **⚠️ This step can be done ahead of time.**

     The steps below need to happen using `master` (**final release**) or
     `release-1.x` (**patch release**). The PR will be merged after the release.

   1. (**final release**) Create a new file `content/docs/release-notes/release-notes-1.xx.md`.

     **Note:** For patch releases, you can skip this step and reuse the same release notes page.

   2. (**final release**) Add an entry to `content/docs/manifest.json` for the new release note file:

        ```diff
         {
           "title": "Release Notes",
           "routes": [
        +    {
        +      "title": "v1.12",
        +      "path": "/docs/release-notes/release-notes-1.12.md"
        +    },
        ```

   3. Add or update the "Major themes" and "Community" sections, taking inspiration from
     previous release note pages. For final releases this will take some time; for
     patch releases this should be a minor task and usually will not need to be done.


5. **(final + patch release)** Prepare the Website "Bump Versions" PR.

   **⚠️ This step can be done ahead of time.**

   In that PR:

   1. (**final release**) Update the section "Supported releases" in the
     [supported-releases](../releases/README.md) page.
   2. (**final release**) Update the section "How we determine supported
     Kubernetes versions" on the
     [supported-releases](../releases/README.md) page.
   3. (**final release**) Bump the version that appears in
     `scripts/gendocs/generate-new-import-path-docs`. For example:

      ```diff
      -LATEST_VERSION="v1.11-docs"
      +LATEST_VERSION="v1.12-docs"

      -genversionwithcli "release-1.11" "$LATEST_VERSION"
      +genversionwithcli "release-1.12" "$LATEST_VERSION"
      ```

   4. (**final + patch release of the latest minor version**) Bump the latest
      cert-manager version variable in the `content/docs/variables.json` file.

      ```diff
      -"cert_manager_latest_version": "v1.14.2",
      +"cert_manager_latest_version": "v1.14.3",
      ```

   5. (**final release only**) Freeze the `docs/` folder by running the following script:

      ```bash
      # From the website repository, on the master branch.
      ./scripts/freeze-docs 1.16
      ```

      This copies the `docs/` folder to a versioned folder (e.g. `v1.15-docs`) and removes any
      folders which should not be present in versioned docs.

   6. (**final + patch releases**) Update the [API docs](https://cert-manager.io/docs/reference/api-docs/) and [CLI docs](https://cert-manager.io/docs/cli//):

      ```bash
      # From the website repository, on the master branch.
      ./scripts/gendocs/generate
      ```

6. Check that the `origin` remote is correct. To do that, run the following
   command and make sure it returns the upstream
   `https://github.com/cert-manager/cert-manager.git`:

    ```bash
    # Must be run from the cert-manager repo folder.
    git remote -v | grep origin
    ```

    It should show:

    ```text
    origin  https://github.com/cert-manager/cert-manager (fetch)
    origin  https://github.com/cert-manager/cert-manager (push)
    ```

7. Place yourself on the correct branch:

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

   > Note about branch protection: The release branches are protected by [GitHub branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule), which is [configured automatically by Prow](https://github.com/cert-manager/testing/blob/500b990ad1278982b10d57bf8fbca383040d2fe8/config/config.yaml#L27-L36).
   >  This prevents anyone *accidentally* pushing changes directly to these branches, even repository administrators.
   >  If you need, for some reason, to fast forward the release branch,
   >  you should delete the branch protection for that release branch, using the [GitHub branch protection web UI](https://github.com/cert-manager/cert-manager/settings/branches).
   >  This is only a temporary change to allow you to update the branch.
   >  [Prow will re-apply the branch protection within 24 hours](https://docs.prow.k8s.io/docs/components/optional/branchprotector/#updating).

8. Create the required tags for the new release locally and push it upstream (starting the cert-manager build):

     ```bash
     echo $RELEASE_VERSION
     git tag -m"$RELEASE_VERSION" $RELEASE_VERSION
     # be sure to push the named tag explicitly; you don't want to push any other local tags!
     git push origin $RELEASE_VERSION
     ```

      > **Note**: `git push` will only work if you have the `admin` GitHub
      > permission on the cert-manager repo to create or push to the branch, see
      > [prerequisites](#prerequisites). If you do not have this permission, you
      > will have to open a PR to merge master into the release branch), and
      > wait for the PR checks to become green.

      > **Note 2:** For recent versions of cert-manager, the tag being pushed will trigger a Google Cloud Build job to start,
      > kicking off a build using the steps in `gcb/build_cert_manager.yaml`. Users with access to
      > the cert-manager-release project on GCP should be able to view logs in [GCB build history](https://console.cloud.google.com/cloud-build/builds?project=cert-manager-release).

9. <details>
   <summary>**ONLY for (1.12, 1.13, and 1.14)**</summary>

   In this step, we make sure the Go module
   `github.com/cert-manager/cert-manager/cmd/ctl` can be imported by
   third-parties.

    First, create a temporary branch.

     ```bash
     # Must be run from the cert-manager repo folder.
     git checkout -b "update-cmd/ctl/$RELEASE_VERSION"
     ```

    Second, update the `cmd/ctl`'s `go.mod` with the tag we just created:

     ```bash
     # Must be run from the cert-manager repo folder.
     cd cmd/ctl
     go get github.com/cert-manager/cert-manager@$RELEASE_VERSION
     cd ../..

     make tidy
     git add "**/go.mod" "**/go.sum"
     git commit --signoff -m"Update cmd/ctl's go.mod to $RELEASE_VERSION"
     ```

    Then, push the branch to your fork of cert-manager. For example:

     ```bash
     # Must be run from the cert-manager repo folder.
     gh repo fork --remote-name fork
     git push -u fork "update-cmd/ctl/$RELEASE_VERSION"
     ```

   Then, open a PR to merge that change and go back to the release branch with
   the following commands:

     ```bash
     gh pr create \
       --title "[Release $RELEASE_VERSION] Update cmd/cmctl's go.mod to $RELEASE_VERSION" \
       --body-file - --base $BRANCH <<EOF
     This PR cmd/cmctl's go.mod to $RELEASE_VERSION as part of the release process.

     **To the reviewer:** the version changes in \`go.mod\` must be reviewed.

     \`\`\`release-note
     NONE
     \`\`\`
     EOF
     ```

   Wait for the PR to be merged.

   Finally, create a tag for the `cmd/ctl` module:

    ```bash
     # Must be run from the cert-manager repo folder.
     git fetch origin $BRANCH
     git checkout $BRANCH
     git pull --ff-only origin $BRANCH
     git tag -m"cmd/ctl/$RELEASE_VERSION" "cmd/ctl/$RELEASE_VERSION" origin/$BRANCH
     git push origin "cmd/ctl/$RELEASE_VERSION"
     ```

    > **Note:** the reason we need to do this is explained on Stack Overflow:
    [how-are-versions-of-a-sub-module-managed][]

    [how-are-versions-of-a-sub-module-managed]: https://stackoverflow.com/questions/60601011/how-are-versions-of-a-sub-module-managed/60601402#60601402

   </details>

10. In this section, we create the description for the GitHub Release and some release notes for the website.

    > **Note:** This step is about creating the description that will be
    > copy-pasted into the GitHub release page. The creation of the "Release
    > Note" page on the website is done in a previous step.

    1. Check that all the 4 environment variables are ready:

        ```bash
        echo $RELEASE_VERSION
        echo $START_TAG
        echo $END_REV
        echo $BRANCH
        ```

    2. Generate `github-release-description.md` and `website-release-notes.md` with the following commands:

        ```bash
        # Must be run from the cert-manager folder.
        export GITHUB_TOKEN=$(gh auth token)
        git fetch origin $BRANCH
        export START_SHA="$(git rev-list --reverse --ancestry-path $(git merge-base $START_TAG $BRANCH)..$BRANCH | head -1)"
        release-notes --debug --repo-path cert-manager \
         --org cert-manager --repo cert-manager \
         --required-author "cert-manager-prow[bot]" \
         --markdown-links=false \
         --dependencies=false \
         --output github-release-description.md
        release-notes --debug --repo-path cert-manager \
         --org cert-manager --repo cert-manager \
         --required-author "cert-manager-prow[bot]" \
         --markdown-links=true \
         --dependencies=false \
         --output website-release-notes.md
        ```

        :::info

        The GitHub token **does not need any scope**. The token is required
        only to avoid rate-limits imposed on anonymous API users.

        :::

    3. Prepare a short summary of the contents of the release which will be used for both the GitHub Release and the website release notes.

    4. Update the relevant release notes file on the website repo to include the contents of `website-release-notes.md`.

11. Check that the build that was automatically triggered when you pushed the
    tag is complete and send Slack messages about the release:

    1. Send a first Slack message to `#cert-manager-dev`:

        :::info

        Releasing `1.2.0-alpha.2` 🧵

        :::

    2. Check that the build completed in the
       [GCB Build History](https://console.cloud.google.com/cloud-build/builds?project=cert-manager-release).

        :::info

        🔰 Please have a quick look at the build log as it might contain some unredacted
        data that we forgot to hide. We try to make sure the sensitive data is
        properly redacted but sometimes we forget to update this.

        :::

    3. Copy the build logs URL and send a second Slack message in reply to this
       first message with the Cloud Build job link. For example, the message
       might look like:

        :::info

        `cmrel makestage` build logs: https://console.cloud.google.com/cloud-build/builds/7641734d-fc3c-42e7-9e4c-85bfc4d1d547?project=1021342095237

        :::

12. Run `cmrel publish`:

    1. Do a `cmrel publish` dry-run to ensure that all the staged resources are
       valid. Run the following command:

        ```bash
        # Must be run from the "cert-manager/release" repo folder.
        cmrel publish --release-name "$RELEASE_VERSION"
        ```

        You can view the progress by clicking the Google Cloud Build URL in the
        output of this command.

    2. While the build is running, send a third Slack message in reply to the first message:

        :::info

        Follow the `cmrel publish` dry-run build: https://console.cloud.google.com/cloud-build/builds16f6f875-0a23-4fff-b24d-3de0af207463?project=1021342095237

        :::

    3. Now publish the release artifacts for real. The following command will publish the artifacts to GitHub, `Quay.io` and to our
       [helm chart repository](https://charts.jetstack.io):

        ```bash
        # Must be run from the "cert-manager/release" repo folder.
        cmrel publish --nomock --release-name "$RELEASE_VERSION"
        ```

        :::info

        ⏰ Upon completion there will be:
        <ol>
         <li>
            <a href="https://github.com/cert-manager/cert-manager/releases">A draft release of cert-manager on GitHub</a>
         </li>
         <li>
            <a href="https://github.com/jetstack/jetstack-charts/pulls">A pull request containing the new Helm chart</a>
         </li>
        </ol>

        :::

    4. While the build is running, send a fourth Slack message in reply to the first message:

        :::info

        Follow the `cmrel publish` build: https://console.cloud.google.com/cloud-build/builds/b6fef12b-2e81-4486-9f1f-d00592351789?project=1021342095237

        :::

13. Publish the GitHub release:

    1. Visit the draft GitHub release and paste `github-release-description.md` that you
       generated earlier. You will need to manually edit the content to match
       the style of earlier releases and to explain what's in the release.

    2. **(initial alpha, subsequent alpha and beta only)** Tick the box "This is
       a pre-release".

    3. **(final release and patch release)** Tick the box "Set as the latest
       release".

    4. Click "Publish" to make the GitHub release live.

14. Merge the pull request containing the Helm chart:

    Important: This PR can currently only be merged by CyberArk employees, but we're aiming to fix that soon. Changing this
    will involve us coming up with a plan for migrating where our Helm charts are stored and ensuring we don't break anyone.

    The Helm charts for cert-manager are served using Cloudflare pages
    and the Helm chart files and metadata are stored in the [Jetstack charts repository](https://github.com/jetstack/jetstack-charts).
    The `cmrel publish --nomock` step (above) will have created a PR in this repository which you now have to review and merge, as follows:

    1. [Visit the pull request](https://github.com/jetstack/jetstack-charts/pulls)
    2. Review the changes
    3. Fix any failing checks
    4. Test the chart
        1. Download the chart tarball from the pull-request
        2. Start a new local Kind cluster `kind create cluster --name release`
        3. Install the helm chart onto the kind cluster `helm install cert-manager ./cert-manager-v0.15.0.tgz --set crds.enabled=true -n cert-manager`
        4. Ensure install succeeds and all components are running
        5. Tear down the kind cluster `kind delete cluster --name release`
    5. Merge the PR
    6. Check that the [cert-manager Helm chart is visible on ArtifactHUB](https://artifacthub.io/packages/helm/cert-manager/cert-manager).

15. Upload the Helm chart to the OCI registry:

    1. Run the following command to upload the Helm chart to the OCI registry, and sign it with cosign:

       ```bash
       # Must be run from the "cert-manager/release" repo folder.
       ./hack/push_and_sign_chart.sh
       ```

       This command will also check the cosign signature it creates. In addition, it creates a non-V-prefixed tag to enable easier `helm upgrade` commands.

    2. Check that the Helm chart is available in the OCI registry by running:

       ```bash
       crane manifest quay.io/jetstack/charts/cert-manager:$RELEASE_VERSION
       ```

       Look for config, content and provenance layers in the output.

16. **(final + patch releases)** Merge the 4 Website PRs:

    1. Merge the PRs "Release Notes", "Upgrade Notes", and "Freeze And Bump
       Versions" that you have created previously.
    2. Create the PR "Merge release-next into master" by [clicking
       here][ff-release-next].

       If you see the label `dco-signoff: no`, add a comment on the PR with:

       ```text
       /override dco
       ```

       This command is necessary because some the merge commits have been
       written by the bot and do not have a DCO signoff.

      [ff-release-next]: https://github.com/cert-manager/website/compare/master...release-next?quick_pull=1&title=%5BPost-Release%5D+Merge+release-next+into+master&body=%3C%21--%0A%0AThe+command+%22%2Foverride+dco%22+is+necessary+because+some+the+merge+commits%0Ahave+been+written+by+the+bot+and+do+not+have+a+DCO+signoff.%0A%0A--%3E%0A%0A%2Foverride+dco

17. Post a Slack message as an answer to the first message. Toggle the check
   box "Also send to `#cert-manager-dev`" so that the message is well
   visible. Also cross-post the message on `#cert-manager`.

    :::info

    https://github.com/cert-manager/cert-manager/releases/tag/v1.0.0 🎉

    :::

18. **(final release only)** Show the release to the world:

    1. Send an email to
       [`cert-manager-dev@googlegroups.com`](https://groups.google.com/g/cert-manager-dev)
       with the `release` label
       ([examples](https://groups.google.com/g/cert-manager-dev?label=release)).

    2. Send a tweet on the cert-manager Twitter account! Login details are in the cert-manager 1password.
       ([Example tweet](https://twitter.com/CertManager/status/1612886311957831680)).

    3. Send a toot from the cert-manager Mastodon account! Login details are in the cert-manager 1password.
       ([Example toot](https://infosec.exchange/@CertManager/109666434738850493))

    4. Create a post on the cert-manager BlueSky account! Login details are in the cert-manager 1password.
       ([Example post](https://bsky.app/profile/cert-manager.bsky.social/post/3lhdtn7c2222u))

19. Proceed to the post-release "testing and release" steps:

    1. **(initial beta only)** Create a PR on
       [cert-manager/testing](https://github.com/cert-manager/testing) in order to
       add the new release to our list of periodic ProwJobs. Use [this PR](https://github.com/cert-manager/testing/pull/907) as an example. You'll need to run the `make prowgen` command to generate the new config.

    2. **(final release only)** Create a PR on
       [cert-manager/testing](https://github.com/cert-manager/testing),
       removing any unsupported release versions from prow config.

    3. **(final release only)** In [`cert-manager/testing`](https://github.com/cert-manager/testing)
       check [`milestone_applier`](https://github.com/cert-manager/testing/blob/3110b68e082c3625bf0d26265be2d29e41da14b2/config/plugins.yaml#L69)
       config so that newly raised PRs on master are applied to a new milestone
       for the next release.

       Also check required status checks for the release branch and testgrid dashboard configuration.

       If the [milestone](https://github.com/cert-manager/cert-manager/milestones) for the next release doesn't exist,
       create it first. If you consider the milestone for the version you just released to be complete, close it.

## Older Releases

The above guide only applies for versions of cert-manager from v1.8 and newer.

Older versions were built using Bazel and this difference in build process is reflected in the release process.

### Krew and Homebrew

Since cmctl used to be part of the cert-manager repo, we'd publish cmctl releases alongside cert-manager. Now that cmctl lives in [its own repo](https://github.com/cert-manager/cmctl) that doesn't
make sense any more, and so any references in this release process or in older versions to publishing to Krew and Homebrew have been removed.

### OLM (OpenShift Operator Lifecycle Manager)

We previously made efforts to publish OLM releases of cert-manager on a best-effort basis. We agreed in early 2025 to discontinue this, since the burden was too much and usually fell unfairly on one maintainer.

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
