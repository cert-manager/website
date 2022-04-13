---
title: Route53
description: 'cert-manager configuration: ACME DNS-01 challenges using Amazon AWS Route53 DNS'
---

This guide explains how to set up an `Issuer`, or `ClusterIssuer`, to use Amazon
Route53 to solve DNS01 ACME challenges. It's advised you read the [DNS01
Challenge Provider](./README.md) page first for a more general understanding of
how cert-manager handles DNS01 challenges.

> Note: This guide assumes that your cluster is hosted on Amazon Web Services
> (AWS) and that you already have a hosted zone in Route53.

## Set up an IAM Role

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

> Note: The `route53:ListHostedZonesByName` statement can be removed if you
> specify the (optional) `hostedZoneID`. You can further tighten the policy by
> limiting the hosted zone that cert-manager has access to (e.g.
> `arn:aws:route53:::hostedzone/DIKER8JEXAMPLE`).

## Credentials

You have two options for the set up - either create a user or a role and attach
that policy from above.  Using a role is considered best practice because you do
not have to store permanent credentials in a secret.

cert-manager supports two ways of specifying credentials:

- explicit by providing a `accessKeyID` and `secretAccessKey`
- or implicit (using [metadata
  service](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html)
  or [environment variables or credentials
  file](https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials).

cert-manager also supports specifying a `role` to enable cross-account access
and/or limit the access of cert-manager. Integration with
[`kiam`](https://github.com/uswitch/kiam) and
[`kube2iam`](https://github.com/jtblin/kube2iam) should work out of the box.


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

## Creating an Issuer (or `ClusterIssuer`)

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

    # example: cross-account zone management for example.com
    # this solver uses ambient credentials (i.e. inferred from the environment or EC2 Metadata Service)
    # to assume a role in a different account
    - selector:
        dnsZones:
          - "example.com"
      dns01:
        route53:
          region: us-east-1
          hostedZoneID: DIKER8JEXAMPLE # optional, see policy above
          role: arn:aws:iam::YYYYYYYYYYYY:role/dns-manager

    # this solver handles example.org challenges
    # and uses explicit credentials
    - selector:
        dnsZones:
          - "example.org"
      dns01:
        route53:
          region: eu-central-1
          accessKeyID: AKIAIOSFODNN7EXAMPLE
          secretAccessKeySecretRef:
            name: prod-route53-credentials-secret
            key: secret-access-key
          # you can also assume a role with these credentials
          role: arn:aws:iam::YYYYYYYYYYYY:role/dns-manager
```

Note that, as mentioned above, the pod is using `arn:aws:iam::XXXXXXXXXXX:role/cert-manager` as a credentials source in Account X, but the `ClusterIssuer` ultimately assumes the `arn:aws:iam::YYYYYYYYYYYY:role/dns-manager` role to actually make changes in Route53 zones located in Account Y.

## EKS IAM Role for Service Accounts (IRSA)

While [`kiam`](https://github.com/uswitch/kiam) / [`kube2iam`](https://github.com/jtblin/kube2iam) work directly with cert-manager, some special attention is needed for using the [IAM Roles for Service Accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) feature available on EKS.

### OIDC provider

First follow the AWS documentation [Enabling IAM roles for service accounts on your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) to ensure that the OIDC provider for the EKS cluster is enabled. The OIDC information is needed to create the trust relationship for the cert-manager role below.

### IAM role trust policy

The cert-manager role needs the following trust relationship attached to the role in order to use the IRSA method. Replace the following:

- `<aws-account-id>` with the AWS account ID of the EKS cluster.
- `<aws-region>` with the region where the EKS cluster is located.
- `<eks-hash>` with the hash in the EKS API URL; this will be a random 32 character hex string (example: `45DABD88EEE3A227AF0FA468BE4EF0B5`)
- `<namespace>` with the namespace where cert-manager is running.
- `<service-account-name>` with the name of the `ServiceAccount` object created by cert-manager.

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

**Note:** If you're following the Cross Account example above, this trust policy is attached to the cert-manager role in Account X with ARN `arn:aws:iam::XXXXXXXXXXX:role/cert-manager`. The permissions policy is the same as above.

### Service annotation

Annotate the `ServiceAccount` created by cert-manager:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::XXXXXXXXXXX:role/cert-manager
```

You will also need to modify the cert-manager `Deployment` with the correct file system permissions, so the `ServiceAccount` token can be read.

```yaml
spec:
  template:
    spec:
      securityContext:
        fsGroup: 1001
```

The cert-manager Helm chart provides a variable for injecting annotations into cert-manager's `ServiceAccount` and `Deployment` object like so:

```yaml
serviceAccount:
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::XXXXXXXXXXX:role/cert-manager
securityContext:
  enabled: true
  fsGroup: 1001
```

**Note:** If you're following the Cross Account example above, modify the `ClusterIssuer` in the same way as above with the role from Account Y.