---
title: Contributing Flow
description: 'cert-manager contributing guide: Contribution flow'
---

All of cert-manager's development is done via
[GitHub](https://github.com/cert-manager/cert-manager) which contains code, issues and pull
requests.

All code for the documentation and cert-manager.io can be found at [the cert-manager/website repo](https://github.com/cert-manager/website/).
Any issues towards the documentation should also be filed there.

## GitHub bot

We use [Prow](https://github.com/k8s-ci-robot/test-infra/tree/master/prow) on all our repositories.
If you've ever looked at a Kubernetes repo, you will probably already have met Prow. Prow will be able to help you in GitHub using its commands.
You can find then all [on the command help page](https://prow.build-infra.jetstack.net/command-help).
Prow will also run all tests and assign certain labels on PRs.

## Bugs

All bugs should be tracked as issues inside the
[GitHub](https://github.com/cert-manager/cert-manager/issues) repository. Issues should then be
attached with the `kind/bug` tag. To do this add `/kind bug` to your issue description.
This may then be assigned a priority and milestone to be addressed in a future release.

The more logs and information you can give about what and how the bug has been
discovered, the faster it can be resolved.

Critical bug fixes are typically also cherry picked to the current minor stable releases.

> Note: If you are simply looking for _troubleshooting_ then you should post
> your question to the community `cert-manager` [slack channel](https://slack.k8s.io).
> Many more people read this channel than GitHub issues, it's likely your problem will
> be solved quicker by using Slack.
> Please also check that the bug has not already been filed by searching for key
> terms in the issue search bar.

### (Re)opening and closing issues

Prow can assist you to reopen or close issues you file, you can trigger it using `/reopen` or `/close` in a GitHub Issue comment.

## Features

Feature requests should be created as
[GitHub](https://github.com/cert-manager/cert-manager/issues) issues. They should contain
clear motivation for the feature you wish to see as well as some possible
solutions for how it can be implemented.
Issues should then be tagged with `kind/feature`. To do this add `/kind feature` to your issue description.

> Note: It is often a good idea to bring your feature request up on the
> community `cert-manager` [slack channel](https://slack.k8s.io) to discuss whether
> the feature request has already been made or is aligned with the project's
> priorities.

## Creating Pull Requests

Changes to the cert-manager code base is done via [pull
requests](https://github.com/cert-manager/cert-manager/pulls). Each pull request
should ideally have a corresponding issue attached that is to be fixed by this
pull request. It is valid for multiple pull requests to resolve a single issue
in the interest of keeping code changes self contained and simpler to review.

Once created, a team member will assign themselves for review and enable
testing. To make sure the changes get merged, keep an eye out for reviews which
can have multiple cycles.

If the pull request is a critical bug fix then this will probably
also be cherry picked to the current stable version of cert-manager as a patch
release.

To let people know that your PR is still a work in progress, we usually add a
`WIP:` prefix to the title of the PR. Prow will then automatically set the label
`do-not-merge/work-in-progress`.


### Cherry Picking

If the pull request contains a critical bug fix then this should be cherry picked in to the current stable cert-manager branch 
and [released as a patch release](../installation/supported-releases.md#support-policy).

To trigger the cherry-pick process, add a comment to the GitHub PR.
For example:
```
/cherry-pick release-x.y
```

The `jetstack-bot` will then create a new branch and a PR against the release branch,
which should be reviewed, approved and merged using the process described above.

### DCO signoff

All commits in the PR should be signed off, more info on how to do this is at the [DCO Sign Off](./sign-off.md) page.
Exceptions can only be made for small documentation fixes.

## Project Management

Most of cert-manager's project management is done on GitHub, with the help of Prow.

### When will something be released?

Our team works using [GitHub milestones](https://github.com/cert-manager/cert-manager/milestones).
When a milestone is set on an Issue it is generally an indication of when we plan to address this.
Prow will apply milestones on merged PRs, this will tell you in which version that PR will land.

The milestone page will also have an indicated due date when we will release. This might have some delay.
We brief our users/contributors about this in our bi-weekly community meeting, for an up to date status report we recommend joining these.

### Labels

We make a heavy use of GitHub labels for PRs and Issues. The ones on PRs are mostly managed by Prow and code reviewers.
In issues we always aim to add 3 types: area, priority and kind. These are set using Prow using `/area`, `/kind` and `/priority`.
Sometimes `/triage` is also added which helps us when following up Issues.

* Area indicates the code area which is/will need changing
* Kind indicates if it is a `bug` or a `feature` but also can be `documentation` or `cleanup` (general maintenance)
* Priority is the priority it has for the cert-manager team, PRs are still very welcome for those!

### Assignees meaning in PRs and issues

Sometimes, you might see someone commenting with the
[`/assign` prow command](https://prow.build-infra.jetstack.net/command-help#assign):

```plain
/assign @meyskens
```

Here is the meaning that we give to the GitHub assignees:

- On issues, it means that the assignee is working on it.
- On PRs, we use it as a way to know who should be taking a look at the PR at any time:
  - When the author is assigned, it means the PR needs work to be done aka "changes requested";
  - When nobody is assigned, it means this PR needs review;
  - When someone different from the author is assigned, it means this person is reviewing this PR.

### Triage Party!

Every few weeks we will plan a Triage Party meeting, where we use the (Triage Party)[https://triage.build-infra.jetstack.net/] tool to go recent/old issues to prioritise them so we can address them in a timely matter. These meetings are open to everyone and invites will be sent out using our mailing list (warning: despite the word party these meetings are sometimes boring).