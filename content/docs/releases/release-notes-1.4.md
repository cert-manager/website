---
title: Release Notes
description: 'cert-manager release notes: cert-manager v1.4'
---

# Final Release `v1.4.0`

Special thanks to the external contributors who contributed to this release:

* [@andreas-p](https://github.com/andreas-p)
* [@erikgb](https://github.com/erikgb)
* [@eddiehoffman](https://github.com/eddiehoffman)
* [@inteon](https://github.com/inteon)
* [@anton-johansson](https://github.com/anton-johansson)
* [@edglynes](https://github.com/edglynes)
* [@jandersen-plaid](https://github.com/jandersen-plaid)
* [@foosinn](https://github.com/foosinn)
* [@jsoref](https://github.com/jsoref)
* [@clatour](https://github.com/clatour)
* [@tamalsaha](https://github.com/tamalsaha)

## Deprecated Features and Breaking Changes

### Removal of the cert-manager operator package on Red Hat Marketplace

Since cert-manager `v0.15` there has been a package for cert-manager on [Red Hat Marketplace][],
but this has now been removed because it was not maintained and was found to be unreliable:
[#4055](https://github.com/cert-manager/cert-manager/issues/4055)
[#3732](https://github.com/cert-manager/cert-manager/issues/3732)
[#436](https://github.com/cert-manager/website/issues/436)

[Red Hat Marketplace]: https://marketplace.redhat.com

It is replaced by a new package which is generated via the [Community Operators Repository][],
and which is therefore available on
[OperatorHub.io](https://operatorhub.io),
[OpenShift Container Platform](https://openshift.com) and
[OKD](https://okd.io).

[Community Operators Repository]: https://github.com/operator-framework/community-operators

Please uninstall the existing cert-manager package and re-install
by following the [OLM Installation Documentation][].

[OLM Installation Documentation]: ../installation/operator-lifecycle-manager.md

### Upgrading cert-manager CRDs and stored versions of cert-manager custom resources

We have deprecated the following cert-manager APIs:

- `cert-manager.io/v1alpha2`
- `cert-manager.io/v1alpha3`
- `cert-manager.io/v1beta1`
- `acme.cert-manager.io/v1alpha2`
- `acme.cert-manager.io/v1alpha3`
- `acme.cert-manager.io/v1beta1`

These APIs will be removed in cert-manager 1.6.

<div className="warning">

⛔️  If you are upgrading cert-manager on a cluster which has previously had
cert-manager < `v1.0.0`, you will need to ensure that all cert-manager custom
resources are stored in `etcd` at `v1` version and that cert-manger CRDs do not
reference the deprecated APIs **by the time you upgrade to `v1.6`**.

This is explained in more detail in the [Upgrading existing cert-manager
resources](../installation/upgrading/remove-deprecated-apis.md#upgrading-existing-cert-manager-resources)
page.

</div>

This change was made in the cert-manager PR [#4021][].

[#4021]: https://github.com/cert-manager/cert-manager/pull/4021 "Warn about removal of old v1alpha2, v1alpha3 and v1beta1 in 1.6"

### Helm chart: `securityContext` defaults to non-root

The Helm chart now follows the current Pod hardening best practices as defined
by the Kyverno [`pod-security
restricted`](https://kyverno.io/policies/pod-security/#restricted) policy.

To pass the validation, the controller, webhook, and cainjector Pods are now
running as non-root:

```yaml
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
```

<div className="warning">

⛔️  If you are using custom containers that run as root with the Helm chart, you
will need to set this back to `false`.

</div>

Implemented in the cert-manager PR [#4036][].

[#4036]: https://github.com/cert-manager/cert-manager/pull/4036 "controller, cainject and webhook now run as non-root"

### CA, Vault and Venafi issuer handling of `ca.crt` and `tls.crt`

The CA, Vault, and Venafi issuer now produce a `tls.crt` that is de-duplicated,
in the correct order (leaf at the top, issuing certificate at the bottom) and
verified (i.e. each signature can be verified).

The CA issuer now produces a `ca.crt` that contains the "most" root CA that
cert-manager is aware of. `ca.crt` may thus not be the actual self-signed root
CA, since cert-manager may not be aware of it.

Fixed in the cert-manager PRs [#3982][], [#3983][], and [#3985][].

<div className="warning">

⛔️  You may need to adjust systems that consume the `ca.crt` from Secrets
managed by cert-manager with the CA issuer.

</div>

[#3982]: https://github.com/cert-manager/cert-manager/pull/3982 "All issuers + Vault issuer"
[#3983]: https://github.com/cert-manager/cert-manager/pull/3983 "Venafi issuer"
[#3985]: https://github.com/cert-manager/cert-manager/pull/3985 "CA issuer"


### Vault renewal bug

The renewal behavior has changed when a Certificate has a `duration` value of
more than 90 days and `renewBefore` has not been set.

Previously, the Certificate was renewed 30 days before expiry; now, the renewal
happens 2/3 through the duration.

This change was necessary to fix a bug where users of the Vault issuer would see
a clash between the default renewal duration of 30 days and the duration of
certificates issued by the Vault PKI.

<div className="warning">

⛔️  If you were relying on the default renewal happening 30 days before expiry,
we would advise setting `renewBefore` to 30 days (`720h`) to keep the old
behavior.

</div>

Fixed in the cert-manager PR [#4092][].

[#4092]: https://github.com/cert-manager/cert-manager/pull/4092 "Default renewal changed from 30 days before expiry to 1/3 of the duration before expiry"

## New Features

### Experimental Support for Kubernetes CertificateSigningRequests

It is now possible to use the built-in Kubernetes [CertificateSigningRequest][]
resources with cert-manager. The CA Issuer is currently the only supported
issuer. The feature is experimental and can be enabled by adding a flag to the
cert-manager controller. For example, with Helm:

```sh
helm install cert-manager jetstack/cert-manager \
  --set extraArgs="{--feature-gates=ExperimentalCertificateSigningRequestControllers=true}"
```

Note that you will still need to manually approve the CSR object before
cert-manager can sign the CSR.

The documentation is available on the [the Kubernetes CSR usage
page](../usage/kube-csr.md).

Implemented in cert-manager PR [#4064][].

[#4064]: https://github.com/cert-manager/cert-manager/pull/4064 "CA issuer experimental support for CertificateSigningRequests"
[CertificateSigningRequest]: https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/

### Helm chart: webhook externally accessible for bare-metal

In [some](https://github.com/kubernetes/kubernetes/issues/72936#issue-399522387)
Kubernetes setups, the apiserver is not able to talk to `kube-dns` (i.e., when
Kubernetes is running on bare-metal with no special `resolv.conf`).

To work around that, the cert-manager webhook can now be configured to be
accessible from outside of the cluster. For example, in `values.yaml`:

```yaml
# values.yaml
webhook:
  serviceType: LoadBalancer
  loadBalancerIP: 198.51.100.20
  url:
    host: 198.51.100.20
```

Implemented in cert-manager PRs [#3876][], [#3932][].

[#3932]: https://github.com/cert-manager/cert-manager/pull/3932 "Adds support for accessing coversion webhook from outside cluster network"
[#3876]: https://github.com/cert-manager/cert-manager/pull/3876 "Adds support for accessing mutating and validating webhooks from outside cluster network"

### Helm chart: Service labels

The cert-manager controller Service now supports custom labels using the
top-level field in `values.yaml`:

```yaml
# values.yaml
serviceLabels:
  app: armada-api
```

This may be useful in conjunction with Prometheus' `labelmap`. For example, with
the following sample Prometheus configuration:

```yaml
# prometheus.yaml
- action: labelmap
  regex: __meta_kubernetes_service_label_(.+)
```

With the above example, the source label
`__meta_kubernetes_service_label_app='armada-api'` becomes the new label
`app='armada-api'` when metrics related to this Service are scraped.

Implemented in the cert-manager PR [#4009][].

[#4009]: https://github.com/cert-manager/cert-manager/pull/4009 "Helm chart: the Service labels can now be set on the controller"

### Akamai DNS01 solver

The Akamai DNS01 solver has been [updated][4007] to use the v2 of the `OPEN
EdgeGrid` Go package.

[#4007]: https://github.com/cert-manager/cert-manager/pull/4007 "Update of the Akamai DNS01 solver"

## Bug Fixes

- The [RFC2136](https://cert-manager.io/docs/configuration/acme/dns01/rfc2136/)
  issuer is now able to handle DNS01 challenges that map to multiple `TXT`
  records. This lets you create Let's Encrypt certificates using RFC2136 with
  multiple DNS names. Fixed in the cert-manager PR [#3622][].
- The comparison function `PublicKeysEqual` is now correct for public keys.
  Fixed in PR [#3914][].
- The ACME issuer now works correctly with Certificates that have a long name
  (52 characters or more). These Certificates would not get renewed due to
  non-unique Order names being generated. Fixed in the cert-manager PR
  [#3866][].
- Orders that are used with a misbehaving ACME server should not get stuck
  anymore. By misbehaving, we mean an ACME server that would validate the
  authorizations before having set the status of the order to "ready". Fixed in
  the cert-manager PR [#3805][].
- The internal issuers now set the condition `Ready=False` with the reason
  `RequestDenied` when a CertificateRequest has been `Denied`. This is to keep
  the same behavior where a terminal state of a CertificateRequest should have a
  `Ready` condition. Fixed in the cert-manager PR [#3878][].

[#3622]: https://github.com/cert-manager/cert-manager/pull/3622 "RFC2136 fixed when used with challenge domains that contain multiple TXT records"
[#3914]: https://github.com/cert-manager/cert-manager/pull/3914 "Comparison between public keys now works properly"
[#3866]: https://github.com/cert-manager/cert-manager/pull/3866 "Certificates with long names are not generated non-unique Orders anymore"
[#3805]: https://github.com/cert-manager/cert-manager/pull/3805 "Misbehaving ACME servers won't get Orders stuck anymore"
[#3878]: https://github.com/cert-manager/cert-manager/pull/3878 "When a CertificateRequest is Denied, the internal issuers set Ready=False"

## Other Changes

- The cert-manager controller now uses the `configmapsleases` resource instead
  of the `configmaps` one for leader election. The only noticeable difference is
  that a new `Lease` object is now being created in the leader election
  namespace. Implemented in the cert-manager PR [#4016][].

[#4016]: https://github.com/cert-manager/cert-manager/pull/4016 "Use the configmapsleases resource instead of configmaps"

- The `keyAlgorithm` for the ACME Issuer is now deprecated, and the EAB MAC
  algorithm is now hard-coded to `HS256`.

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Issuer
      spec:
        acme:
          externalAccountBinding:
            keyAlgorithm: HS256      # DEPRECATED.
    ```
    Previously, we used to have a fork of `golang/crypto` which allowed us to set
    the EAB MAC algorithm. We now use the upstream version of `golang/crypto`
    where the EAB MAC algorithm is hard-coded to HS256.

    This change were implemented in the cert-manager PRs [#3877][] and [#3936][].

[#3877]: https://github.com/cert-manager/cert-manager/pull/3877 "Deprecation of the keyAlgorithm field"
[#3936]: https://github.com/cert-manager/cert-manager/pull/3936 "Webhook warns the user when keyAlgorithm is used"

- If you happen to look at the cert-manager controller logs, you may see this
  new message about optimistic locking:

    ```
    I0419 controller.go:158] msg="re-queuing item due to optimistic locking on resource" error="Operation cannot be fulfilled on certificates.cert-manager.io   sauron-adverts-evo-app-tls: the object has been modified; please apply your changes to the latest version and try again"
    ```

    This message, shown at the `info` level, replaces the `error` level message
    that showed previously:

    ```
    E0419 controller.go:158] msg="re-queuing item due to error processing" error="Operation cannot be fulfilled on certificates.cert-manager.io sauron-adverts-evo-app-tls: the   object has been modified; please apply your changes to the latest version and try again"
    ```

    The goal is to prevent users from thinking that the optimistic locking
    mechanism has to do with their issues, when in reality it mostly isn't and is
    the normal operation mode for Kubernetes controllers.

    Fixed in the cert-manager PR [#3794][].

[#3794]: https://github.com/cert-manager/cert-manager/pull/3794 "Less alarming message on optimistic locking errors"

- The `util.UsageContentCommittment` (which contained a spelling mistake) was
  deprecated in favor of `util.UsageContentCommitment`. The only people impacted
  by this deprecation are the the people importing the Go package
  `github.com/jetstack/cert-manager/pkg/api/util`.

[#3860]: https://github.com/cert-manager/cert-manager/pull/3860 "Fix a spelling mistake in a cert-manager Go package and deprecate the old name"

- The webhook now panics when it is not able to register the API schemes.
  Previously, the webhook would silently skip the error and start.

[#4037]: https://github.com/cert-manager/cert-manager/pull/4037 "Webhook now panics instead of silently starting if the API scheme cannot be registered"

- A couple of legacy functions in `test/e2e/util` package have been removed.
  These functions can be found in the `test/unit/gen` package.

[#3873]: https://github.com/cert-manager/cert-manager/pull/3873 "Legacy functions in the test/e2e/util have been removed"

- The Kubernetes Go dependencies have been updated from `v0.19.0` to `v0.21.0`.

[#3926]: https://github.com/cert-manager/cert-manager/pull/3926 "Update Kubernetes Go imports from v0.19.0 to v0.21.0"

- When waiting for DNS propagating, the ACME DNS01 self-check now returns a
  better message when an unexpected DNS response code is received, such as
  `SERVFAIL`.

    Before:
    ```
    Could not find the start of authority
    ```

    After:
    ```
    Could not find the SOA record in the DNS tree
    for the domain '_acme-challenge.foo.example.com'
    using nameservers [8.8.8.8, 8.8.4.4]
    ```

    In addition to the above, you will get a new message when the DNS returns an
    unexpected response code:

    ```
    When querying the SOA record for the domain
    '_acme-challenge.foo.example.com' using nameservers
    [8.8.8.8, 8.8.4.4], rcode was expected to be 'NOERROR'
    or 'NXDOMAIN', but got 'SERVFAIL'
    ```

    Fixed in the cert-manager PR [#3906][].

[#3906]: https://github.com/cert-manager/cert-manager/pull/3906 "Better message when the ACME DNS01 self-check gets an unexpected DNS response code"

- The `distroless/static` base image was updated to the latest version as of
  2021-05-20.

## Honorable mentions

Tim Ramlot ([@inteon](https://github.com/inteon)) has done a fantastic job at
adding the Istio `VirtualService` support for HTTP01 challenges in
[#3724](https://github.com/cert-manager/cert-manager/pull/3724). It took an immense
effort to have this PR ready and merged for the 1.4 release.

After a lot of thinking, we have decided that trying to support every custom
resource for every proxy could not be done in-tree due to the Go dependency
weight that each integration adds. Jake Sanders proposed an [out-of-tree
approach](https://github.com/cert-manager/cert-manager/issues/3924) that will be
worked on as part of cert-manager 1.5.