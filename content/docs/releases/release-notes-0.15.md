---
title: Release Notes
description: 'cert-manager release notes: cert-manager v0.15'
---

The `v0.15` release has a few focus areas:

* Experimental new Certificate controller design
* New `installCRDs` option in the Helm chart
* Support for Red Hat's [Operator Lifecycle Manager](https://github.com/operator-framework/operator-lifecycle-manager) for easier deployment in OpenShift environments
* Improved deployment process for webhook component
* General Availability of JKS and PKCS#12 keystore support
* kubectl cert-manager CLI plugin allowing manual renewal and API version conversion

As usual, please read the [upgrade notes](../installation/upgrading/upgrading-0.14-0.15.md) before upgrading.

## Experimental controllers

The Certificate controller is one of the most commonly used controllers in the project.
It represents the 'full lifecycle' of an X.509 private key and certificate, including
private key management and renewal.

As the project is maturing, more requirements around this controller are starting to become
apparent in order to implement feature requests such as private key rotation, JKS/PKCS#12
keystores and manual certificate renewal triggering.

This new controller aims to facilitate the above features, as well as make it easier to develop
individual areas of the controller over time and continue to make improvements.

For more information on this we invite you to read our [design document](https://github.com/cert-manager/cert-manager/pull/2753).

### Using the experimental controllers

We are looking for feedback on the use of these new controllers in different environments. 
If you are able to run these in your cluster and report any issues you're seeing that would
be very helpful to the further development of the project.

The experimental controllers are currently feature gated and disabled by default.
You can enable these by the following steps, in the Helm values set:

```yaml
featureGates: "ExperimentalCertificateControllers=true"
```

If you're using the static manifests you need to edit the cert-manager Deployment using `kubectl -n cert-manager edit deploy cert-manager`
and edit the `args` to include `--feature-gates=ExperimentalCertificateControllers=true`:

```yaml
      containers:
      - args:
        - --v=2
        - --cluster-resource-namespace=$(POD_NAMESPACE)
        - --leader-election-namespace=kube-system
        - --feature-gates=ExperimentalCertificateControllers=true
```

## Helm chart `installCRDs` option

It's been a long-standing feature request to bundle our CRD resources as part
of our Helm chart, to make it easier for users installing with Helm to manage
the lifecycle of the CRDs we create.

To facilitate this, and to help resolve common deployment issues, we have added
a new `installCRDs` option to the Helm chart which will mean the CRD resources
will be managed by your regular Helm installation.

This feature is **disabled** by default, and can be enabled either in your
`values.yaml` file or as a flag with `helm install --set installCRDs=true`.

## Support for OpenShift's Operator Lifecycle Manager

cert-manager can now be deployed as a Red Hat Certified OpenShift Operator.
This is done using the [cert-manager operator](https://github.com/cert-manager/cert-manager-olm).
More information on this can be found on the [OpenShift Installation page](https://cert-manager.io/docs/installation/openshift/).

## Improved deployment of the webhook

In order to improve start up time of the webhook pod, as well as improved reliability and operability,
cert-manager `v0.15` includes a new `DynamicAuthority` structure in the webhook that is used to manage the
CA used to secure the webhook.

Instances of the webhook will keep this CA up to date and use it to generate serving certificates which
are used to secure incoming connections.

This means that the cert-manager-controller component is no longer required to be running in order for webhook startup to succeed.
This also means that users should no longer see long start up times for this pod unless there is a genuine issue/error that needs resolving.

## General Availability of JKS and PKCS#12 keystores

`v0.14` added experimental 'bundle format' support for JKS and PKCS#12.
In `v0.15` the `keystore` got added to the Certificate spec which makes cert-manager
add an additional keystore in your Certificate's Secret resource.
No additional feature gates need to be set anymore.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: crt
spec:
  secretName: crt-secret
  dnsNames:
  - foo.example.com
  - bar.example.com
  issuerRef:
    name: letsencrypt-prod
  keystores:
    jks:
      create: true
      passwordSecretRef: # Password used to encrypt the keystore
        key: password-key
        name: jks-password-secret
    pkcs12:
      create: true
      passwordSecretRef: # Password used to encrypt the keystore
        key: password-key
        name: pkcs12-password-secret
```

For JKS this adds the files: `keystore.jks` and `truststore.jks` to the target `spec.secretName`.
For PKCS#12, it adds the file `keystore.p12`.

## kubectl cert-manager tool

kubectl cert-manager is a kubectl plugin that assists with controlling cert-manager inside your
Kubernetes cluster. The kubectl cert-manager binary can be downloaded from the [GitHub release page](https://github.com/cert-manager/cert-manager/releases/tag/v0.15.0).
In `v0.15` the use is currently limited to the `convert` and `renew` commands.

`kubectl cert-manager renew` can be used to manually trigger renewal of your certificates. This required the `ExperimentalCertificateControllers` feature gate to be set.

`kubectl cert-manager convert` can be used to convert cert-manager config files between different API versions
if your cluster does not support the conversion webhook (i.e. running the 'legacy' release)
or if you want to upgrade all your local cert-manager configuration files.