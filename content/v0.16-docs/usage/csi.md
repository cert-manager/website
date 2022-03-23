---
title: CSI Driver
description: 'cert-manager usage: CSI driver'
---

## Enabling mTLS of Pods using the cert-manager CSI Driver

An experimental [Container Storage Interface (CSI)
driver](https://github.com/jetstack/cert-manager-csi) has been created to
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

The CSI driver is able to recover its full state in the event the its Pod being
terminated.

## Installation and Configuration

TODO (`@joshvanl`): add the installation guide once we are closer to a full
release.

TODO (`@joshvanl`): add commands to verify installation
```bash
$ kubectl get csinodes
$ kubectl get csidrivers
```

The cert-manager CSI driver can be configured to write the key and certificate
data that is to be mounted to Pods from anywhere in the host file system, but by
default is at `/tmp/cert-manager-csi`. Each volume that is mounted will have
their own directory created inside this directory.

To change this data directory location, change the `hostPath.path` location
inside the driver `DaemonSet`.

## Usage

Once the driver has been successfully installed, Pods are ready to request
in-line ephemeral volumes. This is done by adding a number annotations to the
volume attributes of the CSI volumes, as described in the volume spec. Below is
a simple example of a deployment with 5 replicas that will each be mounted with
their own unique key certificate pairs based upon the volume attributes.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-csi-app
  namespace: sandbox
  labels:
    app: my-csi-app
spec:
  replicas: 5
  selector:
    matchLabels:
      app: my-csi-app
  template:
    metadata:
      labels:
        app: my-csi-app
    spec:
      containers:
        - name: my-frontend
          image: busybox
          volumeMounts:
          - mountPath: "/tls"
            name: tls
          command: [ "sleep", "1000000" ]
      volumes:
        - name: tls
          csi:
            driver: csi.cert-manager.io
            volumeAttributes:
                  csi.cert-manager.io/issuer-name: ca-issuer
                  csi.cert-manager.io/dns-names: my-service.sandbox.svc.cluster.local
```

In this example, each Pod will receive a 2048 bit RSA private key with a
certificate that is valid for the DNS name
`my-service.sandbox.svc.cluster.local` which has been signed by the `Issuer`
named `ca-issuer` that exists in the same namespace. The resulting key and
certificate is available from the Pods file system at `/tls/key.pem` and
`/tls/cert.pem` respectively.

Below is a full list of the available volume attributes to configure resulting
key certificate pairs.

The full list of usage keys is available [from code](https://github.com/jetstack/cert-manager/blob/d4a743f91ab1fdfefd21354c82aaa311888afa02/pkg/apis/certmanager/v1alpha2/types.go#L169-L193).

| Attribute                                | Description                                                                                           | Default                              | Example                          |
|------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------|----------------------------------|
| `csi.cert-manager.io/issuer-name`        | The Issuer name to sign the certificate request.                                                      |                                      | `ca-issuer`                      |
| `csi.cert-manager.io/issuer-kind`        | The Issuer kind to sign the certificate request.                                                      | `Issuer`                             | `ClusterIssuer`                  |
| `csi.cert-manager.io/issuer-group`       | The group name the Issuer belongs to.                                                                 | `cert-manager.io`                    | `example.com`                    |
| `csi.cert-manager.io/common-name`        | Certificate common name.                                                                              |                                      | `www.example.com`                |
| `csi.cert-manager.io/key-usages`         | Certificate key usages.                                                                               | `digital signature,key encipherment` | `signing,timestamping`           |
| `csi.cert-manager.io/dns-names`          | DNS names the certificate will be requested for. At least a DNS Name, IP or URI name must be present. |                                      | `a.example.com,b.example.com`    |
| `csi.cert-manager.io/ip-sans`            | IP addresses the certificate will be requested for.                                                   |                                      | `192.0.2.1,192.0.2.2`            |
| `csi.cert-manager.io/uri-sans`           | URI names the certificate will be requested for.                                                      |                                      | `spiffe://foo.bar.cluster.local` |
| `csi.cert-manager.io/duration`           | Requested duration the signed certificate will be valid for.                                          | `720h`                               | `1880h`                          |
| `csi.cert-manager.io/is-ca`              | Mark the certificate as a certificate authority.                                                      | `false`                              | `true`                           |
| `csi.cert-manager.io/certificate-file`   | File name to store the certificate file at.                                                           | `crt.pem`                            | `bar/foo.crt`                    |
| `csi.cert-manager.io/privatekey-file`    | File name to store the key file at.                                                                   | `key.pem`                            | `bar/foo.key`                    |
| `csi.cert-manager.io/renew-before`       | The time to renew the certificate before expiry. Defaults to a third of the requested duration.       | `$CERT_DURATION/3`                   | `72h`                            |
| `csi.cert-manager.io/disable-auto-renew` | Disable the CSI driver from renewing certificates that are mounted into the pod.                      | `false`                              | `true`                           |
| `csi.cert-manager.io/reuse-private-key`  | Re-use the same private when when renewing certificates.                                              | `false`                              | `true`                           |