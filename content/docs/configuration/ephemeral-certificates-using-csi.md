---
title: Empheral Certifcates Using CSI
description: 'cert-manager usage: CSI driver'
---

## Enabling mTLS of Pods using the cert-manager CSI Driver

A [Container Storage Interface (CSI)
driver](../projects/csi-driver) has been created to
facilitate mTLS of Pods running inside your cluster through use of cert-manager.
Using this driver will ensure that the private key and corresponding signed
certificate will be unique to each Pod and will be stored on disk to the node
that the Pod is scheduled to. The life cycle of the certificate key pair matches
that of the Pod meaning that they will be created at Pod creation, and destroyed
during termination. This driver also handles renewal on live certificates on the
fly.

A [CSI
driver](https://github.com/container-storage-interface/spec/blob/master/spec.md)
is a storage plugin that is deployed into your Kubernetes cluster that can
honor volume requests specified on Pods, just like those enabled by default such as
the `Secret`, `ConfigMap`, or `hostPath` volume drivers. In the case of the cert-manager
CSI driver, it makes use of the ephemeral volume type, made beta as of
[`v1.16`](https://kubernetes.io/docs/concepts/storage/volumes/#csi-ephemeral-volumes)
and as such will only work from the Kubernetes version `v1.16`. An ephemeral
volumes means that the volume is created and destroyed as the Pod is created and
terminated, as well as specifying the volume attributes, without the need of a
`PersistentVolume`. This gives the feature of not only having unique
certificates and keys per Pod, where the private key never leaves the hosts
node, but that the desired certificate for that Pod template can be defined in
line with the deployment spec.

> **Warning**: Use of the CSI driver is mostly intended for supporting a PKI of
> your cluster and facilitating mTLS, and as such, a private Certificate
> Authority issuer should be used - CA, Vault, and perhaps Venafi, or other
> external issuers. It is *not* recommended to use public Certificate
> Authorities, for example Let's Encrypt, which hold strict rate limits on the
> number of certificates that can be issued for a single domain. Like Pods,
> these certificate key pairs are designed to be non-immutable and can be
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
resource in the same namespace in the Pod that, if valid, cert-manger will
return a signed certificate.

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
