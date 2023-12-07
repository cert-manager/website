---
title: cert-manager feature gates
description: 'cert-manager contributing guide: Feature gates'
---

As of v1 release cert-manager is considered stable. We aim to follow Kubernetes API compatibility policy when making API changes, see [API compatibility](../contributing/api-compatibility.md) to avoid breaking users' existing cert-manager installations.
This means that as developers we are somewhat limited in regards to changing existing behavior, i.e renaming or removing API elements or changing their behavior.

New functionality that is not yet stable[^1] can still be added, but it needs to be placed behind a feature gate.

## Enabling/ disabling feature gates

Feature gates can be enabled or disabled using CLI flags or config files, more info can be found in [configuring components](../installation/configuring-components.md).

## Feature gated API fields

Feature gated API fields are implemented using `--feature-gates` flags of cert-manager [webhook](../cli/webhook.md), [cainjector](../cli/cainjector.md) and [controller](../cli/controller.md).

A feature gated API field is always visible to the user (i.e when running `kubectl explain <some-resource>`), but is only functional if the relevant feature is explicitly enabled via feature flags for both the webhook and controller.

If a user attempts to apply a resource with the feature gated field set to a non-nil value, but the feature gate is not enabled, the resource will get rejected by the webhook validation.
This mechanism differs from [the one that Kubernetes uses for feature gated API field implementation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md#new-field-in-existing-api-version) where the field will be simply set to nil if the feature gate is disabled. We chose to use webhook validation instead to make debugging easier for users who are attempting to use the feature gated field, but have forgotten to enable the feature gate.

### Implementation

- Implement the new field and document that it is feature gated and in order to use it the controller and webhook feature gates need enabling
- Add a new [webhook feature gate](https://github.com/cert-manager/cert-manager/blob/7c7e8f4ce6c1abba18025d3d00be368066801a63/internal/webhook/feature/features.go#L31-L64) for the field
- Update webhook validation checks for the relevant resource kind to ensure that if the feature gated field is set, but the webhook feature gate is not enabled, the resource gets rejected
- Add a new [controller feature gate](https://github.com/cert-manager/cert-manager/blob/7c7e8f4ce6c1abba18025d3d00be368066801a63/internal/controller/feature/features.go#L32-L121) for the field
- Ensure that any control loops that use the feature, check that the feature gate is actually enabled. (This is required to cover edge cases such as if the webhook runs a version of cert-manager where the feature is in GA whereas controller runs an older version where the feature is still in experimental state)
- Ensure that the feature gate is added to cert-manager installation scripts for CI and local tests in [make](https://github.com/cert-manager/cert-manager/blob/7c7e8f4ce6c1abba18025d3d00be368066801a63/make/e2e-setup.mk#L197) and [bash](https://github.com/cert-manager/cert-manager/blob/7c7e8f4ce6c1abba18025d3d00be368066801a63/make/e2e.sh#L80) scripts
- Default cert-manger e2e CI tests run with all feature gates for all components enabled. There is an additional optional e2e test that runs with all feature gates disabled. You can trigger that for your PR with `/test pull-cert-manager-e2e-feature-gates-disabled` to verify that all works as expected both with and without the new feature gate.

### Potential issues

- The person deploying cert-manager has to remember to set two cert-manager feature gates, one of the webhook one on the controller for the feature to function. Forgetting to set one of them might result in unexpected behavior

- A user must remember to remove the alpha fields from their manifests when disabling a previously enabled API feature. Failing to do so might result in unexpected behavior- for example forgetting to remove feature gated field from a `Certificate` resource might result in failed renewals at some later point when cert-manager's controller will attempt to update the `Certificate` spec, but the webhook will reject the update due to the feature gated field being set.

### References

- cert-manager's [API compatibility promise](../contributing/api-compatibility.md)

- [Kubernetes definition of feature stages](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)

- Kubernetes [API change design](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)

[^1]: For example, functionality that might change in the future in response to user feedback
