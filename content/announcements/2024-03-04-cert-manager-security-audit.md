---
slug: cert-manager-security-audit
title: cert-manager completes it security audit!
description: As part of our graduation processes cert-manager has completed a security audit of the project
date: 03-04-2024
---

Between late 2023 and early 2024 the cert-manager project has undergone a security audit by the team at [Ada Logics](https://adalogics.com/). This is part of the ongoing [graduation of cert-manager](https://github.com/cncf/toc/pull/1212).

The goal of the engagement was to assess cert-managers code quality, its development and its release practices. The thread model was determined along with potential threat actors, the codebase was reviewed, dependencies were evaluated and the project was integrated into OSS-Fuzz.

The threat model of cert-manager is built upon the existing threat model for acquiring certificates from issuers. However, the specific procedures for acquiring certificates as documented by external entities were not scrutinized in this audit. 

Threat actors include contributors to cert-manager or any of its dependencies, users on the clusters where cert-manager is deployed and external users in cases where cert-manager is deployed in use cases that process input from untrusted internet users. 

For a full breakdown of the threat model and actors, see the [full report](TODO). 

A total of 8 issues were raised as part of the audit, of which 5 were low severity, 2 were moderate severity and 1 was informational. All issues have been resolved as of cert-manager 1.12.8, v1.13.4 and 1.14.3.

Dependencies of the cert-manager project were assessed using [OpenSSF Scorecard](https://github.com/ossf/scorecard). This is a process that scores repositories using several factors to build a picture of their maintenance status and suitability. Based on the results, three dependencies have been removed from cert-manager. The full findings and scoring for dependencies can be found on the [full report](TODO). 

On top of assessing existing dependencies, the cert-manager team have [opened an issue](TODO) to investigate how we can implement a strategy for evaluating new dependencies as they arise.

Thanks to to team at [Ada Logics](https://adalogics.com/), in particular Adam Korczynski and David Korczynski for completing this audit, it was an all-round pleasant experience with no real hiccups. Also thanks to CNCF who facilitated this audit and are key to the ongoing support of cert-manager.