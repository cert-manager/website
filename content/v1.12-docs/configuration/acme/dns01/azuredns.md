---
title: AzureDNS
description: 'cert-manager configuration: ACME DNS-01 challenges using AzureDNS'
---

cert-manager can create and then delete DNS-01 records in Azure DNS but it needs to authenticate to Azure first.
There are four authentication methods available:

- [Managed Identity Using AAD Workload Identity](#managed-identity-using-aad-pod-identity) (recommended)
- [Managed Identity Using AAD Pod Identities](#managed-identity-using-aad-pod-identities) (deprecated)
- [Managed Identity Using AKS Kubelet Identity](#managed-identity-using-aks-kubelet-identity)
- [Service Principal](#service-principal)

## Managed Identity Using AAD Workload Identity

> ℹ️ This feature is available in cert-manager `>= v1.11.0`.
>
> 📖 Read the [AKS + LoadBalancer + Let's Encrypt tutorial](../../../tutorials/getting-started-aks-letsencrypt/README.md) for an end-to-end example of this authentication method.

Azure AD workload identity (preview) on Azure Kubernetes Service (AKS) allows cert-manager to authenticate to Azure using a Kubernetes ServiceAccount Token and then to manage DNS-01 records in Azure DNS.
This is the recommended authentication method because it is more secure and easier to maintain than the other methods.

### Reconfigure the cluster

Enable the workload identity federation features on your cluster.
If you have an Azure AKS cluster you can use the following command:

```bash
az aks update \
    --name ${CLUSTER} \
    --enable-oidc-issuer \
    --enable-workload-identity # ℹ️ This option is currently only available when using the aks-preview extension.
```

> ℹ️ You can [install the Azure workload identity extension on other managed and self-managed clusters](https://azure.github.io/azure-workload-identity/docs/installation.html) if you are not using Azure AKS.
>
> 📖 Read [Deploy and configure workload identity on an Azure Kubernetes Service (AKS) cluster](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster) for more information about the `--enable-workload-identity` feature.
>
### Reconfigure cert-manager

Label the cert-manager controller Pod and ServiceAccount for the attention of the Azure Workload Identity webhook,
which will result in the cert-manager controller Pod having an extra volume containing a Kubernetes ServiceAccount token which it will use to authenticate with Azure.

If you installed cert-manager using Helm, the labels can be configured using Helm values:

```yaml
# values.yaml
podLabels:
  azure.workload.identity/use: "true"
serviceAccount:
  labels:
    azure.workload.identity/use: "true"
```

If successful, the cert-manager Pod will have some new environment variables set,
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


### Create a Managed Identity

In order for cert-manager to use the Azure API and manipulate the records in the Azure DNS zone,
it needs an Azure account and the best type of account to use is called a "Managed Identity".
This account does not come with a password or an API key and it is designed for use by machines rather than humans.

Choose a managed identity name and create the Managed Identity:

```bash
export IDENTITY_NAME=cert-manager
az identity create --name "${IDENTITY_NAME}"
```

Grant it permission to modify the DNS zone records:

```bash
export IDENTITY_CLIENT_ID=$(az identity show --name "${IDENTITY_NAME}" --query 'clientId' -o tsv)
az role assignment create \
    --role "DNS Zone Contributor" \
    --assignee IDENTITY_CLIENT_ID \
    --scope $(az network dns zone show --name $DOMAIN_NAME -o tsv --query id)
```

> 📖 Read [What are managed identities for Azure resources?](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)
> for an overview of managed identities and their uses.
>
> 📖 Read [Azure built-in roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles) to learn about the "DNS Zone Contributor" role.
>
> 📖 Read more about [the `az identity` command](https://learn.microsoft.com/en-us/cli/azure/identity).

### Add a Federated Identity

Now associate a federated identity with the managed identity that you created earlier.
cert-manager will authenticate to Azure using a short lived Kubernetes ServiceAccount token,
and it will be able to impersonate the managed identity that you created in the previous step.

```bash
export SERVICE_ACCOUNT_NAME=cert-manager # ℹ️ This is the default Kubernetes ServiceAccount used by the cert-manager controller.
export SERVICE_ACCOUNT_NAMESPACE=cert-manager # ℹ️ This is the default namespace for cert-manager.
export SERVICE_ACCOUNT_ISSUER=$(az aks show --resource-group $AZURE_DEFAULTS_GROUP --name $CLUSTER --query "oidcIssuerProfile.issuerUrl" -o tsv)
az identity federated-credential create \
  --name "cert-manager" \
  --identity-name "${IDENTITY_NAME}" \
  --issuer "${SERVICE_ACCOUNT_ISSUER}" \
  --subject "system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
```

- `--subject`: is the distinguishing name of the Kubernetes ServiceAccount.
- `--issuer`: is a URL from which the Azure will download the JWT signing certificate and other metadata

> 📖 Read about [Workload identity federation](https://learn.microsoft.com/en-us/azure/active-directory/develop/workload-identity-federation) in the Microsoft identity platform documentation.
>
> 📖 Read more about [the `az identity federated-credential` command](https://learn.microsoft.com/en-us/cli/azure/identity/federated-credential).

### Configure a ClusterIssuer

For example:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: $EMAIL_ADDRESS
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - dns01:
        azureDNS:
          hostedZoneName: $AZURE_ZONE_NAME
          resourceGroupName: $AZURE_RESOURCE_GROUP
          subscriptionID: $AZURE_SUBSCRIPTION_ID
          environment: AzurePublicCloud
          managedIdentity:
            clientID: $IDENTITY_CLIENT_ID
```

The following variables need to be filled in.

```bash
# An email address to which Let's Encrypt will send renewal reminders.
export EMAIL_ADDRESS=<email-address>
# The Azure DNS zone in which the DNS-01 records will be created and deleted.
export AZURE_ZONE_NAME=<domain.example.com>
# The Azure resource group containing the DNS zone.
export AZURE_RESOURCE_GROUP=<azure-resource-group>
# The Azure billing account name and ID for the DNS zone.
export AZURE_SUBSCRIPTION=<azure-billing-account-name>
export AZURE_SUBSCRIPTION_ID=$(az account show --name $AZURE_SUBSCRIPTION --query 'id' -o tsv)
```

#### ⚠️ Using 'Ambient Credentials' with ClusterIssuer and Issuer resources

This authentication method is an example of what cert-manager calls 'ambient credentials'.
Ambient credentials are enabled by default for ClusterIssuer resources, but disabled by default for Issuer resources.
This is to prevent unprivileged users, who have permission to create Issuer resources, from issuing certificates using credentials that cert-manager incidentally has access to.
ClusterIssuer resources are cluster scoped (not namespaced) and only platform administrators should be granted permission to create them.

If you are using this authentication mechanism and ambient credentials are not enabled, you will see this error:

```bash
error instantiating azuredns challenge solver: ClientID is not set but neither --cluster-issuer-ambient-credentials nor --issuer-ambient-credentials are set.
```

> ⚠️ It is possible (but not recommended) to enable this authentication mechanism for `Issuer` resources, by setting the `--issuer-ambient-credentials` flag on the cert-manager controller to true.

## Managed Identity Using AAD Pod Identities

> ⚠️ The [open source Azure AD pod-managed identity (preview) in Azure Kubernetes Service has been deprecated as of 10/24/2022](https://github.com/Azure/aad-pod-identity#-announcement).
> Use Workload Identity instead.

[AAD Pod Identities](https://azure.github.io/aad-pod-identity) allows assigning a [Managed Identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) to a pod. This removes the need for adding explicit credentials into the cluster to create the required DNS records.

> Note: When using Pod identity, even though assigning multiple identities to a single pod is allowed, currently cert-manager does not support this as it is not able to identify which identity to use.

Firstly an identity should be created that has access to contribute to the DNS Zone.

- Example creation using `azure-cli` and `jq`:

```bash
# Choose a unique Identity name and existing resource group to create identity in.
IDENTITY=$(az identity create --name $IDENTITY_NAME --resource-group $IDENTITY_GROUP --output json)

# Gets principalId to use for role assignment
PRINCIPAL_ID=$(echo $IDENTITY | jq -r '.principalId')

# Used for identity binding
CLIENT_ID=$(echo $IDENTITY | jq -r '.clientId')
RESOURCE_ID=$(echo $IDENTITY | jq -r '.id')

# Get existing DNS Zone Id
ZONE_ID=$(az network dns zone show --name $ZONE_NAME --resource-group $ZONE_GROUP --query "id" -o tsv)

# Create role assignment
az role assignment create --role "DNS Zone Contributor" --assignee $PRINCIPAL_ID --scope $ZONE_ID
```

- Example creation using Terraform

```terraform
variable resource_group_name {}
variable location {}
variable dns_zone_id {}

# Creates Identity
resource "azurerm_user_assigned_identity" "dns_identity" {
  name                = "cert-manager-dns01"
  resource_group_name = var.resource_group_name
  location            = var.location
}

# Creates Role Assignment
resource "azurerm_role_assignment" "dns_contributor" {
  scope                = var.dns_zone_id
  role_definition_name = "DNS Zone Contributor"
  principal_id         = azurerm_user_assigned_identity.dns_identity.principal_id
}

# Client Id Used for identity binding
output "identity_client_id" {
  value = azurerm_user_assigned_identity.dns_identity.client_id
}

# Resource Id Used for identity binding
output "identity_resource_id" {
  value = azurerm_user_assigned_identity.dns_identity.id
}
```

Next we need to ensure we have installed [AAD Pod Identity](https://azure.github.io/aad-pod-identity) using their walk-through. This will install the CRDs and deployment required to assign the identity.

Now we can create the identity resource and binding using the below manifest as an example:

```yaml
apiVersion: "aadpodidentity.k8s.io/v1"
kind: AzureIdentity
metadata:
  annotations:
    # recommended to use namespaced identites https://azure.github.io/aad-pod-identity/docs/configure/match_pods_in_namespace/
    aadpodidentity.k8s.io/Behavior: namespaced
  name: certman-identity
  namespace: cert-manager # change to your preferred namespace
spec:
  type: 0 # MSI
  resourceID: <Identity_Id> # Resource Id From Previous step
  clientID: <Client_Id> # Client Id from previous step
---
apiVersion: "aadpodidentity.k8s.io/v1"
kind: AzureIdentityBinding
metadata:
  name: certman-id-binding
  namespace: cert-manager # change to your preferred namespace
spec:
  azureIdentity: certman-identity
  selector: certman-label # This is the label that needs to be set on cert-manager pods
```

Next we need to ensure the cert-manager pod has a relevant label to use the pod identity binding. This can be done by editing the deployment and adding the below into the `.spec.template.metadata.labels` field

```yaml
spec:
  template:
    metadata:
      labels:
        aadpodidbinding: certman-label # must match selector in AzureIdentityBinding
```

Or by using the helm values `podLabels`

```yaml
podLabels:
  aadpodidbinding: certman-label
```

Lastly when we create the certificate issuer we only need to specify the `hostedZoneName`, `resourceGroupName` and `subscriptionID` fields for the DNS zone. Example below:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    ...
    solvers:
    - dns01:
        azureDNS:
          subscriptionID: AZURE_SUBSCRIPTION_ID
          resourceGroupName: AZURE_DNS_ZONE_RESOURCE_GROUP
          hostedZoneName: AZURE_DNS_ZONE
          # Azure Cloud Environment, default to AzurePublicCloud
          environment: AzurePublicCloud
```

This authentication mechanism is what cert-manager considers 'ambient credentials'. Use of ambient credentials is disabled by default for cert-manager `Issuer`s. This to ensure unprivileged users who have permission to create issuers cannot issue certificates using any credentials cert-manager incidentally has access to. To enable this authentication mechanism for `Issuer`s, you will need to set `--issuer-ambient-credentials` flag on cert-manager controller to true. (There is a corresponding `--cluster-issuer-ambient-credentials` flag which is set to `true` by default).

If you are using this authentication mechanism and ambient credentials are not enabled, you will see this error:
```bash
error instantiating azuredns challenge solver: ClientID is not set but neither --cluster-issuer-ambient-credentials nor --issuer-ambient-credentials are set.
```

These are necessary to enable Azure Managed Identities.

## Managed Identity Using AKS Kubelet Identity

When creating an AKS cluster in Azure there is the option to use a managed identity that is assigned to the kubelet. This identity is assigned to the underlying node pool in the AKS cluster and can then be used by the cert-manager pods to authenticate to Azure Active Directory.

There are some caveats with this approach, these mainly being:

- Any permissions granted to this identity will also be accessible to all containers running inside the Kubernetes cluster.
- Using AKS extensions like `Kube Dashboard`, `Virtual Node`, or `HTTP Application Routing` (see full list [here](https://docs.microsoft.com/en-us/azure/aks/use-managed-identity#summary-of-managed-identities)) will create additional identities that are assigned to your node pools. If your node pools have more than one identity assigned, you will need to specify either `clientID` or `resourceID` to select the correct one.

To set this up, firstly you will need to retrieve the identity that the kubelet is using by querying the AKS cluster. This can then be used to create the appropriate permissions in the DNS zone.

- Example commands using `azure-cli`:

```bash
# Get AKS Kubelet Identity
PRINCIPAL_ID=$(az aks show -n $CLUSTERNAME -g $CLUSTER_GROUP --query "identityProfile.kubeletidentity.objectId" -o tsv)

# Get existing DNS Zone Id
ZONE_ID=$(az network dns zone show --name $ZONE_NAME --resource-group $ZONE_GROUP --query "id" -o tsv)

# Create role assignment
az role assignment create --role "DNS Zone Contributor" --assignee $PRINCIPAL_ID --scope $ZONE_ID
```

- Example terraform:

```terraform
variable dns_zone_id {}

# Creating the AKS cluster, abbreviated.
resource "azurerm_kubernetes_cluster" "cluster" {
  ...
  # Creates Identity associated to kubelet
  identity {
    type = "SystemAssigned"
  }
  ...
}

resource "azurerm_role_assignment" "dns_contributor" {
  scope                            = var.dns_zone_id
  role_definition_name             = "DNS Zone Contributor"
  principal_id                     = azurerm_kubernetes_cluster.cluster.kubelet_identity[0].object_id
  skip_service_principal_aad_check = true # Allows skipping propagation of identity to ensure assignment succeeds.
}
```

Then when creating the cert-manager issuer we need to specify the `hostedZoneName`, `resourceGroupName` and `subscriptionID` fields for the DNS Zone.

We also need to specify `managedIdentity.clientID` or `managedIdentity.resourceID` if multiple managed identities are assigned to the node pools.

The value for `managedIdentity.clientID` can be fetched by running this command:

```bash
az aks show -n $CLUSTERNAME -g $CLUSTER_GROUP --query "identityProfile.kubeletidentity.clientId" -o tsv
```

Example below:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    ...
    solvers:
    - dns01:
        azureDNS:
          subscriptionID: AZURE_SUBSCRIPTION_ID
          resourceGroupName: AZURE_DNS_ZONE_RESOURCE_GROUP
          hostedZoneName: AZURE_DNS_ZONE
          # Azure Cloud Environment, default to AzurePublicCloud
          environment: AzurePublicCloud
          # optional, only required if node pools have more than 1 managed identity assigned
          managedIdentity:
            # client id of the node pool managed identity (can not be set at the same time as resourceID)
            clientID: YOUR_MANAGED_IDENTITY_CLIENT_ID
            # resource id of the managed identity (can not be set at the same time as clientID)
            # resourceID: YOUR_MANAGED_IDENTITY_RESOURCE_ID
```

## Service Principal

Configuring the AzureDNS DNS01 Challenge for a Kubernetes cluster requires
creating a service principal in Azure.

To create the service principal you can use the following script (requires
`azure-cli` and `jq`):

```bash
# Choose a name for the service principal that contacts azure DNS to present
# the challenge.
$ AZURE_CERT_MANAGER_NEW_SP_NAME=NEW_SERVICE_PRINCIPAL_NAME
# This is the name of the resource group that you have your dns zone in.
$ AZURE_DNS_ZONE_RESOURCE_GROUP=AZURE_DNS_ZONE_RESOURCE_GROUP
# The DNS zone name. It should be something like domain.com or sub.domain.com.
$ AZURE_DNS_ZONE=AZURE_DNS_ZONE

$ DNS_SP=$(az ad sp create-for-rbac --name $AZURE_CERT_MANAGER_NEW_SP_NAME --output json)
$ AZURE_CERT_MANAGER_SP_APP_ID=$(echo $DNS_SP | jq -r '.appId')
$ AZURE_CERT_MANAGER_SP_PASSWORD=$(echo $DNS_SP | jq -r '.password')
$ AZURE_TENANT_ID=$(echo $DNS_SP | jq -r '.tenant')
$ AZURE_SUBSCRIPTION_ID=$(az account show --output json | jq -r '.id')
```

For security purposes, it is appropriate to utilize RBAC to ensure that you
properly maintain access control to your resources in Azure. The service
principal that is generated by this tutorial has fine-grained access to ONLY the
DNS Zone in the specific resource group specified. It requires this permission
so that it can read/write the \_acme\_challenge TXT records to the zone.

Lower the Permissions of the service principal.

```bash
$ az role assignment delete --assignee $AZURE_CERT_MANAGER_SP_APP_ID --role Contributor
```

Give Access to DNS Zone.

```bash
$ DNS_ID=$(az network dns zone show --name $AZURE_DNS_ZONE --resource-group $AZURE_DNS_ZONE_RESOURCE_GROUP --query "id" --output tsv)
$ az role assignment create --assignee $AZURE_CERT_MANAGER_SP_APP_ID --role "DNS Zone Contributor" --scope $DNS_ID
```

Check Permissions. As the result of the following command, we would like to see just one object in the permissions array with "DNS Zone Contributor" role.

```bash
$ az role assignment list --all --assignee $AZURE_CERT_MANAGER_SP_APP_ID
```

A secret containing service principal password should be created on Kubernetes to facilitate presenting the challenge to Azure DNS. You can create the secret with the following command:

```bash
$ kubectl create secret generic azuredns-config --from-literal=client-secret=$AZURE_CERT_MANAGER_SP_PASSWORD
```

Get the variables for configuring the issuer.

```bash
$ echo "AZURE_CERT_MANAGER_SP_APP_ID: $AZURE_CERT_MANAGER_SP_APP_ID"
$ echo "AZURE_CERT_MANAGER_SP_PASSWORD: $AZURE_CERT_MANAGER_SP_PASSWORD"
$ echo "AZURE_SUBSCRIPTION_ID: $AZURE_SUBSCRIPTION_ID"
$ echo "AZURE_TENANT_ID: $AZURE_TENANT_ID"
$ echo "AZURE_DNS_ZONE: $AZURE_DNS_ZONE"
$ echo "AZURE_DNS_ZONE_RESOURCE_GROUP: $AZURE_DNS_ZONE_RESOURCE_GROUP"
```

To configure the issuer, substitute the capital cased variables with the values
from the previous script. You can get the subscription id from the Azure portal.

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: example-issuer
spec:
  acme:
    ...
    solvers:
    - dns01:
        azureDNS:
          clientID: AZURE_CERT_MANAGER_SP_APP_ID
          clientSecretSecretRef:
          # The following is the secret we created in Kubernetes. Issuer will use this to present challenge to Azure DNS.
            name: azuredns-config
            key: client-secret
          subscriptionID: AZURE_SUBSCRIPTION_ID
          tenantID: AZURE_TENANT_ID
          resourceGroupName: AZURE_DNS_ZONE_RESOURCE_GROUP
          hostedZoneName: AZURE_DNS_ZONE
          # Azure Cloud Environment, default to AzurePublicCloud
          environment: AzurePublicCloud
```
