---
Title: Implementing feature gates
description: 'cert-manager contributing guide: Implementing feature gates'
---

As of v1 release cert-manager is considered stable. We aim to follow Kubernetes API compatibility policy when making API changes, see [API compatibility](../installation/api-compatibility.md) to avoid breaking users' existing cert-manager installations.
This means that as developers we are somewhat limited in regards to changing existing behavior, i.e renaming or removing API elements or changing their behavior.

New functionality that is not yet stable[^1] can still be added, but it needs to be placed behind a feature gate.

## Feature gated API fields

Feature gated API fields are implemented using `--feature-gates` flags of cert-manager [webhook](../cli/webhook.md) and [controller](../cli/controller.md).

A feature gated API field is always visible to the user (i.e when running `kubectl explain <some-resource>`), but is only functional if the relevant feature is explicitly enabled via feature flags for both the webhook and controller.

If a user attempts to apply a resource with the feature gated field set to a non-nil value, but the feature gate is not enabled, the resource will get rejected by the webhook validation.
This mechanism differs from [the one that Kubernetes uses for feature gated API field implementation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md#new-field-in-existing-api-version) where the field will be simply set to nil if the feature gate is disabled. We chose to use webhook validation instead to make debugging easier for users who are attempting to use the feature gated field, but have forgotten to enable the feature gate.


### Implementation

- Implement the new field and document that it is feature gated and in order to use it the controller and webhook feature gates need enabling
- Add a new [webhook feature gate](https://github.com/cert-manager/cert-manager/blob/3a055cc2f56c1c2874807af4a8f84d0a1c46ccb4/internal/webhook/feature/features.go#L25-L39) for the field
- Update webhook validation checks for the relevant resource kind to ensure that if the feature gated field is set, but the webhook feature gate is not enabled, the resource gets rejected
- Add a new [controller feature gate](https://github.com/cert-manager/cert-manager/blob/2417132b3cd017b5f0974006e03c2b8a540efe3f/internal/controller/feature/features.go#L26-L54) for the field
- Ensure that any control loops that use the feature, check that the feature gate is actually enabled. (This is required to cover edge cases such as if the webhook runs a version of cert-manager where the feature is in GA whereas controller runs an older version where the feature is still in experimental state)
- Ensure that the feature gate is added to cert-manager installation scripts for CI and local tests in [make](https://github.com/cert-manager/cert-manager/blob/134398e939bb2b1401697eaf589405ad469cd609/make/e2e-setup.mk#L165) and [bazel](https://github.com/cert-manager/cert-manager/blob/fd747b42b9ab4b6409b61b7946e8dc14d532e950/devel/addon/certmanager/install.sh#L26) scripts
- Default cert-manger e2e CI tests run with all feature gates for all components enabled. There is an additional optional e2e test that runs with all feature gates disabled. You can trigger that for your PR with `/test pull-cert-manager-e2e-feature-gates-disabled` to verify that all works as expected both with and without the new feature gate.

### Potential issues

- The person deploying cert-manager has to remember to set two cert-manager feature gates, one of the webhook one on the controller for the feature to function. Forgetting to set one of them might result in unexpected behavior

- A user must remember to remove the alpha fields from their manifests when disabling a previously enabled API feature. Failing to do so might result in unexpected behavior- for example forgetting to remove feature gated field from a `Certificate` resource might result in failed renewals at some later point when cert-manager's controller will attempt to update the `Certificate` spec, but the webhook will reject the update due to the feature gated field being set.

### References

- cert-manager's [API compatibility promise](../installation/api-compatibility.md)

- An example implementation of an alpha field is [`AdditionalOutputFormats` field on `Certificate` spec](https://github.com/cert-manager/cert-manager/blob/dbad3d98f3d7d85cadb4bd2c2493faf8b666b313/internal/apis/certmanager/types_certificate.go#L169-L174)

- [Kubernetes definition of feature stages](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)

- Kubernetes [API change design](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)

[^1]: For example, functionality that might change in the future in response to user feedback
