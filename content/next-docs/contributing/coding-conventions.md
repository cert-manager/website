---
title: Coding Conventions
description: 'cert-manager contributing guide: Coding conventions'
---

cert-manager, like most Go projects, delegates almost all stylistic choices to `gofmt`,
with `goimports` on top for organizing imports. Broadly speaking, if you set your editor to run
`goimports` when you save a file, your code will be stylistically correct.

cert-manager generally also follows the Kubernetes
[coding conventions](https://www.kubernetes.dev/docs/guide/coding-convention/) and the Google
[Go code review comments](https://github.com/golang/go/wiki/CodeReviewComments).

## Organizing Imports

Imports should be organized into 3 blocks, with each block separated by two newlines:

```go
import (
	"stdlib"

	"external"

	"internal"
)
```

An example might be the following, taken from
[`pkg/acme/accounts/client.go`](https://github.com/cert-manager/cert-manager/blob/0c71fe7795858b96cabcddabf706d997cd2fba3f/pkg/acme/accounts/client.go):

```go
import (
	"crypto/rsa"
	"crypto/tls"
	"net"
	"net/http"
	"time"

	acmeapi "golang.org/x/crypto/acme"

	acmecl "github.com/cert-manager/cert-manager/pkg/acme/client"
	acmeutil "github.com/cert-manager/cert-manager/pkg/acme/util"
	cmacme "github.com/cert-manager/cert-manager/pkg/apis/acme/v1"
	"github.com/cert-manager/cert-manager/pkg/metrics"
	"github.com/cert-manager/cert-manager/pkg/util"
)
```

Once this manual split of standard library, external and internal imports has been made, it will be
enforced automatically by `goimports` when executed in the future.

## UK vs. US spelling

For the sake of consistency, cert-manager uses en-US spelling for the
documentation in https://cert-manager.io as well as within the cert-manager
codebase. A comprehensive list of en-GB → en-US word substitution is available
on Ubuntu's
[`WordSubstitution`](https://wiki.ubuntu.com/EnglishTranslation/WordSubstitution)
page.