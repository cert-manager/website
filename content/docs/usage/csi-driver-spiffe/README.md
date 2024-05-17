---
title: csi-driver-spiffe
description: 'Container Storage Interface (CSI) driver plugin for Kubernetes, providing SPIFFE SVIDs using cert-manager'
---

csi-driver-spiffe is a Container Storage Interface (CSI) driver plugin for
Kubernetes, designed to work alongside [cert-manager](https://cert-manager.io/).

It transparently delivers [SPIFFE](https://spiffe.io/) [SVIDs](https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/#spiffe-verifiable-identity-document-svid)
(in the form of X.509 certificate key pairs) to mounting Kubernetes Pods.

The end result is that any and all Pods running in Kubernetes can securely request
a SPIFFE identity document from a Trust Domain with minimal configuration.

These documents in turn have the following properties:

- automatically renewed ✔️
- private key never leaves the node's virtual memory ✔️
- each Pod's document is unique ✔️
- the document shares the same life cycle as the Pod and is destroyed on Pod termination ✔️
- enable mTLS within a trust domain ✔️

```yaml
...
          volumeMounts:
          - mountPath: "/var/run/secrets/spiffe.io"
            name: spiffe
      volumes:
        - name: spiffe
          csi:
            driver: spiffe.csi.cert-manager.io
            readOnly: true
```

### Components

The project is split into two components: the driver and the approver.

#### CSI Driver

The CSI driver runs as DaemonSet on the cluster and is responsible for
generating, requesting, and mounting a certificate and private key to Pods on the
node it manages. The CSI driver creates and manages a
[tmpfs](https://www.kernel.org/doc/html/latest/filesystems/tmpfs.html) directory.

When a Pod is created with the CSI volume configured, the
driver will locally generate a private key, and create a cert-manager
[CertificateRequest](../../usage/certificaterequest.md)
in the same Namespace as the Pod.

The driver uses [CSI Token Requests](https://kubernetes-csi.github.io/docs/token-requests.html).
This means that the token of the pod being created is passed to the driver.

This token's details are used for creating the SPIFFE ID which represents the pod's identity,
and the token is used for creating the actual CertificateRequest for the SVID.

Once the certificate is signed by the configured cert-manager issuer, the driver
mounts the private key and certificate into the Pod's Volume, and watches the
certificate to renew it and the private key based on the certificate's
expiry date.

#### Approver

A distinct [cert-manager approver](../../usage/certificaterequest.md#approval)
Deployment is responsible for managing approval and denial of csi-driver-spiffe
CertificateRequests.

The approver ensures that requests have:

1. acceptable key usages (Key Encipherment, Digital Signature, Client Auth, Server Auth);
2. a requested duration which matches the enforced duration (default 1 hour);
3. no [SANs](https://en.wikipedia.org/wiki/Subject_Alternative_Name) or other
   identifiable attributes except a single [URI SAN](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier);
4. a URI SAN which is the SPIFFE identity of the ServiceAccount which created
   the CertificateRequest;
5. a SPIFFE ID Trust Domain matching the one that was configured at startup.

The approver only considers CertificateRequests which have the
`spiffe.csi.cert-manager.io/identity` annotation, which is added by csi-driver-spiffe
 to all requests it creates.

## Installation

See the [installation guide](./installation.md) for instructions on how to
install csi-driver-spiffe.

## Security Considerations

csi-driver-spiffe deals with highly valuable credentials which should be kept secret. The design
of using a Kubernetes CSI volume makes it simple to restrict access to only the pod which mounts
the CSI volume, but care should still be taken not to expose the private key created by csi-driver-spiffe.

csi-driver-spiffe _always_ uses the token of the pod it's issuing for to create the CertificateRequest
resource for the SVID it creates. That means that:

1. During issuance, csi-driver-spiffe has the ability to do whatever the Pod can do; bear in mind that a
   compromised csi-driver-spiffe pod could abuse these permissions, although in normal operation only the
   CertificateRequest permission is used.
2. Importantly: all pods using csi-driver-spiffe must have permission to create CertificateRequest resources.

The requirement for a pod to have permission to create CertificateRequests has important security
implications. If a Pod with these permissions is compromised it can create arbitrary CertificateRequest
resources, which could reference arbitrary issuers in the cluster.

Since csi-driver-spiffe requires that approval is used in-cluster, this risk is mitigated by approval.

It's important, though, that any other forms of approval in the cluster (such as approver-policy) are
carefully configured not to overlap with the csi-driver-spiffe approver and to restrict access to other
issuers.

For example, an approver-policy `CertificateRequestPolicy` resource which allowed any pod to issue
using an ACME (Let's Encrypt) issuer might allow a compromised Pod to issue a publicly trusted
certificate, if that Pod used csi-driver-spiffe and thus had permissions to create CertificateRequest
resources.

Using csi-driver-spiffe safely means considering which approval methods are available in your cluster
and carefully configuring those approvers to ensure that pods cannot target issuers they're not meant
to be able to use.

## Usage

Once the driver is successfully installed, Pods can begin to request and mount
their key and SPIFFE certificate. Since the Pod's ServiceAccount is impersonated
when creating CertificateRequests, every ServiceAccount must be given that
permission which intends to use the volume.

Example manifest with a dummy Deployment:

```bash
kubectl apply -f https://raw.githubusercontent.com/cert-manager/csi-driver-spiffe/ed646ccf28b1ecdf63f628bf16f1d350a9b850c1/deploy/example/example-app.yaml

kubectl exec -n sandbox \
  $(kubectl get pod -n sandbox -l app=my-csi-app -o jsonpath='{.items[0].metadata.name}') \
  -- \
  cat /var/run/secrets/spiffe.io/tls.crt | \
  openssl x509 --noout --text | \
  grep "Issuer:"
# expected output: Issuer: CN = csi-driver-spiffe-ca

kubectl exec -n sandbox \
  $(kubectl get pod -n sandbox -l app=my-csi-app -o jsonpath='{.items[0].metadata.name}') \
  -- \
  cat /var/run/secrets/spiffe.io/tls.crt | \
  openssl x509 --noout --text | \
  grep "URI:"
# expected output: URI:spiffe://foo.bar/ns/sandbox/sa/example-app
```

### Runtime Configuration

If csi-driver-spiffe was installed with runtime configuration enabled, it will watch
a named ConfigMap for issuer configuration. If that ConfigMap exists and contains a valid issuer
reference, that issuer will be used for all created CertificateRequest resources.

If the ConfigMap is deleted or does not contain a valid issuer reference, it will be
ignored. If a default issuer was specified at install time, that default will be used
as a fallback. If no valid runtime configuration is provided and no default issuer was
specified, issuance (and therefore pod creation) will fail until a valid issuer is configured.

The name of the runtime configuration ConfigMap is set with the `app.runtimeIssuanceConfigMap`
Helm value at install time. A valid ConfigMap must contain the `issuer-name`, `issuer-kind`
and `issuer-group` keys.

An example of creating a ConfigMap for a ClusterIssuer named `my-issuer-name` is below:

```console
kubectl create configmap spiffe-issuer -n cert-manager \
  --from-literal=issuer-name=my-issuer-name \
  --from-literal=issuer-kind=ClusterIssuer \
  --from-literal=issuer-group=cert-manager.io
```

### FS-Group

When running Pods with a specified user or group, the volume will not be
readable by default due to Unix based file system permissions. The mounting
volumes file group can be specified using the following volume attribute:

```yaml
...
      securityContext:
        runAsUser: 123
        runAsGroup: 456
      volumes:
        - name: spiffe
          csi:
            driver: spiffe.csi.cert-manager.io
            readOnly: true
            volumeAttributes:
              spiffe.csi.cert-manager.io/fs-group: "456"
```

```bash
kubectl apply -f https://raw.githubusercontent.com/cert-manager/csi-driver-spiffe/ed646ccf28b1ecdf63f628bf16f1d350a9b850c1/deploy/example/fs-group-app.yaml

kubectl exec -n sandbox $(kubectl get pod -n sandbox -l app=my-csi-app-fs-group -o jsonpath='{.items[0].metadata.name}') -- cat /var/run/secrets/spiffe.io/tls.crt | openssl x509 --noout --text | grep URI:
# expected output: URI:spiffe://foo.bar/ns/sandbox/sa/fs-group-app
```

### Root CA Bundle

> ⚠️ This feature is significantly less powerful than [trust-manager](../../trust/trust-manager/README.md),
> and is much harder to use and update. It's recommended to use trust-manager instead.

By default, the CSI driver will only mount the Pod's private key and signed
certificate. csi-driver-spiffe can be optionally configured to also mount a
statically defined CA bundle from a volume that will be written to all Pod
volumes.

If the CSI driver detects this bundle has changed (through overwrite, renewal,
etc), the new bundle will be written to all existing volumes.

The following example mounts the CA certificate used by the Trust Domain
ClusterIssuer.

```terminal
helm upgrade -i -n cert-manager cert-manager-csi-driver-spiffe jetstack/cert-manager-csi-driver-spiffe --wait \
  --set "app.logLevel=1" \
  --set "app.trustDomain=my.trust.domain" \
  \
  --set "app.runtimeIssuanceConfigMap=spiffe-issuer"
  --set "app.issuer.name=csi-driver-spiffe-ca" \
  --set "app.issuer.kind=ClusterIssuer" \
  --set "app.issuer.group=cert-manager.io" \
  \
  --set "app.driver.volumes[0].name=root-cas" \
  --set "app.driver.volumes[0].secret.secretName=csi-driver-spiffe-ca" \
  --set "app.driver.volumeMounts[0].name=root-cas" \
  --set "app.driver.volumeMounts[0].mountPath=/var/run/secrets/cert-manager-csi-driver-spiffe" \
  --set "app.driver.sourceCABundle=/var/run/secrets/cert-manager-csi-driver-spiffe/ca.crt"

kubectl rollout restart deployment -n sandbox my-csi-app

kubectl exec -it -n sandbox $(kubectl get pod -n sandbox -l app=my-csi-app -o jsonpath='{.items[0].metadata.name}') -- ls /var/run/secrets/spiffe.io/
# expected output: ca.crt   tls.crt  tls.key
```
