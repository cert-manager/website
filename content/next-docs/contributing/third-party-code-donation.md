---
title: Donating Third Party Code to cert-manager
description: 'cert-manager contributing: Third party code donations'
---

The cert-manager project welcomes external contributions and has benefited greatly from thousands
of commits from hundreds of different contributors. Most code is usually committed through pull
requests to a specific repo, whether that be the main cert-manager repository or one of the associated
repositories such as the website.

Some contributions aren't as well suited to that kind of workflow, however. That would most likely
be because their functionality doesn't belong in any particular existing cert-manager repo, while still
relating to the cert-manager project.

This document aims to address the donation of code to the cert-manager project, and to provide a
framework for sustainable contributions which can be tested and relied upon going forwards by both
cert-manager maintainers and users.

The requirements in this document are based in part on what's done for CoreDNS, Envoy, Kubernetes
and containerd.

## Requirements

1.  Code must be licensed appropriately, including any dependencies   
    We'd prefer [Apache 2.0](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)) since that's
    what cert-manager [uses](https://github.com/cert-manager/cert-manager/blob/master/LICENSE), but the
    license must be [OSI approved](https://opensource.org/licenses).
2.  Code must conform to CNCF standards and due diligence requirements   
    You don't need to go over this with a fine-toothed comb; the intent here is that no code donation
    should have a negative effect on cert-manager's progress as a CNCF project. See the
    [CNCF due diligence template](https://github.com/cncf/toc/blob/main/process/dd-review-template.md)
3.  Must be sponsored by an existing maintainer   
    An existing regular contributor to cert-manager must sponsor the adoption of any third party code
    donation. This ensures that there's a single point of contact for the party donating the code.
4.  Must pass cert-manager conformance tests   
    This might not apply to all donations, but where conformance tests exist any donated code must
    pass them. E.g. for [external issuers](https://github.com/cert-manager/cert-manager/blob/dffbf391dbb0fc6c1cfea62e561a9c6f54362ab0/test/e2e/suite/conformance/certificates/external/external.go#L41-L62)
5.  Must provide a point-of-contact for questions about the project for at least 3 months after acceptance
    We don't anticipate that we'd need to reach out often after the donation has been accepted,
    but it's important to have someone we can reach out to if we need to.
6.  The donation must be a defined extension type or justify why it doesn't belong in the main repositories   
    E.g. an ACME DNS solver, a custom issuer or an ACME HTTP solver
7.  Code must have a similar level of quality to cert-manager itself
    This could be enforced by, for example, running static analysis tools on the code base similar to
    those used by cert-manager.
8.  Code must have a non-trivial test suite, including both unit tests and end-to-end tests
    These tests must be able to be run in their entirety after a PR is raised against the repo. We don't
    need 100% code coverage, but there should be tests for important functionality.
9.  The project must adopt the cert-manager security policy and link back to the policy, as in e.g.
    the [istio-csr `SECURITY.md`](https://github.com/cert-manager/istio-csr/blob/master/SECURITY.md)
10. Must have DCO sign-offs or coverage for all commits
    To ensure that all code can legally be donated, all commits should have DCO sign-off or else have
    a positive affirmation made by each contributor prior to donation. See below.

## Preferences

These items are not absolutely necessary but they definitely help if a code donation is to be accepted.

- Should be written in Go   
  We don't _need_ code to be written in Go, but we'd much prefer that it is. Since cert-manager itself
  is written in Go, code donations in Go allow us to use existing experience and tooling on Go code.

## DCO Signoff

As a method of ensuring that the donator has permission to donate the code, we require DCO sign-offs -
or something equivalent - to be in place at the time of the donation.

The cert-manager [DCO signoff process](https://cert-manager.io/docs/contributing/sign-off/)
would be appropriate. Existing contributors could bootstrap this process by creating an empty signed-off
with a note that previous code should be considered signed off as of that commit:

```bash
git commit --allow-empty --signoff --message="bootstrapping DCO signoff for past commits"
```

## After Donation

Code files in the donated repository must be updated to include the relevant 
[cert-manger boilerplate](https://github.com/cert-manager/cert-manager/blob/master/hack/boilerplate/boilerplate.go.txt)