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
          Name is the name of the source object in the trust Namespace.<br/>
        </td>
        <td>true</td>
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
          Name is the name of the source object in the trust Namespace.<br/>
        </td>
        <td>true</td>
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
