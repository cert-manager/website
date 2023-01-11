---
title: "Securing Ingresses with ZeroSSL"
linkTitle: "Securing Ingresses with ZeroSSL"
---

# The ZeroSSL

This guide walks you through how to secure a Kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) resource using the ZeroSSL Issuer type.

The ZeroSSL just like Let's Encrypt and its competitors allows to create free 90 days certificates. All is need is to create account at https://zerossl.com/. After that go to developer section and generate `EAB Credentials for ACME Clients`. You will need it later.


`Please note!` \
EAB credentials are not stored in your account, please make sure to note them somewhere. Each click on "Generate" will create a new set of credentials. Even if you create multiple credentials, all of them will remain functional.

`Please note!` \
EAB credentials are one-use only. Create additional pair for different environments.



# Prerequisites

- An AWS account
- kubectl installed
- Access to a publicly registered DNS zone
- Kubernetes cluster, you can use AWS EKS
- [ingress-nginx](https://kubernetes.github.io/ingress-nginx/) deployed and working inside cluster


# Tutorial scenario:

## Installing cert-manager

Make sure you use cert-manager `1.8.2+`/`1.7.3+`. See [link](https://github.com/cert-manager/cert-manager/pull/5226) for more details.

Please walk through the installation guide and return to this step once you
have validated cert-manager is deployed correctly. Follow steps under [running on
Kubernetes](../../installation/helm.md) to install in k8s.

In order to automatically switch to the ZeroSSL we recommend setting default shim by adding the following configuration to values file.

```yaml
ingressShim:
  defaultIssuerName: "zerossl-production"
  defaultIssuerKind: "ClusterIssuer"

installCRDs: true
```

Install it using helm:
```
helm upgrade  --install --namespace cert-manager  --version v1.8.2 cert-manager jetstack/cert-manager -f values.yaml 
```

## Configure your DNS records

The best way to manage DNS using AWS is by using Route53. Create AWS account with permissions to modify Route53 rules.

## EAB secret
Once you will get your credentials first step is to create seed with secrets. They are responsible for authenticating with your ZeroSSL account. 

```bash
$ kubectl create secret generic \
       zero-ssl-eabsecret \
       --namespace=cert-manager \
       --from-literal=secret='YOUR_ZEROSSL_EAB_SECRET'
```

### Another way of creating secret.

Encode it in base64 first.
```bash
echo -n "YOUR_ZEROSSL_EAB_SECRET" | base64 -w 0
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: zero-ssl-eabsecret
data:
  secret: YOUR_ENCODED_ZEROSSL_EAB_SECRET
```
```bash
kubectl apply -f zero-ssl-eabsecret.yaml -n cert-manager
```

## Cluster issuer
Then we must create the `ZeroSSL` `ClusterIssuer`, let's call it `zerossl-production`. In our case we are using AWS. See pre-conditions to provision all required elements.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: zerossl-production
spec:
  acme:
    # ZeroSSL ACME server
    server: https://acme.zerossl.com/v2/DV90
    email: dummy-email@yopmail.com

    # name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: zerossl-prod

    # for each cert-manager new EAB credencials are required
    externalAccountBinding:
      keyID: ZEROSSL_KEY_ID
      keySecretRef:
        name: zero-ssl-eabsecret
        key: secret
      keyAlgorithm: HS256

    # ACME DNS-01 provider configurations to verify domain
    solvers:
    - selector: {}
      dns01:
        route53:
          region: us-west-2
          # optional if ambient credentials are available; see ambient credentials documentation
          # see Route53 for >0 issue "letsencrypt.org" and change to >0 issue "sectigo.com"
          accessKeyID: ACCESS_KEY_ID
          secretAccessKeySecretRef:
            name: route53-credentials-secret
            key: secret-access-key

```

### Then run:

```bash
$ kubectl apply -n cert-manager -f zerossl-production.yaml
```

```bash
$ kubectl describe Clusterissuer  zerossl-prod

Status:
  Acme:
    Last Registered Email:  dummy-email@yopmail.com
    Uri:                    https://acme.zerossl.com/v2/DV90/account/tXXX_NwSv15rlS_XXXX
  Conditions:
    Last Transition Time:  2021-09-09T17:03:26Z
    Message:               The ACME account was registered with the ACME server
    Reason:                ACMEAccountRegistered
    Status:                True
    Type:                  Ready
```

### Please note!
If this step failed and the ACME account is not registered please check if secrets in `zero-ssl-eabsecret` are correct.

## Request a ingress certificate


```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: test-ingress
  namespace: default
spec:
  rules:
  - host: test.example.com
  tls:
  - secretName: secret-tls

```

Apply test-ingress:

```bash
kubectl apply -f ingress.yaml
```

You are set! Check your ingress.
```bash
kubectl describe ingress test-ingress -n default
# check if tls is terminated using secret-tls

openssl s_client -showcerts -connect test.example.com:443
# verify server certificate and its chain
```
