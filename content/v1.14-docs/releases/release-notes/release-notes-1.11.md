---
title: Release 1.11
description: 'cert-manager release notes: cert-manager 1.11'
---

## v1.11.5

- Use Go 1.19.9 to fix a security issue in Go's `crypto/tls` library. ([#6317](https://github.com/cert-manager/cert-manager/pull/6317), [@maelvls](https://github.com/maelvls))

## v1.11.4

### Other

- Resolved docker/docker trivy CVE alert ([#6164](https://github.com/cert-manager/cert-manager/pull/6164), [@inteon](https://github.com/inteon))
- Upgraded base images ([#6128](https://github.com/cert-manager/cert-manager/pull/6128), [@SgtCoDFish](https://github.com/SgtCoDFish))

## v1.11.3

cert-manager `v1.11.3` mostly contains ACME library changes. API Priority and Fairness feature is now disabled in the external webhook's extension apiserver.

### Other

- API Priority and Fairness controller is now disabled in extension apiserver for DNS webhook implementation. ([#6092](https://github.com/cert-manager/cert-manager/pull/6092), [@irbekrm](https://github.com/irbekrm))
- Adds a warning for folks to not use controller feature gates helm value to configure webhook feature gates ([#6101](https://github.com/cert-manager/cert-manager/pull/6101), [@irbekrm](https://github.com/irbekrm))

## v1.11.2

### Bug or Regression

- Build with go 1.19.9 ([#6014](https://github.com/cert-manager/cert-manager/pull/6014), [@SgtCoDFish](https://github.com/SgtCoDFish))

### Other
- Bump the distroless base images ([#5930](https://github.com/cert-manager/cert-manager/pull/5930), [@maelvls](https://github.com/maelvls))
- Bumps Docker libraries to fix vulnerability scan alert for `CVE-2023-28840`, `CVE-2023-28841`, `CVE-2023-28842` ([#6037](https://github.com/cert-manager/cert-manager/pull/6037), [@irbekrm](https://github.com/irbekrm)) - cert-manager was not actually affected by these CVEs which are all to do with Docker daemon's overlay network.
- Bumps Kubernetes libraries `v0.26.0` -> `v0.26.4` ([#6038](https://github.com/cert-manager/cert-manager/pull/6038), [@irbekrm](https://github.com/irbekrm)) - this might help with running cert-manager v1.11 on Kubernetes `v1.27`


## v1.11.1

### Bug or Regression

- Bump helm and other dependencies to fix CVEs, along with upgrading go and base images ([#5815](https://github.com/cert-manager/cert-manager/pull/5815), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Bump the distroless base images ([#5930](https://github.com/cert-manager/cert-manager/pull/5930), [@maelvls](https://github.com/maelvls))
- The auto-retry mechanism added in VCert 4.23.0 and part of cert-manager 1.11.0 ([#5674](https://github.com/cert-manager/cert-manager/pull/5674)) has been found to be faulty. Until this issue is fixed upstream, we now use a patched version of VCert. This patch will slowdown the issuance of certificates by 9% in case of heavy load on TPP. We aim to release at an ulterior date a patch release of cert-manager to fix this slowdown. ([#5819](https://github.com/cert-manager/cert-manager/pull/5819), [@maelvls](https://github.com/maelvls))
- Use a fake kube-apiserver version when generating helm template in `cmctl x install`, to work around a hardcoded Kubernetes version in Helm. ([#5726](https://github.com/cert-manager/cert-manager/pull/5726), [@SgtCoDFish](https://github.com/SgtCoDFish))

### Other

- Bump keystore-go to v4.4.1 to work around an upstream rewrite of history ([#5730](https://github.com/cert-manager/cert-manager/pull/5730), [@SgtCoDFish](https://github.com/SgtCoDFish))

## v1.11.0

cert-manager `v1.11.0` includes a drastic reduction in cert-manager's runtime memory usage,
a slew of improvements to AKS integrations and various other tweaks, fixes and improvements,
all towards cert-manager's goal of being the best way to handle certificates in modern
Cloud Native applications.

### Support for Azure Workload Identity Federation with Azure DNS and ACME DNS-01

cert-manager can now authenticate using [Azure Workload Identity Federation](https://learn.microsoft.com/en-us/azure/active-directory/develop/workload-identity-federation) to manage ACME DNS-01 records in Azure DNS.
The advantage of this authentication mechanism is that you do not need to store and manage Azure credentials in Kubernetes Secret resources.
Instead cert-manager authenticates to Azure using a short lived Kubernetes ServiceAccount token.
This is now the recommended authentication method because it is more secure and easier to maintain than the other methods,
and it should be used instead of the [deprecated pod-managed identify mechanism](https://github.com/Azure/aad-pod-identity#-announcement).

> 📖 Read about [configuring the ACME issuer with Azure DNS](../../configuration/acme/dns01/azuredns.md).
>
> 📖 Read the [AKS + LoadBalancer + Let's Encrypt tutorial](../../tutorials/getting-started-aks-letsencrypt/README.md) for an end-to-end example of this authentication method.
>
> 🔗 See [pull request #5570](https://github.com/cert-manager/cert-manager/pull/5570) for the implementation

### Custom CA Bundles for ACME Servers

Some users choose to run their own ACME servers rather than relying on services such as Let's Encrypt. cert-manager supports any server which
complies with the ACME spec for the ACME issuer, but some users had issues when using a private CA certificate for their ACME server, requiring
either that they ignore certificate validation (which is insecure) or that they hack their certificate into the cert-manager trust store.

Now, users can set a caBundle flag on their ACME issuer, specifying the trust store that cert-manager should use when communicating with the
server. For more details, see [Private ACME Servers](../../configuration/acme/README.md#private-acme-servers)

### `LiteralSubject` Improvements

In cert-manager `1.9` we [added alpha support](./release-notes-1.9.md#literal-certificate-subjects) for the `LiteralSubject` field in the Certificate resource, which
allowed power-users to specify the exact subject they wanted for their certificate. This helps with forcing
an exact ordering of subject fields, for example.

cert-manager `v1.11` improves on that support by [adding](https://github.com/cert-manager/cert-manager/pull/5587) the
ability to use several other fields which are used primarily in LDAP RDNs.

### Potentially Breaking: Gateway API Upgrade

It's exciting to see the [Gateway API](https://gateway-api.sigs.k8s.io) project progressing
nicely, and cert-manager still has experimental support for Gateway API.

Unless you've _explicitly_ opted in to using the Gateway API support, you don't need to do
anything. If you've been using the support, however, you might need to take some actions
to ensure there aren't any breakages when you update.

Check out the [upgrade guide](../upgrading/upgrading-1.10-1.11.md) for more
details on what you'll need to do.

## Community

Thanks again to all open-source contributors with commits in this release, including:

- [@cmcga1125](https://github.com/cmcga1125)
- [@karlschriek](https://github.com/karlschriek)
- [@lvyanru8200](https://github.com/lvyanru8200)
- [@mmontes11](https://github.com/mmontes11)
- [@pinkfloydx33](https://github.com/pinkfloydx33)
- [@sathyanarays](https://github.com/sathyanarays)
- [@weisdd](https://github.com/weisdd)
- [@yann-soubeyrand](https://github.com/yann-soubeyrand)
- [@joycebrum](https://github.com/joycebrum)
- [@Git-Jiro](https://github.com/Git-Jiro)
- [@thib-mary](https://github.com/thib-mary)
- [@yk](https://github.com/yk)
- [@RomanenkoDenys](https://github.com/RomanenkoDenys)
- [@lucacome](https://github.com/lucacome)
- [@yanggangtony](https://github.com/yanggangtony)

## Changes since cert-manager `v1.10`

### Feature

- Helm: allow configuring the image used by ACME HTTP-01 solver ([#5554](https://github.com/cert-manager/cert-manager/pull/5554), [@yann-soubeyrand](https://github.com/yann-soubeyrand))
- Add the `--max-concurrent-challenges` controller flag to the helm chart ([#5638](https://github.com/cert-manager/cert-manager/pull/5638), [@lvyanru8200](https://github.com/lvyanru8200))
- Adds the ability to specify a custom CA bundle in Issuers when connecting to an ACME server ([#5644](https://github.com/cert-manager/cert-manager/pull/5644), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Enable testing against Kubernetes 1.26 and test with Kubernetes 1.26 by default ([#5646](https://github.com/cert-manager/cert-manager/pull/5646), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Experimental make targets for pushing images to an OCI registry using `ko` and redeploying cert-manager to the cluster referenced by your current KUBECONFIG context. ([#5655](https://github.com/cert-manager/cert-manager/pull/5655), [@wallrj](https://github.com/wallrj))
- Add ability to run acmesolver pods as root if desired. The default is still to run as non-root. ([#5546](https://github.com/cert-manager/cert-manager/pull/5546), [@cmcga1125](https://github.com/cmcga1125))
- Add support for DC and UID in `LiteralSubject` field, all mandatory OIDs are now supported for LDAP certificates (rfc4514). ([#5587](https://github.com/cert-manager/cert-manager/pull/5587), [@SpectralHiss](https://github.com/SpectralHiss))
- Add support for Workload Identity to AzureDNS resolver ([#5570](https://github.com/cert-manager/cert-manager/pull/5570), [@weisdd](https://github.com/weisdd))
- Breaking: updates the gateway API integration to use the more stable v1beta1 API version. Any users of the cert-manager `ExperimentalGatewayAPISupport` alpha feature must ensure that `v1beta` of Gateway API is installed in cluster. ([#5583](https://github.com/cert-manager/cert-manager/pull/5583), [@lvyanru8200](https://github.com/lvyanru8200))
- Certificate secrets get refreshed if the keystore format change ([#5597](https://github.com/cert-manager/cert-manager/pull/5597), [@sathyanarays](https://github.com/sathyanarays))
- Introducing UseCertificateRequestBasicConstraints feature flag to enable Basic Constraints in the Certificate Signing Request ([#5552](https://github.com/cert-manager/cert-manager/pull/5552), [@sathyanarays](https://github.com/sathyanarays))
- Return error when Gateway has a cross-namespace secret ref ([#5613](https://github.com/cert-manager/cert-manager/pull/5613), [@mmontes11](https://github.com/mmontes11))
- Signers fire an event on CertificateRequests which have not been approved yet. Used for informational purposes so users understand why a request is not progressing. ([#5535](https://github.com/cert-manager/cert-manager/pull/5535), [@JoshVanL](https://github.com/JoshVanL))

### Bug or Regression

- Don't log errors relating to self-signed issuer checks for external issuers ([#5681](https://github.com/cert-manager/cert-manager/pull/5681), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fixed a bug in AzureDNS resolver that led to early reconciliations in misconfigured Workload Identity-enabled setups (when Federated Identity Credential is not linked with a controller's k8s service account) ([#5663](https://github.com/cert-manager/cert-manager/pull/5663), [@weisdd](https://github.com/weisdd))
- Use manually specified temporary directory template when verifying CRDs ([#5680](https://github.com/cert-manager/cert-manager/pull/5680), [@SgtCoDFish](https://github.com/SgtCoDFish))
- `vcert` was upgraded to `v4.23.0`, fixing two bugs in cert-manager. The first bug was preventing the Venafi issuer from renewing certificates when using TPP has been fixed. You should no longer see your certificates getting stuck with `WebSDK CertRequest Module Requested Certificate` or `This certificate cannot be processed while it is in an error state. Fix any errors, and then click Retry.`. The second bug that was fixed prevented the use of `algorithm: Ed25519` in Certificate resources with VaaS. ([#5674](https://github.com/cert-manager/cert-manager/pull/5674), [@maelvls](https://github.com/maelvls))
- Upgrade `golang/x/net` to fix CVE-2022-41717 ([#5632](https://github.com/cert-manager/cert-manager/pull/5632), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Bug fix: When using feature gates with the helm chart, enable feature gate flags on webhook as well as controller ([#5584](https://github.com/cert-manager/cert-manager/pull/5584), [@lvyanru8200](https://github.com/lvyanru8200))
- Fix `golang.org/x/text` vulnerability ([#5562](https://github.com/cert-manager/cert-manager/pull/5562), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fixes a bug that caused the Vault issuer to omit the Vault namespace in requests to the Vault API. ([#5591](https://github.com/cert-manager/cert-manager/pull/5591), [@wallrj](https://github.com/wallrj))
- The Venafi Issuer now supports TLS 1.2 renegotiation, so that it can connect to TPP servers where the vedauth API endpoints are configured to *accept* client certificates. (Note: This does not mean that the Venafi Issuer supports client certificate authentication). ([#5568](https://github.com/cert-manager/cert-manager/pull/5568), [@wallrj](https://github.com/wallrj))
- Upgrade to go 1.19.4 to fix CVE-2022-41717 ([#5619](https://github.com/cert-manager/cert-manager/pull/5619), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Upgrade to latest go minor release ([#5559](https://github.com/cert-manager/cert-manager/pull/5559), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Ensure `extraArgs` in Helm takes precedence over the new acmesolver image options ([#5702](https://github.com/cert-manager/cert-manager/pull/5702), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fix cainjector's --namespace flag. Users who want to prevent cainjector from reading all Secrets and Certificates in all namespaces (i.e to prevent excessive memory consumption) can now scope it to a single namespace using the --namespace flag. A cainjector that is only used as part of cert-manager installation only needs access to the cert-manager installation namespace. ([#5694](https://github.com/cert-manager/cert-manager/pull/5694), [@irbekrm](https://github.com/irbekrm))
- Fixes a bug where cert-manager controller was caching all Secrets twice ([#5691](https://github.com/cert-manager/cert-manager/pull/5691), [@irbekrm](https://github.com/irbekrm))

### Other

- `certificate.spec.secretName` Secrets will now be labelled with the `controller.cert-manager.io/fao` label ([#5703](https://github.com/cert-manager/cert-manager/pull/5703), [@irbekrm](https://github.com/irbekrm))
- Upgrade to go 1.19.5 ([#5714](https://github.com/cert-manager/cert-manager/pull/5714), [@yanggangtony](https://github.com/yanggangtony))
