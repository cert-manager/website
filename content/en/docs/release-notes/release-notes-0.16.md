---
title: "Release Notes"
linkTitle: "v0.16"
weight: 850
type: "docs"
---

The `v0.16` release has a few focus areas:

* Enable the new certificate controller for all users
* `kubectl cert-manager create certificaterequest` for signing local certificates
* `v1beta1` API


As usual, please read the [upgrade notes](/docs/installation/upgrading/upgrading-0.15-0.16/) before upgrading.

## New certificate controller

The Certificate controller is one of the most commonly used controllers in the project.
It represents the 'full lifecycle' of an x509 private key and certificate, including
private key management and renewal.

In v0.15 we added these under a feature gate to allow users to test these and gather feedback.
Thanks to everyone testing these and reporting issues we were able to fix issues and improve the controller.
In v0.16 this controller is now the default one in cert-manager. 

For more information on this, we invite you to read our [design document](https://github.com/jetstack/cert-manager/pull/2753).


## kubectl cert-manager tool for signing certificates

cert-manager `v0.15` included a kubectl plugin that allowed to interact with cert-manager.
In this release we leverage this plugin to allow users to sign certificates on their computer
or inside the container itself.

TODO: describe how to do this

The kubectl cert-manager binary can be downloaded from the [GitHub release page](https://github.com/jetstack/cert-manager/releases/)

## `v1beta1` API

We are soon reaching cert-manager v1.0, the new v1beta1 API is our first step towards a stable v1 API.


TODO: list improvements

If you're using Kubernetes 1.15 or higher, conversion webhooks will allow you seamlessly interact with `v1alpha2`, `v1alpha3` and `v1beta1`
API versions at the same time. This allows you to use the new API version without having to modify or redeploy your older resources.
Users of the `legacy` version of cert-manager will still only have the `v1alpha2` API. 

### `kubectl cert-manager convert` tool

To assist you updating your manifest files on disk (for example in your infrastructure Git repo) we offer `v1beta1` support in `kubectl cert-manager`.
The `kubectl cert-manager convert` command will be able to convert your manifest files to v1beta1 using:

TODO: add mini tutorial