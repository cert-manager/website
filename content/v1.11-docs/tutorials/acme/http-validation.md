---
title: HTTP Validation
description: 'cert-manager tutorials: Issuing an ACME certificate using HTTP validation'
---

## Issuing an ACME certificate using HTTP validation

cert-manager can be used to obtain certificates from a CA using the
[ACME](https://en.wikipedia.org/wiki/Automated_Certificate_Management_Environment)
protocol.  The ACME protocol supports various challenge mechanisms which are
used to prove ownership of a domain so that a valid certificate can be issued
for that domain.

One such challenge mechanism is the HTTP01 challenge. With a HTTP01 challenge,
you prove ownership of a domain by ensuring that a particular file is present at
the domain. It is assumed that you control the domain if you are able to
publish the given file under a given path.

The following Issuer defines the necessary information to enable HTTP
validation. You can read more about the Issuer resource in the [Issuer
docs](../../concepts/issuer.md).

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-staging
  namespace: default
spec:
  acme:
    # The ACME server URL
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: user@example.com
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-staging
    # Enable the HTTP-01 challenge provider
    solvers:
    # An empty 'selector' means that this solver matches all domains
    - selector: {}
      http01:
        ingress:
          class: nginx
```

We have specified the ACME server URL for Let's Encrypt's [staging
environment](https://letsencrypt.org/docs/staging-environment/). The staging
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

We must provide one or more Solvers for handling the ACME challenge. In this
case we want to use HTTP validation so we specify an `http01` Solver. We could
optionally map different domains to use different Solver configurations.

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
  commonName: example.com
  dnsNames:
  - www.example.com
```

The Certificate resource describes our desired certificate and the possible
methods that can be used to obtain it. You can learn more about the Certificate
resource in the [docs](../../concepts/certificate.md).  If the certificate is
obtained successfully, the resulting key pair will be stored in a secret called
`example-com-tls` in the same namespace as the Certificate.

The certificate will have a common name of `example.com` and the [Subject
Alternative Names
(SANs)](https://en.wikipedia.org/wiki/Subject_Alternative_Name) will be
`example.com` and `www.example.com`. Note that only these SANs will be respected
by TLS clients.

In our Certificate we have referenced the `letsencrypt-staging` Issuer above.
The Issuer must be in the same namespace as the Certificate.  If you want to
reference a `ClusterIssuer`, which is a cluster-scoped version of an Issuer, you
must add `kind: ClusterIssuer` to the `issuerRef` stanza.

For more information on `ClusterIssuers`, read the [`ClusterIssuer`
docs](../../concepts/issuer.md).

The `acme` stanza defines the configuration for our ACME challenges.  Here we
have defined the configuration for our HTTP01 challenges which will be used to
verify domain ownership. To verify ownership of each domain mentioned in an
`http01` stanza, cert-manager will create a Pod, Service and Ingress that
exposes an HTTP endpoint that satisfies the HTTP01 challenge.

The fields `ingress` and `ingressClass` in the `http01` stanza can be used to
control how cert-manager interacts with Ingress resources:

- If the `ingress` field is specified, then an Ingress resource with the same
  name in the same namespace as the Certificate must already exist and it will
  be modified only to add the appropriate rules to solve the challenge.
  This field is useful for the Google Cloud Loadbalancer ingress controller, 
  as well as a number of others, that assign a single public IP address for 
  each ingress resource.
  Without manual intervention, creating a new ingress resource would cause any
  challenges to fail.
- If the `ingressClass` field is specified, a new ingress resource with a
  randomly generated name will be created in order to solve the challenge.
  This new resource will have an annotation with key `kubernetes.io/ingress.class`
  and value set to the value of the `ingressClass` field.
  This works for the likes of the NGINX ingress controller.
- If neither are specified, new ingress resources will be created with a randomly
  generated name, but they will not have the ingress class annotation set.
- If both are specified, then the `ingress` field will take precedence.

Once domain ownership has been verified, any cert-manager affected resources will
be cleaned up or deleted.

> Note: It is your responsibility to point each domain name at the correct IP
> address for your ingress controller.

After creating the above Certificate, we can check whether it has been obtained
successfully using `kubectl describe`:

```bash
$ kubectl describe certificate example-com
Events:
  Type    Reason          Age      From          Message
  ----    ------          ----     ----          -------
  Normal  CreateOrder     57m      cert-manager  Created new ACME order, attempting validation...
  Normal  DomainVerified  55m      cert-manager  Domain "example.com" verified with "http-01" validation
  Normal  DomainVerified  55m      cert-manager  Domain "www.example.com" verified with "http-01" validation
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