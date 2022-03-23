---
title: Importing cert-manager in Go
description: 'cert-manager contributing guide: Importing cert-manager'
---

cert-manager is written in Go, and uses Go modules. You _can_ import it as a Go module, and in some cases
that's fine or even encouraged, but as a rule we generally recommend against importing cert-manager.

Generally speaking, except for the cases listed below under [When You Might Import cert-manager](#when-you-might-import-cert-manager),
code in the cert-manager repository is *not* covered under any Go module compatibility guarantee. We can and will make breaking
changes, even in publicly exported Go code and even in a minor or patch release of cert-manager. We have made breaking changes like
this in the past.

Note that this doesn't affect _running_ cert-manager. Our commitment on compatibility is to not break the runtime
functionality of cert-manager, and we take that seriously.

If you're certain that you *do* need to import cert-manager as a module, see [Module Import Paths](#module-import-paths)
below for a note on how to do that.

## When You Might Import cert-manager

You might need to import cert-manager if you're writing Go code which:

- uses cert-manager custom resources, so you want to import something under `pkg/apis`
- implements an external DNS solver webhook, as in the [webhook-example](https://github.com/cert-manager/webhook-example)
- implements an external issuer, as in the [sample-external-issuer](https://github.com/cert-manager/sample-external-issuer)

If you think you really need to import other parts of the code, please do reach out and [talk to us](./README.md#slack) so we're
aware of this need! We'll always try to avoid breakage where we can.

## Module Import Paths

The original cert-manager repository was created on GitHub as `https://github.com/jetstack/cert-manager`, and was later
migrated to `https://github.com/cert-manager/cert-manager`.

This means the Go module import path you need depends on the version of cert-manager you're trying to use.

For cert-manager 1.8 and later, use the new path:   
`github.com/cert-manager/cert-manager`


For cert-manager 1.7 and earlier, including all point releases, use the old path:   
`github.com/jetstack/cert-manager`