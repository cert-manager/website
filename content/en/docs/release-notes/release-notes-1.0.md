---
title: "Release Notes"
linkTitle: "v1.0"
weight: 830
type: "docs"
---

With cert-manager v1.0 we're putting a seal of trust on 3 years of development on the cert-manager project.
In these 3 years cert-manager has grown in functionality and stability, but mostly in the community.
Today we see many people using cert-manager to secure their Kubernetes clusters, as well as cert-manager
being integrated into many other parts in the ecosystem.
In the past 16 releases many bugs got fixed, and things that needed to be broken were broken.
Several iterations on the API improved the user experience.
We solved 1500 GitHub Issues with even more PRs by 253 contributors.

With releasing v1.0 we're oficially making a statement that cert-manager is a mature project now.
We will also be making a compatibility promise with our v1 api.

A big thank you to everyone who helped to build cert-manager in the past 3 years!
Let v1.0 be the first of many big achievements!


The `v1.0` release is a stability release with a few focus areas:

* `v1` API
* `kubectl cert-manager status` command to help with investigating issues
* Using new and stable Kubernetes APIs
* improved logging


As usual, please read the [upgrade notes](/docs/installation/upgrading/upgrading-0.16-1.0/) before upgrading.


## `v1` API

In `v0.16` we introduced the `v1beta1` API. This brought some structural changes as well as better documentation of the API fields.
In `v1.0` we build on this with the `v1` API. This API is our first "stable" API version, while our others were well used we had to already provide some compatibility guarantees with the `v1` API we promise compatibility for the API for years to come.

These are the changes made (for reference, our conversion will take care of everything for you):

Certificate:

* `emailSANs` is now named `emailAddresses`
* `uriSANs` is now named `uris`

This change makes these 2 SANs consistent with the other SANs as well as the Go API. Dropping the term SAN from our API.

### Upgrading
If you're using Kubernetes 1.16 or higher, conversion webhooks will allow you seamlessly interact with `v1alpha2`, `v1alpha3`, `v1beta1` and `v1` API versions at the same time. This allows you to use the new API version without having to modify or redeploy your older resources.
We highly reccomend upgrading your manifests to the `v1` API as older versions will soon be deprecated.

Users of the `legacy` version of cert-manager will still only have the `v1` API, migration steps can be found in the [upgrade notes](/docs/installation/upgrading/upgrading-0.16-1.0/).


// TODO: others
