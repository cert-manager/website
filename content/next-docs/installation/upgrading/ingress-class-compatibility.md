---
title: Notes on Ingress Class Compatibility
description: 'cert-manager installation: Notes on ingress classes and safe upgrades'
---

In cert-manager v1.5.4 we made a change to the HTTP-01 code which was not backwards compatible.
See [Regression: HTTP-01 challenges fail with Istio, Traefik, ingress-gce and Azure AGIC].

[Regression: HTTP-01 challenges fail with Istio, Traefik, ingress-gce and Azure AGIC]: https://github.com/cert-manager/cert-manager/issues/4537

In v1.5.5, v1.6.2 and 1.7.1 we fixed this problem.

If you have cert-manager v1.5.3 (or below) you should skip v1.5.4 and instead:

- upgrade to v1.5.5
- then the newest version of cert-manager 1.6
- and then the newest version of cert-manager 1.7

and you can ignore the rest of this document.

The following notes apply to anyone upgrading from cert-manager v1.5.4, v1.6.0, v1.6.1 on Kubernetes v1.19 or later.

# Background

cert-manager 1.5 was released to coincide with Kubernetes 1.22, which
[removed](https://kubernetes.io/blog/2021/07/14/upcoming-changes-in-kubernetes-1-22/) the `v1beta1`
Ingress API. As cert-manager creates Ingress resources to solve HTTP-01 challenges, this code path
needed to be updated.

In the `v1beta1` spec, Ingress Class was a string annotation that was adopted by all popular
Ingress controllers by convention. In the `v1` spec, `IngressClass` is now its own resource type,
and the `.spec.ingressClassName` field on `v1` Ingresses is now a reference to that object.
As the Kubernetes documentation points out, the old and new specs are not directly equivalent.

During the 1.5 and 1.6 cert-manager release cycles, we discovered that ingress controllers have
handled the graduation of Ingress to `v1` differently. Some treat the class as an opaque string,
similarly to the annotation. Some were unintentionally broken, as their default ingress class name
contains characters that are disallowed in object references, e.g. (`/`). Some now require you to
create an `IngressClass` object matching the field to work.

cert-manager aims to be compatible with as many ingress controllers as possible. According to the
Ingress v1 [Kubernetes enhancement proposal], the deprecated annotation, if present, takes
precedence over the new field. From our perspective, the option that maintains the highest
compatibility is to only use the annotation, even when creating `v1` Ingresses.

[Kubernetes enhancement proposal]: https://github.com/kubernetes/enhancements/tree/44dd2975dc6cdad96ca73e7b0ba1794f1196f604/keps/sig-network/1453-ingress-api#interoperability-with-previous-annotation

# Notes For Specific Ingress Controllers

## ingress-nginx

If you chose not to use the IngressClass `nginx` that is created by default by the Helm chart
(e.g., you named the IngressClass `nginx-outside`), you will need to add the flags
`--ingress-class` and `--ingress-class-by-name` to your ingress-nginx deployment:

```
--ingress-class=nginx-outside --ingress-class-by-name=true
```

In case you are using the Helm chart, you will need to use at least these values:

```yaml
ingressClassResource:
  name: nginx-outside
  controllerValue: k8s.io/ingress-nginx-outside
ingressClassByName: true
ingressClass: nginx-outside
```

## Istio

If you are using Istio and you had to create an IngressClass while migrating to cert-manager 1.5 or 1.6
and you chose to create an IngressClass that isn't named `istio` (e.g., you named it `istio-internal`),
you will need to change the `class` field on those Issuers back to `istio`.

## Traefik

If you are using Traefik and you had to create an IngressClass while migrating to cert-manager 1.5
or 1.6 and the IngressClass you created isn't named `traefik` (for example, you called
the IngressClass `traefik-external`), you will need to add a command-line argument to your
Traefik deployment:

```
--providers.kubernetesingress.ingressclass=traefik-external
```

## Ambassador

If you are using Ambassador and you had to create an IngressClass while migrating to
cert-manager 1.5 or 1.6, and the IngressClass you created isn't named `ambassador`
(e.g., `ambassador-internal`), you will need to change the `class` field on the affected Issuers back to `ambassador`.
