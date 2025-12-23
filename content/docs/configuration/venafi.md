---
title: CyberArk Certificate Manager
description: 'cert-manager configuration: CyberArk Issuers'
---

## Introduction

The CyberArk `Issuer` obtains certificates from
[CyberArk Certificate Manager](https://www.cyberark.com/products/certificate-manager/) SaaS or self-hosted.

The `Issuer` was formerly known as the Venafi `Issuer`, and for backwards compatibility reasons is configured using older product names - "Venafi Cloud" corresponds to CyberArk Certificate Manager SaaS and "Venafi TPP" corresponds to CyberArk Certificate Manager Self-Hosted.

You can have multiple different CyberArk `Issuer` types installed within the same
cluster, including mixtures of issuers configured to enroll from the CyberArk
Certificate Manager SaaS and self-hosted. This allows you to be flexible in the
deployment method that you prefer to use.

Automated certificate renewal and management are provided for `Certificates`
using the CyberArk `Issuer`.

A single CyberArk `Issuer` represents a single CyberArk 'zone' so you must create one
`Issuer` resource for each zone you want to use.  A zone is a single entity that
combines the policy that governs certificate issuance with information about how
certificates are organized in CyberArk to identify the business application and
establish ownership.

You can configure your `Issuer` resource to either issue certificates only
within a single namespace, or cluster-wide (using a `ClusterIssuer` resource).
For more information on the distinction between `Issuer` and `ClusterIssuer`
resources, read the [Namespaces](../concepts/issuer.md#namespaces) section.

## Creating an Issuer for CyberArk Certificate Manager SaaS

If you haven't already done so, create your CyberArk Certificate Manager SaaS
account on this [page](https://www.cyberark.com/try-buy/certificate-manager-saas-trial/)
and copy the API key from your user preferences. Then, you may want to create a
custom CA Account and Issuing Template, or choose to use the defaults created
automatically for testing ("Built-in CA" and "Default", respectively). Lastly,
create an Application to establish ownership of all certificates requested by
your cert-manager Issuer, and assign the Issuing Template to it.

> Make a note of the Application name and API alias of the Issuing Template because
> together they comprise the 'zone' you will need for your `Issuer` configuration.

In order to set up a CyberArk `Issuer`, you must first create a Kubernetes
`Secret` resource containing your API key:

```bash
$ kubectl create secret generic \
       api-key-secret \
       --namespace='NAMESPACE OF YOUR ISSUER RESOURCE' \
       --from-literal=apikey='YOUR_API_KEY_HERE'
```

> **Note**: If you are configuring your issuer as a `ClusterIssuer` resource in
> order to serve `Certificates` across your whole cluster, you must set the
> `--namespace` parameter to `cert-manager`, which is the default `Cluster
> Resource Namespace`. The `Cluster Resource Namespace` can be configured
> through the `--cluster-resource-namespace` flag on the cert-manager controller
> component.

This API key will be used by cert-manager to interact with CyberArk Certificate
Manager SaaS on your behalf.

Once the API key `Secret` has been created, you can create your `Issuer` or
`ClusterIssuer` resource. If you are creating a `ClusterIssuer` resource, you
must change the `kind` field to `ClusterIssuer` and remove the
`metadata.namespace` field.

Save the below content after making your amendments to a file named `issuer.yaml`.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: corp-issuer
  namespace: <NAMESPACE YOU WANT TO ISSUE CERTIFICATES IN>
spec:
  venafi:
    zone: 'My Application\My CIT' # Set this to <Application Name>\<Issuing Template Alias>
    cloud:
      apiTokenSecretRef:
        name: api-key-secret
        key: apikey
```

You can then create the Issuer using `kubectl create`.

```bash
$ kubectl create -f issuer.yaml
```

Verify the `Issuer` has been initialized correctly using `kubectl describe`.

```bash
$ kubectl get issuer corp-issuer --namespace='NAMESPACE OF YOUR ISSUER RESOURCE' -o wide
NAME           READY   STATUS                 AGE
corp-issuer    True    Venafi issuer started  2m
```

You are now ready to issue certificates using the newly provisioned CyberArk
`Issuer` and CyberArk Certificate Manager SaaS.

Read the [Requesting Certificates](../usage/certificate.md) document for
more information on how to create Certificate resources.


## Creating an Issuer for CyberArk Certificate Manager Self-Hosted

The CyberArk `Issuer` (formerly known as Venafi) allows you to obtain
certificates from a properly configured self-hosted instance of CyberArk
Certificate Manager.

The setup is similar to the CyberArk Certificate Manager SaaS configuration
above, however some of the connection parameters are slightly different.

> **Note**: You *must* allow "User Provided CSRs" as part of your policy in
> CyberArk Certificate Manager Self-Hosted, as this is the only type supported
> by cert-manager at this time.
>
> More specifically, the valid configurations of the "CSR handling" are:
>
> - "User Provided CSRs" selected and unlocked,
> - "User Provided CSRs" selected and locked,
> - "Service Generated CSRs" selected and unlocked.
>
> When using "Service Generated CSRs" selected and unlocked, the default CSR
> configuration present in your policy folder will override the configuration of
> your Certificate resource. The subject DN, key algorithm, and key size will be
> overridden by the values set in the policy folder.
>
> With "Service Generated CSRs" selected and locked, the certificate issuance
> will systematically fail with the following message:
>
> ```plain
> 400 PKCS#10 data will not be processed. Policy "\VED\Policy\foo" is locked to a Server Generated CSR.
> ```

In order to set up a CyberArk `Issuer`, you must first create a Kubernetes
`Secret` resource containing your CyberArk Certificate Manager Self-Hosted API
credentials.

### Access Token Authentication

1. [Set up token authentication](https://docs.venafi.com/Docs/current/TopNav/Content/SDK/AuthSDK/t-SDKa-Setup-OAuth.php).

   NOTE: Do not select "Refresh Token Enabled" and set a *long* "Token Validity
   (days)". The Refresh Token feature is not supported by cert-manager's CyberArk
   `Issuer`.

2. Create a new user with sufficient privileges to manage and revoke certificates in a particular policy folder (zone).

   E.g. `k8s-xyz-automation`

3. [Create a new application integration](https://docs.venafi.com/Docs/current/TopNav/Content/API-ApplicationIntegration/t-APIAppIntegrations-creating.php)

   Create an application integration with name and ID `cert-manager.io`.
   Set the "Base Access Settings" to `certificate: manage`.

   "Edit Access" to the new application integration, and allow it to be used by the user you created earlier.

4. [Generate an access token](https://github.com/Venafi/vcert/blob/master/README-CLI-PLATFORM.md#obtaining-an-authorization-token)

   ```
   vcert getcred \
     --username k8s-xyz-automation \
     --password somepassword \
     -u https://tpp.example.com/vedsdk \
     --client-id cert-manager.io \
     --scope "certificate:manage,revoke"
   ```

   This will print an access-token to `stdout`. E.g.

   ```
   vCert: 2025/08/08 16:34:27 Getting credentials
   access_token:  I69n.............y1VjNJT3o9U0Wko19g==
   access_token_expires:  2026-08-08T15:34:30Z
   ```

5. Save the access-token to a Secret in the Kubernetes cluster

    ```bash
    $ kubectl create secret generic \
          tpp-secret \
          --namespace=<NAMESPACE OF YOUR ISSUER RESOURCE> \
          --from-literal=access-token='YOUR_TPP_ACCESS_TOKEN'
    ```

### Username / Password Authentication

> **Note**: when using username  / password authentication, cert-manager will manage the generation of access token for you. cert-manager does not use refresh tokens to renew access token.

1. Create a new user with sufficient privileges to manage certificates in a particular policy folder (zone).

   E.g. `k8s-xyz-automation`

2. [Create a new application integration](https://docs.venafi.com/Docs/current/TopNav/Content/API-ApplicationIntegration/t-APIAppIntegrations-creating.php)

   Create an application integration with name and ID `cert-manager.io`.
   Set the "Base Access Settings" to `certificate: manage`.

   "Edit Access" to the new application integration, and allow it to be used by the user you created earlier.

3. Save the credentials to a Secret in the Kubernetes cluster

    ```bash
    $ kubectl create secret generic \
          tpp-secret \
          --namespace=<NAMESPACE OF YOUR ISSUER RESOURCE> \
          --from-literal=username='YOUR_TPP_USERNAME_HERE' \
          --from-literal=password='YOUR_TPP_PASSWORD_HERE'
    ```


> Note: By default cert-manager uses `cert-manager.io` as client ID when authenticating to CyberArk. You can customize this by adding `client-id` key to the secret:
>```bash
>$ kubectl create secret generic \
>       tpp-secret \
>       --namespace=<NAMESPACE OF YOUR ISSUER RESOURCE> \
>       --from-literal=username='YOUR_TPP_USERNAME_HERE' \
>       --from-literal=password='YOUR_TPP_PASSWORD_HERE' \
>       --from-literal=client-id='YOUR_TPP_CLIENT-ID_HERE'
>```

These credentials will be used by cert-manager to interact with your CyberArk
instance. Username attribute must adhere to the `<identity
provider>:<username>` format.  For example: `local:admin`.

Once the Secret containing credentials has been created, you can create your
`Issuer` or `ClusterIssuer` resource. If you are creating a `ClusterIssuer`
resource, you must change the `kind` field to `ClusterIssuer` and remove the
`metadata.namespace` field.

> ℹ️  If you are using a `ClusterIssuer` resource, the Secret containing the credentials must be in the `Cluster
> Resource Namespace`, which is `cert-manager` by default. The `Cluster Resource Namespace` can be configured
> through the `--cluster-resource-namespace` flag on the cert-manager controller
> component.
> 
> 📖 Read [Issuer Configuration](./README.md#cluster-resource-namespace) to learn more about the concept of a ClusterIssuer and the Cluster Resource Namespace

Save the below content after making your amendments to a file named
`corp-issuer.yaml`.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: corp-issuer
  namespace: <NAMESPACE YOU WANT TO ISSUE CERTIFICATES IN>
spec:
  venafi:
    zone: \VED\Policy\devops\cert-manager # Set this to the policy folder you want to use
    tpp:
      url: https://tpp.venafi.example/vedsdk # Change this to the URL of your CyberArk Certificate Manager Self-Hosted instance
      caBundle: <base64 encoded string of caBundle PEM file, or empty to use system root CAs>
      ## Use only caBundle above or the caBundleSecretRef below. Secret can be created from a ca.crt file by running below command
      ## kubectl create secret generic custom-tpp-ca --from-file=/my/certs/ca.crt -n <cert-manager-namespace>
      # caBundleSecretRef:
      #  name: custom-tpp-ca
      #  key: ca.crt
      credentialsRef:
        name: tpp-secret
```

You can then create the `Issuer` using `kubectl create -f`.

```bash
$ kubectl create -f corp-issuer.yaml
```

Verify the `Issuer` has been initialized correctly using `kubectl describe`.

```bash
$ kubectl describe issuer corp-issuer --namespace='NAMESPACE OF YOUR ISSUER RESOURCE'
```

You are now ready to issue certificates using the newly provisioned CyberArk
`Issuer` and CyberArk Certificate Manager Self-Hosted.

Read the [Requesting Certificates](../usage/certificate.md) document for
more information on how to create Certificate resources.

## Issuer specific annotations

### Custom Fields

Starting `v0.14`, you can pass custom fields to CyberArk Certificate Manager
Self-Hosted using the `venafi.cert-manager.io/custom-fields` annotation on
Certificate resources.
The value is a JSON encoded array of custom field objects having a `name` and `value` key.
For example:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com-certificate
  annotations:
    venafi.cert-manager.io/custom-fields: |-
      [
        {"name": "field-name", "value": "field value"},
        {"name": "field-name-2", "value": "field value 2"}
      ]
...
```

### Issuer Custom Fields

Starting `v1.20`, you can use `venafi.cert-manager.io/custom-fields` annotation on an `Issuer` or `ClusterIssuer` resource.
This configuration would be applied to all Certificate requests created from `Issuer`.

It is possible to override or append custom configuration to `Certificate` resources via the `Issuer` assigned to it. 
For example with an `Issuer` such as:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: corp-issuer
  annotations:
    venafi.cert-manager.io/custom-fields: |-
      [
        {"name": "Environemnt", "value": "Dev"},
      ]
```

and a `Certificate` resource:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com-certificate
  annotations:
    venafi.cert-manager.io/custom-fields: |-
      [
        {"name": "Team", "value": "amber"},
      ]
...
```

Final configuration will be:

```json
{"name": "Environemnt", "value": "Dev"},
{"name": "Team", "value": "amber"}
```
