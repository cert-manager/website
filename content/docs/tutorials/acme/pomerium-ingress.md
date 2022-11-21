---
title: Pomerium Ingress
description: 'cert-manager tutorials: Solving ACME HTTP-01 challenges using Pomerium ingress'
---

This tutorial covers installing the [Pomerium Ingress Controller](https://pomerium.com/docs/k8s/ingress.html) and securing it with cert-manager. [Pomerium](https://pomerium.com) is an identity-aware proxy that can also provide a custom ingress controller for your Kubernetes services.

## Prerequisites

1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) and set the context to the cluster you'll be working with.

1. Pomerium connects to an identity provider (**IdP**) to authenticate users. See one of their [guides](https://www.pomerium.com/docs/identity-providers/) to learn how to set up your IdP of choice to provide oauth2 validation.

1. This tutorial assumes you have a domain space reserved for this cluster (such as `*.example.com`). You will need access to DNS for this domain to assign A and CNAME records as needed.

## Install The Pomerium Ingress Controller

1. Install Pomerium to your cluster:

    ```sh
    kubectl apply -f https://raw.githubusercontent.com/pomerium/ingress-controller/main/deployment.yaml
    ```

    Define a Secret with your IdP configuration. See Pomerium's [Identity Providers](https://www.pomerium.com/docs/identity-providers) pages for more information specific to your IdP:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: idp
      namespace: pomerium
    type: Opaque
    stringData:
      client_id: ${IDP_PROVIDED_CLIENT_ID}
      client_secret: ${IDP_PROVIDED_CLIENT_SECRET}
    ```

    Add the secret to the cluster with `kubectl apply -f`.

1. Define the global settings for Pomerium:

    ```yaml
    apiVersion: ingress.pomerium.io/v1
    kind: Pomerium
    metadata:
      name: global
      namespace: pomerium
    spec:
      secrets: pomerium/bootstrap
      authenticate:
          url: https://authenticate.example.com
      identityProvider:
          provider: ${YOUR_IdP}
          secret: pomerium/idp
    #  certificates:
    #      - pomerium/pomerium-proxy-tls
    ```

    Replace `${YOUR_IdP}` with your identity provider. Apply with `kubectl -f`.

    Note that the last two lines are commented out. They reference a TLS certificate we will create further in the process.

## Install cert-manager

Install cert-manager using any of the methods documented in the [Installation](https://cert-manager.io/docs/installation/) section of the cert-manager docs. The simplest method is to download and apply the provided manifest:

```sh
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.1/cert-manager.yaml
```

## Configure Let's Encrypt Issuer

For communication between the Ingresses and the internet, we'll want to use certificates signed by a trusted certificate authority like Let's Encrypt. This example creates two Let's Encrypt issuers, one for staging and one for production.

The Let's Encrypt production issuer has [strict rate limits](https://letsencrypt.org/docs/rate-limits/). Before your configuration is finalized you may have to recreate services several times, hitting those limits. It's easy to confuse rate limiting with errors in configuration or operation while building your stack.

Because of this, we will start with the Let's Encrypt staging issuer. Once your configuration is all but finalized, we will switch to a production issuer. Both of these issuers are configured to use the [`HTTP01`](../../configuration/acme/http01/README.md) challenge provider.

1. The following YAML defines a staging certificate issuer. You must update the email address to your own. The `email` field is required by Let's Encrypt and used to notify you of certificate expiration and updates.

    ```yaml file=./example/pomerium-staging-issuer.yaml
    ```

    You can download and edit the example and apply it with `kubectl apply -f`, or edit, and apply the custom resource in one command:

    ```bash
    kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/pomerium-staging-issuer.yaml
    ```

1. Create a production issuer and deploy it. As with the staging issuer, update this example with your own email address:

    ```yaml file=./example/pomerium-production-issuer.yaml
    ```

    ```bash
    kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/pomerium-production-issuer.yaml
    ```

1. You can confirm on the status of the issuers after you create them:

    ```bash
    kubectl describe issuer -n pomerium letsencrypt-staging
    kubectl describe issuer -n pomerium letsencrypt-prod
    ```

    You should see the issuer listed with a registered account.

1. Define a certificate for the Pomerium Proxy service. This should be the only certificate you need to manually define:

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
      name: pomerium-proxy-tls
      namespace: pomerium
    spec:
      dnsNames:
      - 'authenticate.example.com'
      issuerRef:
        kind: Issuer
        name: letsencrypt-staging
      secretName: pomerium-proxy-tls
    ```

    Adjust the `dnsNames` value to match your domain space. The subdomain (`authenticate` in our example) must match the domain used for the callback URL in your IdP configuration. Add the certificate with `kubectl -f`.

1. Uncomment the last two lines of the Pomerium global configuration that reference your newly created certificate, and re-apply to the cluster.

Pomerium should now be installed and running in your cluster. You can verify by going to `https://authenticate.example.com` in your browser. Use `kubectl describe pomerium` to review the status of the Pomerium deployment and see recent events.

## Define a Test Service

To test our new Ingress Controller, we will add the [kuard](https://github.com/kubernetes-up-and-running/kuard) app to our cluster and define an Ingress for it.

1. Define the kuard deployment and associated service:

    ```yaml file=./example/deployment.yaml
    ```

    ```yaml file=./example/service.yaml
    ```

    You can download and reference these files locally, or you can reference them from the GitHub source repository for this documentation.

    To install the example service from the tutorial files straight from GitHub:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/deployment.yaml
    kubectl apply -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/service.yaml
    ```

1. Create a new Ingress manifest (`example-ingress.yaml`) for our test service:

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: kuard
      annotations:
        cert-manager.io/issuer: letsencrypt-staging
        ingress.pomerium.io/policy: '[{"allow":{"and":[{"domain":{"is":"example.com"}}]}}]'
    spec:
      ingressClassName: pomerium
      rules:
      - host: kuard.example.com
        http:
          paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: kuard
                port:
                  number: 80
      tls:
        - hosts:
            - kuard.example.com
          secretName: kuard.example.com-tls
    ```

    Again, change the references to `example.com` to match your domain space.

1. Apply the Ingress manifest to the cluster:

   ```bash
   kubectl apply -f example-ingress.yaml
   ```

The Pomerium Ingress Controller will use cert-manager to automatically provision a certificate from the `letsencrypt-staging` issuer for the route to `kuard.example.com`.

Once you've configured all your application services correctly in the cluster, adjust the issuer for your Ingresses (including the Authenticate service) to use `letsencrypt-prod`.
