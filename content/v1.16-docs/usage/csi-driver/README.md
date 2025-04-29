---
title: csi-driver
description: 'Mounting cert-manager certificates without secrets'
---

csi-driver is a [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/) driver plugin for Kubernetes
which works alongside cert-manager.

Pods which mount the cert-manager csi-driver will request certificates from cert-manager
without needing a `Certificate` resource to be created. These certificates will be mounted
directly into the pod, with no intermediate Secret being created.

## Why use csi-driver?

- Ensure private keys never leave the node and are never sent over the network. Private keys are stored in memory, and shouldn't be written to disk.
- Unique key and certificate per application replica
- Fewer `Certificate` resources means writing less YAML
- Keys and certificates are destroyed when an application terminates
- No `Secret` resources needed for storing the certificate means less RBAC
- Great for ephemeral, short-lived certificates which don't need to survive a restart (e.g. certificates for mTLS)

## Why _not_ use csi-driver?

- If you need certificates to be persisted through a node restart
- If you need the same certificate to be shared by multiple components

## Installation

See the [installation guide](./installation.md) for instructions on how to
install csi-driver.

## Requesting and Mounting Certificates

Requesting a certificate using csi-driver means mounting a volume, with some attributes
set to define exactly what you need to request.

The following example is a dummy app that mounts a key certificate pair to `/tls`, signed using
a cert-manager issuer called `ca-issuer` with a DNS name valid for `my-service.sandbox.svc.cluster.local`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-csi-app
  namespace: sandbox
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
        readOnly: true
        volumeAttributes:
          csi.cert-manager.io/issuer-name: ca-issuer
          csi.cert-manager.io/issuer-kind: Issuer
          csi.cert-manager.io/dns-names: ${POD_NAME}.${POD_NAMESPACE}.svc.cluster.local
```

Once created, the CSI driver will generate a private key locally (for the pod), request a
certificate from cert-manager based on the given attributes, and store the certificate ready for the pod to use.

The pod will remain in a pending state until issuance has been completed.

For more information on how to set up issuers for your cluster, refer to the cert-manager documentation
[here](../../configuration/README.md).

**Note** it is not possible to use `SelfSigned` Issuers with csi-driver because `SelfSigned` issuers are a
special case.

## Supported Volume Attributes

The csi-driver driver aims to have complete feature parity with all possible
values available through the cert-manager API. It currently supports the following values:

| Attribute                               | Description                                                                                                                    | Default                              | Example                          |
|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|----------------------------------|
| `csi.cert-manager.io/issuer-name`       | The Issuer name to sign the certificate request.                                                                               |                                      | `ca-issuer`                      |
| `csi.cert-manager.io/issuer-kind`       | The Issuer kind to sign the certificate request.                                                                               | `Issuer`                             | `ClusterIssuer`                  |
| `csi.cert-manager.io/issuer-group`      | The group name the Issuer belongs to.                                                                                          | `cert-manager.io`                    | `out.of.tree.foo`                |
| `csi.cert-manager.io/common-name`       | Certificate common name (supports variables).                                                                                  |                                      | `my-cert.foo`                    |
| `csi.cert-manager.io/dns-names`         | DNS names the certificate will be requested for. At least a DNS Name, IP or URI name must be present (supports variables).     |                                      | `a.b.foo.com,c.d.foo.com`        |
| `csi.cert-manager.io/ip-sans`           | IP addresses the certificate will be requested for.                                                                            |                                      | `192.0.0.1,192.0.0.2`            |
| `csi.cert-manager.io/uri-sans`          | URI names the certificate will be requested for (supports variables).                                                          |                                      | `spiffe://foo.bar.cluster.local` |
| `csi.cert-manager.io/duration`          | Requested duration the signed certificate will be valid for.                                                                   | `720h`                               | `1880h`                          |
| `csi.cert-manager.io/is-ca`             | Mark the certificate as a certificate authority.                                                                               | `false`                              | `true`                           |
| `csi.cert-manager.io/key-usages`        | Set the key usages on the certificate request.                                                                                 | `digital signature,key encipherment` | `server auth,client auth`        |
| `csi.cert-manager.io/key-encoding`      | Set the key encoding format (PKCS1 or PKCS8).                                                                                  | `PKCS1`                              | `PKCS8`                          |
| `csi.cert-manager.io/certificate-file`  | File name to store the certificate file at.                                                                                    | `tls.crt`                            | `foo.crt`                        |
| `csi.cert-manager.io/ca-file`           | File name to store the ca certificate file at.                                                                                 | `ca.crt`                             | `foo.ca`                         |
| `csi.cert-manager.io/privatekey-file`   | File name to store the key file at.                                                                                            | `tls.key`                            | `foo.key`                        |
| `csi.cert-manager.io/fs-group`          | Set the FS Group of written files. Should be paired with and match the value of the consuming container `runAsGroup`.          |                                      | `2000`                           |
| `csi.cert-manager.io/renew-before`      | The time to renew the certificate before expiry. Defaults to a third of the requested duration.                                | `$CERT_DURATION/3`                   | `72h`                            |
| `csi.cert-manager.io/reuse-private-key` | Re-use the same private when when renewing certificates.                                                                       | `false`                              | `true`                           |
| `csi.cert-manager.io/pkcs12-enable`     | Enable writing the signed certificate chain and private key as a PKCS12 file.                                                  |                                      | `true`                           |
| `csi.cert-manager.io/pkcs12-filename`   | File location to write the PKCS12 file. Requires `csi.cert-manager.io/keystore-pkcs12-enable` be set to `true`.                | `keystore.p12`                       | `tls.p12`                        |
| `csi.cert-manager.io/pkcs12-password`   | Password used to encode the PKCS12 file. Required when PKCS12 is enabled (`csi.cert-manager.io/keystore-pkcs12-enable: true`). |                                      | `my-password`                    |

### Variables

The following attributes support variables that are evaluated when a request is
made for the mounting Pod. These variables are useful for constructing requests
with SANs that contain values from the mounting Pod.

```text
csi.cert-manager.io/common-name
csi.cert-manager.io/dns-names
csi.cert-manager.io/uri-sans
```

Variables follow the [go `os.Expand`](https://pkg.go.dev/os#Expand) structure,
which is generally what you would expect on a UNIX shell. The CSI driver has
access to the following variables:

```text
${POD_NAME}
${POD_NAMESPACE}
${POD_UID}
${SERVICE_ACCOUNT_NAME}
```

#### Example Usage

```yaml
volumeAttributes:
  csi.cert-manager.io/issuer-name: ca-issuer
  csi.cert-manager.io/dns-names: "${POD_NAME}.${POD_NAMESPACE}.svc.cluster.local"
  csi.cert-manager.io/uri-sans: "spiffe://cluster.local/ns/${POD_NAMESPACE}/pod/${POD_NAME}/${POD_UID}"
  csi.cert-manager.io/common-name: "${SERVICE_ACCOUNT_NAME}.${POD_NAMESPACE}"
```

## Requesting Certificates using the mounting Pod's ServiceAccount

If the flag `--use-token-request` is enabled on the csi-driver DaemonSet, the
[CertificateRequest](../../usage/certificaterequest.md) resource will be created
by the mounting Pod's ServiceAccount. This can be paired with
[approver-policy](../../policy/approval/approver-policy/README.md) to enable advanced policy control
on a per-ServiceAccount basis.

Ensure that you give permissions to Pod ServiceAccounts to create CertificateRequests
with this flag enabled, i.e:

```yaml
# WARNING: This RBAC will enable any identity in the cluster to create
# CertificateRequests and is dangerous to use in production. Instead, you should
# give permissions only to identities which need to be able to create certificates.
# This would be done via scoping the set of identities in the `ClusterRoleBinding` `subjects` stanza.
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: cert-manager-csi-driver-all-cr-create
rules:
- apiGroups: ["cert-manager.io"]
  resources: ["certificaterequests"]
  verbs: [ "create" ]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: cert-manager-csi-driver-all-cr-create
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cert-manager-csi-driver-all-cr-create
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:authenticated
```
