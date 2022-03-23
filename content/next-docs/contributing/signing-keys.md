---
title: Signing Keys
description: 'cert-manager contributing: Code signing / Signing keys'
---

This page describes the bootstrapping process for a key, including how to do it and why a bootstrapping
process is required.

## What do we Serve?

To facilitate verification of signatures, we serve public key information from the cert-manager website
directly. It's important to serve the keys from a different location to where the artifacts are hosted; if the
keys were hosted at the same location as the artifacts, an attacker able to change the artifacts would be able
to also change the keys!

We serve several key types under `static/public-keys`:

- `cert-manager-pgp-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.asc`: ASCII-armored PGP public key, used for verifying signatures on helm charts via `helm verify` (after being converted to a keyring)
- `cert-manager-keyring-2021-09-20-1020CF3C033D4F35BAE1C19E1226061C665DF13E.gpg`: Old style GPG keyring, needed by the `--keyring` parameter to `helm verify`. See Keyring below.
- `cert-manager-pubkey-2021-09-20.pem`: The raw, PEM-encoded public key used for signing. Cannot be used with GPG (and therefore helm), but should be used for other verification types.

## Background / Architecture

Code signing for cert-manager artifacts is done entirely using cloud KMS keys, to ensure that nobody
can get access to the private keys in plain-text; all signing operations using the key are therefore
done through cloud APIs and are logged.

Currently, all keys are on Google KMS, since the rest of cert-manager's release infrastructure is also
in GCP. The key - and the role bindings which allow access to it - are specified in terraform in a closed
source Jetstack repo.

## Why Bootstrap?

While the private key is not retrievable for a KMS key, the public key is and _must_ be retrieved so that
end-users can verify signatures made by the key. In GCP, retrieving the public key is itself an
[API call](https://cloud.google.com/kms/docs/reference/rest/v1/projects.locations.keyRings.cryptoKeys.cryptoKeyVersions/getPublicKey)
which returns the raw key in a PEM encoded format.

That PEM-encoded public key works for some cases (e.g. verifying container signature made using `cosign`) but
it's not sufficient for Helm chart verification, since Helm chart signing (sadly) requires the use of PGP.

## Bootstrapping a PGP Identity

It's possible to use a shim to use GCP KMS as a PGP key which enables us to avoid having two separate signing keys,
but PGP public identities are slightly more complicated than plain public keys; they also contain a name,
creation time, comment and email address to identify the signer. This public "identity" must itself be signed by the
private key (to prove that the information in the identity is legitimate).

This bootstrapping can be done using the cert-manager release tool, `cmrel`:

```console
# note that the key name might not exactly match this in the future
$ cmrel bootstrap-pgp --key "projects/cert-manager-release/locations/europe-west1/keyRings/cert-manager-release/cryptoKeys/cert-manager-release-signing-key/cryptoKeyVersions/1"
```

This will trigger a cloud build job which will output both the armored PGP identity and the raw PEM public key; the values
can be copied from the job output.

### GPG Keyring

As an additional UX feature, we can also generate a GPG keyring from the PGP identity, since the keyring is what's required
by the Helm CLI to actually validate a chart:

```console
# Example of verifying a chart.
$ helm verify --keyring cert_manager_keyring_1020CF3C033D4F35BAE1C19E1226061C665DF13E.gpg /path/to/chart.tgz
Signed by: cert-manager Maintainers <cert-manager-maintainers@googlegroups.com>
Using Key With Fingerprint: 1020....
Chart Hash Verified: sha256:bb86...
```

The keyring can be generated using [this script](https://github.com/cert-manager/release/blob/a219e18b2e64ef078bf73b3641d589b43d1fccb8/hack/helm_keyring.sh).