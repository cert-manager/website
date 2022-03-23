---
title: ACME
description: 'cert-manager configuration: ACME Issuers'
---

The ACME Issuer type represents a single account registered with the Automated
Certificate Management Environment (ACME) Certificate Authority server. When you
create a new ACME `Issuer`, cert-manager will generate a private key which is
used to identify you with the ACME server.

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

[HTTP01](./http01/README.md) challenges are completed by presenting a computed
key, that should be present at a HTTP URL endpoint and is routable over the
internet. This URL will use the domain name requested for the certificate. Once
the ACME server is able to get this key from this URL over the internet, the
ACME server can validate you are the owner of this domain. When a HTTP01
challenge is created, cert-manager will automatically configure your cluster
ingress to route traffic for this URL to a small web server that presents this
key.

[DNS01](./dns01/README.md) challenges are completed by providing a computed key
that is present at a DNS TXT record. Once this TXT record has been propagated
across the internet, the ACME server can successfully retrieve this key via a
DNS lookup and can validate that the client owns the domain for the requested
certificate. With the correct permissions, cert-manager will automatically
present this TXT record for your given DNS provider.

## Configuration

### Creating a Basic ACME Issuer

All ACME `Issuers` follow a similar configuration structure - a clients `email`,
a `server` URL, a `privateKeySecretRef`, and one or more `solvers`. Below is an
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
      # Secret resource that will be used to store the account's private key.
      name: example-issuer-account-key
    # Add a single challenge solver, HTTP01 using nginx
    solvers:
    - http01:
        ingress:
          class: nginx
```

Solvers come in the form of [`dns01`](./dns01/README.md) and
[`http01`](./http01/README.md) stanzas. For more information on how to configure
these solver types, visit their respective documentation -
[DNS01](./dns01/README.md), [HTTP01](./http01/README.md).

### External Account Bindings

cert-manager supports using External Account Bindings with your ACME account.
External Account Bindings are used to associate your ACME account with an
external account such as a CA custom database. This is typically not needed for
most cert-manager users unless you know it is explicitly needed.

External Account Bindings require three fields on an ACME `Issuer` which
represents your ACME account. These fields are; the `keyID` of which your
external account binding is indexed by the external account manager,
`keySecretRef` which references a secret containing a base 64 encoded URL
string of your external account symmetric MAC key, and finally `keyAlgorithm`,
the MAC algorithm used to sign the JSON web string containing your External
Account Binding when registering the account with the ACME server.

> Note: The `base64` command is useful for encoding your MAC key if it is not
> already encoded:
>
> ```console
> $ echo 'my-secret-key' | base64
> ```
>
> You can then create the Secret resource with:
>
> ```console
> $ kubectl create secret generic eab-secret --from-literal secret={base64 encoded secret key}
> ```

An example of an ACME issuer with an External Account Binding is as follows.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: my-acme-server-with-eab
spec:
  acme:
    email: user@example.com
    server: https://my-acme-server-with-eab.com/directory
    externalAccountBinding:
      keyID: my-kid-1
      keySecretRef:
        name: eab-secret
        key: secret
      keyAlgorithm: HS256
    privateKeySecretRef:
      name: example-issuer-account-key
    solvers:
    - http01:
        ingress:
          class: nginx
```


### Adding Multiple Solver Types

You may want to use different types of challenge solver configurations for
different ingress controllers, for example if you want to issue wildcard
certificates using `DNS01` alongside other certificates that are validated using
`HTTP01`.

The `solvers` stanza has an optional `selector` field, that can be used to
specify which `Certificates`, and further, what DNS names *on those*
`Certificates` should be used to solve challenges.

There are three selector types that can be used to form the requirements that a
`Certificate` must meet in order to be selected for a solver - `matchLabels`,
`dnsNames` and `dnsZones`. You can have any number of these three selectors on a
single solver.


#### Match Labels

The `matchLabel` selector requires that all `Certificates` match at least one of
the labels that are defined in the string map list of that stanza. For example,
the following `Issuer` will only match on `Certificates` that have the labels
`"user-cloudflare-solver": "true"`, or `"email": "user@example.com"`, or both.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    ...
    solvers:
    - dns01:
        cloudflare:
          email: user@example.com
          apiKeySecretRef:
            name: cloudflare-apikey-secret
            key: apikey
      selector:
        matchLabels:
          "use-cloudflare-solver": "true"
          "email": "user@example.com"
```

#### DNS Names

The `dnsNames` selector is a list of exact DNS names that should be mapped to a
solver.  This means that `Certificates` containing any of these DNS names will
be selected.  If a match is found, a `dnsNames` selector will take precedence
over a [`dnsZones`](#dns-zones) selector. If multiple solvers match with the
same `dnsNames` value, the solver with the most matching labels in
[`matchLabels`](#match-labels) will be selected. If neither has more matches,
the solver defined earlier in the list will be selected.

The following example will solve challenges of `Certificates` with DNS names
`example.com` and `*.example.com` for these domains.

> Note: `dnsNames` take an exact match and do not resolve wildcards, meaning the
> following `Issuer` *will not* solve for DNS names such as `foo.example.com`.
> Use the [`dnsZones`](#dns-zones) selector type to match all subdomains within
> a zone.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    ...
    solvers:
    - dns01:
        cloudflare:
          email: user@example.com
          apiKeySecretRef:
            name: cloudflare-apikey-secret
            key: apikey
      selector:
        dnsNames:
        - 'example.com'
        - '*.example.com'
```

#### DNS Zones

The `dnsZones` stanza defines a list of DNS zones that can be solved by this
solver. If a DNS name is an exact match, or a subdomain of any of the specified
`dnsZones`, this solver will be used, unless a more specific
[`dnsNames`](#dns-names) match is configured. This means that `sys.example.com`
will be selected over one specifying `example.com` for the domain
`www.sys.example.com`. If multiple solvers match with the same `dnsZones` value,
the solver with the most matching labels in [`matchLabels`](#match-labels) will
be selected. If neither has more matches, the solver defined earlier in the list
will be selected.

In the following example, this solver will resolve challenges for the domain
`example.com`, as well as all of its subdomains `*.example.com`.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    ...
    solvers:
    - dns01:
        cloudflare:
          email: user@example.com
          apiKeySecretRef:
            name: cloudflare-apikey-secret
            key: apikey
      selector:
        dnsZones:
        - 'example.com'
```

#### All Together

Each solver is able to have any number of the three selector types defined. In
the following example, the `DNS01` solver will be used to solve challenges for
domains for `Certificates` that contain the DNS names `a.example.com` and
`b.example.com`, or for `test.example.com` and all of its subdomains
(e.g. `foo.test.example.com`).

For all other challenges, the `HTTP01` solver will be used *only* if the
`Certificate` also contains the label `"use-http01-solver": "true"`.

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
      selector:
        matchLabels:
          "user-http01-solver": "true"
    - dns01:
        cloudflare:
          email: user@example.com
          apiKeySecretRef:
            name: cloudflare-apikey-secret
            key: apikey
      selector:
        dnsNames:
        - 'a.example.com'
        - 'b.example.com'
        dnsZones:
        - 'test.example.com'
```