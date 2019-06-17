---
title: "Testing your K8s apps with KIND"
person: James Munnelly
event: Kubecon EU 2019
video_link: https://www.youtube.com/watch?v=8KtmevMFfxA
date: 2019-05-21
---

Part of the promise of Docker is being able to run tests in the same environment
as production. For applications running on Kubernetes, though, development and
testing is still a challenge. Developers of these applications have to choose
between three poor options: an external, stateful cluster, spinning up a cluster
for each test, or running tests outside of Kubernetes. All of these have
significant drawbacks that hinder the acceptance of Kubernetes in new
environments. kind presents a fourth option: a small, compliant Kubernetes
that comes up in one minute, not twenty. Using kind, CI signal can be more
reliable, integration tests faster, and local development streamlined.
