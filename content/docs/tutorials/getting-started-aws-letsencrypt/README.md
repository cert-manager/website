---
title: Deploy cert-manager on AWS Elastic Kubernetes Service (EKS) and use Let's Encrypt to sign a TLS certificate for an HTTPS website
description: |
    Learn how to deploy cert-manager on AWS Elastic Kubernetes Service (EKS)
    and configure it to get a signed TLS (SSL) certificate from Let's Encrypt for an HTTPS web server,
    using the DNS-01 protocol and AWS Route53 DNS.
---

*Last Verified: 9 September 2024*

In this tutorial you will learn how to deploy and configure cert-manager on AWS Elastic Kubernetes Service (EKS)
and how to deploy an HTTPS web server and make it available on the Internet.
You will learn how to configure cert-manager to get a signed certificate from Let's Encrypt,
which will allow clients to connect to your HTTPS website securely.
You will configure cert-manager to use the [Let's Encrypt DNS-01 challenge protocol](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge) with AWS Route53 DNS.
You will authenticate to Route53 using a [dedicated Kubernetes ServiceAccount token](../../configuration/acme/dns01/route53.md#referencing-your-own-serviceaccount-within-in-an-issuer-or-clusterissuer).

# Part 1

In the first part of this tutorial you will learn the basics required to deploy an HTTPS website on an AWS Elastic Kubernetes Service (EKS) cluster, using cert-manager to create the SSL certificate for the web server.
You will create a DNS domain for your website, create an EKS cluster, install cert-manager, create a TLS certificate and then deploy a web server which responds to HTTPS requests from clients on the Internet.
The TLS certificate in part 1 is only for testing purposes; in part 2 you will learn how to configure cert-manager to use Let's Encrypt and Route53 DNS to create a trusted certificate which you can use in production.

## Configure the AWS CLI (`aws`)

If your have not already done so, [download and install the AWS CLI (`aws`)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

Set up the `aws` command for interactive use:

```bash
aws configure
```

Set the default [output format](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-output-format.html) and region:

```bash
export AWS_DEFAULT_OUTPUT=json # ❗ Use JSON output for this tutorial
export AWS_DEFAULT_REGION=us-west-2   # ❗ Your AWS region.
```

> 📖 Read
> [Set up the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html), and
> [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html),
> to learn more about configuring `aws`.

## Create a public domain name

In this tutorial you will deploy an HTTPS website with a publicly accessible domain name, so you will need to register a domain unless you already have one.
You could use any [domain name registrar](https://www.cloudflare.com/en-gb/learning/dns/glossary/what-is-a-domain-name-registrar/) to register a domain name for your site.
For example you could use `Gandi` and register a cheap domain name for the purposes of this tutorial.

Now that you know your domain name, save it in an environment variable:

```bash
export DOMAIN_NAME=example.com # ❗ Replace this with your own DNS domain name
```

And add it to AWS Route53 as a zone:

```bash
aws route53 create-hosted-zone --caller-reference $(uuidgen) --name $DOMAIN_NAME
```

The details of the created zone will be printed to the console:

```json
{
    "Location": "https://route53.amazonaws.com/2013-04-01/hostedzone/Z0984294TRL0R8AT3SQA",
    "HostedZone": {
        "Id": "/hostedzone/Z0984294TRL0R8AT3SQA",
        "Name": "cert-manager-aws-tutorial.richard-gcp.jetstacker.net.",
        "CallerReference": "77274711-b648-4da5-81b7-74512897d0db",
        "Config": {
            "PrivateZone": false
        },
        "ResourceRecordSetCount": 2
    },
    "ChangeInfo": {
        "Id": "/change/C04685872DX6N6587E1TL",
        "Status": "PENDING",
        "SubmittedAt": "2024-09-03T16:29:11.960000+00:00"
    },
    "DelegationSet": {
        "NameServers": [
            "ns-1504.awsdns-60.org",
            "ns-538.awsdns-03.net",
            "ns-278.awsdns-34.com",
            "ns-1765.awsdns-28.co.uk"
        ]
    }
}
```

Log in to the control panel for your domain registrar and set the NS records for your domain to match the DNS names of the [authoritative DNS servers](https://www.cloudflare.com/en-gb/learning/dns/dns-server-types/) for your Route53 hosted zone.
See `NameServers` in the output of `aws route53 create-hosted-zone` (above) or you can find the name servers later:

```bash
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name $DOMAIN_NAME --query "HostedZones[0].Id" --output text)
aws route53 get-hosted-zone --id ${HOSTED_ZONE_ID}
```

You can check that the NS records have been updated by using `dig` to "trace" the hierarchy of NS records:

```bash
dig $DOMAIN_NAME ns +trace +nodnssec
```

> ⏲ It **may** take more than 1 hour for the NS records to be updated in the parent zone,
> and it may take some time for the old NS records to be replaced in the caches of DNS resolver servers,
> if you looked up the DNS name before updating the NS records.
>
> 📖 Read [How do I Update My DNS Records?](https://docs.gandi.net/en/domain_names/common_operations/dns_records.html) in the `Gandi.net` docs,
> or seek the equivalent documentation for your own domain name registrar.

## Create an EKS Kubernetes cluster

To get started, let's create a Kubernetes cluster using EKS.
The easiest way to create an EKS cluster is with `eksctl`.
[Download and install `eksctl`](https://eksctl.io/installation/).

Pick a name for your cluster and save it in an environment variable:

```bash
export CLUSTER=test-cluster-1
```

Now, create the cluster using the following command:

```bash
eksctl create cluster \
  --name $CLUSTER \
  --nodegroup-name node-group-1 \
  --node-type t3.small \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed \
  --spot
```

This will update your `kubectl` config file with the credentials for your new cluster.

Check that you can connect to the cluster:

```bash
kubectl get nodes -o wide
```

> ⏲ It will take 15-20 minutes to create the cluster. Why?
> See [Reduction in EKS cluster creation time](https://github.com/aws/containers-roadmap/issues/1227).
>
> 💵 To minimize your cloud bill, this command creates a 3-node cluster using
> [low cost virtual machines](https://aws.amazon.com/ec2/instance-types/t3) and
> [spot instances](https://eksctl.io/usage/spot-instances/).
>
> ⚠️ This cluster is only suitable for learning purposes it is not suitable for production use.

## Install cert-manager

Now you can install and configure cert-manager.

Install cert-manager using `helm` as follows:

```bash
helm install cert-manager cert-manager \
  --repo https://charts.jetstack.io \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true
```

This will create three Deployments and some Services and Pods in a new namespace called `cert-manager`.
It also installs various cluster scoped supporting resources such as RBAC roles and Custom Resource Definitions.

You can view some of the resources that have been installed as follows:

```bash
kubectl -n cert-manager get all
```

And you can explore the Custom Resource Definitions (cert-manager's API) using `kubectl explain`, as follows:

```bash
kubectl explain Certificate
kubectl explain CertificateRequest
kubectl explain Issuer
```

> 📖 Read about [other ways to install cert-manager](../../installation/README.md).
>
> 📖 Read more about [Certificates and Issuers](../../concepts/README.md).

## Create a test ClusterIssuer and a Certificate

Now everything is ready for you to create your first certificate.
This will be a self-signed certificate but later we'll replace it with a Let's Encrypt signed certificate.

```yaml file=../../../../public/docs/tutorials/getting-started-aws-letsencrypt/clusterissuer-selfsigned.yaml
```
🔗 <a href="clusterissuer-selfsigned.yaml">`clusterissuer-selfsigned.yaml`</a>

```bash
kubectl apply -f clusterissuer-selfsigned.yaml
```

Then use `envsubst` to substitute your chosen domain name into the following Certificate template:

```yaml file=../../../../public/docs/tutorials/getting-started-aws-letsencrypt/certificate.yaml
```
🔗 <a href="certificate.yaml">`certificate.yaml`</a>

```bash
envsubst < certificate.yaml | kubectl apply -f -
```

> 🔗 If you don't already have `envsubst` installed you can [download and install a Go implementation of `envsubst`](https://github.com/a8m/envsubst).

Use `cmctl status certificate` to check the status of the Certificate:

```bash
cmctl status certificate www
```

If successful, the private key and the signed certificate will be stored in a Secret called `www-tls`.
You can use `cmctl inspect secret www-tls` to decode the base64 encoded X.509 content of the Secret:

```terminal
$ cmctl inspect secret www-tls
...
Valid for:
        DNS Names:
                - www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net
        URIs: <none>
        IP Addresses: <none>
        Email Addresses: <none>
        Usages:
                - digital signature
                - key encipherment
                - server auth
...
```

## Deploy a sample web server

Now deploy a simple web server which responds to HTTPS requests with "hello world!".
The TLS key and certificate are supplied to the web server by using the `www-tls` Secret as a volume
and by mounting its contents into the file system of the `hello-app` container in the Pod:

```yaml file=../../../../public/docs/tutorials/getting-started-aws-letsencrypt/deployment.yaml
```
🔗 <a href="deployment.yaml">`deployment.yaml`</a>

```bash
kubectl apply -f deployment.yaml
```

You also need to create a Kubernetes LoadBalancer Service, so that connections from the Internet can be routed to the web server Pod.
When you create the following Kubernetes Service, an AWS classic load balancer with an ephemeral public IP address will also be created:

```yaml file=../../../../public/docs/tutorials/getting-started-aws-letsencrypt/service.yaml
```
🔗 <a href="service.yaml">`service.yaml`</a>

```bash
kubectl apply -f service.yaml
```

Within 2-3 minutes, a load balancer should have been provisioned with a public IP.

```bash
kubectl get service helloweb
```

Sample output

```terminal
$ kubectl get service helloweb
NAME       TYPE           CLUSTER-IP       EXTERNAL-IP                                                              PORT(S)         AGE
helloweb   LoadBalancer   10.100.175.247   ae25d292150aa4e3e90e6c25376f9a7d-496307726.us-west-2.elb.amazonaws.com   443:32184/TCP   6m
```

The `EXTERNAL-IP` will be different for you and it may be different each time you re-create the LoadBalancer service,
but it will have a stable DNS host name associated with it.

> ℹ️ By default, EKS creates [classic](https://aws.amazon.com/elasticloadbalancing/features/#Product_comparisons)
> load balancers for LoadBalancer Services in the cluster,
> using the [Legacy Cloud Provider Load balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html#lbc-legacy).
> This is convenient for this tutorial because it does not require any additional software or configuration, but
> [AWS Cloud Provider Load balancer Controller is legacy and is currently only receiving critical bug fixes](https://aws.github.io/aws-eks-best-practices/networking/loadbalancing/loadbalancing/#choosing-load-balancer-type)
> according to the [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/).
> Consider using the [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) instead.

The stable DNS host name of the load balancer can be used as an alias for the `www` record in your chosen `$DOMAIN_NAME`
by creating a Route53 [Alias Record](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html):

```bash
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name $DOMAIN_NAME --query "HostedZones[0].Id" --output text)
ELB_CANONICAL_HOSTED_ZONE_NAME=$(kubectl get svc helloweb --output=jsonpath='{ .status.loadBalancer.ingress[0].hostname }')
aws elb describe-load-balancers --query "LoadBalancerDescriptions[?CanonicalHostedZoneName == '$ELB_CANONICAL_HOSTED_ZONE_NAME'] | [0]" \
| jq '{
  "Comment": "Creating an alias record",
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.\($DOMAIN_NAME)",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": .CanonicalHostedZoneNameID,
          "DNSName": .CanonicalHostedZoneName,
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}' \
    --arg DOMAIN_NAME "${DOMAIN_NAME}" \
| aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch file:///dev/stdin
```

> ℹ️ Read [Routing traffic to an ELB load balancer](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer.html)
> to learn more about this task.
>
> ℹ️ The script uses a [`JMESPath` query](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html)
> to get the ELB for the Kubernetes Service by matching against the DNS name.
>
> 📖 There is an alternative way to manage the DNS record for the load balancer, using [ExternalDNS](https://kubernetes-sigs.github.io/external-dns/latest/).
> ExternalDNS synchronizes exposed Kubernetes Services and Ingresses with DNS providers.
> Read [ExternalDNS for usage within a Kubernetes cluster on AWS](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md) to learn more.


Check that `www.$DOMAIN_NAME` now resolves to the ephemeral public IP address of the load balancer:

```terminal
$ dig www.$DOMAIN_NAME A
...
;; QUESTION SECTION:
;www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net. IN A

;; ANSWER SECTION:
www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net. 60 IN A 34.212.236.229
www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net. 60 IN A 44.232.234.71
www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net. 60 IN A 35.164.69.198
```

If the DNS is correct and the load balancer is working and the hello world web server is running,
you should now be able to connect to it using curl or using your web browser:

```bash
curl --insecure -v https://www.$DOMAIN_NAME
```

> ⚠️ We used curl's `--insecure` option because curl will reject the untrusted certificate we generated otherwise.
> Later you will learn how to create a trusted certificate signed by Let's Encrypt.

You should see that the certificate has the expected DNS names and that it is self-signed:

```terminal
...
* Server certificate:
*  subject: CN=www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net
*  start date: Sep  4 08:43:56 2024 GMT
*  expire date: Dec  3 08:43:56 2024 GMT
*  issuer: CN=www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net
*  SSL certificate verify result: self-signed certificate (18), continuing anyway.
...
Hello, world!
Protocol: HTTP/2.0!
Hostname: helloweb-55cb4cd887-tjlvh
```

> 📖 Read more about [Using a Service to Expose Your App](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/).

# Part 2

In part 1 you created a test certificate.
Now you will learn how to configure cert-manager to use Let's Encrypt and AWS Route53 DNS to create a trusted certificate which you can use in production.
You need to prove to Let's Encrypt that you own the domain name of the certificate and one way to do this is to create a special DNS record in that domain.
This is known as the [DNS-01 challenge type](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge).

cert-manager can create that DNS record for you in by using the AWS Route53 API but it needs to authenticate first,
and currently the most secure method of authentication is to use a [dedicated Kubernetes ServiceAccount token](../../configuration/acme/dns01/route53.md#referencing-your-own-serviceaccount-within-in-an-issuer-or-clusterissuer).
The advantages of this method are that cert-manager will use an ephemeral Kubernetes ServiceAccount Token to authenticate to AWS and the token need not be stored in a Kubernetes Secret.

> 📖 Read about [other ways to configure the ACME issuer with AWS Route53 DNS](../../configuration/acme/dns01/route53.md).

## Create an IAM OIDC provider for your cluster

```sh
eksctl utils associate-iam-oidc-provider --cluster $CLUSTER --approve
```

> ℹ️ Read [Create an IAM OIDC provider for your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) for more details.

## Create an IAM policy

```bash
aws iam create-policy \
     --policy-name cert-manager-acme-dns01-route53 \
     --description "This policy allows cert-manager to manage ACME DNS01 records in Route53 hosted zones. See https://cert-manager.io/docs/configuration/acme/dns01/route53" \
     --policy-document file:///dev/stdin <<EOF
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
EOF
```

> ℹ️ Read the [cert-manager ACME DNS01 Route53 configuration documentation](../../configuration/acme/dns01/route53.md),
> for more details of this IAM policy.

## Create an IAM role and associate it with a Kubernetes service account

The following command performs three tasks:
1. creates a new dedicated Kubernetes ServiceAccount in the cert-manager namespace, and
1. configures a new AWS Role with the permissions defined in the policy from the previous step.
1. configures the Role so that it can be only be assumed by clients with tokens for new dedicated Kubernetes ServiceAccount in this EKS cluster.

```sh
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
eksctl create iamserviceaccount \
  --name cert-manager-acme-dns01-route53 \
  --namespace cert-manager \
  --cluster ${CLUSTER} \
  --role-name cert-manager-acme-dns01-route53 \
  --attach-policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/cert-manager-acme-dns01-route53 \
  --approve
```

> ℹ️ Read [Assign IAM roles to Kubernetes service accounts](https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html),
> for more details.

## Grant permission for cert-manager to create ServiceAccount tokens

cert-manager needs permission to generate a JWT token for the Kubernetes ServiceAccount that you created in the previous step.
Apply the following RBAC Role and RoleBinding in the cert-manager namespace:

```yaml file=../../../../public/docs/tutorials/getting-started-aws-letsencrypt/rbac.yaml
```
🔗 <a href="rbac.yaml">`rbac.yaml`</a>

```sh
kubectl apply -f rbac.yaml
```

## Create a ClusterIssuer for Let's Encrypt Staging

A ClusterIssuer is a custom resource which tells cert-manager how to sign a Certificate.
In this case the ClusterIssuer will be configured to connect to the Let's Encrypt staging server,
which allows us to test everything without using up our Let's Encrypt certificate quota for the domain name.

Save the following content to a file called `clusterissuer-lets-encrypt-staging.yaml`, change the `email` field to use your email address and apply it:

```yaml file=../../../../public/docs/tutorials/getting-started-aws-letsencrypt/clusterissuer-lets-encrypt-staging.yaml
```
🔗 <a href="clusterissuer-lets-encrypt-staging.yaml">`clusterissuer-lets-encrypt-staging.yaml`</a>


As you can see there are some variables in the `clusterissuer-lets-encrypt-staging.yaml` which need to be filled in before we apply it;
most have been defined earlier in this tutorial but you need to set the following:

```bash
export EMAIL_ADDRESS=<email-address> # ❗ Replace this with your email address
```

Now use `envsubst` to fill in the variables and pipe it into `kubectl apply`, as follows:

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
envsubst < clusterissuer-lets-encrypt-staging.yaml | kubectl apply -f  -
```

You can check the status of the ClusterIssuer:

```bash
kubectl describe clusterissuer letsencrypt-staging
```

Example output

```console
Status:
  Acme:
    Last Registered Email:  firstname.lastname@example.com
    Uri:                    https://acme-staging-v02.api.letsencrypt.org/acme/acct/77882854
  Conditions:
    Last Transition Time:  2024-09-04T15:41:18Z
    Message:               The ACME account was registered with the ACME server
    Observed Generation:   1
    Reason:                ACMEAccountRegistered
    Status:                True
    Type:                  Ready
```

> ℹ️ Let's Encrypt uses the Automatic Certificate Management Environment (ACME) protocol
> which is why the configuration above is under a key called `acme`.
>
> ℹ️ The email address is only used by Let's Encrypt to remind you to renew the certificate after 30 days before expiry. You will only receive this email if something goes wrong when renewing the certificate with cert-manager.
>
> ℹ️ The Let's Encrypt production issuer has [very strict rate limits](https://letsencrypt.org/docs/rate-limits/).
> When you're experimenting and learning, it can be very easy to hit those limits. Because of that risk,
> we'll start with the Let's Encrypt staging issuer, and once we're happy that it's working
> we'll switch to the production issuer.
>
> 📖 Read more about [configuring the ACME Issuer](../../configuration/acme/README.md).
>

## Re-issue the Certificate using Let's Encrypt

Patch the Certificate to use the staging ClusterIssuer:

```bash
kubectl patch certificate www --type merge  -p '{"spec":{"issuerRef":{"name":"letsencrypt-staging"}}}'
```

That should trigger cert-manager to renew the certificate:
Use `cmctl` to check:

```bash
cmctl status certificate www
cmctl inspect secret www-tls
```

And finally, when the new certificate has been issued, you must restart the web server to use it:

```bash
kubectl rollout restart deployment helloweb
```

You should once again be able to connect to the website, but this time you will see the Let's Encrypt staging certificate:

```terminal
$ curl -v --insecure https://www.$DOMAIN_NAME
...
* Server certificate:
*  subject: CN=www.cert-manager-tutorial-22.site
*  start date: Jan  5 12:41:14 2023 GMT
*  expire date: Apr  5 12:41:13 2023 GMT
*  issuer: C=US; O=(STAGING) Let's Encrypt; CN=(STAGING) Artificial Apricot R3
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
...
Hello, world!
Protocol: HTTP/2.0!
Hostname: helloweb-9b8bcdd56-6rxm8
```

> ⚠️ We used curl's `--insecure` option again here because the Let's Encrypt staging issuer creates untrusted certificates.
> Next you will learn how to create a trusted certificate signed by the Let's Encrypt production issuer.

## Create a production ready certificate

Now that everything is working with the Let's Encrypt staging server, we can switch to the production server and get a trusted certificate.

Create a Let's Encrypt production Issuer by copying the staging ClusterIssuer YAML and modifying the server URL and the names,
then apply it:

```yaml file=../../../../public/docs/tutorials/getting-started-aws-letsencrypt/clusterissuer-lets-encrypt-production.yaml
```
🔗 <a href="clusterissuer-lets-encrypt-production.yaml">`clusterissuer-lets-encrypt-production.yaml`</a>


```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
envsubst < clusterissuer-lets-encrypt-production.yaml | kubectl apply -f  -
```

Check the status of the ClusterIssuer:

```bash
kubectl describe clusterissuer letsencrypt-production
```

Patch the Certificate to use the production ClusterIssuer:

```bash
kubectl patch certificate www --type merge  -p '{"spec":{"issuerRef":{"name":"letsencrypt-production"}}}'
```

That should trigger cert-manager to renew the certificate:
Use `cmctl` to check:

```bash
cmctl status certificate www
cmctl inspect secret www-tls
```

And finally, when the new certificate has been issued, you must restart the web server to use it:

```bash
kubectl rollout restart deployment helloweb
```

Now you should be able to connect to the web server securely, without the `--insecure` flag,
and if you visit the site in your web browser, it should show a padlock (🔒) symbol next to the URL.

```bash
curl -v https://www.$DOMAIN_NAME
```

```terminal
...

* Server certificate:
*  subject: CN=www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net
*  start date: Sep  4 19:32:24 2024 GMT
*  expire date: Dec  3 19:32:23 2024 GMT
*  subjectAltName: host "www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net" matched cert's "www.cert-manager-aws-tutorial.richard-gcp.jetstacker.net"
*  issuer: C=US; O=Let's Encrypt; CN=R11
*  SSL certificate verify ok.
...
```

That concludes this tutorial.
You have learned how to deploy cert-manager on AWS EKS and how to configure it to issue Let's Encrypt signed certificates using the DNS-01 protocol with Route53 DNS.
You have learned about IAM Roles for service accounts (IRSA) and learned how to configure cert-manager to authenticate to AWS Route53 using a Kubernetes ServiceAccount token.

# Cleanup

After completing the tutorial you can clean up by deleting the EKS cluster and the Route53 hosted zone, as follows:

```
eksctl delete cluster --name $CLUSTER
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name $DOMAIN_NAME --query "HostedZones[0].Id" --output text)
aws route53 delete-hosted-zone --id ${HOSTED_ZONE_ID}
```

The IAM policy, role, and identity provider can be deleted manually from the AWS web UI.

# Next Steps

> 📖 Read other [cert-manager tutorials](../README.md) and [getting started guides](../../getting-started/README.md).
>
> 📖 Read more about [configuring the cert-manager ACME issuer with Route53 DNS](../../configuration/acme/dns01/route53.md).
