---
title: External Load Balancer
description: 'cert-manager configuration: ACME HTTP-01 challenges using External Load Balancers'
---

When you are using an external load balancer provided by any host, you can face several configuration issues to get it work with cert-manager.

This documentation is intended to help configure the HTTP-01 challenge type for instances behind external load balancer.

## NAT Loopback / Hairpin

The first configuration point is NAT loopback. You can face check issues due to Load Balancer preventing instances behind it to access its external interface.

Some Network Load Balancer have this kind of limitation for several reasons. It can be configured through `iptables` rerouting configuration known as `NAT loopback`.

To check if you are facing this problem :

1. Check that the endpoint of the challenge is accessible to the public : `curl <endpoint>`
2. Check that the challenge endpoint is NOT accessible from inside behind the Load Balancer: use SSH to open a session on a node places behind the LB; then launch the same command than before : `curl <endpoint>`

The `HTTP-01` challenge's endpoint can be found in the logs when the `pre-check` fails. If it does not appear in the logs, you can check the challenge URL by `kubectl`command.

`<endpoint>` is the URL used to test the HTTP-01 from the certificate `Issuer`. For Let's Encrypt for example, the URL is formed like `<domain>/.well-known/acme-challenge/<hash>`


## Load Balancer HTTP endpoints

If you are using a Load Balancer (outside a managed Kubernetes service), you should be able to configure the Load Balancer protocol as HTTP, HTTPS, TCP, UDP. Several Load Balancer now offer free TLS certificates with Let's Encrypt.

When using HTTP(s) protocols for your Load Balancer, it can intercept the challenge URL to replace the response's verification hash with their hash.

In this case, cert-manager will fail `did not get expected response when querying endpoint, expected 'xxxx' but got: yyyy (truncated)`.

This kind of error can be thrown for multiple reasons. This case shows a correctly formatted response, but not the expected one. The solution is to configure the Load Balancer with TCP protocol so that the HTTP request will not be intercepted by the host.