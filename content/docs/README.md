---
title: What is cert-manager?
description: Creates SSL / TLS certificates in your Kubernetes cluster and automatically renews them before they expire.
---

cert-manager creates SSL / TLS certificates for workloads in your Kubernetes cluster.
It ensures that the certificates are valid and up to date
and it renews certificates at a configured time before expiry.

Typically, the TLS or SSL certificates are stored as Kubernetes secrets.
These certificates can be utilized by applications or ingress controllers.

cert-manager can issue certificates from a variety of supported sources, including
[Let's Encrypt](https://letsencrypt.org), [HashiCorp Vault](https://www.vaultproject.io),
and [Venafi](https://www.venafi.com/) as well as private PKI.

![High level overview diagram explaining cert-manager architecture](/images/high-level-overview.svg)

This website provides the full technical documentation for the project, and can be
used as a reference; if you feel that there's anything missing, please let us know
or [raise a PR](https://github.com/cert-manager/website/pulls) to add it.


## Features

cert-manager offers many features, outlined below.
For in depth information about these features, please click on the relevant tile.

<a style={{float: "left", marginBottom: "20px", padding: "10px", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", textDecoration: "none"}}
    href="../configuration/securing-gateway-resources/">
        <img style={{margin: "0", clear: "right", float: "right", width: "64px"}}
            alt="Google Kubernetes Engine icon" src="/images/icons/google_kubernetes_engine.svg"
            title="Google Kubernetes Engine" />
### Securing Gateway Resources

cert-manager can generate TLS certificates for Gateway resources.
This is configured by adding annotations to a Gateway and is similar to the process for Securing Ingress Resources.
</a>

<a style={{float: "left", marginBottom: "20px", padding: "10px", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", textDecoration: "none"}}
    href="../configuration/securing-pods-with-mTLS/">
        <img style={{margin: "0", clear: "right", float: "right", width: "64px"}}
            alt="Istio" src="/images/icons/istio.png"
            title="Istio" />
### mTLS with integration with Istio

cert-manager can be integrated with Istio using
istio-csr which is an
agent that is responsible for receiving certificate signing requests for all
members of the Istio mesh, and signing them through cert-manager.
</a>

## Automated issuance and renewal of certificates to secure Ingress with TLS

TODO

## Fully integrated Issuers from recognized public and private Certificate Authorities

TODO

## Secure pod-to pod communication with mTLS using private PKI Issuers

TODO

## Backed by major cloud service providers and distributions

TODO

## Ephemeral Certificates Using CSI

[docs](/docs/configuration/empheral-certificates-using-csi.md)

## Policy for cert-manager Certificates

[docs](/docs/configuration/approver-policy.md)

## Integration with the Kubernetes CertificateSigningRequest API

[docs](/docs/features/kube-csr.md)


<footnote>
cert-manager is loosely based upon the work of
[kube-lego](https://github.com/jetstack/kube-lego) and has borrowed some
wisdom from other similar projects such as
[kube-cert-manager](https://github.com/PalmStoneGames/kube-cert-manager).
</footnote>
