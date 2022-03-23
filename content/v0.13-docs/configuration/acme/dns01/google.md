---
title: Google CloudDNS
description: 'cert-manager configuration: ACME DNS-01 challenges using Google CloudDNS'
---

This guide explains how to set up an `Issuer`, or `ClusterIssuer`, to use Google
CloudDNS to solve DNS01 ACME challenges. It's advised you read the [DNS01
Challenge Provider](./README.md) page first for a more general understanding of
how cert-manager handles DNS01 challenges.

> Note: This guide assumes that your cluster is hosted on Google Cloud Platform
> (GCP) and that you already have a domain set up with CloudDNS.

## Set up a Service Account

cert-manager needs to be able to add records to CloudDNS in order to solve the
DNS01 challenge. To enable this, a GCP service account must be created with the
`dns.admin` role.

> Note: For this guide the `gcloud` command will be used to set up the service
> account. Ensure that `gcloud` is using the correct project and zone before
> entering the commands. These steps could also be completed using the Cloud
> Console.

```bash
$ export PROJECT_ID=myproject-id
$ gcloud iam service-accounts create dns01-solver --display-name "dns01-solver"
```
Replace both instances of `$PROJECT_ID` with the ID of your project.
```bash
$ gcloud projects add-iam-policy-binding $PROJECT_ID \
   --member serviceAccount:dns01-solver@$PROJECT_ID.iam.gserviceaccount.com \
   --role roles/dns.admin
```

## Create a Service Account Secret

To access this service account, cert-manager uses a key stored in a Kubernetes
`Secret`. First, create a key for the service account and download it as a JSON
file, then create a `Secret` from this file.

If you did not create the service account `dns01-solver` before, you need to
create it first.

```bash
$ gcloud iam service-accounts create dns01-solver
```

Replace instances of `$PROJECT_ID` with the ID of your project.
```bash
$ gcloud iam service-accounts keys create key.json \
   --iam-account dns01-solver@$PROJECT_ID.iam.gserviceaccount.com
$ kubectl create secret generic clouddns-dns01-solver-svc-acct \
   --from-file=key.json
```

> Note: Keep the key file safe and do not share it, as it could be used to gain
> access to your cloud resources. The key file can be deleted once it has been
> used to generate the `Secret`.

> Note: If you have already added the `Secret` but get an error: `...due to
> error processing: error getting clouddns service account: secret "XXX" not
> found`, the `Secret` may be in the wrong namespace. If you're configuring a
> `ClusterIssuer`, move the `Secret` to the `Cluster Resource Namespace` which
> is `cert-manager` by default.  If you're configuring an `Issuer`, the `Secret`
> should be stored in the same namespace as the `Issuer` resource.

## Create an Issuer That Uses CloudDNS

Next, create an `Issuer` (or `ClusterIssuer`) with a `clouddns` provider. An
example `Issuer` manifest can be seen below with annotations.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    ...
    solvers:
    - dns01:
        clouddns:
          # The ID of the GCP project
          project: $PROJECT_ID
          # This is the secret used to access the service account
          serviceAccountSecretRef:
            name: clouddns-dns01-solver-svc-acct
            key: key.json
```

For more information about `Issuers` and `ClusterIssuers`, see
[Configuration](../../README.md).

Once an `Issuer` (or `ClusterIssuer`) has been created successfully, a
`Certificate` can then be added to verify that everything works.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: example-com
  namespace: default
spec:
  secretName: example-com-tls
  issuerRef:
    # The issuer created previously
    name: example-issuer
  dnsNames:
  - example.com
  - www.example.com
```

For more details about `Certificates`, see [Usage](../../../usage/README.md).