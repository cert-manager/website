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

## PROXY protocol

Some load balancers and service meshes prepend a
[PROXY protocol](https://www.haproxy.org/download/2.9/doc/proxy-protocol.txt)
header to every TCP connection they forward. The header carries the original
client address, because the backend would otherwise only see the address of the
proxy. Examples include:

- Istio, when a `DestinationRule` sets `trafficPolicy.proxyProtocol`.
- HAProxy, when a `server` line has `send-proxy` or `send-proxy-v2`.
- Envoy, when an upstream cluster uses the `proxy_protocol` transport socket.
- AWS Network Load Balancer, when "Proxy protocol v2" is enabled on the target
  group.

The HTTP-01 solver pod that cert-manager creates speaks plain HTTP. When a
connection starts with a PROXY header instead of an HTTP request line, the pod
answers `400 Bad Request`. The cert-manager self check then fails and the
Challenge never becomes ready:

```text
Waiting for HTTP-01 challenge propagation: wrong status code '400', expected '200'
```

You can confirm this is the cause by sending the same request twice: once from
inside the cluster directly to the `cm-acme-http-solver-*` Service, and once
through the load balancer. If the first returns the challenge key and the
second returns `400`, the proxy is sending a PROXY header.

### Stop sending the header to the solver

The simplest fix is to configure the proxy so that it does not send the PROXY
header to the solver Service. The solver does not use the client address, so
nothing is lost.

With Istio, `trafficPolicy.proxyProtocol` is set per host in a
`DestinationRule`. Scope the rule to the hosts that need it, so that it does
not match the `cm-acme-http-solver-*` Services. See the
[Istio `DestinationRule` reference](https://istio.io/latest/docs/reference/config/networking/destination-rule/#TrafficPolicy-ProxyProtocol).

### Accept the header in the solver

> This option is not yet released. It is proposed in
> [cert-manager PR #9412](https://github.com/cert-manager/cert-manager/pull/9412).

If you cannot change the proxy, you can tell cert-manager to start every solver
pod with PROXY protocol enabled:

```bash
--acme-http01-solver-proxy-protocol
```

With the cert-manager Helm chart, add the flag through `.Values.extraArgs`:

```bash
--set 'extraArgs={--acme-http01-solver-proxy-protocol}'
```

When the flag is set, every solver pod **requires** a PROXY protocol header
(version 1 or 2) on every connection. A connection without a header is closed.
Only enable it when all traffic to the solver pods arrives through a proxy that
sends the header. The flag applies to all HTTP-01 solvers created by that
cert-manager controller; it cannot be set per Issuer.

The solver does not use the client address from the header, so a client that
forges a header gains nothing beyond what it could already do by reaching the
pod directly.
