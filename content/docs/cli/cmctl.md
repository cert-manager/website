---
title: cmctl CLI reference
description: "cert-manager cmctl CLI documentation"
---
```

cmctl is a CLI tool manage and configure cert-manager resources for Kubernetes

Usage: cmctl [command]

Available Commands:
  approve      Approve a CertificateRequest
  check        Check cert-manager components
  convert      Convert cert-manager config files between different API versions
  create       Create cert-manager resources
  deny         Deny a CertificateRequest
  experimental Interact with experimental features
  help         Help about any command
  inspect      Get details on certificate related resources
  renew        Mark a Certificate for manual renewal
  status       Get details on current status of cert-manager resources
  upgrade      Tools that assist in upgrading cert-manager
  version      Print the cert-manager CLI version and the deployed cert-manager version

Flags:
  -h, --help                           help for cmctl
      --log-flush-frequency duration   Maximum number of seconds between log flushes (default 5s)
      --logging-format string          Sets the log format. Permitted formats: "json" (gated by LoggingBetaOptions), "text". (default "text")
  -v, --v Level                        number for the log level verbosity, 0 for Error, 1 for Warn, 2 for Info, 3 for Extended Info, 4 for Debug, 5 for Trace, default is 2
      --vmodule pattern=N,...          comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)

Use "cmctl [command] --help" for more information about a command.
```
