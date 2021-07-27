---
title: "Supported Releases"
linkTitle: "Supported Releases"
weight: 5
type: "docs"
---

<!--
Inspired by https://istio.io/latest/about/supported-releases/
-->

This page lists the status, timeline and policy for currently supported
releases.

Each release is supported for a period of four months, and we create a new
release every two months.

## Supported releases {#supported-releases}

| Release | Release Date | End of life  | [Supported Kubernetes versions][s] | [Supported OpenShift versions][o] |
| ------- | :----------: | :----------: | :--------------------------------: | :-------------------------------: |
| [1.4][] | Jun 15, 2021 | Oct 13, 2021 | 1.16, 1.17, 1.18, 1.19, 1.20, 1.21 |      4.3, 4.4, 4.5, 4.6, 4.7      |
| [1.3][] | Apr 08, 2021 | Aug 11, 2021 | 1.16, 1.17, 1.18, 1.19, 1.20, 1.21 |      4.3, 4.4, 4.5, 4.6, 4.7      |

## Upcoming releases

| Release | Release Date | End of life  |    [Supported Kubernetes versions][s]    | [Supported OpenShift versions][o] |
| ------- | :----------: | :----------: | :--------------------------------------: | :-------------------------------: |
| [1.5][] | Aug 11, 2021 | Dec 15, 2021 | 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22 |   4.3, 4.4, 4.5, 4.6, 4.7, 4.8    |
| 1.6     | Oct 13, 2021 | Feb 16, 2022 |              to be defined               |           to be defined           |
| 1.7     | Dec 15, 2021 | Apr 13, 2022 |              to be defined               |           to be defined           |

Note that dates in the future are uncertain and might change.

## Old releases

| Release  | Release Date |     EOL      | Compatible Kubernetes versions | Compatible OpenShift versions |
| -------- | :----------: | :----------: | :----------------------------: | :---------------------------: |
| [1.2][]  | Feb 10, 2021 | Jun 15, 2021 |          1.16 → 1.21           |           4.3 → 4.7           |
| [1.1][]  | Nov 24, 2021 | Apr 08, 2021 |          1.11 → 1.21           |          3.11 → 4.7           |
| [1.0][]  | Sep 02, 2020 | Feb 10, 2021 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.16][] | Jul 23, 2020 | Nov 24, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.15][] | May 06, 2020 | Sep 02, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.14][] | Mar 11, 2020 | Jul 23, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.13][] | Jan 21, 2020 | May 06, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.12][] | Nov 27, 2019 | Mar 11, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.11][] | Oct 10, 2019 | Jan 21, 2020 |           1.9 → 1.21           |          3.09 → 4.7           |

[s]: #kubernetes-supported-versions
[o]: #openshift-supported-versions
[1.5]: https://github.com/jetstack/cert-manager/milestone/26
[1.4]: https://cert-manager.io/docs/release-notes/release-notes-1.4
[1.3]: https://cert-manager.io/docs/release-notes/release-notes-1.3
[1.2]: https://cert-manager.io/docs/release-notes/release-notes-1.2
[1.1]: https://cert-manager.io/docs/release-notes/release-notes-1.1
[1.0]: https://cert-manager.io/docs/release-notes/release-notes-1.0
[0.16]: https://cert-manager.io/docs/release-notes/release-notes-0.16
[0.15]: https://cert-manager.io/docs/release-notes/release-notes-0.15
[0.14]: https://cert-manager.io/docs/release-notes/release-notes-0.14
[0.13]: https://cert-manager.io/docs/release-notes/release-notes-0.13
[0.12]: https://cert-manager.io/docs/release-notes/release-notes-0.12
[0.11]: https://cert-manager.io/docs/release-notes/release-notes-0.11

You can find available releases on the [releases
page](https://github.com/cert-manager/cert-manager/releases). You can find
the release notes for each minor release
[here](https://cert-manager.io/docs/release-notes/), and the upgrade
instructions are
[here](https://cert-manager.io/docs/installation/upgrading/). The
cert-manager release process is documented on the [release-process
page](https://cert-manager.io/docs/contributing/release-process/).

## Support policy

### What we mean by support

Our support window is four months for each release branch. In the below
diagram, `release-1.2` is an example of a release branch. The support
window corresponds to the two latest releases, given that we produce a new
final release every two months. We offer two types of support:

- [Technical support](#technical-support),
- [Security and bug fixes](#bug-fixes-support).

For example, imagining that the latest release is `v1.2.0`, you can expect
support for both `v1.2.0` and `v1.1.0`. Only the last patch release of each
branch is actually supported.

```diagram
   v1.0.0                                                          ^
 Sep 2, 2020                                                       | UNSUPPORTED
------+---------------------------------------------> release-1.0  | RELEASES
       \                                                           v
        \
         \       v1.1.0
          \    Nov 24, 2021                                        ^
           ---------+-------------------------------> release-1.1  |
                     \                                             | SUPPORTED
                      \                                            | RELEASES
                       \         v1.2.0                            | = the two
                        \      Feb 10, 2021                        |   last
                         ------------+--------------> release-1.2  |   releases
                                      \                            v
                                       \
                                        \
                                         \
                                          -----------> master branch
                                                       April 1, 2021
```

### Technical support {#technical-support}

Technical assistance is offered on a best-effort basis for supported
releases only. You can request support from the community on [Kubernetes
Slack](https://slack.k8s.io/) (in the `#cert-manager` channel), using
[GitHub Discussions][discussions] or using the [cert-manager-dev][group]
Google group.

[discussions]: https://github.com/jetstack/cert-manager/discussions
[group]: https://groups.google.com/g/cert-manager-dev

### Security and bug fixes {#bug-fixes-support}

We back-port important bug fixes — including security fixes — to all
currently supported releases.

- [Security issues](#security-issues),
- [Critical bugs](#critical-bugs),
- [Long-standing bugs](#long-standing-bugs).

#### Security issues {#security-issues}

**Security issues** are fixed as soon as possible. They get back-ported to
the last two releases, and a new patch release is immediately created for
them.

#### Critical bugs {#critical-bugs}

**Critical bugs** include both regression bugs as well as upgrade bugs.

Regressions are functionalities that worked in a previous release but no longer
work. [#4142][], [#3393][] and [#2857][] are three examples of regressions.

Upgrade bugs are issues (often Helm-related) preventing users from
upgrading to currently supported releases from earlier releases of
cert-manager. [#3882][] and [#3644][] are examples of upgrade bugs.

Note that [intentional breaking changes](#breaking-changes) do not belong to
this category.

Fixes for critical bugs are (usually) immediately back-ported by creating a new
patch release for the two currently supported releases.

#### Long-standing bugs {#long-standing-bugs}

**Long-standing bug**: sometimes a bug exists for a long time, and may have
known workarounds. [#3444][] is an example of a long-standing bug.

Where we feel that back-porting would be difficult or might be a stability
risk to clusters running cert-manager, we'll make the fix in a major
release but avoid back-porting the fix.

#### Breaking changes {#breaking-changes}

Breaking changes are changes that intentionally break the cert-manager
Kubernetes API or the command line flags. We avoid making breaking changes
where possible, and where they're required we'll give as much notice as
possible.

[#3393]: https://github.com/jetstack/cert-manager/issues/3393 "Broken CloudFlare DNS01 challenge"
[#2857]: https://github.com/jetstack/cert-manager/issues/2857 "CloudDNS DNS01 challenge crashes cert-manager"
[#4142]: https://github.com/jetstack/cert-manager/issues/4142 "Cannot issue a certificate that has the same subject and issuer"
[#3444]: https://github.com/jetstack/cert-manager/issues/3444 "Certificates do not get immediately updated after updating them"
[#3882]: https://github.com/jetstack/cert-manager/pull/3882: "Helm upgrade from v1.2 to v1.2 impossible due to a Helm bug"
[#3644]: https://github.com/jetstack/cert-manager/issues/3644 "Helm upgrade from v1.2 to v1.2 impossible due to a Helm bug"


## How we determine supported Kubernetes versions {#kubernetes-supported-versions}

The list of supported Kubernetes versions displayed in the [Supported
Releases](#supported-releases) section depends on what the cert-manager
maintainers think is reasonable to support and to test.

Our testing coverage is:

| Release branch | Prow configuration            | Dashboard                 | Kubernetes versions tested   |  Periodicity  |
| :------------: | :---------------------------- | :------------------------ | :--------------------------- | :-----------: |
|      PRs       | [`presubmits.yaml`][]         | [`presubmits-blocking`][] | 1.21                         |  On each PR   |
|     master     | [`periodics.yaml`][]          | [`master`][]              | 1.16, 1.17, 1.18, 1.19, 1.21 | Every 2 hours |
|  release-1.5   | [`next-periodics.yaml`][]     | [`next`][]                | 1.16, 1.17, 1.18, 1.19, 1.21 | Every 2 hours |
|  release-1.4   | [`previous-periodics.yaml`][] | [`previous`][]            | 1.16, 1.17, 1.18, 1.19, 1.21 | Every 2 hours |
|  release-1.3   | N/A                           |                           | N/A                          |      N/A      |

[`presubmits.yaml`]: https://github.com/jetstack/testing/blob/master/config/jobs/cert-manager/cert-manager-presubmits.yaml
[`periodics.yaml`]: https://github.com/jetstack/testing/blob/master/config/jobs/cert-manager/cert-manager-periodics.yaml
[`next-periodics.yaml`]: https://github.com/jetstack/testing/blob/master/config/jobs/cert-manager/release-next/cert-manager-release-next-periodics.yaml
[`previous-periodics.yaml`]: https://github.com/jetstack/testing/blob/master/config/jobs/cert-manager/release-previous/cert-manager-release-previous-periodics.yaml
[`presubmits-blocking`]: https://testgrid.k8s.io/jetstack-cert-manager-presubmits-blocking
[`master`]: https://testgrid.k8s.io/jetstack-cert-manager-master
[`next`]: https://testgrid.k8s.io/jetstack-cert-manager-next
[`previous`]: https://testgrid.k8s.io/jetstack-cert-manager-previous

The oldest Kubernetes release supported by cert-manager is 1.16, as we want
to be supporting most commercial Kubernetes offerings.

|   Vendor   | Oldest Kubernetes Release\* | Other Old Kubernetes Releases                                |
| :--------: | :-------------------------: | ------------------------------------------------------------ |
| [EKS][eks] |     1.16 (EOL Jul 2021)     | 1.17 (EOL Sep 2021), 1.18 (EOL Nov 2021), 1.19 (EOF Apr 2022) |
| [GKE][gke] |     1.17 (EOL Nov 2021)     | 1.18 (EOL Dec 2021), 1.19 (EOL Feb 2022)                     |
| [AKS][aks] |     1.18 (EOL Jul 2021)     | 1.19 (EOL Aug 2021)                                          |

\*As of June 22, 2021.

[eks]: https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html#kubernetes-release-calendar
[gke]: https://cloud.google.com/kubernetes-engine/docs/release-schedule
[aks]: https://docs.microsoft.com/en-us/azure/aks/supported-kubernetes-versions#aks-kubernetes-release-calendar

## OpenShift supported versions {#openshift-supported-versions}

We maintain the following table to remember the mapping between OpenShift and
Kubernetes versions. The dates are an estimate based on the [OpenShift Updates
page](https://access.redhat.com/support/policy/updates/openshift#dates).

| Version | Kubernetes | EOL            |
| ------- | ---------- | -------------- |
| 4.8     | 1.21       | 01 Nov 2022\*  |
| 4.7     | 1.20       | 01 Jun 2022\*  |
| 4.6 EUS | 1.19       | 24 May 2022    |
| 4.6     | 1.19       | 01 Dec 2021\*  |
| 4.5     | 1.18       | 01 July 2021\* |
| 4.4     | 1.17       | 24 Feb 2021    |
| 4.3     | 1.16       | 27 Oct 2020    |
| 4.2     | 1.14       | 13 Jul 2020    |
| 4.1     | 1.13       | 05 May 2020    |

\*Estimated as of June 22, 2021, given that the average number of months between
two OpenShift releases is 5 to 6 months.

With regard to OpenShift Container Platform 3, cert-manager 1.2 is the last
release to support OpenShift 3.11 (Kubernetes 1.11). Although OpenShift 3.11 is
still supported by Red Hat until June 2022, keeping support for very old
versions of Kubernetes had become too much of a burden.

## Terminology

The term "release" (or "minor release") refers to one minor version of
cert-manager. For example, 1.2 and 1.3 are two releases. Note that we do
not use the prefix `v` for releases (just "1.2"). This is because releases
are not used as git tags.

Patch releases use the `v` prefix (e.g., `v1.2.0`, `v1.3.1`...) since one
patch release = one git tag. The initial patch release is called "final
release":

| Type of release | Example of git tag | Corresponding release | Corresponding release branch\* |
| --------------- | ------------------ | --------------------- | ------------------------------ |
| Final release   | `v1.3.0`           | 1.3                   | `release-1.3`                  |
| Patch release   | `v1.3.1`           | 1.3                   | `release-1.3`                  |
| Pre-release     | `v1.4.0-alpha.0`   | N/A\*\*               | `release-1.4`                  |

\*For maintainers: each release has an associated long-lived branch that we
call the “release branch”. For example, `release-1.2` is the release branch
for release 1.2.

\*\*Pre-releases (e.g., `v1.3.0-alpha.0`) don't have a corresponding
release (e.g., 1.3) since a release only exists after a final release
(e.g., `v1.3.0`) has been created.

Our naming scheme mostly follows [Semantic Versioning
2.0.0](https://semver.org/) with `v` prepended to git tags and docker
images:

```plain
v<major>.<minor>.<patch>
```

where `<minor>` is increased for each release, and `<patch>` counts the
number of patches for the current `<minor>` release. A patch is usually a
small change relative to the `<minor>` release.
