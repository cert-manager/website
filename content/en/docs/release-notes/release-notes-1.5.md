---
title: "Release Notes"
linkTitle: "v1.5"
weight: 780
type: "docs"
---

# Release `v1.5.0`

Special thanks to the external contributors who contributed to this release:

* [@jonathansp](https://github.com/jonathansp)
* [@benlangfeld](https://github.com/benlangfeld)

## Deprecated Features and Breaking Changes

### TODO

## New Features

### Secret Templates

We introduce the concept of `SecretTemplate` for `Certificates`. When a certificate is issued, a new `Secret` is created to hold the certificate data. This secret is created by cert-manager. In order to use third-party solutions such as [kubed](https://github.com/kubeops/kubed) to copy this secret to multiple namespaces, this secret must be annotated.

`SecretTemplate` is optional. Labels and annotations from the template will be synced to the `Secret` at the time when the certificate is created or renewed.

```yaml
# certificate.yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: example-com
  namespace: sandbox
spec:
  secretName: example-com-tls
  secretTemplate:
    annotations:
      my-secret-annotation: "foo"
    labels:
      my-secret-label: bar
```
*Note*: Currently labels and annotations can only be added or replaced, but not removed. Removing any labels or annotations from the template or removing the template itself will have no effect.

Implemented in cert-manager PR [#3828][]

[#3828]: https://github.com/jetstack/cert-manager/pull/3828 "feat: add support to secretTemplates"

## Bug Fixes

### TODO

## Other Changes

### TODO
