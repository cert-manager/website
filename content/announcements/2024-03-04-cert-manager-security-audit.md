---
slug: cert-manager-security-audit
title: cert-manager completes it security audit!
description: As part of our graduation processes cert-manager has completed a security audit of the project
date: 03-04-2024
---

In late 2023 the cert-manager project began a security audit, sponsored by the [CNCF](https://www.cncf.io/) and carried out by the team at [Ada Logics](https://adalogics.com/), as part of the ongoing effort for cert-manager to  [reach "graduated" status](https://github.com/cncf/toc/pull/1212) in the CNCF.

The goal of the engagement was to assess cert-manager's code quality, along with checking its development and release practices and dependencies. In addition, the audit team integrated cert-manager into Google's [OSS-Fuzz](https://github.com/google/oss-fuzz) project to help catch bugs on an ongoing basis.

The team evaluated threats from contributors to cert-manager or any of its dependencies, from users on the clusters where cert-manager is deployed and from external users in cases where cert-manager could process input from untrusted internet users. 

For a full breakdown of the threat model and actors, see the [full report](TODO).

A total of 8 issues were raised as part of the audit, of which 5 were low severity, 2 were moderate severity and 1 was informational. All issues have been resolved as of cert-manager v1.12.8, v1.13.4 and v1.14.3.

Dependencies of the cert-manager project were assessed using [OpenSSF Scorecard](https://github.com/ossf/scorecard). This is a process that scores repositories using several factors to build a picture of their maintenance status and suitability. Based on the results, three dependencies have been removed from cert-manager. The full findings and scoring for dependencies can be found on the [full report](TODO). 

We've [opened an issue](TODO) for implementing a strategy for evaluating new dependencies as they arise.

The cert-manager maintainer team would like to send a special thanks to the team at [Ada Logics](https://adalogics.com/) - in particular Adam Korczynski and David Korczynski - for completing this audit smoothly and professionally.

In addition, the project would of course like to thank the CNCF for their sponsorship of this audit, and [Venafi](https://venafi.com/) who sponsored maintainer time to respond to and fix the findings in the report.

This security audit was the last major blocker for cert-manager's journey to graduation, and we'll be looking forward to working closely with the CNCF to try and achieve that goal in the coming months!
