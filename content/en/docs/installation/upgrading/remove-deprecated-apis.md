---
title: "Removing Deprecated API Resources"
linkTitle: "Removing Deprecated API Resources"
weight: 20
type: "docs"
---

We have deprecated the following cert-manager APIs: 

- `cert-manager.io/v1alpha2`
- `cert-manager.io/v1alpha3`
- `cert-manager.io/v1beta1`
- `acme.cert-manager.io/v1alpha2`
- `acme.cert-manager.io/v1alpha3`
- `acme.cert-manager.io/v1beta1`

These APIs were removed in cert-manager `v1.6.0`. If you have a cert-manager installation that is using or has previously used these deprecated APIs you'll need to upgrade your cert-manager custom resources and CRDs. This needs to be done before upgrading to cert-manager `v1.6.0`.

## Upgrading existing cert-manager resources

1. Familiarize yourself with the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#writing-reading-and-updating-versioned-customresourcedefinition-objects) on CRD versioning.
2. Make sure your installed cert-manager deployment is `v1.0.0` or later.

3. Make sure any version-controlled cert-manager custom resource config files that still use the deprecated APIs are updated to use the `cert-manager.io/v1` API and re-applied. This should update stored versions of the given resources.

After that, follow the official Kubernetes documentation [here](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#upgrade-existing-objects-to-a-new-stored-version):

1. If there are other resources (e.g. `Certificate`s created by ingress-shim, `CertificateRequest`s, etc.) that are not version controlled and may have been created using the deprecated APIs, run
   ```bash
   kubectl get <resource_name> -oyaml | kubectl apply -f -
   ```
   to force the resources to be stored in `etcd` at the current storage version.

2. To remove legacy API versions from cert-manager CRDs run the following `curl` commands:

```bash
kubectl proxy &

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/certificates.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/certificaterequests.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/issuers.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/clusterissuers.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/orders.acme.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/challenges.acme.cert-manager.io/status
```
