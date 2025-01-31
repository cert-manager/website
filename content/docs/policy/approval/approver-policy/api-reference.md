---
title: approver-policy API Reference
description: "approver-policy API documentation"
---

Packages:

- [`policy.cert-manager.io/v1alpha1`](#policycert-manageriov1alpha1)

# `policy.cert-manager.io/v1alpha1`

Resource Types:


- [CertificateRequestPolicy](#certificaterequestpolicy)




## `CertificateRequestPolicy`





CertificateRequestPolicy is an object for describing a "policy profile" that
makes decisions on whether applicable CertificateRequests should be approved
or denied.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
      <td><b>apiVersion</b></td>
      <td>string</td>
      <td>policy.cert-manager.io/v1alpha1</td>
      <td>true</td>
      </tr>
      <tr>
      <td><b>kind</b></td>
      <td>string</td>
      <td>CertificateRequestPolicy</td>
      <td>true</td>
      </tr>
      <tr>
      <td><b><a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#objectmeta-v1-meta">metadata</a></b></td>
      <td>object</td>
      <td>Refer to the Kubernetes API documentation for the fields of the `metadata` field.</td>
      <td>true</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspec">spec</a></b></td>
        <td>object</td>
        <td>
          CertificateRequestPolicySpec defines the desired state of
CertificateRequestPolicy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicystatus">status</a></b></td>
        <td>object</td>
        <td>
          CertificateRequestPolicyStatus defines the observed state of the
CertificateRequestPolicy.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec`


CertificateRequestPolicySpec defines the desired state of
CertificateRequestPolicy.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b><a href="#certificaterequestpolicyspecselector">selector</a></b></td>
        <td>object</td>
        <td>
          Selector is used for selecting over which CertificateRequests this
CertificateRequestPolicy is appropriate for and so will be used for its
approval evaluation.
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowed">allowed</a></b></td>
        <td>object</td>
        <td>
          Allowed defines the allowed attributes for a CertificateRequest.
A CertificateRequest can request _less_ than what is allowed,
but _not more_, i.e. a CertificateRequest can request a subset of what
is declared as allowed by the policy.
Omitted fields declare that the equivalent CertificateRequest
field _must_ be omitted or have an empty value for the request to be
permitted.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecconstraints">constraints</a></b></td>
        <td>object</td>
        <td>
          Constraints define fields that _must_ be satisfied by a
CertificateRequest for the request to be allowed by this policy.
Omitted fields place no restrictions on the corresponding
attribute in a request.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecpluginskey">plugins</a></b></td>
        <td>map[string]object</td>
        <td>
          Plugins are approvers that are built into approver-policy at
compile-time. This is an advanced feature typically used to extend
approver-policy core features. This field define plugins and their
configuration that should be executed when this policy is evaluated
against a CertificateRequest.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.selector`


Selector is used for selecting over which CertificateRequests this
CertificateRequestPolicy is appropriate for and so will be used for its
approval evaluation.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b><a href="#certificaterequestpolicyspecselectorissuerref">issuerRef</a></b></td>
        <td>object</td>
        <td>
          IssuerRef is used to match by issuer, meaning the
CertificateRequestPolicy will only evaluate CertificateRequests
referring to matching issuers.
CertificateRequests will not be processed if the issuer does not match,
regardless of whether the requestor is bound by RBAC.

The following value will match _all_ issuers:
```
issuerRef: {}
```
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecselectornamespace">namespace</a></b></td>
        <td>object</td>
        <td>
          Namespace is used to match by namespace, meaning the
CertificateRequestPolicy will only match CertificateRequests
created in matching namespaces.
If this field is omitted, resources in all namespaces are checked.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.selector.issuerRef`


IssuerRef is used to match by issuer, meaning the
CertificateRequestPolicy will only evaluate CertificateRequests
referring to matching issuers.
CertificateRequests will not be processed if the issuer does not match,
regardless of whether the requestor is bound by RBAC.

The following value will match _all_ issuers:
```
issuerRef: {}
```

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>group</b></td>
        <td>string</td>
        <td>
          Group is the wildcard selector to match the `spec.issuerRef.group` field
on requests.
Accepts wildcards "*".
An omitted field matches all groups.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>kind</b></td>
        <td>string</td>
        <td>
          Kind is the wildcard selector to match the `spec.issuerRef.kind` field
on requests.
Accepts wildcards "*".
An omitted field matches all kinds.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name is a wildcard enabled selector that matches the
`spec.issuerRef.name` field of requests.
Accepts wildcards "*".
An omitted field matches all names.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.selector.namespace`


Namespace is used to match by namespace, meaning the
CertificateRequestPolicy will only match CertificateRequests
created in matching namespaces.
If this field is omitted, resources in all namespaces are checked.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>matchLabels</b></td>
        <td>map[string]string</td>
        <td>
          MatchLabels is the set of Namespace labels that select on
CertificateRequests which have been created in a namespace matching the
selector.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>matchNames</b></td>
        <td>[]string</td>
        <td>
          MatchNames is the set of namespace names that select on
CertificateRequests that have been created in a matching namespace.
Accepts wildcards "*".
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed`


Allowed defines the allowed attributes for a CertificateRequest.
A CertificateRequest can request _less_ than what is allowed,
but _not more_, i.e. a CertificateRequest can request a subset of what
is declared as allowed by the policy.
Omitted fields declare that the equivalent CertificateRequest
field _must_ be omitted or have an empty value for the request to be
permitted.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedcommonname">commonName</a></b></td>
        <td>object</td>
        <td>
          CommonName defines the X.509 Common Name that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecalloweddnsnames">dnsNames</a></b></td>
        <td>object</td>
        <td>
          DNSNames defines the X.509 DNS SANs that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedemailaddresses">emailAddresses</a></b></td>
        <td>object</td>
        <td>
          EmailAddresses defines the X.509 Email SANs that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedipaddresses">ipAddresses</a></b></td>
        <td>object</td>
        <td>
          IPAddresses defines the X.509 IP SANs that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>isCA</b></td>
        <td>boolean</td>
        <td>
          IsCA defines if a CertificateRequest is allowed to set the `spec.isCA`
field set to `true`.
If `true`, the `spec.isCA` field can be `true` or `false`.
If `false` or unset, the `spec.isCA` field must be `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubject">subject</a></b></td>
        <td>object</td>
        <td>
          Subject declares the X.509 Subject attributes allowed in a
CertificateRequest. An omitted field forbids any Subject attributes
from being requested.
A CertificateRequest can request a subset of the allowed X.509 Subject
attributes.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecalloweduris">uris</a></b></td>
        <td>object</td>
        <td>
          URIs defines the X.509 URI SANs that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>usages</b></td>
        <td>[]enum</td>
        <td>
          Usages defines the key usages that may be included in a
CertificateRequest `spec.keyUsages` field.
If set, `spec.keyUsages` in a CertificateRequest must be a subset of the
specified values.
If `[]` or unset, no `spec.keyUsages` are allowed.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.commonName`


CommonName defines the X.509 Common Name that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required marks that the related field must be provided and not be an
empty string.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedcommonnamevalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute value present on request beyond what is possible
to express using value/required.
An attribute value on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>value</b></td>
        <td>string</td>
        <td>
          Value defines the allowed attribute value on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field must match the specified pattern.

NOTE:`value: ""` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.commonName.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.dnsNames`


DNSNames defines the X.509 DNS SANs that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecalloweddnsnamesvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.dnsNames.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.emailAddresses`


EmailAddresses defines the X.509 Email SANs that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedemailaddressesvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.emailAddresses.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.ipAddresses`


IPAddresses defines the X.509 IP SANs that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedipaddressesvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.ipAddresses.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject`


Subject declares the X.509 Subject attributes allowed in a
CertificateRequest. An omitted field forbids any Subject attributes
from being requested.
A CertificateRequest can request a subset of the allowed X.509 Subject
attributes.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectcountries">countries</a></b></td>
        <td>object</td>
        <td>
          Countries define the X.509 Subject Countries that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectlocalities">localities</a></b></td>
        <td>object</td>
        <td>
          Localities defines the X.509 Subject Localities that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectorganizationalunits">organizationalUnits</a></b></td>
        <td>object</td>
        <td>
          OrganizationalUnits defines the X.509 Subject Organizational Units that
may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectorganizations">organizations</a></b></td>
        <td>object</td>
        <td>
          Organizations define the X.509 Subject Organizations that may be
requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectpostalcodes">postalCodes</a></b></td>
        <td>object</td>
        <td>
          PostalCodes defines the X.509 Subject Postal Codes that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectprovinces">provinces</a></b></td>
        <td>object</td>
        <td>
          Provinces defines the X.509 Subject Provinces that may be requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectserialnumber">serialNumber</a></b></td>
        <td>object</td>
        <td>
          SerialNumber defines the X.509 Subject Serial Number that may be
requested.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectstreetaddresses">streetAddresses</a></b></td>
        <td>object</td>
        <td>
          StreetAddresses defines the X.509 Subject Street Addresses that may be
requested.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.countries`


Countries define the X.509 Subject Countries that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectcountriesvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.countries.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.localities`


Localities defines the X.509 Subject Localities that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectlocalitiesvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.localities.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.organizationalUnits`


OrganizationalUnits defines the X.509 Subject Organizational Units that
may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectorganizationalunitsvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.organizationalUnits.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.organizations`


Organizations define the X.509 Subject Organizations that may be
requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectorganizationsvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.organizations.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.postalCodes`


PostalCodes defines the X.509 Subject Postal Codes that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectpostalcodesvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.postalCodes.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.provinces`


Provinces defines the X.509 Subject Provinces that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectprovincesvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.provinces.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.serialNumber`


SerialNumber defines the X.509 Subject Serial Number that may be
requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required marks that the related field must be provided and not be an
empty string.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectserialnumbervalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute value present on request beyond what is possible
to express using value/required.
An attribute value on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>value</b></td>
        <td>string</td>
        <td>
          Value defines the allowed attribute value on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field must match the specified pattern.

NOTE:`value: ""` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.serialNumber.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.streetAddresses`


StreetAddresses defines the X.509 Subject Street Addresses that may be
requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectstreetaddressesvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.streetAddresses.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.uris`


URIs defines the X.509 URI SANs that may be requested.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>required</b></td>
        <td>boolean</td>
        <td>
          Required controls whether the related field must have at least one value.
Defaults to `false`.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedurisvalidationsindex">validations</a></b></td>
        <td>[]object</td>
        <td>
          Validations applies rules using Common Expression Language (CEL) to
validate attribute values present on request beyond what is possible
to express using values/required.
ALL attribute values on the related CertificateRequest field must pass
ALL validations for the request to be granted by this policy.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Values defines allowed attribute values on the related CertificateRequest field.
Accepts wildcards "*".
If set, the related field can only include items contained in the allowed values.

NOTE:`values: []` paired with `required: true` establishes a policy that
will never grant a `CertificateRequest`, but other policies may.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.uris.validations[index]`


ValidationRule describes a validation rule expressed in CEL.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>rule</b></td>
        <td>string</td>
        <td>
          Rule represents the expression which will be evaluated by CEL.
ref: https://github.com/google/cel-spec
The Rule is scoped to the location of the validations in the schema.
The `self` variable in the CEL expression is bound to the scoped value.
To enable more advanced validation rules, approver-policy provides the
`cr` (map) variable to the CEL expression containing `namespace` and
`name` of the `CertificateRequest` resource.

Example (rule for namespaced DNSNames):
```
rule: self.endsWith(cr.namespace + '.svc.cluster.local')
```
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is the message to display when validation fails.
Message is required if the Rule contains line breaks. Note that Message
must not contain line breaks.
If unset, a fallback message is used: "failed rule: `<rule>`".
e.g. "must be a URL with the host matching spec.host"
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.constraints`


Constraints define fields that _must_ be satisfied by a
CertificateRequest for the request to be allowed by this policy.
Omitted fields place no restrictions on the corresponding
attribute in a request.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>maxDuration</b></td>
        <td>string</td>
        <td>
          MaxDuration defines the maximum duration for a certificate request.
for.
Values are inclusive (i.e. a value of `1h` will accept a duration of
`1h`). MinDuration and MaxDuration may be the same value.
If set, a duration _must_ be requested in the CertificateRequest.
An omitted field applies no maximum constraint for duration.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>minDuration</b></td>
        <td>string</td>
        <td>
          MinDuration defines the minimum duration for a certificate request.
Values are inclusive (i.e. a value of `1h` will accept a duration of
`1h`). MinDuration and MaxDuration may be the same value.
If set, a duration _must_ be requested in the CertificateRequest.
An omitted field applies no minimum constraint for duration.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecconstraintsprivatekey">privateKey</a></b></td>
        <td>object</td>
        <td>
          PrivateKey defines constraints on the shape of private key
allowed for a CertificateRequest.
An omitted field applies no private key shape constraints.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.constraints.privateKey`


PrivateKey defines constraints on the shape of private key
allowed for a CertificateRequest.
An omitted field applies no private key shape constraints.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>algorithm</b></td>
        <td>enum</td>
        <td>
          Algorithm defines the allowed crypto algorithm for the private key
in a request.
An omitted field permits any algorithm.
<br/>
          <br/>
            <i>Enum</i>: RSA, ECDSA, Ed25519<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>maxSize</b></td>
        <td>integer</td>
        <td>
          MaxSize defines the maximum key size for a private key.
Values are inclusive (i.e. a min value of `2048` will accept a size
of `2048`). MaxSize and MinSize may be the same value.
An omitted field applies no maximum constraint on size.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>minSize</b></td>
        <td>integer</td>
        <td>
          MinSize defines the minimum key size for a private key.
Values are inclusive (i.e. a min value of `2048` will accept a size
of `2048`). MinSize and MaxSize may be the same value.
An omitted field applies no minimum constraint on size.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.plugins[key]`


CertificateRequestPolicyPluginData is configuration needed by the plugin
approver to evaluate a CertificateRequest on this policy.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>values</b></td>
        <td>map[string]string</td>
        <td>
          Values define a set of well-known, to the plugin, key value pairs that
are required for the plugin to successfully evaluate a request based on
this policy.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.status`


CertificateRequestPolicyStatus defines the observed state of the
CertificateRequestPolicy.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b><a href="#certificaterequestpolicystatusconditionsindex">conditions</a></b></td>
        <td>[]object</td>
        <td>
          List of status conditions to indicate the status of the
CertificateRequestPolicy.
Known condition types are `Ready`.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.status.conditions[index]`


CertificateRequestPolicyCondition contains condition information for a
CertificateRequestPolicyStatus.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
        </tr>
    </thead>
    <tbody><tr>
        <td><b>status</b></td>
        <td>string</td>
        <td>
          Status of the condition, one of ('True', 'False', 'Unknown').
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>type</b></td>
        <td>string</td>
        <td>
          Type of the condition, known values are (`Ready`).
<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>lastTransitionTime</b></td>
        <td>string</td>
        <td>
          LastTransitionTime is the timestamp corresponding to the last status
change of this condition.
<br/>
          <br/>
            <i>Format</i>: date-time<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is a human readable description of the details of the last
transition, complementing reason.
<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>observedGeneration</b></td>
        <td>integer</td>
        <td>
          If set, this represents the .metadata.generation that the condition was
set based upon.
For instance, if .metadata.generation is currently 12, but the
.status.condition[x].observedGeneration is 9, the condition is out of
date with respect to the current state of the CertificateRequestPolicy.
<br/>
          <br/>
            <i>Format</i>: int64<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>reason</b></td>
        <td>string</td>
        <td>
          Reason is a brief machine readable explanation for the condition's last
transition.
<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>
