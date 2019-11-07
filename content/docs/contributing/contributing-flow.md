---
title: "Contributing Flow"
linkTitle: "contributing-flow"
weight: 70
type: "docs"
---

All of cert-manager's development is done via
[GitHub](https://github.com/jetstack/cert-manager) which contains code, issues and pull
requests.

## Bugs

All bugs should be tracked as issues inside the
[GitHub](https://github.com/jetstack/cert-manager/issues) repository. Issues should then be
attached with the `kind/bug` tag. This may then be assigned a priority and
milestone to be addressed in a future release.

The more logs and information you can give about what and how the bug has been
discovered, the faster it can be resolved.

Critical bug fixes are typically backported to the current minor stable release.

> Note: If you are simply looking for _troubleshooting_ then you should post
> your question to the community `cert-manager` [slack channel](https://slack.k8s.io).
> Please also check that the bug has not already been filed by searching for key
> terms in the issue search bar.

## Features

Feature requests should be created as
[GitHub](https://github.com/jetstack/cert-manager/issues) issues. They should contain
clear motivation for the feature you wish to see as well as some possible
solutions for how it can be implemented.

> Note: It is often a good idea to bring your feature request up on the
> community `cert-manger-dev` [slack channel](https://slack.k8s.io) to discuss whether
> the feature request has already been made or is aligned with the project's
> priorities.

## Creating Pull Requests

Changes to the cert-manager code base is done via [pull
requests](https://github.com/jetstack/cert-manager/pulls). Each pull request
should ideally have a corresponding issue attached that is to be fixed by this
pull request. It is valid for multiple pull requests to resolve a single issue
in the interest of keeping code changes self contained and simpler to review.

Once created, a Jetstack member will assign themselves for review and enable
testing. To make sure the changes get merged, keep an eye out for reviews which
can have multiple cycles.

Once code has been merged, your changes will appear in the next minor release of
cert-manager. If the pull request is a critical bug fix then this will probably
also be backported to the current stable version of cert-manager as a patch
release.
