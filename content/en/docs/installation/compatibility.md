---
title: "Compatibility"
linkTitle: "Compatibility"
weight: 100
type: "docs"
---

Below you will find details on various compatibility issues and quirks that you
may be effected by in your environment.

## GKE

When Google configure the control plane for private clusters, they automatically
configure VPC peering between your Kubernetes cluster's network and a separate
Google managed project.

In order to restrict what Google are able to access within your cluster, the
firewall rules configured restrict access to your Kubernetes pods. This will
mean that you will experience the webhook to not work and experience errors such
as `Internal error occurred: failed calling admission webhook ... the server is
currently unable to handle the request`.

In order to use the webhook component with a GKE private cluster, you must
configure an additional firewall rule to allow the GKE control plane access to
your webhook pod.

You can read more information on how to add firewall rules for the GKE control
plane nodes in the [GKE
docs](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters#add_firewall_rules).

## AWS EKS

When using a custom CNI (such as Weave or Calico) on EKS, the webhook cannot be
reached by cert-manager. This happens because the control plane cannot be
configured to run on a custom CNI on EKS, so the CNIs differ between control
plane and worker nodes.

To address this, the webhook can be run in the host network so it can be reached
by cert-manager, by setting the `webhook.hostNetwork` key to true on your
deployment, or, if using Helm, configuring it in your `values.yaml` file.

Note that since kubelet uses port `10250` by default on the host network, the
`webhook.securePort` value must be changed to a different, free port.

## Webhook

Disabling the webhook is not supported anymore since `v0.14`.

## iptables vs. nftables

Some distributions - like [Debian 10](https://wiki.debian.org/nftables) or [RHEL 8](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/8.0_release_notes/rhel-8_0_0_release#networking) - recently switched from iptables to [nftables](https://wiki.nftables.org/) which causes some unexpected behavior:

- ["context deadline exceeded" errors relating to the webhook](https://github.com/jetstack/cert-manager/issues/2319#)
- [secret "cert-manager-webhook-webhook-tls" not found](https://github.com/jetstack/cert-manager/issues/2484)
- [Kubernetes compatible with debian 10 buster?](https://discuss.kubernetes.io/t/kubernetes-compatible-with-debian-10-buster/7853)

To overcome to this issue, there are two possibilities

### Switch to `iptables`

You might consider switching back to `iptables`. Here is how:

- [Debian 10](https://wiki.debian.org/nftables)

### Configure network provider

#### Calico

Configure [`FELIX_IPTABLESBACKEND=NFT`](https://github.com/rancher/rke/issues/1788#issuecomment-566138210) in the dameonset

```yaml
....
    Environment:
      FELIX_IPTABLESBACKEND:              NFT
....
```

Latest version of `calico` also allows [`Auto` for auto detection of the backend](https://docs.projectcalico.org/reference/felix/configuration#iptables-dataplane-configuration)
