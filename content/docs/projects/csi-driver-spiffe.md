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

SPIFFE documents can then be used by Pods for mutual TLS (mTLS) or other authentication within their Trust Domain.
### Components

The project is split into two components.

#### CSI Driver

The CSI driver runs as DaemonSet on the cluster which is responsible for
generating, requesting, and mounting the certificate key pair to Pods on the
node it manages. The CSI driver creates and manages a
[tmpfs](https://www.kernel.org/doc/html/latest/filesystems/tmpfs.html) directory
which is used to create and mount Pod volumes from.

When a Pod is created with the CSI volume configured, the
driver will locally generate a private key, and create a cert-manager
[CertificateRequest](../concepts/certificaterequest.md)
in the same Namespace as the Pod.

The driver uses [CSI Token Request](https://kubernetes-csi.github.io/docs/token-requests.html) to both
discover the Pod's identity to form the SPIFFE identity contained in the X.509
certificate signing request, as well as securely impersonate its ServiceAccount
when creating the CertificateRequest.

Once signed by the pre-configured target signer, the driver will mount the
private key and signed certificate into the Pod's Volume to be made available as
a Volume Mount. This certificate key pair is regularly renewed based on the
expiry of the signed certificate.

#### Approver

A distinct [cert-manager approver](../concepts/certificaterequest.md#approval)
Deployment is responsible for managing the approval and denial condition of
created CertificateRequests that target the configured SPIFFE Trust Domain
signer.

The approver ensures that requests have:

1. acceptable key usages (Key Encipherment, Digital Signature, Client Auth, Server Auth);
2. a requested duration which matches the enforced duration (default 1 hour);
3. no [SANs](https://en.wikipedia.org/wiki/Subject_Alternative_Name) or other
   identifiable attributes except a single [URI SAN](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier);
4. a URI SAN which is the SPIFFE identity of the ServiceAccount which created
   the CertificateRequest;
5. a SPIFFE ID Trust Domain matching the one that was configured at startup.

If any of these checks do not pass, the CertificateRequest will be marked as
Denied, else it will be marked as Approved. The approver will only manage
CertificateRequests who request from the same [IssuerRef](../concepts/certificaterequest.md)
that has been configured.

## Installation

### Requirements

csi-driver-spiffe generally requires Kubernetes version `v1.21` or newer.

If running on Kubernetes `v1.20`, you'll need the `--feature-gates=CSIServiceAccountToken=true` flag.

cert-manager `v1.3` or higher is also required.

### Steps

#### 1. Install cert-manager

csi-driver-spiffe requires cert-manager to be [installed](../installation/README.md) but
a default installation of cert-manager **will not work**.

> ⚠️ It is **vital** that the [default approver is disabled in cert-manager](../concepts/certificaterequest.md#approver-controller) ⚠️

If the default approver is not disabled, the csi-driver-spiffe approver will
race with cert-manager and policy enforcement will become useless.

```bash
helm repo add jetstack https://charts.jetstack.io --force-update

# NOTE: This isn't the usual cert-manager install process;
# we're disabling the cert-manager approver.
# See explanation above!

helm upgrade -i -n cert-manager cert-manager jetstack/cert-manager \
  --set extraArgs={--controllers='*\,-certificaterequests-approver'} \
  --set installCRDs=true \
  --create-namespace
```

#### 2. Configure an Issuer / ClusterIssuer

Install or configure a [ClusterIssuer](../configuration/README.md) to give
cert-manager the ability to sign against your Trust Domain.

If you want a namespace-scoped Issuer, then it must be created in every namespace
that Pods will mount volumes from.

You must use an Issuer type which is compatible with signing URI SAN certificates;
ACME issuers won't generally work, and the SelfSigned issuer is not appropriate.

An example demo [ClusterIssuer](../concepts/issuer.md#namespaces) can
be found [in the csi-driver-spiffe repo](https://github.com/cert-manager/csi-driver-spiffe/blob/23a9fe31b9879fb162cb24c98352d4d5019171f2/deploy/example/clusterissuer.yaml).

> ⚠️ This Trust Domain's root CA is generated by cert-manager and **the private key is stored in the cluster**
> This might not be appropriate for production deployments!

We'll also use [cmctl](../reference/cmctl.md) to approve the CertificateRequest,
since the default approver was disabled above.

```terminal
kubectl apply -f https://raw.githubusercontent.com/cert-manager/csi-driver-spiffe/23a9fe31b9879fb162cb24c98352d4d5019171f2/deploy/example/clusterissuer.yaml

# We must also approve the CertificateRequest since we
# disabled the default approver
cmctl approve -n cert-manager \
  $(kubectl get cr -n cert-manager -ojsonpath='{.items[0].metadata.name}')
```

#### 3. Install csi-driver-spiffe

Install csi-driver-spiffe into the cluster using the issuer we configured. We
must also configure the issuer resource type and name of the issuer we
configured so that the approver has [permissions to approve referencing CertificateRequests](../concepts/certificaterequest.md#rbac-syntax).

Note that the `issuer.name`, `issuer.kind` and `issuer.group` will need to be changed to match
the issuer you're actually using!

```bash
helm upgrade -i -n cert-manager cert-manager-csi-driver-spiffe jetstack/cert-manager-csi-driver-spiffe --wait \
 --set "app.logLevel=1" \
 --set "app.trustDomain=my.trust.domain" \
 --set "app.approver.signerName=clusterissuers.cert-manager.io/csi-driver-spiffe-ca" \
 \
 --set "app.issuer.name=csi-driver-spiffe-ca" \
 --set "app.issuer.kind=ClusterIssuer" \
 --set "app.issuer.group=cert-manager.io"
```

## Usage

Once the driver is successfully installed, Pods can begin to request and mount
their key and SPIFFE certificate. Since the Pod's ServiceAccount is impersonated
when creating CertificateRequests, every ServiceAccount must be given that
permission which intends to use the volume.

Example manifest with a dummy Deployment:

```bash
kubectl apply -f https://raw.githubusercontent.com/cert-manager/csi-driver-spiffe/23a9fe31b9879fb162cb24c98352d4d5019171f2/deploy/example/example-app.yaml

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
kubectl apply -f https://raw.githubusercontent.com/cert-manager/csi-driver-spiffe/23a9fe31b9879fb162cb24c98352d4d5019171f2/deploy/example/fs-group-app.yaml

kubectl exec -n sandbox $(kubectl get pod -n sandbox -l app=my-csi-app-fs-group -o jsonpath='{.items[0].metadata.name}') -- cat /var/run/secrets/spiffe.io/tls.crt | openssl x509 --noout --text | grep URI:
# expected output: URI:spiffe://foo.bar/ns/sandbox/sa/fs-group-app
```

### Root CA Bundle

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
  --set "app.approver.signerName=clusterissuers.cert-manager.io/csi-driver-spiffe-ca" \
  \
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
