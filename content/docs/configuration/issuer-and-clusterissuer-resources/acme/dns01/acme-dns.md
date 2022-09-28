---
title: ACMEDNS
description: 'cert-manager configuration: ACME DNS-01 challenges using ACMEDNS'
---

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    solvers:
    - dns01:
        acmeDNS:
          host: https://acme.example.com
          accountSecretRef:
            name: acme-dns
            key: acmedns.json
```

In general, clients to ACMEDNS perform registration on the users behalf and
inform them of the CNAME entries they must create. This is not possible in
cert-manager, it is a non-interactive system. Registration must be carried out
beforehand and the resulting credentials JSON uploaded to the cluster as a
`Secret`. In this example, we use `curl` and the API endpoints directly.
Information about setting up and configuring ACMEDNS is available on the
[ACMEDNS project page](https://github.com/joohoi/acme-dns).

1. First, register with the ACMEDNS server, in this example, there is one
   running at `auth.example.com`. The command:

    ```sh
    curl -X POST http://auth.example.com/register
    ```

    will return a JSON with credentials for your registration:

    ```json
    {
      "username": "eabcdb41-d89f-4580-826f-3e62e9755ef2",
      "password": "pbAXVjlIOE01xbut7YnAbkhMQIkcwoHO0ek2j4Q0",
      "fulldomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com",
      "subdomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf",
      "allowfrom": []
    }
    ```

    It is strongly recommended to restrict the update endpoint to the IP
    range of your pods. This is done at registration time as follows:

    ```sh
    curl -X POST http://auth.example.com/register \
        -H "Content-Type: application/json" \
        --data '{"allowfrom": ["10.244.0.0/16"]}'
    ```

    Make sure to update the `allowfrom` field to match your cluster
    configuration. The JSON will now look like:

    ```json
    {
      "username": "eabcdb41-d89f-4580-826f-3e62e9755ef2",
      "password": "pbAXVjlIOE01xbut7YnAbkhMQIkcwoHO0ek2j4Q0",
      "fulldomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com",
      "subdomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf",
      "allowfrom": ["10.244.0.0/16"]
    }
    ```

2. Save this JSON to a file with the key as your domain. You can specify
   multiple domains with the same credentials if you like. In our example,
   the returned credentials can be used to verify ownership of
   `example.com` and and `example.org`.

    ```json
    {
      "example.com": {
        "username": "eabcdb41-d89f-4580-826f-3e62e9755ef2",
        "password": "pbAXVjlIOE01xbut7YnAbkhMQIkcwoHO0ek2j4Q0",
        "fulldomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com",
        "subdomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf",
        "allowfrom": ["10.244.0.0/16"]
      },
      "example.org": {
        "username": "eabcdb41-d89f-4580-826f-3e62e9755ef2",
        "password": "pbAXVjlIOE01xbut7YnAbkhMQIkcwoHO0ek2j4Q0",
        "fulldomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com",
        "subdomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf",
        "allowfrom": ["10.244.0.0/16"]
      }
    }
    ```

3. Next, update your primary DNS server with the CNAME record that will tell the
   verifier how to locate the challenge TXT record. This is obtained from the
   `fulldomain` field in the registration:

    ```
    _acme-challenge.example.com CNAME d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com
    _acme-challenge.example.org CNAME d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com
    ```

    The "name" of the record always has the _acme-challenge subdomain, and
    the "value" of the record matches exactly the fulldomain field from
    registration.

    At verification time, the domain name `d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com` will be a TXT
    record that is set to your validation token. When the verifier queries `_acme-challenge.example.com`, it will
    be directed to the correct location by this CNAME record. This proves that you control `example.com`

4. Create a secret from the credentials JSON that was saved in step 2, this
   secret is referenced in the `accountSecretRef` field of your DNS01
   issuer settings. When creating an `Issuer` both this `Issuer` and
   `Secret` must be in the same namespace. However for a `ClusterIssuer`
   (which does not have a namespace) the `Secret` must be placed in the
   same namespace as where the cert-manager pod is running in (in the
   default setup `cert-manager`).

   ```sh
   kubectl create secret generic acme-dns --from-file acmedns.json
   ```

## Limitation of the `acme-dns` server

The [`acme-dns`](https://github.com/joohoi/acme-dns) server has a [known
limitation](https://github.com/cert-manager/cert-manager/issues/3610#issuecomment-849792721):
when a set of credentials is used with more than 2 domains, cert-manager
will fail solving the DNS01 challenges.

Imagining that you have configured the ACMEDNS issuer with a single set of
credentials, and that the "subdomain" of this set of credentials is
`d420c923-bbd7-4056-ab64-c3ca54c9b3cf`:

```yaml
kind: Secret
metadata:
  name: auth-example-com
stringData:
  acmedns.json: |
    {
      "example.com": {
        "username": "eabcdb41-d89f-4580-826f-3e62e9755ef2",
        "password": "pbAXVjlIOE01xbut7YnAbkhMQIkcwoHO0ek2j4Q0",
        "fulldomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com",
        "subdomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf",
        "allowfrom": ["10.244.0.0/16"]
      },
    }
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: my-acme-dns
spec:
  acme:
    solvers:
      - dns01:
          acmeDNS:
            accountSecretRef:
              name: auth-example-com
              key: acmedns.json
            host: auth.example.com
```

and imagine that you want to create a Certificate with three subdomains:

```yaml
kind: Certificate
spec:
  issuerRef:
    name: issuer-1
  dnsNames:
    - "example.com"
    - "*.example.com"
    - "foo.example.com"
```

cert-manager will only be able to solve 2 challenges out of 3 in a non
deterministic way. This limitation comes from a "feature" mentioned [this
acme-dns issue](https://github.com/joohoi/acme-dns/issues/76).

One workaround is to issue one set of acme-dns credentials for each
domain that we want to be challenged, keeping in mind that each acme-dns
"subdomain" can only accept at most 2 challenged domains. For example, the
above secret would become:

```yaml
kind: Secret
metadata:
  name: auth-example-com
stringData:
  acmedns.json: |
    {
      "example.com": {
        "username": "eabcdb41-d89f-4580-826f-3e62e9755ef2",
        "password": "pbAXVjlIOE01xbut7YnAbkhMQIkcwoHO0ek2j4Q0",
        "fulldomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com",
        "subdomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf",
        "allowfrom": ["10.244.0.0/16"]
      },
      "foo.example.com": {
        "username": "eabcdb41-d89f-4580-826f-3e62e9755ef2",
        "password": "pbAXVjlIOE01xbut7YnAbkhMQIkcwoHO0ek2j4Q0",
        "fulldomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf.auth.example.com",
        "subdomain": "d420c923-bbd7-4056-ab64-c3ca54c9b3cf",
        "allowfrom": ["10.244.0.0/16"]
    }
```

With this setup, we have:

- `example.com` and `*.example.com` are registered in the acme-dns
  "subdomain" `d420c923-bbd7-4056-ab64-c3ca54c9b3cf`.
- `foo.example.com` is registered in the acme-dns "subdomain"
  `d420c923-bbd7-4056-ab64-c3ca54c9b3cf`.

Another workaround is to use `--max-concurrent-challenges 2` when running
the `cert-manager-controller`. With this setting, acme-dns will only have 2
TXT records in its database at any time, which mitigates the issue.