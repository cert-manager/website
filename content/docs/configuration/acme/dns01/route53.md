---
title: Route53
description: 'cert-manager configuration: ACME DNS-01 challenges using Amazon AWS Route53 DNS'
---

This guide explains how to set up an `Issuer`, or `ClusterIssuer`, to use Amazon
Route53 to solve DNS01 ACME challenges. It's advised you read the [DNS01
Challenge Provider](./README.md) page first for a more general understanding of
how cert-manager handles DNS01 challenges.

> ℹ️ This guide assumes that your cluster is hosted on Amazon Web Services
> (AWS) and that you already have a hosted zone in Route53.
>
> 📖 Read the [AWS + LoadBalancer + Let's Encrypt](../../../tutorials/getting-started-aws-letsencrypt/README.md)
> tutorial, which contains end-to-end instructions for those who are new to
> cert-manager and AWS.

## Set up an IAM Policy

cert-manager needs to be able to add records to Route53 in order to solve the
DNS01 challenge. To enable this, create a IAM policy with the following
permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "route53:GetChange",
      "Resource": "arn:aws:route53:::change/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:ChangeResourceRecordSets",
        "route53:ListResourceRecordSets"
      ],
      "Resource": "arn:aws:route53:::hostedzone/*"
    },
    {
      "Effect": "Allow",
      "Action": "route53:ListHostedZonesByName",
      "Resource": "*"
    }
  ]
}
```

> ℹ️ The `route53:ListHostedZonesByName` statement can be removed if you
> specify the (optional) `hostedZoneID`. You can further tighten the policy by
> limiting the hosted zone that cert-manager has access to (e.g.
> `arn:aws:route53:::hostedzone/DIKER8JEXAMPLE`).
>
> 📖 Read about [actions supported by Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/APIReference/API_Operations_Amazon_Route_53.html),
> in the [Amazon Route 53 API Reference](https://docs.aws.amazon.com/Route53/latest/APIReference/Welcome.html).
>
> 📖 Learn how [`eksctl` can automatically create the cert-manager IAM policy](https://eksctl.io/usage/iam-policies/#cert-manager-policy), if you use EKS.

## Credentials

cert-manager needs an [AWS access key](https://docs.aws.amazon.com/glossary/latest/reference/glos-chap.html#access_key),
to authenticate to the Route53 API.
An access key is defined by AWS as follows:
> **access key**:
> The combination of an access key ID (for example, `AKIAIOSFODNN7EXAMPLE`) and a secret access key (for example, `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`). You use access keys to sign API requests that you make to AWS.

You have two options:
1. (Legacy) Use an [IAM User and a long-term access key](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html).
2. (Best Practice) Use an [IAM Role with temporary security credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-workloads-use-roles).

Using an IAM Role with temporary security credentials is considered best practice because:
1. You do not have to store the long-term access key (e.g. in a Secret)
2. You don't have to manage [access key rotation](https://docs.aws.amazon.com/glossary/latest/reference/glos-chap.html#keyrotate).

cert-manager supports multiple ways to get the access key and these can be categorized as either "ambient" or "non-ambient".

### Ambient Credentials

Ambient credentials are credentials which are made available in the cert-manager controller Pod by one of the following mechanisms:
- [**EKS Pod Identity**](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html):<br/>
  where cert-manager gets credentials from an [EKS Auth API which runs on every Kubernetes node](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-how-it-works.html).
- [**EKS IAM Roles for Service Accounts (IRSA)**](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html):<br/>
  where cert-manager uses a Kubernetes ServiceAccount token which is [mounted into the cert-manager controller Pod](https://docs.aws.amazon.com/eks/latest/userguide/pod-configuration.html).
- [**EC2 Instance Metadata Service (IMDS)**](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-metadata-security-credentials.html):<br/>
  where cert-manager gets credentials from the `iam/security-credentials/<role-name>` endpoint of IMDS.
- [**Environment variables**](https://docs.aws.amazon.com/sdkref/latest/guide/environment-variables.html):<br/>
  where cert-manager loads credentials from `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables
  in the cert-manager controller Pod, if those variables are present.
- [**Shared config and credentials files**](https://docs.aws.amazon.com/sdkref/latest/guide/file-format.html):<br/>
  where cert-manager loads credentials from files (`~/.aws/config` and `~/.aws/credentials`) which are mounted into the cert-manager controller Pod.

The advantage of ambient credentials is that they are easier to set up and
extensively documented by Amazon AWS.
The disadvantage of ambient credentials is that they are globally available to
all ClusterIssuer and all Issuer resources, which means that in a multi-tenant
environment, any tenant who has permission to create Issuer or ClusterIssuer may
use the ambient credentials and gain the permissions granted to that account.

> 📖 Read [AWS SDKs and Tools standardized credential providers](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html)
> to learn how cert-manager supports all these ambient credential sources.
>
> ⚠️ By default, cert-manager will only use ambient credentials for
> `ClusterIssuer` resources, not `Issuer` resources.
>
> This is to prevent unprivileged users, who have permission to create Issuer
> resources, from issuing certificates using credentials that cert-manager
> incidentally has access to.
> ClusterIssuer resources are cluster scoped (not namespaced) and only platform
> administrators should be granted permission to create them.
>
> ⚠️ It is possible (but not recommended) to enable ambient authentication mechanisms
> for `Issuer` resources, by setting the `--issuer-ambient-credentials` flag on
> the cert-manager controller to true.

Here is an example of a `ClusterIssuer` for using Route53 ambient credentials:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    ...
    solvers:
    - dns01:
        route53: {}
```

> ℹ️ Regardless of which ambient mechanism you use, the `route53` section is left empty,
> because cert-manager can find the credentials, role, and region by looking for environment variables
> which will be added to the cert-manager Pod.

#### EKS Pod Identity

[EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) is the simplest way to use ambient credentials,
if you deploy cert-manager on EKS.
It is a four step process:
1. [Setup the EKS Pod Identity agent](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-agent-setup.html) in your cluster.
2. [Assign an IAM role to the cert-manager Kubernetes service account](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-association.html).
3. Restart the cert-manager Deployment
   so that the EKS Pod Identity Agent can inject the necessary environment variables into the Pods.
4. Create a `ClusterIssuer` resource:

   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-prod
   spec:
     acme:
       solvers:
       - dns01:
           route53: {}
   ```

#### EKS IAM Role for Service Accounts (IRSA)

[IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) is another way to use ambient credentials,
if you deploy cert-manager on EKS.
It is more complicated than Pod Identity and requires coordination between the Kubernetes cluster administrator and the AWS account manager.
It involves annotating the `cert-manager` ServiceAccount in Kubernetes, and setting up an IAM role, a trust policy and a trust relationship in AWS.
A mutating webhook will automatically setup a mounted service account volume in the cert-manager Pod.

1. **Create an IAM OIDC provider for your cluster**

   To use IRSA with cert-manager you must first enable the feature for your cluster.
   Follow the [official documentation](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html).

2. **Create a trust relationship**

   In this configuration an IAM role is mapped to the cert-manager `ServiceAccount` allowing it to authenticate with AWS.
   The IAM role you map to the `ServiceAccount` will need permissions on any and all Route53 zones cert-manager will be using.
   Create a trust relationship by adding the following trust policy to the IAM role:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Principal": {
           "Federated": "arn:aws:iam::<aws-account-id>:oidc-provider/oidc.eks.<aws-region>.amazonaws.com/id/<eks-hash>"
         },
         "Condition": {
           "StringEquals": {
             "oidc.eks.<aws-region>.amazonaws.com/id/<eks-hash>:sub": "system:serviceaccount:<namespace>:<service-account-name>"
           }
         }
       }
     ]
   }
   ```

   Replace the following:

   - `<aws-account-id>` with the AWS account ID of the EKS cluster.
   - `<aws-region>` with the region where the EKS cluster is located.
   - `<eks-hash>` with the hash in the EKS API URL; this will be a random 32 character hex string (example: `45DABD88EEE3A227AF0FA468BE4EF0B5`)
   - `<namespace>` with the namespace where cert-manager is running.
   - `<service-account-name>` with the name of the `ServiceAccount` object created by cert-manager.


   > ℹ️ If you're following the Cross Account example, this trust policy is attached to the cert-manager role in Account X with ARN `arn:aws:iam::XXXXXXXXXXX:role/cert-manager`.
   > The permissions policy is the same as above.

3. **Annotate the cert-manager `ServiceAccount`**

   ```yaml
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     annotations:
       eks.amazonaws.com/role-arn: arn:aws:iam::XXXXXXXXXXX:role/cert-manager
   ```

   The cert-manager Helm chart provides a variable for injecting annotations into cert-manager's `ServiceAccount` like so:

   ```yaml
   serviceAccount:
     annotations:
       eks.amazonaws.com/role-arn: arn:aws:iam::XXXXXXXXXXX:role/cert-manager
   ```

   > ℹ️ If you're following the Cross Account example, modify the `ClusterIssuer` with the role from Account Y.

3. **(optional) Update file system permissions**

   You may also need to modify the cert-manager `Deployment` with the correct file system permissions, so the `ServiceAccount` token can be read.

   ```yaml
   spec:
     template:
       spec:
         securityContext:
           fsGroup: 1001
   ```

   The cert-manager Helm chart provides a variable for modifying cert-manager's `Deployment` like so:

   ```yaml
   securityContext:
     fsGroup: 1001
   ```

4. **Restart the cert-manager Deployment**

    Restart the cert-manager Deployment, so that the webhook can inject the
    necessary `volume`, `volumemount`, and environment variables into the Pods.

5. **Create a `ClusterIssuer` resource**

   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-prod
   spec:
     acme:
       solvers:
       - dns01:
           route53: {}
   ```

### Non-ambient Credentials

Non-ambient credentials are credentials which are explicitly configured on the Issuer or ClusterIssuer resource.
For example:
- **Access key Secret reference**:<br/>
  where cert-manager loads a long-term access key from a Kubernetes Secret resource.
- **ServiceAccount reference**:<br/>
  where cert-manager gets a ServiceAccount token (signed JWT) from the Kubernetes API server,
  and uses the STS AssumeRoleWithWebIdentity endpoint to exchange it for temporary AWS credentials.

The advantage of non-ambient credentials is that cert-manager can perform Route53 operations in a multi-tenant environment.
Each tenant can be granted permission to create and update Issuer resources in their namespace and they can provide their own AWS credentials in their namespace.

#### Referencing your own ServiceAccount within in an Issuer or ClusterIssuer

> 📖 Read the [AWS + LoadBalancer + Let's Encrypt tutorial](../../../tutorials/getting-started-aws-letsencrypt/README.md)
> to learn how to deploy cert-manager on EKS and use this authentication mechanism.

In this configuration you can reference your own `ServiceAccounts` in your `Issuer` or `ClusterIssuer`
and cert-manager will get a ServiceAccount token from the Kubernetes API which it will send to STS in exchange for AWS temporary credentials.
The advantage of this method over IRSA or Pod Identity is that each Issuer can reference a different `ServiceAccount`,
which means you can lock down the permissions,
such that each `ServiceAccount` is mapped to an IAM role that only has permission to update the zones it needs for that particular

1. **Create a ServiceAccount**

   In order to reference a `ServiceAccount` it must first exist.
   Unlike normal IRSA the `eks.amazonaws.com/role-arn` annotation is not required.

   ```yaml
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: <service-account-name>
   ```

2. **Create an IAM role trust policy**

   For every `ServiceAccount` you want to use for AWS authentication you must first set up a trust policy:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Principal": {
           "Federated": "arn:aws:iam::<aws-account-id>:oidc-provider/oidc.eks.<aws-region>.amazonaws.com/id/<eks-hash>"
         },
         "Condition": {
           "StringEquals": {
             "oidc.eks.<aws-region>.amazonaws.com/id/<eks-hash>:sub": "system:serviceaccount:<namespace>:<service-account-name>"
           }
         }
       }
     ]
   }
   ```

   Replace the following:

   - `<aws-account-id>` with the AWS account ID of the EKS cluster.
   - `<aws-region>` with the region where the EKS cluster is located.
   - `<eks-hash>` with the hash in the EKS API URL; this will be a random 32 character hex string (example: `45DABD88EEE3A227AF0FA468BE4EF0B5`)
   - `<namespace>` with the namespace of the `ServiceAccount` object.
   - `<service-account-name>` with the name of the `ServiceAccount` object.

3. **Create an RBAC Role and RoleBinding**

   In order to allow cert-manager to issue a token using your `ServiceAccount` you must deploy some RBAC to the cluster:

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: <service-account-name>-tokenrequest
     namespace: <service-account-namespace>
   rules:
     - apiGroups: ['']
       resources: ['serviceaccounts/token']
       resourceNames: ['<service-account-name>']
       verbs: ['create']
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: cert-manager-<service-account-name>-tokenrequest
     namespace: <service-account-namespace>
   subjects:
     - kind: ServiceAccount
       name: <cert-manager-service-account-name>
       namespace: <cert-manager-namespace>
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: Role
     name: <service-account-name>-tokenrequest
   ```

   Replace the following:

   - `<service-account-name>` name of the `ServiceAccount` object.
   - `<service-account-namespace>` namespace of the `ServiceAccount` object.
   - `<cert-manager-service-account-name>` name of cert-managers `ServiceAccount` object, as created during cert-manager installation.
   - `<cert-manager-namespace>` namespace that cert-manager is deployed into.

4. **Create an Issuer or ClusterIssuer**

   You should be ready at this point to configure an Issuer to use the new `ServiceAccount`.
   You can see example config for this below:

   ```yaml
   apiVersion: cert-manager.io/v1
   kind: Issuer
   metadata:
     name: example
   spec:
     acme:
       ...
       solvers:
       - dns01:
           route53:
             region: us-east-1
             role: <iam-role-arn> # This must be set so cert-manager what role to attempt to authenticate with
             auth:
               kubernetes:
                 serviceAccountRef:
                   name: <service-account-name> # The name of the service account created
   ```

#### Referencing a long-term access key within in an Issuer or ClusterIssuer

In this mechanism, cert-manager will load the credentials from a Secret resource.
If you use an `Issuer` resource, the Secret must be in the same namespace as the Issuer.
If you use a `ClusterIssuer` resource, the Secret must be in the `cert-manager` namespace
or what ever value is supplied to the `--cluster-resource-namespace` [option of the cert-manager component](../../../cli/controller.md).
Here is an example configuration for a `ClusterIssuer`:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    ...
    solvers:
    - dns01:
        route53:
          region: eu-central-1
          accessKeyIDSecretRef:
            name: prod-route53-credentials-secret
            key: access-key-id
          secretAccessKeySecretRef:
            name: prod-route53-credentials-secret
            key: secret-access-key
          # (optional) you can also assume a role with these credentials
          role: arn:aws:iam::YYYYYYYYYYYY:role/dns-manager
```

## Cross Account Access

Example: Account Y manages Route53 DNS Zones. Now you want cert-manager running in Account X (or many other accounts) to be able to manage records in Route53 zones hosted in Account Y.

First, create a role with the permissions policy above (let's call the role `dns-manager`)
in Account Y, and attach a trust relationship like the one below.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::XXXXXXXXXXX:role/cert-manager"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Bear in mind, that you won't be able to define this policy until `cert-manager` role on account Y is created. If you are setting this up using a configuration language, you may want to define principal as:

```json
"Principal": {
        "AWS": "XXXXXXXXXXX"
      }
```
And restrict it, in a future step, after all the roles are created.

This allows the role `cert-manager` in Account X to assume the `dns-manager` role in Account Y to manage the Route53 DNS zones in Account Y. For more information visit the [official
documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html).

Second, create the cert-manager role in Account X; this will be used as a credentials source for the cert-manager pods running in Account X. Attach to the role the following **permissions** policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Resource": "arn:aws:iam::YYYYYYYYYYYY:role/dns-manager",
      "Action": "sts:AssumeRole"
    }
  ]
}
```

And the following trust relationship (Add AWS `Service`s as needed):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

## Region

If you omit the `.spec.acme.solvers.dns01.route53.region` field, cert-manager
will get the region from the `AWS_REGION` and `AWS_DEFAULT_REGION` environment
variables if they are set in the cert-manager controller Pod.

If you use [ambient credentials](#ambient-credentials), the `AWS_REGION` and
`AWS_DEFAULT_REGION` environment variables have a higher priority, and the
`.spec.acme.solvers.dns01.route53.region` field will only be used if the
environment variables are not set.

The `.spec.acme.solvers.dns01.route53.region` field is ignored if you use [EKS Pod Identities](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html),
because an `AWS_REGION` environment variable is added to the cert-manager controller Pod by
the [Amazon EKS Pod Identity Agent](https://github.com/aws/eks-pod-identity-agent).

The `.spec.acme.solvers.dns01.route53.region` field is ignored if you use [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html),
because an `AWS_REGION` environment variable is added to the cert-manager controller Pod by
the [Amazon EKS Pod Identity Webhook](https://github.com/aws/amazon-eks-pod-identity-webhook).

> ℹ️ Route53 is a global service and does not have regional endpoints, but the region
> is used as a hint to help compute the correct AWS credential scope and partition
> when it connects to Route53.
>
> 📖 Read [Amazon Route 53 endpoints and quotas](https://docs.aws.amazon.com/general/latest/gr/r53.html) and
> [Global services](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/global-services.html)
> to learn more.

> ℹ️ STS is a regional service and cert-manager will use regional STS endpoint URLs
> computed from the `region` field or environment variables.
> STS is used for [IRSA credentials](#eks-iam-role-for-service-accounts-irsa), [dedicated ServiceAccount credentials](#referencing-your-own-serviceaccount-within-in-an-issuer-or-clusterissuer), and [cross account access](#cross-account-access).
>
> 📖 Read [Manage AWS STS in an AWS Region](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_enable-regions.html)
> to learn about which regions support STS.
>
> 📖 Read [AWS STS Regional endpoints](https://docs.aws.amazon.com/sdkref/latest/guide/feature-sts-regionalized-endpoints.html),
> to learn how to configure the use of regional STS endpoints using environment variables.
