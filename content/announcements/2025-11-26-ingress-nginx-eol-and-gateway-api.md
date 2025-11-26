---
slug: ingress-nginx-eol-and-gateway-api
title:
  "Ingress-nginx End-of-Life: What cert-manager Supports Today and What's Coming"
description:
  A look at the current state of cert-manager's support for the Gateway API with
  regards to ingress-nginx and InGate end-of-life.
date: '2025-11-26T12:00:00Z'
---

## TL;DR

- ingress-nginx and InGate will reach EOL in March 2026, but it is unclear to
  cert-manager users what's possible today and what will only be possible once
  `XListenerSet` is supported.
- cert-manager is not yet ready to give multi-tenant Ingress controller users
  (ingress-nginx, InGate, etc.) the same TLS self-service they had on Ingress
  when migrating to Gateway API.
- The missing piece is Gateway API's experimental `XListenerSet` resource, which
  restores per-team TLS configuration on a shared Gateway.
- cert-manager will add experimental `XListenerSet` support in1.20, targeted
  for 10 February 2026, with alpha builds in January 2026.

## Why migrating from multi-tenant Ingress is tricky

Most Ingress users today run their Ingress controller in a multi-tenant manner.
This includes ingress-nginx and InGate controllers. By multi-tenant Ingress
controller, we mean:

- one shared controller or proxy per cluster managed by the platform team,
- each team manages its own Ingress and TLS annotations,
- cert-manager issues certificates automatically per hostname.

With Gateway API, the TLS configuration moves to the Gateway resource:
developers can create `HTTPRoute`s, but they cannot safely modify the shared
`Gateway` owned by the platform team. So they lose TLS self-service, and every
TLS change becomes a ticket, as shown in the following diagram:

![Before, with Ingress, App Developers can configure TLS on their own. After, with Gateway, App Developers need to ask the Cluster Operator for the TLS configuration to be added to the Gateway.](/images/announcements/2025-11-26-ingress-nginx-eol-and-gateway-api/migrating-without-listenerset.svg)

This represents a change in the self-service experience compared to today's
Ingress workflows. While this may seem like a step backward for developer
velocity, the Gateway API design intentionally addresses a security concern with
the Ingress API: nothing prevents one team from accidentally or maliciously
capturing traffic intended for another team by creating an Ingress with the same
hostname but different TLS configuration. This often happens in larger clusters
with many teams, where conflicting Ingress objects can silently intercept
traffic meant for other services. By centralizing TLS configuration at the
Gateway level, Gateway API provides stronger security boundaries, at the cost of
reduced self-service in simple multi-tenant setups. For more details on the
design rationale, you can read the page
[Key differences between Ingress API and Gateway API](https://gateway-api.sigs.k8s.io/guides/migrating-from-ingress/#key-differences-between-ingress-api-and-gateway-api).

## Why cert-manager can't fix this on its own (yet)

cert-manager's current Gateway API integration only supports TLS configuration
defined on the Gateway itself: cert-manager watches Gateway resources. If the
`cert-manager.io/issuer` or `cert-manager.io/cluster-issuer` annotation is
present on one of the the Gateway resources, and given that there is a listener
that uses the HTTPS protocol and that the field `tls.certificateRefs` isn't
empty, cert-manager will create a Certificate, and will create a Secret with the
name set in `certificateRefs`.

Here is what the Gateway must look like for cert-manager to pick it up:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: istio-gateway
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  gatewayClassName: istio
  listeners:
    - name: https
      hostname: 'foo.example.com'
      port: 443
      protocol: HTTPS
      allowedRoutes:
        namespaces:
          from: All
      tls:
        mode: Terminate
        certificateRefs:
          - name: gateway-tls
```

For context, cert-manager doesn't look at the hostnames on HTTPRoutes as these
hostnames aren't meant for TLS; they are used by Gateway API controllers to know
which listener on the Gateway should be used for each HTTPRoute.

This model works only when either:

1. each team owns its own Gateway (increasing cost/infra), or
2. the implementation makes Gateways "cheap" logical objects.

It does not work for the common "one-shared-Gateway + many-teams" model. There
is no safe way today to let each team self-manage TLS, on a shared
Gateway, without either risky wildcards or dangerous RBAC.

## ListenerSet: the missing building block

Gateway API intends to introduce the ListenerSet resource (currently only as the
experimental `XListenerSet` kind) to address the self-service challenge while
maintaining security boundaries. ListenerSet allows:

- the platform team to own one shared Gateway and its infrastructure,
- application teams to create their own listeners and TLS settings in
  `XListenerSet` objects.

This restores the separation of concerns while preserving the security
improvements of Gateway API's design:

| Resource    | Concern                                     | Owner         |
| ----------- | ------------------------------------------- | ------------- |
| Gateway     | infra boundary + policy                     | Platform Team |
| ListenerSet | per-team hostname + TLS + `certificateRefs` | Developer     |
| HTTPRoute   | routing                                     | Developer     |

Functionally, for Ingress users, XListenerSet + HTTPRoute becomes the closest
thing to functionally similar to the Ingress experience, while remaining
Gateway-native, as shown in the following diagram:

![Similarly to the previous diagram, with Ingress, App Developers can configure TLS on their own. After, with Gateway and ListenerSet, App Developers can keep the same workflow for configuring TLS without needing to involve the Cluster Operator.](/images/announcements/2025-11-26-ingress-nginx-eol-and-gateway-api/migrating-using-listenerset.svg)

## cert-manager roadmap: `XListenerSet` support in Feb 2026

### What we will ship

cert-manager 1.20 will include, behind a feature gate, support for the
`cert-manager.io/issuer` and `cert-manager.io/cluster-issuer` annotations on
`XListenerSet` resources, with XListenerSet annotations overriding Gateway
annotations, and Gateway annotations acting as the "default issuer".

### Timeline

- **January 2026:** Alpha builds with `XListenerSet` support. We will need your
  help to test it out!
- **10 February 2026:** cert-manager 1.20 with `XListenerSet` support included
  as an experimental feature behind:
  ```bash
  --enable-gateway-api \
  --feature-gates XGatewayAPI=true
  ```

As Gateway API graduates ListenerSet to stable, we'll add support for the stable
type and a migration path from `XListenerSet` to `ListenerSet`.

## Ingress-nginx & InGate EOL: what this means for users

As stated elsewhere, ingress-nginx (Ingress support) and InGate will reach EOL
in March 2026.

Given the timeline, cert-manager 1.20 releases one month before that
EOL, ListenerSet is still experimental, we want to set expectations clearly:

- Today, there is no safe, first-class way to preserve multi-tenant TLS
  self-service using Gateway API.
- In cert-manager 1.20, there will be an experimental path via `XListenerSet`
  for evaluation and early adoption.
- In cert-manager 1.21 or 1.22, once ListenerSet has landed into the stable
  channel, we will implement stable support in cert-manager.

## Conclusion

Our goal is to make the transition to Gateway API as easy as possible to our
users. We have
[already started](https://github.com/cert-manager/cert-manager/issues/7822)
transitioning all of our tutorials to using Gateway API instead of the Ingress
API. We hope that XListenerSet is the right solution for people relying on
multi-tenant ingress controllers wanting to migrate to Gateway API.

For our existing ingress-nginx Ingress users, we recommend migrate off to
another Ingress controller such as Traefik instead of immediately jumping to
Gateway API. And once cert-manager supports the stable ListenerSet resource, you
will be able to plan your migrating towards Gateway API.

We will share more updates as alpha builds become available on the
[#cert-manager](https://kubernetes.slack.com/messages/cert-manager) channel on
Slack. Stay tuned!
