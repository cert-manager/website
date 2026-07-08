---
title: Troubleshooting Certificate Re-issuance Loops
description: |
    Diagnose and fix infinite certificate re-issuance loops caused by Secret
    conflicts with external operators.
---

cert-manager continuously monitors the Kubernetes Secret referenced by each
Certificate's `spec.secretName`. When it detects that the Secret contents no
longer match the current CertificateRequest — for example, the private key in
the Secret differs from the one used to generate the CSR — it sets the
`Issuing` condition to `True` and creates a new CertificateRequest.

Under normal circumstances this self-healing behavior is desirable. However,
if something outside cert-manager repeatedly modifies the Secret, cert-manager
will enter a tight re-issuance loop: each successful issuance resets the
failure backoff counters, so the next mismatch triggers an immediate
re-issuance with no delay.

## Symptoms

You may be experiencing a re-issuance loop if you observe any of the following:

- The Certificate's `Issuing` condition is repeatedly set to `True` with reason
  **`SecretMismatch`**:
  ```console
  $ kubectl describe certificate <name>
  ...
  Status:
    Conditions:
      Type:    Issuing
      Status:  True
      Reason:  SecretMismatch
      Message: Issuing certificate as Secret contains a private key that does not match the current CertificateRequest
  ```
- The Certificate's `status.revision` is climbing rapidly (tens or hundreds of
  revisions in a short period).
- A high volume of CertificateRequest resources exist for a single Certificate:
  ```console
  $ kubectl get certificaterequest -l cert-manager.io/certificate-name=<name>
  ```
- cert-manager controller logs show `"Certificate must be re-issued"` with
  reason `SecretMismatch`, often at the same timestamps as
  `"applying Secret data"`.
- Unexpectedly high certificate consumption or billing from your CA.

## Cause 1: External Secret manager conflicts

### Description

If another controller — such as
[External Secrets Operator (ESO)](https://external-secrets.io/),
[Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/),
or a custom operator — also manages the same Secret that cert-manager writes
to, the two controllers will fight over the Secret's contents.

The loop works as follows:

1. cert-manager successfully issues a certificate and writes the key material
   to the target Secret.
2. The external controller overwrites or patches the Secret (e.g. on its next
   sync interval), replacing the private key and/or certificate data.
3. cert-manager detects that the private key in the Secret no longer matches
   the CSR in the current CertificateRequest
   (`SecretPublicKeyDiffersFromCurrentCertificateRequest`).
4. Because the previous issuance **succeeded**, the backoff counters
   (`status.lastFailureTime`, `status.failedIssuanceAttempts`) were reset.
   cert-manager therefore triggers a new issuance immediately, with no delay.
5. The cycle repeats from step 1.

:::warning
Even if the external controller syncs infrequently (e.g. every 24 hours), a
single overwrite is enough to trigger a burst of re-issuances. cert-manager
reacts within seconds, and each successful issuance resets the backoff, so a
single external write can generate dozens of CertificateRequests before the
situation stabilizes — if it stabilizes at all.
:::

### Diagnosis

1. Check the Certificate events for `SecretMismatch` re-issuance triggers:
   ```console
   $ kubectl describe certificate <name>
   ```
2. Look at events on the Secret itself to identify other controllers writing to
   it:
   ```console
   $ kubectl get events --field-selector involvedObject.name=<secret-name>
   ```
3. Check whether an ExternalSecret, SecretProviderClass, or similar resource
   targets the same Secret:
   ```console
   $ kubectl get externalsecret -A -o json | jq -r '.items[] | select(.spec.target.name == "<secret-name>") | "\(.metadata.namespace)/\(.metadata.name)"'
   ```

### Fix

Stop the external controller from writing to the same Secret that cert-manager
manages. Common approaches:

- **Remove or redirect the ExternalSecret**: If the ExternalSecret was
  configured before cert-manager took over certificate management, it may no
  longer be needed. Delete the ExternalSecret resource, or change its
  `spec.target.name` to a different Secret.
- **Use separate Secrets**: Let cert-manager write to its own Secret (the
  Certificate's `spec.secretName`) and let the external controller write to a
  different Secret. If your application needs both, mount both Secrets or use a
  projected volume.

## Cause 2: Issuer returns an invalid certificate

On cert-manager versions older than 1.18.5, 1.19.3, and 1.20.0, if the issuer
(CA) returns a certificate whose public key does not match the CSR, cert-manager
stores the certificate in the Secret. The trigger controller then detects that
the private key no longer matches the stored certificate (`SecretPublicKeysDiffer`)
and triggers re-issuance. Because the CertificateRequest reached `Ready=True`,
the failure backoff counters are not set, and cert-manager re-issues
immediately — the same tight loop as the scenarios above.

Since cert-manager 1.18.5, 1.19.3, and 1.20.0, this case is detected before
the certificate is stored: the issuing controller validates that the
certificate's public key matches the CSR, and if not, fails the issuance with
exponential backoff (see
[cert-manager#8403](https://github.com/cert-manager/cert-manager/pull/8403)).

If you are running an affected version and see rapid re-issuance with
`SecretMismatch` reason, upgrade cert-manager and check the issuer's logs to
verify that it is returning the correct certificate for each request.

:::note
cert-manager's trigger policies do not verify that the issued certificate's
subject, SANs, or validity period match the Certificate spec — only that the
key material is consistent. An issuer that modifies these fields will not
cause a re-issuance loop, but the stored certificate may differ from what was
requested.
:::

## Related issues

- [cert-manager#6988](https://github.com/cert-manager/cert-manager/issues/6988):
  External system (OpenShift) owning Secret causes endless CertificateRequests
- [cert-manager#8380](https://github.com/cert-manager/cert-manager/issues/8380):
  Infinite re-issuance loop when issuer returns invalid certificate
- [cert-manager#8403](https://github.com/cert-manager/cert-manager/pull/8403):
  Fail issuance when certificate public key does not match CSR (cert-manager
  1.18.5+, 1.19.3+, 1.20.0+)
