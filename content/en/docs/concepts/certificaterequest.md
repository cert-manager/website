---
title: "CertificateRequest"
linkTitle: "CertificateRequest"
weight: 300
type: "docs"
---

The `CertificateRequest` is a namespaced resource in cert-manager that is used
to request X.509 certificates from an [`Issuer`](../issuer/). The resource
contains a base64 encoded string of a PEM encoded certificate request which is
sent to the referenced issuer. A successful issuance will return a signed
certificate, based on the certificate signing request. `CertificateRequests` are
typically consumed and managed by controllers or other systems and should not be
used by humans - unless specifically needed.

A simple `CertificateRequest` looks like the following:

```yaml
apiVersion: cert-manager.io/v1
kind: CertificateRequest
metadata:
  name: my-ca-cr
spec:
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQzNqQ0NBY1lDQVFBd2daZ3hDekFKQmdOVkJBWVRBbHBhTVE4d0RRWURWUVFJREFaQmNHOXNiRzh4RFRBTApCZ05WQkFjTUJFMXZiMjR4RVRBUEJnTlZCQW9NQ0VwbGRITjBZV05yTVJVd0V3WURWUVFMREF4alpYSjBMVzFoCmJtRm5aWEl4RVRBUEJnTlZCQU1NQ0dwdmMyaDJZVzVzTVN3d0tnWUpLb1pJaHZjTkFRa0JGaDFxYjNOb2RXRXUKZG1GdWJHVmxkWGRsYmtCcVpYUnpkR0ZqYXk1cGJ6Q0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQwpBUW9DZ2dFQkFLd01tTFhuQkNiRStZdTIvMlFtRGsxalRWQ3BvbHU3TlZmQlVFUWl1bDhFMHI2NFBLcDRZQ0c5Cmx2N2kwOHdFMEdJQUgydnJRQmxVd3p6ZW1SUWZ4YmQvYVNybzRHNUFBYTJsY2NMaFpqUlh2NEVMaER0aVg4N3IKaTQ0MWJ2Y01OM0ZPTlRuczJhRkJYcllLWGxpNG4rc0RzTEVuZmpWdXRiV01Zeis3M3ptaGZzclRJUjRzTXo3cQpmSzM2WFM4UkRjNW5oVVcyYU9BZ3lnbFZSOVVXRkxXNjNXYXVhcHg2QUpBR1RoZnJYdVVHZXlZUUVBSENxZmZmCjhyOEt3YTFYK1NwYm9YK1ppSVE0Nk5jQ043OFZnL2dQVHNLZmphZURoNWcyNlk1dEVidHd3MWdRbWlhK0MyRHIKWHpYNU13RzJGNHN0cG5kUnRQckZrU1VnMW1zd0xuc0NBd0VBQWFBQU1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQgpBUUFXR0JuRnhaZ0gzd0N3TG5IQ0xjb0l5RHJrMUVvYkRjN3BJK1VVWEJIS2JBWk9IWEFhaGJ5RFFLL2RuTHN3CjJkZ0J3bmlJR3kxNElwQlNxaDBJUE03eHk5WjI4VW9oR3piN0FVakRJWHlNdmkvYTJyTVhjWjI1d1NVQmxGc28Kd005dE1QU2JwcEVvRERsa3NsOUIwT1BPdkFyQ0NKNnZGaU1UbS9wMUJIUWJSOExNQW53U0lUYVVNSFByRzJVMgpjTjEvRGNMWjZ2enEyeENjYVoxemh2bzBpY1VIUm9UWmV1ZEp6MkxmR0VHM1VOb2ppbXpBNUZHd0RhS3BySWp3ClVkd1JmZWZ1T29MT1dNVnFNbGRBcTlyT24wNHJaT3Jnak1HSE9tTWxleVdPS1AySllhaDNrVDdKU01zTHhYcFYKV0ExQjRsLzFFQkhWeGlKQi9Zby9JQWVsCi0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=
  isCA: false
  usages:
    - signing
    - digital signature
    - server auth
  duration: 90d
  issuerRef:
    name: ca-issuer
    # We can reference ClusterIssuers by changing the kind here.
    # The default value is Issuer (i.e. a locally namespaced Issuer)
    kind: Issuer
    group: cert-manager.io
```

This `CertificateRequest` will make cert-manager attempt to request the `Issuer`
`ca-issuer` in the default issuer group `cert-manager.io`, return a
certificate based upon the certificate signing request. Other groups can be
specified inside the `issuerRef` which will change the targeted issuer to other
external, third party issuers you may have installed.

The resource also exposes the option for stating the certificate as CA, Key
Usages, and requested validity duration.

All fields within the `spec` of the `CertificateRequest`, as well as any managed
cert-manager annotations, are immutable and cannot be modified after creation.

A successful issuance of the certificate signing request will cause an update to
the resource, setting the status with the signed certificate, the CA of the
certificate (if available), and setting the `Ready` condition to `True`.

Whether issuance of the certificate signing request was successful or not, a retry of the
issuance will _not_ happen. It is the responsibility of some other controller to
manage the logic and life cycle of `CertificateRequests`.

## Output of `kubectl get`

The `kubectl get certificaterequest` displays information about the
approval:

```bash
% kubectl get certificaterequest
NAMESPACE      NAME                   APPROVED  DENIED  READY  ISSUER            REQUESTOR
cert-manager   service-1-a45bc1       True              True   letsencrypt-prod  system:serviceaccount:cert-manager:letsencrypt-prod
istio-system   service-mesh-ca-whh5b  True              True   mesh-ca           system:serviceaccount:istio-system:istiod
istio-system   my-app-fj9sa                     True           mesh-ca           system:serviceaccount:my-app:my-app
```

The columns have the following meaning:

| Column                       | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `APPROVED`                   | Status of the `Approved` condition                |
| `DENIED`                     | Status of the `Denied` condition                  |
| `READY`                      | Status of the `Ready` condition                   |
| `ISSUER`                     | Name of the issuer given in `spec.issuerRef.name` |
| `REQUESTOR`                  | [User name][subject] given in `spec.username`     |
| `STATUS` (requires `-owide`) | Message contained in the `Ready` condition        |

## Conditions

`CertificateRequests` have a set of strongly defined conditions that should be
used and relied upon by controllers or services to make decisions on what
actions to take next on the resource.

### Ready

Each ready condition consists of the pair `Ready` - a boolean value, and
`Reason` - a string. The set of values and meanings are as follows:

| Ready | Reason  | Condition Meaning                                                                                                                                                                                                                               |
| ----- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| False | Pending | The `CertificateRequest` is currently pending, waiting for some other operation to take place. This could be that the `Issuer` does not exist yet or the `Issuer` is in the process of issuing a certificate.                                   |
| False | Failed  | The certificate has failed to be issued - either the returned certificate failed to be decoded or an instance of the referenced issuer used for signing failed. No further action will be taken on the `CertificateRequest` by it's controller. |
| True  | Issued  | A signed certificate has been successfully issued by the referenced `Issuer`.                                                                                                                                                                   |

## Information about the requestor {#UserInfo}

Similarly as for the Kubernetes [CSR][csr-ref], CertificateRequests also
include information about the requestor. of `UserInfo` fields as part of
the spec, namely: `username`, `groups`, `uid`, and `extra`. These values
contain the user who created the `CertificateRequest`. This user will be
cert-manager itself in the case that the `CertificateRequest` was created
by a [`Certificate`](../certificate/) resource, or instead the user who
created the `CertificateRequest` directly.

```yaml
kind: CertificateRequest
spec:
  uid: 71a1025e-e820-4331-9de0-a1de1bdee249
  username: system:serviceaccount:cert-manager:cert-manager
  groups:
    - system:serviceaccounts
    - system:serviceaccounts:cert-manager
    - system:authenticated
  extra:
    some-property: some-value
```

The four fields are populated by the cert-manager webhook when the
CertificateRequest is created. The fields are immutable.

```yaml
kind: CertificateRequest
spec:
  uid: 71a1025e-e820-4331-9de0-a1de1bdee249
  username: system:serviceaccount:cert-manager:cert-manager
  groups:
    - system:serviceaccounts
    - system:serviceaccounts:cert-manager
    - system:authenticated
  extra:
    some-property: some-value
```

| Field      | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `uid`      | UID of the user who created the CertificateRequest              |
| `username` | Name of the user who created the CertificateRequest             |
| `groups`   | Group membership of the user who created the CertificateRequest |
| `extra`    | Extra attributes of the user who created the CertificateRequest |

The documentation about each field is available in the [API
reference](/docs/reference/api-docs/#cert-manager.io/v1.CertificateRequestSpec).

[csr-ref]: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#certificatesigningrequestspec-v1-certificates-k8s-io
[userinfo-ref]: https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#userinfo-v1beta1-authentication-k8s-io

{{% alert title="Note" color="warning" %}}
These four fields are managed by cert-manager and cannot be edited by anyone
else.
{{% /alert %}}

## Approval API {#approval}

> Introduced in cert-manager 1.3

The approval API is a way to approve or deny the issuance of certificates. Up to
cert-manager 1.3, you had no way to control which certificates could be issued.

### Enable the approval API {#enable-approval-api}

The default behavior in 1.3 and above is still to approve everything. If you
would like to enable the approval API, you will need to add the following flag
to your cert-manager-controller pod:

```bash
--controllers='*,-certificaterequests-approver'
```

If you are using Helm, you can add the following flag to your `helm install`
incantation:

```sh
--set extraArgs="{--controllers=*,-certificaterequests-approver}"
```

Or set it in `values.yaml`:

```yaml
extraArgs:
  - --controllers=*,-certificaterequests-approver
```

{{% alert title="Disable approve-all" color="info" %}}

The flag `--controllers=*,-certificaterequests-approver` prevents cert-manager
from starting its allow-all built-in approval controller.

{{% /alert %}}

When the approval API is enabled, you will need to have something approving the
CertificateRequests:

- The [`kubectl
  cert-manager`](https://cert-manager.io/docs/usage/kubectl-plugin/) plugin can
  manually approve or deny a CertificateRequest:

  ```sh
  kubectl cert-manager approve cert-request-1
  kubectl cert-manager deny cert-request-1
  ```

- The [`policy-approver`](https://github.com/cert-manager/policy-approver)
  controller can approve CertificateRequests based on policies you can configure
  using the
  [`CertificateRequestPolicy`](https://github.com/cert-manager/policy-approver)
  CRD:

  ```yaml
  apiVersion: policy.cert-manager.io/v1alpha1
  kind: CertificateRequestPolicy
  spec:
    maxDuration: "720h" # 30 days
    allowedDNSNames:
      - "*.minio.example.com"
    allowedIsCA: false
  ```

- Or you can write your own custom approver.

### The `Approved` and `Denied` conditions and approvers

The approval API is made of two mutually exclusive conditions that can be set on
the CertificateRequests status: `Approved` and `Denied`. When the approval API
is enabled, a CertificateRequest must have the `Approved` condition before a
signer (such as the ACME issuer) can issue the certificate.

{{% pageinfo color="info" %}}

As part of the approval API, we decided to make use of the term "signer"
instead of "issuer" as a way to come closer to the terms used in the
Kubernetes [CSR][csr] API:

| Term   | Meaning                                                                                      |
| ------ | -------------------------------------------------------------------------------------------- |
| Signer | An entity that signs X.509 CSRs                                                              |
| Issuer | A Kubernetes controller that calls to a signer and sets the readiness of CertificateRequests |

[csr]: https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#create-certificatesigningrequest

In other words, an issuer is a cert-manager-specific implementation of a
signer. By "issuer" we refer to both external issuers (such as
[aws-pca-issuer](https://github.com/jniebuhr/aws-pca-issuer)) and internal
issuers (such as the ACME issuer embedded into cert-manager).

{{% /pageinfo %}}

The approval API kicks in right before the signer (e.g., the ACME issuer) signs
the X.509 CSR contained in a CertificateRequest. We call "approver" the
Kubernetes controller that takes care of setting the `Approved` and `Denied`
conditions.

The following diagrams shows the two possible scenarios.

#### ✅ The `Approved` scenario {#approved-scenario}

Note that the issuer is responsible for setting the `Ready=True` condition. The
approver does not set `Ready`, nor does cert-manager.

```diagram
kind: CertificateRequest              kind: CertificateRequest              kind: CertificateRequest
status:                               status:                               status:
 conditions:                           conditions:                           conditions:
  - type: Ready                         - type: Ready                         - type: Ready
    status: "False"  ---------------->    status: "False"   --------------->    status: "True"
    reason: Pending                       reason: Pending                       reason: Issued
                     (1) The approver   - type: Approved     (2) The signer   - type: Approved
                         approves the     status: "True"         signs the      status: "True"
                         request                                 X.509 CSR

                                                             (3) The issuer
                                                                 sets
                                                                 Ready=True
```

#### ❌ The `Denied` scenario {#denied-scenario}

Again, the issuer is responsible for setting the `Ready=False` condition.

```diagram
kind: CertificateRequest               kind: CertificateRequest             kind: CertificateRequest
status:                                status:                              status:
 conditions:                            conditions:                          conditions:
  - type: Ready                          - type: Ready                        - type: Ready
    status: "False"  ---------------->     status: "False"  --------------->    status: "False"
    reason: Pending                        reason: Pending                      reason: Denied
                     (1) The approver    - type: Denied      (2) The issuer   - type: Denied
                         denies the        status: "True"        sets           status: "True"
                         request                                 Ready=False
```

<!--
Diagram source: https://textik.com/#5739af8ae4cfb124
-->

Note that each CertificateRequests is managed by one issuer. For example,
the following CertificateRequest is managed by the

```yaml
kind: CertificateRequest
spec:
  issuerRef:
    kind: Issuer
    name: example-selfsigned-issuer
```

### RBAC requirements for the Approval API

#### RBAC required for the built-in allow-all approver

If you haven't enabled the approval API and want all CertificateRequests to be
approved by default, you will need to add RBAC rules so that the built-in
approver can set `Approved` and `Denied` on CertificateRequests.

If you are using the Helm chart, you don't have to do anything: the built-in
issuer types already have the correct RBAC roles.

If you are using an external issuer, you will need to add an RBAC role bound to
the service account used by the cert-manager-controller. We need to let the
built-in allow-all approver to set `Approved` and `Denied` on the
CertificateRequests that are referencing this issuer's type.

For example, with
[google-cas-issuer](https://github.com/jetstack/google-cas-issuer):

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cert-manager-controller-approve:google-cas-issuer # edit
rules:
  - apiGroups:
      - cert-manager.io
    resources:
      - signers
    verbs:
      - approve
    resourceNames:
      - googlecasissuers.cas-issuer.jetstack.io/*
      - googlecasclusterissuers.cas-issuer.jetstack.io/*
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cert-manager-controller-approve:google-cas-issuer
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cert-manager-controller-approve:google-cas-issuer
subjects:
  - kind: ServiceAccount
    name: cert-manager
    namespace: cert-manager
```

{{% pageinfo color="info" %}}
The syntax for `googlecasissuers.cas-issuer.jetstack.io/*` is detailed [here](#approval-api-rbac-syntax).
{{% /pageinfo %}}

{{% pageinfo color="info" %}}
The "resource type"
[corresponds to](https://kubernetes.io/docs/reference/using-api/api-concepts/#standard-api-terminology)
the lower-case and plural version of the "kind" field.
{{% /pageinfo %}}

[subject]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/#referring-to-subjects

#### RBAC required for custom approvers

When building your own approver controller, you will need to add RBAC roles so
that your approver can set the `Approved=True` and `Denied=True` conditions to
the CertificateRequests that are referencing either built-in types or external
issuer types (such as the
[`GoogleCASIssuer`](https://github.com/jetstack/google-cas-issuer) or the
[`AWSPCAIssuer`](https://github.com/jniebuhr/aws-pca-issuer) type).

Let us imagine that our approver needs to approve CertificateRequests that are
targeting the built-in ACME issuer as well as the `AWSPCAIssuer`:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-issuer
  namespace: some-namespace
spec:
  acme:
    email: jane.doe@gmail.com
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-issuer-account
    solvers:
      - http01:
          ingress:
            class: traefik
---
apiVersion: awspca.cert-manager.io
kind: AWSPCAClusterIssuer
metadata:
  name: awspca-issuer
  namespace: some-namespace
spec:
  arn: "pca-807911e9"
```

To make our approver work for all CertificateRequests across all namespaces, we
apply the following role to our cluster:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: opa-approver-for-acme-and-aws-pca
rules:
  - apiGroups: ["cert-manager.io"]
    resources: ["signers"]
    verbs: ["approve"]
    resourceNames:
      - "clusterissuers.acme.cert-manager.io/letsencrypt-issuer"
      #  <-------------------------------->  <---------------->
      #    resource type + resource group        issuer name
      - "awspcaclusterissuers.awspca.cert-manager.io/awspca-issuer"
```

Note: the "resource type"
[is](https://kubernetes.io/docs/reference/using-api/api-concepts/#standard-api-terminology)
the lower-case and plural version of the "kind" field.


### Syntax of the `resourceNames` field used in RBAC roles {#approval-api-rbac-syntax}

When a user or controller attempts to approve or deny a CertificateRequest, the
cert-manager webhook evaluates whether it has sufficient permissions to do so.
These permissions are based upon the request itself, and more specifically, the
CertificateRequest's `issuerRef` field.

{{% pageinfo color="warning" %}}

The verb `approve` on the resource `signer` only works with `ClusterRole`, and
the `apiGroup` must be set to `cert-manager.io`.

{{% /pageinfo %}}

Let's imagine I want to use this approver with these two issuers:

```yaml
apiVersion: awspca.cert-manager.io/v1beta1
kind: AWSPCAClusterIssuer
metadata:
  name: private-ca
spec:
  arn: arn-c1f4f80cd072
  region: eu-west-1
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt
  namespace: namespace-with-letsencrypt
spec:
  acme: {}
```

The RBAC roles to be bound to the service account of your approver is:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
rules:
  - apiGroups: ["cert-manager.io"]
    resources: ["signers"]
    verbs: ["approve"]
    resourceNames:
      # Allow this specific AWSPCAClusterIssuer issuer:
      - "awspcaissuers.awspca.cert-manager.io/private-ca"
      #  <-----------> <--------------------> <------------------> <-------->
      #  resource type     resource group          signer name     issuer name

      # Or if you prefer allowing any AWSPCAClusterIssuer:
      - "awspcaissuers.awspca.cert-manager.io/*"


      # For namespaced issuers, the syntax is similar:
      - "issuers.cert-manager.io/namespace-with-letsencrypt.letsencrypt"
      #  <-----> <-------------> <-------------------------> <--------->
      #    type       group            issuer namespace      issuer name

      # You can also allow any issuer type for namespaced issuers:
      - "issuers.cert-manager.io/*"
```

If the approver does not have sufficient permissions to set the `Approved` or
`Denied` conditions, the CertificateRequest is rejected by the cert-manager
webhook.

### Reason and message of the Approval API

The `reason` and `message` fields on the `Denied` and `Approved` condition
are approver-specific, meaning that each approver will set their own. Here
is the set of guidelines:

| Field     | Guideline                                               |
| --------- | ------------------------------------------------------- |
| `reason`  | Machine-readable string identifying the approver        |
| `message` | Human-readable explanation of why the condition was set |

Here is a few examples of approved CertificateRequests:

```yaml
kind: CertificateRequest
status:
  conditions:
    - type: Approved
      status: "True"
      reason: opa-approver-controller
      message: Certificate request was approved by opa-approver-controller
```

> The `opa-approver-controller` is hypothetical and does not exist yet.

```yaml
kind: CertificateRequest
status:
  conditions:
    - type: Approved
      status: "True"
      reason: cert-manager.io
      message: Certificate request has been approved by cert-manager.io
```

We can also approve the certificate request using the [kubectl
cert-manager](https://cert-manager.io/docs/usage/kubectl-plugin/) plugin:

```sh
kubectl cert-manager approve cert-request-1
```

Here is what the approved CertificateRequest looks like:

```yaml
kind: CertificateRequest
status:
  conditions:
    - type: Approved
      status: "True"
      reason: kubectl-cert-manager/v1.3.0
      message: Certificate request was manually approved by kubectl-cert-manager/v1.3.0
```

Here are the a few examples of denied CertificateRequests:

```yaml
kind: CertificateRequest
status:
  conditions:
    - type: Denied
      status: "True"
      reason: opa-approver-controller
      message: >
        Certificate request has been denied by opa-approver-controller
        due to [key lenght is too short, DNS names must match service name]
```

```yaml
kind: CertificateRequest
status:
  conditions:
    - type: Denied
      status: "True"
      reason: kubectl_cert-manager/v1.3.0
      message: Certificate request was manually denied by kubectl_cert-manager/v1.3.0
```

### Approval API guarantees

The cert-manager webhook enforces the correct use of the approval API through
two rules:

1. The approver can only set `Approved` or `Denied` on CertificateRequests that
   reference an `Issuer` or a `ClusterIssuer` (or any other external issuer) for
   which it has the permission to approve.
2. The signer is only\* able to sign a CertificateRequest that is marked as
   `Approved`. If the CertificateRequest is marked as `Denied` or has no
   approval condition altogether, the signer is expected not to sign it.

\*Some issuers [do not
support](/docs/configuration/external/#issuers-that-honour-approval) the
approval API yet. Such approvers break the rule (2). cert-manager detects
CertificateRequests that have been signed by an issuer that ignored the approval
API. When it detects one, cert-manager pretends that the CertificateRequests has
been approved. To avoid this issue, make sure to run only issuers that support
the approval API.
