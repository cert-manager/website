---
title: CertificateRequest
description: 'cert-manager core concepts: CertificateRequests'
---

The `CertificateRequest` is a namespaced resource in cert-manager that is used
to request X.509 certificates from an [`Issuer`](./issuer.md). The resource
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
  # 90 days
  duration: 2160h
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

## UserInfo

`CertificateRequests` include a set of `UserInfo` fields as part of the spec,
namely: `username`, `groups`, `uid`, and `extra`. These values contain the user
who created the `CertificateRequest`. This user will be cert-manager itself in
the case that the `CertificateRequest` was created by a
[`Certificate`](./certificate.md) resource, or instead the user who created the
`CertificateRequest` directly.

> **Warning**: These fields are managed by cert-manager and should _never_ be
> set or modified by anything else. When the `CertificateRequest` is created,
> these fields will be overridden, and any request attempting to modify them
> will be rejected.


### Approval
CertificateRequests can be `Approved` or `Denied`. These mutually exclusive
conditions gate a CertificateRequest from being signed by its managed signer.

- A signer should _not_ sign a managed CertificateRequest without an Approved condition
- A signer _will_ sign a managed CertificateRequest with an Approved condition
- A signer will _never_ sign a managed CertificateRequest with a Denied condition

These conditions are _permanent_, and cannot be modified or changed once set.

```bash
NAMESPACE      NAME                    APPROVED   DENIED   READY   ISSUER       REQUESTOR                                         AGE
istio-system   service-mesh-ca-whh5b   True                True    mesh-ca      system:serviceaccount:istio-system:istiod         16s
istio-system   my-app-fj9sa                       True             mesh-ca      system:serviceaccount:my-app:my-app               4s
```


#### Behavior

The Approved and Denied conditions are two distinct condition types on the
CertificateRequest. These conditions must only have the status of True, and
are mutually exclusive (i.e. a CertificateRequest cannot have an Approved and
Denied condition simultaneously). This behavior is enforced in the cert-manager
validating admission webhook.

An "approver" is an entity that is responsible for setting the Approved/Denied
conditions. It is up to the approver's implementation as to what
CertificateRequests are managed by that approver.

The Reason field of the Approved/Denied condition should be set to *who* set the
condition. Who can be interpreted however makes sense to the approver
implementation. For example, it may include the API group of an approving policy
controller, or the client agent of a manual request.

The Message field of the Approved/Denied condition should be set to *why* the
condition is set. Again, why can be interpreted however makes sense to the
implementation of the approver. For example, the name of the resource that
approves this request, the violations which caused the request to be denied, or
the team to who manually approved the request.


#### Approver Controller

By default, cert-manager will run an internal approval controller which will
automatically approve _all_ CertificateRequests that reference any internal
issuer type in any namespace: `cert-manager.io/Issuer`,
`cert-manager.io/ClusterIssuer`.

To disable this controller, add the following argument to the
cert-manager-controller: `--controllers=*,-certificaterequests-approver`. This
can be achieved with helm by appending:

```bash
--set extraArgs={--controllers='*\,-certificaterequests-approver'}
```

Alternatively, in order for the internal approver controller to approve
CertificateRequests that reference an external issuer, add the following RBAC to
the cert-manager-controller Service Account. Please replace the given resource
names with the relevant names:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cert-manager-controller-approve:my-issuer-example-com # edit
rules:
- apiGroups:
  - cert-manager.io
  resources:
  - signers
  verbs:
  - approve
  resourceNames:
  - issuers.my-issuer.example.com/* # edit
  - clusterissuers.my-issuer.example.com/* # edit
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cert-manager-controller-approve:my-issuer-example-com # edit
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cert-manager-controller-approve:my-issuer-example-com # edit
subjects:
- kind: ServiceAccount
  name: cert-manager
  namespace: cert-manager
```

#### RBAC Syntax

When a user or controller attempts to approve or deny a CertificateRequest, the
cert-manager webhook will evaluate whether it has sufficient permissions to do
so. These permissions are based upon the request
itself- specifically the request's IssuerRef:

```yaml
apiGroups: ["cert-manager.io"]
resources: ["signers"]
verbs: ["approve"]
resourceNames:
 # namesapced signers
 - "<signer-resource-name>.<signer-group>/<signer-namespace>.<signer-name>"
 # cluster scoped signers
 - "<signer-resource-name>.<signer-group>/<signer-name>"
 # all signers of this resource name
 - "<signer-resource-name>.<signer-group>/*"
```

An example ClusterRole that would grant the permissions to set the Approve and
Denied conditions of CertificateRequests that reference the cluster scoped
`myissuers` external issuer, in the group `my-example.io`, with the name `myapp`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: my-example-io-my-issuer-myapp-approver
rules:
  - apiGroups: ["cert-manager.io"]
    resources: ["signers"]
    verbs: ["approve"]
    resourceNames: ["myissuers.my-example.io/myapp"]
```

If the approver does not have sufficient permissions defined above to set the
Approved or Denied conditions, the request will be rejected by the cert-manager
validating admission webhook.

- The RBAC permissions *must* be granted at the cluster scope
- Namespaced signers are represented by a namespaced resource using the syntax of `<signer-resource-name>.<signer-group>/<signer-namespace>.<signer-name>`
- Cluster scoped signers are represented using the syntax of `<signer-resource-name>.<signer-group>/<signer-name>`
- An approver can be granted approval for all namespaces via `<signer-resource-name>.<signer-group>/*`
- The apiGroup must *always* be `cert-manager.io`
- The resource must *always* be `signers`
- The verb must *always* be `approve`, which grants the approver the permissions to set *both* Approved and Denied conditions

An example of signing all `myissuer` signers in all namespaces, and
`clustermyissuers` with the name `myapp`, in the `my-example.io` group:

```yaml
    resourceNames: ["myissuers.my-example.io/*", "clustermyissuers.my-example.io/myapp"]
```

An example of signing `myissuer` with the name `myapp` in the namespaces `foo`
and `bar`:

```yaml
    resourceNames: ["myissuers.my-example.io/foo.myapp", "myissuers.my-example.io/bar.myapp"]
```