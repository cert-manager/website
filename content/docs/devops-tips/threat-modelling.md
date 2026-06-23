---
title: Threat Model
description: How we think about permissions and threats in cert-manager
---

Threat models are industry standard tools for evaluating the security posture of a tool. Since cert-manager is such a privileged tool operating on critical credentials (i.e. X.509 private keys) we think a lot about making cert-manager's security posture coherent while
remaining powerful and easy to use.

## Third Party Formal Threat Models

ControlPlane did a formal threat model of cert-manager, which is [available free](https://cert-manager.io/docs/announcements/controlplane-2026-cert-manager-hardening-guide.pdf) and which contains a plethora of useful thoughts and actions for practically securing cert-manager - and other tools - in your cluster.

## Threat Model Considerations

The technical considerations for how to think about cert-manager's permissions are deep. Similarly, thinking about how to assign permissions to your users for cert-manager resources is complex.

This section starts with basic learnings which you should apply in your cluster and then seeks to expand on why those recommendations are made.

### Who should be able to interact with cert-manager?

Cluster administrators choose how to grant Kubernetes RBAC permissions to users of a cluster.

We recommend that all administrators restrict cert-manager CRD permissions to only privileged users.

Specifically, for `Certificate`, `CertificateRequest`, `Issuer` and `ClusterIssuer` resources:

- Permission to edit, delete or create should be treated as _highly privileged_ and restricted to the fullest extent possible
- Permission to view should be minimized in line with general Kubernetes best practices
- Treat as infrastructure - should be created and updated by humans or automation and generally should not be accessible to running code

For `Order` and `Challenge` resources:

- Permission to edit or create should generally not be widely granted; generally, only cert-manager should be able to modify these resources
- Permission to view should be minimized in line with general Kubernetes best practices

### Special Considerations for Multi-Tenanted Clusters

In deployments where users are separated by namespaces and are not expected to be able to see any resources for other tenants:

- Ensure that all permissions are tightly namespace scoped and restricted to the fullest possible extent
- Treat `ClusterIssuer` resources as hazardous, and avoid where possible. Deploy only with a firm threat model in place and strict approval policies.
- If possible, restrict cert-manager permissions for all tenants and provide cert-manager resources to users as "standard infrastructure"
- Think carefully about trust chains when using private PKI. Avoid sharing CA certificates between tenants if possible.

### Specific Risks to Consider

This section seeks to explain specific risks which motivate the above advice:

- Permission to create and edit `Issuer` resources in a namespace is equivalent to granting permission to read secrets in that namespace
    - This is because the `Issuer` can read API tokens for Vault from secrets, and must send those tokens verbatim to the configured server
    - An attacker with `issuer:create` can therefore send arbitrary keys from a secret to a server they control
    - This can be mitigated with network egress restrictions to some degree but tightly-scoped RBAC is the ultimate control

- Permission to create / edit `ClusterIssuer` resources grants permission to read secrets in cert-manager's namespace
    - `ClusterIssuers` can also read API tokens, but are restricted to reading from the cert-manager installation namespace
    - All cluster-scoped resources (including non-cert-manager resources) should be treated as privileged because of their blast radius if something goes wrong

- Permission to create / edit issuers can allow attackers to make HTTP requests inside the cluster and exfiltrate responses
    - ACME has several methods by which cert-manager must make a request to a URL which could be attacker controlled
    - If an attacker can create an ACME issuer, they can set their own server URL and trick cert-manager into making requests inside the cluster

- Permission to create `Challenge` resources can allow attackers to read secrets
    - Solver configuration can be used to send values from `Secret` resources to attacker-controlled servers
    - Lower risk, as there's little conceptual reason to share permissions to create `Challenge` resources directly

### Permissions, RBAC and Security Background

cert-manager has cluster-wide permission to create, read and update Kubernetes `Secret` resources by design.

Since certificates are stored in `Secrets` cert-manager needs to be able to check their validity and update them if needed.
cert-manager has a variety of other privileged permissions which it needs for various tasks; for example, the ability to create `Pod`s for ACME HTTP-01 challenges.

These permissions come with the risk of a "confused deputy" attack where an attacker tries tricking a privileged component into doing tasks on their behalf.
Since cluster users interact with cert-manager mostly through its custom resources it's very important to consider confused deputy attacks when assigning permissions relating to custom resources to principals in a cluster.

Similarly, SSRF style attacks present risks when attackers are able to trigger cert-manager to issue HTTP requests to other services and (potentially) replay the responses to the attacker.

It is impossible for cert-manager to be a general purpose tool for certificate issuance while also fully mitigating the risk of a confused deputy or SSRF attack.
For example, if cert-manager is to support talking to arbitrary Vault servers _and_ to support reading Vault API tokens from arbitrary Kubernetes `Secret`s, it _must_ be possible to configure cert-manager to send at least part of arbitrary secrets to any URL.

Put another way: The token must be read from a user-specified `Secret` and then sent in cleartext to a user-specified server URL.

The only possible control for this is to tightly configure who is able to tell cert-manager to perform such actions. This specific example is why we say that the ability to create `Issuer` resources is equivalent to being able to read `Secret` resources.

### Certificates and Trust

Outside of a purely Kubernetes-focused view, cert-manager is obviously closely tied to X.509, TLS and the concept of trust in a certificate hierarchy.

Beyond any specific risks which could arise from allowing users access to freely create cert-manager resources, there are practical considerations which apply generally
to certificate issuance.

Certificates represent identities, and the production of identities is tightly tied to security generally. There's generally no reason to allow all users in a cluster the
ability to create arbitrary `Certificate` resources, because attackers may be able to leverage that ability to forge identities and impersonate other users and services.
