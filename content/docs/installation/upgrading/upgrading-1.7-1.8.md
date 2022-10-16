---
title: Upgrading from v1.7 to v1.8
description: 'cert-manager installation: Upgrading v1.6 to v1.7'
---

#### Validation of the `rotationPolicy` field

The field `spec.privateKey.rotationPolicy` on Certificate resources is now validated. Valid options are Never and Always.

Before upgrading to 1.8.0, you will need to check that all the Certificate YAML manifests you have stored in Git if you are using a GitOps flow (or any other "source of truth") have a correct `rotationPolicy` value. To help you find out which Certificate YAML manifests need updating, you can run the following command:

```sh
kubectl get cert -A -ojson | jq -r \
  '.items[] | select(.spec.privateKey.rotationPolicy | strings | . != "Always" and . != "Never") | "\(.metadata.name) in namespace \(.metadata.namespace) has rotationPolicy=\(.spec.privateKey.rotationPolicy)"'
```

This command will show you, the name and namespace of each Certificate resource that needs to be updated in Git. For example:

```text
smoketest-cert in namespace default has rotationPolicy=Foo
```

#### Server-Side Apply

Server-Side Apply is an alpha feature of cert-manager introduced in 1.8. By
default, the feature is disabled, in which case you can skip this section.

If you are using Server-Side Apply, i.e., you are running the cert-manager
controller with the flag

```text
--feature-gates=ServerSideApply=true
```

Then you need to take action before upgrading to cert-manager 1.8. You will have
to make sure that there are no Challenge resources currently in the cluster. If
there are some, you will need to manually delete them once they are in a 'valid'
state.

The reason the Challenge resources need to be removed before upgrading to 1.8
when using the new Server-Side Apply feature is that cert-manager post-1.8 is
not able to clean up Challenge resources that were created pre-1.8.

If running Kubernetes versions before `v1.22`, the
[`ServerSideApply`](https://kubernetes.io/docs/reference/using-api/server-side-apply/) 
feature gate _must_ be enabled in the cluster. This beta feature is enabled by
default on supported versions before `v1.22`.

#### Migrating from the Gateway API v1alpha1 to v1alpha2

This section only applies to you if you are using the feature gate
`ExperimentalGatewayAPISupport`.

cert-manager 1.8 drops support for the Gateway API v1alpha1, and now only
supports v1alpha2.

Before upgrading cert-manager, you will need to:

1. remove all existing Gateway API v1alpha1 resources,
2. upgrade the Gateway API CRDs to v1alpha2,
3. re-create the Gateway API resources with the v1alpha2.

This manual intervention is needed because the Gateway API project does not
come with a conversion webhook that would allow an easier migration from
v1alpha1 to v1alpha2.

After upgrading cert-manager to 1.8, you will need to remove the `labels` field,
and add the `parentRefs`:

```diff
 apiVersion: cert-manager.io/v1
 kind: Issuer
 metadata:
   name: letsencrypt
   namespace: default
 spec:
   acme:
     solvers:
       - http01:
           gatewayHTTPRoute:
-            labels:
-              gateway: traefik
+            parentRefs:
+              - name: traefik
+                namespace: traefik
+                kind: Gateway
```

## Now, Follow the Regular Upgrade Process

From here on you can follow the [regular upgrade process](./README.md).
