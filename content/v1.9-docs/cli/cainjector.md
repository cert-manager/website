---
title: cainjector CLI reference
description: "cert-manager cainjector CLI documentation"
---
```

cert-manager CA injector is a Kubernetes addon to automate the injection of CA data into
webhooks and APIServices from cert-manager certificates.

It will ensure that annotated webhooks and API services always have the correct
CA data from the referenced certificates, which can then be used to serve API
servers and webhook servers.

Usage:
  ca-injector [flags]

Flags:
      --add_dir_header                            If true, adds the file directory to the header of the log messages
      --alsologtostderr                           log to standard error as well as files (no effect when -logtostderr=true)
      --enable-profiling                          Enable profiling for cainjector
      --feature-gates mapStringBool               A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                                  AllAlpha=true|false (ALPHA - default=false)
                                                  AllBeta=true|false (BETA - default=false)
  -h, --help                                      help for ca-injector
      --kubeconfig string                         Paths to a kubeconfig. Only required if out-of-cluster.
      --leader-elect                              If true, cainjector will perform leader election between instances to ensure no more than one instance of cainjector operates at a time (default true)
      --leader-election-lease-duration duration   The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 1m0s)
      --leader-election-namespace string          Namespace used to perform leader election. Only used if leader election is enabled (default "kube-system")
      --leader-election-renew-deadline duration   The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 40s)
      --leader-election-retry-period duration     The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 15s)
      --log-flush-frequency duration              Maximum number of seconds between log flushes (default 5s)
      --log_backtrace_at traceLocation            when logging hits line file:N, emit a stack trace (default :0)
      --log_dir string                            If non-empty, write log files in this directory (no effect when -logtostderr=true)
      --log_file string                           If non-empty, use this log file (no effect when -logtostderr=true)
      --log_file_max_size uint                    Defines the maximum size a log file can grow to (no effect when -logtostderr=true). Unit is megabytes. If the value is 0, the maximum file size is unlimited. (default 1800)
      --logtostderr                               log to standard error instead of files (default true)
      --namespace string                          If set, this limits the scope of cainjector to a single namespace. If set, cainjector will not update resources with certificates outside of the configured namespace.
      --one_output                                If true, only write logs to their native severity level (vs also writing to each lower severity level; no effect when -logtostderr=true)
      --profiler-address string                   Address of the Go profiler (pprof) if enabled. This should never be exposed on a public interface. (default "localhost:6060")
      --skip_headers                              If true, avoid header prefixes in the log messages
      --skip_log_headers                          If true, avoid headers when opening log files (no effect when -logtostderr=true)
      --stderrthreshold severity                  logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=false) (default 2)
  -v, --v Level                                   number for the log level verbosity
      --vmodule moduleSpec                        comma-separated list of pattern=N settings for file-filtered logging
```
