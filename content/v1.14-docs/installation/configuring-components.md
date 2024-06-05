---
title: cert-manager component configuration
description: 'Configure cert-manager components using CLI flags or a configuration file'
---

To configure the cert-manager components, you can use CLI flags or a configuration file.
The CLI flags take precedence over the configuration file.

## CLI flags

An overview of the available CLI flags for each component can be found on the following pages:
- cert-manager controller: [controller CLI flags](../cli/controller.md)
- cert-manager webhook: [webhook CLI flags](../cli/webhook.md)
- cert-manager cainjector: [cainjector CLI flags](../cli/cainjector.md)
- cert-manager acmesolver: [acmesolver CLI flags](../cli/acmesolver.md)
- cert-manager cmctl: [cmctl CLI flags](../cli/cmctl.md)

When using the Helm chart, the CLI flags can be specified in the `extraArgs`, `webhook.extraArgs`, `cainjector.extraArgs` and `acmesolver.extraArgs` values.

## Configuration file

The configuration file is a YAML file that contains the configuration for the cert-manager components.
The configuration file can be specified using the `--config` CLI flag. When using the Helm chart, the
configuration file can be specified in the `config` and `webhook.config` values.

### Controller configuration file

The webhook configuration API documentation can be found on the [ControllerConfiguration](../reference/api-docs.md#controller.config.cert-manager.io/v1alpha1.ControllerConfiguration) page.

This is an example configuration file for the controller component:

```yaml
apiVersion: controller.config.cert-manager.io/v1alpha1
kind: ControllerConfiguration

logging:
  verbosity: 2
  format: text

leaderElectionConfig:
  namespace: my-namespace

kubernetesAPIQPS: 10
kubernetesAPIBurst: 50

numberOfConcurrentWorkers: 200

featureGates:
  AdditionalCertificateOutputFormats: true
  ExperimentalCertificateSigningRequestControllers: true
  ExperimentalGatewayAPISupport: true
  ServerSideApply: true
  LiteralCertificateSubject: true
  UseCertificateRequestBasicConstraints: true
  OtherNames: true
  NameConstraints: true
```

> **Note:** This is included as an example only and not intended to be used as default settings.

### Webhook configuration file

The webhook configuration API documentation can be found on the [WebhookConfiguration](../reference/api-docs.md#webhook.config.cert-manager.io/v1alpha1.WebhookConfiguration) page.

Here is an example configuration file for the webhook component:

```yaml
apiVersion: webhook.config.cert-manager.io/v1alpha1
kind: WebhookConfiguration

logging:
  verbosity: 2
  format: text

securePort: 6443
healthzPort: 6080

featureGates:
  AdditionalCertificateOutputFormats: true
  LiteralCertificateSubject: true
  OtherNames: true
  NameConstraints: true
```

> **Note:** This is included as an example only and not intended to be used as default settings.

## Feature gates

Feature gates can be used to enable or disable experimental features in cert-manager.

There are 2 levels of feature gates (more details in [Kubernetes definition of feature stages](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)):
- **Alpha:** feature is not yet stable and might be removed or changed in the future. Alpha features are disabled by default and need to be explicitly enabled by the user (to test the feature).
- **Beta:** feature is almost stable but might still change in the future. Beta features are enabled by default and can be disabled by the user (if any issues are encountered).

Each cert-manager component has its own set of feature gates. They can be enabled/ disabled using the `--feature-gates` flag or the `featureGates` value in the config file. The available feature gates for each component can be found on the following pages:

- cert-manager controller: [controller feature gates](https://github.com/cert-manager/cert-manager/blob/master/internal/controller/feature/features.go)
- cert-manager webhook: [webhook feature gates](https://github.com/cert-manager/cert-manager/blob/master/internal/webhook/feature/features.go)
- cert-manager cainjector: [cainjector feature gates](https://github.com/cert-manager/cert-manager/blob/master/internal/cainjector/feature/features.go)
