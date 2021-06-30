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

We plan to expand the features of `kubectl cert-manager`, starting with `install`.

### `helm install jetstack/cert-manager` has confusing CRD installation options

Users who run `helm install jetstack/cert-manager` are required to make a decision about whether or not `helm` should install the cert-manager CRDs.
The documentation recommends users to pre-install the CRDs using
`kubectl apply -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.crds.yaml`.
Then run `helm install jetstack/cert-manager` to the cert-manager Deployements and other supporting resources.

The documentation offers users another choice.
To have `helm` install the CRDs, they must use the command line flag `helm install jetstack/cert-manager --set installCRDs=true`.

`kubectl cert-manager install` will allow users to install cert-manager without having to make this choice.


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
