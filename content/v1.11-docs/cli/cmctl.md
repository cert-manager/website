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

Use "cmctl [command] --help" for more information about a command.
```
