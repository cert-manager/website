---
title: Post-quantum certificates (ML-DSA)
description: 'cert-manager usage: issuing post-quantum ML-DSA certificates, consumer compatibility, and a canary migration and rollback guide'
---

cert-manager can issue certificates with post-quantum [ML-DSA (FIPS 204)](https://csrc.nist.gov/pubs/fips/204/final)
keys. ML-DSA is the main post-quantum signature algorithm that NIST standardized to replace RSA and
ECDSA, which a large enough quantum computer could break.

This page explains how to issue ML-DSA certificates, which issuers and consumers
support them, and how to move workloads over safely with a canary and a rollback
plan.

:::warning

⚠️ ML-DSA support is an **alpha** feature, added in cert-manager v1.22.0. It's
disabled by default and you must enable the `MLDSAPrivateKeys` feature gate to use
it (see [Enabling ML-DSA](#enabling-ml-dsa)). Follow
[cert-manager/cert-manager#8929](https://github.com/cert-manager/cert-manager/issues/8929)
for the graduation plan.

**Many TLS consumers can't load ML-DSA certificates yet**, including ingress-nginx
and the releases of popular Gateway API implementations that we tested. Before you
use ML-DSA for a workload, check the [compatibility matrix](#consumer-compatibility)
and follow the [canary migration](#migrating-with-a-parallel-canary).

:::

## How it works

ML-DSA keys use the existing `spec.privateKey` fields of a
[Certificate](./certificate.md):

```yaml
spec:
  privateKey:
    algorithm: MLDSA
    size: 65 # 44 (the default), 65 or 87
```

- **`size`** selects the ML-DSA parameter set: `44` (ML-DSA-44, the default if
  `size` is unset), `65` (ML-DSA-65) or `87` (ML-DSA-87). ML-DSA-44 is the
  parameter set the Go standard library recommends for most applications. If you
  need CNSA 2.0 compliance, use `87`. If you need a particular parameter set, set
  `size` explicitly, so that a change to the default in a future release can't
  affect you.
- **`signatureAlgorithm`** must be left unset. An ML-DSA key can only make one kind
  of signature, so cert-manager derives the signature algorithm from the key's
  parameter set. The webhook rejects a Certificate that sets it.
- **`encoding`** is ignored: ML-DSA private keys are always written to `tls.key`
  as a PKCS#8 `PRIVATE KEY` PEM block that contains only the 32-byte seed (128
  bytes of PEM). As with every key algorithm, `tls.key` isn't encrypted.
- **Key usages:** [RFC 9881](https://www.rfc-editor.org/rfc/rfc9881.html#section-5)
  forbids `key encipherment`, `data encipherment`, `key agreement`,
  `encipher only` and `decipher only` for ML-DSA keys, and the webhook rejects
  them. If `usages` is unset, an ML-DSA Certificate gets `digital signature` only
  (plus `cert sign` if `isCA` is `true`), instead of the usual
  `digital signature` and `key encipherment`. For a TLS server or client
  certificate, set the extended key usage you need explicitly, as in the examples
  below.

The issuer's key, not the Certificate, decides the signature on the issued
certificate. An ML-DSA leaf issued by an ECDSA CA is signed with ECDSA, and an
ECDSA leaf issued by an ML-DSA CA is signed with ML-DSA.

:::warning

⚠️ A certificate is only as strong as the weakest signature in its chain. An
ML-DSA leaf under an RSA or ECDSA CA (a *mixed chain*) doesn't give you
post-quantum authentication: anyone who can break the CA's classical key can forge
certificates. Mixed chains are allowed because they're useful during a migration,
but for post-quantum authentication every certificate in the chain, including the
root, must use ML-DSA.

:::

### Supported issuers

| Issuer | ML-DSA support |
|---|---|
| [SelfSigned](../configuration/selfsigned.md) | ✅ Supported |
| [CA](../configuration/ca.md) | ✅ Supported, with either an ML-DSA or a classical CA key pair (see [Bringing your own ML-DSA CA key](#bringing-your-own-ml-dsa-ca-key)) |
| [Kubernetes CertificateSigningRequests](./kube-csr.md) signed by a SelfSigned or CA issuer | ✅ Supported, but the Kubernetes API server must be built with Go 1.27 or later, and the controller also needs the `ExperimentalCertificateSigningRequestControllers` feature gate (see [Kubernetes CertificateSigningRequests](#kubernetes-certificatesigningrequests)) |
| ACME, Vault, CyberArk (Venafi) and external issuers | ❌ Not supported. cert-manager sends the ML-DSA CSR to the CA unchanged, and the CA decides whether to accept it. This isn't tested. |

cert-manager never falls back to a classical algorithm. If an issuer can't sign an
ML-DSA request, the CertificateRequest fails and the Certificate stays not Ready.

The cert-manager subprojects (csi-driver, csi-driver-spiffe, istio-csr,
trust-manager and approver-policy) don't support ML-DSA yet, and nor do the cmctl
commands that generate keys, such as `cmctl create certificaterequest`. Other cmctl
commands, such as `cmctl renew`, work with ML-DSA Certificates.

## Enabling ML-DSA

While ML-DSA is alpha, enable the `MLDSAPrivateKeys` feature gate on **both** the
controller and the webhook. With Helm, add the following to your `values.yaml`:

```yaml
featureGates: "MLDSAPrivateKeys=true"
webhook:
  featureGates: "MLDSAPrivateKeys=true"
```

If you already set other feature gates, add `MLDSAPrivateKeys=true` to the
comma-separated list. You can also use the
[configuration file](../installation/configuring-components.md#configuration-file)
of each component instead.

If you turn the gate off again later, existing ML-DSA Certificates are affected as
follows. Each point applies to the component on which the gate is off:

- The webhook rejects new Certificates with `algorithm: MLDSA`, and changes from
  another algorithm to `MLDSA`, with the error
  `MLDSA requires the MLDSAPrivateKeys feature gate to be enabled`. It also rejects
  CertificateRequests whose CSR has an ML-DSA public key. You can still edit and
  delete existing ML-DSA Certificates.
- The controller doesn't renew or re-issue existing ML-DSA Certificates. Instead,
  it records a Warning event with reason `MLDSAPrivateKeysDisabled` on the
  Certificate.
- A CA Issuer or ClusterIssuer whose CA key is ML-DSA stops being Ready, with
  reason `MLDSAPrivateKeysDisabled` and the message
  `Signing CA has an ML-DSA key, which requires the MLDSAPrivateKeys feature gate to be enabled`.
  Renewals of the classical Certificates it issued, and Kubernetes
  CertificateSigningRequests sent to it, wait until you turn the gate back on,
  or move them to another issuer.
- The SelfSigned and CA issuers and the Kubernetes CSR signers refuse to sign
  anything that involves an ML-DSA key. A CertificateRequest stays pending, with
  an event with reason `MLDSAPrivateKeysDisabled`, and is signed once you turn the
  gate back on. A Kubernetes CertificateSigningRequest with an ML-DSA key is
  marked as failed.
- Existing Secrets are **not** deleted, so workloads keep using them until the
  certificates expire.

If the gate is off on the webhook but on in the controller, the controller still
tries to renew ML-DSA Certificates, but the renewals fail because the webhook
rejects the new CertificateRequests.

## Issuing an ML-DSA certificate

This example creates a fully post-quantum chain: an ML-DSA-65 root CA, a CA issuer
that uses it, and an ML-DSA-65 TLS server certificate.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned
  namespace: sandbox
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: mldsa-root
  namespace: sandbox
spec:
  isCA: true
  commonName: Example ML-DSA-65 root CA
  secretName: mldsa-root
  privateKey:
    algorithm: MLDSA
    size: 65
  issuerRef:
    name: selfsigned
    kind: Issuer
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: mldsa-ca
  namespace: sandbox
spec:
  ca:
    secretName: mldsa-root
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com-mldsa
  namespace: sandbox
spec:
  secretName: example-com-mldsa-tls
  dnsNames:
    - example.com
  privateKey:
    algorithm: MLDSA
    size: 65
  usages:
    - digital signature
    - server auth
  issuerRef:
    name: mldsa-ca
    kind: Issuer
```

The resulting Secret has the usual `tls.crt`, `tls.key` and `ca.crt` keys. You can
check the key and signature algorithms with OpenSSL 3.5 or later:

```bash
kubectl get secret -n sandbox example-com-mldsa-tls -o jsonpath='{.data.tls\.crt}' \
  | base64 -d | openssl x509 -noout -text | grep -E 'Public Key Algorithm|Signature Algorithm'
```

ML-DSA certificates and signatures are much bigger than ECDSA ones. With an
intermediate CA, `tls.crt` is about 11 KB for ML-DSA-44, 15 KB for ML-DSA-65 and
20 KB for ML-DSA-87, compared with about 1.5 KB for ECDSA P-256. The private key is
always 128 bytes of PEM. These sizes fit easily in a Secret, but every TLS
handshake sends the chain, so consider the extra bandwidth and latency.

### Ingress and Gateway resources

The [`cert-manager.io/private-key-algorithm`](../reference/annotations.md#cert-managerioprivate-key-algorithm)
and [`cert-manager.io/private-key-size`](../reference/annotations.md#cert-managerioprivate-key-size)
annotations accept `MLDSA` and `44`, `65` or `87` on
[Ingress](./ingress.md) and [Gateway](./gateway.md) resources. With
`MLDSA`, cert-manager sets the Certificate's usages to `digital signature` unless
you set the `cert-manager.io/usages` annotation. If that annotation includes a
usage that ML-DSA doesn't allow, or if the `MLDSAPrivateKeys` feature gate is
disabled on the controller, cert-manager doesn't create or update the Certificate.
It records a `BadConfig` Warning event on the Ingress, Gateway or ListenerSet,
which you can see with `kubectl describe`.

Remember that the ingress controller or Gateway implementation must be able to
load the ML-DSA Secret. Of the versions we tested, ingress-nginx, Envoy Gateway,
kgateway and Istio can't (see [Consumer compatibility](#consumer-compatibility)).

### Additional output formats and keystores

The `CombinedPEM` and `DER` [additional output formats](./certificate.md#additional-certificate-output-formats),
and the PKCS#12 and JKS keystores, all work with ML-DSA keys. Only some
consumers can read ML-DSA keys from a keystore: for example, JDK 25 and later can,
but JDK 21 can't.

### Bringing your own ML-DSA CA key

cert-manager reads ML-DSA private keys in the *seed-only* PKCS#8 format, which is
what cert-manager itself writes. OpenSSL 3.5 and later writes a different format
(seed and expanded key) by default, which cert-manager can't read. A CA issuer
with such a key isn't Ready, and its condition says:

```text
Error getting keypair for CA issuer: error parsing pkcs#8 private key: x509: ML-DSA private keys with both seed and expanded key are not supported, use e.g. "openssl pkey -provparam ml-dsa.output_formats=seed-only" to convert to a seed-only key
```

Generate a seed-only key, or convert an existing key, like this:

```bash
# Generate a new seed-only ML-DSA-65 key:
openssl genpkey -algorithm ML-DSA-65 -provparam ml-dsa.output_formats=seed-only -out ca.key

# Convert an existing key:
openssl pkey -in ca-openssl.key -provparam ml-dsa.output_formats=seed-only -out ca.key
```

Converting only works for keys that contain the seed, as OpenSSL's default format
does. A key with only the expanded form can't be converted, and cert-manager
rejects it with `x509: semi-expanded ML-DSA private keys without seed are not supported`.
Generate a new seed-only key instead.

kubectl v1.37 and earlier can't create the Secret with `kubectl create secret tls`,
because they're built with a Go version that doesn't support ML-DSA
(`error: tls: failed to parse private key`). With these versions, create it as a
generic Secret with the `kubernetes.io/tls` type instead:

```bash
kubectl create secret generic my-mldsa-ca -n sandbox --type=kubernetes.io/tls \
  --from-file=tls.crt=ca.crt --from-file=tls.key=ca.key
```

A Kubernetes API server built with a Go version older than 1.27, such as
Kubernetes v1.37, may print `Warning: tls: failed to parse private key` for this
Secret, for the same reason. It still stores the Secret.

### Kubernetes CertificateSigningRequests

The Kubernetes API server checks the signature of a CertificateSigningRequest
when you create it. It can only check ML-DSA signatures if it's built with Go 1.27
or later. Kubernetes v1.37 and earlier are built with older Go versions, so they
reject ML-DSA CertificateSigningRequests with
`x509: cannot verify signature: algorithm unimplemented`. Certificates and
CertificateRequests don't depend on the Kubernetes version.

The cert-manager signers for CertificateSigningRequests are themselves behind the
`ExperimentalCertificateSigningRequestControllers` feature gate (see
[Kubernetes CertificateSigningRequests](./kube-csr.md)), so enable it on the
controller as well as `MLDSAPrivateKeys`. The webhook isn't involved, so it doesn't
need either gate for CertificateSigningRequests.

CertificateSigningRequests don't go through the cert-manager webhook, so the
SelfSigned and CA signers check the usages themselves: they refuse to sign an
ML-DSA request whose `spec.usages` includes `key encipherment`, `data encipherment`,
`key agreement`, `encipher only` or `decipher only`.

## Consumer compatibility

cert-manager can write a perfectly valid ML-DSA Secret that a consumer can't load.
In particular, most Kubernetes controllers read TLS Secrets with the Go standard
library, and Go only supports ML-DSA from Go 1.27. A controller built with Go 1.26
or earlier rejects the key, typically with an error such as
`tls: failed to parse private key`, even if its
data plane supports ML-DSA.

The cert-manager maintainers tested the following consumers on 2026-10-15, with
ML-DSA-44, ML-DSA-65 and ML-DSA-87 chains (root, intermediate and leaf, all
ML-DSA) issued by the SelfSigned and CA issuers.

| Consumer | Version tested | Loads the key and certificate | TLS handshake | Notes |
|---|---|---|---|---|
| Go `crypto/tls` | 1.27.1 | ✅ | ✅ server, client and mutual TLS | Handshakes used TLS 1.3 with the post-quantum `X25519MLKEM768` key exchange. |
| Programs built with Go 1.26 or earlier | various | ❌ `tls: failed to parse private key` | ❌ | Includes `kubectl create secret tls` (kubectl v1.37.1). |
| OpenSSL | 3.5.7, 3.6.4 | ✅ including PKCS#12 keystores | ✅ server, client and mutual TLS | OpenSSL added ML-DSA in 3.5. |
| NGINX | 1.31.7 (OpenSSL 3.5.7) | ✅ | ✅ server and client certificate verification | Depends on the OpenSSL version NGINX is built with. |
| Envoy | 1.37.9 | ❌ `Failed to load certificate chain` | ❌ | |
| Envoy | 1.40.0 | ✅ | ✅ server certificates | For client certificates (mutual TLS), add the ML-DSA scheme to `tls_params.signature_algorithms`, for example `mldsa65`. Otherwise Envoy doesn't ask for ML-DSA client certificates. |
| ingress-nginx | v1.12.3, v1.15.1 | ❌ `tls: failed to parse private key` | ❌ | ⚠️ **Fails silently:** the controller logs a warning and serves its default self-signed certificate instead. |
| Envoy Gateway | v1.9.2 | ❌ | ❌ | The listener's `ResolvedRefs` condition is `False` with reason `InvalidCertificateRef`. |
| kgateway | v2.4.6 | ❌ `tls: failed to parse private key` | ❌ | The Gateway's `Accepted`, `Programmed` and `ResolvedRefs` conditions are `False`. |
| Istio Gateway | 1.30.5 | ❌ `tls: failed to parse private key` | ❌ | The Gateway's `Programmed` condition is `False`. Istio 1.31.1 wasn't tested, but its control plane is built with the same Go version (1.26.7). |
| Java (JDK) | 25, 26, 27 | ✅ PKCS#12 and JKS keystores | ❌ `No available authentication scheme` | The JDK supports ML-DSA keys and signatures (JEP 497) but not yet in TLS. |
| Java (JDK) | 21 | ❌ `KeyFactory not available` | ❌ | |
| Google Chrome | 155 | not applicable | ✅ server certificates (ML-DSA-44 and ML-DSA-87; ML-DSA-65 not tested) | Tested with certificate errors ignored, so chain validation to a private ML-DSA root wasn't tested. |

The Kubernetes controllers that fail were all built with Go 1.26 or earlier. The
Gateway API implementations may work once they're built with Go 1.27, but we
haven't tested that. ingress-nginx reached end of life in March 2026, so don't
expect it to gain ML-DSA support: see
[Ingress-nginx End-of-Life](/announcements/2025/11/26/ingress-nginx-eol-and-gateway-api)
for migration guidance. Support changes
quickly, so check the current release of each consumer you use, and test it with
the [canary migration](#migrating-with-a-parallel-canary) before you rely on it.

## Migrating with a parallel canary

Don't switch an existing Certificate to ML-DSA in place. If a consumer can't load
the new Secret, the workload breaks as soon as the certificate is re-issued.
Instead, issue an ML-DSA certificate *alongside* the classical one, and move
workloads over one at a time:

1. **Inventory the consumers.** For each certificate you want to migrate, list
   everything that reads the Secret (servers, ingress controllers, Gateway
   implementations, proxies, sidecars, Java applications) and everything that
   validates the certificate (clients and their trust stores). Check each one
   against the [compatibility matrix](#consumer-compatibility).
1. **Issue a parallel ML-DSA Certificate** into a new Secret. Keep the classical
   Certificate and its Secret unchanged. For example, next to an existing
   `example-com` Certificate that writes `example-com-tls`:

   ```yaml
   apiVersion: cert-manager.io/v1
   kind: Certificate
   metadata:
     name: example-com-mldsa
     namespace: sandbox
   spec:
     secretName: example-com-mldsa-tls # a new Secret
     dnsNames:
       - example.com
     privateKey:
       algorithm: MLDSA
       size: 65
     usages:
       - digital signature
       - server auth
     issuerRef:
       name: mldsa-ca # an ML-DSA CA, for post-quantum authentication
       kind: Issuer
   ```

1. **Distribute the new trust anchor.** If the ML-DSA certificate chains to a new
   ML-DSA root, add that root to the clients' trust stores *in addition to* the
   classical root. Don't remove the classical root yet.
1. **Validate every class of consumer** with the new Secret, outside the production
   path. For example, run a test instance of each server and proxy with the
   ML-DSA Secret, and connect to it with each type of client. Check that:
   - the consumer loads the Secret (look for errors, and for silent fallbacks such
     as ingress-nginx serving its default certificate)
   - the handshake completes and the client verifies the chain
   - mutual TLS works, if you use it
   - renewal works: the consumer picks up a re-issued certificate. You can force
     a re-issue with `cmctl renew`.
1. **Migrate selected workloads.** Point a small number of workloads at the new
   Secret, for example by changing a Deployment's volume, an Ingress's
   `spec.tls[].secretName` or a Gateway listener's `certificateRefs`. Watch
   handshake errors and client failures.

   If the Ingress or Gateway has cert-manager annotations, don't point it at the
   Secret of a Certificate you created yourself. cert-manager would create a second
   Certificate for the new Secret from the resource's annotations, and delete the
   classical Certificate it no longer needs. Instead, create a separate canary
   Ingress, Gateway or [ListenerSet](./gateway.md#listenerset) with a new Secret
   name and the annotations `cert-manager.io/private-key-algorithm: MLDSA`,
   `cert-manager.io/private-key-size` and `cert-manager.io/usages` (for example
   `digital signature,server auth`). Also set `cert-manager.io/issuer` or
   `cert-manager.io/cluster-issuer` to an issuer that supports ML-DSA, such as an
   ML-DSA CA issuer: copying the original resource's ACME issuer won't work. A
   ListenerSet without its own issuer annotation uses its parent Gateway's issuer.
   Leave the original resource unchanged, and move traffic between the two. The
   annotations apply to every listener of a Gateway, so don't add a canary listener
   to an existing annotated Gateway.
1. **Keep the rollback path.** Keep the classical Certificate, its Secret and the
   classical trust anchor in place, so that you can [roll back](#rolling-back)
   at any time.
1. **Expand only with evidence.** Move more workloads only when the canary
   workloads have run cleanly, including through at least one renewal. Remove the
   classical Certificate and trust anchor only when nothing uses them any more.

## Rolling back

If you followed the canary migration, rolling back doesn't need any changes to
cert-manager:

1. Point the affected workloads back at the classical Secret (for example,
   `example-com-tls`), and restart them if they don't reload certificates
   automatically. If you used a canary Ingress or Gateway, move the traffic back
   to the original resource instead.
1. Check that the workloads serve the classical certificate again, for example
   with `openssl s_client -connect <host>:443 -servername <name>`.
1. Keep the classical trust anchor on all clients.
1. Optionally, delete the ML-DSA Certificate. Its Secret is only deleted if
   cert-manager runs with `--enable-certificate-owner-ref`, or when you delete
   it yourself.

If you changed an existing Certificate to ML-DSA in place, change
`spec.privateKey` back to the classical algorithm and size, remove any
`usages` you changed, and if you changed `issuerRef` to an issuer with an ML-DSA
CA key, change it back to a classical issuer. With the default `rotationPolicy: Always`, cert-manager
re-issues the certificate with a new classical key straight away. With
`rotationPolicy: Never`, cert-manager can't change the key, so it records a
`CannotRegenerateKey` warning and waits. Set `rotationPolicy: Always` to let it
re-issue. If cert-manager created the Certificate from Ingress or Gateway
annotations, change or remove the `cert-manager.io/private-key-algorithm`,
`cert-manager.io/private-key-size` and `cert-manager.io/usages` annotations (and
change back any `cert-manager.io/issuer` or `cert-manager.io/cluster-issuer`
annotation) on the Ingress or Gateway instead, because cert-manager overwrites changes made
directly to such a Certificate.

Before you **downgrade cert-manager** to a version without ML-DSA support, change
every ML-DSA Certificate to a classical algorithm and wait for it to be re-issued,
or delete it. An older version's webhook rejects every update to an ML-DSA
Certificate, so those Certificates get stuck, and an older controller may crash
when it reconciles them, which stops renewals for **all** Certificates. Also move
any Certificates issued by a CA issuer with an ML-DSA CA key to a classical issuer,
or delete them, because an older version can't load ML-DSA CA keys.

If you disable the `MLDSAPrivateKeys` feature gate instead, existing ML-DSA
Secrets are kept, but cert-manager stops renewing them, and also stops renewing
Certificates issued by a CA issuer with an ML-DSA CA key (see
[Enabling ML-DSA](#enabling-ml-dsa)). Roll back affected workloads, or move those
Certificates to a classical issuer, before their certificates expire.
