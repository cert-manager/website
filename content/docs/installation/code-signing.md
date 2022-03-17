---
title: cert-manager Signature Verification
description: 'cert-manager installation: Code signing'
---

To help prevent [supply chain attacks](https://en.wikipedia.org/wiki/Supply_chain_attack), some cert-manager release
artifacts are cryptographically signed so you can be sure that the version of cert-manager you're about to install
is actually built by and provided by the cert-manager maintainers.

This signing is vitally important if for any reason you need to use a mirrored version of cert-manager; it allows you
to confirm that the mirror hasn't tampered with the code you're about to install.

Signing keys required for verification are all available on this website, but the actual key that you need might depend
on the artifact you're trying to validate in the future. At the time of writing, all signing is done using the same underlying
key.

## Helm Charts

/*
TODO: uncomment this when cosign signing is in place. The warning doesn't have much value
if we're not advertising the existence of other public keys.
<div className="alert">
Helm requires the use of PGP for verification; the key format is different.

Trying to use PEM encoded public keys will fail.
</div>
*/

For all cert-manager versions from `v1.6.0` and later, Helm charts are signed and verifiable through the Helm CLI.

The easiest way to verify is to grab the GPG keyring directly, which can then be passed into `helm verify` like so:

```console
curl -sSL https://cert-manager.io/public-keys/cert-manager-keyring-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.gpg > cert-manager-keyring-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.gpg
helm verify --keyring cert-manager-keyring-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.gpg /path/to/cert-manager-vx.y.z.tgz
```

- GPG keyring: [`cert-manager-keyring-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.gpg`](../../../public-keys/cert-manager-keyring-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.gpg)

If you know what you're doing and you want the signing key in a format that's easy to import into GPG,
it's available in an ASCII armored version:

- ASCII-armored signing key: [`cert-manager-pgp-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.asc`](../../../public-keys/cert-manager-pgp-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.asc)

## Container Images / Cosign

Soon, all container images which make up cert-manager will be verifiable using [`cosign`](https://docs.sigstore.dev/cosign/overview).

Unfortunately, this isn't possible today because the images are hosted on `quay.io` which doesn't have the proper support for cosign signatures yet. When signatures are
added, this section will contain details of how to verify them.

/*
TODO: also uncomment the warning in the helm section!

The simplest way to verify signatures is to download the public key and then pass it to the cosign CLI:

```console
curl -sSL https://cert-manager.io/public-keys/cert-manager-pubkey-2021-09-20.pem > cert-manager-pubkey-2021-09-20.pem
cosign verify -key cert-manager-pubkey-2021-09-20.pem quay.io/jetstack/cert-manager-controller
# repeat for other images as desired
```

For a more fully-featured signature verification process in Kubernetes, check out [`connaisseur`](https://sse-secure-systems.github.io/connaisseur/).

- PEM-encoded public key: [`cert-manager-pubkey-2021-09-20.pem`](../../../public-keys/cert-manager-pubkey-2021-09-20.pem)
*/