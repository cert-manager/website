---
title: "AzureDNS"
linkTitle: "AzureDNS"
weight: 30
type: "docs"
---

To configure the AzureDNS DNS01 Challenege in a Kubernetes cluster there are 2 ways available:
- Managed Identity ([Using AAD Pod Identities]((https://azure.github.io/aad-pod-identity)))
- Service Principal

## Managed Identity

- Firstly we need to create the identity and grant this access to contribute to the DNS Zone.

Example creation using `azure-cli` and `jq`:
```bash
# Choose a unique Identity name and existing resource group to create identity in.
IDENTITY=$(az identity create --name $IDENTITY_NAME --resource-group $IDENTITY_GROUP )

# Gets principalId to use for role assignment
PRINCIPAL_ID=$(echo $IDENTITY | jq -r '.principalId')

# Used for identity binding
CLIENT_ID=$(echo $IDENTITY | jq -r '.clientId')
RESOURCE_ID=$(echo $IDENTITY | jq -r '.id')

# Get existing DNS Zone Id
ZONE_ID=$(az network dns zone show --name $ZONE_NAME --resource-group $ZONE_GROUP --query "[].id" -o tsv)

# Create role assignment
az role assignment create --role "DNS Zone Contributor" --assignee $PRINCIPAL_ID --scope $ZONE_ID
```

Example creation using Terraform
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

- Next we need to ensure we have installed [AAD Pod Identity](https://azure.github.io/aad-pod-identity) using their walkthrough. This will install the CRDs and pods required to assign the identity.

- Now we can create the identity resource and binding using the below yaml

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
spec:
  azureIdentity: certman-identity
  selector: certman-label # This is the label that needs to be set on cert-manager pods
```

- Next we need to ensure the Cert-Manager pod has a relevant label to use the pod identity binding. This can be done by editing the deployment and adding the below into the `.spec.template.metadata.labels` field

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

- Lastly when we create the certificate issuer we only need to specify the `hostedZoneName`, `resourceGroupName` and `subscriptionID` fields. Example below:

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

## Service Principal

Configuring the AzureDNS DNS01 Challenge for a Kubernetes cluster requires
creating a service principal in Azure.

To create the service principal you can use the following script (requires
`azure-cli` and `jq`):

```bash
# Choose a name for the service principal that contacts azure DNS to present the challenge
$ AZURE_CERT_MANAGER_NEW_SP_NAME=NEW_SERVICE_PRINCIPAL_NAME
# This is the name of the resource group that you have your dns zone in
$ AZURE_DNS_ZONE_RESOURCE_GROUP=AZURE_DNS_ZONE_RESOURCE_GROUP
# The DNS zone name. It should be something like domain.com or sub.domain.com
$ AZURE_DNS_ZONE=AZURE_DNS_ZONE

$ DNS_SP=$(az ad sp create-for-rbac --name $AZURE_CERT_MANAGER_NEW_SP_NAME)
$ AZURE_CERT_MANAGER_SP_APP_ID=$(echo $DNS_SP | jq -r '.appId')
$ AZURE_CERT_MANAGER_SP_PASSWORD=$(echo $DNS_SP | jq -r '.password')
$ AZURE_TENANT_ID=$(echo $DNS_SP | jq -r '.tenant')
$ AZURE_SUBSCRIPTION_ID=$(az account show | jq -r '.id')
```

For security purposes, it is appropriate to utilize RBAC to ensure that you
properly maintain access control to your resources in Azure. The service
principal that is generated by this tutorial has fine grained access to ONLY the
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

To configure the issuer, substitute the capital cased variables with the values from the previous script.

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
