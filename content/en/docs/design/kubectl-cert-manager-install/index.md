# kubectl cert-manager install

Author: Tim Ramelot (@inteon), Richard Wall (@wallrj)
Date started: 21 June 2021
Signed off by:
  * TODO

Summary
-------
A mechanism for installing the latest stable version of cert-manager from the `kubectl cert-manager` CLI.

Background
----------
Currently, there are two main methods for installing cert-manager.
Users can install cert-manager using `helm install jetstack/cert-manager`,
or they can install it using `kubectl apply -f  https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.yaml`.

We propose a third mechanism which will allow users to bootstrap cert-manager by first installing the cert-manager CLI.
This will be documented as the preferred installation mechanism.

Rationale
---------

### It's not Helm

It's an emotional and anecdotal reason, but there seem to be a significant number of users who prefer not to use `helm`.
This may be a legacy of the complexity and security problems associated with the Helm 2 and its `tiller` component,
but nevertheless, we have spoken to at least three colleagues who would not use Helm in their deployment process.
Those same users point to `linkerd install` and `istioctl install`
as examples of project specific tools which allow them to customize the installation of those projects without using Helm.

NOTE: The funny thing is that both of those installers are using Helm under the hood, via the Helm SDK.

### Paves the way for a suite of tools to help with installation, upgrade and uninstall

`kubectl cert-manager install` forms part of a larger planned toolset.
In cert-manager v1.6 we anticipate a `kubectl cert-manager upgrade` command
which will convert "stored" version of resources for compatibility with the removal of old API versions in `v1.6`.
We argue that it would be unbalanced to have an upgrade command without a corresponding install command.

### Reduces the user tool surface

If you reduce the user-tool surface, the tool is easier to use and less prone to deprecation issues.
For example tutorials don't have to be updated in case the chart location would change from jetstack to cert-manager.io.


### Increases the uptake of `kubectl cert-manager`

It has useful features and yet it is not widely known and it is not widely used.
This assumption is based on there being very few questions about it on #cert-manager and very few issues related to it in GitHub issues.
We aim to increase the usage of `kubectl cert-manager` by documenting that new-users should use `kubectl cert-manager install`,
as part of the quick start tutorial.
And we propose a series of related `kubectl cert-manager create ...`  sub-commands
which will make it easy for new-users to configure cert-manager for a series of common use-cases.

We plan to expand the features of `kubectl cert-manager`, starting with `install`.

### Offers an alternative to confusing CRD installation options of `helm install jetstack/cert-manager`

Users who run `helm install jetstack/cert-manager` are required to make a decision about whether or not `helm` should install the cert-manager CRDs.
The documentation recommends users to pre-install the CRDs using
`kubectl apply -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.crds.yaml`.
Then run `helm install jetstack/cert-manager` to the cert-manager Deployements and other supporting resources.

The documentation offers users another choice.
To have `helm` install the CRDs, they must use the command line flag `helm install jetstack/cert-manager --set installCRDs=true`.

`kubectl cert-manager install` will allow users to install cert-manager without having to make this choice.

### Simplifies CI environments

There are many thousands of CI pipelines that deploy cert-manager.
For example to support the installation of certificates for webhooks in Kubebuilder and operator-sdk project E2E tests.
Many of these users face the problem of waiting for the cert-manager CRDs and supporting webhooks to be ready
before applying cert-manager Issuer and Certificate resources.

Typically these pipelines will use `kubectl apply -f https://....cert-manager/releases/.../cert-manager.yaml`
and then do `kubectl apply --dry-run=server -f cert-manager-test-resources.yaml` until the API server accepts them.

Instead, these pipelines can now use `kubectl cert-manager install` which will perform its own API checks
and will not return until the cert-manager APIs are ready.

And in future, these CI environments will have access to other useful sub-commands such as  `kubectl cert-manager cluster-info`,
which will dump cert-manager diagnostic information as artifacts, should the CI pipeline fail.

Assumptions
-----------
TODO: Any assumptions we are making

Stakeholders
------------
TODO: Who cares about this feature?

Constraints
-----------
TODO: Any constraints on the solution that we know about
* Must
* Nice to have
* Must not
* Out of scope

Definition of Done
------------------

* Documentation
* E2E tests
* GitHub Issues for all TODOs and ideas for future improvements
* Demo

Success
-------

### Fewer "install" related issues

After its release, we will direct users to install cert-manager using `kubectl cert-manager install`,
and there should be fewer GitHub issues and fewer threads in #cert-manager from confused first-time users.

Risks
-----

If we decide to embed the Helm SDK, it will increase the size of the `kubectl cert-manager` binary.

If we decide to embed the Helm SDK, it will further increase the complexity of cert-manager's `go.mod` dependencies,
and make it difficult to upgrade our dependencies in future.

If `kubectl cert-manager install` offers too many options,
it will be more likely that users come to us for support when their chosen options turn out to be incompatible.

Currently when users of `helm install jetstack/cert-manager` encounter installation problems,
the burden of support is split between the cert-manager and the Helm projects,
depending on the root cause.
With `kubectl cert-manager install` all support requests will come to the cert-manager maintainers,
even if the install tool is implemented as a wrapper around Helm.
