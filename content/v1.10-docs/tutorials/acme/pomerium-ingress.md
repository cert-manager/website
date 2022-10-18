---
title: Pomerium Ingress
description: 'cert-manager tutorials: Solving ACME HTTP-01 challenges using Pomerium ingress'
---

This tutorial covers installing the [Pomerium Ingress Controller](https://pomerium.com/docs/k8s/ingress.html) and securing it with cert-manager. [Pomerium](https://pomerium.com) is an identity-aware proxy that can also provide a custom ingress controller for your Kubernetes services.

## Prerequisites

1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) and set the context to the cluster you'll be working with.

1. Install Helm on your local computer. See [Installing Helm](https://helm.sh/docs/intro/install/) for the best installation method for your operating system.

1. Pomerium connects to an identity provider (**IdP**) to authenticate users. See one of their [guides](https://www.pomerium.com/docs/identity-providers/) to learn how to set up your IdP of choice to provide oauth2 validation.

1. This tutorial assumes you have a domain space reserved for this cluster (such as `*.cluster.example.com`). You will need access to DNS for this domain to assign A and CNAME records as needed.

## Install cert-manager

1. Create a namespace for cert-manager:

    ```bash
    kubectl create namespace cert-manager
    ```

1. Add the `jetstack` repository and update Helm:

    ```bash
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    ```

1. Install cert-manager to your cluster:

    ```bash
    helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace \
    --set installCRDs=true
    ```

1. Confirm deployment with `kubectl get pods --namespace cert-manager`:

    ```bash
    kubectl get pods --namespace cert-manager
    NAME                                       READY   STATUS    RESTARTS   AGE
    cert-manager-5d7f97b46d-8g942              1/1     Running   0          33s
    cert-manager-cainjector-69d885bf55-6x5v2   1/1     Running   0          33s
    cert-manager-webhook-8d7495f4-s5s6p        1/1     Running   0          33s
    ```

## Configure a Private Certificate Issuer

For secure communication between Pomerium services, create a private certificate issuer. This issuer will reside in the `pomerium` namespace, which we will use when creating the Ingress Controller. The certificates issued will only be used for communication between Pomerium components.

1. Define an issuer in the file `pomerium-issuer.yaml`:

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: pomerium-ca
      namespace: pomerium
    spec:
      selfSigned: {}
    ---
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
      name: pomerium-ca
      namespace: pomerium
    spec:
      isCA: true
      secretName: pomerium-ca
      commonName: pomerium ca
      issuerRef:
        name: pomerium-ca
        kind: Issuer
    ---
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: pomerium-issuer
      namespace: pomerium
    spec:
      ca:
        secretName: pomerium-ca
    ```

1. Deploy the issuer:

    ```bash
    kubectl apply -f pomerium-issuer.yaml
    ```

## Configure Let's Encrypt Issuer

For communication between the Ingresses and the internet, we'll want to use certificates signed by a trusted certificate authority like Let's Encrypt. This example creates two Let's Encrypt issuers, one for staging and one for production.

The Let's Encrypt production issuer has [strict rate limits](https://letsencrypt.org/docs/rate-limits/). Before your configuration is finalized you may have to recreate services several times, hitting those limits. It's easy to confuse rate limiting with errors in configuration or operation while building your stack.

Because of this, we will start with the Let's Encrypt staging issuer. Once your configuration is all but finalized, we will switch to a production issuer. Both of these issuers are configured to use the [`HTTP01`](../../configuration/acme/http01/README.md) challenge provider.
<ol>
<li>

The following YAML defines a staging certificate issuer. You must update the email address to your own. The `email` field is required by Let's Encrypt and used to notify you of certificate expiration and updates.

```yaml file=./example/pomerium-staging-issuer.yaml
```

You can download and edit the example and apply it with `kubectl apply -f`, or edit, and apply the custom resource in one command:

```bash
kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/pomerium-staging-issuer.yaml
```
</li>
<li>

Create a production issuer and deploy it. As with the staging issuer, update this example with your own email address:

```yaml file=./example/pomerium-production-issuer.yaml
```

```bash
kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/pomerium-production-issuer.yaml
```
</li>
</ol>

You can confirm on the status of the issuers after you create them:

```bash
kubectl describe issuer letsencrypt-staging
kubectl describe issuer letsencrypt-prod
```

You should see the issuer listed with a registered account.


## Install The Pomerium Ingress Controller

<ol>
<li>

Set your `kubectl` context to the Pomerium namespace:

```bash
kubectl config set-context --current --namespace=pomerium
```

</li><li>

Create certificate configurations for Pomerium. Our example is named `pomerium-certificates.yaml`:

```yaml file=./example/pomerium-certificates.yaml
```

Replace `localhost.pomerium.io` with the domain name you'll assign to the Ingress. Keep the subdomain `authenticate`.

This example defines 2 certificates:
 - One using the self-signed `pomerium-issuer` to encrypt traffic between Pomerium's services,
 - One using the self-signed `pomerium-issuer` to encrypt traffic to and from the Redis service(s) used by Pomerium.

Additional certificates will be issued as new Ingresses are created.
</li><li>

Apply the certificate configuration, and confirm:

```bash
kubectl apply -f pomerium-certificates.yaml
```

```bash
kubectl get certificate
NAME                    READY   SECRET                 AGE
pomerium-ca           True    pomerium-ca              10s
pomerium-cert           True    pomerium-tls           10s
pomerium-redis-cert     True    pomerium-redis-tls     10s
```

</li><li>

Create a values file for Helm to use when installing Pomerium. Our example is named `pomerium-values.yaml`.

```yaml file=./example/pomerium-values.yaml
```

The options required in the `authenticate.idp` block will vary depending on your identity provider.

Update `config.rootDomain` to match your domain space.

</li><li>

Add Pomerium's Helm repo:

```bash
helm repo add pomerium https://helm.pomerium.io
```

</li><li>

Install Pomerium to the cluster:

```bash
helm upgrade --install pomerium pomerium/pomerium --values ./pomerium-values.yaml
```

</li><li>

Use `kubectl` to confirm that the Pomerium Proxy has stood up, and get the external IP needed to route your domain space to the cluster:

```bash
kubectl get svc pomerium-proxy
NAME             TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)                        AGE
pomerium-proxy   LoadBalancer   10.128.117.25    192.0.2.20       443:30006/TCP,9090:30707/TCP   2m37s
```

</li></ol>

## Define a Test Service

To test our new Ingress Controller, we will add the [kuard](https://github.com/kubernetes-up-and-running/kuard) app to our cluster and define an Ingress for it. 

<ol><li>

Define the kuard deployment and associated service:

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
</li><li>

Create a new Ingress manifest (`example-ingress.yaml`) for our test service:

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
  - host: kuard.localhost.pomerium.io
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
        - kuard.localhost.pomerium.io
      secretName: kuard.localhost.pomerium.io-tls
```

Again, change the references to `localhost.pomerium.io` to match your domain space.

</li><li>

Apply the Ingress manifest to the cluster:

   ```bash
   kubectl apply -f example-ingress.yaml
   ```
</li></ol>

The Pomerium Ingress Controller will use cert-manager to automatically provision a certificate from the `letsencrypt-staging` issuer for the route to `kuard.localhost.pomerium.io`.

Once you've configured all your application services correctly in the cluster, adjust the issuer for your Ingresses (including the Authenticate service) to use `letsencrypt-prod`.