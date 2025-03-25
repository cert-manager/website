---
title: startupapicheck CLI reference
description: "cert-manager startupapicheck CLI documentation"
---
```
Check that cert-manager started successfully

Usage:
  startupapicheck [command]

Available Commands:
  check       Check cert-manager components
  completion  Generate the autocompletion script for the specified shell
  help        Help about any command

Flags:
  -h, --help                           help for startupapicheck
      --log-flush-frequency duration   Maximum number of seconds between log flushes (default 5s)
      --logging-format string          Sets the log format. Permitted formats: "json" (gated by LoggingBetaOptions), "text". (default "text")
      -v, --v Level                    number for the log level verbosity, 0 for Error, 1 for Warn, 2 for Info, 3 for Extended Info, 4 for Debug, 5 for Trace, default is 2
      --vmodule pattern=N,...          comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)

Use "startupapicheck [command] --help" for more information about a command.
```
