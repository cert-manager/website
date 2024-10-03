---
title: Frequently Asked Questions (FAQ)
description: Find answers to some frequently asked questions about cert-manager
---

On this page you will find answers to some frequently asked questions about cert-manager.

## Terminology

### What does `publicly trusted` and `self-signed` mean?

These terms are defined in the [TLS Terminology page](../reference/tls-terminology.md).

### What do the terms `root`, `intermediate` and `leaf` _certificate_ mean?

These terms are defined in the [TLS Terminology page](../reference/tls-terminology.md).

## Certificates

### Can I trigger a renewal from cert-manager at will?

This is a feature in cert-manager starting in `v0.16` using the `cmctl` CLI. More information can be found on [the renew command's page](../reference/cmctl.md#renew)

### When do certs get re-issued?

To determine if a certificate needs to be re-issued, cert-manager looks at the the spec of `Certificate` resource and latest `CertificateRequest`s as well as the data in `Secret` containing the X.509 certificate.

The issuance process will always get triggered if the:

- `Secret` named on `Certificate`'s spec, does not exist, is missing private key or certificate data or contains corrupt data
- private key stored in the `Secret` does not match the private key spec on `Certificate`
- public key of the issued certificate does not match the private key stored in the `Secret`
- cert-manager issuer annotations on the `Secret` do not match the issuer specified on the `Certificate`
- DNS names, IP addresses, URLS or email addresses on the issued certificate do not match those on the `Certificate` spec
- certificate needs to be renewed (because it has expired or the renewal time is now or in the past)
- certificate has been marked for renewal manually [using `cmctl`](../reference/cmctl.md#renew)

Additionally, if the latest `CertificateRequest` for the `Certificate` is found, cert-manager will also re-issue if:

- the common name on the CSR found on the `CertificateRequest` does not match that on the `Certificate` spec
- the subject fields on the CSR found on the `CertificateRequest` do not match the subject fields of the `Certificate` spec
- the duration on the `CertificateRequest` does not match the duration on the `Certificate` spec
- `isCA` field value on the `Certificate` spec does not match that on the `CertificateRequest`
- the DNS names, IP addresses, URLS or email addresses on the `CertificateRequest` spec do not match those on the `Certificate` spec
- key usages on the `CertificateRequest` spec do not match those on the `Certificate` spec

Note that for certain fields re-issuance on change gets triggered only if there
is a `CertificateRequest` that cert-manager can use to determine whether
`Certificate`'s spec has changed since the previous issuance. This is because
some issuers may not respect the requested values for these fields, so we cannot
rely on the values in the issued X.509 certificates. One such field is
`.spec.duration`- change to this field will only trigger re-issuance if there is
a `CertificateRequest` to compare with. In case where you need to re-issue, but
re-issuance does not get triggered automatically due to there being no
`CertificateRequest` (i.e after backup and restore), you can use [`cmctl
renew`](../reference/cmctl.md#renew) to trigger it manually.

### Why isn't my root certificate in my issued Secret's `tls.crt`?

Occasionally, people work with systems which have made a flawed choice regarding TLS chains. The [TLS spec](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.2)
has the following section for the "Server Certificate" section of the TLS handshake:

> This is a sequence (chain) of certificates.  The sender's
> certificate MUST come first in the list.  Each following
> certificate MUST directly certify the one preceding it.  Because
> certificate validation requires that root keys be distributed
> independently, the self-signed certificate that specifies the root
> certificate authority MAY be omitted from the chain, under the
> assumption that the remote end must already possess it in order to
> validate it in any case.

In a standard, secure and correctly configured TLS environment, adding a root certificate to the chain is
almost always unnecessary and wasteful.

There are two ways that a certificate can be trusted:

- explicitly, by including it in a trust store.
- through a signature, by following the certificate's chain back up to an explicitly trusted certificate.

Crucially, root certificates are by definition self-signed and they cannot be validated through a signature.

As such, if we have a client trying to validate the certificate chain sent by the server, the client must already have the
root before the connection is started. If the client already has the root, there was no point in it being sent by the server!

The same logic with not sending root certificates applies for servers trying to validate client certificates;
the [same justification](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.6) is given in the TLS RFC.

<a id="chain-cacrt"></a>
### Why isn't my certificate's chain in my issued Secret's `ca.crt`?

Users frequently ask us about changing `ca.crt` to include more certs or different certs. We tend to push back on these requests
for the simple reason that we believe `ca.crt` to most often be a risk for any user.

`ca.crt` is filled by cert-manager with a "best guess" of what the issuing CA was. Importantly, cert-manager can often only guess;
if the issuer doesn't provide the full chain including the root certificate, there might be no way for cert-manager to know what the
root of the chain is. In that case, cert-manager will make a best-effort attempt to use the issuer deepest in the chain.

That "best effort" attempt is one of the reasons that `ca.crt` can be risky; it might not be correct, and it might change when the issuer
changes even if nothing in cert-manager changes.

The other issue with `ca.crt` is fundamental - it's updated when the certificate is updated. Some users can be tempted to use `ca.crt`
for trust purposes, but rotating trusted certificates safely relies on being able to have both the old and new CA certificates trusted at the same time.

By consuming the CA directly from your Secret, it becomes impossible to do this; `ca.crt` will only ever contain the best effort guess
for the CA for the current certificate, and will never include an older or a new CA.

### How can I see all the historic events related to a certificate object?

cert-manager publishes all events to the Kubernetes events mechanism, you can get the events for your specific resources using `kubectl describe <resource> <name>`.

Due to the nature of the Kubernetes event mechanism these will be purged after a while. If you're using a dedicated logging system it might be able or is already also storing Kubernetes events.

{/* This empty link preserves old links to #what-happens-if-a-renewal-doesn't happen?-will-it-be-tried-again-after-some-time?", which matched the old title of this section */}
<a id="alternative-certificate-chain"></a>
### What happens if issuance fails? Will it be retried?

cert-manager will retry a failed issuance except for a few rare edge cases where
manual intervention is needed.

We aim to retry after a short delay in case of ephemeral failures such as
network connection errors and with a longer exponentially increasing delay after
'terminal' failures.

You can observe that latest issuance has terminally failed if the `Certificate`
has `Issuing` condition set to false and has `status.lastFailureTime` set. In
this case the issuance will be retried after an exponentially increasing delay
(1 to 32 hours) by creating a new `CertficateRequest`. You can trigger an
immediate renewal using the [`cmctl renew`
command](../reference/cmctl.md#renew). Terminal failures occur if the issuer
sets the `CertificateRequest` to failed (for example if CA rejected the request
due to a rate limit being reached) or invalid or if the `CertificateRequest`
gets denied by an approver.

Ephemeral failures result in the same `CertificateRequest` being re-synced after
a short delay (up to 5 minutes). Typically they can only be observed in
cert-manager controller logs.

If it appears the issuance has got stuck and `cmctl renew` does not work, you
can delete the latest `CertificateRequest`. This is mostly a harmless action
(the worst that could happen is duplicate issuance if there was a potentially
successful one in progress), but we do aim for this to not be part of user flow-
do reach out if you think you have found a case where the flow could be
improved.

### Is ECC (elliptic-curve cryptography) supported?

cert-manager supports ECDSA key pairs! You can set your certificate to use ECDSA  in the `privateKey` part of your Certificate resource.

For example:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ecdsa
spec:
  secretName: ecdsa-cert
  isCA: false
  privateKey:
    algorithm: ECDSA
    size: 256
  dnsNames:
    - ecdsa.example.com
  issuerRef:
    [...]
```

### If `renewBefore` or `duration` is not defined, what will be the default value?

Default `duration` is [90 days](https://github.com/cert-manager/cert-manager/blob/v1.13.3/pkg/apis/certmanager/v1/const.go#L26). If `renewBefore` has not been set, `Certificate` will be renewed 2/3 through its _actual_ duration.

<a id="keystore-passwords"></a>
### Why are passwords on JKS or PKCS#12 files not helpful?

This question comes in many forms, including:

- "Why is it OK to hard code these passwords?"
- "Do I need to keep these passwords secure?"
- "Are these passwords used in a secure way?"

Specifically, this FAQ talks about passwords for PKCS#12 and JKS "keystores".

#### Simple Answer

"Passwords" on PKCS#12 or JKS files are almost always security theater, and they're only needed to support applications which are unable to parse password-less versions of these files. Even if you use a secure password for these files (which is rare), weak encryption algorithms and the management of the underlying material usually invalidate the secure password.

We recommend that you treat these passwords as legacy implementation details, and use short hard-coded strings for these passwords when you're
forced to use one. Don't spend time trying to generate or handle "secure" passwords for these files - simply choose a constant such as `changeit` or `notapassword123` and use that for every PKCS#12 or JKS bundle you generate.

#### Longer Answer

Lots of people see the word "password" when handling JKS or PKCS#12 bundles and they draw the obvious
conclusion that it's a valuable security resource which needs to be handled carefully.

This is generally not the case - not only are these passwords not really passwords, but they're also vanishingly unlikely to be meaningful for security of any kind.

Mostly, these passwords exist only because some applications require some password to be set. That requirement is the sole reason for cert-manager and its sub-projects supporting setting a password on these types of bundles.

There are several main reasons why we don't consider these passwords to be security critical:

1. Most applications which use these passwords will mount the file containing the password in plain text right next to the bundle which uses it, with the same permissions and access control. This would make even the most secure password completely pointless as a security measure.
2. Most PKCS#12 and JKS bundles which are encrypted use extremely old encryption algorithms which are fundamentally insecure
3. The word "password" leads people to think of human-memorable passwords, which are not appropriate for this kind of encryption. This means that the passwords used are often themselves insecure in this context.
4. When we generate PKCS#12 or JKS files, they almost always live in the same Secret as an unencrypted private key anyway!

Without a very detailed threat model and putting serious time into your system's architecture in an extremely paranoid way, spending time on these "passwords" is going to be a red herring time sink with little to no return. Your efforts would almost always be better spent on securing systems through other methods.

See "simple answer" above for usage guidelines for these "passwords".

## Miscellaneous

### Kubernetes has a builtin `CertificateSigningRequest` API. Why not use that?

Kubernetes has a [Certificate Signing Requests API],
and a [`kubectl certificates` command] which allows you to approve certificate signing requests
and have them signed by the certificate authority (CA) of the Kubernetes cluster.

This API and CLI have occasionally been misused to sign certificates for use by non-control-plane Pods but this is a mistake.
For the security of the Kubernetes cluster, it is important to limit access to the Kubernetes certificate authority,
and it is important that you do not use that certificate authority to sign certificates which are used outside of the control-plane,
because such certificates increase the opportunity for attacks on the Kubernetes API server.

In Kubernetes 1.19 the [Certificate Signing Requests API] has reached V1
and it can be used more generally by following (or automating) the [Request Signing Process].

cert-manager currently has some [limited experimental support] for this resource.

[Certificate Signing Requests API]: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#certificatesigningrequest-v1-certificates-k8s-io
[`kubectl certificates` command]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#certificate
[Request signing process]: https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#request-signing-process
[limited experimental support]: ../usage/kube-csr.md

### How to write "cert-manager"

cert-manager should always be written in lowercase. Even when it would normally be
capitalized such as in titles or at the start of sentences. A hyphen should always be
used between the words, don't replace it with a space and don't remove it.
