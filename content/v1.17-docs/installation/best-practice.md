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
and those documented by the likes of [LearnKube in their "Kubernetes production best practices" checklist](https://learnkube.com/production-best-practices/).

## Overview

The default cert-manager resources in the Helm chart or YAML manifests (Deployment, Pod, ServiceAccount etc)
are designed for backwards compatibility rather than for best practice or maximum security.
You may find that the default resources do not comply with the security policy on your Kubernetes cluster
and in that case you can modify the installation configuration using Helm chart values to override the defaults.

## Network Requirements and Network Policy

The network requirements of each cert-manager Pod are summarized below.
Some network requirements depend on specific Issuer / ClusterIssuer configurations
and / or specific configuration options.

When you have understood the network requirements of **your** cert-manager installation,
you should consider implementing a "least privilege" network policy,
using a [Kubernetes Network (CNI) Plugin](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) such as [Calico](https://www.tigera.io/project-calico/).

The network policy should prevent untrusted clients from connecting to the cert-manager Pods
and it should prevent cert-manager from connecting to untrusted servers.

An example of this recommendation is found in the Calico Documentation:
> We recommend creating an implicit default deny policy for your Kubernetes pods, regardless of whether you use Calico or Kubernetes network policy. This ensures that unwanted traffic is denied by default.
>
> 📖 [Calico Best practice: implicit default deny policy](https://docs.tigera.io/calico/latest/network-policy/get-started/kubernetes-default-deny#best-practice-implicit-default-deny-policy).

You can use the Kubernetes builtin `NetworkPolicy` resource,
which is portable because it is recognized by any of the [Kubernetes Network (CNI) Plugins](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
Or you may prefer to use the custom resources provided by your CNI software.

> 📖 Learn about the [Kubernetes builtin NetworkPolicy API](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
> and see [some example policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/#default-policies).

### Network Requirements

Here is an overview of the network requirements:

1. **UDP / TCP: cert-manager (all) -> Kubernetes DNS**:
   All cert-manager components perform UDP DNS queries for both cluster and external domain names.
   Some DNS queries may use TCP.

1. **TCP: Kubernetes (API server) -> cert-manager (webhook)**:
   The Kubernetes API server establishes HTTPS connections to the [cert-manager webhook component](../concepts/webhook.md).
   Read the cert-manager [webhook troubleshooting guide](../troubleshooting/webhook.md)
   to understand the webhook networking requirements.

1. **TCP: cert-manager (webhook, controller, cainjector, startupapicheck) -> Kubernetes API server**:
   The cert-manager webhook, controller, cainjector and startupapicheck
   establish HTTPS connections to the Kubernetes API server,
   to interact with cert-manager custom resources and Kubernetes resources.
   The cert-manager webhook is a special case;
   it connects to the Kubernetes API server to use the `SubjectAccessReview` API,
   to verify clients attempting to modify `Approved` or `Denied` conditions of `CertificateRequest` resources.

1. **TCP: cert-manager (controller) -> HashiCorp Vault (authentication and resource API endpoints)**:
   The cert-manager controller may establish HTTPS connections to one or more Vault API endpoints,
   if you are using the [Vault Issuer](../configuration/vault.md).
   The target host and port of the Vault endpoints
   are configured in Issuer or ClusterIssuer resources.

1. **TCP: cert-manager (controller) -> Venafi TLS Protect (authentication and resource API endpoints)**:
   The cert-manager controller may establish HTTPS connections to one or more Venafi API endpoints,
   if you are using the [Venafi Issuer](../configuration/venafi.md).
   The target host and port of the Venafi API endpoints
   are configured in Issuer or ClusterIssuer resources.

1. **TCP: cert-manager (controller) -> DNS API endpoints (for ACME DNS01)**:
   The cert-manager controller may establish HTTPS connections to DNS API endpoints such as Amazon Route53,
   and to any associated authentication endpoints,
   if you are using the [ACME Issuer with DNS01 solvers](../configuration/acme/dns01/README.md#supported-dns01-providers).

1. **UDP / TCP: cert-manager (controller) -> External DNS**:
   If you use the ACME Issuer, the cert-manager controller may send
   DNS queries to recursive DNS servers,
   as part of the ACME challenge self-check process.
   It does this to ensure that the DNS01 or HTTP01 challenge is resolvable,
   before asking the ACME server to perform its checks.

   In the case of DNS01 it may also perform a series of DNS queries to authoritative DNS servers,
   to compute the DNS zone in which to add the DNS01 challenge record.
   In the case of DNS01, cert-manager also [supports DNS over HTTPS](../releases/release-notes/release-notes-1.13.md#dns-over-https-doh-support).

   You can choose the host and port of the DNS servers, using the following [controller flags](../cli/controller.md):
   `--acme-http01-solver-nameservers`,
   `--dns01-recursive-nameservers`, and
   `--dns01-recursive-nameservers-only`.

1. **TCP: ACME (Let's Encrypt) -> cert-manager (acmesolver)**:
   If you use an ACME Issuer configured for HTTP01,
   cert-manager will deploy an `acmesolver` Pod, a Service and an Ingress (or Gateway API) resource
   in the namespace of the Issuer
   or in the cert-manager namespace if it is a ClusterIssuer.
   The ACME implementation will establish an HTTP connection to this Pod via your chosen ingress load balancer,
   so your network policy must allow this.

   > ℹ️ The acmesolver Pod **does not** require access to the Kubernetes API server.

1. **TCP: Metrics Collector -> cert-manager (controller, webhook, cainjector)**:
   The cert-manager controller, webhook, and cainjector have metrics servers which listen for HTTP connections on TCP port 9402.
   Create a network policy which allows access to these services from your chosen metrics collector.

## Isolate cert-manager on dedicated node pools

cert-manager is a cluster scoped operator and you should treat it as part of your platform's control plane.
The cert-manager controller creates and modifies Kubernetes Secret resources
and the controller and cainjector both cache TLS Secret resources in memory.
These are two reasons why you should consider isolating the cert-manager components from
other less privileged workloads.
For example, if an untrusted or malicious workload runs on the same Node as the cert-manager controller,
and somehow gains root access to the underlying node,
it may be able to read the private keys in Secrets that the controller has cached in memory.

You can mitigate this risk by running cert-manager on nodes that are reserved for trusted platform operators.

The Helm chart for cert-manager has parameters to configure the Pod `tolerations` and `nodeSelector` for each component.
The exact values of these parameters will depend on your particular cluster.

> 📖 Read [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
> in the [Kubernetes documentation](https://kubernetes.io/docs/).
>
> 📖 Read about [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
> in the [Kubernetes documentation](https://kubernetes.io/docs/).

### Example

This example demonstrates how to use:
`taints` to *repel* non-platform Pods from Nodes which you have reserved for your platform's control-plane,
`tolerations` to *allow* cert-manager Pods to run on those Nodes, and
`nodeSelector` to *place* the cert-manager Pods on those Nodes.

Label the Nodes:

```bash
kubectl label node ... node-restriction.kubernetes.io/reserved-for=platform
```

Taint the Nodes:

```bash
kubectl taint node ... node-restriction.kubernetes.io/reserved-for=platform:NoExecute
```

Then install cert-manager using the following Helm chart values:

```yaml
nodeSelector:
  kubernetes.io/os: linux
  node-restriction.kubernetes.io/reserved-for: platform
tolerations:
- key: node-restriction.kubernetes.io/reserved-for
  operator: Equal
  value: platform

webhook:
  nodeSelector:
    kubernetes.io/os: linux
    node-restriction.kubernetes.io/reserved-for: platform
  tolerations:
  - key: node-restriction.kubernetes.io/reserved-for
    operator: Equal
    value: platform

cainjector:
  nodeSelector:
    kubernetes.io/os: linux
    node-restriction.kubernetes.io/reserved-for: platform
  tolerations:
  - key: node-restriction.kubernetes.io/reserved-for
    operator: Equal
    value: platform

startupapicheck:
  nodeSelector:
    kubernetes.io/os: linux
    node-restriction.kubernetes.io/reserved-for: platform
  tolerations:
  - key: node-restriction.kubernetes.io/reserved-for
    operator: Equal
    value: platform
```

> ℹ️ This example uses `nodeSelector` to *place* the Pods but you could also use `affinity.nodeAffinity`.
> `nodeSelector` is chosen here because it has a simpler syntax.
>
> ℹ️ The default `nodeSelector` value `kubernetes.io/os: linux` [avoids placing cert-manager Pods on Windows nodes in a mixed OS cluster](https://github.com/cert-manager/cert-manager/pull/3605),
> so that must be explicitly included here too.
>
> 📖 Read the [Guide to isolating tenant workloads to specific nodes](https://aws.github.io/aws-eks-best-practices/security/docs/multitenancy/#isolating-tenant-workloads-to-specific-nodes)
> in the [EKS Best Practice Guides](https://aws.github.io/aws-eks-best-practices/),
> for an in-depth explanation of these techniques.
>
> 📖 Learn how to [Isolate your workloads in dedicated node pools](https://cloud.google.com/kubernetes-engine/docs/how-to/isolate-workloads-dedicated-nodes) on [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs/).
>
> 📖 Learn about [Placing pods on specific nodes using node selectors, with RedHat OpenShift](https://docs.openshift.com/container-platform/4.13/nodes/scheduling/nodes-scheduler-node-selectors.html).
>
> 📖 Read more about the [`node-restriction.kubernetes.io/` prefix and the `NodeRestriction` admission plugin](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#noderestriction).
>
> ℹ️ On a multi-tenant cluster,
> consider enabling the [`PodTolerationRestriction` plugin](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
> to limit which tolerations tenants may add to their Pods.
> You may also use that plugin to add default tolerations to the `cert-manager` namespace,
> which obviates the need to explicitly set the tolerations in the Helm chart.
>
> ℹ️ Alternatively, you could use [Kyverno](https://kyverno.io/docs/) to limit which tolerations Pods are allowed to use.
> Read [Restrict control plane scheduling](https://kyverno.io/policies/other/restrict-controlplane-scheduling/restrict-controlplane-scheduling/) as a starting point.

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

### webhook

By default the cert-manager webhook Deployment has 1 replica, but in production you should use 3 or more.
If the cert-manager webhook is unavailable, all API operations on cert-manager custom resources will fail,
and this will disrupt any software that creates, updates or deletes cert-manager custom resources (including cert-manager itself),
and it may cause other disruptions to your cluster.
So it is *especially* important to keep multiple replicas of the cert-manager webhook running at all times.

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
>
> 📖 Read [The dark side of Kubernetes admission webhooks](https://techblog.cisco.com/blog/dark-side-of-kubernetes-admission-webhooks)
> on the Cisco Tech Blog, to learn more about potential issues caused by webhooks and how you can avoid them.

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
which should mean that the high availability scheduling described above will happen implicitly.

> ℹ️ In case your cluster does not use Built-in default constraints.
> You can add [Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/)
> to each of the cert-manager components using Helm chart values.

### PodDisruptionBudget

For high availability you should also deploy a `PodDisruptionBudget` resource with `minAvailable=1`.

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

> 📖 Read about [Specifying a Disruption Budget for your Application](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) in the Kubernetes documentation.
>
> ⚠️ These PodDisruptionBudget settings are only suitable for high availability deployments.
> You must increase the `replicaCount` of each Deployment to more than the `minAvailable` value,
> otherwise the PodDisruptionBudget will prevent you from draining cert-manager Pods.

### Priority Class Name

The reason for setting a priority class is summarized as follows in the Kubernetes blog [Protect Your Mission-Critical Pods From Eviction With `PriorityClass`](https://kubernetes.io/blog/2023/01/12/protect-mission-critical-pods-priorityclass/):
> Pod priority and preemption help to make sure that mission-critical pods are up in the event of a resource crunch by deciding order of scheduling and eviction.

If cert-manager is mission-critical to your platform,
then set a `priorityClassName` on the cert-manager Pods
to protect them from [preemption](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption),
in situations where a Kubernetes node becomes starved of resources.
Without a `priorityClassName` the cert-manager Pods may be evicted to free up resources for other Pods,
and this may cause disruption to any applications that rely on cert-manager.

Most Kubernetes clusters will come with two builtin priority class names:
`system-cluster-critical` and `system-node-critical`,
which are used for Kubernetes core components.
These [can also be used for critical add-ons](https://kubernetes.io/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/),
such as cert-manager.

We recommend using the following Helm chart values to set `priorityClassName: system-cluster-critical`, for all cert-manager Pods:

```yaml
global:
  priorityClassName: system-cluster-critical
```

On some clusters the [`ResourceQuota` admission controller](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#resourcequota) may be configured to [limit the use of certain priority classes to certain namespaces](https://kubernetes.io/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default).
For example, Google Kubernetes Engine (GKE) will only allow `priorityClassName: system-cluster-critical` for Pods in the `kube-system` namespace,
by default.

> 📖 Read [Kubernetes PR #93121](https://github.com/kubernetes/kubernetes/pull/93121) to see how and why this was implemented.

In such cases you will need to create a `ResourceQuota` in the `cert-manager` namespace:

```yaml
# cert-manager-resourcequota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: cert-manager-critical-pods
  namespace: cert-manager
spec:
  hard:
    pods: 1G
  scopeSelector:
    matchExpressions:
    - operator: In
      scopeName: PriorityClass
      values:
      - system-node-critical
      - system-cluster-critical
```

```sh
kubectl apply -f cert-manager-resourcequota.yaml
```

> 📖 Read [Protect Your Mission-Critical Pods From Eviction With `PriorityClass`](https://kubernetes.io/blog/2023/01/12/protect-mission-critical-pods-priorityclass/), a Kubernetes blog post about how Pod priority and preemption help to make sure that mission-critical pods are up in the event of a resource crunch by deciding order of scheduling and eviction.
>
> 📖 Read [Guaranteed Scheduling For Critical Add-On Pods](https://kubernetes.io/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/) to learn why `system-cluster-critical` should be used for add-ons that are critical to a fully functional cluster.
>
> 📖 Read [Limit Priority Class consumption by default](https://kubernetes.io/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default), to learn why platform administrators might restrict usage of certain high priority classes to a limited number of namespaces.
>
> 📖 Some examples of other critical add-ons that use the `system-cluster-critical` priority class name:
> [NVIDIA GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/google-gke.html),
> [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper/pull/1282),
> [Cilium](https://github.com/cilium/cilium/pull/13878).

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

The cert-manager webhook and controller Pods do have liveness probes.
The cainjector Pod does not have a liveness probe, yet.
More information below.

### webhook

The [cert-manager webhook](../concepts/webhook.md) has a [liveness probe which is enabled by default](https://github.com/cert-manager/cert-manager/blob/eafe0d0aae4b7a9411825424f6b43fb623e1ba65/deploy/charts/cert-manager/templates/webhook-deployment.yaml#L108C1-L121)
and the [timings and thresholds can be configured using Helm values](https://github.com/cert-manager/cert-manager/blob/eafe0d0aae4b7a9411825424f6b43fb623e1ba65/deploy/charts/cert-manager/README.template.md?plain=1#L181-L185).

### controller

> 📢 The cert-manager controller liveness probe was introduced in cert-manager release `1.12` and
> enabled by default in release `1.14`. In case it causes problems in the field,
> [Please get in touch](../contributing/README.md).

The liveness probe for the cert-manager controller is an HTTP probe which connects
to the `/livez` endpoint of a healthz server which listens on port 9443 and runs in its own thread.
The `/livez` endpoint currently reports the combined status of the following sub-systems
and each sub-system has its own `/livez` endpoint. These are:

* `/livez/leaderElection`: Returns an error if the leader election record has not been renewed
  or if the leader election thread has exited without also crashing the parent process.
* `/livez/clockHealth`: Returns an error if a clock skew is detected between the system clock
  and the monotonic clock used by Go to schedule timers.

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

> 📖 Read [Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#before-you-begin) in the Kubernetes documentation, paying particular attention to the notes and cautions in that document.
>
> 📖 Read [Shooting Yourself in the Foot with Liveness Probes](https://blog.colinbreck.com/kubernetes-liveness-and-readiness-probes-how-to-avoid-shooting-yourself-in-the-foot/#shootingyourselfinthefootwithlivenessprobes) for more cautionary information about liveness probes.

## Restrict Auto-Mount of Service Account Tokens

This recommendation is described in the [Kyverno Policy Catalogue](https://kyverno.io/policies/other/restrict-automount-sa-token/restrict-automount-sa-token/) as follows:
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
