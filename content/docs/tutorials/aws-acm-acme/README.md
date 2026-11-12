---
title: Issue public certificates from AWS Certificate Manager (ACM) using ACME
description: |
    Learn how to configure cert-manager to request publicly trusted
    certificates from an AWS Certificate Manager (ACM) ACME endpoint,
    using External Account Binding and pre-approved domain validation.
---

In this tutorial you will learn how to use cert-manager with an
[AWS Certificate Manager (ACM) ACME endpoint](https://docs.aws.amazon.com/acm/latest/userguide/acm-acme.html).

ACM can run a managed, RFC 8555 compliant ACME server for your AWS account.
It issues publicly trusted certificates from Amazon Trust Services
to workloads that run outside the AWS managed services,
such as Kubernetes clusters, on-premises servers, and hybrid environments.
cert-manager talks to it like any other ACME server.

> ⚠️ This tutorial has not yet been verified against a live ACM ACME endpoint.
> The steps are derived from the AWS documentation and from the cert-manager source code.
> If you try it, please [report your results](https://github.com/cert-manager/website/issues).

## How ACM ACME differs from Let's Encrypt

Most public ACME servers, such as Let's Encrypt, require the client to prove
control of each domain every time it requests a certificate.
cert-manager does that by solving HTTP-01 or DNS-01 challenges.

ACM ACME endpoints work differently:

- **Domains are approved in advance.** An AWS administrator creates an
  *ACME domain validation* for each domain, backed by a persistent CNAME record.
  The ACME server then returns authorizations that are already `valid`,
  so cert-manager never needs to create a Challenge resource.
- **Every ACME account must use External Account Binding (EAB).**
  Each EAB is bound to an IAM role which ACM assumes when it issues or revokes a certificate.
  You control who can issue certificates with IAM policies and Service Control Policies,
  and every issuance is logged in CloudTrail.
- **Certificates are valid for 45 days.**
  cert-manager renews them automatically using its default renewal settings.
- **Issuance can take up to two minutes.**
  cert-manager waits for the ACME server to finish, so no extra configuration is needed.

Use ACM ACME when you want publicly trusted certificates for Kubernetes workloads
and you want AWS to govern which clusters may issue certificates for which domains.
If you only need certificates for AWS managed services such as
Elastic Load Balancing or CloudFront, use ACM directly instead.
If you need a private CA, use the
[aws-privateca-issuer](https://github.com/cert-manager/aws-privateca-issuer) instead.

## Prerequisites

- An AWS account and the [AWS CLI](https://aws.amazon.com/cli/) configured with permissions to manage ACM and IAM.
- A public DNS zone that you control. The examples use a Route 53 hosted zone,
  which lets ACM create the validation CNAME record for you.
- A Kubernetes cluster with [cert-manager installed](../../installation/README.md).

## Step 1: Create an ACME endpoint

Create an endpoint with pre-approved authorization.
`--contact REQUIRED` makes the endpoint reject ACME accounts that do not supply an email address.
`AllowedKeyAlgorithms` restricts the key types that the endpoint will sign.

```bash
aws acm create-acme-endpoint \
    --authorization-behavior PRE_APPROVED \
    --contact REQUIRED \
    --certificate-authority '{
        "PublicCertificateAuthority": {
            "AllowedKeyAlgorithms": ["RSA_2048", "EC_prime256v1", "EC_secp384r1"]
        }
    }'
```

Note the `AcmeEndpointArn` in the output.
Then retrieve the ACME directory URL of the endpoint:

```bash
aws acm describe-acme-endpoint \
    --acme-endpoint-arn arn:aws:acm:${AWS_REGION}:${AWS_ACCOUNT_ID}:acme-endpoint/${ACME_ENDPOINT_ID} \
    --query 'EndpointUrl' --output text
```

The URL has the form `https://acm-acme-enroll.<region>.api.aws/<uuid>/directory`.
The UUID in the URL is not the endpoint ID from the ARN, so copy the URL exactly as returned.
You will use it as the `server` field of the cert-manager Issuer.

## Step 2: Pre-approve your domain

Create an ACME domain validation for the domain, or parent domain, of the certificates you want to issue.
The `DomainScope` controls whether the exact domain, its subdomains, and wildcards are allowed.
If you supply a Route 53 `HostedZoneId`, ACM creates the validation CNAME record for you.
Otherwise, read the CNAME name and value from the output and create the record yourself.

```bash
aws acm create-acme-domain-validation \
    --acme-endpoint-arn arn:aws:acm:${AWS_REGION}:${AWS_ACCOUNT_ID}:acme-endpoint/${ACME_ENDPOINT_ID} \
    --domain-name example.com \
    --prevalidation-options '{
        "DnsPrevalidation": {
            "DomainScope": {
                "ExactDomain": "ENABLED",
                "Subdomains": "ENABLED",
                "Wildcards": "DISABLED"
            },
            "HostedZoneId": "'"${HOSTED_ZONE_ID}"'"
        }
    }'
```

Wait until the validation status is `VALID`. This can take up to 72 hours,
but is usually much faster when ACM manages the Route 53 record.

```bash
aws acm describe-acme-domain-validation \
    --acme-domain-validation-arn ${ACME_DOMAIN_VALIDATION_ARN} \
    --query 'Status' --output text
```

> ⚠️ The CNAME record must stay in place for as long as you want to issue certificates.
> If it is removed, new Orders fail with the ACME error `urn:ietf:params:acme:error:dns`.

## Step 3: Create an IAM role and EAB credentials

ACM assumes an IAM role on behalf of the ACME account each time it issues a certificate.
Create a role with the following trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "acm-acme.amazonaws.com" },
      "Action": ["sts:AssumeRole", "sts:TagSession", "sts:SetSourceIdentity"],
      "Condition": {
        "StringLikeIfExists": { "sts:SourceIdentity": "acm-acme-*" }
      }
    }
  ]
}
```

Attach a permissions policy that allows `acm:RequestCertificate`.
Add `acm:RevokeCertificate` only if you want this account to be able to revoke certificates.

Then create an External Account Binding bound to that role.
The optional expiration limits how long the EAB can be used to register new ACME accounts.
It does not affect accounts that have already registered.

```bash
aws acm create-acme-external-account-binding \
    --acme-endpoint-arn arn:aws:acm:${AWS_REGION}:${AWS_ACCOUNT_ID}:acme-endpoint/${ACME_ENDPOINT_ID} \
    --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/AcmeIssuanceRole \
    --expiration '{"Value": 7, "Type": "DAYS"}'
```

Retrieve the credentials:

```bash
aws acm get-acme-external-account-binding-credentials \
    --acme-external-account-binding-arn ${ACME_EAB_ARN}
```

The output contains a `KeyId` and a `MacKey`.
`KeyId` goes in the `keyID` field of the Issuer.
`MacKey` goes in a Secret.

Create one EAB per cluster, so that you can revoke a single cluster's access without affecting the others.

## Step 4: Store the MAC key in a Secret

cert-manager expects the MAC key in a Secret, encoded as a base64 URL string.
See [External Account Bindings](../../configuration/acme/README.md#external-account-bindings)
for details of the expected encoding.

```bash
kubectl create secret generic acm-acme-eab \
    --namespace cert-manager \
    --from-literal=secret='<MacKey from the previous step>'
```

## Step 5: Create a ClusterIssuer

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: acm-acme
spec:
  acme:
    # The EndpointUrl from Step 1, copied exactly
    server: https://acm-acme-enroll.<region>.api.aws/<uuid>/directory
    # Required when the endpoint was created with --contact REQUIRED
    email: platform-team@example.com
    privateKeySecretRef:
      name: acm-acme-account-key
    externalAccountBinding:
      # The KeyId from Step 3
      keyID: <KeyId>
      keySecretRef:
        name: acm-acme-eab
        key: secret
    # The ACM ACME endpoint pre-approves domains, so cert-manager never
    # needs to solve a challenge. No solvers are required.
    solvers: []
```

```bash
kubectl apply -f clusterissuer.yaml
kubectl describe clusterissuer acm-acme
```

The ClusterIssuer is `Ready` once cert-manager has registered the ACME account.
If registration fails, check that the `keyID` and Secret match the EAB credentials,
that the EAB has not expired, and that `email` is set.

## Step 6: Request a certificate

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: www-example-com
  namespace: default
spec:
  secretName: www-example-com-tls
  dnsNames:
    - www.example.com
  issuerRef:
    name: acm-acme
    kind: ClusterIssuer
  privateKey:
    # Must be one of the AllowedKeyAlgorithms of the endpoint.
    # ECDSA P-256 is the default in the ACM console; cert-manager
    # defaults to RSA 2048 if privateKey is omitted.
    algorithm: ECDSA
    size: 256
```

```bash
kubectl apply -f certificate.yaml
kubectl wait --for=condition=Ready certificate/www-example-com --timeout=5m
```

Because the domain is pre-approved, the Order goes straight from `pending` to `ready`
and cert-manager finalizes it without creating any Challenge resources.
Issuance can take up to two minutes.

You can confirm that ACM issued the certificate by listing certificates with the `ACME` origin:

```bash
aws acm list-certificates --certificate-key-pair-origins ACME
```

## Troubleshooting

See [Troubleshooting Issuing ACME Certificates](../../troubleshooting/acme.md) for general guidance.
These problems are specific to ACM ACME endpoints:

- **The Order fails with `urn:ietf:params:acme:error:dns`.**
  The validation CNAME record has been removed or changed. Recreate it.
- **The Order fails with `urn:ietf:params:acme:error:unauthorized` or a similar rejection.**
  The requested domain is not covered by a `VALID` domain validation on this endpoint,
  or the certificate key algorithm is not in `AllowedKeyAlgorithms`.
- **The Order creates a Challenge, or the Order has the event `Failed to determine a valid solver configuration`.**
  The ACME server returned a `pending` authorization for one of the domains,
  which means that domain is not pre-approved. Add a domain validation for it, or fix the `DomainScope`.
- **The ClusterIssuer is not `Ready` and reports an account registration error.**
  Check the EAB `KeyId`, the Secret contents, the EAB expiration, and that `email` is set.
- **Issuance fails with an access denied error after the Order is finalized.**
  The IAM role trust policy or permissions are wrong, or a Service Control Policy blocks `acm:RequestCertificate`.
  Look for the `IssueCertificate` event in CloudTrail.

## Limitations

- ACM does not renew ACME certificates. cert-manager handles renewal.
- ACME certificates cannot be attached to Elastic Load Balancing, CloudFront, or API Gateway.
- Revocation is only possible through the ACME protocol. cert-manager does not revoke certificates.
- A certificate can contain at most 100 domain names.
- ACM endpoints are regional. Create the endpoint in the Region closest to your cluster,
  or use [AWS PrivateLink](https://docs.aws.amazon.com/acm/latest/userguide/acm-acme-privatelink.html)
  to reach it without traversing the public internet.

## Further reading

- [AWS: ACME certificate automation in ACM](https://docs.aws.amazon.com/acm/latest/userguide/acm-acme.html)
- [AWS: ACME domain validation](https://docs.aws.amazon.com/acm/latest/userguide/acm-acme-domain-validation.html)
- [AWS: External Account Binding](https://docs.aws.amazon.com/acm/latest/userguide/acm-acme-eab.html)
- [AWS: Troubleshooting ACME](https://docs.aws.amazon.com/acm/latest/userguide/troubleshooting-acme.html)
- [cert-manager: ACME issuer configuration](../../configuration/acme/README.md)
