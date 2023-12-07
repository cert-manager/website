---
title: approver-policy
description: 'Policy plugin for cert-manager'
---

approver-policy is a cert-manager
[approver](../../../usage/certificaterequest.md#approval)
that will approve or deny CertificateRequests based on policies defined in
the `CertificateRequestPolicy` custom resource.

## Prerequisites

[cert-manager must be installed](../../../installation/README.md), and
the [the default approver in cert-manager must be disabled](../../../usage/certificaterequest.md#approver-controller).

> ⚠️ If the default approver is not disabled in cert-manager, approver-policy will
> race with cert-manager and policy will be ineffective.

If you install cert-manager using `helm install` or `helm upgrade`,
you can disable the default approver by [Customizing the Chart Before Installing](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing) using the `--set` or `--values` command line flags:

```
# Example --set value
--set extraArgs={--controllers='*\,-certificaterequests-approver'} # ⚠ Disable cert-manager's built-in approver
```

```yaml
# Example --values file content
extraArgs:
 - "--controllers=*,-certificaterequests-approver" # ⚠ Disable cert-manager's built-in approver
```

Here's a full example which will install cert-manager or reconfigure it if it is already installed:

```terminal
helm upgrade cert-manager jetstack/cert-manager \
  --install \
  --create-namespace \
  --namespace cert-manager \
  --version REPLACE-WITH-YOUR-CERT-MANAGER-VERSION \
  --set installCRDs=true \
  --set extraArgs={--controllers='*\,-certificaterequests-approver'} # ⚠ Disable cert-manager's built-in approver
```

> ℹ️ The `--set installCRDs=true` setting is a convenient way to install the
> cert-manager CRDS, but it is optional and has some drawbacks.
> Read [Helm: Installing Custom Resource Definitions](https://deploy-preview-1216--cert-manager-website.netlify.app/docs/installation/helm/#3-install-customresourcedefinitions) to learn more.
>
> ℹ️ Be sure to customize the cert-manager controller `extraArgs`,
> which are at the top level of the values file.
> *Do not* change the `webhook.extraArgs`, `startupAPICheck.extraArgs` or `cainjector.extraArgs` settings.
>
> ⚠️ If you are reconfiguring an already installed cert-manager,
> check whether the original installation already customized the `extraArgs` value
> by running `helm get values cert-manager --namespace cert-manager`.
> If there are already `extraArgs` values, merge those with the extra `--controllers` value.
> Otherwise your original `extraArgs` values will be overwritten.

## Installation

To install approver-policy:

```terminal
helm repo add jetstack https://charts.jetstack.io --force-update
helm upgrade -i -n cert-manager cert-manager-approver-policy jetstack/cert-manager-approver-policy --wait
```

If you are using approver-policy with [external
issuers](../../../configuration/issuers.md), you _must_
include their signer names so that approver-policy has permissions to approve
and deny CertificateRequests that
[reference them](../../../usage/certificaterequest.md#rbac-syntax).
For example, if using approver-policy for the internal issuer types, along with
[google-cas-issuer](https://github.com/jetstack/google-cas-issuer), and
[aws-privateca-issuer](https://github.com/cert-manager/aws-privateca-issuer),
set the following values when installing:

```terminal
$ helm upgrade -i -n cert-manager cert-manager-approver-policy jetstack/cert-manager-approver-policy --wait \
  --set app.approveSignerNames="{\
issuers.cert-manager.io/*,clusterissuers.cert-manager.io/*,\
googlecasclusterissuers.cas-issuer.jetstack.io/*,googlecasissuers.cas-issuer.jetstack.io/*,\
awspcaclusterissuers.awspca.cert-manager.io/*,awspcaissuers.awspca.cert-manager.io/*\
}"
```

## Configuration

> Example policy resources can be found
> [here](https://github.com/cert-manager/approver-policy/tree/main/docs/examples).

When a CertificateRequest is created, approver-policy will evaluate whether the
request is appropriate for any existing policy, and if so, evaluate whether it
should be approved or denied.

For a CertificateRequest to be appropriate for a policy and therefore be
evaluated by it, it must be both bound via RBAC _and_ be selected by the policy
selector. CertificateRequestPolicy currently only supports `issuerRef` as a
selector.

**If at least one policy permits the request, the request is approved. If at
least one policy is appropriate for the request but none of those permit the
request, the request is denied.**

A denied CertificateRequest is considered to be permanently failed. If it was
created for a Certificate resource, the issuance will be retried with
[exponential backoff](../../../faq/README.md#what-happens-if-issuance-fails-will-it-be-retried)
like all other permanent issuance failures. A CertificateRequest that is neither
approved nor denied (because no matching policy was found) will not be further
processed by cert-manager until it gets either approved or denied.

CertificateRequestPolicies are cluster scoped resources that can be thought of
as "policy profiles". They describe any request that is approved by that
policy. Policies are bound to Kubernetes users and ServiceAccounts using RBAC.

Below is an example of a policy that is bound to all Kubernetes users who may
only request certificates that have the common name of `"hello.world"`.

```yaml
apiVersion: policy.cert-manager.io/v1alpha1
kind: CertificateRequestPolicy
metadata:
  name: test-policy
spec:
  allowed:
    commonName:
      value: "hello.world"
      required: true
  selector:
    # Select all IssuerRef
    issuerRef: {}
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cert-manager-policy:hello-world
rules:
  - apiGroups: ["policy.cert-manager.io"]
    resources: ["certificaterequestpolicies"]
    verbs: ["use"]
    # Name of the CertificateRequestPolicies to be used.
    resourceNames: ["test-policy"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cert-manager-policy:hello-world
roleRef:
# ClusterRole or Role _must_ be bound to a user for the policy to be considered.
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cert-manager-policy:hello-world
subjects:
# The users who should be bound to the policies defined.
# Note that in the case of users creating Certificate resources, cert-manager
# is the entity that is creating the actual CertificateRequests, and so the
# cert-manager controller's
# Service Account should be bound instead.
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

## Behavior

CertificateRequestPolicy are split into 4 parts; `allowed`, `contraints`,
`selector`, and `plugins`.

### Allowed

Allowed is the block that defines attributes that match against the
corresponding attribute in the request. A request is permitted by the policy if
the request omits an allowed attribute, but will _deny_ the request if it
contains an attribute which is _not_ present in the allowed block.

An allowed attribute can be marked as `required`, which if true, will enforce
that the attribute has been defined in the request. A field can only be marked
as `required` if the corresponding field is also defined. The `required` field
is not available for `isCA` or `usages`.

In the following CertificateRequestPolicy, a request will be permitted if it
does not request a DNS name, requests the DNS name `"example.com"`, but will be
denied when requesting `"bar.example.com"`.

```yaml
spec:
  ...
  allowed:
    dnsNames:
      values:
      - "example.com"
      - "foo.example.com"
  ...
```

In the following, a request will be denied if the request contains no Common
Name, but will permit requests whose Common Name ends in ".com".

```yaml
spec:
  ...
  allowed:
    commonName:
      value: "*.com"
      required: true
  ...
```

If an allowed field is omitted, that attribute is considered "deny all" for
requests.

Allowed string fields accept wildcards "\*" within its values. Wildcards "\*" in
patterns represent any string that has a length of 0 or more. A pattern
containing only "\*" will match anything. A pattern containing `"\*foo"` will
match `"foo"` as well as any string which ends in `"foo"` (e.g. `"bar-foo"`). A
pattern containing `"\*.foo"` will match `"bar-123.foo"`, but not `"barfoo"`.

Allowed fields that are lists will permit requests that are a subset of that
list. This means that if `usages` contains `["server auth", "client auth"]`,
then a request containing only `["server auth"]` would be permitted, but not
`["server auth", "cert sign"]`.

Below is an example including all supported allowed fields of
CertificateRequestPolicy.

```yaml
apiVersion: policy.cert-manager.io/v1alpha1
kind: CertificateRequestPolicy
metadata:
  name: my-policy
spec:
  allowed:
    commonName:
      value: "example.com"
    dnsNames:
      values:
      - "example.com"
      - "*.example.com"
    ipAddresses:
      values:
      - "1.2.3.4"
      - "10.0.1.*"
    uris:
      values:
      - "spiffe://example.org/ns/*/sa/*"
    emailAddresses:
      values:
      - "*@example.com"
      required: true
    isCA: false
    usages:
    - "server auth"
    - "client auth"
    subject:
      organizations:
        values: ["hello-world"]
      countries:
        values: ["*"]
      organizationalUnits:
        values: ["*"]
      localities:
        values: ["*"]
      provinces:
        values: ["*"]
      streetAddresses:
        values: ["*"]
      postalCodes:
        values: ["*"]
      serialNumber:
        value: "*"
  ...
```

### Constraints

Constraints is the block that is used to limit what attributes the request can
have. If a constraint is not defined, then the attribute is considered "allow
all".

Below is an example containing all supported constraints fields of
CertificateRequestPolicy.

```yaml
apiVersion: policy.cert-manager.io/v1alpha1
kind: CertificateRequestPolicy
metadata:
  name: my-policy
spec:
  ...
  constraints:
    minDuration: 1h
    maxDuration: 24h
    privateKey:
      algorithm: RSA
      minSize: 2048
      maxSize: 4096
  ...
```

### Selector

Selector is a required field that is used for matching
CertificateRequestPolicies against CertificateRequests for evaluation.  A
CertificateRequestPolicy must select, and therefore match, a CertificateRequest
for it to be considered for evaluation of the request.

> ⚠️ Note that the user must still be bound by [RBAC](#configuration) for
> the policy to be considered for evaluation against a request.

approver-policy supports selecting over the `issuerRef` and the `namespace` of a
request.

At least either an `issuerRef` *or* `namespace` selector must be defined, even
if set to empty (`{}`). **Both** selectors must match on a CertificateRequest
for the request to evaluated by the policy if both are defined.

#### `issuerRef`

The `issuerRef` CertificateRequestPolicy selector selects on the corresponding
`issuerRef` stanza on the CertificateRequest.

`issuerRef` values accept wildcards "\*". If an `issuerRef` is set to an empty
object `{}`, then the policy will match against _all_ requests.

```yaml
apiVersion: policy.cert-manager.io/v1alpha1
kind: CertificateRequestPolicy
metadata:
  name: my-policy
spec:
  ...
  selector:
    issuerRef:
      name: "my-ca"
      kind: "*Issuer"
      group: "cert-manager.io"
```

```yaml
apiVersion: policy.cert-manager.io/v1alpha1
kind: CertificateRequestPolicy
metadata:
  name: match-all-requests
spec:
  ...
  selector:
    issuerRef: {}
```

#### `namespace`

The `namespace` CertificateRequestPolicy selector selects on the Namespace to
which the CertificateRequest was created in.  The selector can be defined with
either `matchNames` or `matchLabels`.

`matchNames` takes a list of strings which match the _name_ of the Namespace.
Accepts wildcards "\*".

`matchLabels` takes a list of key value strings which match on the labels of the
Namespace that the CertificateRequest was created in. Please see the [Kubernetes
documentation][] for more information on `matchLabels` behavior.

If a `namespace` is set to an empty object `{}`, then the policy will match
against _all_ requests.

```yaml
apiVersion: policy.cert-manager.io/v1alpha1
kind: CertificateRequestPolicy
metadata:
  name: my-policy
spec:
  ...
  selector:
    namespace:
      matchNames:
      - "default"
      - "app-team-*"
    matchLabels:
      foo: bar
      team: dev
```

```yaml
apiVersion: policy.cert-manager.io/v1alpha1
kind: CertificateRequestPolicy
metadata:
  name: match-all-requests
spec:
  ...
  selector:
    namespace: {}
```

[Kubernetes documentation]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#resources-that-support-set-based-requirements

### Plugins

Plugins are external approvers that are built into approver-policy at compile
time. Plugins are designed to be used as extensions to the existing policy
checks where the user requires special functionality that the existing checks
can't provide.

Plugins are defined as a block on the CertificateRequestPolicy `spec`.

```yaml
apiVersion: policy.cert-manager.io/v1alpha1
kind: CertificateRequestPolicy
metadata:
  name: plugins
spec:
  ...
  plugins:
    my-plugin:
      values:
        val-1: key-1
```

## Known Plugins from the Community

- [CEL approver-policy plugin](https://github.com/erikgb/cel-approver-policy-plugin) (experimental)

If you want to implement an external approver policy plugin take a look at the
example implementation at
https://github.com/cert-manager/example-approver-policy-plugin.

Have you implemented a plugin for approver-policy? Feel free to add a link to your plugin from this page by
opening a pull request in the [cert-manager website project](https://github.com/cert-manager/website).

## API Reference

> 📖 Read the [approver-policy API reference](api-reference.md).
