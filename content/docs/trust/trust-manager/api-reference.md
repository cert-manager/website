---
title: trust-manager API Reference
description: "trust-manager API documentation for custom resources"
---

Packages:

- [`trust.cert-manager.io/v1alpha1`](#trustcert-manageriov1alpha1)

# `trust.cert-manager.io/v1alpha1`

Resource Types:


- [Bundle](#bundle)




## `Bundle`







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
      <td>trust.cert-manager.io/v1alpha1</td>
      <td>true</td>
      </tr>
      <tr>
      <td><b>kind</b></td>
      <td>string</td>
      <td>Bundle</td>
      <td>true</td>
      </tr>
      <tr>
      <td><b><a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#objectmeta-v1-meta">metadata</a></b></td>
      <td>object</td>
      <td>Refer to the Kubernetes API documentation for the fields of the `metadata` field.</td>
      <td>true</td>
      </tr><tr>
        <td><b><a href="#bundlespec">spec</a></b></td>
        <td>object</td>
        <td>
          Desired state of the Bundle resource.<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b><a href="#bundlestatus">status</a></b></td>
        <td>object</td>
        <td>
          Status of the Bundle. This is set and managed automatically.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.spec`


Desired state of the Bundle resource.

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
        <td><b><a href="#bundlespecsourcesindex">sources</a></b></td>
        <td>[]object</td>
        <td>
          Sources is a set of references to data whose data will sync to the target.<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b><a href="#bundlespectarget">target</a></b></td>
        <td>object</td>
        <td>
          Target is the target location in all namespaces to sync source data to.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>


### `Bundle.spec.sources[index]`


BundleSource is the set of sources whose data will be appended and synced to the BundleTarget in all Namespaces.

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
        <td><b><a href="#bundlespecsourcesindexconfigmap">configMap</a></b></td>
        <td>object</td>
        <td>
          ConfigMap is a reference to a ConfigMap's `data` key, in the trust Namespace.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>inLine</b></td>
        <td>string</td>
        <td>
          InLine is a simple string to append as the source data.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlespecsourcesindexsecret">secret</a></b></td>
        <td>object</td>
        <td>
          Secret is a reference to a Secrets's `data` key, in the trust Namespace.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>useDefaultCAs</b></td>
        <td>boolean</td>
        <td>
          UseDefaultCAs, when true, requests the default CA bundle to be used as a source. Default CAs are available if trust-manager was installed via Helm or was otherwise set up to include a package-injecting init container by using the "--default-package-location" flag when starting the trust-manager controller. If default CAs were not configured at start-up, any request to use the default CAs will fail. The version of the default CA package which is used for a Bundle is stored in the defaultCAPackageVersion field of the Bundle's status field.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.spec.sources[index].configMap`


ConfigMap is a reference to a ConfigMap's `data` key, in the trust Namespace.

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name is the name of the source object in the trust Namespace. If not set, `selector` must be set.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#labelselector-v1-meta">selector</a></b></td>
        <td>LabelSelector</td>
        <td>
          A LabelSelector object to reference, by labels, a list of source objects in the trust Namespace. If not set, `name` must be set.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.spec.sources[index].secret`


Secret is a reference to a Secrets's `data` key, in the trust Namespace.

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr><tr>
        <td><b>name</b></td>
        <td>string</td>
        <td>
          Name is the name of the source object in the trust Namespace. If not set, `selector` must be set.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.26/#labelselector-v1-meta">selector</a></b></td>
        <td>LabelSelector</td>
        <td>
          A LabelSelector object to reference, by labels, a list of source objects in the trust Namespace. If not set, `name` must be set.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.spec.target`


Target is the target location in all namespaces to sync source data to.

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
        <td><b><a href="#bundlespectargetadditionalformats">additionalFormats</a></b></td>
        <td>object</td>
        <td>
          AdditionalFormats specifies any additional formats to write to the target.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlespectargetconfigmap">configMap</a></b></td>
        <td>object</td>
        <td>
          ConfigMap is the target ConfigMap in Namespaces that all Bundle source data will be synced to.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlespectargetnamespaceselector">namespaceSelector</a></b></td>
        <td>object</td>
        <td>
          NamespaceSelector will, if set, only sync the target resource in Namespaces which match the selector.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlespectargetsecret">secret</a></b></td>
        <td>object</td>
        <td>
          Secret is the target Secret that all Bundle source data will be synced to. Using Secrets as targets is only supported if enabled at trust-manager startup. By default, trust-manager has no permissions for writing to secrets and can only read secrets in the trust namespace.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.spec.target.additionalFormats`


AdditionalFormats specifies any additional formats to write to the target.

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
        <td><b><a href="#bundlespectargetadditionalformatsjks">jks</a></b></td>
        <td>object</td>
        <td>
          JKS requests a JKS-formatted binary trust bundle to be written to the target. The bundle is created with the hardcoded password "changeit".<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlespectargetadditionalformatspkcs12">pkcs12</a></b></td>
        <td>object</td>
        <td>
          PKCS12 requests a PKCS12-formatted binary trust bundle to be written to the target. The bundle is created without a password.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.spec.target.additionalFormats.jks`


JKS requests a JKS-formatted binary trust bundle to be written to the target. The bundle is created with the hardcoded password "changeit".

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>


### `Bundle.spec.target.additionalFormats.pkcs12`


PKCS12 requests a PKCS12-formatted binary trust bundle to be written to the target. The bundle is created without a password.

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>


### `Bundle.spec.target.configMap`


ConfigMap is the target ConfigMap in Namespaces that all Bundle source data will be synced to.

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>


### `Bundle.spec.target.namespaceSelector`


NamespaceSelector will, if set, only sync the target resource in Namespaces which match the selector.

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
          MatchLabels matches on the set of labels that must be present on a Namespace for the Bundle target to be synced there.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.spec.target.secret`


Secret is the target Secret that all Bundle source data will be synced to. Using Secrets as targets is only supported if enabled at trust-manager startup. By default, trust-manager has no permissions for writing to secrets and can only read secrets in the trust namespace.

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>


### `Bundle.status`


Status of the Bundle. This is set and managed automatically.

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
        <td><b><a href="#bundlestatusconditionsindex">conditions</a></b></td>
        <td>[]object</td>
        <td>
          List of status conditions to indicate the status of the Bundle. Known condition types are `Bundle`.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b>defaultCAVersion</b></td>
        <td>string</td>
        <td>
          DefaultCAPackageVersion, if set and non-empty, indicates the version information which was retrieved when the set of default CAs was requested in the bundle source. This should only be set if useDefaultCAs was set to "true" on a source, and will be the same for the same version of a bundle with identical certificates.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlestatustarget">target</a></b></td>
        <td>object</td>
        <td>
          Target is the current Target that the Bundle is attempting or has completed syncing the source data to.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.status.conditions[index]`


BundleCondition contains condition information for a Bundle.

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
          Type of the condition, known values are (`Synced`).<br/>
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
          If set, this represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.condition[x].observedGeneration is 9, the condition is out of date with respect to the current state of the Bundle.<br/>
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


### `Bundle.status.target`


Target is the current Target that the Bundle is attempting or has completed syncing the source data to.

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
        <td><b><a href="#bundlestatustargetadditionalformats">additionalFormats</a></b></td>
        <td>object</td>
        <td>
          AdditionalFormats specifies any additional formats to write to the target.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlestatustargetconfigmap">configMap</a></b></td>
        <td>object</td>
        <td>
          ConfigMap is the target ConfigMap in Namespaces that all Bundle source data will be synced to.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlestatustargetnamespaceselector">namespaceSelector</a></b></td>
        <td>object</td>
        <td>
          NamespaceSelector will, if set, only sync the target resource in Namespaces which match the selector.<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlestatustargetsecret">secret</a></b></td>
        <td>object</td>
        <td>
          Secret is the target Secret that all Bundle source data will be synced to. Using Secrets as targets is only supported if enabled at trust-manager startup. By default, trust-manager has no permissions for writing to secrets and can only read secrets in the trust namespace.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.status.target.additionalFormats`


AdditionalFormats specifies any additional formats to write to the target.

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
        <td><b><a href="#bundlestatustargetadditionalformatsjks">jks</a></b></td>
        <td>object</td>
        <td>
          JKS requests a JKS-formatted binary trust bundle to be written to the target. The bundle is created with the hardcoded password "changeit".<br/>
        </td>
        <td>false</td>
      </tr><tr>
        <td><b><a href="#bundlestatustargetadditionalformatspkcs12">pkcs12</a></b></td>
        <td>object</td>
        <td>
          PKCS12 requests a PKCS12-formatted binary trust bundle to be written to the target. The bundle is created without a password.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.status.target.additionalFormats.jks`


JKS requests a JKS-formatted binary trust bundle to be written to the target. The bundle is created with the hardcoded password "changeit".

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>


### `Bundle.status.target.additionalFormats.pkcs12`


PKCS12 requests a PKCS12-formatted binary trust bundle to be written to the target. The bundle is created without a password.

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>


### `Bundle.status.target.configMap`


ConfigMap is the target ConfigMap in Namespaces that all Bundle source data will be synced to.

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>


### `Bundle.status.target.namespaceSelector`


NamespaceSelector will, if set, only sync the target resource in Namespaces which match the selector.

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
          MatchLabels matches on the set of labels that must be present on a Namespace for the Bundle target to be synced there.<br/>
        </td>
        <td>false</td>
      </tr></tbody>
</table>


### `Bundle.status.target.secret`


Secret is the target Secret that all Bundle source data will be synced to. Using Secrets as targets is only supported if enabled at trust-manager startup. By default, trust-manager has no permissions for writing to secrets and can only read secrets in the trust namespace.

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
        <td><b>key</b></td>
        <td>string</td>
        <td>
          Key is the key of the entry in the object's `data` field to be used.<br/>
        </td>
        <td>true</td>
      </tr></tbody>
</table>
