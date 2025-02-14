---
slug: cert-manager-fuzzing-audit
title: cert-manager Completes CNCF-Sponsored Fuzzing Audit
description: As part of our graduation, cert-manager has completed a fuzzing audit.
date: "2025-02-14T09:00:00Z"
---

In November 2024, cert-manager began a fuzzing audit to ensure our fuzzing efforts are up to the highest standard. We did this to ensure that cert-manager is thouroughly tested by way of fuzzing. Fuzzing is an important technique for finding reliability issues and security vulnerabilities in software systems. A well-designed and implemented fuzzing suite allows us to understand where our reliability and security issues are in cert-manager - if there are any.

[Ada Logics](https://adalogics.com) carried out the fuzzing audit. They first assessed cert-managers fuzzing setup; cert-manager had an initial fuzzing setup [from its security audit](https://cert-manager.io/announcements/2024/03/18/cert-manager-security-audit). This setup was built around cert-managers integration into [OSS-Fuzz](https://github.com/google/oss-fuzz) - a free services by Google for critical open source tools that offers state-of-the-art automation and excessive compute for integrated projects. cert-manager had an initial set of fuzz tests from its security audit, and Ada Logics improved this set by writing fuzz tests for several of cert-managers controllers. These new fuzzers set up the up the controller they test and then invoke the controller such that it reconciles randomized Kubernetes resources. Each fuzzer creates the randomized Kubernetes resources from the fuzzers testcase. This tests the part of cert-managers threat model that lower-privileged users with cluster access can attack. cert-manager wants to be sure that users cannot pass resources to cert-managers controllers that can negatively impact the controllers themselves or other users. The fuzzers from cert-managers fuzzing audit test this in an e2e manner, that is with a near-production scenario.

During cert-managers fuzzing audit, the fuzzers found no issues. OSS-Fuzz continues to run cert-managers fuzzers for as long as it can build them which allows the fuzzers to test future changes to the cert-manager source code. The element of continuity in fuzzing cert-manager has previously been a factor in finding a security vulnerability: Months after our security audit, one of our first fuzzers running on OSS-Fuzz reported a security issue in a parsing routine for PEM bytes which could reduce the availability of the cluster.

With the completion of cert-managers fuzzing audit, we have a state-of-the-art fuzzing suite that covers different parts of our threat model. All of our security contacts are notified when OSS-Fuzz finds crashes from running the fuzzers continuously, and OSS-Fuzz sends an email to our security mailing list, too.

You can read the report from the audit [here](https://github.com/cert-manager/website/blob/master/public/docs/announcements/AdaLogics-2025-cert-manager-fuzzing-audit-report.pdf).
