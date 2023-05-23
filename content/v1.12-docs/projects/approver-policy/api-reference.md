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





CertificateRequestPolicy is an object for describing a "policy profile" that makes decisions on whether applicable CertificateRequests should be approved or denied.

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
          CertificateRequestPolicySpec defines the desired state of CertificateRequestPolicy.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicystatus">status</a></b></td>
        <td>object</td>
        <td>
          CertificateRequestPolicyStatus defines the observed state of the CertificateRequestPolicy.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec`


CertificateRequestPolicySpec defines the desired state of CertificateRequestPolicy.

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
          Selector is used for selecting over which CertificateRequests this CertificateRequestPolicy is appropriate for and so will used for its approval evaluation.<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowed">allowed</a></b></td>
        <td>object</td>
        <td>
          Allowed is the set of attributes that are "allowed" by this policy. A CertificateRequest will only be considered permissible for this policy if the CertificateRequest has the same or less as what is allowed.  Empty or `nil` allowed fields mean CertificateRequests are not allowed to have that field present to be permissible.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecconstraints">constraints</a></b></td>
        <td>object</td>
        <td>
          Constraints is the set of attributes that _must_ be satisfied by the CertificateRequest for the request to be permissible by the policy. Empty or `nil` constraint fields mean CertificateRequests satisfy that field with any value of their corresponding attribute.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecpluginskey">plugins</a></b></td>
        <td>map[string]object</td>
        <td>
          Plugins define a set of plugins and their configuration that should be executed when this policy is evaluated against a CertificateRequest. A plugin must already be built within approver-policy for it to be available.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.selector`


Selector is used for selecting over which CertificateRequests this CertificateRequestPolicy is appropriate for and so will used for its approval evaluation.

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
          IssuerRef is used to match this CertificateRequestPolicy against processed CertificateRequests. This policy will only be evaluated against a CertificateRequest whose `spec.issuerRef` field matches `spec.selector.issuerRef`. CertificateRequests will not be processed on unmatched `issuerRef` if defined, regardless of whether the requestor is bound by RBAC. Accepts wildcards "*". Omitted values are equivalent to "*". 
 The following value will match _all_ `issuerRefs`: ``` issuerRef: {} ```<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecselectornamespace">namespace</a></b></td>
        <td>object</td>
        <td>
          Namespace is used to select on Namespaces, meaning the CertificateRequestPolicy will only match on CertificateRequests that have been created in matching selected Namespaces. If this field is omitted, all Namespaces are selected.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.selector.issuerRef`


IssuerRef is used to match this CertificateRequestPolicy against processed CertificateRequests. This policy will only be evaluated against a CertificateRequest whose `spec.issuerRef` field matches `spec.selector.issuerRef`. CertificateRequests will not be processed on unmatched `issuerRef` if defined, regardless of whether the requestor is bound by RBAC. Accepts wildcards "*". Omitted values are equivalent to "*". 
 The following value will match _all_ `issuerRefs`: ``` issuerRef: {} ```

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
          Group is the wildcard selector to match the `spec.issuerRef.group` field on requests. Accepts wildcards "*". An omitted field or value of `nil` matches all.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>kind</b></td>
        <td>string</td>
        <td>
          Kind is the wildcard selector to match the `spec.issuerRef.kind` field on requests. Accepts wildcards "*". An omitted field or value of `nil` matches all.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name is the wildcard selector to match the `spec.issuerRef.name` field on requests. Accepts wildcards "*". An omitted field or value of `nil` matches all.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.selector.namespace`


Namespace is used to select on Namespaces, meaning the CertificateRequestPolicy will only match on CertificateRequests that have been created in matching selected Namespaces. If this field is omitted, all Namespaces are selected.

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
          MatchLabels is the set of Namespace labels that select on CertificateRequests which have been created in a Namespace matching the selector.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>matchNames</b></td>
        <td>[]string</td>
        <td>
          MatchNames are the set of Namespace names that select on CertificateRequests that have been created in a matching Namespace. Accepts wildcards "*".<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed`


Allowed is the set of attributes that are "allowed" by this policy. A CertificateRequest will only be considered permissible for this policy if the CertificateRequest has the same or less as what is allowed.  Empty or `nil` allowed fields mean CertificateRequests are not allowed to have that field present to be permissible.

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
          CommonName defines the X.509 Common Name that is permissible.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecalloweddnsnames">dnsNames</a></b></td>
        <td>object</td>
        <td>
          DNSNames defines the X.509 DNS SANs that may be requested for. Accepts wildcards "*".<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedemailaddresses">emailAddresses</a></b></td>
        <td>object</td>
        <td>
          EmailAddresses defines the X.509 Email SANs that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedipaddresses">ipAddresses</a></b></td>
        <td>object</td>
        <td>
          IPAddresses defines the X.509 IP SANs that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>isCA</b></td>
        <td>boolean</td>
        <td>
          IsCA defines whether it is permissible for a CertificateRequest to have the `spec.IsCA` field set to `true`. An omitted field, value of `nil` or `false`, forbids the `spec.IsCA` field from bring `true`. A value of `true` permits CertificateRequests setting the `spec.IsCA` field to `true`.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubject">subject</a></b></td>
        <td>object</td>
        <td>
          Subject defines the X.509 subject that is permissible. An omitted field or value of `nil` forbids any Subject being requested.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecalloweduris">uris</a></b></td>
        <td>object</td>
        <td>
          URIs defines the X.509 URI SANs that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>usages</b></td>
        <td>[]enum</td>
        <td>
          Usages defines the list of permissible key usages that may appear on the CertificateRequest `spec.keyUsages` field. An omitted field or value of `nil` forbids any Usages being requested. An empty slice `[]` is equivalent to `nil`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.commonName`


CommonName defines the X.509 Common Name that is permissible.

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
          Required marks this field as being a required value on the request. May only be set to true if Value is also defined.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>value</b></td>
        <td>string</td>
        <td>
          Value defines the value that is permissible to be present on the request. Accepts wildcards "*". An omitted field or value of `nil` forbids the value from being requested. An empty string is equivalent to `nil`, however an empty string pared with Required as `true` is an impossible condition that always denies. Value may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.dnsNames`


DNSNames defines the X.509 DNS SANs that may be requested for. Accepts wildcards "*".

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.emailAddresses`


EmailAddresses defines the X.509 Email SANs that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.ipAddresses`


IPAddresses defines the X.509 IP SANs that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject`


Subject defines the X.509 subject that is permissible. An omitted field or value of `nil` forbids any Subject being requested.

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
          Countries define the X.509 Subject Countries that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectlocalities">localities</a></b></td>
        <td>object</td>
        <td>
          Localities defines the X.509 Subject Localities that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectorganizationalunits">organizationalUnits</a></b></td>
        <td>object</td>
        <td>
          OrganizationalUnits defines the X.509 Subject Organizational Units that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectorganizations">organizations</a></b></td>
        <td>object</td>
        <td>
          Organizations define the X.509 Subject Organizations that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectpostalcodes">postalCodes</a></b></td>
        <td>object</td>
        <td>
          PostalCodes defines the X.509 Subject Postal Codes that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectprovinces">provinces</a></b></td>
        <td>object</td>
        <td>
          Provinces defines the X.509 Subject Provinces that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectserialnumber">serialNumber</a></b></td>
        <td>object</td>
        <td>
          SerialNumber defines the X.509 Subject Serial Number that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecallowedsubjectstreetaddresses">streetAddresses</a></b></td>
        <td>object</td>
        <td>
          StreetAddresses defines the X.509 Subject Street Addresses that may be requested for.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.countries`


Countries define the X.509 Subject Countries that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.localities`


Localities defines the X.509 Subject Localities that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.organizationalUnits`


OrganizationalUnits defines the X.509 Subject Organizational Units that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.organizations`


Organizations define the X.509 Subject Organizations that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.postalCodes`


PostalCodes defines the X.509 Subject Postal Codes that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.provinces`


Provinces defines the X.509 Subject Provinces that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.serialNumber`


SerialNumber defines the X.509 Subject Serial Number that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Value is also defined.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>value</b></td>
        <td>string</td>
        <td>
          Value defines the value that is permissible to be present on the request. Accepts wildcards "*". An omitted field or value of `nil` forbids the value from being requested. An empty string is equivalent to `nil`, however an empty string pared with Required as `true` is an impossible condition that always denies. Value may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.subject.streetAddresses`


StreetAddresses defines the X.509 Subject Street Addresses that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.allowed.uris`


URIs defines the X.509 URI SANs that may be requested for.

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
          Required marks this field as being a required value on the request. May only be set to true if Values is also defined. Default is nil which marks the field as not required.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>values</b></td>
        <td>[]string</td>
        <td>
          Defines the values that are permissible to be present on request. Accepts wildcards "*". An omitted field or value of `nil` forbids any value on the related field in the request from being requested. An empty slice `[]` is equivalent to `nil`, however an empty slice pared with Required `true` is an impossible condition that always denies. Values may not be `nil` if Required is `true`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.constraints`


Constraints is the set of attributes that _must_ be satisfied by the CertificateRequest for the request to be permissible by the policy. Empty or `nil` constraint fields mean CertificateRequests satisfy that field with any value of their corresponding attribute.

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
          MaxDuration defines the maximum duration a certificate may be requested for. Values are inclusive (i.e. a max value of `1h` will accept a duration of `1h`). MaxDuration and MinDuration may be the same value. An omitted field or value of `nil` permits any maximum duration. If MaxDuration is defined, a duration _must_ be requested on the CertificateRequest.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>minDuration</b></td>
        <td>string</td>
        <td>
          MinDuration defines the minimum duration a certificate may be requested for. Values are inclusive (i.e. a min value of `1h` will accept a duration of `1h`). MinDuration and MaxDuration may be the same value. An omitted field or value of `nil` permits any minimum duration. If MinDuration is defined, a duration _must_ be requested on the CertificateRequest.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#certificaterequestpolicyspecconstraintsprivatekey">privateKey</a></b></td>
        <td>object</td>
        <td>
          PrivateKey defines the shape of permissible private keys that may be used for the request with this policy. An omitted field or value of `nil` permits the use of any private key by the requestor.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.constraints.privateKey`


PrivateKey defines the shape of permissible private keys that may be used for the request with this policy. An omitted field or value of `nil` permits the use of any private key by the requestor.

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
          Algorithm defines the allowed crypto algorithm that is used by the requestor for their private key in their request. An omitted field or value of `nil` permits any Algorithm.<br/>
          <br/>
            <i>Enum</i>: RSA, ECDSA, Ed25519<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>maxSize</b></td>
        <td>integer</td>
        <td>
          MaxSize defines the maximum key size a requestor may use for their private key. Values are inclusive (i.e. a min value of `2048` will accept a size of `2048`). MaxSize and MinSize may be the same value. An omitted field or value of `nil` permits any maximum size.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>minSize</b></td>
        <td>integer</td>
        <td>
          MinSize defines the minimum key size a requestor may use for their private key. Values are inclusive (i.e. a min value of `2048` will accept a size of `2048`). MinSize and MaxSize may be the same value. An omitted field or value of `nil` permits any minimum size.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.spec.plugins[key]`


CertificateRequestPolicyPluginData is configuration needed by the plugin approver to evaluate a CertificateRequest on this policy.

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
          Values define a set of well-known, to the plugin, key value pairs that are required for the plugin to successfully evaluate a request based on this policy.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.status`


CertificateRequestPolicyStatus defines the observed state of the CertificateRequestPolicy.

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
          List of status conditions to indicate the status of the CertificateRequestPolicy. Known condition types are `Ready`.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `CertificateRequestPolicy.status.conditions[index]`


CertificateRequestPolicyCondition contains condition information for a CertificateRequestPolicyStatus.

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
          Status of the condition, one of ('True', 'False', 'Unknown').<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>type</b></td>
        <td>string</td>
        <td>
          Type of the condition, known values are (`Ready`).<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>lastTransitionTime</b></td>
        <td>string</td>
        <td>
          LastTransitionTime is the timestamp corresponding to the last status change of this condition.<br/>
          <br/>
            <i>Format</i>: date-time<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>message</b></td>
        <td>string</td>
        <td>
          Message is a human readable description of the details of the last transition, complementing reason.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>observedGeneration</b></td>
        <td>integer</td>
        <td>
          If set, this represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.condition[x].observedGeneration is 9, the condition is out of date with respect to the current state of the CertificateRequestPolicy.<br/>
          <br/>
            <i>Format</i>: int64<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>reason</b></td>
        <td>string</td>
        <td>
          Reason is a brief machine readable explanation for the condition's last transition.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>
