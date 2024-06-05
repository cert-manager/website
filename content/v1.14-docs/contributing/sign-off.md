---
title: DCO Sign Off
description: 'cert-manager contributing: DCO Sign-off'
---

All contributors to the project retain copyright to their work, but must only submit
work which they have the rights to submit.

We require all contributors to acknowledge that they have the rights to the code they're contributing
by signing their commits in git using a "DCO Sign Off". Note that this is different to "commit signing"
using something like PGP or [`gitsign`](https://github.com/sigstore/gitsign)!

Any copyright notices in a cert-manager repo should specify the authors as
"The cert-manager Authors".

To sign your work, pass the `--signoff` option to `git commit` or `git rebase`:

```bash
# Sign off a commit as you're making it
git commit --signoff -m"my commit"

# Add a signoff to the last commit you made
git commit --amend --signoff

# Rebase your branch against master and sign off every commit in your branch
git rebase --signoff master
```

This will add a line similar to the following at the end of your commit:

```text
Signed-off-by: Joe Bloggs <joe@example.com>
```

By signing off a commit you're stating that you certify the following:

```text
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
1 Letterman Drive
Suite D4700
San Francisco, CA, 94129

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.


Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

That statement is taken from [https://developercertificate.org/](https://developercertificate.org/).
