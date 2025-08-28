---
slug: trust-manager-clusterbundle-future
title: trust-manager is moving the ClusterBundle
description: A look at how trust-manager is moving to ClusterBundle and the impact for you
date: "2025-09-01T12:00:00Z"
---

## TL;DR

- trust-manager will move it's current functionality from the `Bundle` resource to a new `ClusterBundle` resource.
- You will need to replace `Bundle` YAML with `ClusterBundle` YAML which will have a similar but different specification.
- In the future `Bundle` may return as a namespace scoped CRD.

## Current state

trust-manager is currently using a `Bundle` resource as the mechanism for cluster administrators to distribute Certificate Authority (CA) certificates within their clusters.
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
Similarly this more closely ties with the Kubernetes native `ClusterTrustBundle` resource which also as as cluster level resource.
More details on this can be [found here](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles).

For trust-manager users this means:

1) Deprecating and ultimately removing `Bundle` and the API `trust.cert-manager.io/v1alpha1`.
1) Creating `ClusterBundles` with the API `trust-manager.io/v1alpha2` as the new default.

Checkout [API Changes](#api-changes) for more details on what this means.

### Resource Specification

Currently we have `Bundles` that have this specification:

```yaml
apiVersion: trust.cert-manager.io/v1alpha1
kind: Bundle
metadata:
  name: example-cas # The bundle name will also be used for the target
spec:
  sources:
  # 1) Public CAs enabled
  - useDefaultCAs: true
  # 2) A Secret in the "trust" namespace
  - secret:
      name: "my-db-tls"
      key: "ca.crt"
  # 3) Another Secret source, but this time using a label selector instead of a named Secret
  - secret:
      selector:
        matchLabels:
          fruit: apple
      key: "ca.crt"
  # 4) One more Secret source, this time including all certificates from every key
  - secret:
      name: "my-regional-cas"
      includeAllKeys: true
  # 5) A ConfigMap in the "trust" namespace
  - configMap:
      name: "my-org.net"
      key: "root-certs.pem"
  # 6) Another ConfigMap source, but this time using a label selector instead of a named ConfigMap
  - configMap:
      selector:
        matchLabels:
          fruit: apple
      key: "ca.crt"
  # 7) One more ConfigMap source, this time including all certificates from every key
  - configMap:
      name: "my-org-cas"
      includeAllKeys: true
  # 8) A manually specified PEM-encoded cert, included directly into the Bundle
  - inLine: |
      -----BEGIN CERTIFICATE-----
      MIIC5zCCAc+gAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
      ....
      0V3NCaQrXoh+3xrXgX/vMdijYLUSo/YPEWmo
      -----END CERTIFICATE-----
  target:
    configMap:
      key: "root-certs.pem"
      metadata:
        annotations:
          argocd.argoproj.io/sync-wave: "1"
        labels:
          app.kubernetes.io/component: "trust-bundle"
    additionalFormats:
      jks:
        key: "bundle.jks"
      pkcs12:
        key: "bundle.p12"
    namespaceSelector:
      matchLabels:
        linkerd.io/inject: "enabled"

```

The future will be `ClusterBundles` with this specification:

```yaml
apiVersion: trust-manager.io/v1alpha2
kind: ClusterBundle
metadata:
  name: example-cas
spec:
  # 8) A manually specified PEM-encoded cert, included directly into the Bundle
  inLineCAs: |
    -----BEGIN CERTIFICATE-----
    MIIC5zCCAc+gAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
    ....
    0V3NCaQrXoh+3xrXgX/vMdijYLUSo/YPEWmo
    -----END CERTIFICATE-----
  # 1) Public CAs enabled
  includeDefaultCAs: true
  sources:
  # 2) A Secret in the "trust" namespace
  - key: "ca.crt"
    kind: Secret
    name: "my-db-tls"
  # 3) Another Secret source, but this time using a label selector instead of a named Secret
  - key: "ca.crt"
    kind: Secret
    selector:
      matchLabels:
        fruit: apple
  # 4) One more Secret source, this time including all certificates from every key
  - key: "*"
    kind: Secret
    name: "my-regional-cas"
  # 5) A ConfigMap in the "trust" namespace
  - key: "root-certs.pem"
    kind: ConfigMap
    name: "my-org.net"
  # 6) Another ConfigMap source, but this time using a label selector instead of a named ConfigMap
  - key: "root-certs.pem"
    kind: ConfigMap
    selector:
      matchLabels:
        fruit: apple
  # 7) One more ConfigMap source, this time including all certificates from every key
  - key: "*"
    kind: ConfigMap
    name: "my-org-cas"
  # Specify details of the target resource
  target:
    configMap:
      data:
        - key: "root-certs.pem"
        - key: "bundle.p12"
          format: PKCS12
          password: "changeit" # remove field for no password
          profile: Modern2023
      metadata:
        annotations:
          argocd.argoproj.io/sync-wave: "1"
        labels:
          app.kubernetes.io/component: "trust-bundle"
    # Example: Secret as target (only if trust-manager has permissions enabled)
    secret:
      data:
        - key: "bundle.pem"
        - key: "bundle.p12"
          format: PKCS12
          password: "changeit" # remove field for no password
          profile: Modern2023
      metadata:
        annotations:
          argocd.argoproj.io/sync-wave: "1"
        labels:
          app.kubernetes.io/component: "trust-bundle"
    # Control which namespaces using a label select or expressions match. Default is empty, so all namespaces.
    namespaceSelector:
      matchLabels: {}
      matchExpressions: []
```

> ⚠️ Please note that the specification is subject to change before release!

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

## Impact to you

The migration of resources from old to new will be assisted by a new conversion controller.

> ⚠️ Please note that this is not a webhook conversion as webhooks cannot work between different API groups.

This leaves two actions for administrators:

1) Upgrade trust-manager as we release new versions, but we know you already do this!
1) Update your deployment manifests to replace the `Bundle` resources with the new `ClusterBundle` specification.

> ⚠️ We will provide detailed instructions as we release the new resource.

### Timelines

We are not yet in a position to give you specific dates of changes, but we can more generically give you an overview in terms of releases.

1. Release N - New CRD for `ClusterBundle` is released.
1. Release N+1 - Existing `Bundle` resource is deprecated.
1. Release N+2 - `Bundle` resource is removed.

## Getting Involved

cert-manager maintained projects really are open to all as CNCF projects.
We welcome all feedback and contributions on the proposed `ClusterBundles` and to our projects more generally.

### Credits

We would like to thank two maintainers in particular for their substantial contributions on `ClusterBundles`:

- Firstly [Erik](https://github.com/erikgb) for being the driving force and contributor behind this change.
- And [Ashley](https://github.com/sgtcodfish) for reviewing, supporting and being the main point of contact on all things trust-manager related.

### How to jump in

See our [website docs](../docs/contributing/README.md), or come join us on [slack](../docs/contributing/README.md#slack)!
