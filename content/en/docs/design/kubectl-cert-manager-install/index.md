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

### `kubectl cert-manager`  is underused.

It has useful features and yet it is not widely known and it is not widely used.
This assumption is based on there being very few questions about it on #cert-manager and very few issues related to it in GitHub issues.
We aim to increase the usage of `kubectl cert-manager` by documenting that new-users should use `kubectl cert-manager install`,
as part of the quick start tutorial.
And we propose a series of related `kubectl cert-manager create ...`  sub-commands
which will make it easy for new-users to configure cert-manager for a series of common use-cases.

### Helm has inadequate support CRDs.

There are various has short comings and gotchas with how Helm manages the installation, upgrading and uninstallation of projects with CRDs.
Helm recommend putting CRD manifests in a separate `crds/` directory in the chart, so that it knows to install those before installing the rest of the chart manifests.
But cert-manager doesn't follow that recommendation because Helm does not then support upgrading those CRDs when they change in subsequent versions of the chart.
Instead cert-manager puts the CRDs definitions along side the other chart resources and
For this reason, users who run `helm install jetstack/cert-manager` are required to make a decision about whether or not to have `helm` also install the cert-manager CRDs.
To have `helm` install the CRDs, the user must use the command line flag `helm install jetstack/cert-manager --set installCRDs=true`,
but this makes the CRDs part of the Helm installation which means that if the user subsequently runs `helm uninstall jetstack/cert-manager`,
then all the CRDs will be deleted and this will trigger the garbage collection of all cert-manager CRs (Certificates, Issuers, etc).

Other users prefer to pre-install the CRDs using `kubectl apply -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.crds.yaml`.
Then they run `helm install jetstack/cert-manager` to install only the cert-manager Deployements and other supporting resources.
But these users then have to remember to use this same two-step method when later upgrading or uninstalling cert-manager.

There are many support requests from users who are confused about which of these two installation methods they should choose.

### Static manifests do not allow customization of the installation

`kubectl apply -f ...` can install both the CRDs and the


We plan to expand the features of `kubectl cert-manager`, starting with `install` which
Why are we tackling this problem?
Why us?
Why now?

Assumptions
-----------
Any assumptions we are making

Stakeholders
------------
Who cares about this feature?

Constraints
-----------
Any constraints on the solution that we know about
* Must
* Nice to have
* Must not
* Out of scope

Definition of Done
------------------
How will we know when we are done?

Success
-------
What does success look like? How will we measure it?
This isn't whether it is complete, but whether it is successful

Risks
-----
Are there any risks you can identify, e.g. external dependencies
