---
title: Learn how to set Certificate defaults automatically
description: |
  Learn how to use Kyverno ClusterPolicy to set default values for cert-manager Certificates cluster wide.
---

*Last Verified: 19 January 2024*

# Objective

We will set up a cluster where a user specifies as little YAML as possible in `Certificate` resources.
This will be achieved by utilizing Kyverno to apply custom "default" values to the `Certificate` fields, that are not specified by a user.

There are some benefits to having defaults:

- `Certificate` consumers minimize their YAML resources.
- `Certificate` consumers retain flexibility to override fields when needed.
- Cluster operators can decide what the default should be, rather than having to rely on built-in defaults from cert-manager.

## Use cases

By setting custom defaults across our cluster, we enable platform teams to tackle use cases such as:

- **To ensure that `CertificateRequest` resources get cleaned up.**

    Use a `ClusterPolicy` to set a custom default value for the `Certificate.Spec.RevisionHistoryLimit` field.

    > ℹ️ Not needed with cert-manager `>= v1.18.0`, because the default value was changed to `1`.

- **To help your users choose secure default key settings for their `Certificate` resources.**

    Use a `ClusterPolicy` to set custom default values for the `Certificate.Spec.PrivateKey` fields.

- **To default the `Issuer` for users within the cluster.**

    Use a `ClusterPolicy` to set a custom default for the `Certificate.spec.issuerRef` fields.

- **To set a default pattern for the naming of the `Secret` where the certificate will be populated.**

    Use a `ClusterPolicy` to set a custom default value for the `spec.secretName` required field.

- **Make application developers' lives easier by allowing them to create secure X.509 TLS certificates with the minimum of configuration.**

    Use a `ClusterPolicy` to set all other required `Certificate.spec` fields.
    Only a single identity specification field will be required, one of:
    - `commonName` or `literalSubject`
    - `dnsNames`
    - `uris`
    - `emailAddresses`
    - `ipAddresses`
    - `otherNames`

## Process

We will set up defaults for three different scenarios, getting slightly more advanced each time:

1. Setting defaults for optional `Certificate` resource fields.
2. Setting defaults for required `Certificate` resource fields.
3. Setting defaults for `Certificate` resource fields, when using `Ingress` annotations to request certificates.

# Setup

## Prerequisites

**💻 Software**

1. [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl): The Kubernetes
  command-line tool which allows you to configure Kubernetes clusters.
1. [helm](https://helm.sh/): A package manager for Kubernetes.
1. [kind](https://kind.sigs.k8s.io/) (**OPTIONAL**): For creating a local
  Kubernetes environment that runs in Docker or other container runtimes.

## Local Kubernetes Environment

> ⚠️ This step can be skipped if you have another Kubernetes environment.

1. Create a cluster environment using `kind` for this tutorial.

    ```shell
    kind create cluster --name defaults
    ```

    > ⏲ It should take less than one minute to create the cluster, depending on your machine.
    >
    > ⚠️ This cluster is only suitable for learning purposes. It is not suitable for production use.

## Software Installation

Once you have your cluster environment, install the required Kubernetes packages using `helm`.

1. Set some environment variables for the helm chart versions:

    ```shell
    export CERT_MANAGER_CHART_VERSION="[[VAR::cert_manager_latest_version]]" \
        KYVERNO_CHART_VERSION="3.1.4" \
        INGRESS_NGINX_CHART_VERSION="4.9.0"
    ```

1. Install cert-manager

    ```shell
    helm upgrade --install cert-manager cert-manager \
      --namespace cert-manager \
      --version $CERT_MANAGER_CHART_VERSION \
      --set crds.enabled=true \
      --set startupapicheck.enabled=false \
      --create-namespace \
      --repo https://charts.jetstack.io/
    ```

1. Install Kyverno

    ```shell
    helm upgrade --install kyverno kyverno \
      --namespace kyverno-system \
      --version $KYVERNO_CHART_VERSION \
      --create-namespace \
      --repo https://kyverno.github.io/kyverno/
    ```

1. Install ingress-nginx

    ```shell
    helm upgrade --install ingress-nginx ingress-nginx \
      --namespace ingress-nginx \
      --version $INGRESS_NGINX_CHART_VERSION \
      --create-namespace \
      --repo https://kubernetes.github.io/ingress-nginx
    ```

> For complete installation instructions, please refer to the following links:
> - [cert-manager installation instructions](./../../../docs/installation/helm.md)
> - [Kyverno installation instructions](https://kyverno.io/docs/installation/methods/#install-kyverno-using-helm)
> - [ingress-nginx installation instructions](https://kubernetes.github.io/ingress-nginx/deploy/)

# Setting Defaults

The main tutorial starts here with some background, before tackling each of the three scenarios.

## Required vs Non-required

The `Certificate` resource has a `spec` section with a number of "required" fields.
This means these fields must be present when you create a `Certificate` resource.
There are also a number of other fields that are not required to be explicitly defined on each `Certificate` resource.
This essentially means the value of one of these fields is either not required, or has defaults defined somewhere else.
That somewhere else could be in the cert-manager code base, or indeed by the issuer that creates and returns the X.509 certificate.
Let's explore how we can manipulate these values to be something custom and make the `Certificate` user's life easier.

We will set up some `ClusterPolicy` resources and `Certificate` resources in this tutorial.
We will make reference to a `ClusterIssuer` in the `Certificate` spec that doesn't exist, but for this tutorial the `ClusterIssuer` is not required as we will not actually be requesting certificates.
That means anyone can follow this tutorial even without their own domain.

> ⚠️ To make it easy to get started we are using cluster scoped `ClusterPolicy` resources.
> You can scope your defaults to the namespace level through the use of `Policy` resources in the future, but that will not be covered in this tutorial.

## 1 - Defaulting optional fields

In this section we will create rules which set three fields for all `Certificate` resources automatically.
None of the three fields here are required fields, but they might need to be set depending on platform and issuer preferences.
These rules will:

- Set a default value of: `revisionHistoryLimit: 2`.
  > ℹ️ This is not necessary if you use cert-manager `>= v1.18.0`, because the default value was changed to `1`.
- Set a [default value of `Always` under `spec.privateKey.rotationPolicy`](../../usage/certificate.md#the-rotationpolicy-setting).
  > ℹ️ This is not necessary if you use cert-manager `>=v1.18.0`, because the default value was changed from `Never` to `Always`.
- Set defaults for all `spec.privateKey` fields.

> ℹ️ Note how these rules tackle the first two of our [uses cases](#use-cases).

1. First take a look at the `ClusterPolicy`:

    ```yaml file=../../../../public/docs/tutorials/certificate-defaults/cpol-mutate-certificates-0.yaml
    ```
    🔗 <a href="cpol-mutate-certificates-0.yaml">`cpol-mutate-certificates-0.yaml`</a>

1. Apply the policy to the cluster and check that it is ready:

    ```shell
    kubectl apply -f cpol-mutate-certificates-0.yaml
    kubectl get cpol
    ```

    When the `ClusterPolicy` is ready the output should look like this:

    ```log
    NAME                  ADMISSION   BACKGROUND   VALIDATE ACTION   READY   AGE   MESSAGE
    mutate-certificates   true        true         Audit             True    0s    Ready
    ```

1. Now inspect the "test-revision" `Certificate`:

    ```yaml file=../../../../public/docs/tutorials/certificate-defaults/cert-test-revision.yaml
    ```
    🔗 <a href="cert-test-revision.yaml">`cert-test-revision.yaml`</a>

    You can see that we have set the most minimal configuration currently possible, specifying only a DNS name for the certificate, where to save it (`secretName`) and the issuer to use to request the certificate (`issuerRef`).

1. Use the following command to *dry-run apply* the certificate and then `diff` it against the original resource, to see how the defaults from our `ClusterPolicy` are applied:

    ```shell
    kubectl apply -f cert-test-revision.yaml --dry-run=server -o yaml | diff -uZ cert-test-revision.yaml -
    ```

    This command should return some output similar to this example:

    ```yaml
    --- cert-test-revision.yaml	2024-01-08 12:14:59.225074232 +0000
    +++ -	2024-01-12 17:37:51.076593214 +0000
    @@ -1,8 +1,14 @@
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
    +  annotations:
    +    kubectl.kubernetes.io/last-applied-configuration: |
    +      {"apiVersion":"cert-manager.io/v1","kind":"Certificate","metadata":{"annotations":{},"name":"test-revision","namespace":"default"},"spec":{"dnsNames":["example.com"],"issuerRef":{"group":"cert-manager.io","kind":"ClusterIssuer","name":"not-my-corp-issuer"},"secretName":"test-revision-cert"}}
    +  creationTimestamp: "2024-01-12T17:37:51Z"
    +  generation: 1
      name: test-revision
      namespace: default
    +  uid: 9f9a4f0a-4aa7-427d-ae4b-c1716fed8246
    spec:
      dnsNames:
      - example.com
    @@ -10,4 +16,10 @@
        group: cert-manager.io
        kind: ClusterIssuer
        name: not-my-corp-issuer
    +  privateKey:
    +    algorithm: ECDSA
    +    encoding: PKCS1
    +    rotationPolicy: Always
    +    size: 521
    +  revisionHistoryLimit: 2
      secretName: test-revision-cert
        ```

    We have successfully defaulted the `privateKey` and `revisionHistoryLimit` fields!

1. Let's override all of these defaulted fields, to validate that we can still set what we want as an end user. To test this, let's use the "test-revision-override" `Certificate`:

    ```yaml file=../../../../public/docs/tutorials/certificate-defaults/cert-test-revision-override.yaml
    ```
    🔗 <a href="cert-test-revision-override.yaml">`cert-test-revision-override.yaml`</a>

    As before, *dry-run apply* and `diff` the output with the input file:

    ```shell
    kubectl apply -f cert-test-revision-override.yaml --dry-run=server -o yaml | diff -uZ cert-test-revision-override.yaml -
    ```

    Here you can see in the output there are no specification changes for the `Certificate` itself.
    The `Certificate` already had all the fields defined that our `ClusterPolicy` rules would have affected.

    ```yaml
    --- cert-test-revision-override.yaml	2024-01-05 14:45:14.972562067 +0000
    +++ -	2024-01-12 17:39:57.217028745 +0000
    @@ -1,8 +1,14 @@
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
    +  annotations:
    +    kubectl.kubernetes.io/last-applied-configuration: |
    +      {"apiVersion":"cert-manager.io/v1","kind":"Certificate","metadata":{"annotations":{},"name":"test-revision-override","namespace":"default"},"spec":{"dnsNames":["example.com"],"issuerRef":{"group":"cert-manager.io","kind":"ClusterIssuer","name":"not-my-corp-issuer"},"privateKey":{"algorithm":"RSA","encoding":"PKCS8","rotationPolicy":"Never","size":4096},"revisionHistoryLimit":44,"secretName":"test-revision-override-cert"}}
    +  creationTimestamp: "2024-01-12T17:39:57Z"
    +  generation: 1
      name: test-revision-override
      namespace: default
    +  uid: 83a6ddbc-6903-479e-802d-e11149985338
    spec:
      dnsNames:
      - example.com
    ```

## 2 - Defaulting required fields

> ⚠️ This section requires cert-manager v1.14.x or newer to work properly out of the box.
> See the [Appendix](#cert-manager-version-requirement) section for details.

Now we can set a Kyverno `ClusterPolicy` to apply default values to any of the `Certificate` fields.
This includes the *required* fields.
In our example `ClusterPolicy` we will do two things:

- Set the relevant `issuerRef` fields to default to use the "our-corp-issuer" `ClusterIssuer`.
- Apply a default `secretName` that is the name of the `Certificate` object suffixed with "-cert".

> ℹ️ Note how these rules are tackling the third and fourth [uses cases](#use-cases).

1. Here is the `ClusterPolicy` resource to set both fields with defaults:

    ```yaml file=../../../../public/docs/tutorials/certificate-defaults/cpol-mutate-certificates-1.yaml
    ```
    🔗 <a href="cpol-mutate-certificates-1.yaml">`cpol-mutate-certificates-1.yaml`</a>

    This `ClusterPolicy` is an extension of the policy we applied previously.

1. Apply this policy:

    ```shell
    kubectl apply -f cpol-mutate-certificates-1.yaml
    ```

    You should see that our existing `ClusterPolicy` has been changed:

    ```shell
    clusterpolicy.kyverno.io/mutate-certificates configured
    ```

    Get the `ClusterPolicy` to validate it is "Ready":

    ```shell
    kubectl get cpol
    ```

    This command should return some output similar to this example:

    ```shell
    NAME                  ADMISSION   BACKGROUND   VALIDATE ACTION   READY   AGE     MESSAGE
    mutate-certificates   true        true         Audit             True    6m21s   Ready
    ```

1. Look at the "test-minimal" `Certificate` designed to validate that all our rules within the policy are operative:

    ```yaml file=../../../../public/docs/tutorials/certificate-defaults/cert-test-minimal.yaml
    ```
    🔗 <a href="cert-test-minimal.yaml">`cert-test-minimal.yaml`</a>

1. *Dry-run apply* and `diff` to validate all our defaults have applied to this minimal `Certificate`:

    ```shell
    kubectl apply -f cert-test-minimal.yaml --dry-run=server -o yaml | diff -uZ cert-test-minimal.yaml -
    ```

    This command should return some output similar to this example:

    ```yaml
    --- cert-test-minimal.yaml	2024-01-05 14:45:07.140668401 +0000
    +++ -	2024-01-12 17:44:08.110290752 +0000
    @@ -1,8 +1,25 @@
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
    +  annotations:
    +    kubectl.kubernetes.io/last-applied-configuration: |
    +      {"apiVersion":"cert-manager.io/v1","kind":"Certificate","metadata":{"annotations":{},"name":"test-minimal","namespace":"default"},"spec":{"dnsNames":["example.com"]}}
    +  creationTimestamp: "2024-01-12T17:44:08Z"
    +  generation: 1
      name: test-minimal
      namespace: default
    +  uid: 792d29c7-8cf3-4f3a-9f12-4fba396e0d6e
    spec:
      dnsNames:
      - example.com
    +  issuerRef:
    +    group: cert-manager.io
    +    kind: ClusterIssuer
    +    name: our-corp-issuer
    +  privateKey:
    +    algorithm: ECDSA
    +    encoding: PKCS1
    +    rotationPolicy: Always
    +    size: 521
    +  revisionHistoryLimit: 2
    +  secretName: test-minimal-cert
    ```

    See how we have automatically populated the `spec.issuerRef` and `spec.secretName` field values.
    This indicates the Kyverno `ClusterPolicy` has been applied to the supplied `Certificate` resource.

1. To be absolutely sure we have not enforced any settings, let us explicitly set each property of the `Certificate` for which we have a default rule. We will use the "test-revision-override" `Certificate`:

    ```yaml file=../../../../public/docs/tutorials/certificate-defaults/cert-test-revision-override.yaml
    ```
    🔗 <a href="cert-test-revision-override.yaml">`cert-test-revision-override.yaml`</a>

1. *Dry-run apply* and `diff` this file:

    ```shell
    kubectl apply -f cert-test-revision-override.yaml --dry-run=server -o yaml | diff -uZ cert-test-revision-override.yaml -
    ```

    This command should return some output similar to this example:

    ```yaml
    --- cert-test-revision-override.yaml	2024-01-05 14:45:14.972562067 +0000
    +++ -	2024-01-12 17:45:48.261997150 +0000
    @@ -1,8 +1,14 @@
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
    +  annotations:
    +    kubectl.kubernetes.io/last-applied-configuration: |
    +      {"apiVersion":"cert-manager.io/v1","kind":"Certificate","metadata":{"annotations":{},"name":"test-revision-override","namespace":"default"},"spec":{"dnsNames":["example.com"],"issuerRef":{"group":"cert-manager.io","kind":"ClusterIssuer","name":"not-my-corp-issuer"},"privateKey":{"algorithm":"RSA","encoding":"PKCS8","rotationPolicy":"Never","size":4096},"revisionHistoryLimit":44,"secretName":"test-revision-override-cert"}}
    +  creationTimestamp: "2024-01-12T17:45:48Z"
    +  generation: 1
      name: test-revision-override
      namespace: default
    +  uid: d0ad7abe-c703-45f7-acf9-634b3a263cfa
    spec:
      dnsNames:
      - example.com
    ```

    From this command you can see that none of the `Certificate` specification fields have been changed.
    Only the metadata section has changed which tells us the policies have applied but not set any defaults because values were already provided.
    This shows that you retain the flexibility to override the cluster defaults when needed.

## 3 - Defaulting through Ingress Annotations

Many cert-manager users don't create `Certificate` resources directly and instead use the [ingress-shim](https://cert-manager.io/docs/usage/ingress/) functionality.
cert-manager creates `Certificate` resources based on the [supported annotations](https://cert-manager.io/docs/usage/ingress/#supported-annotations) and the `Ingress` specification.
Let's see how we can still use `ClusterPolicy` to apply our defaults in this use case.

1. This example `Ingress` resource has a `cert-manager.io/cluster-issuer` annotation which instructs cert-manager to create a `Certificate` with an `issuerRef` field pointing at a `ClusterIssuer` called `our-corp-issuer`:

    ```yaml file=../../../../public/docs/tutorials/certificate-defaults/ingress.yaml
    ```
    🔗 <a href="ingress.yaml">`ingress.yaml`</a>

1. This annotation and the relevant `ingress.spec.tls` configuration are all we need so apply the resource:

    ```shell
    kubectl apply -f ingress.yaml
    ```

1. Now validate that the `Certificate` resource was automatically generated:

    ```shell
    kubectl get cert defaults-example-certificate-tls -o yaml
    ```

    This command should return some output similar to this example:

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
      creationTimestamp: "2024-01-12T17:47:04Z"
      generation: 1
      name: defaults-example-certificate-tls
      namespace: default
      ownerReferences:
      - apiVersion: networking.k8s.io/v1
        blockOwnerDeletion: true
        controller: true
        kind: Ingress
        name: defaults-example
        uid: bea33a55-a9ed-4664-a56a-a679eb8272c3
      resourceVersion: "584260"
      uid: 43ced989-723b-4eac-bad0-f8bead6976df
    spec:
      dnsNames:
      - app.example.com
      issuerRef:
        group: cert-manager.io
        kind: ClusterIssuer
        name: our-corp-issuer
      privateKey:
        algorithm: ECDSA
        encoding: PKCS1
        rotationPolicy: Always
        size: 521
      revisionHistoryLimit: 2
      secretName: defaults-example-certificate-tls
      usages:
      - digital signature
      - key encipherment
    status:
      conditions:
      - lastTransitionTime: "2024-01-12T17:47:04Z"
        message: Issuing certificate as Secret does not exist
        observedGeneration: 1
        reason: DoesNotExist
        status: "True"
        type: Issuing
      - lastTransitionTime: "2024-01-12T17:47:04Z"
        message: Issuing certificate as Secret does not exist
        observedGeneration: 1
        reason: DoesNotExist
        status: "False"
        type: Ready
      nextPrivateKeySecretName: defaults-example-certificate-tls-nbjws
    ```

1. You can optionally validate that  the "mutate-certificates" `ClusterPolicy` has been applied by viewing the logs of the Kyverno admission controller container.

    ```shell
    kubectl logs -n kyverno-system $(kubectl get pod -n kyverno-system -l app.kubernetes.io/component=admission-controller -o jsonpath='{.items[0].metadata.name}') -c kyverno --tail 3
    ```

    This command should return some output similar to this example:

    ```log
    I0112 17:47:04.425863       1 mutation.go:113] webhooks/resource/mutate "msg"="mutation rules from policy applied successfully" "clusterroles"=["cert-manager-controller-approve:cert-manager-io","cert-manager-controller-certificates","cert-manager-controller-certificatesigningrequests","cert-manager-controller-challenges","cert-manager-controller-clusterissuers","cert-manager-controller-ingress-shim","cert-manager-controller-issuers","cert-manager-controller-orders","system:basic-user","system:discovery","system:public-info-viewer","system:service-account-issuer-discovery"] "gvk"={"group":"cert-manager.io","version":"v1","kind":"Certificate"} "gvr"={"group":"cert-manager.io","version":"v1","resource":"certificates"} "kind"="Certificate" "name"="defaults-example-certificate-tls" "namespace"="default" "operation"="UPDATE" "policy"="mutate-certificates" "resource.gvk"={"Group":"cert-manager.io","Version":"v1","Kind":"Certificate"} "roles"=["kube-system:cert-manager:leaderelection"] "rules"=["set-revisionHistoryLimit","set-privateKey-rotationPolicy","set-privateKey-details"] "uid"="6f93bd8d-29ca-4eab-8e96-065ea82a1bf2" "user"={"username":"system:serviceaccount:cert-manager:cert-manager","uid":"21cbad67-9d2e-44ee-bb02-7fef9aa2e502","groups":["system:serviceaccounts","system:serviceaccounts:cert-manager","system:authenticated"],"extra":{"authentication.kubernetes.io/pod-name":["cert-manager-648cd49b44-z6g8s"],"authentication.kubernetes.io/pod-uid":["4bd741fa-a8ec-48a1-82d5-26c5b7acce5e"]}}
    I0112 17:47:04.458402       1 mutation.go:113] webhooks/resource/mutate "msg"="mutation rules from policy applied successfully" "clusterroles"=["cert-manager-controller-approve:cert-manager-io","cert-manager-controller-certificates","cert-manager-controller-certificatesigningrequests","cert-manager-controller-challenges","cert-manager-controller-clusterissuers","cert-manager-controller-ingress-shim","cert-manager-controller-issuers","cert-manager-controller-orders","system:basic-user","system:discovery","system:public-info-viewer","system:service-account-issuer-discovery"] "gvk"={"group":"cert-manager.io","version":"v1","kind":"Certificate"} "gvr"={"group":"cert-manager.io","version":"v1","resource":"certificates"} "kind"="Certificate" "name"="defaults-example-certificate-tls" "namespace"="default" "operation"="UPDATE" "policy"="mutate-certificates" "resource.gvk"={"Group":"cert-manager.io","Version":"v1","Kind":"Certificate"} "roles"=["kube-system:cert-manager:leaderelection"] "rules"=["set-revisionHistoryLimit","set-privateKey-rotationPolicy","set-privateKey-details"] "uid"="ec61a3c9-df0a-4daf-8bc3-227dc80348a9" "user"={"username":"system:serviceaccount:cert-manager:cert-manager","uid":"21cbad67-9d2e-44ee-bb02-7fef9aa2e502","groups":["system:serviceaccounts","system:serviceaccounts:cert-manager","system:authenticated"],"extra":{"authentication.kubernetes.io/pod-name":["cert-manager-648cd49b44-z6g8s"],"authentication.kubernetes.io/pod-uid":["4bd741fa-a8ec-48a1-82d5-26c5b7acce5e"]}}
    I0112 17:47:09.477776       1 mutation.go:113] webhooks/resource/mutate "msg"="mutation rules from policy applied successfully" "clusterroles"=["cert-manager-controller-approve:cert-manager-io","cert-manager-controller-certificates","cert-manager-controller-certificatesigningrequests","cert-manager-controller-challenges","cert-manager-controller-clusterissuers","cert-manager-controller-ingress-shim","cert-manager-controller-issuers","cert-manager-controller-orders","system:basic-user","system:discovery","system:public-info-viewer","system:service-account-issuer-discovery"] "gvk"={"group":"cert-manager.io","version":"v1","kind":"Certificate"} "gvr"={"group":"cert-manager.io","version":"v1","resource":"certificates"} "kind"="Certificate" "name"="defaults-example-certificate-tls" "namespace"="default" "operation"="UPDATE" "policy"="mutate-certificates" "resource.gvk"={"Group":"cert-manager.io","Version":"v1","Kind":"Certificate"} "roles"=["kube-system:cert-manager:leaderelection"] "rules"=["set-revisionHistoryLimit","set-privateKey-rotationPolicy","set-privateKey-details"] "uid"="c4384662-cb2a-49a0-8e83-e590942ec48d" "user"={"username":"system:serviceaccount:cert-manager:cert-manager","uid":"21cbad67-9d2e-44ee-bb02-7fef9aa2e502","groups":["system:serviceaccounts","system:serviceaccounts:cert-manager","system:authenticated"],"extra":{"authentication.kubernetes.io/pod-name":["cert-manager-648cd49b44-z6g8s"],"authentication.kubernetes.io/pod-uid":["4bd741fa-a8ec-48a1-82d5-26c5b7acce5e"]}}
    ```

    Taking the last line as an example you can pull out:

    ```log
    "kind"="Certificate" "name"="defaults-example-certificate-tls" "namespace"="default" "operation"="UPDATE" "policy"="mutate-certificates" "resource.gvk"={"Group":"cert-manager.io","Version":"v1","Kind":"Certificate"} "roles"=["kube-system:cert-manager:leaderelection"] "rules"=["set-revisionHistoryLimit","set-privateKey-rotationPolicy","set-privateKey-details"]
    ```

    See the `policy` key indicates that our policy has been applied.
    In the `rules` section you can identify that three of our five rules have been applied to the generated "defaults-example-certificate-tls" `Certificate` resource.

When using an `Ingress` resource, you always need to specify the `secretName` from which to load the certificate.
No defaulting is required in this use case because this is a required part of the `Ingress` specification.

The only additional YAML that a user is required to specify on the `Ingress` resource is the annotation:

```yaml
cert-manager.io/cluster-issuer: "our-corp-issuer"
```

This annotation serves as both the trigger for cert-manager to act upon this `Ingress` and also as the configuration value for the `Certificate.spec.issuerRef` fields.
This single line replaces the need for the user to create a `Certificate` resource entirely.
This results in a reduction of the total YAML required to secure the application behind this `Ingress`.

# Summary

This is a fairly simple example of how easy it can be to setup *defaults* for your cluster `Certificate` resources.
We've shown how a `ClusterPolicy` doesn't have to "enforce" settings, rather it can be used to set and extend the default options.
`Certificate` users can reduce their YAML, whilst maintaining the flexibility to override any value when needed.

We have shown how a simple `ClusterPolicy` with only 5 rules can change the user experience creating `Certificate` resources from:

```yaml file=../../../../public/docs/tutorials/certificate-defaults/cert-test-revision-override.yaml
```
🔗 <a href="cert-test-revision-override.yaml">`cert-test-revision-override.yaml`</a>

To instead only need to specify the configuration important to them, for example:

```yaml file=../../../../public/docs/tutorials/certificate-defaults/cert-test-minimal.yaml
```
🔗 <a href="cert-test-minimal.yaml">`cert-test-minimal.yaml`</a>

With this policy we achieved our objective and have enabled users to submit minimal `Certificate` resources.
This completes our fifth [use case](#use-cases), with only a single field contained within the specification, the `dnsNames` entry.
Every other specified field was automatically defaulted using Kyverno with `ClusterPolicy` which would typically be setup by a platform administrator.

# Cleanup

If you created the kind cluster for this tutorial you can simply run:

```shell
kind delete cluster --name defaults
```

Otherwise to remove all resources deployed in this tutorial:

```shell
# Assuming you are running from this directly or saved all the files to yamls/
kubectl delete -f ingress.yaml
kubectl delete -f cpol-mutate-certificates-1.yaml
helm uninstall kyverno -n kyverno-system
helm uninstall cert-manager -n cert-manager
helm uninstall ingress-nginx -n ingress-nginx
```

# Appendix

## cert-manager version requirement

The behavior of cert-manager's mutating webhook has been changed from v1.14.x onward.
For a more complete explanation and details of the change please refer to [PR #6311](https://github.com/cert-manager/cert-manager/pull/6311).
Instructions for a manual fix can be found [in this comment on PR #6311](https://github.com/cert-manager/cert-manager/pull/6311#issuecomment-1889517418).

## Presets Feature Request

For further background reading around setting "defaults" or "presets", you can refer to [issue 2239](https://github.com/cert-manager/cert-manager/issues/2239).
This tutorial came out of an investigation of that issue.

The cert-manager team reasoned that the requested solution could be achieved with the use of other, more generic open-source policy tools.
Kyverno is just one example and similar can be achieved with [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) as an alternative tool.
