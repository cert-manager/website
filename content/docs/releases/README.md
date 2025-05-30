---
title: Supported Releases
description: Supported releases, Kubernetes versions, OpenShift versions and upcoming release timeline
---

This page lists the status, timeline and policy for currently supported releases of cert-manager.

All cert-manager releases are supported at least until the release of a second subsequent version.
That means there are always at least two supported versions of cert-manager. The open source cert-manager project
doesn't maintain long term support (LTS) releases, but some [vendors](#long-term-support-releases) do provide LTS releases commercially.

We aim to do regular releases roughly every 4 months but release dates can vary when accounting for holidays,
conferences (such as KubeCon), maintainer commitments and other world events.

You don't have to wait until the next minor release to start using new features; we also aim to
create regular alpha releases which - while not as thoroughly tested or stable as other releases -
should be stable enough to run.

<a id="supported-releases"></a>
## Currently supported releases

| Release      | Release Date | End of Life            | [Supported Kubernetes / OpenShift Versions][s] | [Tested Kubernetes Versions][test] |
|:------------:|:------------:|:----------------------:|:----------------------------------------------:|:----------------------------------:|
| [1.17][]     | Feb 03, 2025 | Release of 1.19        |       1.29 → 1.32   /   4.16 → 4.17            |  1.29 → 1.32                       |
| [1.16][]     | Oct 03, 2024 | Release of 1.18        |       1.25 → 1.32   /   4.14 → 4.17            |  1.27 → 1.31                       |

## Upcoming releases

| Release  | Release Date | End of Life     | [Supported Kubernetes / OpenShift Versions][s] | [Tested Kubernetes Versions][test] |
|:--------:|:------------:|:---------------:|:----------------------------------------------:|:----------------------------------:|
| [1.18][] | Jun 04, 2025 | Release of 1.20 | 1.29 → 1.33 / 4.16 → 4.17                      | 1.30 → 1.33                        |

Dates in the future are not firm commitments and are subject to change.

We list cert-manager releases on [GitHub](https://github.com/cert-manager/cert-manager/releases),
and release notes on [cert-manager.io](https://cert-manager.io/docs/release-notes/).

We also maintain detailed [upgrade instructions](https://cert-manager.io/docs/releases/upgrading/).

<a id="long-term-support-releases"></a>
## Long Term Support Releases

The cert-manager maintainers do not provide long term support (LTS) releases.

Once a version reaches end of life, there are no updates provided for that version and no further releases made.

Some vendors provide long term support releases commercially; the following LTS releases are available:

| Release      | Vendor       | End of Life    |
|:------------:|:------------:|:--------------:|
| 1.17 LTS     | [CyberArk][] | Feb 03 2027    |

[CyberArk]: https://docs.venafi.cloud/vaas/k8s-components/c-cm-releases/#cert-manager-long-term-support-lts-releases

(To add a release to this list, raise a PR and reach out on Slack)

## Support policy

<a id="supported-vs-tested"></a>
### Supported vs Tested Versions of Kubernetes

In general, we aim to run regular end-to-end tests of all Kubernetes versions which we list as supported.

For various reasons, this isn't always possible; a big factor is which Kubernetes versions are supported
by [Kind](https://github.com/kubernetes-sigs/kind), which is used in our end-to-end tests.

If a Kubernetes version is listed as "tested", you can be sure that we run end-to-end tests of cert-manager
on that version regularly and we'd fix any issues that we saw in those end-to-end tests.

If a Kubernetes version is not listed as "tested" but is listed as "supported", we don't run tests regularly for that
Kubernetes release, but we _will_ still respond to and fix any bug reports for that version.

For example, cert-manager 1.12 LTS might list supported versions of Kubernetes as 1.22 → 1.31 but only test 1.22 → 1.29.
That means that:

- We will fix community-reported issues for cert-manager 1.12 on Kubernetes 1.30 or 1.31
- We will not run automated tests for cert-manager 1.12 on Kubernetes 1.30 or 1.31
- We will not generally test or fix issues for cert-manager 1.12 on Kubernetes 1.21 or earlier

### What we mean by support

Our support window is four months for each release branch. In the below
diagram, `release-1.2` is an example of a release branch.

We offer two types of support:

- [Technical support](#technical-support),
- [Security and bug fixes](#bug-fixes-support).

For example, imagining that the latest release is `v1.2.0`, you can expect
support for both `v1.2.0` and `v1.1.0`.

Only the last patch release of each branch is supported.

```diagram
   v1.0.0                                                          ^
 Sep 2, 2020                                                       | UNSUPPORTED
------+---------------------------------------------> release-1.0  | RELEASES
       \                                                           v
        \
         \       v1.1.0
          \    Nov 24, 2020                                        ^
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

<a id="technical-support"></a>
### Technical support

Technical assistance is offered on a best-effort basis for supported
releases only. You can request support from the community on [Kubernetes
Slack](https://slack.k8s.io/) (in the `#cert-manager` channel), using
[GitHub Discussions][discussions] or using the [cert-manager-dev][group]
Google group.

[discussions]: https://github.com/cert-manager/cert-manager/discussions
[group]: https://groups.google.com/g/cert-manager-dev

<a id="bug-fixes-support"></a>
### Security and bug fixes

We back-port important bug fixes — including security fixes — to all
currently supported releases.

- [Security issues](#security-issues),
- [Critical bugs](#critical-bugs),
- [Long-standing bugs](#long-standing-bugs).

<a id="security-issues"></a>
#### Security issues

**Security issues** are fixed as soon as possible. They get back-ported to
the last two releases, and a new patch release is immediately created for them.

<a id="critical-bugs"></a>
#### Critical bugs

**Critical bugs** include both regression bugs as well as upgrade bugs.

Regressions are functionalities that worked in a previous release but no longer
work. [#4142][], [#3393][] and [#2857][] are three examples of regressions.

Upgrade bugs are issues (often Helm-related) preventing users from
upgrading to currently supported releases from earlier releases of
cert-manager. [#3882][] and [#3644][] are examples of upgrade bugs.

Note that [intentional breaking changes](#breaking-changes) do not belong to
this category.

Fixes for critical bugs are (usually) immediately back-ported by creating a new
patch release for the currently supported releases.

<a id="long-standing-bugs"></a>
#### Long-standing bugs

**Long-standing bug**: sometimes a bug exists for a long time, and may have
known workarounds. [#3444][] is an example of a long-standing bug.

Where we feel that back-porting would be difficult or might be a stability
risk to clusters running cert-manager, we'll make the fix in a major
release but avoid back-porting the fix.

<a id="breaking-changes"></a>
#### Breaking changes

Breaking changes are changes that intentionally break the cert-manager
Kubernetes API or the command line flags. We avoid making breaking changes
where possible, and where they're required we'll give as much notice as
possible.

<a id="other-backports"></a>
#### Other back-ports

We aim to be conservative in what we back-port. That applies especially for anything which
could be a _runtime_ change - that is, a change which might alter behavior for someone
upgrading between patch releases.

That means that if a candidate for back-porting has a chance of having a runtime impact we're
unlikely to accept the change unless it addresses a security issue or a critical bug.

We reserve the right to back-port other changes which are unlikely to have a runtime impact, such as
documentation or tooling changes. An example would be [#5209][] which updated how we perform a release of
cert-manager but didn't have any realistic chance of having a runtime impact.

Generally we'll seek to be pragmatic. A rule of thumb might be to ask:

"Does this back-port improve cert-manager, bearing in mind that we really value stability for already-released versions?"

[#3393]: https://github.com/cert-manager/cert-manager/issues/3393 "Broken CloudFlare DNS01 challenge"
[#2857]: https://github.com/cert-manager/cert-manager/issues/2857 "CloudDNS DNS01 challenge crashes cert-manager"
[#4142]: https://github.com/cert-manager/cert-manager/issues/4142 "Cannot issue a certificate that has the same subject and issuer"
[#3444]: https://github.com/cert-manager/cert-manager/issues/3444 "Certificates do not get immediately updated after updating them"
[#3882]: https://github.com/cert-manager/cert-manager/pull/3882 "Certificate's revision history limit validated by webhook"
[#3644]: https://github.com/cert-manager/cert-manager/issues/3644 "Helm upgrade from v1.2 to v1.2 impossible due to a Helm bug"
[#5209]: https://github.com/cert-manager/cert-manager/pull/5209 "release-1.8: rclone"


<a id="kubernetes-supported-versions"></a>
## How we determine supported Kubernetes versions

The list of supported Kubernetes versions displayed in the [Supported Releases](#supported-releases) section
depends on what the cert-manager maintainers think is reasonable to support and to test.

In practice, this is largely determined based on what versions of [kind](https://github.com/kubernetes-sigs/kind)
are available for testing, and which versions of Kubernetes are provided by major upstream cloud Kubernetes vendors
including <abbr title="Amazon Elastic Kubernetes Service">EKS</abbr>, <abbr title="Google Kubernetes Engine">GKE</abbr>, <abbr title="Azure Kubernetes Service">AKS</abbr> and OpenShift.

We treat OpenShift <abbr title="Extended Update Support">EUS</abbr> as a different distribution since the support periods are so much longer.
We're likely to drop support for older OpenShift EUS before that release reaches EOL to increase the speed at which we can adopt
newer Kubernetes features.

The table below lists the major Kubernetes distributions we check. In parentheses next to each release is the <abbr title="End-of-life">EOL</abbr>
for that release. EOL dates often change throughout the lifecycle of a release.

The "Oldest Kubernetes Release" is the oldest release we deemed relevant to the next cert-manager release, as of 2024-09-25

|      Vendor           |  Oldest K8s Release   |                      Other Kubernetes Releases                       |
|:---------------------:|:---------------------:|----------------------------------------------------------------------|
|    [EKS][eks]         | 1.30 (Jul 2025)       | 1.31 (Nov 2025), 1.32 (TBD)                                          |
|    [GKE][gke]         | 1.30 (Jul 2025)       | 1.31 (Sep 2025)                                                      |
|    [AKS][aks]         | 1.30 (Jul 2025)       | 1.31 (Nov 2025), 1.32 (Mar 2026)                                     |
| [OpenShift 4][os]     | 1.28 (4.15, Aug 2025) | 1.29 (4.16, Dec 2025), 1.30 (4.17, Apr 2026)                         |
| [OpenShift 4 EUS][os] | 1.27 (4.14, Oct 2025) | 1.29 (4.16, Jun 2026)                                                |

[eks]: https://endoflife.date/amazon-eks
[gke]: https://endoflife.date/google-kubernetes-engine
[aks]: https://learn.microsoft.com/en-us/azure/aks/supported-kubernetes-versions?tabs=azure-cli#aks-kubernetes-release-calendar
[os]: https://endoflife.date/red-hat-openshift

### OpenShift

cert-manager supports OpenShift 4 based on the version of Kubernetes
that each release maps to.

For convenience, the following table shows these version mappings:

| OpenShift versions | Kubernetes version |
|:------------------:|--------------------|
| 4.17               | 1.30               |
| 4.16, 4.16 EUS     | 1.29               |
| 4.15               | 1.28               |
| 4.14, 4.14 EUS     | 1.27               |
| 4.13               | 1.26               |
| 4.12, 4.12 EUS     | 1.25               |
| 4.11               | 1.24               |
| 4.10, 4.10 EUS     | 1.23               |
| 4.9                | 1.22               |

Note that some OpenShift versions listed above may be predicted, since an updated version of OpenShift may
not yet be available for the latest Kubernetes releases.

The last version of cert-manager to support OpenShift 3 was cert-manager 1.2, which is
no longer maintained.

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

## Old cert-manager releases

These cert-manager releases have reached their <abbr title="end-of-life">EOL</abbr> date and
are no longer supported.

| Release      | Release Date |     EOL      | Compatible Kubernetes versions | Compatible OpenShift versions |
|--------------|:------------:|:------------:|:------------------------------:|:-----------------------------:|
| [1.15][]     | Jun 05, 2024 | Feb 03, 2025 |          1.25 → 1.32           |          4.12 → 4.16          |
| [1.14][]     | Feb 03, 2024 | Oct 03, 2024 |          1.24 → 1.31           |          4.11 → 4.16          |
| [1.13][]     | Sep 12, 2023 | Jun 05, 2024 |          1.21 → 1.27           |          4.8 → 4.14           |
| [1.12 LTS][] | May 19, 2023 | May 19, 2025 |          1.22 → 1.32           |          4.9 → 4.16           |
| [1.11][]     | Jan 11, 2023 | Sep 12, 2023 |          1.21 → 1.27           |          4.8 → 4.14           |
| [1.10][]     | Oct 17, 2022 | May 19, 2023 |          1.20 → 1.26           |          4.7 → 4.13           |
| [1.9][]      | Jul 22, 2022 | Jan 11, 2023 |          1.20 → 1.24           |          4.7 → 4.11           |
| [1.8][]      | Apr 05, 2022 | Oct 17, 2022 |          1.19 → 1.24           |          4.6 → 4.11           |
| [1.7][]      | Jan 26, 2021 | Jul 22, 2022 |          1.18 → 1.23           |          4.5 → 4.9            |
| [1.6][]      | Oct 26, 2021 | Apr 05, 2022 |          1.17 → 1.22           |          4.4 → 4.9            |
| [1.5][]      | Aug 11, 2021 | Jan 26, 2022 |          1.16 → 1.22           |          4.3 → 4.8            |
| [1.4][]      | Jun 15, 2021 | Oct 26, 2021 |          1.16 → 1.21           |          4.3 → 4.7            |
| [1.3][]      | Apr 08, 2021 | Aug 11, 2021 |          1.16 → 1.21           |          4.3 → 4.7            |
| [1.2][]      | Feb 10, 2021 | Jun 15, 2021 |          1.16 → 1.21           |          4.3 → 4.7            |
| [1.1][]      | Nov 24, 2020 | Apr 08, 2021 |          1.11 → 1.21           |          3.11 → 4.7           |
| [1.0][]      | Sep 02, 2020 | Feb 10, 2021 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.16][]     | Jul 23, 2020 | Nov 24, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.15][]     | May 06, 2020 | Sep 02, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.14][]     | Mar 11, 2020 | Jul 23, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.13][]     | Jan 21, 2020 | May 06, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.12][]     | Nov 27, 2019 | Mar 11, 2020 |          1.11 → 1.21           |          3.11 → 4.7           |
| [0.11][]     | Oct 10, 2019 | Jan 21, 2020 |           1.9 → 1.21           |          3.09 → 4.7           |


NB: cert-manager 1.12 was a public Long Term Support (LTS) release sponsored by [Venafi](https://www.venafi.com/). It was supported for 2 years from release.

[s]: #kubernetes-supported-versions
[test]: #supported-vs-tested
[1.18]: https://github.com/cert-manager/cert-manager/milestone/40
[1.17]: ./release-notes/release-notes-1.17.md
[1.16]: ./release-notes/release-notes-1.16.md
[1.15]: ./release-notes/release-notes-1.15.md
[1.14]: ./release-notes/release-notes-1.14.md
[1.13]: ./release-notes/release-notes-1.13.md
[1.12 LTS]: ./release-notes/release-notes-1.12.md
[1.11]: ./release-notes/release-notes-1.11.md
[1.10]: ./release-notes/release-notes-1.10.md
[1.9]: ./release-notes/release-notes-1.9.md
[1.8]: ./release-notes/release-notes-1.8.md
[1.7]: ./release-notes/release-notes-1.7.md
[1.6]: ./release-notes/release-notes-1.6.md
[1.5]: ./release-notes/release-notes-1.5.md
[1.4]: ./release-notes/release-notes-1.4.md
[1.3]: ./release-notes/release-notes-1.3.md
[1.2]: ./release-notes/release-notes-1.2.md
[1.1]: ./release-notes/release-notes-1.1.md
[1.0]: ./release-notes/release-notes-1.0.md
[0.16]: ./release-notes/release-notes-0.16.md
[0.15]: ./release-notes/release-notes-0.15.md
[0.14]: ./release-notes/release-notes-0.14.md
[0.13]: ./release-notes/release-notes-0.13.md
[0.12]: ./release-notes/release-notes-0.12.md
[0.11]: ./release-notes/release-notes-0.11.md

{/*
This page is inspired by https://istio.io/latest/about/supported-releases/
*/}
