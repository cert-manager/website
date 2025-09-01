---
slug: trust-manager-clusterbundle-future
title: trust-manager is moving the ClusterBundle
description: A look at how trust-manager is moving to ClusterBundle and the impact for you
date: "2025-09-01T12:00:00Z"
---

We would like to share details about a major upcoming change to [trust-manager](github.com/cert-manager/trust-manager).

## TL;DR

- trust-manager will move it's current functionality from the `Bundle` resource to a new `ClusterBundle` resource.
- You will need to replace `Bundle` YAML with `ClusterBundle` YAML which will have a similar but different specification.
- In the future `Bundle` may return as a namespace scoped CRD.

## Current State

trust-manager is currently using a `Bundle` resource as the mechanism for cluster administrators to distribute Certificate Authority (CA) certificates within their clusters.
This CRD is scoped at the cluster level and takes in `sources` from a central cluster namespace and then distributes to `targets` in other namespaces.

```sh
> kubectl api-resources
NAME                                SHORTNAMES              APIVERSION                                NAMESPACED   KIND
bundles                                                     trust.cert-manager.io/v1alpha1            false        Bundle
```

If you are familiar with the sister project cert-manager you might well expect to see a `ClusterBundle`, based on the existing usage of `Issuer` being namespaced and `ClusterIssuer` being cluster scoped.

```sh
NAME                                SHORTNAMES              APIVERSION                                NAMESPACED   KIND
clusterissuers                      ciss                    cert-manager.io/v1                        false        ClusterIssuer
issuers                             iss                     cert-manager.io/v1                        true         Issuer
```

trust-manager does not currently follow that pattern of cluster level CRDs being prefixed by `Cluster`.
This may be confusing to new trust-manager users or at least feels a little inconsistent.

## What's Changing

Simply put, trust-manager is moving to using a `ClusterBundle` by default.
This more accurately reflects the scope of the current `Bundle` resource.
Similarly this more closely ties with the Kubernetes native `ClusterTrustBundle` resource, which also acts as a cluster-level resource.
More details on this can be [found here](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles).

For trust-manager users this means:

1) Deprecating and ultimately removing `Bundle` and the API `trust.cert-manager.io/v1alpha1`.
1) Creating `ClusterBundle` in the API `trust-manager.io/v1alpha2` as the new default.

Checkout [API Changes](#api-changes) for more details on what this means.

Eventually you will see something like this after installing trust-manager and listing `api-resource`:

```sh
> kubectl api-resources
NAME                                SHORTNAMES              APIVERSION                                NAMESPACED   KIND
clusterbundles                                              trust-manager.io/v1alpha2                 false        ClusterBundle
```

### Minimal Example

For simpler setups such as just public CAs the change should be fairly minimal. So if you currently had:

```yaml
apiVersion: trust.cert-manager.io/v1alpha1
kind: Bundle
metadata:
  name: public-ca-certs
spec:
  sources:
  - useDefaultCAs: true
  target:
    configMap:
      key: ca-certificates.crt
```

It would now look like:

```yaml
apiVersion: trust-manager.io/v1alpha2
kind: ClusterBundle
metadata:
  name: public-ca-certs
spec:
  includeDefaultCAs: true
  target:
    configMap:
      data:
      - key: ca-certificates.crt
    namespaceSelector:
      matchLabels: {}
```

> ⚠️ Please note that the specification is subject to change before release!
> If you have any suggestions for last-minute adjustments, please reach out to the cert-manager maintainers.
> See [this section below](#how-to-jump-in) for details.

If you want to explore more of the resource specifications right now, you can apply the CRD in a lab or development cluster and use `kubectl explain` to see what configuration options are available.

```sh
kubectl apply -f https://raw.githubusercontent.com/cert-manager/trust-manager/refs/heads/main/deploy/crds/trust-manager.io_clusterbundles.yaml
kubectl explain clusterbundles.trust-manager.io.spec
```

Don't forget to clean up as the resource is not released!

```sh
kubectl delete -f https://raw.githubusercontent.com/cert-manager/trust-manager/refs/heads/main/deploy/crds/trust-manager.io_clusterbundles.yaml
```

### API Changes

In the API change there are two key elements to consider:

1) The API group is changing from `trust.cert-manager.io` to `trust-manager.io`.
1) The API version is going from `v1alpha1` to `v1alpha2`.

The changing of the group `trust.cert-manager.io` to `trust-manager.io` is a shortening of the overall URL but also reflects the general move towards trust-manager being a completely independent project to cert-manager.
While both projects are maintained by the same set of awesome maintainers, we fundamentally believe that one project should be able to exist without the other, reducing the overall tooling you might need in your cluster.
A key part of making the projects independent is removing the need for webhooks and therefore certificates to secure that webhook communication.
Kubernetes advances in [Server Side Apply](https://kubernetes.io/docs/reference/using-api/server-side-apply/) (SSA) and [Common Expression Language](https://kubernetes.io/docs/reference/using-api/cel/)e (CEL) make it much easier to perform resource validation with the Kubernetes components, without having to hand that off to a webhook service to do the resource validation.
That's a different goal and we are not at that state of independence right now but look out for a future post exploring that topic.

The API version change has meaning worth considering too. It is still an `alpha` level resource!
This means that the resource specification could still change in a backwards incompatible way if there was a need.
In practice we likely will be much safer and considerate of any specification change.
Just look at the effort the maintainers have gone to with this change alone, for an alpha level resource.
We all understand the frustration of things changing especially when we work with so many CRDs from many different projects.
That plays a big part in our mindset to try and make changes in a way that impact users as minimally as possible.

## Impact To You

The migration of resources from old to new will be assisted by a new conversion controller.

> ⚠️ Please note that this is not a webhook conversion as webhooks cannot work between different API groups.

This leaves two actions for administrators:

1) Upgrade trust-manager as we release new versions, but we know you already do this!
1) Update your deployment manifests to replace the `Bundle` resources with the new `ClusterBundle` specification.

> ⚠️ We will provide detailed instructions as we release the new resource.

### Timeline

We are not yet in a position to give you specific dates of changes, but we can more generically give you an overview in terms of releases.

1. Release N - New CRD for `ClusterBundle` is released & `Bundle` is deprecated.
1. Release N+X - `Bundle` resource is removed.

#### Future State

Take this with a pinch of salt, but the current vision for trust-manager after `ClusterBundle` might include:

- The return of a new `trust-manager.io/v1alpha2 Bundle` resource, which is namespace scoped.

## Getting Involved

cert-manager maintained projects really are open to all as CNCF projects.
We welcome all feedback and contributions on the proposed `ClusterBundle` API and to our projects more generally.

### Help Needed

If you have the time, there is still a lot of work to get us to the future state where `ClusterBundle` is the default.
Things needed include but are not limited to:

- Website documentation updates
- Migration guidance
- Reviewing Pull Requests (PRs) of the incremental changes
- Helping to communicate the changes as they occur
- Code contributions

### How to jump in

See our [website docs](../docs/contributing/README.md), or come join us on [slack](../docs/contributing/README.md#slack)!

### References

To find out more about this change and others, here's some starting points:

- [Design document for `ClusterBundle` name change](https://github.com/cert-manager/trust-manager/blob/main/design/20241124-rename-bunde-to-clusterbundle.md)
- [A more technical implementation plan](https://github.com/cert-manager/trust-manager/issues/242)

### Credits

We would like to thank two maintainers in particular for their substantial contributions to `ClusterBundles`:

- Firstly [Erik](https://github.com/erikgb) for being the driving force and contributor behind this change.
- And [Ashley](https://github.com/sgtcodfish) for reviewing, supporting and being the main point of contact on all things trust-manager related.
