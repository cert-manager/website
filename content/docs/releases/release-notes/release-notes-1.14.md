---
title: Release 1.14
description: 'cert-manager release notes: cert-manager 1.14'
---

## `v1.14.0-alpha.0`

This is a pre-release of cert-manager 1.14 which will be released on January 31 2024.

### Known Issues

- [The startupapicheck image isn't yet published to `quay.io`, so the standard Helm install fails](https://github.com/cert-manager/cert-manager/issues/6597). You can work around this problem by using the Helm value: `--set startupapicheck.enabled=false`, to disable the startup API check.

### Breaking Changes

The startupapicheck job uses a new OCI image called "startupapicheck", instead of the ctl image.
If you run in an environment in which images cannot be pulled, be sure to include the new image.

The KeyUsage and BasicConstraints extensions will now be encoded as critical in the CertificateRequest's CSR blob.

### Major Themes

#### New X.509 Features

The cert-manager Certificate resource now allows you to configure "Other Name" SANs,
which are useful when issuing certificates for authenticating with LDAP systems such as Microsoft Active Directory.

#### New CA certificate Features

You can now specify the X.509 v3 Authority Information Accessors extension,
with URLs for certificates issued by the CA issuer.

Users can now use name constraints in CA certificates.
To know more details on name constraints check out RFC section https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.10

#### Security

An ongoing security audit of the cert-manager code revealed some weaknesses which we have addressed in this release,
such as using more secure default settings in the HTTP servers that serve metrics, healthz and pprof endpoints.

#### Other

The liveness probe of the cert-manager controller Pod is now enabled by default.
All the cert-manager containers are now configured with read only root file system by default.

There is a new option `.spec.keystores.pkcs12.algorithms` to specify encryption and MAC algorithms for PKCS.

### Community

Thanks again to all open-source contributors with commits in this release, including:
- [@ABWassim](https://github.com/ABWassim)
- [@JoeNorth](https://github.com/JoeNorth)
- [@allenmunC1](https://github.com/allenmunC1)
- [@asapekia](https://github.com/asapekia)
- [@jeremycampbell](https://github.com/jeremycampbell)
- [@jsoref](https://github.com/jsoref)
- [@lauraseidler](https://github.com/lauraseidler)
- [@pevidex](https://github.com/pevidex)
- [@snorwin](https://github.com/snorwin)
- [@tanujd11](https://github.com/tanujd11)
- [@vinny](https://github.com/vinny)

Thanks also to the following cert-manager maintainers for their contributions during this release:
- [@SgtCoDFish](https://github.com/SgtCoDFish)
- [@SpectralHiss](https://github.com/SpectralHiss)
- [@ThatsMrTalbot](https://github.com/ThatsMrTalbot)
- [@hawksight](https://github.com/hawksight)
- [@inteon](https://github.com/inteon)
- [@maelvls](https://github.com/maelvls)
- [@wallrj](https://github.com/wallrj)

Equally thanks to everyone who provided feedback, helped users and raised issues on GitHub and Slack and joined our meetings!

Thanks also to the [CNCF](https://www.cncf.io/), which provides resources and support, and to the AWS open source team for being good community members and for their maintenance of the [PrivateCA Issuer](https://github.com/cert-manager/aws-privateca-issuer).

In addition, massive thanks to [Venafi](https://www.venafi.com/) for contributing developer time and resources towards the continued maintenance of cert-manager projects.

### Changes

#### Feature

- ACME challenge solver Pod for HTTP01 will get a default annotation of `"cluster-autoscaler.kubernetes.io/safe-to-evict": "true"`. You can provide an annotation of `"cluster-autoscaler.kubernetes.io/safe-to-evict": "false"` in your `podTemplate` if you don't like this. ([#6349](https://github.com/cert-manager/cert-manager/pull/6349), [@jsoref](https://github.com/jsoref))
- Added a clock skew detector liveness probe that will force a restart in case we detect a skew between the internal monotonic clock and the system clock of more than 5 minutes.
  Also, the controller's liveness probe is now enabled by default. ([#6328](https://github.com/cert-manager/cert-manager/pull/6328), [@inteon](https://github.com/inteon))
- Added a new flag (--dynamic-serving-leaf-duration) that can adjust the lifetime of the dynamic leaf certificates ([#6552](https://github.com/cert-manager/cert-manager/pull/6552), [@allenmunC1](https://github.com/allenmunC1))
- Added support for `otherName` SANS in Certificates ([#6404](https://github.com/cert-manager/cert-manager/pull/6404), [@SpectralHiss](https://github.com/SpectralHiss))
- Added the option to specify the  X.509 v3 Authority Information Accessors extension CA Issuers URLs for certificates issued by the CA issuer. ([#6486](https://github.com/cert-manager/cert-manager/pull/6486), [@jeremycampbell](https://github.com/jeremycampbell-okta))
- Adds cert-manager's new core infrastructure initiative badge! See more details on https://www.bestpractices.dev/projects/8079 ([#6497](https://github.com/cert-manager/cert-manager/pull/6497), [@SgtCoDFish](https://github.com/SgtCoDFish))
- All Pods are now configured with `readOnlyRootFilesystem` by default. ([#6453](https://github.com/cert-manager/cert-manager/pull/6453), [@wallrj](https://github.com/wallrj))
- MAYBE BREAKING: The startupapicheck job is now handled by an entirely new container called "startupapicheck". This replaces the previous ctl container. If you run in an environment in which images cannot be pulled, be sure to include the new container. ([#6549](https://github.com/cert-manager/cert-manager/pull/6549), [@SgtCoDFish](https://github.com/SgtCoDFish))
- New option `.spec.keystores.pkcs12.algorithms` to specify encryption and MAC algorithms for PKCS[#12](https://github.com/cert-manager/cert-manager/pull/12) keystores. Fixes issues [#5957](https://github.com/cert-manager/cert-manager/pull/5957) and [#6523](https://github.com/cert-manager/cert-manager/pull/6523). ([#6548](https://github.com/cert-manager/cert-manager/pull/6548), [@snorwin](https://github.com/snorwin))
- The ACME HTTP01 solver Pod is now configured with `readOnlyRootFilesystem: true` ([#6462](https://github.com/cert-manager/cert-manager/pull/6462), [@wallrj](https://github.com/wallrj))
- Updates the AWS SDK for Go to 1.48.7 to support Amazon EKS Pod Identity ([#6519](https://github.com/cert-manager/cert-manager/pull/6519), [@JoeNorth](https://github.com/JoeNorth))
- Users can now use name constraints in CA certificates. To know more details on name constraints check out RFC section https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.10 ([#6500](https://github.com/cert-manager/cert-manager/pull/6500), [@tanujd11](https://github.com/tanujd11))
- ⚠️ potentially breaking ⚠️: The KeyUsage and BasicConstraints extensions will now be encoded as critical in the CertificateRequest's CSR blob. ([#6053](https://github.com/cert-manager/cert-manager/pull/6053), [@inteon](https://github.com/inteon))

#### Bug or Regression

- BUGFIX[helm]: Fix issue where webhook feature gates were only set if controller feature gates are set. ([#6380](https://github.com/cert-manager/cert-manager/pull/6380), [@asapekia](https://github.com/asapekia))
- Controller ConfigMap if now created only if `.Values.config` is set. ([#6357](https://github.com/cert-manager/cert-manager/pull/6357), [@ABWassim](https://github.com/ABWassim))
- Fix runaway bug caused by multiple Certificate resources that point to the same Secret resource. ([#6406](https://github.com/cert-manager/cert-manager/pull/6406), [@inteon](https://github.com/inteon))
- Fix(helm): templating of required value in controller and webhook ConfigMap resources ([#6435](https://github.com/cert-manager/cert-manager/pull/6435), [@ABWassim](https://github.com/ABWassim))
- Fixed a webhook validation error message when the key algorithm was invalid. ([#6571](https://github.com/cert-manager/cert-manager/pull/6571), [@pevidex](https://github.com/pevidex))
- Fixed error messaging when setting up vault issuer ([#6433](https://github.com/cert-manager/cert-manager/pull/6433), [@vinny](https://github.com/vinny-sabatini))
- `GHSA-vgf6-pvf4-34rq`: The webhook server now returns HTTP error 413 (Content Too Large) for requests with body size `>= 3MiB`. This is to mitigate DoS attacks that attempt to crash the webhook process by sending large requests that exceed the available memory.
  The webhook server now returns HTTP error 400 (Bad Request) if the request contains an empty body.
  The webhook server now returns HTTP error 500 (Internal Server Error) rather than crashing, if the code panics while handling a request. ([#6498](https://github.com/cert-manager/cert-manager/pull/6498), [@inteon](https://github.com/inteon))
- Increase the default webhook timeout to its maximum value of 30 seconds, so that the underlying timeout error message has more chance of being returned to the end user. ([#6488](https://github.com/cert-manager/cert-manager/pull/6488), [@wallrj](https://github.com/wallrj))
- Listeners that do not support TLS on Gateway resources will now not raise `BadConfig` warnings anymore ([#6347](https://github.com/cert-manager/cert-manager/pull/6347), [@lauraseidler](https://github.com/lauraseidler))
- Mitigate potential Slowloris attacks by setting `ReadHeaderTimeout` in all `http.Server` instances ([#6534](https://github.com/cert-manager/cert-manager/pull/6534), [@wallrj](https://github.com/wallrj))
- The Venafi issuer now properly resets the certificate and should no longer get stuck with `WebSDK CertRequest Module Requested Certificate` or `This certificate cannot be processed while it is in an error state. Fix any errors, and then click Retry.`. ([#6398](https://github.com/cert-manager/cert-manager/pull/6398), [@maelvls](https://github.com/maelvls))
- Update experimental install and uninstall commands to have flag parity with the rest of the CLI ([#6562](https://github.com/cert-manager/cert-manager/pull/6562), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot))
- Webhook ConfigMap if now created only if `.Values.webhook.config` is set. ([#6360](https://github.com/cert-manager/cert-manager/pull/6360), [@ABWassim](https://github.com/ABWassim))

#### Other (Cleanup or Flake)

- Cert-manager is now built with Go 1.21.5 ([#6545](https://github.com/cert-manager/cert-manager/pull/6545), [@wallrj](https://github.com/wallrj))
- Bump Go to `1.21.3` to address `CVE-2023-39325`. Also bumps base images. ([#6410](https://github.com/cert-manager/cert-manager/pull/6410), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Bump `golang.org/x/net v0.15.0 => v0.17.0` as part of addressing `CVE-2023-44487` / `CVE-2023-39325` ([#6427](https://github.com/cert-manager/cert-manager/pull/6427), [@SgtCoDFish](https://github.com/SgtCoDFish))
- Check code for unintended use of `crypto/md5`, a weak cryptographic primitive; using `golangci-lint` / `gosec` (G501). ([#6581](https://github.com/cert-manager/cert-manager/pull/6581), [@wallrj](https://github.com/wallrj))
- Check code for unintended use of `crypto/sha1`, a weak cryptographic primitive; using `golangci-lint` / `gosec` (G505). ([#6579](https://github.com/cert-manager/cert-manager/pull/6579), [@wallrj](https://github.com/wallrj))
- Check code for unintended use of weak random number generator (`math/rand` instead of `crypto/rand`); using `golangci-lint` / `gosec` (G404). ([#6582](https://github.com/cert-manager/cert-manager/pull/6582), [@wallrj](https://github.com/wallrj))
- Cleanup: Restrict MutatingWebhookConfiguration to only CertificateRequest resources ([#6311](https://github.com/cert-manager/cert-manager/pull/6311), [@hawksight](https://github.com/hawksight))
- Deprecated `pkg/util.RandStringRunes` and `pkg/controller/test.RandStringBytes`. Use `k8s.io/apimachinery/pkg/util/rand.String` instead. ([#6585](https://github.com/cert-manager/cert-manager/pull/6585), [@wallrj](https://github.com/wallrj))
- Enabled verbose logging in startupapicheck by default, so that if it fails, users can know exactly what caused the failure. ([#6495](https://github.com/cert-manager/cert-manager/pull/6495), [@wallrj](https://github.com/wallrj))
- Fix gosec G601: Implicit memory aliasing of items from a range statement ([#6551](https://github.com/cert-manager/cert-manager/pull/6551), [@wallrj](https://github.com/wallrj))
- Fix handling of serial numbers in literal certificate subjects. Previously a serial number could be specified in `subject.serialNumber` while using a literal certificate subject. This was a mistake and has been fixed. ([#6533](https://github.com/cert-manager/cert-manager/pull/6533), [@inteon](https://github.com/inteon))
- The end-to-end tests can now test the cert-manager Vault Issuer on an OpenShift cluster. ([#6391](https://github.com/cert-manager/cert-manager/pull/6391), [@wallrj](https://github.com/wallrj))
- Update cert-manager's distroless base images from Debian 11 to Debian 12. This should have no practical effects on users. ([#6583](https://github.com/cert-manager/cert-manager/pull/6583), [@inteon](https://github.com/inteon))
- Updated all code using GatewayAPI to use the now GA v1 APIs ([#6559](https://github.com/cert-manager/cert-manager/pull/6559), [@ThatsMrTalbot](https://github.com/ThatsMrTalbot))
- Upgrade Go from 1.20.7 to 1.20.8. ([#6369](https://github.com/cert-manager/cert-manager/pull/6369), [@inteon](https://github.com/inteon))
- Upgrade `github.com/emicklei/go-restful/v3` to `v3.11.0` because `v3.10.2` is labeled as "DO NOT USE". ([#6366](https://github.com/cert-manager/cert-manager/pull/6366), [@inteon](https://github.com/inteon))
- Use the new generic `sets.Set` type in place of the deprecated `sets.String`. ([#6586](https://github.com/cert-manager/cert-manager/pull/6586), [@wallrj](https://github.com/wallrj))

### Dependencies

#### Added
- `cloud.google.com/go/cloudsqlconn`: `v1.4.3`
- `github.com/Masterminds/goutils`: [`v1.1.1`](https://github.com/Masterminds/goutils/tree/v1.1.1)
- `github.com/Masterminds/semver/v3`: [`v3.1.1`](https://github.com/Masterminds/semver/v3/tree/v3.1.1)
- `github.com/Masterminds/sprig/v3`: [`v3.2.1`](https://github.com/Masterminds/sprig/v3/tree/v3.2.1)
- `github.com/Venafi/vcert/v5`: [`v5.3.0`](https://github.com/Venafi/vcert/v5/tree/v5.3.0)
- `github.com/hashicorp/go-secure-stdlib/plugincontainer`: [`v0.2.2`](https://github.com/hashicorp/go-secure-stdlib/plugincontainer/tree/v0.2.2)
- `github.com/huandu/xstrings`: [`v1.3.2`](https://github.com/huandu/xstrings/tree/v1.3.2)
- `github.com/jackc/chunkreader/v2`: [`v2.0.1`](https://github.com/jackc/chunkreader/v2/tree/v2.0.1)
- `github.com/jackc/pgconn`: [`v1.14.0`](https://github.com/jackc/pgconn/tree/v1.14.0)
- `github.com/jackc/pgio`: [`v1.0.0`](https://github.com/jackc/pgio/tree/v1.0.0)
- `github.com/jackc/pgpassfile`: [`v1.0.0`](https://github.com/jackc/pgpassfile/tree/v1.0.0)
- `github.com/jackc/pgproto3/v2`: [`v2.3.2`](https://github.com/jackc/pgproto3/v2/tree/v2.3.2)
- `github.com/jackc/pgservicefile`: [`091c0ba`](https://github.com/jackc/pgservicefile/tree/091c0ba)
- `github.com/jackc/pgtype`: [`v1.14.0`](https://github.com/jackc/pgtype/tree/v1.14.0)
- `github.com/jackc/pgx/v4`: [`v4.18.1`](https://github.com/jackc/pgx/v4/tree/v4.18.1)
- `github.com/matttproud/golang_protobuf_extensions/v2`: [`v2.0.0`](https://github.com/matttproud/golang_protobuf_extensions/v2/tree/v2.0.0)
- `github.com/shopspring/decimal`: [`v1.2.0`](https://github.com/shopspring/decimal/tree/v1.2.0)
- `github.com/sosodev/duration`: [`v1.2.0`](https://github.com/sosodev/duration/tree/v1.2.0)
- `github.com/xrash/smetrics`: [`039620a`](https://github.com/xrash/smetrics/tree/039620a)

#### Changed
- `cloud.google.com/go/accessapproval`: `v1.7.1 → v1.7.4`
- `cloud.google.com/go/accesscontextmanager`: `v1.8.1 → v1.8.4`
- `cloud.google.com/go/aiplatform`: `v1.48.0 → v1.58.0`
- `cloud.google.com/go/analytics`: `v0.21.3 → v0.21.6`
- `cloud.google.com/go/apigateway`: `v1.6.1 → v1.6.4`
- `cloud.google.com/go/apigeeconnect`: `v1.6.1 → v1.6.4`
- `cloud.google.com/go/apigeeregistry`: `v0.7.1 → v0.8.2`
- `cloud.google.com/go/appengine`: `v1.8.1 → v1.8.4`
- `cloud.google.com/go/area120`: `v0.8.1 → v0.8.4`
- `cloud.google.com/go/artifactregistry`: `v1.14.1 → v1.14.6`
- `cloud.google.com/go/asset`: `v1.14.1 → v1.16.0`
- `cloud.google.com/go/assuredworkloads`: `v1.11.1 → v1.11.4`
- `cloud.google.com/go/automl`: `v1.13.1 → v1.13.4`
- `cloud.google.com/go/baremetalsolution`: `v1.1.1 → v1.2.3`
- `cloud.google.com/go/batch`: `v1.3.1 → v1.7.0`
- `cloud.google.com/go/beyondcorp`: `v1.0.0 → v1.0.3`
- `cloud.google.com/go/bigquery`: `v1.53.0 → v1.57.1`
- `cloud.google.com/go/billing`: `v1.16.0 → v1.18.0`
- `cloud.google.com/go/binaryauthorization`: `v1.6.1 → v1.8.0`
- `cloud.google.com/go/certificatemanager`: `v1.7.1 → v1.7.4`
- `cloud.google.com/go/channel`: `v1.16.0 → v1.17.3`
- `cloud.google.com/go/cloudbuild`: `v1.13.0 → v1.15.0`
- `cloud.google.com/go/clouddms`: `v1.6.1 → v1.7.3`
- `cloud.google.com/go/cloudtasks`: `v1.12.1 → v1.12.4`
- `cloud.google.com/go/compute`: `v1.23.0 → v1.23.3`
- `cloud.google.com/go/contactcenterinsights`: `v1.10.0 → v1.12.1`
- `cloud.google.com/go/container`: `v1.24.0 → v1.29.0`
- `cloud.google.com/go/containeranalysis`: `v0.10.1 → v0.11.3`
- `cloud.google.com/go/datacatalog`: `v1.16.0 → v1.19.0`
- `cloud.google.com/go/dataflow`: `v0.9.1 → v0.9.4`
- `cloud.google.com/go/dataform`: `v0.8.1 → v0.9.1`
- `cloud.google.com/go/datafusion`: `v1.7.1 → v1.7.4`
- `cloud.google.com/go/datalabeling`: `v0.8.1 → v0.8.4`
- `cloud.google.com/go/dataplex`: `v1.9.0 → v1.13.0`
- `cloud.google.com/go/dataproc/v2`: `v2.0.1 → v2.3.0`
- `cloud.google.com/go/dataqna`: `v0.8.1 → v0.8.4`
- `cloud.google.com/go/datastore`: `v1.13.0 → v1.15.0`
- `cloud.google.com/go/datastream`: `v1.10.0 → v1.10.3`
- `cloud.google.com/go/deploy`: `v1.13.0 → v1.16.0`
- `cloud.google.com/go/dialogflow`: `v1.40.0 → v1.47.0`
- `cloud.google.com/go/dlp`: `v1.10.1 → v1.11.1`
- `cloud.google.com/go/documentai`: `v1.22.0 → v1.23.7`
- `cloud.google.com/go/domains`: `v0.9.1 → v0.9.4`
- `cloud.google.com/go/edgecontainer`: `v1.1.1 → v1.1.4`
- `cloud.google.com/go/essentialcontacts`: `v1.6.2 → v1.6.5`
- `cloud.google.com/go/eventarc`: `v1.13.0 → v1.13.3`
- `cloud.google.com/go/filestore`: `v1.7.1 → v1.8.0`
- `cloud.google.com/go/firestore`: `v1.11.0 → v1.14.0`
- `cloud.google.com/go/functions`: `v1.15.1 → v1.15.4`
- `cloud.google.com/go/gkebackup`: `v1.3.0 → v1.3.4`
- `cloud.google.com/go/gkeconnect`: `v0.8.1 → v0.8.4`
- `cloud.google.com/go/gkehub`: `v0.14.1 → v0.14.4`
- `cloud.google.com/go/gkemulticloud`: `v1.0.0 → v1.0.3`
- `cloud.google.com/go/gsuiteaddons`: `v1.6.1 → v1.6.4`
- `cloud.google.com/go/iam`: `v1.1.1 → v1.1.5`
- `cloud.google.com/go/iap`: `v1.8.1 → v1.9.3`
- `cloud.google.com/go/ids`: `v1.4.1 → v1.4.4`
- `cloud.google.com/go/iot`: `v1.7.1 → v1.7.4`
- `cloud.google.com/go/kms`: `v1.15.0 → v1.15.5`
- `cloud.google.com/go/language`: `v1.10.1 → v1.12.2`
- `cloud.google.com/go/lifesciences`: `v0.9.1 → v0.9.4`
- `cloud.google.com/go/logging`: `v1.7.0 → v1.9.0`
- `cloud.google.com/go/longrunning`: `v0.5.1 → v0.5.4`
- `cloud.google.com/go/managedidentities`: `v1.6.1 → v1.6.4`
- `cloud.google.com/go/maps`: `v1.4.0 → v1.6.2`
- `cloud.google.com/go/mediatranslation`: `v0.8.1 → v0.8.4`
- `cloud.google.com/go/memcache`: `v1.10.1 → v1.10.4`
- `cloud.google.com/go/metastore`: `v1.12.0 → v1.13.3`
- `cloud.google.com/go/monitoring`: `v1.15.1 → v1.17.0`
- `cloud.google.com/go/networkconnectivity`: `v1.12.1 → v1.14.3`
- `cloud.google.com/go/networkmanagement`: `v1.8.0 → v1.9.3`
- `cloud.google.com/go/networksecurity`: `v0.9.1 → v0.9.4`
- `cloud.google.com/go/notebooks`: `v1.9.1 → v1.11.2`
- `cloud.google.com/go/optimization`: `v1.4.1 → v1.6.2`
- `cloud.google.com/go/orchestration`: `v1.8.1 → v1.8.4`
- `cloud.google.com/go/orgpolicy`: `v1.11.1 → v1.11.4`
- `cloud.google.com/go/osconfig`: `v1.12.1 → v1.12.4`
- `cloud.google.com/go/oslogin`: `v1.10.1 → v1.12.2`
- `cloud.google.com/go/phishingprotection`: `v0.8.1 → v0.8.4`
- `cloud.google.com/go/policytroubleshooter`: `v1.8.0 → v1.10.2`
- `cloud.google.com/go/privatecatalog`: `v0.9.1 → v0.9.4`
- `cloud.google.com/go/recaptchaenterprise/v2`: `v2.7.2 → v2.9.0`
- `cloud.google.com/go/recommendationengine`: `v0.8.1 → v0.8.4`
- `cloud.google.com/go/recommender`: `v1.10.1 → v1.12.0`
- `cloud.google.com/go/redis`: `v1.13.1 → v1.14.1`
- `cloud.google.com/go/resourcemanager`: `v1.9.1 → v1.9.4`
- `cloud.google.com/go/resourcesettings`: `v1.6.1 → v1.6.4`
- `cloud.google.com/go/retail`: `v1.14.1 → v1.14.4`
- `cloud.google.com/go/run`: `v1.2.0 → v1.3.3`
- `cloud.google.com/go/scheduler`: `v1.10.1 → v1.10.5`
- `cloud.google.com/go/secretmanager`: `v1.11.1 → v1.11.4`
- `cloud.google.com/go/security`: `v1.15.1 → v1.15.4`
- `cloud.google.com/go/securitycenter`: `v1.23.0 → v1.24.3`
- `cloud.google.com/go/servicedirectory`: `v1.11.0 → v1.11.3`
- `cloud.google.com/go/shell`: `v1.7.1 → v1.7.4`
- `cloud.google.com/go/spanner`: `v1.47.0 → v1.54.0`
- `cloud.google.com/go/speech`: `v1.19.0 → v1.21.0`
- `cloud.google.com/go/storagetransfer`: `v1.10.0 → v1.10.3`
- `cloud.google.com/go/talent`: `v1.6.2 → v1.6.5`
- `cloud.google.com/go/texttospeech`: `v1.7.1 → v1.7.4`
- `cloud.google.com/go/tpu`: `v1.6.1 → v1.6.4`
- `cloud.google.com/go/trace`: `v1.10.1 → v1.10.4`
- `cloud.google.com/go/translate`: `v1.8.2 → v1.9.3`
- `cloud.google.com/go/video`: `v1.19.0 → v1.20.3`
- `cloud.google.com/go/videointelligence`: `v1.11.1 → v1.11.4`
- `cloud.google.com/go/vision/v2`: `v2.7.2 → v2.7.5`
- `cloud.google.com/go/vmmigration`: `v1.7.1 → v1.7.4`
- `cloud.google.com/go/vmwareengine`: `v1.0.0 → v1.0.3`
- `cloud.google.com/go/vpcaccess`: `v1.7.1 → v1.7.4`
- `cloud.google.com/go/webrisk`: `v1.9.1 → v1.9.4`
- `cloud.google.com/go/websecurityscanner`: `v1.6.1 → v1.6.4`
- `cloud.google.com/go/workflows`: `v1.11.1 → v1.12.3`
- `cloud.google.com/go`: `v0.110.6 → v0.111.0`
- `github.com/asaskevich/govalidator`: [`f61b66f → a9d515a`](https://github.com/asaskevich/govalidator/compare/f61b66f...a9d515a)
- `github.com/aws/aws-sdk-go`: [`v1.44.331 → v1.49.13`](https://github.com/aws/aws-sdk-go/compare/v1.44.331...v1.49.13)
- `github.com/cpuguy83/go-md2man/v2`: [`v2.0.2 → v2.0.3`](https://github.com/cpuguy83/go-md2man/v2/compare/v2.0.2...v2.0.3)
- `github.com/digitalocean/godo`: [`v1.102.1 → v1.107.0`](https://github.com/digitalocean/godo/compare/v1.102.1...v1.107.0)
- `github.com/docker/distribution`: [`v2.8.1+incompatible → v2.8.2+incompatible`](https://github.com/docker/distribution/compare/v2.8.1...v2.8.2)
- `github.com/docker/docker`: [`v23.0.4+incompatible → v24.0.5+incompatible`](https://github.com/docker/docker/compare/v23.0.4...v24.0.5)
- `github.com/emicklei/go-restful/v3`: [`v3.9.0 → v3.11.0`](https://github.com/emicklei/go-restful/v3/compare/v3.9.0...v3.11.0)
- `github.com/envoyproxy/go-control-plane`: [`9239064 → v0.11.1`](https://github.com/envoyproxy/go-control-plane/compare/9239064...v0.11.1)
- `github.com/envoyproxy/protoc-gen-validate`: [`v0.10.1 → v1.0.2`](https://github.com/envoyproxy/protoc-gen-validate/compare/v0.10.1...v1.0.2)
- `github.com/evanphx/json-patch/v5`: [`v5.6.0 → v5.7.0`](https://github.com/evanphx/json-patch/v5/compare/v5.6.0...v5.7.0)
- `github.com/evanphx/json-patch`: [`v5.6.0+incompatible → v5.7.0+incompatible`](https://github.com/evanphx/json-patch/compare/v5.6.0...v5.7.0)
- `github.com/felixge/httpsnoop`: [`v1.0.3 → v1.0.4`](https://github.com/felixge/httpsnoop/compare/v1.0.3...v1.0.4)
- `github.com/frankban/quicktest`: [`v1.11.3 → v1.14.3`](https://github.com/frankban/quicktest/compare/v1.11.3...v1.14.3)
- `github.com/fsnotify/fsnotify`: [`v1.6.0 → v1.7.0`](https://github.com/fsnotify/fsnotify/compare/v1.6.0...v1.7.0)
- `github.com/go-asn1-ber/asn1-ber`: [`v1.5.4 → v1.5.5`](https://github.com/go-asn1-ber/asn1-ber/compare/v1.5.4...v1.5.5)
- `github.com/go-jose/go-jose/v3`: [`v3.0.0 → v3.0.1`](https://github.com/go-jose/go-jose/v3/compare/v3.0.0...v3.0.1)
- `github.com/go-ldap/ldap/v3`: [`v3.4.5 → v3.4.6`](https://github.com/go-ldap/ldap/v3/compare/v3.4.5...v3.4.6)
- `github.com/go-logr/logr`: [`v1.2.4 → v1.4.1`](https://github.com/go-logr/logr/compare/v1.2.4...v1.4.1)
- `github.com/go-logr/zapr`: [`v1.2.4 → v1.3.0`](https://github.com/go-logr/zapr/compare/v1.2.4...v1.3.0)
- `github.com/go-openapi/jsonpointer`: [`v0.19.6 → v0.20.2`](https://github.com/go-openapi/jsonpointer/compare/v0.19.6...v0.20.2)
- `github.com/go-openapi/jsonreference`: [`v0.20.2 → v0.20.4`](https://github.com/go-openapi/jsonreference/compare/v0.20.2...v0.20.4)
- `github.com/go-openapi/swag`: [`v0.22.3 → v0.22.7`](https://github.com/go-openapi/swag/compare/v0.22.3...v0.22.7)
- `github.com/golang/glog`: [`v1.1.0 → v1.1.2`](https://github.com/golang/glog/compare/v1.1.0...v1.1.2)
- `github.com/golang/mock`: [`v1.4.4 → v1.1.1`](https://github.com/golang/mock/compare/v1.4.4...v1.1.1)
- `github.com/google/cel-go`: [`v0.16.0 → v0.17.7`](https://github.com/google/cel-go/compare/v0.16.0...v0.17.7)
- `github.com/google/go-cmp`: [`v0.5.9 → v0.6.0`](https://github.com/google/go-cmp/compare/v0.5.9...v0.6.0)
- `github.com/google/go-pkcs11`: [`v0.2.0 → c6f7932`](https://github.com/google/go-pkcs11/compare/v0.2.0...c6f7932)
- `github.com/google/s2a-go`: [`v0.1.5 → v0.1.7`](https://github.com/google/s2a-go/compare/v0.1.5...v0.1.7)
- `github.com/google/uuid`: [`v1.3.0 → v1.5.0`](https://github.com/google/uuid/compare/v1.3.0...v1.5.0)
- `github.com/googleapis/enterprise-certificate-proxy`: [`v0.2.5 → v0.3.2`](https://github.com/googleapis/enterprise-certificate-proxy/compare/v0.2.5...v0.3.2)
- `github.com/gorilla/websocket`: [`v1.4.2 → v1.5.0`](https://github.com/gorilla/websocket/compare/v1.4.2...v1.5.0)
- `github.com/grpc-ecosystem/grpc-gateway/v2`: [`v2.7.0 → v2.18.1`](https://github.com/grpc-ecosystem/grpc-gateway/v2/compare/v2.7.0...v2.18.1)
- `github.com/hashicorp/go-hclog`: [`v1.4.0 → v1.5.0`](https://github.com/hashicorp/go-hclog/compare/v1.4.0...v1.5.0)
- `github.com/hashicorp/go-plugin`: [`v1.4.8 → v1.5.2`](https://github.com/hashicorp/go-plugin/compare/v1.4.8...v1.5.2)
- `github.com/hashicorp/go-retryablehttp`: [`v0.7.4 → v0.7.5`](https://github.com/hashicorp/go-retryablehttp/compare/v0.7.4...v0.7.5)
- `github.com/hashicorp/go-secure-stdlib/parseutil`: [`v0.1.7 → v0.1.8`](https://github.com/hashicorp/go-secure-stdlib/parseutil/compare/v0.1.7...v0.1.8)
- `github.com/hashicorp/go-sockaddr`: [`v1.0.2 → v1.0.6`](https://github.com/hashicorp/go-sockaddr/compare/v1.0.2...v1.0.6)
- `github.com/hashicorp/vault/api`: [`v1.9.2 → v1.10.0`](https://github.com/hashicorp/vault/api/compare/v1.9.2...v1.10.0)
- `github.com/hashicorp/vault/sdk`: [`v0.9.2 → v0.10.2`](https://github.com/hashicorp/vault/sdk/compare/v0.9.2...v0.10.2)
- `github.com/hashicorp/yamux`: [`0bc27b2 → v0.1.1`](https://github.com/hashicorp/yamux/compare/0bc27b2...v0.1.1)
- `github.com/imdario/mergo`: [`v0.3.12 → v0.3.16`](https://github.com/imdario/mergo/compare/v0.3.12...v0.3.16)
- `github.com/jmespath/go-jmespath`: [`v0.4.0 → b0104c8`](https://github.com/jmespath/go-jmespath/compare/v0.4.0...b0104c8)
- `github.com/miekg/dns`: [`v1.1.55 → v1.1.57`](https://github.com/miekg/dns/compare/v1.1.55...v1.1.57)
- `github.com/mitchellh/cli`: [`v1.0.0 → v1.1.5`](https://github.com/mitchellh/cli/compare/v1.0.0...v1.1.5)
- `github.com/mitchellh/go-wordwrap`: [`v1.0.0 → v1.0.1`](https://github.com/mitchellh/go-wordwrap/compare/v1.0.0...v1.0.1)
- `github.com/onsi/ginkgo/v2`: [`v2.12.0 → v2.13.0`](https://github.com/onsi/ginkgo/v2/compare/v2.12.0...v2.13.0)
- `github.com/onsi/gomega`: [`v1.27.10 → v1.29.0`](https://github.com/onsi/gomega/compare/v1.27.10...v1.29.0)
- `github.com/pavlo-v-chernykh/keystore-go/v4`: [`v4.4.1 → v4.5.0`](https://github.com/pavlo-v-chernykh/keystore-go/v4/compare/v4.4.1...v4.5.0)
- `github.com/prometheus/client_golang`: [`v1.16.0 → v1.18.0`](https://github.com/prometheus/client_golang/compare/v1.16.0...v1.18.0)
- `github.com/prometheus/client_model`: [`v0.4.0 → v0.5.0`](https://github.com/prometheus/client_model/compare/v0.4.0...v0.5.0)
- `github.com/prometheus/common`: [`v0.44.0 → v0.45.0`](https://github.com/prometheus/common/compare/v0.44.0...v0.45.0)
- `github.com/prometheus/procfs`: [`v0.10.1 → v0.12.0`](https://github.com/prometheus/procfs/compare/v0.10.1...v0.12.0)
- `github.com/rogpeppe/go-internal`: [`v1.11.0 → v1.12.0`](https://github.com/rogpeppe/go-internal/compare/v1.11.0...v1.12.0)
- `github.com/ryanuber/columnize`: [`v2.1.0+incompatible → v2.1.2+incompatible`](https://github.com/ryanuber/columnize/compare/v2.1.0...v2.1.2)
- `github.com/sirupsen/logrus`: [`v1.9.0 → v1.9.3`](https://github.com/sirupsen/logrus/compare/v1.9.0...v1.9.3)
- `github.com/spf13/cast`: [`v1.3.0 → v1.3.1`](https://github.com/spf13/cast/compare/v1.3.0...v1.3.1)
- `github.com/spf13/cobra`: [`v1.7.0 → v1.8.0`](https://github.com/spf13/cobra/compare/v1.7.0...v1.8.0)
- `github.com/stoewer/go-strcase`: [`v1.2.0 → v1.3.0`](https://github.com/stoewer/go-strcase/compare/v1.2.0...v1.3.0)
- `github.com/stretchr/objx`: [`v0.5.0 → v0.5.1`](https://github.com/stretchr/objx/compare/v0.5.0...v0.5.1)
- `github.com/urfave/cli/v2`: [`v2.1.1 → v2.25.7`](https://github.com/urfave/cli/v2/compare/v2.1.1...v2.25.7)
- `go.etcd.io/bbolt`: `v1.3.7 → v1.3.8`
- `go.etcd.io/etcd/api/v3`: `v3.5.9 → v3.5.11`
- `go.etcd.io/etcd/client/pkg/v3`: `v3.5.9 → v3.5.11`
- `go.etcd.io/etcd/client/v2`: `v2.305.9 → v2.305.10`
- `go.etcd.io/etcd/client/v3`: `v3.5.9 → v3.5.11`
- `go.etcd.io/etcd/pkg/v3`: `v3.5.9 → v3.5.10`
- `go.etcd.io/etcd/raft/v3`: `v3.5.9 → v3.5.10`
- `go.etcd.io/etcd/server/v3`: `v3.5.9 → v3.5.10`
- `go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc`: `v0.35.0 → v0.46.1`
- `go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp`: `v0.39.0 → v0.46.1`
- `go.opentelemetry.io/otel/exporters/otlp/internal/retry`: `v1.15.0 → v1.10.0`
- `go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc`: `v1.15.0 → v1.21.0`
- `go.opentelemetry.io/otel/exporters/otlp/otlptrace`: `v1.15.0 → v1.21.0`
- `go.opentelemetry.io/otel/metric`: `v0.36.0 → v1.21.0`
- `go.opentelemetry.io/otel/sdk`: `v1.15.0 → v1.21.0`
- `go.opentelemetry.io/otel/trace`: `v1.15.0 → v1.21.0`
- `go.opentelemetry.io/otel`: `v1.15.0 → v1.21.0`
- `go.opentelemetry.io/proto/otlp`: `v0.19.0 → v1.0.0`
- `go.uber.org/goleak`: `v1.2.1 → v1.3.0`
- `go.uber.org/zap`: `v1.25.0 → v1.26.0`
- `golang.org/x/crypto`: `v0.12.0 → v0.17.0`
- `golang.org/x/exp`: `d852ddb → 02704c9`
- `golang.org/x/lint`: `738671d → d0100b6`
- `golang.org/x/mod`: `v0.12.0 → v0.14.0`
- `golang.org/x/net`: `v0.14.0 → v0.19.0`
- `golang.org/x/oauth2`: `v0.11.0 → v0.15.0`
- `golang.org/x/sync`: `v0.3.0 → v0.5.0`
- `golang.org/x/sys`: `v0.11.0 → v0.15.0`
- `golang.org/x/term`: `v0.11.0 → v0.15.0`
- `golang.org/x/text`: `v0.12.0 → v0.14.0`
- `golang.org/x/time`: `v0.3.0 → v0.5.0`
- `golang.org/x/tools`: `74c255b → v0.16.1`
- `google.golang.org/api`: `v0.138.0 → v0.154.0`
- `google.golang.org/appengine`: `v1.6.7 → v1.6.8`
- `google.golang.org/genproto/googleapis/api`: `f966b18 → 50ed04b`
- `google.golang.org/genproto/googleapis/bytestream`: `1744710 → 3a041ad`
- `google.golang.org/genproto/googleapis/rpc`: `1744710 → 50ed04b`
- `google.golang.org/genproto`: `f966b18 → 50ed04b`
- `google.golang.org/grpc`: `v1.57.0 → v1.60.1`
- `google.golang.org/protobuf`: `v1.31.0 → v1.32.0`
- `gopkg.in/ini.v1`: `v1.62.0 → v1.67.0`
- `honnef.co/go/tools`: `v0.0.1-2020.1.4 → ea95bdf`
- `k8s.io/api`: `v0.28.1 → v0.29.0`
- `k8s.io/apiextensions-apiserver`: `v0.28.1 → v0.29.0`
- `k8s.io/apimachinery`: `v0.28.1 → v0.29.0`
- `k8s.io/apiserver`: `v0.28.1 → v0.29.0`
- `k8s.io/client-go`: `v0.28.1 → v0.29.0`
- `k8s.io/code-generator`: `v0.28.1 → v0.29.0`
- `k8s.io/component-base`: `v0.28.1 → v0.29.0`
- `k8s.io/gengo`: `c0856e2 → 9cce18d`
- `k8s.io/klog/v2`: `v2.100.1 → v2.110.1`
- `k8s.io/kms`: `v0.28.1 → v0.29.0`
- `k8s.io/kube-aggregator`: `v0.28.1 → v0.29.0`
- `k8s.io/kube-openapi`: `14e4089 → eec4567`
- `k8s.io/utils`: `3b25d92 → e7106e6`
- `sigs.k8s.io/apiserver-network-proxy/konnectivity-client`: `v0.1.2 → v0.29.0`
- `sigs.k8s.io/controller-runtime`: `v0.16.0 → v0.16.3`
- `sigs.k8s.io/gateway-api`: `v0.7.1 → v1.0.0`
- `sigs.k8s.io/structured-merge-diff/v4`: `v4.3.0 → v4.4.1`
- `sigs.k8s.io/yaml`: `v1.3.0 → v1.4.0`
- `software.sslmate.com/src/go-pkcs12`: `v0.2.1 → v0.4.0`

#### Removed
- `cloud.google.com/go/storage`: `v1.10.0`
- `dmitri.shuralyov.com/gpu/mtl`: `666a987`
- `github.com/BurntSushi/xgb`: [`27f1227`](https://github.com/BurntSushi/xgb/tree/27f1227)
- `github.com/OneOfOne/xxhash`: [`v1.2.2`](https://github.com/OneOfOne/xxhash/tree/v1.2.2)
- `github.com/Venafi/vcert/v4`: [`69f417a`](https://github.com/Venafi/vcert/v4/tree/69f417a)
- `github.com/alecthomas/template`: [`a0175ee`](https://github.com/alecthomas/template/tree/a0175ee)
- `github.com/armon/circbuf`: [`bbbad09`](https://github.com/armon/circbuf/tree/bbbad09)
- `github.com/benbjohnson/clock`: [`v1.3.0`](https://github.com/benbjohnson/clock/tree/v1.3.0)
- `github.com/bketelsen/crypt`: [`5cbc8cc`](https://github.com/bketelsen/crypt/tree/5cbc8cc)
- `github.com/cespare/xxhash`: [`v1.1.0`](https://github.com/cespare/xxhash/tree/v1.1.0)
- `github.com/coreos/bbolt`: [`v1.3.2`](https://github.com/coreos/bbolt/tree/v1.3.2)
- `github.com/coreos/etcd`: [`v3.3.13+incompatible`](https://github.com/coreos/etcd/tree/v3.3.13)
- `github.com/coreos/go-systemd`: [`95778df`](https://github.com/coreos/go-systemd/tree/95778df)
- `github.com/coreos/pkg`: [`399ea9e`](https://github.com/coreos/pkg/tree/399ea9e)
- `github.com/dgrijalva/jwt-go`: [`v3.2.0+incompatible`](https://github.com/dgrijalva/jwt-go/tree/v3.2.0)
- `github.com/dgryski/go-sip13`: [`e10d5fe`](https://github.com/dgryski/go-sip13/tree/e10d5fe)
- `github.com/ghodss/yaml`: [`v1.0.0`](https://github.com/ghodss/yaml/tree/v1.0.0)
- `github.com/go-gl/glfw/v3.3/glfw`: [`6f7a984`](https://github.com/go-gl/glfw/v3.3/glfw/tree/6f7a984)
- `github.com/go-gl/glfw`: [`e6da0ac`](https://github.com/go-gl/glfw/tree/e6da0ac)
- `github.com/go-kit/kit`: [`v0.8.0`](https://github.com/go-kit/kit/tree/v0.8.0)
- `github.com/go-stack/stack`: [`v1.8.0`](https://github.com/go-stack/stack/tree/v1.8.0)
- `github.com/google/gnostic`: [`v0.5.7-v3refs`](https://github.com/google/gnostic/tree/v0.5.7-v3refs)
- `github.com/google/martian/v3`: [`v3.0.0`](https://github.com/google/martian/v3/tree/v3.0.0)
- `github.com/google/martian`: [`v2.1.0+incompatible`](https://github.com/google/martian/tree/v2.1.0)
- `github.com/google/renameio`: [`v0.1.0`](https://github.com/google/renameio/tree/v0.1.0)
- `github.com/hashicorp/consul/api`: [`v1.1.0`](https://github.com/hashicorp/consul/api/tree/v1.1.0)
- `github.com/hashicorp/consul/sdk`: [`v0.1.1`](https://github.com/hashicorp/consul/sdk/tree/v0.1.1)
- `github.com/hashicorp/go-msgpack`: [`v0.5.3`](https://github.com/hashicorp/go-msgpack/tree/v0.5.3)
- `github.com/hashicorp/go-syslog`: [`v1.0.0`](https://github.com/hashicorp/go-syslog/tree/v1.0.0)
- `github.com/hashicorp/go.net`: [`v0.0.1`](https://github.com/hashicorp/go.net/tree/v0.0.1)
- `github.com/hashicorp/logutils`: [`v1.0.0`](https://github.com/hashicorp/logutils/tree/v1.0.0)
- `github.com/hashicorp/mdns`: [`v1.0.0`](https://github.com/hashicorp/mdns/tree/v1.0.0)
- `github.com/hashicorp/memberlist`: [`v0.1.3`](https://github.com/hashicorp/memberlist/tree/v0.1.3)
- `github.com/hashicorp/serf`: [`v0.8.2`](https://github.com/hashicorp/serf/tree/v0.8.2)
- `github.com/jstemmer/go-junit-report`: [`v0.9.1`](https://github.com/jstemmer/go-junit-report/tree/v0.9.1)
- `github.com/kr/logfmt`: [`b84e30a`](https://github.com/kr/logfmt/tree/b84e30a)
- `github.com/mitchellh/gox`: [`v0.4.0`](https://github.com/mitchellh/gox/tree/v0.4.0)
- `github.com/mitchellh/iochan`: [`v1.0.0`](https://github.com/mitchellh/iochan/tree/v1.0.0)
- `github.com/morikuni/aec`: [`v1.0.0`](https://github.com/morikuni/aec/tree/v1.0.0)
- `github.com/oklog/ulid`: [`v1.3.1`](https://github.com/oklog/ulid/tree/v1.3.1)
- `github.com/pascaldekloe/goe`: [`57f6aae`](https://github.com/pascaldekloe/goe/tree/57f6aae)
- `github.com/prometheus/tsdb`: [`v0.7.1`](https://github.com/prometheus/tsdb/tree/v0.7.1)
- `github.com/sean-/seed`: [`e2103e2`](https://github.com/sean-/seed/tree/e2103e2)
- `github.com/shurcooL/sanitized_anchor_name`: [`v1.0.0`](https://github.com/shurcooL/sanitized_anchor_name/tree/v1.0.0)
- `github.com/spaolacci/murmur3`: [`f09979e`](https://github.com/spaolacci/murmur3/tree/f09979e)
- `golang.org/x/image`: `cff245a`
- `golang.org/x/mobile`: `d2bd2a2`
- `gopkg.in/alecthomas/kingpin.v2`: `v2.2.6`
- `gopkg.in/resty.v1`: `v1.12.0`
- `gotest.tools/v3`: `v3.4.0`
- `rsc.io/binaryregexp`: `v0.2.0`
- `rsc.io/quote/v3`: `v3.1.0`
- `rsc.io/sampler`: `v1.3.0`
