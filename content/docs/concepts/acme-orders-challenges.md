---
title: ACME Orders and Challenges
description: 'cert-manager core concepts: ACME Orders and Challenges'
---

cert-manager supports requesting certificates from ACME servers, including from
[Let's Encrypt](https://letsencrypt.org/), with use of the [ACME
Issuer](../configuration/acme/README.md). These certificates are typically trusted on
the public Internet by most computers. To successfully request a certificate,
cert-manager must solve ACME Challenges which are completed in order to prove
that the client owns the DNS addresses that are being requested.

In order to complete these challenges, cert-manager introduces two
`CustomResource` types; `Orders` and `Challenges`.

## Orders

`Order` resources are used by the ACME issuer to manage the lifecycle of an ACME
'order' for a signed TLS certificate.  More details on ACME orders and domain
validation can be found on the Let's Encrypt website
[here](https://letsencrypt.org/how-it-works/). An order represents a single
certificate request which will be created automatically once a new
[`CertificateRequest`](../usage/certificaterequest.md) resource referencing an ACME
issuer has been created. `CertificateRequest` resources are created
automatically by cert-manager once a [`Certificate`](../usage/certificate.md) resource
is created, has its specification changed, or needs renewal.

As an end-user, you will never need to manually create an `Order` resource.
Once created, an `Order` cannot be changed. Instead, a new `Order` resource must
be created.

The `Order` resource encapsulates multiple ACME 'challenges' for that 'order',
and as such, will manage one or more `Challenge` resources.

## Challenges

`Challenge` resources are used by the ACME issuer to manage the lifecycle of an
ACME 'challenge' that must be completed in order to complete an 'authorization'
for a single DNS name/identifier.

When an `Order` resource is created, the order controller will create
`Challenge` resources for each DNS name that is being authorized with the ACME
server.

As an end-user, you will never need to manually create a `Challenge` resource.
Once created, a `Challenge` cannot be changed. Instead, a new `Challenge`
resource must be created.

### Challenge Lifecycle

After a `Challenge` resource has been created, it will be initially queued for
processing. Processing will not begin until the challenge has been 'scheduled'
to start.  This scheduling process prevents too many challenges being attempted
at once, or multiple challenges for the same DNS name being attempted at once.
For more information on how challenges are scheduled, read the [challenge
scheduling](#challenge-scheduling).

Once a challenge has been scheduled, it will first be 'synced' with the ACME
server in order to determine its current state. If the challenge is already
valid, its 'state' will be updated to 'valid', and will also set
`status.processing = false` to 'unschedule' itself.

If the challenge is still 'pending', the challenge controller will 'present' the
challenge using the configured solver, one of HTTP01 or DNS01.  Once the
challenge has been 'presented', it will set `status.presented = true`.

Once 'presented', the challenge controller will perform a 'self check' to
ensure that the challenge has 'propagated' (i.e. the authoritative DNS servers
have been updated to respond correctly, or the changes to the ingress resources
have been observed and in-use by the ingress controller).

If the self check fails, cert-manager will retry the self check with a fixed 10
second retry interval. Challenges that do not ever complete the self check will
continue retrying until the user intervenes by either retrying the `Order` (by
deleting the `Order` resource) or amending the associated `Certificate` resource
to resolve any configuration errors.

Once the self check is passing, the ACME 'authorization' associated with this
challenge will be 'accepted'.

The final state of the authorization after accepting it will be copied across to
the Challenge's `status.state` field, as well as the 'error reason' if an error
occurred whilst the ACME server attempted to validate the challenge.

Once a Challenge has entered the `valid`, `invalid`, `expired` or `revoked`
state, it will set `status.processing = false` to prevent any further processing
of the ACME challenge, and to allow another challenge to be scheduled if there
is a backlog of challenges to complete.

### Challenge Scheduling

Instead of attempting to process all challenges at once, challenges are
'scheduled' by cert-manager.

This scheduler is a coarse back-pressure mechanism. It applies a cap on the
maximum number of simultaneous challenges, and it also disallows two
challenges for the same DNS name and challenge type (`HTTP01` or `DNS01`) from
being completed at once.

This behavior is intentionally conservative. The scheduler reasons about the
externally visible ACME validation target rather than cert-manager's internal
solver configuration. For example, HTTP01 validation is still against the same
hostname even if different ingress classes or gateway routes are configured,
and DNS01 validation is still against the same `_acme-challenge` name even if
different DNS provider backends are configured.

A single cert-manager instance performs self-checks from one network and DNS
viewpoint only. As a result, differing solver backends do not reliably imply
independent ACME-visible validation paths, so the scheduler keeps the key
coarse by design.

The scheduler does not attempt to model CA-specific rate limits, tenant
fairness, or ownership policy for DNS names. Deployments that need stronger
multi-tenant isolation or tighter control over which workloads may request
certificates for which names should rely on [policy controls](../policy/README.md),
admission, approval, or separate cert-manager deployments rather than on
scheduler heuristics alone.

The default maximum number of challenges that can be processed at a time is 60.