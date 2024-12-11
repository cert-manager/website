---
title: CSI Driver
description: 'cert-manager usage: CSI driver'
---

<div style={{textAlign: "center"}}>
<object data="/images/request-certificate-overview/request-certificate-csi.svg"></object>
</div>

## Enabling mTLS of Pods using cert-manager csi-driver

[csi-driver](./csi-driver/README.md) facilitates secretless provisioning of certificates
for pods in a Kubernetes cluster.

Using this driver will ensure that the private key and corresponding signed
certificate will be unique to each Pod and will be stored on disk to the node
that the Pod is scheduled to.

The life cycle of the certificate key pair matches that of the Pod; the certificate is issued
when the Pod is created, and destroyed during termination.

This driver also handles renewal of live certificates on the fly.

## What's a CSI driver?

A [Kubernetes CSI driver](https://kubernetes-csi.github.io/docs/introduction.html)
is a storage plugin which is deployed into your Kubernetes cluster.

It can honor volume requests in Pod specifications, just like those enabled by default such as
the `Secret`, `ConfigMap`, or `hostPath` volume drivers.

In the case of cert-manager's csi-driver an [ephemeral volume](https://kubernetes.io/docs/concepts/storage/volumes/#csi-ephemeral-volumes)
is used, meaning that the volume is created and destroyed as the Pod is created and
terminated.

This means that not only are volumes created with unique certificates and keys per Pod,
but also that the private key never leaves the host's node, and that the desired certificate for
that Pod template can be defined in line with the spec or template for the pod.

> **Warning**: Use of the CSI driver is mostly intended for supporting a PKI in
> your cluster and facilitating TLS. As such, a private Certificate Authority
> should generally be used for issuance.
> It is *not* recommended to use public Certificate Authorities such as Let's Encrypt,
> which maintain strict rate limits on the number of certificates that can be issued
> for a single domain.
> Like Pods, these certificate key pairs are designed to be thrown away and can be
> created and destroyed at any time during normal operation.

## How Does it Work?

The CSI specification is a protocol and standard for building storage drivers
for container orchestration platforms with the intention that a single driver
may be ported across multiple platforms and outlines a consistent specification
to how drivers should behave from an infrastructure perspective. Since
cert-manager is designed to only be run with a Kubernetes cluster, so too does
the cert-manager CSI driver.

The driver should be deployed as a
[DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
which means a single instance of the driver may be run on each node. The driver
will not work when running multiple instances on a single node. The set of nodes
that the driver runs on can be restricted using the
[`nodeSelector`](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/)
in its Pod template.

When a Pod is scheduled to a node with a cert-manager CSI volume specified, the
[`Kubelet`](https://kubernetes.io/docs/concepts/overview/components/#kubelet)
running on that node will send a `NodePublishVolume` call to the driver on that
node, containing that Pods information as well as the attributes detailed from
the in-line volume attributes. From this, the driver will generate a private key
as well as a certificate request based upon that key using information built
from the volume attributes. The driver will create a `CertificateRequest`
resource in the same namespace as the Pod. If the request is valid, cert-manager
will return a signed certificate.

The resulting signed certificate and generated key will be written to that
node's file system to be mounted to the Pods file system. Since the driver needs
access to the nodes file system it must be made privileged. Once mounted, the
Pod will begin execution with the unique private key and certificate available in
its file system, as defined by its mount path.

By default, the driver will keep track of certificates created in order to
monitor when they should be marked for renewal. When this happens, the driver
will request for a new signed certificate, and when successful, will simply
overwrite the existing certificate in path.

When the Pod is marked for termination, the `NodeUnpublishVolume` call is made
to the node's driver which in turn destroys the certificate and key from the
nodes file system.

The CSI driver is able to recover its full state in the event the its Pod being
terminated.
