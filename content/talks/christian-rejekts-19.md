---
title: Consistent user authentication in multi-cloud hosted Kubernetes clusters
person: Christian Simon
event: Cloud Native Rejekts
slides_link: https://speakerdeck.com/simonswine/consistent-user-authentication-in-multi-cloud-hosted-kubernetes-clusters
date: 2019-05-19
---

As hosted Kubernetes solutions mature, it becomes ever more compelling to
operate clusters across multiple cloud providers. A general point of friction
can often be the differences in how you are able to authenticate to those
clusters. Cloud providers tend to integrate their own proprietary solutions and
hosted control planes lack the flexibility to use authentication providers and
audit sinks.

During this talk I will show how a reverse proxy in front of the Kubernetes API
can implement uniform OIDC authentication across hosted Kubernetes solutions.
