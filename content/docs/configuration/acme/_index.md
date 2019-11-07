---
title: "ACME"
linkTitle: "acme"
weight: 30
type: "docs"
---

The ACME Issuer type represents a single Account registered with the Automated
Certificate Management Environment (ACME) Certificate Authority server. When you
create a new ACME Issuer, cert-manager will generate a private key which is used
to identify you with the ACME server.

Certificates issued by public ACME servers are typically trusted by client's
computers by default. This means that, for example, visiting a website that is
backed by an ACME certificate issued for that URL, will be trusted by default by
most client's web browsers. ACME certificates are typically free.

## Solving Challenges

In order for the ACME CA server to verify that a client owns the domain, or
domains, a certificate is being requested for, the client must complete
"challenges". This is to ensure clients are unable to request certificates for
domains they do not own and as a result, fraudulently impersonate another's
site. As detailed in the [RFC8555](https://tools.ietf.org/html/rfc8555),
cert-manager offers two challenge validations - HTTP01 and DNS01 challenges.

[HTTP01](./http01/index.md) challenges are completed by presenting a computed
key, that should be present at a HTTP URL endpoint that is rotatable over the
internet. This URL will use the domain name requested for the certificate. Once
the ACME server is able to get this key from this URL over the internet, the
ACME server can validate you are the owner of this domain. When a HTTP01
challenge is created, cert-manager will automatically configure your cluster
ingress to route traffic for this URL to a small web server that presents this
key.

[DNS01](./dns01/index.md) challenges are completed by providing a computed key
that is present at a DNS TXT record. Once this TXT record has been propagated
across the internet, the ACME server can successfully retrieve this key via a
DNS lookup and can validate that the client owns the domain for the requested
certificate. With the correct permissions, cert-manager will automatically
present this TXT record for your given DNS provider.

## Configuration

### Creating a basic ACME Issuer

All ACME issuers follow a similar configuration structure - a clients `email`, a
`server` url, a `privateKeySecretRef`, and one or more `solvers`. Below is an
example of a simple ACME issuer:

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    # You must replace this email address with your own.
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account.
    email: user@example.com
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      # Secret resource used to store the account's private key.
      name: example-issuer-account-key
    # Add a single challenge solver, HTTP01 using nginx
    solvers:
    - http01:
        ingress:
          class: nginx
```

Solvers come in the form of [`dns01`](./dns01/index.md) and
[`http01`](./http01/index.md) stanzas. For more information of how to configure
this solver types, visit their respective documentation -
[dns01](./dns01/index.md), [http01](./http01/index.md).


### Adding Multiple Solver Types

You may want to use different types of challenge solver configurations for
different ingress controllers, for example if you want to issue wildcard
certificates using DNS01 alongside other certificates that are validated using
HTTP01.

The `solvers` stanza has an optional `selector` field, that can be used to
specify which `Certificate`s, and further, what DNS names *on those certificates*
should be used to solve challenges.

For example, to configure HTTP01 using nginx ingress as the default solver,
along with a DNS01 solver that can be used for wildcard certificates:

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    ...
    solvers:
    - http01:
        ingress:
          class: nginx
    - dns01:
        cloudflare:
          email: user@example.com
          apiKeySecretRef:
            name: cloudflare-apikey-secret
            key: apikey
      selector:
        matchLabels:
          use-cloudflare-solver: "true"
```

In order to utilise the configured cloudflare DNS01 solver, you must add the
``use-cloudflare-solver: "true"`` label to your `Certificate` resources.

### Using multiple solvers for a single certificate

The solver's `selector` stanza has an additional field `dnsNames` that
further refines the set of domains that the solver configuration applies to.

If any `dnsNames` are specified, then that challenge solver will be used if
the domain being validated is named in that list.

For example:

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    ...
    solvers:
    - http01:
        ingress:
          class: nginx
    - dns01:
        cloudflare:
          email: user@example.com
          apiKeySecretRef:
            name: cloudflare-apikey-secret
            key: apikey
      selector:
        dnsNames:
        - '*.example.com'
```

In this instance, a Certificate that specified both `*.example.com` and
`example.com` would use the HTTP01 challenge solver for `example.com` and
the DNS01 challenge solver for `*.example.com`.

It is possible to specify both `matchLabels` AND `dnsNames` on an ACME
solver selector.
