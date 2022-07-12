---
title: Release 1.5
description: 'cert-manager release notes: cert-manager v1.5'
---

## v1.5.5

### Changelog since v1.5.4

In 1.5.5, we have reverted a change that caused a regression in the ACME Issuer.
Before 1.5.4, the Ingress created by cert-manager while solving an HTTP-01 challenge contained the `kubernetes.io/ingress.class` annotation:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: istio # The `class` present on the Issuer.
```
In 1.5.4, the Ingress does not contain the annotation anymore. Instead, cert-manager uses the `ingressClassName` field:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
spec:
  ingressClassName: istio # 🔥 Breaking change!
```

This broke many users that either don't use an Ingress controller that supports the field (such as ingress-gce and Azure AGIC), as well as people who did not need to create an IngressClass previously (such as with Istio and Traefik).

The regression is present in cert-manager 1.5.4, 1.6.0, 1.6.1. It is only present on Kubernetes 1.19+ and only appears when using an Issuer or ClusterIssuer with an ACME HTTP-01 solver configured.

In 1.5.5, we have restored the original behavior which is to use the annotation. We will also backport this fix to 1.5.5 and 1.6.2, allowing people to upgrade safely.

Most people won't have any trouble upgrading from a version that contains the regression to 1.7.0, 1.6.2 or 1.5.5. If you are using Gloo, Contour, Skipper, or kube-ingress-aws-controller, you shouldn't have any issues. If you use the default "class" (e.g., `istio` for Istio) for Traefik, Istio, Ambassador, or ingress-nginx, then these should also continue to work without issue.

If you are using Traefik, Istio, Ambassador, or ingress-nginx _and_ you are using a non-default value for the class (e.g., `istio-internal`), or if you experience any issues with your HTTP-01 challenges please read the [notes on Ingress v1 compatibility].

[notes on Ingress v1 compatibility]: https://cert-manager.io/docs/installation/upgrading/ingress-class-compatibility/

#### Bug or Regression

- Fixed a regression where cert-manager was creating Ingresses using the field `ingressClassName` instead of the annotation `kubernetes.io/ingress.class`. More details about this regression are available [in the 1.7 release notes](https://cert-manager.io/next-docs/release-notes/release-notes-1.7/#ingress-class-semantics). ([#4783](https://github.com/cert-manager/cert-manager/pull/4783), [@maelvls](https://github.com/maelvls))

#### Other (Cleanup or Flake)

- cert-manager now does one call to the ACME API instead of two when an Order fails. This belongs to the effort towards mitigating [the high load](https://github.com/cert-manager/cert-manager/issues/3298) that cert-manager deployments have on the Let's Encrypt API ([#4618](https://github.com/cert-manager/cert-manager/pull/4618), [@irbekrm](https://github.com/irbekrm))

## v1.5.4

### Changelog since v1.5.3

#### Bug or Regression

- Fixed a bug that caused cert-manager to panic when the Vault Issuer failed to reach the health endpoint. ([#4476](https://github.com/cert-manager/cert-manager/pull/4476), [@JoshVanL](https://github.com/JoshVanL))
- Helm chart: the post-install hook `startupapicheck` is now compatible with the PodSecurityPolicy resource. ([#4432](https://github.com/cert-manager/cert-manager/pull/4432), [@ndegory](https://github.com/ndegory))
- Helm chart: the post-install hook `startupapicheck` now deletes any post-install hook resources left after a previous failed install allowing `helm install` to be re-run after a failed attempt. ([#4435](https://github.com/cert-manager/cert-manager/pull/4435), [@wallrj](https://github.com/wallrj))

#### Other (Cleanup or Flake)

- Update cert-manager base image versions ([#4479](https://github.com/cert-manager/cert-manager/pull/4479), [@SgtCoDFish](https://github.com/SgtCoDFish))

## v1.5.3

### Changelog since v1.5.2

#### Bug or Regression

- Fix a bug where a Certificate may not get renewed when the issued Certificate has a one-second skew between `notBefore` and `notAfter` and `spec.duration` is not used. This one-second skew can be observed on certificates issued with Let's Encrypt and caused a mismatch in time precision between the time stored in `status.renewalTime` and the time internally computed by cert-manager. ([#4403](https://github.com/cert-manager/cert-manager/pull/4403), [@irbekrm](https://github.com/irbekrm)). Thanks to [@mfmbarros](https://github.com/mfmbarros) for help with debugging the issue!

## v1.5.2

### Changelog since v1.5.1

#### Bug or Regression

- Fix a regression introduced in v1.5.0 where the Ingress created for solving HTTP-01 challenges was created with `pathType: Exact` instead of `pathType: ImplementationSpecific`. ([#4385](https://github.com/cert-manager/cert-manager/pull/4385), [@jakexks](https://github.com/jakexks))
- Fixed the HTTP-01 solver creating ClusterIP instead of NodePort services by default. ([#4394](https://github.com/cert-manager/cert-manager/pull/4394), [@jakexks](https://github.com/jakexks))
- Helm chart and static manifest: the pointless `status` field is now stripped from the CRD manifests. ([#4387](https://github.com/cert-manager/cert-manager/pull/4387), [@irbekrm](https://github.com/irbekrm))

## v1.5.1

The CRDs for the cert-manager v1beta1 API were mistakenly changed in cert-manager v1.5.0. If you
installed the CRDs for v1.5.0, you should upgrade your CRDs to v1.5.1.

The only affected API version is v1beta1, so if you're using the latest version - v1 - you won't
be affected by the CRD changes. It's worth upgrading to v1 in any case, since v1alpha2, v1alpha3 and
v1beta1 are all deprecated and will be removed in a future release.

### Changelog since v1.5.0

#### Bug or Regression

- Fix `v1beta1` CRDs which were accidentally changed in cert-manager v1.5.0 ([#4355](https://github.com/cert-manager/cert-manager/pull/4355), [@SgtCoDFish](https://github.com/SgtCoDFish))

## v1.5.0

### Major Themes

#### API Deprecation

The recent Kubernetes 1.22 release has removed a number of deprecated APIs. You
can read the official blog post [Kubernetes API and Feature Removals In
1.22](https://kubernetes.io/blog/2021/07/14/upcoming-changes-in-kubernetes-1-22/)
to learn more about it. If you intend to upgrade to Kubernetes 1.22, you
**must** upgrade to cert-manager 1.5.

To keep compatibility with older Kubernetes versions (down to 1.16),
cert-manager 1.5 is now compatible with both Ingress `v1` and `v1beta1`.
cert-manager will default to using `v1` Ingress, and fall back to `v1beta1` when
`v1` is not available.

Please read the [Ingress class compatibility](../installation/upgrading/ingress-class-compatibility.md)
notes to see if your Ingress controller has any known issues.

Additionally, the cert-manager API versions `v1alpha2`, `v1alpha3` and `v1beta1`
are now deprecated, and will be removed in cert-manager 1.7. Please change all
your YAML manifests that use a deprecated API version to use
`cert-manager.io/v1` instead, and re-apply them.

These deprecation changes have been implemented in the cert-manager PRs
[#4225](https://github.com/cert-manager/cert-manager/pull/4225) and
[#4172](https://github.com/cert-manager/cert-manager/pull/4172).

### Experimental Features

Features that we are currently working on are included in cert-manager releases
but disabled by default, as they are likely to change in future. If any of them
look interesting to you, please try them out and report bugs or quirks in a
GitHub Issue.

#### Gateway API

We have seen many requests from users to support different ways of routing HTTP
traffic into their clusters for solving ACME HTTP-01 challenges. As the
cloud-native ecosystem has so many different ingress implementations, we
searched for a solution that would avoid having to add individual support for
every kind of virtual service to the cert-manager API, and settled on the
[sig-network Gateway API](https://gateway-api.sigs.k8s.io/).

The Gateway API project aims to provide a universal API for modeling service
networking in Kubernetes, and while it is still in its alpha stages is already
gaining [wide
adoption](https://gateway-api.sigs.k8s.io/references/implementations/). By
supporting the Gateway API HTTPRoute resource, we hope that anyone using
Ambassador, Contour, Gloo, HAProxy, Istio, Kong or Traefik will be able to solve
HTTP-01 challenges, with more implementations coming in future.

To go along with the HTTPRoute resource support, we have also added a
gateway-shim controller that will allow users to annotate their Gateway
resources to get a cert-manager Certificate automatically created, similar to
the current ingress-shim functionality.

Implemented in the cert-manager PRs
[#4276](https://github.com/cert-manager/cert-manager/pull/4276) and
[#4158](https://github.com/cert-manager/cert-manager/pull/4158).

#### CertificateSigningRequests

CertificateSigningRequest is a built-in Kubernetes resource that was originally
aimed at requesting X.509 client certificates and serving certificates for
Kubernetes components such as kubelet.

We have seen a rising interest in using the CertificateSigningRequest (CSR)
resource as a way to provision workload certificates in service meshes such as
Istio and its [Istio Custom CA Integration using Kubernetes
CSR](https://istio.io/latest/docs/tasks/security/cert-management/custom-ca-k8s/).
For that purpose, the CSR resource needs to be integrated with existing signers
such as HashiCorp Vault or Venafi TPP.

Back in cert-manager 1.4, the CA Issuer became the first built-in cert-manager
issuer to support signing CertificateSigningRequest resources. In 1.5, we
extended the support to all existing Issuers.

The support for signing CSR resources is still experimental and requires to be
explicitly enabled. If you are interested, please take a look at the [Kubernetes
CertificateSigningRequest](https://cert-manager.io/docs/usage/kube-csr/)
documentation on the cert-manager website.

To help you try the CSR support, you may want to try a new command that was
added to the kubectl plugin. It allows you to create a CSR resource out of a
cert-manager Certificate manifest:

```shell
kubectl cert-manager x create certificatesigningrequest example-csr certificate.yaml
```

Finally, we decided to remove the annotation `experimental.cert-manager.io/ca`
that was added to the CertificateSigningRequest resource after being signed by
cert-manager. This annotation was introduced in cert-manager 1.4 and will no
longer be set on CertificateSigningRequest resources. We removed this annotation
due to a technical limitation related to the fact that Kubernetes resources have
a status subresource that is separate from the main resource.

The above features were implemented in the cert-manager PRs
[#4112](https://github.com/cert-manager/cert-manager/pull/4112),
[#4100](https://github.com/cert-manager/cert-manager/pull/4100),
[#4103](https://github.com/cert-manager/cert-manager/pull/4103),
[#4108](https://github.com/cert-manager/cert-manager/pull/4108),
[#4106](https://github.com/cert-manager/cert-manager/pull/4106), and
[#4143](https://github.com/cert-manager/cert-manager/pull/4143)

### User Experience

#### kubectl plugin

cert-manager comes with a kubectl plugin, `kubectl cert-manager`, that comes in
handy for checking the status of your cert-manager Certificate resources.

In 1.5, a new experimental command for installing cert-manager has been added.
Under the hood, it uses the cert-manager Helm chart. This means that all helm
templating options are also supported by this install command:

```bash
kubectl cert-manager x install \
  --set prometheus.enabled=false \  # Example: disabling prometheus using a Helm parameter
  --set webhook.timeoutSeconds=4s   # Example: changing the wehbook timeout using a Helm parameter
```

An interesting feature that comes when using with this new `install` command is
that it installs the CRDs in a way that prevents `helm uninstall` from deleting
the CRDs while uninstalling cert-manager.

The plugin is now capable of determining when your cert-manager deployment is
ready to be used:

```shell
kubectl cert-manager check api
```

The plugin also learned how to discover the version of cert-manager running on your
cluster, similar to `kubectl version`:

```shell
kubectl cert-manager version
```

To install the plugin, check out the [Kubectl
plugin](https://cert-manager.io/next-docs/installation/kubectl-plugin/) page on
the cert-manager website.

These features were implemented by Tim in the cert-manager PRs
[#4226](https://github.com/cert-manager/cert-manager/pull/4226),
[#4205](https://github.com/cert-manager/cert-manager/pull/4205), and
[#4138](https://github.com/cert-manager/cert-manager/pull/4138).

#### Helm chart

While installing cert-manager using Helm, you might have noticed that the
`--wait` flag does not wait until cert-manager is fully functional.

With 1.5, the `--wait` flag now works as you would expect. The Helm chart now
comes with a small startup job that waits until the cert-manager API becomes
ready.

Implemented in the cert-manager PR
[#4234](https://github.com/cert-manager/cert-manager/pull/4234) by Tim.

#### Labels and annotations on generated Secret and CertificateRequest resources

cert-manager now allows you to add custom annotations and labels to the Secret
containing the TLS key pair using the new Certificate field `secretTemplate`.
This is useful when using third-party solutions such as
[kubed](https://github.com/kubeops/kubed) to copy Secret resources to multiple
namespaces. The `secretTemplate` is synced to the Secret when the Certificate is
created or renewed.

Here is an example of Certificate using the `secretTemplate` field:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
spec:
  secretTemplate:
    annotations:
      my-secret-annotation: "foo"
    labels:
      my-secret-label: bar
```

Note that labels and annotations can only be added or replaced, but not removed.
Removing any labels or annotations from the template or removing the template
itself will have no effect.

Along with the ability to set your own annotations and labels on Secret
resources created by cert-manager, you can also tell cert-manager which
annotations should be copied from Certificate resources to the generated
CertificateRequest resources. By default, cert-manager will skip copying the
annotations with the following prefixes:

- `kubectl.kubernetes.io/`,
- `fluxcd.io`,
- `argocd.argoproj.io`.

If you wish to keep the old behavior and allow all annotations to be copied, you
can pass the flag `--copied-annotations=*` to the cert-manager controller.

Implemented in the cert-manager PRs
[#3828](https://github.com/cert-manager/cert-manager/pull/3828) and
[#4251](https://github.com/cert-manager/cert-manager/pull/4251).

### Community

This is the first time that cert-manager participated in Google Summer of Code.
Congratulations to [Arsh](https://github.com/RinkiyaKeDad) and
[Tim](https://github.com/inteon) for completing their GSoC projects! We hope you
both continue to contribute in future.

Thanks again to all open-source contributors with commits in this release:

- [alrs](https://github.com/alrs)
- [annerajb](https://github.com/annerajb)
- [Dean-Coakley](https://github.com/Dean-Coakley)
- [francescsanjuanmrf](https://github.com/francescsanjuanmrf)
- [inteon](https://github.com/inteon)
- [jonathansp](https://github.com/jonathansp)
- [kit837](https://github.com/kit837)
- [longkai](https://github.com/longkai)
- [mozz-lx](https://github.com/mozz-lx)
- [RinkiyaKeDad](https://github.com/RinkiyaKeDad)
- [tamalsaha](https://github.com/tamalsaha)
- [thiscantbeserious](https://github.com/thiscantbeserious)
- [ulrichgi](https://github.com/ulrichgi)
- [wpjunior](https://github.com/wpjunior)

Also thanks to [coderanger](https://github.com/coderanger) for helping people
out on the Slack `#cert-manager` channel; it's a huge help and much appreciated.



---

#### New Features

- cert-manager now supports using Ed25519 private keys and signatures for
  Certificates. Implemented in the cert-manager PR
  [#4079](https://github.com/cert-manager/cert-manager/pull/4079).
- cert-manager now emits an event when a CertificateSigningRequest resource has
  not yet been approved. Without this event, the user would never know that
  cert-manager is waiting for the approval of the CertificateSigningRequest
  resource. Implemented in the cert-manager PR
  [#4229](https://github.com/cert-manager/cert-manager/pull/4229).
- cert-manager now only supports the version `v1` of the `AdmissionReviewVersion`
  and `ConversionReviewVersion` resources, both available since Kubernetes 1.16.
  The `v1beta1` version is no longer supported by cert-manager. This change was
  implemented in the cert-manager PRs
  [#4254](https://github.com/cert-manager/cert-manager/pull/4254) and
  [#4253](https://github.com/cert-manager/cert-manager/pull/4253).
- cert-manager now restarts more quickly by clearing the leader election before
  shutting down. Also, upon shutdown, the controller loops now cleanly stop,
  which allows all in-flight reconciliation functions to finish before exiting.
  Implemented in the cert-manager PR
  [#4243](https://github.com/cert-manager/cert-manager/pull/4243).
- Metrics: a new metric, named `clock_time_seconds` was added; this metric
  allows for monitoring systems that do not have a built-in time function (e.g.
  DataDog) to calculate the number of seconds until a certificate expires by
  subtracting this metric from the existing `certificate_expiration_timestamp`
  metrics. Implemented in the cert-manager PR
  [#4105](https://github.com/cert-manager/cert-manager/pull/4105).
- Helm chart: the Prometheus scraping service port now has a name. Implemented
  in the cert-manager PR
  [#4072](https://github.com/cert-manager/cert-manager/pull/4072).
- Helm chart: you can now configure the labels for the cert-manager-webhook
  service using the Helm value `webhook.serviceLabels`. Implemented in the
  cert-manager PR [#4260](https://github.com/cert-manager/cert-manager/pull/4260).

#### Bug or Regression

- Security: cert-manager now times out after 10 second when performing the
  self-check while solving HTTP-01 challenges. Fixed in the cert-manager PR
  [#4311](https://github.com/cert-manager/cert-manager/pull/4311).
- Cloudflare: Refactored DNS01 challenge to use API for finding the nearest Zone
  (fixing potential DNS issues)
  ([#4147](https://github.com/cert-manager/cert-manager/pull/4147),
  [@thiscantbeserious](https://github.com/thiscantbeserious))
- Fix a bug where failed CertificateRequest resources were not retried
  ([#4130](https://github.com/cert-manager/cert-manager/pull/4130),
  [@irbekrm](https://github.com/irbekrm))
- Fix a regression that would lead to a Certificate becoming "Failed" when the
  issued X.509 certificate's subject DN would be equal to the issuer's subject
  DN. Fixed in the cert-manager PR
  [#4237](https://github.com/cert-manager/cert-manager/pull/4237).
- Fix a regression where the `tls.crt` certificate chain would unexpectedly not
  contain an intermediate CA certificate when no root CA is available in the CA
  chain returned by the issuer. This bug affected the Vault Issuer, Venafi
  Issuer and CA Issuer. This bug was fixed in the cert-manager PR
  [#4261](https://github.com/cert-manager/cert-manager/pull/4261).
- Fix a goroutine leak that was causing the controller's memory usage to grow
  with time. Fixed in the cert-manager PR
  [#4233](https://github.com/cert-manager/cert-manager/pull/4233).
- Fix a race condition introduced in cert-manager 0.15 that would crash
  cert-manager for clusters with a large number of certificates. Fixed in the
  cert-manager PR [#4231](https://github.com/cert-manager/cert-manager/pull/4231).
- Fix a bug where the default renewal duration of certificate, set to 30 days,
  would clash with the duration of certificates issued by the Vault Issuer. All
  Certificate resources are now renewed 2/3 through the duration unless a custom
  renew period is specified by setting `renewBefore` on the Certificate. Fixed
  in the cert-manager PR
  [#4092](https://github.com/cert-manager/cert-manager/pull/4092).
- The cert-manager binaries, including the kubectl plugin, now exit with the
  correct exit code on SIGINT (Ctrl+C) and SIGTERM events. More specifically,
  when one of these events is caught, cert-manager will exit with the code 128 +
  signal number. Fixed in
  [#4230](https://github.com/cert-manager/cert-manager/pull/4230).
- The static manifests available on the GitHub Releases page now contain a
  version label `app.kubernetes.io/version: v1.5.0`. We also removed the
  Helm-specific labels from the static manifests. Fixed in the cert-manager PR
  [#4190](https://github.com/cert-manager/cert-manager/pull/4190).

#### Other (Cleanup or Flake)

- A conformance end-to-end testing suite was added for the
  CertificateSigningRequest resources
  ([#4101](https://github.com/cert-manager/cert-manager/pull/4101)).
- Reduce binary sizes from 74MB down to 49MB by adding the Go ldflag `-w`
  ([#4181](https://github.com/cert-manager/cert-manager/pull/4181)).