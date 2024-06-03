---
title: trust-manager
description: 'Distributing Trust Bundles in Kubernetes'
---

trust-manager is the easiest way to manage trust bundles in Kubernetes and OpenShift clusters.

It orchestrates bundles of trusted X.509 certificates which are primarily used for validating
certificates during a TLS handshake but can be used in other situations, too.

## Overview

trust-manager is a small Kubernetes operator which aims to help reduce the overhead of managing
TLS trust bundles in your clusters.

It adds the `Bundle` custom Kubernetes resource (CRD) which can read input from various sources
and combine the resultant certificates into a bundle ready to be used by your applications.

trust-manager ensures that it's both quick and easy to keep your trusted certificates up-to-date
and enables cluster administrators to easily automate providing a secure bundle without having
to worry about rebuilding containers to update trust stores.

It's designed to complement cert-manager and works well when consuming CA certificates from a
cert-manager `Issuer` or `ClusterIssuer` but can be used entirely independently of cert-manager
if needed.

## Installation

See the [installation guide](./installation.md) for instructions on how to
install trust-manager.

## Usage

trust-manager is intentionally simple, adding just one new Kubernetes `CustomResourceDefintion`: `Bundle`.

A `Bundle` represents a set of X.509 certificates that should be distributed across a cluster.

All `Bundle`s are cluster scoped.

`Bundle`s comprise a list of `sources` from which trust-manager will assemble the final bundle, along with
a `target` describing how and where the resulting bundle will be written.

An example `Bundle` might look like this:

```yaml
apiVersion: trust.cert-manager.io/v1alpha1
kind: Bundle
metadata:
  name: my-org.com  # The bundle name will also be used for the target
spec:
  sources:
  # Include a bundle of publicly trusted certificates which can be
  # used to validate most TLS certificates on the internet, such as
  # those issued by Let's Encrypt, Google, Amazon and others.
  - useDefaultCAs: true

  # A Secret in the "trust" namespace; see "Trust Namespace" below for further details
  - secret:
      name: "my-db-tls"
      key: "ca.crt"

  # Here is another Secret source, but this time using a label selector instead of a Secret's name. 
  - secret:
      selector:
        matchLabels: 
          fruit: apple
      key: "ca.crt"

  # A ConfigMap in the "trust" namespace; see "Trust Namespace" below for further details
  - configMap:
      name: "my-org.net"
      key: "root-certs.pem"
  
  # Here is another ConfigMap source, but this time using a label selector instead of a ConfigMap's name. 
  - configMap:
      selector:
        matchLabels: 
          fruit: apple
      key: "ca.crt"

  # A manually specified string
  - inLine: |
      -----BEGIN CERTIFICATE-----
      MIIC5zCCAc+gAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
      ....
      0V3NCaQrXoh+3xrXgX/vMdijYLUSo/YPEWmo
      -----END CERTIFICATE-----
  target:
    # Sync the bundle to a ConfigMap called `my-org.com` in every namespace which
    # has the label "linkerd.io/inject=enabled"
    # All ConfigMaps will include a PEM-formatted bundle, here named "root-certs.pem"
    # and in this case we also request binary formatted bundles in JKS and PKCS#12 formats,
    # here named "bundle.jks" and "bundle.p12".
    configMap:
      key: "root-certs.pem"
    additionalFormats:
      jks:
        key: "bundle.jks"
      pkcs12:
        key: "bundle.p12"
    namespaceSelector:
      matchLabels:
        linkerd.io/inject: "enabled"
```

`Bundle` resources currently support several source types:

- `configMap` - a `ConfigMap` resource in the trust-manager namespace
- `secret` - a `Secret` resource in the trust-manager namespace
- `inLine` - a manually specified string containing at least one certificate
- `useDefaultCAs` - usually, a bundle of publicly trusted certificates

`ConfigMap` is the default target type, but as of v0.7.0 trust-manager also supports `Secret` resources as targets.

Support for `Secret` targets must be explicitly enabled in the trust-manager controller; see details below under "Enable Secret targets".

Both `ConfigMap` and `Secret` also support specifying label selectors to select multiple resources at once, which is useful in dynamic
environments where the name of the `ConfigMap` or `Secret` is known only at runtime. When adding a source, either of type `ConfigMap` or `Secret`, 
the fields `name` and `selector` are mutually exclusive: one **must** be set, but not both.


All sources and target options are documented in the trust-manager [API reference documentation](./api-reference.md).

#### Targets

All `Bundle` targets are written to `ConfigMap`s (and/or `Secret`s) whose name matches that of the
`Bundle`, and every target has a PEM-formatted bundle included.

Users can also optionally choose to write JKS/PKCS#12 formatted binary trust store(s) to targets.
JKS has been supported since v0.5.0, and PKCS#12 since v0.7.0.

Applications consuming JKS and PKCS#12 trust stores often require a password to be set for legacy reasons. These passwords are often security theater - either they use very weak encryption or the passwords are provided in plaintext next to the files they encrypt which defeats the purpose of having them.

Trust bundles do not contain private keys, and so for most use cases there wouldn't be any security benefit to encrypting them. As such, passwords for trust stores are set by default to `changeit` for JKS and `""` (the empty string or "password-less") for PKCS#12. 

Recent releases allow you to change that password by setting the bundle YAML file `spec.target.additionalFormats.jks.password` and `spec.target.additionalFormats.pkcs12.password`. 

Older releases have the current default values hard-coded and they can not be changed. For more information read [why password are not helpful](../../faq/README.md#keystore-passwords).



#### Namespace Selector

A target's `namespaceSelector` is used to restrict which Namespaces your `Bundle`'s target
should be synced to.

`namespaceSelector` supports the field `matchLabels`.

Please see [Kubernetes documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors)
for more information about how label selectors can be configured.

If `namespaceSelector` is empty, a `Bundle`'s target will be synced to all Namespaces.

> ⚠️ A future update to trust-manager **will** change this behavior so that an empty namespace selector will sync only
to the trust-manager namespace by default.

## Quick Start Example

Let's get started with an example of creating our own `Bundle`!

First we'll create a demo cluster:

```bash
git clone https://github.com/cert-manager/trust-manager trust-manager
cd trust-manager
make demo
```

Once we have a running cluster, we can create a `Bundle` using the default CAs which were configured
when trust-manager started up. Since we've installed trust-manager using Helm, our default CA package
contains publicly trusted certificates derived from a Debian container.

```bash
kubectl --kubeconfig ./bin/kubeconfig.yaml apply -f - <<EOF
apiVersion: trust.cert-manager.io/v1alpha1
kind: Bundle
metadata:
  name: example-bundle
spec:
  sources:
  - useDefaultCAs: true
  target:
    configMap:
      key: "trust-bundle.pem"
EOF
```

That was easy! Now let's check that everything synced OK and that our `ConfigMap` has been written:

```bash
kubectl --kubeconfig ./bin/kubeconfig.yaml get bundle example-bundle | less
kubectl --kubeconfig ./bin/kubeconfig.yaml get configmap example-bundle -o "jsonpath={.data['trust-bundle\.pem']}" | less
```

Great - we've got a trust bundle. We could use that for our containers right away but let's go a little further and
create a dummy "organization CA" which we'll want to include in our `Bundle`.

We'll generate our dummy organization certificate with cert-manager:

```bash
kubectl --kubeconfig ./bin/kubeconfig.yaml apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: trust-manager-selfsigned-issuer
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: trust-manager-example-ca
  namespace: cert-manager
spec:
  isCA: true
  commonName: trust-manager-example-ca
  secretName: trust-manager-example-ca-secret
  privateKey:
    algorithm: ECDSA
    size: 256
  issuerRef:
    name: trust-manager-selfsigned-issuer
    kind: ClusterIssuer
    group: cert-manager.io
EOF
```

Now let's check that `Secret` that cert-manager created for us:

```bash
kubectl --kubeconfig ./bin/kubeconfig.yaml get -n cert-manager secret trust-manager-example-ca-secret -o"jsonpath={.data['tls\.crt']}"   | base64 -d
# tls.crt will contain a PEM certificate, starting with -----BEGIN CERTIFICATE-----
```

> 🤔 Wondering why we used `tls.crt` and not `ca.crt`? More details [below](./README.md#preparing-for-production).

Finally, we'll update our `Bundle` to include our new private CA:

```bash
kubectl --kubeconfig ./bin/kubeconfig.yaml apply -f - <<EOF
apiVersion: trust.cert-manager.io/v1alpha1
kind: Bundle
metadata:
  name: example-bundle
spec:
  sources:
  - useDefaultCAs: true
  - secret:
      name: "trust-manager-example-ca-secret"
      key: "tls.crt"
  target:
    configMap:
      key: "trust-bundle.pem"
EOF
```

And we're done! The `example-bundle` `ConfigMap` should already be updated.

If you inspect the `ConfigMap` again, the last certificate you'll see in the list
should be our new dummy CA.

## Securely Maintaining A trust-manager Installation

If you choose the `useDefaultCAs` source on any of your `Bundle` resources, it's important that you keep your
default CA package image up to date. Failing to do so would be the equivalent of failing to run `apt-get upgrade ca-certificates`
when installing a public trust bundle in a Debian container.

trust-manager has been designed in such a way that any version of any default CA package should work with any
version of trust-manager which supports default CAs (`v0.4.0` and later). There should be no risk to the stability
of trust-manager from upgrading.

If you're using an official cert-manager-provided Debian CA package (which is the default), you should check which version you have
and compare against the [latest package version](https://quay.io/repository/jetstack/cert-manager-package-debian?tab=tags&tag=latest).

The version can be configured with the `.defaultPackageImage.tag` value on the Helm chart, and the version
is also written to the `status` field on any synced Bundle resource which uses the default CA package.

## Upgrading A Default CA Package Using Helm

Say we want to do an in-place upgrade of our default CA package to tagged version `XYZ` - without upgrading trust-manager.

We'll assume the Helm release is called "trust-manager" and that we've installed into the `cert-manager` namespace.

> ⚠️ This upgrade process assumes that it's the only thing running. If another user or process changes Helm values
> while you're doing this process, you might overwrite their work.

First, we'll dump our current Helm values, so we don't lose them:

```bash
helm get values -n cert-manager trust-manager -oyaml > values.yaml
```

Next, if `defaultPackageImage.tag` is already set in `values.yaml`, update it. Otherwise, add it.
You can find the available tags [on `quay.io`](https://quay.io/repository/jetstack/cert-manager-package-debian?tab=tags&tag=latest).

```yaml
# values.yaml
...
defaultPackageImage:
  tag: XYZ
```

These versions of the default package image tags are derived directly from the version of the `ca-certificates` package in Debian.

Finally, apply back the changes, being sure to manually specify the version of trust-manager which is installed, to avoid
also updating the trust-manager controller at the same as the default CA package:

```bash
# Get the currently installed version. You could do this manually if you find that easier.
TRUST_MANAGER_VER=$(helm list --filter "^trust-manager$" -n cert-manager -ojson | jq -r ".[0].app_version")

# Check the version makes sense
echo $TRUST_MANAGER_VER

# Run the upgrade
helm upgrade -f values.yaml -n cert-manager trust-manager jetstack/trust-manager --version $TRUST_MANAGER_VER
```

If an incorrect tag is used, your deployment will fail and you'll likely need to use `helm rollback` to get back
to a working state.

## Preparing for Production

TLS can be complicated and there are many ways to misuse TLS certificates.

Here are some potential gotchas to be aware of before running trust-manager in production.

If you're planning on running trust-manager in production and you're using more than just the default CA package,
we **strongly** advise you to read and understand this section. It could save you from causing an outage later.

> ℹ️ These gotchas aren't specific to trust-manager and you could run into any of them with any method of managing TLS trust!

### Bundling Intermediates

If you've ever used a Let's Encrypt client such as [Certbot](https://certbot.eff.org/) you'll probably have
seen that it generates several certificate files, such as `cert.pem`, `chain.pem`, and `fullchain.pem`.

These various files are provided to support various different applications, which might require the certificate
and the chain to be given separately. For most users and applications `fullchain.pem` is the only correct choice.

Unfortunately the existence of these files has the unfortunate side effect of people sometimes assuming that `cert.pem`
is the correct choice even when `fullchain.pem` would be correct. This means that the rest of the chain will not
be sent when the certificate is used.

Often, a quick fix that _seems_ to work for this is that clients add the chain to their trust store, which will seem
to fix certificate errors in the short term. It's easy for this kind of "fix" to end up being embedded somewhere as a
solution which others can follow.

This "fix" is dangerous; it means that the intermediate cannot be safely rotated without all trust stores
which contain it being updated first.

Intermediates in this case become _de facto_ root certificates, which completely defeats the point of having
intermediate certificates in the first place.

Avoid using intermediates in any trust store wherever possible unless you're absolutely certain they should be included.
An example of where it might be OK would be cross signing, which is not likely to be required in the general case.

It would be better to copy just the root certificate to a new `ConfigMap` and use that as a source rather than trusting
an intermediate.

### cert-manager Integration: `ca.crt` vs `tls.crt`

If you're pointing trust-manager at a `Secret` containing a cert-manager-issued certificate, you'll see two relevant
fields: `ca.crt` and `tls.crt`. (We're ignoring `tls.key` - trust-manager definitely doesn't need to access that)

That leads to an obvious question: between `ca.crt` and `tls.crt`, which should I use for trust-manager?

Unfortunately, it's impossible to say in the general case which field is correct to use, but we can provide guidelines.

`tls.crt` will generally contain multiple certificates which may not all be issuers and some of which are likely to be
intermediate certificates. If that's the case, you shouldn't use `tls.crt` as a source. (See "Bundling Intermediates" above for details.)

`ca.crt` might then seem like the more generally correct choice but it's important to bear in mind that it can only ever
be populated on a best-effort basis. The contents of `ca.crt` depend on the `Issuer` being configured correctly, and some
issuer types may not ever be able to provide a useful or correct entry for this field.

As a rule, you should prefer to create `Bundles` exclusively using root certificates (again, see above), and so you should
only use whichever field has a single root certificate in it. Consider reading below about why you might not want to
actually rely directly on cert-manager-issued certificates.

### cert-manager Integration: Intentionally Copying CA Certificates

It's very strange in the Kubernetes world to suggest intentionally adding a step which seems to make automating infrastructure
harder, but in the case of TLS trust stores it can be a wise choice.

Say you have a cert-manager `Issuer` which has the root certificate you want to trust in `ca.crt`. It's tempting to
use the `Secret` directly and point at `ca.crt`, but a best practice would be to copy that root into a separate `ConfigMap`
(or `Secret`).

The reason is - as with many TLS gotchas - certificate rotation. If you rotate your issuer such that it's issued from a new root
certificate, trust-manager will see the `Secret` be updated and automatically update your trust bundle to include the new root -
immediately distrusting the old root.

That means that if any services were still using a certificate issued by the old root, they'll be distrusted and will break.

Rotation requires that both root certificates are trusted simultaneously for a period, or else that all issued certificates
are rotated either before or at the same time as the old root.

## Known Issues

### `kubectl describe`

The `useDefaultCAs` option hits a corner case inside `kubectl describe` and is rendered as `Use Default C As:  true`. This is
purely cosmetic.
