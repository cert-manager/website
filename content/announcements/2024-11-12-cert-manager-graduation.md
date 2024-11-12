---
slug: cert-manager-graduation
title: cert-manager is now a CNCF Graduated Project!
description: cert-manager joins Kubernetes itself at the Graduated level of the CNCF
date: "2024-11-12T09:00:00Z"
---

The 28th of November 2023 was an important day for the cert-manager project. We [raised](https://github.com/cncf/toc/pull/1212) our first issue on the road to becoming a CNCF Graduated project,
which then grew into [another issue](https://github.com/cncf/toc/issues/1306), a [security audit](./2024-03-18-cert-manager-security-audit.md) and lots of [due diligence](https://github.com/cncf/toc/pull/1416)
over the following months.

We took that step towards graduation chiefly because being Graduated is the highest rung of the ladder that a CNCF project can climb.

There's no higher level - Kubernetes itself is a CNCF Graduated project, along with other incredibly impactful and [noteworthy projects](https://www.cncf.io/projects/) such as Istio, Cilium, Linkerd and SPIFFE.

We're now incredibly proud to announce that the 12th of November 2024 is also an important day for cert-manager; we're now officially a CNCF Graduated Project!

The CNCF describes graduated projects as:

> Projects considered stable, widely adopted, and production ready, attracting thousands of contributors

We believe this description reflects cert-manager's place in the Cloud Native landscape. We've met hundreds of people at different KubeCon events who've told us that they rely on cert-manager
in production across thousands of Kubernetes clusters. We treasure the trust that people place in us, and we remain dedicated to keeping cert-manager rock solid.

Graduation isn't just the end of a long process though - it's a chance to reaffirm our commitment to solving X.509 in Kubernetes.

There are interesting challenges ahead for cert-manager, and we're excited to be part of the solution.

First, consider quantum computers promising to break existing encryption. The process of migrating to post-quantum cryptography has already begun,
and cert-manager stands ready to adopt standards when they're ready.

Second, think about the threat-strewn landscape of trust in Kubernetes containers today. trust-manager is growing rapidly, and we think it can
help not only to manage everyday trust bundles, but also to increase response times for fixing trust issues in Kubernetes.

And of course, machine identities - including X.509 certs - are only proliferating faster as time goes on. cert-manager is ready to scale with that growth!

We'd like to finish by saying some thank yous:

First, we'd like to thank [Katie Gamanji](https://x.com/k_gamanji) who helped to shepherd our project through the graduation process; we quite literally couldn't have
completed the process without her.

Second, we'd like to thank all those who were involved in helping during the process, including those who were interviewed,
TAG Security and TAG Contributor Strategy, and many others for their feedback and advice.

Third, we'd like to thank [Venafi](https://venafi.com/) for sponsoring the bulk of the maintainer time required to see this process through.

Finally, thank you all for using cert-manager and being such a great community!

We're actively looking for more contributors, maintainers, and feedback from users; please reach out on [Slack](https://cert-manager.io/docs/contributing/#slack) or join one of our [regular meetings](https://cert-manager.io/docs/contributing/#meetings) if you're interested in getting involved!

Happy graduation to cert-manager!

- The cert-manager Maintainers

