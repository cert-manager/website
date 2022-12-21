---
title: Release 1.10
description: 'cert-manager release notes: cert-manager 1.10'
---

Release 1.10 adds a variety of quality-of-life fixes and features including improvements to the test suite.

The latest version is `v1.10.1`.

## Breaking Changes (You **MUST** read this before you upgrade!)

### Container Name Changes

This change is only relevant if you install cert-manager using Helm or the static manifest files. `v1.10.0` changes the names of containers in pods created by cert-manager.

The names are changed to better reflect what they do; for example, the container in the controller pod had its name changed from `cert-manager` to `cert-manager-controller`,
and the webhook pod had its container name changed from `cert-manager` to `cert-manager-webhook`.

This change could cause a break if you:

1. Use Helm or the static manifests, and
2. Have scripts, tools or tasks which rely on the names of the cert-manager containers being static

If both of these are true, you may need to update your automation before you upgrade.

### On OpenShift the cert-manager Pods may fail until you modify Security Context Constraints

In cert-manager 1.10 the [secure computing (seccomp) profile](https://kubernetes.io/docs/tutorials/security/seccomp/) for all the Pods
is set to `RuntimeDefault`.
(See [cert-manager pull request 5259](https://github.com/cert-manager/cert-manager/pull/5259/files).)
The `securityContext` fields of the Pod are set as follows:
```yaml
...
# ref: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
securityContext:
  seccompProfile:
    type: RuntimeDefault
    ...
```

On some versions and configurations of OpenShift this can cause the Pod to be rejected by the
[Security Context Constraints admission webhook](https://docs.openshift.com/container-platform/4.10/authentication/managing-security-context-constraints.html#admission_configuring-internal-oauth).

#### On OpenShift `v4.7`, `v4.8`, `v4.9` and `v4.10` you may need to modify Security Context Constraints to allow cert-manager Pods to be deployed

In OpenShift `v4.7`, `v4.8`, `v4.9` and `v4.10`, the default SecurityContextConstraint is called "restricted", and it forbids Pods that have the `RuntimeDefault` seccomp profile.
If you deploy cert-manager on these versions of OpenShift you may see the following error condition on the cert-manager Deployments:

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
status:
  conditions:
# ...
  - lastTransitionTime: "2022-11-01T09:41:41Z"
    lastUpdateTime: "2022-11-01T09:41:41Z"
    message: 'pods "cert-manager-84bc577876-qzbnf" is forbidden: unable to validate
      against any security context constraint: [pod.metadata.annotations.seccomp.security.alpha.kubernetes.io/pod:
      Forbidden: seccomp may not be set pod.metadata.annotations.container.seccomp.security.alpha.kubernetes.io/cert-manager-controller:
      Forbidden: seccomp may not be set provider "anyuid": Forbidden: not usable by
      user or serviceaccount provider "nonroot": Forbidden: not usable by user or
      serviceaccount provider "hostmount-anyuid": Forbidden: not usable by user or
      serviceaccount provider "machine-api-termination-handler": Forbidden: not usable
      by user or serviceaccount provider "hostnetwork": Forbidden: not usable by user
      or serviceaccount provider "hostaccess": Forbidden: not usable by user or serviceaccount
      provider "privileged": Forbidden: not usable by user or serviceaccount]'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
# ...
```

The work around is to copy the "restricted" SecurityContextConstraint resource and then modify it to allow Pods with `RuntimeDefault` seccomp profile.
Then use `oc adm policy add-scc-to-user` to create a Role and a RoleBinding that allows all the cert-manager ServiceAccounts to use that SecurityContextConstraint.

> 📖 Read [Enabling the default seccomp profile for all pods](https://docs.openshift.com/container-platform/4.10/security/seccomp-profiles.html#configuring-default-seccomp-profile_configuring-seccomp-profiles) to learn more about this process.

#### On OpenShift `v4.11` you may need to modify Security Context Constraints to allow cert-manager Pods to be deployed

In OpenShift `v4.11`, there is a new SecurityContextConstraint called `restricted-v2`, which permits Pods that have the `RuntimeDefault` seccomp profile and this will used for the cert-manager Pods by default, allowing the Pods to be created.

But if you have upgraded OpenShift from a previous version, the old `restricted` SecurityContextConstraint may still be used and you will have to make changes to the RoleBindings in order to make it the default for all Pods.

> 📖 Read [Pod security admission in the OpenShift `v4.11` release notes](https://docs.openshift.com/container-platform/4.11/release_notes/ocp-4-11-release-notes.html#ocp-4-11-auth-pod-security-admission) to learn more about the changes to the default security context constraints in `v4.11`.
>
> 📖 Read [Default security context constraints](https://docs.openshift.com/container-platform/4.11/authentication/managing-security-context-constraints.html#default-sccs_configuring-internal-oauth) in the OpenShift `v4.11` documentation to learn about the characteristics of the default Security Context Constraints in OpenShift.

#### When using the OLM packages for OperatorHub on OpenShift `>= v4.7`, you may need to modify Security Context Constraints to allow the cert-manager ACME HTTP01 Pod to be deployed

In the cert-manager OLM packages for RedHat OpenShift OperatorHub, the `seccompProfile` field in the Deployment resource has been removed,
and this should allow you to install it on OpenShift `v4.7`, `v4.8`, `v4.9`, `v4.10`, and `v4.11` without any extra configuration.

But if you are using the ACME Issuer with the HTTP01 solver, cert-manager will deploy a short lived Pod that uses the `RuntimDefault` seccomp profile which may be denied because of the existing Security Context Constraints.

> 📖 Read [Enabling the default seccomp profile for all pods](https://docs.openshift.com/container-platform/4.10/security/seccomp-profiles.html#configuring-default-seccomp-profile_configuring-seccomp-profiles) to learn how to configure your system to allow Pods that use the `RuntimeDefault` seccomp profile.

## `v1.10.1`: Changes since `v1.10.0`

### Bug or Regression

- The Venafi Issuer now supports TLS 1.2 renegotiation, so that it can connect to TPP servers where the `vedauth` API endpoints are configured to *accept* client certificates.
  (Note: This does not mean that the Venafi Issuer supports client certificate authentication).
  ([#5576](https://github.com/cert-manager/cert-manager/pull/5371), [@wallrj](https://github.com/wallrj))
- Upgrade to latest go patch release
  ([#5560](https://github.com/cert-manager/cert-manager/pull/5560), [@SgtCoDFish](https://github.com/SgtCoDFish))

## `v1.10.0`: Changes since `v1.9.1`

### Feature

- Add `issuer_name`, `issuer_kind` and `issuer_group` labels to `certificate_expiration_timestamp_seconds`, `certmanager_certificate_renewal_timestamp_seconds` and `certmanager_certificate_ready_status` metrics (#5461, @dkulchinsky)
- Add make targets for running scans with trivy against locally built containers (#5358, @SgtCoDFish)
- CertificateRequests: requests that use the SelfSigned Issuer will be re-reconciled when the target private key Secret has been informed `cert-manager.io/private-key-secret-name`. This resolves an issue whereby a request would never be signed when the target Secret was not created or was misconfigured before the request. (#5336, @JoshVanL)
- CertificateSigningRequests: requests that use the SelfSigned Issuer will be re-reconciled when the target private key Secret has been informed `experimental.cert-manager.io/private-key-secret-name`. This resolves an issue whereby a request would never be signed when the target Secret was not created or was misconfigured before the request.
  CertificateSigningRequests will also now no-longer be marked as failed when the target private key Secret is malformed- now only firing an event. When the Secret data is resolved, the request will attempt issuance. (#5379, @JoshVanL)
- Upgraded Gateway API to v0.5.0 (#5376, @inteon)
- Add caBundleSecretRef to the Vault Issuer to allow referencing the Vault CA Bundle with a Secret. Cannot be used in conjunction with the in-line caBundle field. (#5387, @Tolsto)
- The feature to create certificate requests with the name being a function of certificate name and revision has been introduced under the feature flag "StableCertificateRequestName" and it is disabled by default. This helps to prevent the error "multiple CertificateRequests were found for the 'next' revision...". (#5487, @sathyanarays)
- Helm: Added a new parameter `commonLabels` which gives you the capability to add the same label on all the resource deployed by the chart. (#5208, @thib-mary)

### Bug or Regression

- CertificateSigningRequest: no longer mark a request as failed when using the SelfSigned issuer, and the Secret referenced in `experimental.cert-manager.io/private-key-secret-name` doesn't exist. (#5323, @JoshVanL)
- DNS Route53: Remove incorrect validation which rejects solvers that don't define either a `accessKeyID` or `secretAccessKeyID`. (#5339, @JoshVanL)
- Enhanced securityContext for PSS/restricted compliance. (#5259, @joebowbeer)
- Fix issue where CertificateRequests marked as InvalidRequest did not properly trigger issuance failure handling leading to 'stuck' requests (#5366, @munnerz)
- `cmctl` and `kubectl cert-manager` now report their actual versions instead of "canary", fixing issue [#5020](https://github.com/cert-manager/cert-manager/issues/5020) (#5022, @maelvls)

### Other

- Avoid hard-coding release namespace in helm chart (#5163, @james-callahan)
- Bump cert-manager's version of Go to `1.19` (#5466, @lucacome)
- Remove `.bazel` and `.bzl` files from cert-manager now that bazel has been fully replaced (#5340, @SgtCoDFish)
- Updates Kubernetes libraries to `v0.25.2`. (#5456, @lucacome)
- Add annotations for ServiceMonitor in helm chart (#5401, @sathieu)
- Helm: Add NetworkPolicy support (#5417, @mjudeikis)
- To help troubleshooting, make the container names unique.
  BREAKING: this change will break scripts/ CI that depend on `cert-manager` being the container name. (#5410, @rgl)
