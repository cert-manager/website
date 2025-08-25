---
slug: trust-manager-clusterbundle-future
title: trust-manager is moving the ClusterBundle
description: A look at how trust-manager is moving to ClusterBundle and the impact for you
date: "2025-09-01T12:00:00Z"
---

## TL;DR

- trust-manager will move it's current functionality from the `Bundle` resource to a new `ClusterBundle` resource.
- This should be a no-op assuming regular upgrades
- In the future `Bundle` may return as a namespace scoped CRD.

## Current state

trust-manager is currently using a `Bundle` resource as the mechanism for cluster users to distribute Certificate Authority (CA) certificates within their clusters.
This CRD is scoped at the cluster level and takes in `sources` from a central cluster namespace and then distributes to `targets` in other namespaces.

```sh
> k api-resources
NAME                                SHORTNAMES              APIVERSION                                NAMESPACED   KIND
bundles                                                     trust.cert-manager.io/v1alpha1            false        Bundle
```

If you are familiar with the sister project cert-manager you might well expect to see a `ClusterBundle`, based on the existing usage of `Issuer` being namespaced and `ClusterIssuer` being cluster scoped.

```sh
clusterissuers                      ciss                    cert-manager.io/v1                        false        ClusterIssuer
issuers                             iss                     cert-manager.io/v1                        true         Issuer
```

trust-manager does not currently follow that pattern of cluster level CRDs being prefixed by `Cluster`.
This may be confusing to new trust-manager users or at least feels a little inconsistent.

## What's changing

Simply put, trust-manager is moving to using a `ClusterBundles` by default.
This more accurately reflects the scope of the current `Bundles` resource.

This will mean:

1) Deprecating and ultimately removing `Bundle` and the API `trust.cert-manager.io/v1alpha1`.
1) Creating `ClusterBundles` with the API `trust-manager.io/v1alpha2` as the new default.

Checkout [API Changes](#api-changes) for more details on what this means.

### Resource Specification

Currently we have `Bundles` that have this specification:

```yaml

```

The future will be `ClusterBundles` with this specification:

```yaml

```

But why?...<TDB> ...

### API Changes

In the API change there are two key elements to consider:

1) The API group is changing from `trust.cert-manager.io` to `trust-manager.io`.
1) The API version is going from `v1alpha1` to `v1alpha2`.

The changing of the group `trust.cert-manager.io` to `trust-manager.io` is a shortening of the overall URL but also reflects the general move towards trust-manager being a completely independent project to cert-manager.
While both projects are maintained by the same set of awesome maintainers, we fundamentally believe that one project should be able to exist without the other, reducing the overall tooling you might need in your cluster.
We are not at that state of independence but look out for a future post exploring that topic.

The API version change has meaning worth considering too. It is still an `alpha` level resource!
This means that the resource specification could still change in a backwards incompatible way if there was a need.
In practice we likely will be much safer and considerate of any specification change.
Just look at the effort the maintainers have gone to with this change alone, for an alpha level resource.
We all understand the frustration of things changing especially when we work with so many CRDs from many different projects.
That plays a big part in our mindset to try and make changes in a way that impact users as minimally as possible.

## Impact to you

The migration of resources from old to new will actually be handled automatically for you by a conversion webhook at the appropriate trust-manager release, which is TBD.

That leaves only two real changes for you to make:

1) Upgrading trust-manager as we release new versions, but we know you already do this!
1) Updating your GitOps deployments to replace the `Bundle` resources with the new `ClusterBundle` specifications.

These aren't things you can do just now, we will let you know when you should perform these things.

### Timelines

We are not yet in a position to give you specific dates of changes, but we can more generically give you an overview in terms of releases.

TBD.

## Getting Involved

cert-manager maintained projects really are open to all as CNCF projects.
We welcome all feedback and contributions on the proposed `ClusterBundles` and to our projects more generally.

### Credits

We would like to thank two maintainers in particular for their substantial contributions on `ClusterBundles`:

- Firstly [Erik](https://github.com/erikgb) for being the driving force and contributor behind this change.
- And [Ashley](https://github.com/sgtcodfish) for reviewing, supporting and being the main point of contact on all things trust-manager related.

### How to jump in

See our [website docs](../docs/contributing/README.md), or come join us on [slack](../docs/contributing/README.md#slack)!
