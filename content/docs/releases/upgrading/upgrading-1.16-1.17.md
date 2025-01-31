---
title: Upgrading from v1.16 to v1.17
description: 'cert-manager installation: Upgrading v1.16 to v1.17'
---

Before upgrading cert-manager from 1.16 to 1.17 please read the following important notes about breaking changes in 1.17:

1. RSA certificates with keys of length 3072 or 4096 will now use SHA-384 or SHA-512 respectively as hash algorithms. These hash algorithms are widely supported and we don't expect this should be an issue, but it's worth bearing this in mind if you start to see errors as your larger RSA keys rotate.

2. Log messages across cert-manager have been augmented with better contextual structured data. If you were matching on literal strings in log lines, it's possible that may break.

3. The `ValidateCAA` feature gate has been deprecated and will be removed in cert-manager v1.18. If you're manually enabling this feature gate, it's advisable to stop.

## Next Steps

From here on you can follow the [regular upgrade process](../../installation/upgrade.md).
