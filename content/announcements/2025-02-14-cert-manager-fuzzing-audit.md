---
slug: cert-manager-fuzzing-audit
title: cert-manager Completes CNCF-Sponsored Fuzzing Audit
description: As part of our graduation, cert-manager has completed a fuzzing audit.
date: "2025-02-14T09:00:00Z"
---

In November 2024, cert-manager began a fuzzing audit to ensure our fuzzing efforts meet the highest standards. The goal was to thoroughly test cert-manager through fuzzing, an important technique for identifying reliability issues and security vulnerabilities in software systems. A well-designed and implemented fuzzing suite enables us to effectively discover edge cases that we might not have otherwise known existed.

[Ada Logics](https://adalogics.com) carried out the fuzzing audit. They first assessed cert-manager's existing fuzzing setup [from its initial Graduation security audit](https://cert-manager.io/announcements/2024/03/18/cert-manager-security-audit). This setup was built around cert-manager's integration into [OSS-Fuzz](https://github.com/google/oss-fuzz), a free service by Google offering compute resources and state-of-the-art automation for critical open source tools.

Ada Logics built upon the initial fuzzing setup by creating fuzz tests for several of cert-manager's controllers. These new fuzzers work by setting up the controller they test and then invoking the controller to reconcile randomized Kubernetes resources derived from the fuzzer's test case. This approach specifically tests parts of cert-manager's threat model that lower-privileged users with cluster access might exploit. The goal is to ensure that users cannot pass malicious resources to cert-manager's controllers in a way that could negatively impact the controllers or other users. The new fuzzers from cert-manager's audit test this in an end-to-end manner, using a near-production setup.

During the fuzzing audit, no issues were found. OSS-Fuzz continues to run cert-manager’s fuzzers as long as it can build them, allowing the fuzzers to test future changes to the cert-manager source code. This continuous fuzzing process has previously played a key role in discovering security vulnerabilities: months after the initial Ada Logics security audit, one of the first fuzzers running on OSS-Fuzz identified a security issue in a parsing routine for PEM-encoded data; exploitation could have caused denial-of-service of cert-manager controllers.

With the completion of cert-manager's fuzzing audit, we have a state-of-the-art fuzzing suite that covers even more of our threat model. All of our security contacts are notified when OSS-Fuzz finds crashes from running the fuzzers continuously, and OSS-Fuzz sends an email to our security mailing list, too.

You can read the report from the audit [here](/docs/announcements/AdaLogics-2025-cert-manager-fuzzing-audit-report.pdf).

A huge thanks to Ada Logics for their superb work and of course to the CNCF for sponsoring!
