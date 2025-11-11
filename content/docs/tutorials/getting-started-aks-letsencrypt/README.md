---
title: Deploy cert-manager on Azure Kubernetes Service (AKS) and use Let's Encrypt to sign a certificate for an HTTPS website
description: |
    Learn how to deploy cert-manager on Azure Kubernetes Service (AKS)
    and configure it to get a signed certificate from Let's Encrypt for an HTTPS web server,
    using the DNS-01 protocol and Azure DNS with workload identity federation.
---

*Last Verified: 11 January 2024*

In this tutorial you will learn how to deploy and configure cert-manager on Azure Kubernetes Service (AKS)
and how to deploy an HTTPS web server and make it available on the Internet.
You will learn how to configure cert-manager to get a signed certificate from Let's Encrypt,
which will allow clients to connect to your HTTPS website securely.
You will configure cert-manager to use the [Let's Encrypt DNS-01 challenge protocol](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge) with Azure DNS,
using workload identity federation to authenticate to Azure.

> **Microsoft Azure**: A suite of cloud computing services by Microsoft.<br/>
> **Kubernetes**: Runs on your servers. Automates the deployment, scaling, and management of containerized applications.<br/>
> **cert-manager**: Runs in Kubernetes. Obtains TLS / SSL certificates and ensures the certificates are valid and up-to-date.<br/>
> **Let’s Encrypt**: An Internet service. Allows you to generate free short-lived SSL certificates.

# Part 1

In the first part of this tutorial you will learn the basics required to deploy an HTTPS website on an Azure Kubernetes cluster using cert-manager to create the SSL certificate for the web server.
You will create a DNS domain for your website, create an Azure Kubernetes cluster, install cert-manager, create an SSL certificate and then deploy a web server which responds to HTTPS requests from clients on the Internet.
But the SSL certificate in part 1 is only for testing purposes.

In part 2 you will learn how to configure cert-manager to use Let's Encrypt and Azure DNS to create a trusted SSL certificate which you can use in production.

## Configure the Azure CLI (`az`)

If your have not already done so, [download and install the Azure CLI (`az`)](https://learn.microsoft.com/en-us/cli/azure/).

Set up the `az` command for interactive use:

```bash
az init
```

Log in, if you have not already done so:

```bash
az login
```

Set the default resource group and location:

```bash
export AZURE_DEFAULTS_GROUP=your-resource-group  # ❗ Your Azure resource group
export AZURE_DEFAULTS_LOCATION=eastus2   # ❗ Your Azure location.
```

> ℹ️ You will need an `az` version `>=2.40.0`. Run `az version` to print the current version.
>
> ℹ️ When you run `az init`, choose "Optimize for interaction" when prompted.
>
> ℹ️ When you run `az login`, a web browser will be opened at https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize.
> Continue the login in the web browser and then return to your terminal.
>>
> 📖 Read the [Azure Command-Line Interface (CLI) documentation](https://learn.microsoft.com/en-us/cli/azure/).
>
> 📖 Read [CLI configuration values and environment variables](https://learn.microsoft.com/en-us/cli/azure/azure-cli-configuration?source=recommendations#cli-configuration-values-and-environment-variables) for more ways to configure the `az` defaults.

## Create a public domain name

In this tutorial you will deploy an HTTPS website with a publicly accessible domain name, so you will need to register a domain unless you already have one.
You could use any [domain name registrar](https://www.cloudflare.com/en-gb/learning/dns/glossary/what-is-a-domain-name-registrar/) to register a domain name for your site.
Here we will use a registrar called `Gandi` and register a cheap domain name for the purposes of this tutorial.
We will use the domain name: `cert-manager-tutorial-22.site` but you should choose your own.

Now that you know your domain name, save it in an environment variable:

```bash
export DOMAIN_NAME=cert-manager-tutorial-22.site # ❗ Replace this with your own DNS domain name
```

And add it to Azure DNS as a zone:

```bash
az network dns zone create --name $DOMAIN_NAME
```

Log in to the control panel for your domain registrar and set the NS records for your domain to match the DNS names of the Azure [authoritative DNS servers](https://www.cloudflare.com/en-gb/learning/dns/dns-server-types/).
You can find these by looking for the NS records of your Azure hosted DNS zone:

```bash
az network dns zone show --name $DOMAIN_NAME --output yaml
```

You can check that the NS records have been updated using `dig` to "trace" the hierarchy of NS records,
rather than using your local DNS resolver:

```bash
dig $DOMAIN_NAME ns +trace +nodnssec
```

> ⏲ It **may** take more than 1 hour for the NS records to be updated in the parent zone,
> and it may take some time for the old NS records to be replaced in the caches of DNS resolver servers,
> if you looked up the DNS name before updating the NS records.
>
> 📖 Read [How do I Update My DNS Records?](https://docs.gandi.net/en/domain_names/common_operations/dns_records.html) in the `Gandi.net` docs,
> or seek the equivalent documentation for your own domain name registrar.

## Create a Kubernetes cluster

To get started, let's create a Kubernetes cluster in Microsoft Azure.
You will need to pick a name for your cluster.
Here, we will go with "test-cluster-1".
Save it in an environment variable:

```bash
export CLUSTER=test-cluster-1
```

Now, create the cluster using the following command:

```bash
az aks create \
    --name ${CLUSTER} \
    --node-count 1 \
    --node-vm-size "Standard_B2s" \
    --load-balancer-sku basic
```

Update your `kubectl` config file with the credentials for your new cluster:

```bash
az aks get-credentials --admin --name "$CLUSTER"
```

Now check that you can connect to the cluster:

```bash
kubectl get nodes -o wide
```

> ⏲ It will take 4-5 minutes to create the cluster.
>
> 💵 To minimize your cloud bill, this command creates a 1-node cluster using a
> low cost virtual machine and load balancer.
>
> ⚠️ This cluster is only suitable for learning purposes it is not suitable for production use.
>
> 📖 Read [Run Kubernetes in Azure the Cheap Way](https://trstringer.com/cheap-kubernetes-in-azure/) for more cost saving tips.
>

## Install cert-manager

Now you can install and configure cert-manager.

Install cert-manager using `helm` as follows:

```bash
helm install \
  cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version [[VAR::cert_manager_latest_version]] \
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

```yaml file=../../../../public/docs/tutorials/getting-started-aks-letsencrypt/clusterissuer-selfsigned.yaml
```
🔗 <a href="clusterissuer-selfsigned.yaml">`clusterissuer-selfsigned.yaml`</a>

```bash
kubectl apply -f clusterissuer-selfsigned.yaml
```

Then use `envsubst` to substitute your chosen domain name into the following Certificate template:

```yaml file=../../../../public/docs/tutorials/getting-started-aks-letsencrypt/certificate.yaml
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
                - www.cert-manager-tutorial-22.site
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
The SSL / TLS key and certificate are supplied to the web server by using the `www-tls` Secret as a volume
and by mounting its contents into the file system of the `hello-app` container in the Pod:

```yaml file=../../../../public/docs/tutorials/getting-started-aks-letsencrypt/deployment.yaml
```
🔗 <a href="deployment.yaml">`deployment.yaml`</a>

```bash
kubectl apply -f deployment.yaml
```

You also need to create a Kubernetes LoadBalancer Service, so that connections from the Internet can be routed to the web server Pod.
When you create the following Kubernetes Service, an Azure load balancer with an ephemeral public IP address will also be created:

```yaml file=../../../../public/docs/tutorials/getting-started-aks-letsencrypt/service.yaml
```
🔗 <a href="service.yaml">`service.yaml`</a>

Create a unique DNS name for the LoadBalancer Service and then apply it:
```bash
export AZURE_LOADBALANCER_DNS_LABEL_NAME=lb-$(uuidgen) # ❗ The label must start with a lowercase ASCII letter
envsubst < service.yaml | kubectl apply -f -
```

Within 2-3 minutes, a load balancer should have been provisioned with a public IP.

```bash
kubectl get service helloweb
```

Sample output

```terminal
$ kubectl get service helloweb
NAME       TYPE           CLUSTER-IP   EXTERNAL-IP     PORT(S)         AGE
helloweb   LoadBalancer   10.0.141.1   20.114.151.62   443:30394/TCP   7m15s
```

The `EXTERNAL-IP` will be different for you and it may be different each time you re-create the LoadBalancer service,
but it will have a stable DNS host name associated with it
because you annotated the Service with `azure-dns-label-name`.
This stable DNS hostname can be used as an alias for your chosen `$DOMAIN_NAME` by creating a [DNS CNAME record](https://www.cloudflare.com/en-gb/learning/dns/dns-records/dns-cname-record/):

```bash
az network dns record-set cname set-record \
    --zone-name $DOMAIN_NAME \
    --cname $AZURE_LOADBALANCER_DNS_LABEL_NAME.$AZURE_DEFAULTS_LOCATION.cloudapp.azure.com \
    --record-set-name www
```

Check that `www.$DOMAIN_NAME` now resolves to the ephemeral public IP address of the load balancer:

```terminal
$ dig www.$DOMAIN_NAME A
...
;; QUESTION SECTION:
;www.cert-manager-tutorial-22.site. IN  A
...
;; ANSWER SECTION:
www.cert-manager-tutorial-22.site. 3600 IN CNAME lb-ec8776e1-d067-4d4c-8cce-fdf07ce48260.eastus2.cloudapp.azure.com.
lb-ec8776e1-d067-4d4c-8cce-fdf07ce48260.eastus2.cloudapp.azure.com. 10 IN A 20.122.27.189
...
```

If the DNS is correct and the load balancer is working and the hello world web server is running,
you should now be able to connect to it using curl or using your web browser:

```bash
curl --insecure -v https://www.$DOMAIN_NAME
```

> ⚠️ We used curl's `--insecure` option because it rejects self-signed certificates by default.
> Later you will learn how to create a trusted certificate signed by Let's Encrypt.

You should see that the certificate has the expected DNS names and that it is self-signed:

```terminal
...
* Server certificate:
*  subject: CN=www.cert-manager-tutorial-22.site
*  start date: Jan  4 15:28:30 2023 GMT
*  expire date: Apr  4 15:28:30 2023 GMT
*  issuer: CN=www.cert-manager-tutorial-22.site
*  SSL certificate verify result: self-signed certificate (18), continuing anyway.
...
Hello, world!
Protocol: HTTP/2.0!
Hostname: helloweb-55cb4cd887-tjlvh
```

> 📖 Read more about [Using a Service to Expose Your App](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/).
>
> 📖 Read more about [Using a public IP address and DNS label with the Azure Kubernetes Service (AKS) load balancer](https://learn.microsoft.com/en-us/azure/aks/static-ip).

# Part 2

In part 1 you created a test certificate.
Now you will learn how to configure cert-manager to use Let's Encrypt and Azure DNS to create a trusted certificate which you can use in production.
You need to prove to Let's Encrypt that you own the domain name of the certificate and one way to do this is to create a special DNS record in that domain.
This is known as the [DNS-01 challenge type](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge).

cert-manager can create that DNS record for you in by using the Azure DNS API  but it needs to authenticate to Azure first,
and currently the most secure method of authentication is to use [workload identity federation](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview).
The advantages of this method are that cert-manager will use an ephemeral Kubernetes ServiceAccount Token to authenticate to Azure and the token need not be stored in a Kubernetes Secret.

> ℹ️ cert-manager `>= v1.11.0` supports workload identity federation for ACME (Let's Encrypt) DNS-01 with Azure DNS.
> Older versions of cert-manager support other authentication mechanisms which are not covered in this tutorial.
>
> 📖 Read about [other ways to configure the ACME issuer with Azure DNS](../../configuration/acme/dns01/azuredns.md).

## Install the Azure workload identity features

The workload identity features in Azure AKS are relatively new (at time of writing) and they require some non-default features to be enabled.

Install the [Azure CLI AKS Preview Extension](https://github.com/Azure/azure-cli-extensions/tree/main/src/aks-preview),
which you will need to configure some advanced workload identity federation features on your AKS cluster.

```bash
az extension add --name aks-preview
```

Register the `EnableWorkloadIdentityPreview` feature flag which is required for the AKS cluster in this demo.

```bash
az feature register --namespace "Microsoft.ContainerService" --name "EnableWorkloadIdentityPreview"

# It takes a few minutes for the status to show Registered. Verify the registration status by using the az feature list command:
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EnableWorkloadIdentityPreview')].{Name:name,State:properties.state}"

# When ready, refresh the registration of the Microsoft.ContainerService resource provider by using the az provider register command:
az provider register --namespace Microsoft.ContainerService
```

> 📖 Read more about [Registering the `EnableWorkloadIdentityPreview` feature flag](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster).

## Reconfigure the cluster

Next enable the workload identity federation features on the cluster that you created earlier:

```bash
az aks update \
    --name ${CLUSTER} \
    --enable-oidc-issuer \
    --enable-workload-identity # ℹ️ This option is currently only available when using the aks-preview extension.
```

> 📖 Read [Deploy and configure workload identity on an Azure Kubernetes Service (AKS) cluster](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster) for more information about the `--enable-workload-identity` feature.

## Reconfigure cert-manager

We will label the cert-manager controller Pod and ServiceAccount for the attention of the Azure Workload Identity webhook,
which will result in the cert-manager controller Pod having an extra volume containing a Kubernetes ServiceAccount token which it will use to authenticate with Azure.

The labels can be configured using the Helm values file below:

```yaml file=../../../../public/docs/tutorials/getting-started-aks-letsencrypt/values.yaml
```
🔗 <a href="values.yaml">`values.yaml`</a>

```bash
existing_cert_manager_version=$(helm get metadata -n cert-manager cert-manager | grep '^VERSION' | awk '{ print $2 }')
helm upgrade cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --reuse-values \
  --namespace cert-manager \
  --version $existing_cert_manager_version \
  --values values.yaml
```

The newly rolled out cert-manager Pod will have some new environment variables set,
and the Azure workload-identity ServiceAccount token as a projected volume:

```bash
kubectl describe pod -n cert-manager -l app.kubernetes.io/component=controller
```

```terminal
Containers:
    ...
    cert-manager-controller:
        ...
        Environment:
        ...
        AZURE_CLIENT_ID:
        AZURE_TENANT_ID:             f99bd6a4-665c-41cf-aff1-87a89d5c62d4
        AZURE_FEDERATED_TOKEN_FILE:  /var/run/secrets/azure/tokens/azure-identity-token
        AZURE_AUTHORITY_HOST:        https://login.microsoftonline.com/
    Mounts:
      /var/run/secrets/azure/tokens from azure-identity-token (ro)
Volumes:
   ...
  azure-identity-token:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3600
```

> 📖 Read about [the role of the Mutating Admission Webhook](https://azure.github.io/azure-workload-identity/docs/installation/mutating-admission-webhook.html) in Azure AD Workload Identity for Kubernetes.
>
> 📖 Read about [other values that can be customized in the cert-manager Helm chart](https://artifacthub.io/packages/helm/cert-manager/cert-manager?modal=values).

## Create an Azure Managed Identity

When cert-manager creates a certificate using Let's Encrypt
it can use DNS records to prove that it controls the DNS domain names in the certificate.
In order for cert-manager to use the Azure API and manipulate the records in the Azure DNS zone,
it needs an Azure account and the best type of account to use is called a "Managed Identity".
This account does not come with a password or an API key and it is designed for use by machines rather than humans.

Choose a managed identity name:

```bash
export USER_ASSIGNED_IDENTITY_NAME=cert-manager-tutorials-1 # ❗ Replace with your preferred managed identity name
```

Create the Managed Identity:

```bash
az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}"
```

Grant it permission to modify the DNS zone records:

```bash
export USER_ASSIGNED_IDENTITY_CLIENT_ID=$(az identity show --name "${USER_ASSIGNED_IDENTITY_NAME}" --query 'clientId' -o tsv)
az role assignment create \
    --role "DNS Zone Contributor" \
    --assignee $USER_ASSIGNED_IDENTITY_CLIENT_ID \
    --scope $(az network dns zone show --name $DOMAIN_NAME -o tsv --query id)
```

> 📖 Read [What are managed identities for Azure resources?](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)
> for an overview of managed identities and their uses.
>
> 📖 Read [Azure built-in roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles) to learn about the "DNS Zone Contributor" role.

## Add a federated identity

Now we will configure Azure to trust certain Kubernetes ServiceAccount tokens,
in particular, the service account tokens from our specific Kubernetes cluster,
and only tokens which are associated with the cert-manager ServiceAccount.
cert-manager will authenticate to Azure using an short lived Kubernetes ServiceAccount token,
and it will be able to impersonate the managed identity that you created in the previous step.

First export the following environment variables containing the name and namespace of the Kubernetes ServiceAccount used by the cert-manager controller:

```bash
export SERVICE_ACCOUNT_NAME=cert-manager # ℹ️ This is the default Kubernetes ServiceAccount used by the cert-manager controller.
export SERVICE_ACCOUNT_NAMESPACE=cert-manager # ℹ️ This is the default namespace for cert-manager.
```

Then configure the managed identity to trust the cert-manager Kubernetes ServiceAccount,
by supplying its "subject" (the distinguishing name of the Kubernetes ServiceAccount)
and its "issuer" (a URL at which the JWT signing certificate and other metadata can be downloaded):

```bash
export SERVICE_ACCOUNT_ISSUER=$(az aks show --resource-group $AZURE_DEFAULTS_GROUP --name $CLUSTER --query "oidcIssuerProfile.issuerUrl" -o tsv)
az identity federated-credential create \
  --name "cert-manager" \
  --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
  --issuer "${SERVICE_ACCOUNT_ISSUER}" \
  --subject "system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
```

> 📖 Read about [Workload identity federation](https://learn.microsoft.com/en-us/azure/active-directory/develop/workload-identity-federation) in the Microsoft identity platform documentation.


## Create a ClusterIssuer for Let's Encrypt Staging

A ClusterIssuer is a custom resource which tells cert-manager how to sign a Certificate.
In this case the ClusterIssuer will be configured to connect to the Let's Encrypt staging server,
which allows us to test everything without using up our Let's Encrypt certificate quota for the domain name.

Save the following content to a file called `clusterissuer-lets-encrypt-staging.yaml`, change the `email` field to use your email address and apply it:

```yaml file=../../../../public/docs/tutorials/getting-started-aks-letsencrypt/clusterissuer-lets-encrypt-staging.yaml
```
🔗 <a href="clusterissuer-lets-encrypt-staging.yaml">`clusterissuer-lets-encrypt-staging.yaml`</a>


As you can see there are some variables in the `clusterissuer-lets-encrypt-staging.yaml` which need to be filled in before we apply it;
most have been defined earlier in this tutorial but you need to set the following:

```bash
export EMAIL_ADDRESS=<email-address> # ❗ Replace this with your email address
export AZURE_SUBSCRIPTION=<your-subscription-or-billing-account>  # ❗ Replace this with your Azure account name
```

Now use `envsubst` to fill in the variables and pipe it into `kubectl apply`, as follows:

```bash
export AZURE_SUBSCRIPTION_ID=$(az account show --name $AZURE_SUBSCRIPTION --query 'id' -o tsv)
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
    Last Transition Time:  2022-11-29T13:05:33Z
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

```yaml file=../../../../public/docs/tutorials/getting-started-aks-letsencrypt/clusterissuer-lets-encrypt-production.yaml
```
🔗 <a href="clusterissuer-lets-encrypt-production.yaml">`clusterissuer-lets-encrypt-production.yaml`</a>


```bash
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
*  subject: CN=cert-manager-tutorial-22.site
*  start date: Nov 30 15:41:40 2022 GMT
*  expire date: Feb 28 15:41:39 2023 GMT
*  subjectAltName: host "www.cert-manager-tutorial-22.site" matched cert's "www.cert-manager-tutorial-22.site"
*  issuer: C=US; O=Let's Encrypt; CN=R3
*  SSL certificate verify ok.
...
```

That concludes this tutorial.
You have learned how to deploy cert-manager on Azure AKS and how to configure it to issue Let's Encrypt signed certificates using the DNS-01 protocol with Azure DNS.
You have learned about workload identity federation in Azure and learned how to configure cert-manager to authenticate to Azure using a Kubernetes ServiceAccount Token.

## Cleanup

After completing the tutorial you can clean up by deleting the cluster, the domain name and the managed identity, as follows:

```
az aks delete --name $CLUSTER
az network dns zone delete --name $DOMAIN_NAME
az identity delete --name $USER_ASSIGNED_IDENTITY_NAME
```

## Next Steps

> 📖 Read other [cert-manager tutorials](../README.md) and [getting started guides](../../getting-started/README.md).
>
> 📖 Read more about [configuring the cert-manager ACME issuer with Azure DNS](../../configuration/acme/dns01/azuredns.md).
