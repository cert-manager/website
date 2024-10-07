---
title: DNS Validation
description: 'cert-manager turorials: Issuing an ACME certificate using DNS validation'
---

## Issuing an ACME certificate using DNS validation

cert-manager can be used to obtain certificates from a CA using the
[ACME](https://en.wikipedia.org/wiki/Automated_Certificate_Management_Environment)
protocol.  The ACME protocol supports various challenge mechanisms which are
used to prove ownership of a domain so that a valid certificate can be issued
for that domain.

One such challenge mechanism is DNS01. With a DNS01 challenge, you prove
ownership of a domain by proving you control its DNS records.
This is done by creating a TXT record with specific content that proves you
have control of the domains DNS records.

The following Issuer defines the necessary information to enable DNS validation.
You can read more about the Issuer resource in the [Issuer
docs](../../configuration/README.md).

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-staging
  namespace: default
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: user@example.com

    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-staging

    # ACME DNS-01 provider configurations
    solvers:
    # An empty 'selector' means that this solver matches all domains
    - selector: {}
      dns01:
        cloudDNS:
          # The ID of the GCP project
          # reference: https://cert-manager.io/docs/tutorials/acme/dns-validation/
          project: $PROJECT_ID
          # This is the secret used to access the service account
          serviceAccountSecretRef:
            name: clouddns-dns01-solver-svc-acct
            key: key.json

    # We only use cloudflare to solve challenges for example.org.
    # Alternative options such as 'matchLabels' and 'dnsZones' can be specified
    # as part of a solver's selector too.
    - selector:
        dnsNames:
        - example.org
      dns01:
        cloudflare:
          email: my-cloudflare-acc@example.com
          # !! Remember to create a k8s secret before
          # kubectl create secret generic cloudflare-api-key-secret
          apiKeySecretRef:
            name: cloudflare-api-key-secret
            key: api-key
```


We have specified the ACME server URL for Let's Encrypt's [staging
environment](https://letsencrypt.org/docs/staging-environment/).  The staging
environment will not issue trusted certificates but is used to ensure that the
verification process is working properly before moving to production. Let's
Encrypt's production environment imposes much stricter [rate
limits](https://letsencrypt.org/docs/rate-limits/), so to reduce the chance of
you hitting those limits it is highly recommended to start by using the staging
environment. To move to production, simply create a new Issuer with the URL set
to `https://acme-v02.api.letsencrypt.org/directory`.

The first stage of the ACME protocol is for the client to register with the
ACME server. This phase includes generating an asymmetric key pair which is
then associated with the email address specified in the Issuer. Make sure to
change this email address to a valid one that you own. It is commonly used to
send expiry notices when your certificates are coming up for renewal. The
generated private key is stored in a Secret named `letsencrypt-staging`.

The `dns01` stanza contains a list of DNS01 providers that can be used to
solve DNS challenges. Our Issuer defines two providers. This gives us a choice
of which one to use when obtaining certificates.

More information about the DNS provider configuration, including a list of
supported providers, can be found [in the DNS01 reference docs](../../configuration/acme/dns01/README.md).

Once we have created the above Issuer we can use it to obtain a certificate.

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com
  namespace: default
spec:
  secretName: example-com-tls
  issuerRef:
    name: letsencrypt-staging
  dnsNames:
  - '*.example.com'
  - example.com
  - example.org
```

The Certificate resource describes our desired certificate and the possible
methods that can be used to obtain it. You can obtain certificates for wildcard
domains just like any other. Make sure to wrap wildcard domains with asterisks
in your YAML resources, to avoid formatting issues.  If you specify both
`example.com` and `*.example.com` on the same Certificate, it will take slightly
longer to perform validation as each domain will have to be validated one after
the other.  You can learn more about the Certificate resource in the
[docs](../../usage/README.md).  If the certificate is obtained successfully, the
resulting key pair will be stored in a secret called `example-com-tls` in the
same namespace as the Certificate.

The certificate will have a common name of `*.example.com` and the [Subject
Alternative Names
(SANs)](https://en.wikipedia.org/wiki/Subject_Alternative_Name) will be
`*.example.com`, `example.com` and `example.org`.

In our Certificate we have referenced the `letsencrypt-staging` Issuer above.
The Issuer must be in the same namespace as the Certificate.  If you want to
reference a `ClusterIssuer`, which is a cluster-scoped version of an Issuer, you
must add `kind: ClusterIssuer` to the `issuerRef` stanza.

For more information on `ClusterIssuers`, read the
[issuer concepts](../../concepts/issuer.md).

The `acme` stanza defines the configuration for our ACME challenges. Here we
have defined the configuration for our DNS challenges which will be used to
verify domain ownership. For each domain mentioned in a `dns01` stanza,
cert-manager will use the provider's credentials from the referenced Issuer to
create a TXT record called `_acme-challenge`.  This record will then be verified
by the ACME server in order to issue the certificate.  Once domain ownership has
been verified, any cert-manager affected records will be cleaned up.

> Note: It is your responsibility to ensure the selected provider is
> authoritative for your domain.

After creating the above Certificate, we can check whether it has been obtained
successfully using `kubectl describe`:

```bash
$ kubectl describe certificate example-com
Events:
  Type    Reason          Age      From          Message
  ----    ------          ----     ----          -------
  Normal  CreateOrder     57m      cert-manager  Created new ACME order, attempting validation...
  Normal  DomainVerified  55m      cert-manager  Domain "*.example.com" verified with "dns-01" validation
  Normal  DomainVerified  55m      cert-manager  Domain "example.com" verified with "dns-01" validation
  Normal  DomainVerified  55m      cert-manager  Domain "example.org" verified with "dns-01" validation
  Normal  IssueCert       55m      cert-manager  Issuing certificate...
  Normal  CertObtained    55m      cert-manager  Obtained certificate from ACME server
  Normal  CertIssued      55m      cert-manager  Certificate issued successfully
```

You can also check whether issuance was successful with `kubectl get secret
example-com-tls -o yaml`. You should see a base64 encoded signed TLS key pair.

Once our certificate has been obtained, cert-manager will periodically check its
validity and attempt to renew it if it gets close to expiry. cert-manager
considers certificates to be close to expiry when the 'Not After' field on the
certificate is less than the current time plus 30 days.