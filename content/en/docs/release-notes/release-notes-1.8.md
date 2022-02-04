---
title: "Release 1.8"
linkTitle: "v1.8"
weight: 750
type: "docs"
---

## v1.8.0

cert-manager 1.8 includes wider support for Kubernetes server-side-apply, a new build and development experience based around
`Makefile`s rather than Bazel, and a range of other improvements, tweaks and bug fixes.

Version 1.8 also marks our first release in which the Go import path for cert-manager is that of the repo's new home:

`github.com/cert-manager/cert-manager`

### Breaking Changes (You MUST read this before you upgrade!)

#### Validation of the `rotationPolicy` field

The field `spec.privateKey.rotationPolicy` on Certificate resources is now validated. Valid options are Never and Always. If you are using a GitOps flow and one of your YAML manifests contains a Certificate with an invalid value, you will need to update it with a valid value to prevent your GitOps tool from failing on the new validation. Please follow the instructions listed on the page [Upgrading from v1.7 to v1.8](https://cert-manager.io/docs/installation/upgrading/upgrading-1.7-1.8.md). ([#4913](https://github.com/cert-manager/cert-manager/pull/4913), [@jahrlin](https://github.com/jahrlin))

##### What happens if I upgrade to 1.8.0 without doing the above steps?

After upgrading to 1.8.0, when updating existing Certificate objects that have an incorrect value for `rotationPolicy`, Kubernetes clients such as kubectl, Helm, or ArgoCD will start showing the following message:

```text
Certificate.cert-manager.io "my-cert" is invalid: spec.privateKey.rotationPolicy: Unsupported value: "Foo": supported values: "Never", "Always".
```

##### Why was this change necessary?

Previously, when the value of the `rotationPolicy` field was set to an incorrect value, you would not know since no event or condition would be visible on the Certificate itself. The only way to know that something was wrong was to dig into the cert-manager-controller logs and see the message "Certificate with unknown `certificate.spec.privateKey.rotationPolicy` value":

```text
I0329 12:43:13.325771       1 keymanager_controller.go:176] cert-manager/certificates-key-manager "msg"="Certificate with unknown certificate.spec.privateKey.rotationPolicy value" "key"="default/my-cert" "rotation_policy"="Foo"
```

This change was implemented in [#4913](https://github.com/cert-manager/cert-manager/pull/4913).

#### Changed Container Layouts

This only affects you if you're modifying cert-manager containers in some way, such as adding init scripts or otherwise
changing how the binaries inside the containers are called.

Bazel has a unique way of creating containers, which places the actual binary at a long unusual path. For the v1.7.0 cert-manager-webhook
container for example, the binary is placed at `/app/cmd/webhook/webhook.runfiles/com_github_jetstack_cert_manager/cmd/webhook/webhook_/webhook`
and `/app/cmd/webhook/webhook` is provided as a symlink to the binary.

This is simplified in our new build system; we only place a single binary at `/app/cmd/webhook/webhook` and the old path disappears.
This applies to all cert-manager containers.

We also removed the "LICENSES" file from the containers and replaced it with a link to the cert-manager repo.

#### `.exe` Extension on Windows

We package `cmctl` and `kubectl_cert-manager` for Windows on `amd64` platforms, but previously the binaries had the
same names as the binaries on other platforms, e.g. `cmctl` with no file extension.

In 1.8.0 and later, the binaries now have a `.exe` extension since this is standard practice on Windows. This could affect you
if you're calling the binary in a Powershell script, for example.

We've also now added zip-compressed versions of the `cmctl` and `kubectl_cert-manager` binaries on Windows, since `.tar.gz` is less
common on Windows.

#### Changed Import Path

This will only affect you if you're writing code in Go which imports cert-manager as a module, which we generally recommend against
doing in most cases.

All versions of cert-manager prior to v1.8.0 used a Go import path corresponding to the old cert-manager repository, `github.com/jetstack/cert-manager`.

v1.8.0 marks the first release in which the import path changes to the new location, `github.com/cert-manager/cert-manager`.

We have a guide for [Importing cert-manager in Go](https://cert-manager.io/docs/contributing/importing/) on cert-manager.io with all the details, including
details on why we don't recommend importing cert-manager as a module if that's avoidable.

### Major Themes

#### Server Side Apply

cert-manager v1.8.0 adds initial support for Kubernetes [Server Side Apply](https://kubernetes.io/docs/reference/using-api/server-side-apply/), which became stable
in Kubernetes 1.22. This support is behind a feature gate for now, and is only supported by cert-manager on Kubernetes 1.22 and later.

Server Side Apply helps to ensure that changes to resources are made in a managed way, and aims to prevent certain classes of bugs. Notably, it should
eliminate conflicts when multiple controllers try to apply status changes to a single resource. You'll likely have seen messages relating to this kind of
conflict in logs before, e.g.:

```text
I0119 12:34:56.000000       1 controller.go:161] cert-manager/controller/certificaterequests-issuer-acme "msg"="re-queuing item due to optimistic locking on resource" "key"="my-namespace/my-cr" "error"="Operation cannot be fulfilled on certificaterequests.cert-manager.io \"my-cr\": the object has been modified; please apply your changes to the latest version and try again"
```

These conflicts aren't usually actually a problem which will block the issuance of a certificate, but they can delay things as they cause extra
reconcile loops. Server-side apply cleans things up, which should mean less noise in logs and fewer pointless reconcile loops.

If you want to test it out, you can enable alpha-level cert-manager Server Side Apply support through the
`--feature-gates` [controller flag](https://cert-manager.io/docs/cli/controller/).

#### From Bazel to Make

A common theme when someone tries to make a change to cert-manager for the first time is that they ask for help with navigating Bazel, which cert-manager
used as its build tool. Helping people with Bazel isn't easy; it's an _incredibly_ powerful tool, but that power also brings a lot of complications
which can seriously get in the way of being able to make even simple changes to the code base. Even developers who are familiar with contributing
to open source projects in Go can find it daunting to make changes thanks to Bazel.

The problem isn't limited to open-source contributors; many of cert-manager's maintainers also struggle with configuring and changing Bazel, too.

cert-manager 1.8 is the first release which is built and tested using a newly written `make`-based build system. We believe that this new build system should
make it _much_ simpler to understand and change the commands which are being run behind the scenes to build and test cert-manager. In time, we'll fully
document the new build system, ensure it's at full feature-parity with Bazel and then remove all references to Bazel across the codebase.

A neat side effect of this change is that our build times have significantly improved. Bazel took around 14 minutes to build every cert-manager
artifact for every platform during a release, while the new `make` build system can do the same (and more) in under 5 minutes.

## Changelog since v1.7.0

### Feature

- ACTION REQUIRED: The field `spec.privateKey.rotationPolicy` on Certificate resources is now validated. Valid options are Never and Always. If you are using a GitOps flow and one of your YAML manifests contains a Certificate with an invalid value, you will need to update it with a valid value to prevent your GitOps tool from failing on the new validation. ([#4913](https://github.com/cert-manager/cert-manager/pull/4913), [@jahrlin](https://github.com/jahrlin))
- Add make targets for running unit and integration tests, as part of the Bazel replacement. ([#4865](https://github.com/cert-manager/cert-manager/pull/4865), [@SgtCoDFish](https://github.com/SgtCoDFish))
- cert-manager now supports the field `spec.expirationSeconds` on Kubernetes CertificateSigningRequest resources. Using this field requires Kubernetes 1.22. You can still use the annotation `experimental.cert-manager.io/request-duration` to request a duration. ([#4957](https://github.com/cert-manager/cert-manager/pull/4957), [@enj](https://github.com/enj))
- Certificate `AdditionalOutputFormat`: `AdditionalOutputFormat`s are actively reconciled, meaning cert-manager will always maintain the correct Secret data, both for fields being removed/added/modified on both the Certificate's `AdditionalOutputFormat` as well as the target Secret's Data. `AdditionalOutputFormat` is an Alpha feature, and is only enabled with the `--feature-gates=AdditionalCertificateOutputFormats=true` flag. ([#4813](https://github.com/cert-manager/cert-manager/pull/4813), [@JoshVanL](https://github.com/JoshVanL))
- ClusterRoles aggregation to user-facing admin/edit/view ClusterRoles can be optionally turned off ([#4937](https://github.com/cert-manager/cert-manager/pull/4937), [@illrill](https://github.com/illrill))
- ServerSideApply: The feature gate `ServerSideApply=true` configures the certificate-shim controllers to use Kubernetes Server Side Apply on Certificate resources. ([#4811](https://github.com/cert-manager/cert-manager/pull/4811), [@JoshVanL](https://github.com/JoshVanL))
- ServerSideApply: The feature gate `ServerSideApply=true` configures the `certificaterequest` controllers to use Kubernetes Server Side Apply on `CertificateRequest` resources. ([#4792](https://github.com/cert-manager/cert-manager/pull/4792), [@JoshVanL](https://github.com/JoshVanL))
- ServerSideApply: The feature gate `ServerSideApply=true` configures the `certificate` controllers to use Kubernetes Server Side Apply on `Certificate` resources. ([#4777](https://github.com/cert-manager/cert-manager/pull/4777), [@JoshVanL](https://github.com/JoshVanL))
- ServerSideApply: The feature gate `ServerSideApply=true` configures the `certificatesigningrequest` controllers to use Kubernetes Server Side Apply on `CertificateSigningRequest` resources. ([#4798](https://github.com/cert-manager/cert-manager/pull/4798), [@JoshVanL](https://github.com/JoshVanL))
- ServerSideApply: The feature gate `ServerSideApply=true` configures the `issuer` and `clusterissuer` controllers to use Kubernetes Server Side Apply on `Issuer` and `ClusterIssuer` resources. ([#4794](https://github.com/cert-manager/cert-manager/pull/4794), [@JoshVanL](https://github.com/JoshVanL))
- ServerSideApply: The feature gate `ServerSideApply=true` configures the `order` controller to use Kubernetes Server Side Apply on `Order` resources. ([#4799](https://github.com/cert-manager/cert-manager/pull/4799), [@JoshVanL](https://github.com/JoshVanL))
- The annotation `experimental.cert-manager.io/request-duration` now has a minimum value of 600 seconds. This annotation This change ensures compatibility with the Kubernetes resource CertificateSigningRequest, which requires a minimum of 600 seconds on the field `spec.expirationSeconds`. ([#4973](https://github.com/cert-manager/cert-manager/pull/4973), [@irbekrm](https://github.com/irbekrm))
- The annotation `ingress.kubernetes.io/whitelist-source-range` used by the Ingress shim when creating Ingress resources can now be overridden by setting the field `ingressTemplate` on the Issuer and ClusterIssuer. ([#4789](https://github.com/cert-manager/cert-manager/pull/4789), [@tasharnvb](https://github.com/tasharnvb))
- The experimental Gateway API support now uses the v1alpha2 CRDs. ([#4791](https://github.com/cert-manager/cert-manager/pull/4791), [@jakexks](https://github.com/jakexks))
- The user-agent used by cert-manager in its Kubernetes API clients and ACME clients now takes the form `cert-manager-<component name>/<version> (<os>/<arch>) cert-manager/<git commit>`. Another change is the addition of specific field managers strings; previously, all the controllers had the same field manager `cert-manager`. Now, each controller has its own field manager string of the form `cert-manager-<controller name>`. ([#4773](https://github.com/cert-manager/cert-manager/pull/4773), [@JoshVanL](https://github.com/JoshVanL))
- You can now uninstall cert-manager using the command `cmctl experimental uninstall`. ([#4897](https://github.com/cert-manager/cert-manager/pull/4897), [@jahrlin](https://github.com/jahrlin))
- You can now use an external issuer resource as the default issuer when using the Ingress shim feature. The default issuer can be set using the flags `--default-issuer-group`, `--default-issuer-kind`, and `--default-issuer-name`. ([#4833](https://github.com/cert-manager/cert-manager/pull/4833), [@jakexks](https://github.com/jakexks))

### Design

- The import path for cert-manager has been updated to `github.com/cert-manager/cert-manager`. If you import cert-manager as a go module (which isn't currently recommended), you'll need to update the module import path in your code to import cert-manager 1.8 or later. ([#4587](https://github.com/cert-manager/cert-manager/pull/4587), [@SgtCoDFish](https://github.com/SgtCoDFish))

### Bug or Regression

- Fix: The alpha feature Certificate's `additionalOutputFormats` is now correctly validated at admission time, and no longer _only_ validated if the `privateKey` field of the Certificate is set. The Webhook component now contains a separate feature set.
  `AdditionalCertificateOutputFormats` feature gate (disabled by default) has been added to the webhook. This gate is required to be enabled on both the controller and webhook components in order to make use of the Certificate's `additionalOutputFormat` feature. ([#4814](https://github.com/cert-manager/cert-manager/pull/4814), [@JoshVanL](https://github.com/JoshVanL))
- The Go version used to build the cert-manager binaries has been bumped to 1.17.8 to fix a slew of CVEs (none of which were likely to be exploited). ([#4970](https://github.com/cert-manager/cert-manager/pull/4970), [@vhosakot](https://github.com/vhosakot))
- Use multivalue records instead of simple records for the AWS Route53 ACME DNS challenge solver, to allow for multiple challenges for the same domain at the same time ([#4793](https://github.com/cert-manager/cert-manager/pull/4793), [@fvlaicu](https://github.com/fvlaicu))

### Other (Cleanup or Flake)

- Aggregated admin and edit roles will now include permissions to update certificates' status, which will allow namespace admins and editors to run the `cmctl renew` command in their namespaces. ([#4955](https://github.com/cert-manager/cert-manager/pull/4955), [@andreadecorte](https://github.com/andreadecorte))
- Cleanup: No longer log an error when cert-manager encounters a conflict in the secrets manager, in favor of always force applying. ([#4815](https://github.com/cert-manager/cert-manager/pull/4815), [@JoshVanL](https://github.com/JoshVanL))
- Failed certificate issuances are now retried with an exponential backoff where the backoff periods are `1h`, `2h`, `4h`, `8h`, `16h`, `32h`.
  A new field `failedIssuanceAttempts` is added to `Certificate`'s status that keeps track of consecutive failed issuances. Backoff period gets reset by a successful issuance. The current behavior where changing certain fields on `Certificate`s spec (such as DNS names) or manually renewing using `cmctl` tool remains unchanged. ([#4772](https://github.com/cert-manager/cert-manager/pull/4772), [@irbekrm](https://github.com/irbekrm))
- When starting up, cert-manager now solely relies on Lease objects to perform the leader election. Previously, cert-manager supported both ConfigMap and Lease objects for leader election. Existing ConfigMap resources used for leader election will remain and will need deleting manually. A side effect of this is that you cannot upgrade to v1.8.0 from cert-manager 1.3 (although upgrading multiple versions at a time was never supported). ([#4935](https://github.com/cert-manager/cert-manager/pull/4935), [@davidsbond](https://github.com/davidsbond))
- When using the Helm chart, you can now set custom labels on the `ServiceAccount` resources using the values `serviceAccount.labels`, `cainjector.serviceAccount.labels`, `webhook.serviceAccount.labels`, and `startupapicheck.serviceAccount.labels`. ([#4932](https://github.com/cert-manager/cert-manager/pull/4932), [@4molybdenum2](https://github.com/4molybdenum2))

### Uncategorized

- Set `securityContext.allowPrivilegeEscalation` to `false` by default when creating the `acmesolver` pod. The Helm chart now also sets `securityContext.allowPrivilegeEscalation` to `false` by default for the controller, cainjector, and webhook pods as well as for the `startupapicheck` job. ([#4953](https://github.com/cert-manager/cert-manager/pull/4953), [@ajvn](https://github.com/ajvn))
