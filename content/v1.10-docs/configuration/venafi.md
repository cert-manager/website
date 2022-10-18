---
title: Venafi
description: 'cert-manager configuration: Venafi Issuers'
---

The Venafi `Issuer` types allows you to obtain certificates from [Venafi
as a Service (VaaS)](https://vaas.venafi.com/jetstack) and [Venafi Trust Protection
Platform (TPP)](https://www.venafi.com/platform/tls-protect) instances.

You can have multiple different Venafi `Issuer` types installed within the same
cluster, including mixtures of Venafi as a Service and TPP issuer types. This allows
you to be flexible with the types of Venafi account you use.

Automated certificate renewal and management are provided for `Certificates`
using the Venafi `Issuer`.

## Creating an Issuer resource

A single Venafi `Issuer` represents a single Venafi 'zone' so you must create one
`Issuer` resource for each zone you want to use.  A zone is a single entity that
combines the policy that governs certificate issuance with information about how
certificates are organized in Venafi to identify the business application and
establish ownership.

You can configure your `Issuer` resource to either issue certificates only
within a single namespace, or cluster-wide (using a `ClusterIssuer` resource).
For more information on the distinction between `Issuer` and `ClusterIssuer`
resources, read the [Namespaces](../concepts/issuer.md#namespaces) section.

### Creating a Venafi as a Service Issuer

If you haven't already done so, create your Venafi as a Service account on this
[page](https://vaas.venafi.com/jetstack) and copy the API key from your user
preferences.  Then you may want to create a custom CA Account and Issuing Template
or choose instead to use defaults that are automatically created for testing 
("Built-in CA" and "Default", respectively).  Lastly you'll need to create an
Application for establishing ownership of all the certificates requested by your
cert-manager Issuer, and assign to it the Issuing Template.  

> Make a note of the Application name and API alias of the Issuing Template because
> together they comprise the 'zone' you will need for your `Issuer` configuration.

In order to set up a Venafi as a Service `Issuer`, you must first create a Kubernetes
`Secret` resource containing your Venafi as a Service API credentials:

```bash
$ kubectl create secret generic \
       vaas-secret \
       --namespace='NAMESPACE OF YOUR ISSUER RESOURCE' \
       --from-literal=apikey='YOUR_VAAS_API_KEY_HERE'
```

> **Note**: If you are configuring your issuer as a `ClusterIssuer` resource in
> order to serve `Certificates` across your whole cluster, you must set the
> `--namespace` parameter to `cert-manager`, which is the default `Cluster
> Resource Namespace`. The `Cluster Resource Namespace` can be configured
> through the `--cluster-resource-namespace` flag on the cert-manager controller
> component.

This API key will be used by cert-manager to interact with Venafi as a Service
on your behalf.

Once the API key `Secret` has been created, you can create your `Issuer` or
`ClusterIssuer` resource. If you are creating a `ClusterIssuer` resource, you
must change the `kind` field to `ClusterIssuer` and remove the
`metadata.namespace` field.

Save the below content after making your amendments to a file named
`vaas-issuer.yaml`.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: vaas-issuer
  namespace: <NAMESPACE YOU WANT TO ISSUE CERTIFICATES IN>
spec:
  venafi:
    zone: "My Application\My CIT" # Set this to <Application Name>\<Issuing Template Alias>
    cloud:
      apiTokenSecretRef:
        name: vaas-secret
        key: apikey
```

You can then create the Issuer using `kubectl create`.

```bash
$ kubectl create -f vaas-issuer.yaml
```

Verify the `Issuer` has been initialized correctly using `kubectl describe`.

```bash
$ kubectl get issuer vaas-issuer --namespace='NAMESPACE OF YOUR ISSUER RESOURCE' -o wide
NAME           READY   STATUS                 AGE
vaas-issuer    True    Venafi issuer started  2m
```

You are now ready to issue certificates using the newly provisioned Venafi
`Issuer` and Venafi as a Service.

Read the [Issuing Certificates](../usage/certificate.md) document for
more information on how to create Certificate resources.


### Creating a Venafi Trust Protection Platform Issuer

The Venafi Trust Protection Platform integration allows you to obtain certificates
from a properly configured Venafi TPP instance.

The setup is similar to the Venafi as a Service configuration above, however some
of the connection parameters are slightly different.

> **Note**: You *must* allow "User Provided CSRs" as part of your TPP policy, as
> this is the only type supported by cert-manager at this time.
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

In order to set up a Venafi Trust Protection Platform `Issuer`, you must first
create a Kubernetes `Secret` resource containing your Venafi TPP API
credentials.

NOTE: For TPP >= 19.2 use Access Token Authentication
and for older versions of TPP, use username / password authentication.

#### Access Token Authentication

Use access-token authentication if you are connecting to `TPP >= 19.2`.

1. [Set up token authentication](https://docs.venafi.com/Docs/21.1/TopNav/Content/SDK/AuthSDK/t-SDKa-Setup-OAuth.php).

   NOTE: Do not select "Refresh Token Enabled" and set a *long* "Token Validity (days)".

2. Create a new user with sufficient privileges to manage and revoke certificates in a particular policy folder (zone).

   E.g. `k8s-xyz-automation`

3. [Create a new application integration](https://docs.venafi.com/Docs/21.1/TopNav/Content/API-ApplicationIntegration/t-APIAppIntegrations-creatingNew-Aperture.php)

   Create an application integration with name and ID `cert-manager`.
   Set the "API Access Settings" to `Certificates: Read,Manage,Revoke`.

   "Edit Access" to the new application integration, and allow it to be used by the user you created earlier.

4. [Generate an access token](https://github.com/Venafi/vcert/blob/master/README-CLI-PLATFORM.md#obtaining-an-authorization-token)

   ```
   vcert getcred \
     --username k8s-xyz-automation \
     --password somepassword \
     -u https://tpp.example.com/vedsdk \
     --client-id cert-manager \
     --scope "certificate:manage,revoke"
   ```

   This will print an access-token to `stdout`. E.g.

   ```
   vCert: 2020/10/07 16:34:27 Getting credentials
   access_token:  I69n.............y1VjNJT3o9U0Wko19g==
   access_token_expires:  2021-01-05T15:34:30Z
   ```

5. Save the access-token to a Secret in the Kubernetes cluster

```bash
$ kubectl create secret generic \
       tpp-secret \
       --namespace=<NAMESPACE OF YOUR ISSUER RESOURCE> \
       --from-literal=access-token='YOUR_TPP_ACCESS_TOKEN'
```

#### Username / Password Authentication

NOTE: username / password authentication is deprecated and should only be used when connecting to TPP < 19.2.
It requires the username and password of a TPP user to be stored in the Kubernetes cluster
and it does not allow scoped access to the API.
This means that if these credentials are leaked an attacker may gain long term access to the TPP API and web UI.

```bash
$ kubectl create secret generic \
       tpp-secret \
       --namespace=<NAMESPACE OF YOUR ISSUER RESOURCE> \
       --from-literal=username='YOUR_TPP_USERNAME_HERE' \
       --from-literal=password='YOUR_TPP_PASSWORD_HERE'
```

> Note: If you are configuring your issuer as a `ClusterIssuer` resource in
> order to issue `Certificates` across your whole cluster, you must set the
> `--namespace` parameter to `cert-manager`, which is the default `Cluster
> Resource Namespace`. The `Cluster Resource Namespace` can be configured
> through the `--cluster-resource-namespace` flag on the cert-manager controller
> component.

These credentials will be used by cert-manager to interact with your Venafi TPP
instance. Username attribute must be adhere to the `<identity
provider>:<username>` format.  For example: `local:admin`.

Once the Secret containing credentials has been created, you can create your
`Issuer` or `ClusterIssuer` resource. If you are creating a `ClusterIssuer`
resource, you must change the `kind` field to `ClusterIssuer` and remove the
`metadata.namespace` field.

Save the below content after making your amendments to a file named
`tpp-issuer.yaml`.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: tpp-issuer
  namespace: <NAMESPACE YOU WANT TO ISSUE CERTIFICATES IN>
spec:
  venafi:
    zone: \VED\Policy\devops\cert-manager # Set this to the Venafi policy folder you want to use
    tpp:
      url: https://tpp.venafi.example/vedsdk # Change this to the URL of your TPP instance
      caBundle: <base64 encoded string of caBundle PEM file, or empty to use system root CAs>
      credentialsRef:
        name: tpp-secret
```

You can then create the `Issuer` using `kubectl create -f`.

```bash
$ kubectl create -f tpp-issuer.yaml
```

Verify the `Issuer` has been initialized correctly using `kubectl describe`.

```bash
$ kubectl describe issuer tpp-issuer --namespace='NAMESPACE OF YOUR ISSUER RESOURCE'
```

You are now ready to issue certificates using the newly provisioned Venafi
`Issuer` and Trust Protection Platform.

Read the [Issuing Certificates](../usage/certificate.md) document for
more information on how to create Certificate resources.

# Issuer specific annotations

## Custom Fields

Starting `v0.14` you can pass custom fields to Venafi (TPP version `v19.2` and higher) using the `venafi.cert-manager.io/custom-fields` annotation on Certificate resources.
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
        {"name": "field-name", "value": "vield value"},
        {"name": "field-name-2", "value": "vield value 2"}
      ]
...
```
