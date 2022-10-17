---
title: Upgrading from v1.2 to v1.3
description: 'cert-manager installation: Upgrading v1.2 to v1.3'
---

## Upgrade notes for users of the Venafi Cloud Issuer

This release updates the [Venafi Cloud Issuer][] to use `OutagePREDICT` instead of `DevOpsACCELERATE`.

The only impact to Venafi Cloud users is the change in zone syntax.
The zone is now `<Application Name>\<Issuing Template Alias>`
(e.g. `My Application\My CIT`).

### Background

Venafi are currently transitioning Venafi Cloud users to the `OutagePREDICT` ("OP") product,
from `DevOpsACCELERATE` ("DA"), which will be sunset later in 2021.

The [Venafi Cloud Issuer][] in cert-manager relies upon the `VCert` library,
and the [`VCert` `v4.13.0`][] release marks this "DA2OP" transition.
The `VCert` module dependencies in cert-manager have been updated in order for cert-manager to complete the transition as well.

With this update, cert-manager users with Venafi Cloud issuers will need to be aware that the zone format changes from a UUID (DA Zone ID) to a string of the form `<Application Name>\<Issuing Template Alias>`.
This means users will need to create an Application in `OutagePREDICT` and associate an _Issuing Template_ with it
(the same _Issuing Templates_ assigned to DA Projects Zones can be used since _Issuing Templates_ are shared between Venafi Cloud products).

[Venafi Cloud Issuer]: https://cert-manager.io/docs/configuration/venafi/
[`VCert` `v4.13.0`]: https://github.com/Venafi/vcert/releases/tag/v4.13.0

## Next Steps

You should now follow the [regular upgrade process](./README.md).