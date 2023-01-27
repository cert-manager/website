---
title: Best Practice
description: Learn how to deploy cert-manager to comply with popular security standards such as those produced by the CIS, NSA, and BSI.
---

Learn how to deploy cert-manager to comply with popular security standards such as
the [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes/),
the [NSA Kubernetes Hardening Guide](https://media.defense.gov/2022/Aug/29/2003066362/-1/-1/0/CTR_KUBERNETES_HARDENING_GUIDANCE_1.2_20220829.PDF), or
the [BSI Kubernetes Security Recommendations](https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Grundschutz/International/bsi_it_gs_comp_2022.pdf?__blob=publicationFile&v=2#page=475).

## Overview

The default cert-manager resources in the Helm chart or YAML manifests (Deployment, Pod, ServiceAccount etc) are designed for backwards compatibility rather than for best practice or maximum security.
You may find that the default resources do not comply with the security policy on your Kubernetes cluster
and in that case you can modify the installation configuration using Helm chart values to override the defaults.

## Restrict Auto-Mount of Service Account Tokens

This recommendation is described in the [Kyverno Policy Catalogue](https://kyverno.io/policies/other/restrict_automount_sa_token/restrict_automount_sa_token/) as follows:
> Kubernetes automatically mounts ServiceAccount credentials in each Pod. The
> ServiceAccount may be assigned roles allowing Pods to access API resources.
> Blocking this ability is an extension of the least privilege best practice and
> should be followed if Pods do not need to speak to the API server to function.
> This policy ensures that mounting of these ServiceAccount tokens is blocked

The cert-manager components *do* need to speak to the API server but we still recommend setting `automountServiceAccountToken: false` for the following reasons:
1. Setting `automountServiceAccountToken: false` will allow cert-manager to be installed on clusters where Kyverno (or some other policy system) is configured to deny Pods that have this field set to `true`. The Kubernetes default value is `true`.
2. With `automountServiceAccountToken: true`, *all* the containers in the Pod will mount the ServiceAccount token, including side-car and init containers that might have been injected into the cert-manager Pod resources by Kubernetes admission controllers. 
   The principle of least privilege suggests that it is better to explicitly mount the ServiceAccount token into the cert-manager containers.

So it is recommended to set `automountServiceAccountToken: false` and manually add a projected `Volume` to each of the cert-manager Deployment resources, containing the ServiceAccount token, CA certificate and namespace files that would normally be [added automatically by the Kubernetes ServiceAccount controller](https://github.com/kubernetes/kubernetes/blob/3992eda8e61725c470fb6141a7fe4e7f9ee31ea5/plugin/pkg/admission/serviceaccount/admission.go#L421-L460),
and to explicitly add a read-only `VolumeMount` to each of the cert-manager containers.

An example of this configuration is included in the Helm Chart Values file below.

## Best Practice Helm Chart Values

Download the following Helm chart values file and supply it to `helm install`, `helm upgrade`, or `helm template` using the `--values` flag:

🔗 <a href="values.best-practice.yaml">`values.best-practice.yaml`</a>
```yaml file=../../../public/docs/installation/best-practice/values.best-practice.yaml
```

## Other

This list of recommendations is a work-in-progress.
If you have other best practice recommendations please [contribute to this page](../contributing/contributing-flow.md).

