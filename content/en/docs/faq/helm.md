---
title: "Frequently asked questions about the Helm package"
linkTitle: "Frequently asked questions about the Helm package"
weight: 60
type: "docs"
---

## Why doesn't cert-manager put CRDs in the `crds/` directory?

There are various problems with the way Helm manages the installation, upgrading and uninstallation of projects with CRDs.
Helm recommend putting CRD manifests in a separate `crds/` directory in the chart,
so that it knows to install those before installing the rest of the chart manifests.
But cert-manager doesn't follow that recommendation because:

#### Helm upgrade CRDs in `crds/` when they change in subsequent versions of the chart

Helm does not upgrade the contents of the `crds/` directory.
cert-manager custom resources are evolving, even the `v1` API.
So we need cert-manager users to upgrade the CRDs at the same time they upgrade cert-manager.

Instead cert-manager puts the CRDs definitions alongside the other chart resources
inside an `{{ -if installCRDs }} {{ -end}}` block.
For this reason, users who run `helm install jetstack/cert-manager` are required to make a decision about whether or not to have `helm` also install the cert-manager CRDs.
To have `helm` install the CRDs, the user must use the command line flag `helm install jetstack/cert-manager --set installCRDs=true`,
but this makes the CRDs part of the Helm installation which means that if the user subsequently runs `helm uninstall jetstack/cert-manager`,
then all the CRDs will be deleted and this will trigger the garbage collection of all cert-manager CRs (Certificates, Issuers, etc).

Other users prefer to pre-install the CRDs using `kubectl apply -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.crds.yaml`.
Then they run `helm install jetstack/cert-manager` to install only the cert-manager Deployements and other supporting resources.
But these users then have to remember to use this same two-step method when later upgrading or uninstalling cert-manager.

There are many support requests from users who are confused about which of these two installation methods they should choose.

#### Helm does not support CRD templates

Another reason that cert-manager does not use the `crds/` directory is that,
if you put CRDs in the `crds/` directory, Helm will treat them as static manifests.
It will not render them as templates.

cert-manager CRDs are written as templates to allow such options as `helm install jetstack/cert-manager --set webhook.url.host`,
for users with clusters where the cert-manager webhook server must be deployed on a different network than the Kubernetes API server.
