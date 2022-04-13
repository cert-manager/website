---
title: Compatibility with Kubernetes Platform Providers
description: 'cert-manager installation: Cloud provider compatibility'
---

Below you will find details on various compatibility issues and quirks that you
may be affected by when deploying cert-manager. If you believe we've missed something
please feel free to raise an issue or a pull request with the details!

<div className="alert">
If you're using AWS Fargate or else if you've specifically configured
cert-manager to run the host's network, be aware that kubelet listens on port
`10250` by default which clashes with the default port for the cert-manager
webhook.

As such, you'll need to change the webhook's port when setting up cert-manager.

For installations using Helm, you can set the `webhook.securePort` parameter
when installing cert-manager either using a command line flag or an entry in
your `values.yaml` file.

If you have a port clash, you could see confusing error messages regarding
untrusted certs. See [#3237](https://github.com/jetstack/cert-manager/issues/3237)
for more details.
</div>

## GKE

When Google configure the control plane for private clusters, they automatically
configure VPC peering between your Kubernetes cluster's network and a separate
Google-managed project.

In order to restrict what Google are able to access within your cluster, the
firewall rules configured restrict access to your Kubernetes pods. This means
that the webhook won't work, and you'll see errors such as
`Internal error occurred: failed calling admission webhook ... the server is
currently unable to handle the request`.

In order to use the webhook component with a GKE private cluster, you must
configure an additional firewall rule to allow the GKE control plane access to
your webhook pod.

You can read more information on how to add firewall rules for the GKE control
plane nodes in the [GKE
docs](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters#add_firewall_rules).

## GKE Autopilot

As of May 2021, GKE Autopilot has no support for 3rd party webhooks.
Without webhooks, many Kubernetes plugins such as cert-manager cannot
operate correctly.

As per [this
tweet](https://twitter.com/BagadeVivek/status/1365701217469534220), GKE
Autopilot is meant to support webhooks in a coming release. We will keep
you updated on the progress on [this
issue](https://github.com/jetstack/cert-manager/issues/3717).

## AWS EKS

When using a custom CNI (such as Weave or Calico) on EKS, the webhook cannot be
reached by cert-manager. This happens because the control plane cannot be
configured to run on a custom CNI on EKS, so the CNIs differ between control
plane and worker nodes.

To address this, the webhook can be run in the host network so it can be reached
by cert-manager, by setting the `webhook.hostNetwork` key to true on your
deployment, or, if using Helm, configuring it in your `values.yaml` file.

Note that running on the host network will necessitate changing the webhook's
port; see the warning at the top of the page for details.

### AWS Fargate

It's worth noting that using AWS Fargate to run cert-manager will force you to
run using the host's network, and will force a port clash with the kubelet
running on port 10250, as seen in [#3237](https://github.com/jetstack/cert-manager/issues/3237).

When deploying cert-manager on Fargate, you _must_ change the port on which
the webhook listens. See the warning at the top of this page for more details.