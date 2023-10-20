---
title: Best Practice
description: |
    Learn about best practices for deploying cert-manager in production,
    and how to configure cert-manager to comply with popular security standards
    such as those produced by the CIS, NSA, and BSI.
---

In this section you will learn how to configure cert-manager to comply with popular security standards such as
the [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes/),
the [NSA Kubernetes Hardening Guide](https://media.defense.gov/2022/Aug/29/2003066362/-1/-1/0/CTR_KUBERNETES_HARDENING_GUIDANCE_1.2_20220829.PDF), or
the [BSI Kubernetes Security Recommendations](https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Grundschutz/International/bsi_it_gs_comp_2022.pdf?__blob=publicationFile&v=2#page=475).

And you will learn about best practices for deploying cert-manager in production;
such as those enforced by tools like [Datree and its built in rules](https://hub.datree.io/built-in-rules),
and those documented by the likes of [Learnk8s in their "Kubernetes production best practices" checklist](https://learnk8s.io/production-best-practices/).

## Overview

The default cert-manager resources in the Helm chart or YAML manifests (Deployment, Pod, ServiceAccount etc)
are designed for backwards compatibility rather than for best practice or maximum security.
You may find that the default resources do not comply with the security policy on your Kubernetes cluster
and in that case you can modify the installation configuration using Helm chart values to override the defaults.

## High Availability

cert-manager has three long-running components: controller, cainjector, and webhook.
Each of these components has a Deployment and by default each Deployment has 1 replica
but this does not provide high availability.
The Helm chart for cert-manager has parameters to configure the `replicaCount` for each Deployment.
In production we recommend the following `replicaCount` parameters:

```yaml
replicaCount: 2
webhook:
  replicaCount: 3
cainjector:
  replicaCount: 2
```

### controller and cainjector

The controller and cainjector components use [leader election](https://pkg.go.dev/k8s.io/client-go/tools/leaderelection)
to ensure that only one replica is active.
This prevents conflicts which would arise if multiple replicas were reconciling the same API resources.
So in these components you can use multiple replicas to achieve high availability but not for horizontal scaling.

Use two replicas to ensures that there is a standby Pod scheduled to a Node which is ready to take leadership,
should the current leader encounter a disruption.
For example, when the leader Pod is drained from its node.
Or, if the leader Pod encounters an unexpected deadlock.

There is little justification for using more than 2 replicas of these components.
Further replicas *may* add a degree of resilience
if you have the luxury of sufficient Nodes
with sufficient CPU and memory to accommodate additional standby replicas.

### webhook

By default the cert-manager webhook Deployment has 1 replica, but in production you should use 3 or more.
If the cert-manager webhook is unavailable, all API operations on cert-manager custom resources will fail,
and this will disrupt any software that creates, updates or deletes cert-manager custom resources,
and it may cause other disruptions to your cluster.
So it is *especially* important to keep at multiple replicas of the cert-manager webhook running at all times.

> ℹ️ By contrast, if there is only a single replica of the cert-manager controller, there is less risk of disruption.
> For example, if the Node hosting the single cert-manager controller manager Pod is drained,
> there will be a delay while a new Pod is started on another Node,
> and any cert-manager resources that are created or changed during that time will not be reconciled until the new Pod starts up.
> But the controller manager works asynchronously anyway, so any applications which depend on the cert-manager custom resources
> will be designed to tolerate this situation.
> That being said, the best practice is to run 2 or more replicas of each controller if the cluster has sufficient resources.
>
> 📖 Read [Ensure control plane stability when using webhooks](https://cloud.google.com/kubernetes-engine/docs/how-to/optimize-webhooks)
> in the Google Kubernetes Engine (GKE) documentation,
> for examples of how webhook disruptions might disrupt your cluster.

### Topology Spread Constraints

Consider using [Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/),
to ensure that a disruption of a node or data center does not degrade the operation of cert-manager.

For high availability you do not want the replica Pods to be scheduled on the same Node,
because if that node fails, both the active and standby Pods will exit,
and there will be no further reconciliation of the resources by that controller,
until there is another Node with sufficient free resources to run a new Pod,
and until that Pod has become Ready.

It is also desirable for the Pods to be running in separate data centers (availability zones),
if the cluster has nodes distributed between zones.
Then, in the event of a failure at the data center hosting the active Pod ,
the standby Pod will immediately be available to take leadership.

Fortunately you may not need to do anything to achieve these goals
because [Kubernetes >= 1.24 has Built-in default constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/#internal-default-constraints)
which should mean that the high availablity scheduling described above will happen implicitly.

> ℹ️ In case your cluster does not use Built-in default constraints.
>
> You can add [Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/)
> to each of the cert-manager components using Helm chart values.
> For example, the following Helm chart values add topology spread constraints for all three long-running components,
> to request (but not require) Kubernetes to avoid scheduling Pods of the same Deployment to the same zone or node.

### PodDisruptionBudget

For high availability you should also deploy a `PodDisruptionBudget` resource,
with `minAvailable=1` *or* with `maxUnavailable=1`.
This ensures that a *voluntary* disruption, such as the draining of a Node, cannot proceed
until at least one other replica has been successfully scheduled and started on another Node.
The Helm chart has parameters to enable and configure a PodDisruptionBudget
for each of the long-running cert-manager components.
We recommend the following parameters:

```yaml
podDisruptionBudget:
  enabled: true
  minAvailable: 1
webhook:
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
cainjector:
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
```

## Scalability

cert-manager has three long-running components: controller, cainjector, and webhook.
The Helm chart does not include resource requests and limits for any of these,
so you should supply resource requests and limits which are appropriate for your cluster.

### controller and cainjector

The controller and cainjector components use leader election to ensure that only one replica is active.
This prevents conflicts which would arise if multiple replicas were reconciling the same API resources.
You cannot use horizontal scaling for these components.
Use vertical scaling instead.

#### Memory

Use vertical scaling to assign sufficient memory resources to these components.
The memory requirements will be higher on clusters with very many API resources or with large API resources.
This is because each of the components reconciles one or more Kubernetes API resources,
and each component will cache the metadata and sometimes the entire resource in memory,
so as to reduce the load on the Kubernetes API server.

If your cluster contains a high volume of `CertificateRequest` resources such as when using many ephemeral or short lived certificates rotated frequently,
you will need to increase the memory limit of the controller Pod.

You can also reduce the memory consumption of `cainjector`
by configuring it to only watch resources in the `cert-manager` namespace,
and by configuring it to **not** watch `Certificate` resources.
Here's how to configure the [cainjector command line flags](../cli/cainjector.md) using Helm chart values:

```yaml
cainjector:
  extraArgs:
  - --namespace=cert-manager
  - --enable-certificates-data-source=false
```

> ⚠️️ This optimization is only appropriate if `cainjector` is being used exclusively for the the cert-manager webhook.
> It is not appropriate if `cainjector` is also being used to manage the TLS certificates for webhooks of other software.
> For example, some Kubebuilder derived projects may depend on `cainjector`
> to [inject TLS certificates for their webhooks](https://book.kubebuilder.io/cronjob-tutorial/running-webhook.html#cert-manager).

#### CPU

Use vertical scaling to assign sufficient CPU resources to the these components.
The CPU requirements will be higher on clusters where there are very frequent updates to the resources which are reconciled by these components.
Whenever a resource changes, it will be queued to be re-reconciled by the component.
Higher CPU resources allow the component to process the queue faster.

### webhook

The cert-manager webhook does not use leader election, so you *can* scale it horizontally by increasing the number of replicas.
When the Kubernetes API server connects to the cert-manager webhook it does so via a Service which load balances the connections
between all the Ready replicas.
For this reason, there is a clear benefit to increasing the number of webhook replicas to 3 or more,
on clusters where there is a high frequency of cert-manager custom resource interactions.
Furthermore, the webhook has modest memory requirements because it does not use a cache.
For this reason, the resource cost of scaling out the webhook is relatively low.

## Use Liveness Probes

An example of this recommendation is found in the Datree Documentation:
[Ensure each container has a configured liveness probe](https://hub.datree.io/built-in-rules/ensure-liveness-probe):
> Liveness probes allow Kubernetes to determine when a pod should be replaced.
> They are fundamental in configuring a resilient cluster architecture.

The cert-manager webhook and controller Pods do have liveness probes,
but only the webhook liveness probe is enabled by default.
The cainjector Pod does not have a liveness probe, yet.
More information below.

### webhook

The [cert-manager webhook](../concepts/webhook.md) has a [liveness probe which is enabled by default](https://github.com/cert-manager/cert-manager/blob/eafe0d0aae4b7a9411825424f6b43fb623e1ba65/deploy/charts/cert-manager/templates/webhook-deployment.yaml#L108C1-L121)
and the [timings and thresholds can be configured using Helm values](https://github.com/cert-manager/cert-manager/blob/eafe0d0aae4b7a9411825424f6b43fb623e1ba65/deploy/charts/cert-manager/README.template.md?plain=1#L181-L185).

### controller

> ℹ️ The cert-manager controller liveness probe was introduced in cert-manager release `1.12`.

The cert-manager controller has a liveness probe, but it is **disabled by default**.
You can enable it using the Helm chart value `livenessProbe.enabled=true`,
but first read the background information below.

> 📢 The controller liveness probe is a new feature in cert-manager release 1.12
> and it is disabled by default, as a precaution, in case it causes problems in the field.
> [Please get in touch](../contributing/README.md)
> and tell is if you have enabled the controller liveness probe in production
> and tell us whether you would like it to be turned on by default.
> Tell us about any circumstances where the controller has become stuck
> and where the liveness probe has been necessary to automatically restart the process.

The liveness probe for the cert-manager controller is an HTTP probe which connects
to the `/livez` endpoint of a healthz server which listens on port 9443 and runs in its own thread.
The `/livez` endpoint currently reports the combined status of the following sub-systems
and each sub-system has its own `/livez` endpoint. These are:

* `/livez/leaderElection`: Returns an error if the leader election record has not been renewed
  or if the leader election thread has exited without also crashing the parent process.

> ℹ️ In future more sub-systems could be checked by the `/livez`  endpoint,
> similar to how Kubernetes [ensure logging is not blocked](https://github.com/kubernetes/kubernetes/pull/64946)
> and have [health checks for each controller](https://github.com/kubernetes/kubernetes/pull/104667).
>
> 📖 Read about [how to access individual health checks and verbose status information](https://kubernetes.io/docs/reference/using-api/health-checks/) (cert-manager uses the same healthz endpoint multiplexer as Kubernetes).

### cainjector

The cainjector Pod does not have a liveness probe or a `/livez` healthz endpoint,
but there is justification for it in the GitHub issue:
[cainjector in a zombie state after attempting to shut down](https://github.com/cert-manager/cert-manager/issues/5889).
Please add your remarks to that issue if you have also experienced this specific problem,
and add your remarks to [Helm: Allow configuration of readiness, liveness and startup probes for all created Pods](https://github.com/cert-manager/cert-manager/issues/5626) if you have a general request for a liveness probe in cainjector.

### Background Information

The cert-manager `controller` process and the `cainjector` process,
both use the Kubernetes [leader election library](https://pkg.go.dev/k8s.io/client-go/tools/leaderelection),
to ensure that only one replica of each process can be active at any one time.
The Kubernetes control-plane components also use this library.

The leader election code runs in a loop in a separate thread (go routine).
If it initially wins the leader election race and if it later fails to renew its leader election lease, it exits.
If the leader election thread exits, all the other threads are gracefully shutdown and then the process exits.
Similarly, if any of the other main threads exit unexpectedly,
that will trigger the orderly shutdown of the remaining threads and the process will exit.

This adheres to the principle that [Containers should crash when there's a fatal error](https://blog.colinbreck.com/kubernetes-liveness-and-readiness-probes-revisited-how-to-avoid-shooting-yourself-in-the-other-foot/#letitcrash).
Kubernetes will restart the crashed container, and if it crashes repeatedly,
there will be increasing time delays between successive restarts.

For this reason, the liveness probe should only be needed if there is a bug in this orderly shutdown process,
or if there is a bug in one of the other threads which causes the process to deadlock and not shutdown.

You may want to enable the liveness probe anyway, for defense against unforeseen bugs and deadlocks,
but you will need to monitor the processes closely and,
tweak the [various liveness probe time settings and thresholds](https://github.com/cert-manager/cert-manager/blob/eafe0d0aae4b7a9411825424f6b43fb623e1ba65/deploy/charts/cert-manager/values.yaml#L254-L268), if necessary.

> 📖 Read [Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#before-you-begin) in the Kubernetes documentation, paying particular attention to the notes and cautions in that document.
>
> 📖 Read [Shooting Yourself in the Foot with Liveness Probes](https://blog.colinbreck.com/kubernetes-liveness-and-readiness-probes-how-to-avoid-shooting-yourself-in-the-foot/#shootingyourselfinthefootwithlivenessprobes) for more cautionary information about liveness probes.

## Restrict Auto-Mount of Service Account Tokens

This recommendation is described in the [Kyverno Policy Catalogue](https://kyverno.io/policies/other/res/restrict-automount-sa-token/restrict-automount-sa-token/) as follows:
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
