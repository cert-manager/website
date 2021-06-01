---
title: "Release Notes"
linkTitle: "v1.4"
weight: 800
type: "docs"
---

Special thanks to the external contributors who contributed to this release:

* [@andreas-p](https://github.com/andreas-p)

# Deprecated Features and Breaking Changes

## Certificate renewal period calculation

There have been slight changes in the renewal period calculation for
certificates. Renewal time (`rt`) is now calculated using formula `rt = notAfter -
rb` where `rb = min(renewBefore, cert duration / 3)`. (See [docs](/docs/usage/certificate/#renewal) for more
detailed explanation). Previously this was calculated using formula `rt =
notAfter - rb`  where  `if cert duration < renewBefore; then rb = cert duration
/ 3; else rb = renewBefore`. This change fixes a bug where, if a certificate's
duration is very slightly larger than `renewBefore` period, then a cert gets
renewed at `notAfter - renewBefore` which can lead to a continuous renewal loop,
see [`cert-manager#3897`](https://github.com/jetstack/cert-manager/issues/3897).

## Updating cert-manager CRDs and stored versions of cert-manager custom resources

We have deprecated `cert-manager.io/v1alpha2`, `cert-manager.io/v1alpha3`, `cert-manager.io/v1beta1`, `acme.cert-manager.io/v1alpha2`, `acme.cert-manager.io/v1alpha3`, `acme.cert-manager.io/v1beta1` APIs.
These APIs will be removed in `cert-manager` `v1.6`.
If you have a `cert-manager` installation that is using or has previously used these APIs you may need to update `cert-manager` custom resources and CRDs. This needs to be done before upgrading to `cert-manager` `v1.6`. (See Kubernetes docs for more detailed explanation [here](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#upgrade-existing-objects-to-a-new-stored-version))

Steps:

1. Make sure your `cert-manager` deployment is `v1` or later.
2. Make sure any version-controlled `cert-manager` custom resource config files updated to use `cert-manager.io/v1` API and re-applied. This should update stored versions for the given resources.

Further please follow the official Kubernetes documentation [here](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/#upgrade-existing-objects-to-a-new-stored-version):

1. If there are other resources (`ingress-shim` `Certificate`s, `CertificateRequest`s etc that aren't stored in Git and may have been created using the deprecated APIs, you can run  `kubectl get <resource_name> -oyaml | kubectl apply -f -` to force the resources to be stored in `etcd` at the current storage version.
2. To remove legacy API versions from `cert-manager` CRDs, you can run the following `curl` commands:
```
kubectl proxy &

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/certificates.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/certificaterequests.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/issuers.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/clusterissuers.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/orders.acme.cert-manager.io/status

curl -d '[{ "op": "replace", "path":"/status/storedVersions", "value": ["v1"] }]' -H "Content-Type: application/json-patch+json"  -X PATCH http://localhost:8001/apis/apiextensions.k8s.io/v1/customresourcedefinitions/challenges.acme.cert-manager.io/status
```
