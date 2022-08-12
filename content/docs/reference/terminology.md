---
title: TLS Terminology
description: 'cert-manager FAQ: TLS terminology'
---

With TLS being so widely deployed, terminology can sometimes get confused or be used to mean different things, and that reality
combined with the complexity of TLS can lead to serious misunderstandings and confusion.

For further reference, you might want to check out some relevant RFCs:

- [RFC 5246: TLS 1.2](https://datatracker.ietf.org/doc/html/rfc5246)
- [RFC 8446: TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
- [RFC 5280: X.509](https://datatracker.ietf.org/doc/html/rfc5280)

### What does "publicly trusted" mean?

Broadly speaking, a "publicly trusted" certificate is one that you can use on the Internet and expect
that most reasonably up-to-date computers will be able to verify it using their system trust store.

There isn't a single standard trust store containing certs which are "publicly trusted", but generally most
of the commonly seen trust stores are similar. An example would be [Mozilla's CA Certificate Program](https://wiki.mozilla.org/CA).

### What does "self-signed" mean? Is my CA self-signed?

Self-signed means exactly what it says; a certificate is self-signed if it is signed by its own private key.

Self-signed is a commonly confused term, however, and is very frequently misused to mean "not publicly trusted". We tend to use terms
like "private PKI" to denote the situation where an organization might have their own internal CA certificates which wouldn't
be trusted outside of the organization.

As an example, there are _many_ self-signed certificates in [Mozilla's CA Certificate Program](https://wiki.mozilla.org/CA), but
all of those certificates would usually be described as "publicly trusted".

Your certificate is self-signed only if it's signed with its own key.

### What's the difference between "root", "intermediate", and "leaf" certificates?

cert-manager uses the following definitions:

#### Root Certificates

Roots are self-signed certificates and almost always marked as CA certificates. They're usually not sent over the wire
during a TLS handshake because they need to be explicitly trusted in order to be validated.

Roots are sometimes defined as "CA certificates which are explicitly trusted"---which can include certificates which
aren't self-signed. cert-manager doesn't use this definition.

Changing trust stores to include new roots or remove old ones is a non-trivial task which can take months or years for publicly
trusted roots. For this reason roots are usually issued with very long lifetimes, often on the order of decades.

#### Intermediate Certificates

Intermediates are CA certificates signed by another CA. Most intermediates will be signed by a root certificate, but it's
possible to construct longer chains where an intermediate can be signed by another intermediate.

Intermediate certificates are usually issued with a much shorter lifetime than the CA which signed them. On the
Internet, intermediate certificates are used on network-connected machines for day-to-day issuance so that the
highly-valuable root certificates can remain entirely offline.

While intermediate certificates can also be explicitly trusted via addition to a trust store, they're usually validated
by "walking up" the chain and validating signatures until an explicitly trusted self-signed root certificate is found.

#### Leaf Certificates

Leaf certificates are usually used to represent a particular identity, rather than being used to sign other certificates.
On the Internet leaf certificates usually identify a particular domain, such as `example.com`.

Leaf certificates are sent first in a chain of certificates and represent the end of that chain. They must be sent
along with any intermediates required to create a chain which can be validated by verifying signatures up to a trusted
root certificate.