---
title: DNS01
description: 'cert-manager configuration: ACME DNS-01 challenges overview'
---

## Configuring DNS01 Challenge Provider

This page contains details on the different options available on the `Issuer`
resource's DNS01 challenge solver configuration.

For more information on configuring ACME `Issuers` and their API format, read the
[ACME Issuers](../README.md) documentation.

DNS01 provider configuration must be specified on the `Issuer` resource, similar
to the examples in the setting up documentation.

You can read about how the DNS01 challenge type works on the [Let's Encrypt
challenge types
page](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge).

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    email: user@example.com
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: example-issuer-account-key
    solvers:
    - dns01:
        cloudDNS:
          project: my-project
          serviceAccountSecretRef:
            name: prod-clouddns-svc-acct-secret
            key: service-account.json
```

Each issuer can specify multiple different DNS01 challenge providers, and
it is also possible to have multiple instances of the same DNS provider on a
single `Issuer` (e.g. two CloudDNS accounts could be set, each with their own
name).

For more information on utilizing multiple solver types on a single `Issuer`,
read the multiple-solver-types section.

## Setting Nameservers for DNS01 Self Check

cert-manager will check the correct DNS records exist before attempting a DNS01
challenge.  By default cert-manager will use the recursive nameservers taken
from `/etc/resolv.conf` to query for the authoritative nameservers, which it will
then query directly to verify the DNS records exist.

If this is not desired (for example with multiple authoritative nameservers or
split-horizon DNS), the cert-manager controller exposes two flags that allows
you alter this behavior:

`--dns01-recursive-nameservers` Comma separated string with host and port of the
recursive nameservers cert-manager should query.

`--dns01-recursive-nameservers-only` Forces cert-manager to only use the
recursive nameservers for verification. Enabling this option could cause the DNS01
self check to take longer due to caching performed by the recursive nameservers.


Example usage:
```bash
--dns01-recursive-nameservers-only --dns01-recursive-nameservers=8.8.8.8:53,1.1.1.1:53
```

If you're using the `cert-manager` helm chart, you can set recursive nameservers
through `.Values.extraArgs` or at the command at helm install/upgrade time
with `--set`:

```bash
--set 'extraArgs={--dns01-recursive-nameservers-only,--dns01-recursive-nameservers=8.8.8.8:53\,1.1.1.1:53}'
```

## Delegated Domains for DNS01

By default, cert-manager will not follow CNAME records pointing to subdomains.

If granting cert-manager access to the root DNS zone is not desired, then the
`_acme-challenge.example.com` subdomain can instead be delegated to some other,
less privileged domain (`less-privileged.example.org`). This could be achieved in the following way. Say, one has two zones:

* `example.com`
* `less-privileged.example.org`

1. Create a CNAME record pointing to this less privileged domain:
```
_acme-challenge.example.com	IN	CNAME	_acme-challenge.less-privileged.example.org.
```

2. Grant cert-manager rights to update less privileged `less-privileged.example.org` zone

3. Provide configuration/credentials for updating this less privileged zone
and add an additional field into the relevant `dns01` solver. Note that `selector`
field is still working for the original `example.com`, while credentials are provided for
`less-privileged.example.org`

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  ...
spec:
  acme:
    ...
    solvers:
    - selector:
        dnsZones:
        - 'example.com'
      dns01:
        # Valid values are None and Follow
        cnameStrategy: Follow
        route53:
          region: eu-central-1
          accessKeyID: <Access ID for less-privileged.example.org here>
          hostedZoneID: <Zone ID for less-privileged.example.org here>
          secretAccessKeySecretRef:
            ...
```

If you have a multitude of (sub)domains requiring separate certificates,
it is possible to share an aliased less-privileged domain. To achieve it one should
create a CNAME record for each (sub)domain like this:

```txt
_acme-challenge.example.com	    IN	CNAME	_acme-challenge.less-privileged.example.org.
_acme-challenge.www.example.com	IN	CNAME	_acme-challenge.less-privileged.example.org.
_acme-challenge.foo.example.com	IN	CNAME	_acme-challenge.less-privileged.example.org.
_acme-challenge.bar.example.com	IN	CNAME	_acme-challenge.less-privileged.example.org.
```

With this configuration cert-manager will follow CNAME records recursively in order to determine
which DNS zone to update during DNS01 challenges.


## Supported DNS01 providers

A number of different DNS providers are supported for the ACME `Issuer`. Below
is a listing of available providers, their `.yaml` configurations, along with
additional Kubernetes and provider specific notes regarding their usage.

- [ACMEDNS](./acme-dns.md)
- [Akamai](./akamai.md)
- [AzureDNS](./azuredns.md)
- [CloudFlare](./cloudflare.md)
- [Google](./google.md)
- [Route53](./route53.md)
- [DigitalOcean](./digitalocean.md)
- [RFC2136](./rfc2136.md)

## Webhook

cert-manager also supports out of tree DNS providers using an external webhook.
Links to these supported providers along with their documentation are below:

- [`AliDNS-Webhook`](https://github.com/pragkent/alidns-webhook)
- [`cert-manager-alidns-webhook`](https://github.com/DEVmachine-fr/cert-manager-alidns-webhook)
- [`cert-manager-webhook-civo`](https://github.com/okteto/cert-manager-webhook-civo)
- [`cert-manager-webhook-dnspod`](https://github.com/qqshfox/cert-manager-webhook-dnspod)
- [`cert-manager-webhook-dnsimple`](https://github.com/neoskop/cert-manager-webhook-dnsimple)
- [`cert-manager-webhook-gandi`](https://github.com/bwolf/cert-manager-webhook-gandi)
- [`cert-manager-webhook-infomaniak`](https://github.com/Infomaniak/cert-manager-webhook-infomaniak)
- [`cert-manager-webhook-inwx`](https://gitlab.com/smueller18/cert-manager-webhook-inwx)
- [`cert-manager-webhook-linode`](https://github.com/slicen/cert-manager-webhook-linode)
- [`cert-manager-webhook-oci`](https://gitlab.com/dn13/cert-manager-webhook-oci) (Oracle Cloud Infrastructure)
- [`cert-manager-webhook-scaleway`](https://github.com/scaleway/cert-manager-webhook-scaleway)
- [`cert-manager-webhook-selectel`](https://github.com/selectel/cert-manager-webhook-selectel)
- [`cert-manager-webhook-softlayer`](https://github.com/cgroschupp/cert-manager-webhook-softlayer)
- [`cert-manager-webhook-ibmcis`](https://github.com/jb-dk/cert-manager-webhook-ibmcis)
- [`cert-manager-webhook-loopia`](https://github.com/Identitry/cert-manager-webhook-loopia)
- [`cert-manager-webhook-arvan`](https://github.com/kiandigital/cert-manager-webhook-arvan)
- [`bizflycloud-certmanager-dns-webhook`](https://github.com/bizflycloud/bizflycloud-certmanager-dns-webhook)
- [`cert-manager-webhook-hetzner`](https://github.com/vadimkim/cert-manager-webhook-hetzner)
- [`cert-manager-webhook-yandex-cloud`](https://github.com/malinink/cert-manager-webhook-yandex-cloud)

You can find more information on how to configure webhook providers [here](./webhook.md).

To create a new unsupported DNS provider, follow the development documentation [here](../../../contributing/dns-providers.md).
