---
title: "Configuring Google's Public Certificate Authority"
linktitle: "Configuring Google's Public Certificate Authority"
---

For years we used `cert-manager` to provision TLS certificates from ZeroSSL. Their ACME service is free, but we've really gotten what we paid for. Service outages were common, and more recently ZeroSSL added undocumented rate limiting for HTTP requests to their ACME API. This change put us in the same situation as this `cert-manager` user: <https://github.com/cert-manager/cert-manager/issues/5867>. We began looking for alternative certificate authorities that support the ACME protocol.

About a year ago, Google announced ACME protocol support for their new Public Certificate Authority. This is the alternative we're looking for. We've configured our system to use this and below I'll show how you can too. We'll follow part of Google's tutorial, but instead of using `certbot`, we'll configure a `ClusterIssuer` and associated `Secret` for `cert-manager`. <https://cloud.google.com/certificate-manager/docs/public-ca-tutorial>

### Prerequisites

- A Google Cloud Platform Account and [Project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
- [`gcloud` CLI installed](https://cloud.google.com/sdk/docs/install) and [initialized](https://cloud.google.com/sdk/docs/initializing)
- `cert-manager` installed on a Kubernetes Cluster with public `Ingress` support

Begin by generating External Account Binding credentials within your GCP Project.

```sh
$ gcloud config set project uffizzi-production-gke
Updated property [core/project]

$ gcloud beta publicca external-account-keys create
```

This will output a private key and an ID number. Take the resulting `b64MacKey` value and base64 encode it.

```sh
echo -n [the b64MacKey] | base64 --wrap=0
```

Copy that value into a YAML file specifying two Kubernetes Resources, a `ClusterIssuer` and a `Secret`.

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: google-public-ca
spec:
  acme:
    email: info@example.com
    externalAccountBinding:
      keyID: 03ffa4c7d6bf48853fb5e63b106e83f1
      keySecretRef:
        key: eab_hmac_key
        name: google-public-ca-eab-secret
    privateKeySecretRef:
      name: google-public-ca-tls
    server: https://dv.acme-v02.api.pki.goog/directory
    solvers:
    - http01:
        ingress:
          class: nginx
---
apiVersion: v1
kind: Secret
metadata:
  name: google-public-ca-eab-secret
  namespace: cert-manager
type: Opaque
data:
  eab_hmac_key: [the base64-encoded key]
```

Apply the YAML file you just wrote to create the Kubernetes resources.

```sh
kubectl apply -f google-public-ca.yaml
```

Confirm that `cert-manager` successfully registered the credentials with Google's ACME service.

```sh
kubectl get clusterissuer google-public-ca -o json | jq '.status.conditions'
```

```json
[
  {
    "lastTransitionTime": "2023-04-06T20:33:55Z",
    "message": "The ACME account was registered with the ACME server",
    "observedGeneration": 1,
    "reason": "ACMEAccountRegistered",
    "status": "True",
    "type": "Ready"
  }
]
```

Now specify an `Ingress` with this annotation and `cert-manager` will provision a certificate from Google's Public CA.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/cluster-issuer: google-public-ca
```

(In our case, we manage these k8s resources using terraform, specifically the `kubernetes_secret` and `kubernetes_manifest` resources.)

Google's Public Certificate Authority is completely free to use, so long as you have a GCP Project to meter its quotas. Unlike ZeroSSL, Google's quotas are published here: <https://cloud.google.com/certificate-manager/docs/quotas#public_ca_request_quotas>

We have not yet bumped up against these quota limits, and now our customers are consistently provisioning certificates with many additional hostnames. This is another example of infrastructure work we do so you can deploy ephemeral environments for all of your project's branches. If you have questions about this or any of our infrastructure, join us on Slack!

(This tutorial was originally authored by Adam Vollrath and [published on Uffizzi's blog](https://www.uffizzi.com/blog/ditching-zerossl-for-google-public-certificate-authority-for-ssl-certificates-via-cert-manager-and-acme-protocol).)