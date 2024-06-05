---
title: Release 1.15
description: 'cert-manager release notes: cert-manager 1.14'
---

> 📢 The cert-manager CLI has moved to a new GitHub repository
>
> From this release, `cmctl` is no longer be released with `cert-manager` itself,
> and there will no further `quay.io/jetstack/cert-manager-ctl` OCI images.
>
> Read [The cert-manager Command Line Tool (cmctl) page](../../reference/cmctl.md) to learn more.

cert-manager 1.15 promotes several features to beta, including GatewayAPI support (ExperimentalGatewayAPISupport), the ability to provide a subject in the Certificate that will be used literally in the CertificateSigningRequest (LiteralCertificateSubject) and the outputting of additional certificate formats (AdditionalCertificateOutputFormats).

## Community

Thanks again to all open-source contributors with commits in this release, including: [@Pionerd](https://github.com/Pionerd), [@SgtCoDFish](https://github.com/SgtCoDFish), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot), [@andrey](https://github.com/andrey)-dubnik, [@bwaldrep](https://github.com/bwaldrep), [@eplightning](https://github.com/eplightning), [@erikgb](https://github.com/erikgb), [@findnature](https://github.com/findnature), [@gplessis](https://github.com/gplessis), [@import](https://github.com/import)-shiburin, [@inteon](https://github.com/inteon), [@jkroepke](https://github.com/jkroepke), [@lunarwhite](https://github.com/lunarwhite), [@mangeshhambarde](https://github.com/mangeshhambarde), [@pwhitehead](https://github.com/pwhitehead)-splunk & [@rodrigorfk](https://github.com/rodrigorfk), [@wallrj](https://github.com/wallrj).

Thanks also to the following cert-manager maintainers for their contributions during this release: [@SgtCoDFish](https://github.com/SgtCoDFish), [@SpectralHiss](https://github.com/SpectralHiss), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot), [@hawksight](https://github.com/hawksight), [@inteon](https://github.com/inteon), [@maelvls](https://github.com/maelvls) & [@wallrj](https://github.com/wallrj).

Equally thanks to everyone who provided feedback, helped users and raised issues on GitHub and Slack and joined our meetings!

Thanks also to the CNCF, which provides resources and support, and to the AWS open source team for being good community members and for their maintenance of the PrivateCA Issuer.

In addition, massive thanks to Venafi for contributing developer time and resources towards the continued maintenance of cert-manager projects.

## Changes by Kind

### Feature

- GatewayAPI support has graduated to Beta. Add the `--enable-gateway-api` flag to enable the integration. ([#6961](https://github.com/cert-manager/cert-manager/pull/6961), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot))
- Add support to specify a custom key alias in a JKS Keystore ([#6807](https://github.com/cert-manager/cert-manager/pull/6807), [@bwaldrep](https://github.com/bwaldrep))
- Add the ability to communicate with Vault via mTLS when strict client certificates is enabled at Vault server side ([#6614](https://github.com/cert-manager/cert-manager/pull/6614), [@rodrigorfk](https://github.com/rodrigorfk))
- Added option to provide additional audiences in the service account auth section for vault ([#6718](https://github.com/cert-manager/cert-manager/pull/6718), [@andrey](https://github.com/andrey)-dubnik)
- Venafi Issuer now sends a cert-manager HTTP User-Agent header in all Venafi Rest API requests.
  For example: `cert-manager-certificaterequests-issuer-venafi/v1.15.0+(linux/amd64)+cert-manager/ef068a59008f6ed919b98a7177921ddc9e297200`. ([#6865](https://github.com/cert-manager/cert-manager/pull/6865), [@wallrj](https://github.com/wallrj))
- Add hint to validation error message to help users of external issuers more easily fix the issue if they specify a Kind but forget the Group ([#6913](https://github.com/cert-manager/cert-manager/pull/6913), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Add support for numeric OID types in LiteralSubject. Eg. "1.2.3.4=String Value" ([#6775](https://github.com/cert-manager/cert-manager/pull/6775), [@inteon](https://github.com/inteon))
- Promote the `LiteralCertificateSubject` feature to Beta. ([#7030](https://github.com/cert-manager/cert-manager/pull/7030), [@inteon](https://github.com/inteon))
- Promoted the `AdditionalCertificateOutputFormats` feature gate to Beta (enabled by default). ([#6970](https://github.com/cert-manager/cert-manager/pull/6970), [@erikgb](https://github.com/erikgb))
- The Helm chart now allows you to supply `extraObjects`; a list of yaml manifests which will helm will install and uninstall with the cert-manager manifests. ([#6424](https://github.com/cert-manager/cert-manager/pull/6424), [@gplessis](https://github.com/gplessis))
- Update the Route53 provider to support fetching credentials using AssumeRoleWithWebIdentity ([#6878](https://github.com/cert-manager/cert-manager/pull/6878), [@pwhitehead](https://github.com/pwhitehead)-splunk)
- Helm can now add optional hostAliases to cert-manager Pod to allow the DNS self-check to pass in custom scenarios. ([#6456](https://github.com/cert-manager/cert-manager/pull/6456), [@Pionerd](https://github.com/Pionerd))
- Added a new Ingress annotation for copying specific Ingress annotations to Certificate's secretTemplate ([#6839](https://github.com/cert-manager/cert-manager/pull/6839), [@mangeshhambarde](https://github.com/mangeshhambarde))
- Added option to define additional token audiences for the Vault Kubernetes auth ([#6744](https://github.com/cert-manager/cert-manager/pull/6744), [@andrey](https://github.com/andrey)-dubnik)
- Allow `cert-manager.io/allow-direct-injection` in annotations ([#6801](https://github.com/cert-manager/cert-manager/pull/6801), [@jkroepke](https://github.com/jkroepke))

### Design

- Remove repetitive words ([#6949](https://github.com/cert-manager/cert-manager/pull/6949), [@findnature](https://github.com/findnature))

### Bug or Regression

- BUGFIX: Fixes issue with JSON-logging, where only a subset of the log messages were output as JSON. ([#6779](https://github.com/cert-manager/cert-manager/pull/6779), [@inteon](https://github.com/inteon))
- BUGFIX: JKS and PKCS12 stores now contain the full set of CAs specified by an issuer ([#6806](https://github.com/cert-manager/cert-manager/pull/6806), [@bwaldrep](https://github.com/bwaldrep))
- BUGFIX: cainjector leaderelection flag/config option defaults are missing ([#6816](https://github.com/cert-manager/cert-manager/pull/6816), [@inteon](https://github.com/inteon))
- BUGFIX: cert-manager issuers incorrectly copied the critical flag from the CSR instead of re-calculating that field themselves. ([#6724](https://github.com/cert-manager/cert-manager/pull/6724), [@inteon](https://github.com/inteon))
- Breaking Change: Fixed unintended certificate chain is used if `preferredChain` is configured. ([#6755](https://github.com/cert-manager/cert-manager/pull/6755), [@import](https://github.com/import)-shiburin)
- Bugfix: LiteralSubjects with a #= value can result in memory issues due to faulty BER parser (github.com/go-asn1-ber/asn1-ber). ([#6770](https://github.com/cert-manager/cert-manager/pull/6770), [@inteon](https://github.com/inteon))
- DigitalOcean: Ensure that only TXT records are considered for deletion when cleaning up after an ACME challenge ([#6875](https://github.com/cert-manager/cert-manager/pull/6875), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fix backwards incompatible removal of default prometheus Service resource. ([#6699](https://github.com/cert-manager/cert-manager/pull/6699), [@inteon](https://github.com/inteon))
- Fix broken cainjector image value in Helm chart ([#6692](https://github.com/cert-manager/cert-manager/pull/6692), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Helm: Fix a bug in the logic that differentiates between 0 and an empty value. ([#6713](https://github.com/cert-manager/cert-manager/pull/6713), [@inteon](https://github.com/inteon))
- Make sure the Azure SDK error messages are stable. ([#6676](https://github.com/cert-manager/cert-manager/pull/6676), [@inteon](https://github.com/inteon))
- When using the literalSubject on a Certificate, the webhook validation for the common name now also points to the literalSubject. ([#6767](https://github.com/cert-manager/cert-manager/pull/6767), [@lunarwhite](https://github.com/lunarwhite))
- Bump golang.org/x/net to fix CVE-2023-45288 ([#6929](https://github.com/cert-manager/cert-manager/pull/6929), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Fix ACME issuer being stuck waiting for DNS propagation when using Azure DNS with multiple instances issuing for the same FQDN ([#6351](https://github.com/cert-manager/cert-manager/pull/6351), [@eplightning](https://github.com/eplightning))
- Fix cainjector ConfigMap not mounted in the cainjector deployment. ([#7055](https://github.com/cert-manager/cert-manager/pull/7055), [@inteon](https://github.com/inteon))
- Added `disableAutoApproval` and `approveSignerNames` Helm chart options. ([#7054](https://github.com/cert-manager/cert-manager/pull/7054), [@inteon](https://github.com/inteon))

### Other (Cleanup or Flake)

- Bump base images ([#6840](https://github.com/cert-manager/cert-manager/pull/6840), [@inteon](https://github.com/inteon))
- Bump github.com/go-jose/go-jose to v3.0.3 to fix CVE-2024-28180 ([#6854](https://github.com/cert-manager/cert-manager/pull/6854), [@wallrj](https://github.com/wallrj))
- Removed deprecated util functions that have been replaced by the `slices` and `k8s.io/apimachinery/pkg/util` packages.
  Removed deprecated CSR functions which have been replaced with other functions in the `pkg/util/pki` package. ([#6730](https://github.com/cert-manager/cert-manager/pull/6730), [@inteon](https://github.com/inteon))
- Upgrade go to 1.21.8: fixes CVE-2024-24783 ([#6823](https://github.com/cert-manager/cert-manager/pull/6823), [@inteon](https://github.com/inteon))
- Upgrade go to latest version 1.22.1 ([#6831](https://github.com/cert-manager/cert-manager/pull/6831), [@inteon](https://github.com/inteon))
- Upgrade google.golang.org/protobuf: fixing GO-2024-2611 ([#6827](https://github.com/cert-manager/cert-manager/pull/6827), [@inteon](https://github.com/inteon))
- `cmctl` and `kubectl cert-manger` have been moved to the https://github.com/cert-manager/cmctl repo and will be versioned separately starting with cmctl v2.0.0 ([#6663](https://github.com/cert-manager/cert-manager/pull/6663), [@inteon](https://github.com/inteon))
- ⚠️ Possibly breaking: Helm will now keep the CRDs when you uninstall cert-manager by default to prevent accidental data loss
  Add new `crds.keep` and `crds.enabled` Helm options which will replace the `installCRDs` option. ([#6760](https://github.com/cert-manager/cert-manager/pull/6760), [@inteon](https://github.com/inteon))
- Graduate the 'DisallowInsecureCSRUsageDefinition' feature gate to GA. (part 2) ([#6963](https://github.com/cert-manager/cert-manager/pull/6963), [@inteon](https://github.com/inteon))
- Remove deprecated `pkg/util/pki/ParseSubjectStringToRawDERBytes` function. ([#6994](https://github.com/cert-manager/cert-manager/pull/6994), [@inteon](https://github.com/inteon))
- Upgrade Kind to v0.23.0 and update supported node image digests ([#7020](https://github.com/cert-manager/cert-manager/pull/7020), [@github](https://github.com/github)-actions[bot])
- If the `--controllers` flag only specifies disabled controllers, the default controllers are now enabled implicitly. ([#7054](https://github.com/cert-manager/cert-manager/pull/7054), [@inteon](https://github.com/inteon))
- Upgrade to Go 1.22.3, fixing `GO-2024-2824`. ([#6996](https://github.com/cert-manager/cert-manager/pull/6996), [@github](https://github.com/github)-actions[bot])

## Dependencies

### Added
- cloud.google.com/go/auth/oauth2adapt: v0.2.2
- cloud.google.com/go/auth: v0.4.2
- github.com/aws/aws-sdk-go-v2/config: [v1.27.15](https://github.com/aws/aws-sdk-go-v2/config/tree/v1.27.15)
- github.com/aws/aws-sdk-go-v2/credentials: [v1.17.15](https://github.com/aws/aws-sdk-go-v2/credentials/tree/v1.17.15)
- github.com/aws/aws-sdk-go-v2/feature/ec2/imds: [v1.16.3](https://github.com/aws/aws-sdk-go-v2/feature/ec2/imds/tree/v1.16.3)
- github.com/aws/aws-sdk-go-v2/internal/configsources: [v1.3.7](https://github.com/aws/aws-sdk-go-v2/internal/configsources/tree/v1.3.7)
- github.com/aws/aws-sdk-go-v2/internal/endpoints/v2: [v2.6.7](https://github.com/aws/aws-sdk-go-v2/internal/endpoints/v2/tree/v2.6.7)
- github.com/aws/aws-sdk-go-v2/internal/ini: [v1.8.0](https://github.com/aws/aws-sdk-go-v2/internal/ini/tree/v1.8.0)
- github.com/aws/aws-sdk-go-v2/service/internal/accept-encoding: [v1.11.2](https://github.com/aws/aws-sdk-go-v2/service/internal/accept-encoding/tree/v1.11.2)
- github.com/aws/aws-sdk-go-v2/service/internal/presigned-url: [v1.11.9](https://github.com/aws/aws-sdk-go-v2/service/internal/presigned-url/tree/v1.11.9)
- github.com/aws/aws-sdk-go-v2/service/route53: [v1.40.7](https://github.com/aws/aws-sdk-go-v2/service/route53/tree/v1.40.7)
- github.com/aws/aws-sdk-go-v2/service/sso: [v1.20.8](https://github.com/aws/aws-sdk-go-v2/service/sso/tree/v1.20.8)
- github.com/aws/aws-sdk-go-v2/service/ssooidc: [v1.24.2](https://github.com/aws/aws-sdk-go-v2/service/ssooidc/tree/v1.24.2)
- github.com/aws/aws-sdk-go-v2/service/sts: [v1.28.9](https://github.com/aws/aws-sdk-go-v2/service/sts/tree/v1.28.9)
- github.com/aws/aws-sdk-go-v2: [v1.27.0](https://github.com/aws/aws-sdk-go-v2/tree/v1.27.0)
- github.com/aws/smithy-go: [v1.20.2](https://github.com/aws/smithy-go/tree/v1.20.2)
- github.com/fxamacker/cbor/v2: [v2.6.0](https://github.com/fxamacker/cbor/v2/tree/v2.6.0)
- github.com/go-http-utils/headers: [fed159e](https://github.com/go-http-utils/headers/tree/fed159e)
- github.com/go-jose/go-jose/v4: [v4.0.2](https://github.com/go-jose/go-jose/v4/tree/v4.0.2)
- github.com/go-task/slim-sprig/v3: [v3.0.0](https://github.com/go-task/slim-sprig/v3/tree/v3.0.0)
- github.com/gorilla/securecookie: [v1.1.1](https://github.com/gorilla/securecookie/tree/v1.1.1)
- github.com/gorilla/sessions: [v1.2.1](https://github.com/gorilla/sessions/tree/v1.2.1)
- github.com/hashicorp/cap/ldap: [fcfe271](https://github.com/hashicorp/cap/ldap/tree/fcfe271)
- github.com/jcmturner/aescts/v2: [v2.0.0](https://github.com/jcmturner/aescts/v2/tree/v2.0.0)
- github.com/jcmturner/dnsutils/v2: [v2.0.0](https://github.com/jcmturner/dnsutils/v2/tree/v2.0.0)
- github.com/jcmturner/gofork: [v1.7.6](https://github.com/jcmturner/gofork/tree/v1.7.6)
- github.com/jcmturner/goidentity/v6: [v6.0.1](https://github.com/jcmturner/goidentity/v6/tree/v6.0.1)
- github.com/jcmturner/gokrb5/v8: [v8.4.4](https://github.com/jcmturner/gokrb5/v8/tree/v8.4.4)
- github.com/jcmturner/rpc/v2: [v2.0.3](https://github.com/jcmturner/rpc/v2/tree/v2.0.3)
- github.com/joshlf/go-acl: [eae00ae](https://github.com/joshlf/go-acl/tree/eae00ae)
- github.com/modocache/gover: [b58185e](https://github.com/modocache/gover/tree/b58185e)
- github.com/natefinch/atomic: [v1.0.1](https://github.com/natefinch/atomic/tree/v1.0.1)
- github.com/petermattis/goid: [b0b1615](https://github.com/petermattis/goid/tree/b0b1615)
- github.com/sasha-s/go-deadlock: [v0.2.0](https://github.com/sasha-s/go-deadlock/tree/v0.2.0)
- github.com/x448/float16: [v0.8.4](https://github.com/x448/float16/tree/v0.8.4)
- golang.org/x/telemetry: f48c80b
- google.golang.org/grpc/cmd/protoc-gen-go-grpc: v1.3.0
- k8s.io/gengo/v2: 51d4e06

### Changed
- cloud.google.com/go/accessapproval: v1.7.4 → v1.7.6
- cloud.google.com/go/accesscontextmanager: v1.8.4 → v1.8.6
- cloud.google.com/go/aiplatform: v1.58.0 → v1.66.0
- cloud.google.com/go/analytics: v0.21.6 → v0.23.1
- cloud.google.com/go/apigateway: v1.6.4 → v1.6.6
- cloud.google.com/go/apigeeconnect: v1.6.4 → v1.6.6
- cloud.google.com/go/apigeeregistry: v0.8.2 → v0.8.4
- cloud.google.com/go/appengine: v1.8.4 → v1.8.6
- cloud.google.com/go/area120: v0.8.4 → v0.8.6
- cloud.google.com/go/artifactregistry: v1.14.6 → v1.14.8
- cloud.google.com/go/asset: v1.16.0 → v1.18.1
- cloud.google.com/go/assuredworkloads: v1.11.4 → v1.11.6
- cloud.google.com/go/automl: v1.13.4 → v1.13.6
- cloud.google.com/go/baremetalsolution: v1.2.3 → v1.2.5
- cloud.google.com/go/batch: v1.7.0 → v1.8.3
- cloud.google.com/go/beyondcorp: v1.0.3 → v1.0.5
- cloud.google.com/go/bigquery: v1.57.1 → v1.60.0
- cloud.google.com/go/billing: v1.18.0 → v1.18.4
- cloud.google.com/go/binaryauthorization: v1.8.0 → v1.8.2
- cloud.google.com/go/certificatemanager: v1.7.4 → v1.8.0
- cloud.google.com/go/channel: v1.17.3 → v1.17.6
- cloud.google.com/go/cloudbuild: v1.15.0 → v1.16.0
- cloud.google.com/go/clouddms: v1.7.3 → v1.7.5
- cloud.google.com/go/cloudtasks: v1.12.4 → v1.12.7
- cloud.google.com/go/compute/metadata: v0.2.3 → v0.3.0
- cloud.google.com/go/compute: v1.23.3 → v1.25.1
- cloud.google.com/go/contactcenterinsights: v1.12.1 → v1.13.1
- cloud.google.com/go/container: v1.29.0 → v1.35.0
- cloud.google.com/go/containeranalysis: v0.11.3 → v0.11.5
- cloud.google.com/go/datacatalog: v1.19.0 → v1.20.0
- cloud.google.com/go/dataflow: v0.9.4 → v0.9.6
- cloud.google.com/go/dataform: v0.9.1 → v0.9.3
- cloud.google.com/go/datafusion: v1.7.4 → v1.7.6
- cloud.google.com/go/datalabeling: v0.8.4 → v0.8.6
- cloud.google.com/go/dataplex: v1.13.0 → v1.15.0
- cloud.google.com/go/dataproc/v2: v2.3.0 → v2.4.1
- cloud.google.com/go/dataqna: v0.8.4 → v0.8.6
- cloud.google.com/go/datastream: v1.10.3 → v1.10.5
- cloud.google.com/go/deploy: v1.16.0 → v1.17.2
- cloud.google.com/go/dialogflow: v1.47.0 → v1.52.0
- cloud.google.com/go/dlp: v1.11.1 → v1.12.1
- cloud.google.com/go/documentai: v1.23.7 → v1.26.1
- cloud.google.com/go/domains: v0.9.4 → v0.9.6
- cloud.google.com/go/edgecontainer: v1.1.4 → v1.2.0
- cloud.google.com/go/essentialcontacts: v1.6.5 → v1.6.7
- cloud.google.com/go/eventarc: v1.13.3 → v1.13.5
- cloud.google.com/go/filestore: v1.8.0 → v1.8.2
- cloud.google.com/go/firestore: v1.14.0 → v1.15.0
- cloud.google.com/go/functions: v1.15.4 → v1.16.1
- cloud.google.com/go/gkebackup: v1.3.4 → v1.4.0
- cloud.google.com/go/gkeconnect: v0.8.4 → v0.8.6
- cloud.google.com/go/gkehub: v0.14.4 → v0.14.6
- cloud.google.com/go/gkemulticloud: v1.0.3 → v1.1.2
- cloud.google.com/go/gsuiteaddons: v1.6.4 → v1.6.6
- cloud.google.com/go/iam: v1.1.5 → v1.1.7
- cloud.google.com/go/iap: v1.9.3 → v1.9.5
- cloud.google.com/go/ids: v1.4.4 → v1.4.6
- cloud.google.com/go/iot: v1.7.4 → v1.7.6
- cloud.google.com/go/kms: v1.15.5 → v1.15.8
- cloud.google.com/go/language: v1.12.2 → v1.12.4
- cloud.google.com/go/lifesciences: v0.9.4 → v0.9.6
- cloud.google.com/go/longrunning: v0.5.4 → v0.5.6
- cloud.google.com/go/managedidentities: v1.6.4 → v1.6.6
- cloud.google.com/go/maps: v1.6.2 → v1.7.1
- cloud.google.com/go/mediatranslation: v0.8.4 → v0.8.6
- cloud.google.com/go/memcache: v1.10.4 → v1.10.6
- cloud.google.com/go/metastore: v1.13.3 → v1.13.5
- cloud.google.com/go/monitoring: v1.17.0 → v1.18.1
- cloud.google.com/go/networkconnectivity: v1.14.3 → v1.14.5
- cloud.google.com/go/networkmanagement: v1.9.3 → v1.13.0
- cloud.google.com/go/networksecurity: v0.9.4 → v0.9.6
- cloud.google.com/go/notebooks: v1.11.2 → v1.11.4
- cloud.google.com/go/optimization: v1.6.2 → v1.6.4
- cloud.google.com/go/orchestration: v1.8.4 → v1.9.1
- cloud.google.com/go/orgpolicy: v1.11.4 → v1.12.2
- cloud.google.com/go/osconfig: v1.12.4 → v1.12.6
- cloud.google.com/go/oslogin: v1.12.2 → v1.13.2
- cloud.google.com/go/phishingprotection: v0.8.4 → v0.8.6
- cloud.google.com/go/policytroubleshooter: v1.10.2 → v1.10.4
- cloud.google.com/go/privatecatalog: v0.9.4 → v0.9.6
- cloud.google.com/go/pubsub: v1.33.0 → v1.37.0
- cloud.google.com/go/recaptchaenterprise/v2: v2.9.0 → v2.12.0
- cloud.google.com/go/recommendationengine: v0.8.4 → v0.8.6
- cloud.google.com/go/recommender: v1.12.0 → v1.12.2
- cloud.google.com/go/redis: v1.14.1 → v1.14.3
- cloud.google.com/go/resourcemanager: v1.9.4 → v1.9.6
- cloud.google.com/go/resourcesettings: v1.6.4 → v1.6.6
- cloud.google.com/go/retail: v1.14.4 → v1.16.1
- cloud.google.com/go/run: v1.3.3 → v1.3.6
- cloud.google.com/go/scheduler: v1.10.5 → v1.10.7
- cloud.google.com/go/secretmanager: v1.11.4 → v1.12.0
- cloud.google.com/go/security: v1.15.4 → v1.15.6
- cloud.google.com/go/securitycenter: v1.24.3 → v1.28.0
- cloud.google.com/go/servicedirectory: v1.11.3 → v1.11.5
- cloud.google.com/go/shell: v1.7.4 → v1.7.6
- cloud.google.com/go/spanner: v1.54.0 → v1.60.0
- cloud.google.com/go/speech: v1.21.0 → v1.22.1
- cloud.google.com/go/storagetransfer: v1.10.3 → v1.10.5
- cloud.google.com/go/talent: v1.6.5 → v1.6.7
- cloud.google.com/go/texttospeech: v1.7.4 → v1.7.6
- cloud.google.com/go/tpu: v1.6.4 → v1.6.6
- cloud.google.com/go/trace: v1.10.4 → v1.10.6
- cloud.google.com/go/translate: v1.9.3 → v1.10.2
- cloud.google.com/go/video: v1.20.3 → v1.20.5
- cloud.google.com/go/videointelligence: v1.11.4 → v1.11.6
- cloud.google.com/go/vision/v2: v2.7.5 → v2.8.1
- cloud.google.com/go/vmmigration: v1.7.4 → v1.7.6
- cloud.google.com/go/vmwareengine: v1.0.3 → v1.1.2
- cloud.google.com/go/vpcaccess: v1.7.4 → v1.7.6
- cloud.google.com/go/webrisk: v1.9.4 → v1.9.6
- cloud.google.com/go/websecurityscanner: v1.6.4 → v1.6.6
- cloud.google.com/go/workflows: v1.12.3 → v1.12.5
- cloud.google.com/go: v0.111.0 → v0.113.0
- github.com/Azure/azure-sdk-for-go/sdk/azcore: [v1.9.1 → v1.11.1](https://github.com/Azure/azure-sdk-for-go/sdk/azcore/compare/v1.9.1...v1.11.1)
- github.com/Azure/azure-sdk-for-go/sdk/azidentity: [v1.4.0 → v1.5.2](https://github.com/Azure/azure-sdk-for-go/sdk/azidentity/compare/v1.4.0...v1.5.2)
- github.com/Azure/azure-sdk-for-go/sdk/internal: [v1.5.1 → v1.8.0](https://github.com/Azure/azure-sdk-for-go/sdk/internal/compare/v1.5.1...v1.8.0)
- github.com/AzureAD/microsoft-authentication-library-for-go: [v1.1.1 → v1.2.2](https://github.com/AzureAD/microsoft-authentication-library-for-go/compare/v1.1.1...v1.2.2)
- github.com/Venafi/vcert/v5: [v5.3.0 → v5.6.4](https://github.com/Venafi/vcert/v5/compare/v5.3.0...v5.6.4)
- github.com/alecthomas/kingpin/v2: [v2.3.2 → v2.4.0](https://github.com/alecthomas/kingpin/v2/compare/v2.3.2...v2.4.0)
- github.com/alexbrainman/sspi: [909beea → 1a75b47](https://github.com/alexbrainman/sspi/compare/909beea...1a75b47)
- github.com/cenkalti/backoff/v4: [v4.2.1 → v4.3.0](https://github.com/cenkalti/backoff/v4/compare/v4.2.1...v4.3.0)
- github.com/cespare/xxhash/v2: [v2.2.0 → v2.3.0](https://github.com/cespare/xxhash/v2/compare/v2.2.0...v2.3.0)
- github.com/cncf/udpa/go: [c52dc94 → 269d4d4](https://github.com/cncf/udpa/go/compare/c52dc94...269d4d4)
- github.com/cncf/xds/go: [e9ce688 → 8a4994d](https://github.com/cncf/xds/go/compare/e9ce688...8a4994d)
- github.com/containerd/containerd: [v1.7.0 → v1.7.12](https://github.com/containerd/containerd/compare/v1.7.0...v1.7.12)
- github.com/digitalocean/godo: [v1.107.0 → v1.116.0](https://github.com/digitalocean/godo/compare/v1.107.0...v1.116.0)
- github.com/docker/docker: [v24.0.5+incompatible → v24.0.7+incompatible](https://github.com/docker/docker/compare/v24.0.5...v24.0.7)
- github.com/emicklei/go-restful/v3: [v3.11.0 → v3.12.0](https://github.com/emicklei/go-restful/v3/compare/v3.11.0...v3.12.0)
- github.com/envoyproxy/go-control-plane: [v0.11.1 → v0.12.0](https://github.com/envoyproxy/go-control-plane/compare/v0.11.1...v0.12.0)
- github.com/envoyproxy/protoc-gen-validate: [v1.0.2 → v1.0.4](https://github.com/envoyproxy/protoc-gen-validate/compare/v1.0.2...v1.0.4)
- github.com/evanphx/json-patch/v5: [v5.7.0 → v5.9.0](https://github.com/evanphx/json-patch/v5/compare/v5.7.0...v5.9.0)
- github.com/evanphx/json-patch: [v5.7.0+incompatible → v5.9.0+incompatible](https://github.com/evanphx/json-patch/compare/v5.7.0...v5.9.0)
- github.com/fatih/color: [v1.15.0 → v1.16.0](https://github.com/fatih/color/compare/v1.15.0...v1.16.0)
- github.com/frankban/quicktest: [v1.14.3 → v1.14.6](https://github.com/frankban/quicktest/compare/v1.14.3...v1.14.6)
- github.com/go-asn1-ber/asn1-ber: [v1.5.5 → v1.5.6](https://github.com/go-asn1-ber/asn1-ber/compare/v1.5.5...v1.5.6)
- github.com/go-ldap/ldap/v3: [v3.4.6 → v3.4.8](https://github.com/go-ldap/ldap/v3/compare/v3.4.6...v3.4.8)
- github.com/go-openapi/jsonpointer: [v0.20.2 → v0.21.0](https://github.com/go-openapi/jsonpointer/compare/v0.20.2...v0.21.0)
- github.com/go-openapi/jsonreference: [v0.20.4 → v0.21.0](https://github.com/go-openapi/jsonreference/compare/v0.20.4...v0.21.0)
- github.com/go-openapi/swag: [v0.22.7 → v0.23.0](https://github.com/go-openapi/swag/compare/v0.22.7...v0.23.0)
- github.com/golang-jwt/jwt/v5: [v5.0.0 → v5.2.1](https://github.com/golang-jwt/jwt/v5/compare/v5.0.0...v5.2.1)
- github.com/golang/glog: [v1.1.2 → v1.2.0](https://github.com/golang/glog/compare/v1.1.2...v1.2.0)
- github.com/golang/protobuf: [v1.5.3 → v1.5.4](https://github.com/golang/protobuf/compare/v1.5.3...v1.5.4)
- github.com/google/cel-go: [v0.17.7 → v0.17.8](https://github.com/google/cel-go/compare/v0.17.7...v0.17.8)
- github.com/google/pprof: [4bb14d4 → a892ee0](https://github.com/google/pprof/compare/4bb14d4...a892ee0)
- github.com/google/tink/go: [v1.7.0 → v1.6.1](https://github.com/google/tink/go/compare/v1.7.0...v1.6.1)
- github.com/google/uuid: [v1.5.0 → v1.6.0](https://github.com/google/uuid/compare/v1.5.0...v1.6.0)
- github.com/googleapis/gax-go/v2: [v2.12.0 → v2.12.4](https://github.com/googleapis/gax-go/v2/compare/v2.12.0...v2.12.4)
- github.com/gorilla/websocket: [v1.5.0 → v1.5.1](https://github.com/gorilla/websocket/compare/v1.5.0...v1.5.1)
- github.com/grpc-ecosystem/grpc-gateway/v2: [v2.18.1 → v2.20.0](https://github.com/grpc-ecosystem/grpc-gateway/v2/compare/v2.18.1...v2.20.0)
- github.com/hashicorp/go-hclog: [v1.5.0 → v1.6.3](https://github.com/hashicorp/go-hclog/compare/v1.5.0...v1.6.3)
- github.com/hashicorp/go-plugin: [v1.5.2 → v1.6.0](https://github.com/hashicorp/go-plugin/compare/v1.5.2...v1.6.0)
- github.com/hashicorp/go-retryablehttp: [v0.7.5 → v0.7.6](https://github.com/hashicorp/go-retryablehttp/compare/v0.7.5...v0.7.6)
- github.com/hashicorp/go-secure-stdlib/plugincontainer: [v0.2.2 → v0.3.0](https://github.com/hashicorp/go-secure-stdlib/plugincontainer/compare/v0.2.2...v0.3.0)
- github.com/hashicorp/go-secure-stdlib/tlsutil: [v0.1.2 → v0.1.3](https://github.com/hashicorp/go-secure-stdlib/tlsutil/compare/v0.1.2...v0.1.3)
- github.com/hashicorp/vault/api: [v1.10.0 → v1.13.0](https://github.com/hashicorp/vault/api/compare/v1.10.0...v1.13.0)
- github.com/hashicorp/vault/sdk: [v0.10.2 → v0.12.0](https://github.com/hashicorp/vault/sdk/compare/v0.10.2...v0.12.0)
- github.com/jackc/pgconn: [v1.14.0 → v1.14.3](https://github.com/jackc/pgconn/compare/v1.14.0...v1.14.3)
- github.com/jackc/pgproto3/v2: [v2.3.2 → v2.3.3](https://github.com/jackc/pgproto3/v2/compare/v2.3.2...v2.3.3)
- github.com/jackc/pgx/v4: [v4.18.1 → v4.18.2](https://github.com/jackc/pgx/v4/compare/v4.18.1...v4.18.2)
- github.com/mattn/go-isatty: [v0.0.17 → v0.0.20](https://github.com/mattn/go-isatty/compare/v0.0.17...v0.0.20)
- github.com/miekg/dns: [v1.1.57 → v1.1.59](https://github.com/miekg/dns/compare/v1.1.57...v1.1.59)
- github.com/onsi/ginkgo/v2: [v2.13.0 → v2.17.2](https://github.com/onsi/ginkgo/v2/compare/v2.13.0...v2.17.2)
- github.com/onsi/gomega: [v1.29.0 → v1.33.1](https://github.com/onsi/gomega/compare/v1.29.0...v1.33.1)
- github.com/opencontainers/runc: [v1.1.6 → v1.1.12](https://github.com/opencontainers/runc/compare/v1.1.6...v1.1.12)
- github.com/pkg/browser: [681adbf → 5ac0b6a](https://github.com/pkg/browser/compare/681adbf...5ac0b6a)
- github.com/prometheus/client_model: [v0.5.0 → v0.6.1](https://github.com/prometheus/client_model/compare/v0.5.0...v0.6.1)
- github.com/prometheus/common: [v0.45.0 → v0.46.0](https://github.com/prometheus/common/compare/v0.45.0...v0.46.0)
- github.com/prometheus/procfs: [v0.12.0 → v0.15.0](https://github.com/prometheus/procfs/compare/v0.12.0...v0.15.0)
- github.com/sosodev/duration: [v1.2.0 → v1.3.1](https://github.com/sosodev/duration/compare/v1.2.0...v1.3.1)
- github.com/stretchr/objx: [v0.5.1 → v0.5.2](https://github.com/stretchr/objx/compare/v0.5.1...v0.5.2)
- github.com/stretchr/testify: [v1.8.4 → v1.9.0](https://github.com/stretchr/testify/compare/v1.8.4...v1.9.0)
- github.com/youmark/pkcs8: [1326539 → 3c2c787](https://github.com/youmark/pkcs8/compare/1326539...3c2c787)
- go.etcd.io/etcd/api/v3: v3.5.11 → v3.5.13
- go.etcd.io/etcd/client/pkg/v3: v3.5.11 → v3.5.13
- go.etcd.io/etcd/client/v3: v3.5.11 → v3.5.13
- go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc: v0.46.1 → v0.51.0
- go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp: v0.46.1 → v0.51.0
- go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc: v1.21.0 → v1.26.0
- go.opentelemetry.io/otel/exporters/otlp/otlptrace: v1.21.0 → v1.26.0
- go.opentelemetry.io/otel/metric: v1.21.0 → v1.26.0
- go.opentelemetry.io/otel/sdk: v1.21.0 → v1.26.0
- go.opentelemetry.io/otel/trace: v1.21.0 → v1.26.0
- go.opentelemetry.io/otel: v1.21.0 → v1.26.0
- go.opentelemetry.io/proto/otlp: v1.0.0 → v1.2.0
- go.uber.org/atomic: v1.10.0 → v1.9.0
- go.uber.org/zap: v1.26.0 → v1.27.0
- golang.org/x/crypto: v0.17.0 → v0.23.0
- golang.org/x/exp: 02704c9 → 9bf2ced
- golang.org/x/mod: v0.14.0 → v0.17.0
- golang.org/x/net: v0.19.0 → v0.25.0
- golang.org/x/oauth2: v0.15.0 → v0.20.0
- golang.org/x/sync: v0.5.0 → v0.7.0
- golang.org/x/sys: v0.15.0 → v0.20.0
- golang.org/x/term: v0.15.0 → v0.20.0
- golang.org/x/text: v0.14.0 → v0.15.0
- golang.org/x/tools: v0.16.1 → v0.21.0
- golang.org/x/xerrors: 04be3eb → 5ec99f8
- google.golang.org/api: v0.154.0 → v0.181.0
- google.golang.org/genproto/googleapis/api: 50ed04b → fc5f0ca
- google.golang.org/genproto/googleapis/bytestream: 3a041ad → 0867130
- google.golang.org/genproto/googleapis/rpc: 50ed04b → fc5f0ca
- google.golang.org/genproto: 50ed04b → c3f9821
- google.golang.org/grpc: v1.60.1 → v1.64.0
- google.golang.org/protobuf: v1.32.0 → v1.34.1
- k8s.io/api: v0.29.0 → v0.30.1
- k8s.io/apiextensions-apiserver: v0.29.0 → v0.30.1
- k8s.io/apimachinery: v0.29.0 → v0.30.1
- k8s.io/apiserver: v0.29.0 → v0.30.1
- k8s.io/client-go: v0.29.0 → v0.30.1
- k8s.io/code-generator: v0.29.0 → v0.30.1
- k8s.io/component-base: v0.29.0 → v0.30.1
- k8s.io/klog/v2: v2.110.1 → v2.120.1
- k8s.io/kms: v0.29.0 → v0.30.1
- k8s.io/kube-aggregator: v0.29.0 → v0.30.1
- k8s.io/kube-openapi: eec4567 → f0e62f9
- k8s.io/utils: e7106e6 → fe8a2dd
- sigs.k8s.io/apiserver-network-proxy/konnectivity-client: v0.29.0 → v0.30.3
- sigs.k8s.io/controller-runtime: v0.16.3 → v0.18.2
- sigs.k8s.io/controller-tools: v0.13.0 → v0.15.0
- sigs.k8s.io/gateway-api: v1.0.0 → v1.1.0

### Removed
- github.com/aws/aws-sdk-go: [v1.49.13](https://github.com/aws/aws-sdk-go/tree/v1.49.13)
- github.com/chzyer/logex: [v1.1.10](https://github.com/chzyer/logex/tree/v1.1.10)
- github.com/chzyer/readline: [2972be2](https://github.com/chzyer/readline/tree/2972be2)
- github.com/chzyer/test: [a1ea475](https://github.com/chzyer/test/tree/a1ea475)
- github.com/go-jose/go-jose/v3: [v3.0.1](https://github.com/go-jose/go-jose/v3/tree/v3.0.1)
- github.com/ianlancetaylor/demangle: [28f6c0f](https://github.com/ianlancetaylor/demangle/tree/28f6c0f)
- github.com/kr/pty: [v1.1.1](https://github.com/kr/pty/tree/v1.1.1)
- github.com/lithammer/dedent: [v1.1.0](https://github.com/lithammer/dedent/tree/v1.1.0)
- github.com/nxadm/tail: [v1.4.8](https://github.com/nxadm/tail/tree/v1.4.8)
- github.com/onsi/ginkgo: [v1.16.5](https://github.com/onsi/ginkgo/tree/v1.16.5)
- go.opentelemetry.io/otel/exporters/otlp/internal/retry: v1.10.0
- gopkg.in/errgo.v2: v2.1.0
- gopkg.in/tomb.v1: dd63297
