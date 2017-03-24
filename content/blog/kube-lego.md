+++
title = "Automated certificate provisioning in Kubernetes using kube-lego"
date = "2016-06-13T14:03:00+01:00"
Tags = ["Kubernetes", "TLS", "Let's Encrypt", "Security", "Cluster Addons"]
Categories = ["Kubernetes", "Solutions"]
authortwitter = "simonswine"
author = "Christian Simon"
thumbnail = "/authors/christian-simon.jpg"
socialsharing = true
image = "/blog/kube-lego/cover.png"
+++

In this blog post, we are pleased to introduce [Kube-Lego], an open source tool for automated Let's Encrypt TLS-enabled web services running in [Kubernetes].

TLS has become increasingly important for production deployment of web services. This has been driven by  revelations of surveillance post-Snowden, as well as the fact that Google now [favours secure HTTPS sites](https://security.googleblog.com/2015/12/indexing-https-pages-by-default.html) in search result rankings.

An important step towards increased adoption of TLS has been the availability of
[Let's Encrypt]. It provides an easy, free-of-charge way to obtain certificates. Certificates are limited to a 90-day lifetime and so the free certificate authority (CA) encourages full automation for ease-of-use. At the time of writing, Let's Encrypt has approaching [3.5 million unexpired certificates](https://letsencrypt.org/stats/) so adoption has certainly been strong.

Kube-Lego automates the process in Kubernetes by watching `ingress` resources and automatically requesting missing or expired TLS certificates from Let's Encrypt.

[ACME]:https://letsencrypt.github.io/acme-spec/
[Kube-Lego]:https://github.com/jetstack/kube-lego
[Let's Encrypt]:https://letsencrypt.org/
[Kubernetes]:https://kubernetes.io/
[SAN]:https://en.wikipedia.org/wiki/Subject_Alternative_Name
[SNI]:https://en.wikipedia.org/wiki/Server_Name_Indication
[Lego]:https://github.com/xenolf/lego
[xenolf]:https://github.com/xenolf
[nginx-ingress-controller]:https://github.com/kubernetes/contrib/tree/master/ingress/controllers/nginx

<!--more-->

# ACME protocol

In order to automate the process of verification and certificate issuance for
Let's Encrypt's CA, the ACME (Automated Certificate Management Environment)
protocol is used. It specifies an API that can be integrated into many products
that require publicly trusted certificates.

To interact with the CA's ACME server, clients are required to
authenticate with a private/public key pair (account). This helps to identify
the user later for actions like extension or revocation of certificates. Let's
Encrypt supports only domain validation and requires you to specify every
valid domain individually, so while a certificate can be valid for multiple
hostnames using [SAN], there is currently no support for wildcard certificates.

## Validation methods

Let's Encrypt allows you to prove the validity of a certificate request
with four methods. They all use a so-called 'key auth challenge response', which
is derived from the account's key pair.

- **Simple HTTP**: The CA connects to the specified URL
(`http://${domain-name}/.well-known/acme-challenge/${token}`) to verify the
authenticity of a certificate request. The response of the HTTP server has to
contain the key auth.
- **TLS-SNI**: With this method, the CA connects to the requested domain
name via HTTPS and selects the verification hostname
`${keyAuth[0]}.${keyAuth[1]}.acme.invalid` via [SNI]. The returned certificate
is not verified, it only has to contain the verification hostname.
- **DNS**: A `TXT`-record `_acme-challenge.${domain-name}` has to be published,
to verify the authenticity of your request via the DNS method. The content of
this records has to include the key auth.
- **Proof of Possession of a Prior Key**: If you already have a valid
certificate for the domain name you want to request another certificate. You can then use this method to get validated.

# Kube-Lego

[Kube-Lego] brings fully automated TLS management to a Kubernetes cluster.
To achieve this it interfaces with the Kubernetes API on one side and an ACME
enabled CA on the other. Kube-Lego is written in Go and uses [xenolf]'s
ACME client implementation [Lego] for communicating with Let's
Encrypt (this explains the project name). Currently, the only
implemented validation method is **Simple HTTP**

## Pre-requisites

To use Kube-Lego you need a working Kubernetes cluster. The minimum
version supported is 1.2, as this includes TLS support for `ingress` resources. There are plenty of ways getting Kubernetes
bootstrapped; for instance, take a look at this [Getting Started
Guide](http://kubernetes.io/docs/getting-started-guides/) from the Kubernetes
project.

Note: Jetstack will also soon open source its cluster provisioner tool.

Another requirement for using Kube-Lego is a supported
ingress controller. The only supported controller at the moment is the
[nginx-ingress-controller] from Kubernetes' contrib project. The current
release of the upstream controller needs a simple modification to fully support
Kube-Lego. There is already a [pull
request](https://github.com/kubernetes/contrib/pull/850) filed to integrate
this change into the next upstream release. Meanwhile you can use a modified
build of the
[nginx-ingress-controller](https://hub.docker.com/r/simonswine/nginx-ingress-controller/).

Before you can use Kube-Lego you have to make the nginx-ingress-controller pods
accessible publicly. This usually happens with a `service` resource of the type
[`LoadBalancer`](http://kubernetes.io/docs/user-guide/load-balancer/).
Depending on the environment the cluster is running, this will create an
ELB/Forwarding Rule and you can point the domains you wish to use to that entry
point into your cluster.

## Validity check

After starting up, Kube-Lego looks at all `ingress` objects in all `namespaces` in the Kubernetes cluster. If the `ingress` is annotated with `kubernetes.io/tls-acme: "true"`, Kube-Lego will check the TLS configuration and make sure that the specified secret:

- Exists and contains a valid private/public key pair;
- The certificate is not expired;
- The certificate covers all domain names specified in the `ingress` config.

Let's take a look at the following example of an `ingress` resource:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: hello-world
  annotations:
    # enable kube-lego for this ingress
    kubernetes.io/tls-acme: "true"
spec:
  # this enables tls for the specified domain names
  tls:
  - hosts:
    - demo.kube-lego.jetstack.net
    secretName: hello-world-tls
  rules:
  - host: demo.kube-lego.jetstack.net
    http:
      paths:
      - path: /
        backend:
          serviceName: hello-world
          servicePort: 80
```

## Certificate Request

Let's assume we haven't run Kube-Lego before, so neither the certificate nor
the user account exists. The Kube-Lego validity check comes to the conclusion
that it needs to request a certificate for the domain
*demo.kube-lego.jetstack.net*.

Before requesting the certificate, Kube-Lego sets up the challenge endpoint
(`/.well-known/acme-challenge/`) in a separate `ingress` resource named
*kube-lego*. This resource is meant to only be used by Kube-Lego and the endpoint
will be reachable over the public URL. This
makes sure that actual traffic can reach the cluster and we do not
unnecessarily try to validate with Let's Encrypt.

Kube-Lego looks for the `secret` *kube-lego-account*; if it does not
exist, Kube-Lego creates it by registering with Let's Encrypt. Finally, the
request for the certificate can be made with Let's Encrypt. Kube-Lego
responds to the HTTP validation via the challenge endpoint and then finally
receives the certificate, which is stored into the `secret` *hello-world-tls*.

The following diagram illustrates this flow and the various interfaces.

{{<img src="/blog/kube-lego/architecture.gif" caption="Kube-Lego process" class="pure-img center" >}}

## Demo

If you want to run these examples, you can always find the latest
version on [GitHub](https://github.com/jetstack/kube-lego/tree/master/examples).

A short demo was also part of the Kubernetes Community Hangout on June 2nd. See the recording [here](https://www.youtube.com/watch?v=M3b8Wzqi56A).

A screencast of an extended demo can be found here:

{{<asciinema castid="47444" class="center" caption="Screencast">}}

## Future work

This is a very early project and does not cover all common use cases.
Feel free to report any issues and enhancements via [GitHub
Issues](https://github.com/jetstack/kube-lego/issues). You can also see some
already identified issues there.
