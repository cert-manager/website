---
title: Feature Policy
description: 'cert-manager contributing guide: Contribution Policy'
---

We are open to feature requests and PRs implementing those. If you plan on contributing a new feature into cert-manager we recommend creating an issue first for it to be discussed with the cert-manager maintainers. Another possibility is bringing it up in a community meeting discussion for an open discussion with the maintainers and community on the implementation.

# Features we will not allow

Certain features have been requested before, but have not been implemented properly or not able to be implemented without breaking the security model.

Below is a list of a few of these:

## Vendoring Kubernetes related APIs outside of the `k8s.io/` namespace

Vendoring project APIs that also vendor `k8s.io/apimachinery`, such as OpenShift, Contour, or Velero, is not recommend because the Kubernetes dependency is likely to conflict with cert-manager's instance.
It could also cause a conflict with different Kubernetes client versions being used.

If this is needed it is suggested to use a "dynamic client" that converts the objects into internal structured copied into the cert-manager codebase.

## Helm + CRDs

Currently Helm suggests CRDs is to include them in the `crds/` subdirectory of a chart with the `crd-install` annotation included.
However this has the side effect that CRDs will not be upgraded any more if changes are made in a later release.
CRDs being upgraded without them being removed and re-installed is essential for cert-manager to move forward.
The mechanics of this are currently being discussed [in the Helm community](https://github.com/helm/helm/issues/5871).

cert-manager currently works around this by shipping the CRDs in the templates. 

## Helm Subchart capabilities

cert-manager should not be used as a sub-chart in Helm deployments.
Helm deployments are namespaced by design and do not support a dependency model that would support cert-manager being operated on a cluster scope nor preventing cert-manager from being installed twice (with conflicting versions) or being upgraded independently from the application.

The cert-manager installation creates cluster scoped resources like admission webhooks and custom resource definitions. cert-manager should be seen as part of your cluster and should be treated as such for being installed. A comparison to other Kubernetes components would be a LoadBalancer controller or a PV provisioner

## Secret injection or copying

cert-manager deals with very sensitive information (all TLS certificates for your services) and has cluster-level access to secret resources, therefore when designing features we need to consider all ways these can be abused to escalate privilege.
Secret data is meant to be securely stored in the secret resources and have narrow scoped access privileges for unauthorized users. Therefore we will not allow any functionality that allows this data to be copied/injected into any resource other than a Kubernetes secret.

### cainjector

The cainjector component is a special exception to this rule as it deals in non-sensitive information (CAs, not cert/key pairs). This component is able to inject the `ca.crt` file into predefined fields on `ValidatingWebhookConfiguration`, `MutatingWebhookConfiguration`, and `CustomResourceDefinition` resources from Certificate resources.
These 3 components are already scoped only for privileged users, and will already give you cluster scoped access to resources. 

If you’re designing a resource that needs a CA Certificate or TLS key pair it is strongly recommended to use a reference to a secret instead of embedding it in a resource. 

## Cross namespace resources

Namespace boundaries in Kubernetes provide a barrier for access scopes. Apps or users can be limited to only access resources in a certain namespace. cert-manager is a controller that operates on cluster wide resources, while it may seems interesting to allow access to copy or write certificate data from one namespace to the other it will cause a bypass of this security model for all our users which is not intended and a security issue.
If this behavior is intended for your use case there are other Kubernetes controllers that will do this for you however we want to suggest a certain caution when installing these. 

## Sign certificates using the Kubernetes CA (used for your nodes)


Kubernetes has a Certificate Signing Requests API, and a `kubectl certificates` command which allows you to approve certificate signing requests and have them signed by the certificate authority (CA) of the Kubernetes cluster.

This API and CLI have occasionally been misused to sign certificates for use by non-control-plane Pods but this is a mistake. For the security of the Kubernetes cluster, it is important to limit access to the Kubernetes certificate authority, and it is important that you do not use that certificate authority to sign certificates which are used outside of the control-plane, because such certificates increase the opportunity for attacks on the Kubernetes API server as this CA is used to sign certificates used for authorization against the API server it could allow any user who can create cert-manager resources to sign certificates trusted for API access.
([see our FAQ](../faq/README.md#kubernetes-has-a-builtin-certificatesigningrequest-api-why-not-use-that))