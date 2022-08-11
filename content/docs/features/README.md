---
title: Features
description: cert-manager offers many features, outlined below. For in depth information about these features, please see the configuration and tutorials pages.
---

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

## Fully integrated Issuers from recognised public and private Certificate Authorities

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
