---
slug: controlplane-threat-model
title: "cert-manager's first threat model!"
description: ControlPlane completed a threat model of cert-manager - check it out today and harden your cluster!
date: "2026-03-26T09:00:00Z"
---

The wonderful folks at ControlPlane have taken the time to create a high-quality, no-strings-attached threat model and hardening guide for cert-manager!

The threat model is [available to download for free](https://cert-manager.io/docs/announcements/controlplane-2026-cert-manager-hardening-guide.pdf) and contains
a plethora of potential threats that could affect your installation of cert-manager. For example, did you know that granting RBAC permissions to create
or edit cert-manager Issuer resources could allow exfiltration of Secrets?

We're always looking to improve cert-manager's security posture, and threat models like this play a huge part in helping to direct where we spend our time. Plus,
it helps to establish a baseline for how we evaluate threats and provides documentation of various issues which can crop up.

If you're running cert-manager in production you should absolutely read this document!

Thanks again to ControlPlane for their efforts on this - their community-minded approach matches the ethos of cert-manager and we couldn't be more grateful!
Why not show them some love [on their LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7442530507352883200) to say thanks?
