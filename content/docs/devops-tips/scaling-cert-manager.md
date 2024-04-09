---
title: Scaling cert-manager
description: |
    Learn how to optimize cert-manager for your cluster.
---

Learn how to optimize cert-manager for your cluster.

## Overview

The defaults in the Helm chart and YAML manifests are intended for general use.
You may want to modify the configuration to suit the size and usage of your Kubernetes cluster.

## Set appropriate memory requests and limits

**When Certificate resources are the dominant use-case**,
such as when workloads need to mount the TLS Secret or when gateway-shim is used,
the memory consumption of the cert-manager controller will be roughly
proportional to the total size of those Secret resources that contain the TLS
key pairs.
Why? Because the cert-manager controller caches the entire content of these Secret resources in memory.
If large TLS keys are used (e.g. RSA 4096) the memory use will be higher than if smaller TLS keys are used (e.g. ECDSA).

The other Secrets in the cluster, such as those used for Helm chart configurations or for other workloads,
will not significantly increase the memory consumption, because cert-manager will only cache the metadata of these Secrets.

**When CertificateRequest resources are the dominant use-case**,
such as with csi-driver or with istio-csr,
the memory consumption of the cert-manager controller will be much lower,
because there will be fewer TLS Secrets and fewer resources to be cached.

> 📖️ Read [What Everyone Should Know About Kubernetes Memory Limits](https://home.robusta.dev/blog/kubernetes-memory-limit),
> to learn how to right-size the memory requests.

## Disable client-side rate limiting for Kubernetes API requests

By default cert-manager [throttles the rate of requests to the Kubernetes API server](https://github.com/cert-manager/cert-manager/blob/b61de55abda95a4c273be0c8d3e6025fe8511573/internal/apis/config/controller/v1alpha1/defaults.go#L59-L60) to 20 queries per second.
Historically this was intended to prevent cert-manager from overwhelming the Kubernetes API server,
but modern versions of Kubernetes implement [API Priority and Fairness](https://kubernetes.io/docs/concepts/cluster-administration/flow-control/),
which obviates the need for client side throttling.
You can increase the threshold of the the client-side rate limiter using the following helm values:

```yaml
# helm-values.yaml
config:
  apiVersion: controller.config.cert-manager.io/v1alpha1
  kind: ControllerConfiguration
  kubernetesAPIQPS: 10000
  kubernetesAPIBurst: 10000
```

> ℹ️ This does not technically disable the client-side rate-limiting but configures the QPS and Burst values high enough that they are never reached.
>
> 🔗 Read [`cert-manager#6890`: Allow client-side rate-limiting to be disabled](https://github.com/cert-manager/cert-manager/issues/6890);
> a proposal for a cert-manager configuration option to disable client-side rate-limiting.
>
> 🔗 Read [`kubernetes#111880`: Disable client-side rate-limiting when AP&F is enabled](https://github.com/kubernetes/kubernetes/issues/111880);
> a proposal that the `kubernetes.io/client-go` module should automatically use server-side rate-limiting when it is enabled.
>
> 🔗 Read about other projects that disable client-side rate limiting: [Flux](https://github.com/fluxcd/pkg/issues/269).
>
> 📖 Read [API documentation for ControllerConfiguration](../reference/api-docs.md#controller.config.cert-manager.io/v1alpha1.ControllerConfiguration) for a description of the `kubernetesAPIQPS` and `kubernetesAPIBurst` configuration options.

## Restrict the use of large RSA keys

Certificates with large RSA keys cause cert-manager to use more CPU resources.
When there are insufficient CPU resources, the reconcile queue length grows,
which delays the reconciliation of all Certificates.
A user who has permission to create a large number of RSA 4096 certificates,
might accidentally or maliciously cause a denial of service for other users on the cluster.

> 📖 Learn [how to enforce an Approval Policy](../policy/approval/README.md), to prevent the use of large RSA keys.
>
> 📖 Learn [how to set Certificate defaults automatically](../tutorials/certificate-defaults/README.md), using tools like Kyverno.


## Set `revisionHistoryLimit: 1` on all Certificate resources

By default, cert-manager will keep all the CertificateRequest resources that **it** creates
([`revisionHistoryLimit`](../reference/api-docs.md#cert-manager.io/v1.CertificateSpec)):

> The maximum number of CertificateRequest revisions that are maintained in
> the Certificate's history. Each revision represents a single
> `CertificateRequest` created by this Certificate, either when it was
> created, renewed, or Spec was changed. Revisions will be removed by oldest
> first if the number of revisions exceeds this number.
>  If set, `revisionHistoryLimit` must be a value of `1` or greater. If unset
> (`nil`), revisions will not be garbage collected. Default value is `nil`.

On a busy cluster these will eventually overwhelm your Kubernetes API server;
because of the memory and CPU required to cache them all and the storage required to save them.

Use a tool like Kyverno to override the `Certificate.spec.revisionHistoryLimit` for all namespaces.

> 📖 Adapt [the Kyverno policies in the tutorial: how to set Certificate defaults automatically](../tutorials/certificate-defaults/README.md),
> to override rather than default the `revisionHistoryLimit` field.
>
> 📖 Learn [how to set `revisionHistoryLimit` when using Annotated Ingress resources](../usage/ingress.md#supported-annotations).
>
> 🔗 Read [`cert-manager#3773`: Certificate revision history limit](https://github.com/cert-manager/cert-manager/pull/3773),
> to learn why stale CertificateRequests resources are not automatically deleted.
