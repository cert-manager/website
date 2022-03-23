---
title: Compatibility
description: 'cert-manager installation: Cloud provider compatibility'
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