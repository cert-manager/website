---
title: "Release Notes"
linkTitle: "v1.4"
weight: 800
type: "docs"
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

### Upgrading cert-manager CRDs and stored versions of cert-manager custom resources

We have deprecated the following cert-manager APIs:

- `cert-manager.io/v1alpha2`
- `cert-manager.io/v1alpha3`
- `cert-manager.io/v1beta1`
- `acme.cert-manager.io/v1alpha2`
- `acme.cert-manager.io/v1alpha3`
- `acme.cert-manager.io/v1beta1`

These APIs will be removed in cert-manager 1.6.

{{% pageinfo color="warning" %}}

⛔️  If you are upgrading cert-manager on a cluster which has previously had
cert-manager < `v1.0.0`, you **must** take steps to upgrade all cert-manager
custom resources which were created by you or by cert-manager < `v1.0.0`.

Such custom resources may still be stored in `etcd` as `v1alpha2` resources and
when that version of the API is removed in cert-manager 1.6, they will become
unreadable.

To work around this, you need to force them to be converted by the cert-manager
conversion webhook. And the simplest way to do that is to perform a no-change
update on all cert-manager custom resources.

This is explained in more detail in the [Upgrading existing cert-manager
resources][upgrade-resources] page.

{{% /pageinfo %}}

[upgrade-resources]: ../../installation/upgrading/remove-deprecated-apis/#upgrading-existing-cert-manager-resources

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

{{% pageinfo color="warning" %}}

⛔️  If you are using custom containers that run as root with the Helm chart, you
will need to set this back to `false`.

{{% /pageinfo %}}

### CA, Vault and Venafi issuer handling of `ca.crt` and `tls.crt`

The CA, Vault, and Venafi issuer now produce a `tls.crt` that is de-duplicated,
in the correct order (leaf at the top, issuing certificate at the bottom) and
verified (i.e. each signature can be verified).

The CA issuer now produces a `ca.crt` that contains the "most" root CA that
cert-manager is aware of. `ca.crt` may thus not be the actual self-signed root
CA, since cert-manager may not be aware of it.

[#3982]: https://github.com/jetstack/cert-manager/pull/3982 "All issuers + Vault issuer"
[#3983]: https://github.com/jetstack/cert-manager/pull/3983 "Venafi issuer"
[#3985]: https://github.com/jetstack/cert-manager/pull/3985 "CA issuer"

{{% pageinfo color="warning" %}}

⛔️  You may need to adjust systems that consume the `ca.crt` from Secrets
managed by cert-manager with the CA issuer.

{{% /pageinfo %}}


### Vault renewal bug

The renewal behavior has changed when a Certificate has a `duration` value of
more than 90 days and `renewBefore` has not been set.

Previously, the Certificate was renewed 30 days before expiry; now, the renewal
happens 2/3 through the duration.

This change was necessary to fix a bug where users of the Vault issuer would see
a clash between the default renewal duration of 30 days and the duration of
certificates issued by the Vault PKI.

{{% pageinfo color="warning" %}}

⛔️  If you were relying on the default renewal happening 30 days before expiry,
we would advise setting `renewBefore` to 30 days (`720h`) to keep the old
behavior.

{{% /pageinfo %}}

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
page](../../usage/kube-csr/).

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
  loadBalancerIP: 85.78.90.100
  url:
    host: 85.78.90.100
```

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

### Akamai issuer

The Akamai issuer has been
[updated](https://github.com/jetstack/cert-manager/pull/4007) to use the v2 of
the `OPEN EdgeGrid` Go package.

## Bug Fixes

- The [RFC2136](https://cert-manager.io/docs/configuration/acme/dns01/rfc2136/)
  issuer is now able to handle DNS01 challenges that map to multiple `TXT`
  records. This lets you create Let's Encrypt certificates using RFC2136 with
  multiple DNS names.
- The comparison function `PublicKeysEqual` is now correct for public keys.
- The ACME issuer now works correctly with Certificates that have a long name
  (52 characters or more). These Certificates would not get renewed due to
  non-unique `Order` names being generated.
- Orders that are used with a misbehaving ACME server should not get stuck
  anymore. By misbehaving, we mean an ACME server that would validate the
  authorizations before having set the status of the order to "ready".
- The internal signers now set the condition `Ready=False` with the reason
  `RequestDenied` when a CertificateRequest is `Denied`. This is to keep the
  same behavior where a terminal state of a CertificateRequest should have a
  `Ready` condition.

## Honorable mentions

Tim Ramlot ([@inteon](https://github.com/inteon)) has done a fantastic job at
adding the Istio `VirtualService` support for HTTP01 challenges in
[#3724](https://github.com/jetstack/cert-manager/pull/3724). It took an immense
effort to have this PR ready and merged for the 1.4 release.

After a lot of thinking, we have decided that trying to support every custom
resource for every proxy could not be done in-tree due to the Go dependency
weight that each integration adds. Jake Sanders proposed an [out-of-tree
approach](https://github.com/jetstack/cert-manager/issues/3924) that will be
worked on as part of cert-manager 1.5.
