---
title: "Release Notes"
linkTitle: "v0.15"
weight: 860
type: "docs"
---

The `v0.15` release has a few focus areas:

* Experimental improved controllers
* Support for OpenShift's OLM
* Improved deployment of the webhook
* General Availability of JKS and PKCS#12 keystores
* cmctl CLI tool


As usual, please read the [upgrade notes](/docs/installation/upgrading/upgrading-0.14-0.15/) before upgrading.

## Experimental controllers

The Certificate controller is one of the most commonly used controllers in the project.
It represents the 'full lifecycle' of an x509 private key and certificate, including
private key management and renewal.

As the project is maturing, more requirements around this controller are starting to become
apparent.
In order to implement feature requests suck as private key rotation, JKS and PKCS12 keystores
and manual certificate renewal triggering

This new controller aims to facilitate the above features, as well as make it easier to develop individual
areas of the controller over time and continue to make improvements.

For more information on this we invite you to read our [design document](https://github.com/jetstack/cert-manager/pull/2753).

### Using the experimental controllers

We are looking for feedback on the use of these new controllers in different environments. 
If you are able to run these in your cluster and report any issues you're seeing that would
be very helpful to the further development of cert-manager.

The experimental controllers are currently feature gated. You can enable these by the following steps:
In the Helm values set:
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


## Support for OpenShift's OLM

cert-manager is now deployable as a RedHat Certified OpenShift Operator.
This is done using the [cert-manager operator](https://github.com/jetstack/cert-manager-olm).
More information on this can be found on the [OpenShift Installation page](https://cert-manager.io/docs/installation/openshift/).


## Improved deployment of the webhook

In order to improve start up time of the webhook pod, as well as improved reliability and operability, we added a new `DynamicAuthority` structure into the webhook that is used to 'manage' a self signed CA stored in a Secret resource.

Instances of the webhook will then keep this CA up to date and use it to generate 'serving' certificates that are used to listen with.
This means that the cert-manager-controller component is no longer required to be running in order for webhook startup to succeed.
This also means that users should no longer see long start up times for this pod unless there is a genuine issue/error that needs resolving.

## General Availability of JKS and PKCS#12 keystores
`v0.14` added experimental 'bundle format' support for JKS and PKCS#12.
In `v0.15` the `keystore` got added to the Certificate spec which makes cert-manager
add an additional keystore in your Certificate's Secret resource. No additional feature gates need to be set anymore.

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
spec:
  format: PKCS8 # supports PKCS8 or PKCS1
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

For JKS this adds `keystore.jks` and `truststore.jks` and `keystore.p12` for PKCS#12.

## cmctl CLI tool

cmctl is a CLI tool that assists with controlling cert-manager inside your
Kubernetes cluster. The cmctl binary can be downloaded from the [GitHub release page](https://github.com/jetstack/cert-manager/releases/tag/v0.15).
In `v0.15` the use is currently limited to the `convert` and `renew` commands.

`cmctl renew` can be used to manually trigger renewal of your certificates. This required the `ExperimentalCertificateControllers` feature gate to be set.

`cmctl convert` can be used to convert cert-manager config files between different API versions if your cluster does not support the conversion webhook or if you want to upgrade all your local cert-manager configuration files.