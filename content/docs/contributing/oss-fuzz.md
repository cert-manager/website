---
title: OSS-Fuzz Integration
description: "Understanding cert-manager's integration with OSS-Fuzz"
---

cert-manager integrates with [OSS-Fuzz](https://google.github.io/oss-fuzz/) for continuous fuzzing of its codebase. This integration helps identify and fix security vulnerabilities and bugs in the cert-manager code.

By way of example, [`GHSA-r4pg-vg54-wxx4`](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-r4pg-vg54-wxx4) was discovered through OSS-Fuzz testing.

## How OSS-Fuzz is Configured

cert-manager's OSS-Fuzz configuration is defined in the [`google/oss-fuzz` repo](https://github.com/google/oss-fuzz/tree/master/projects/cert-manager).

Specifically, the configuration includes a `project.yaml` file which specifies metadata about the project and, importantly, who has access to view details about fuzz test failures. Failures are embargoed from being published for a period after being reported to prevent exploitation in the event that the failure is a security issue.

The cert-manager setup is based on the [guide for setting up a Go project](https://google.github.io/oss-fuzz/getting-started/new-project-guide/go-lang/).

Warning: Because the fuzz tests require Go code to be linked to C++, the setup is complex, doesn't look like "regular" Go code, and it's not trivial to follow!
