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
  cainjector [flags]

Flags:
      --config string                                       Path to a file containing a CAInjectorConfiguration object used to configure the controller
      --enable-apiservices-injectable                       Inject CA data to annotated APIServices. This functionality is not required if cainjector is only used as cert-manager's internal component and setting it to false might reduce memory consumption (default true)
      --enable-certificates-data-source                     Enable configuring cert-manager.io Certificate resources as potential sources for CA data. Requires cert-manager.io Certificate CRD to be installed. This data source can be disabled to reduce memory consumption if you only use cainjector as part of cert-manager's installation (default true)
      --enable-customresourcedefinitions-injectable         Inject CA data to annotated CustomResourceDefinitions. This functionality is not required if cainjecor is only used as cert-manager's internal component and setting it to false might slightly reduce memory consumption (default true)
      --enable-mutatingwebhookconfigurations-injectable     Inject CA data to annotated MutatingWebhookConfigurations. This functionality is required for cainjector to work correctly as cert-manager's internal component (default true)
      --enable-profiling                                    Enable profiling for controller.
      --enable-validatingwebhookconfigurations-injectable   Inject CA data to annotated ValidatingWebhookConfigurations. This functionality is required for cainjector to correctly function as cert-manager's internal component (default true)
      --feature-gates mapStringBool                         A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                                            AllAlpha=true|false (ALPHA - default=false)
                                                            AllBeta=true|false (BETA - default=false)
                                                            ServerSideApply=true|false (ALPHA - default=false)
  -h, --help                                                help for cainjector
      --kubeconfig string                                   Paths to a kubeconfig. Only required if out-of-cluster.
      --leader-elect                                        If true, cainjector will perform leader election between instances to ensure no more than one instance of cainjector operates at a time (default true)
      --leader-election-lease-duration duration             The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 1m0s)
      --leader-election-namespace string                    Namespace used to perform leader election. Only used if leader election is enabled (default "kube-system")
      --leader-election-renew-deadline duration             The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 40s)
      --leader-election-retry-period duration               The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 15s)
      --log-flush-frequency duration                        Maximum number of seconds between log flushes (default 5s)
      --logging-format string                               Sets the log format. Permitted formats: "json" (gated by LoggingBetaOptions), "text". (default "text")
      --namespace string                                    If set, this limits the scope of cainjector to a single namespace. If set, cainjector will not update resources with certificates outside of the configured namespace.
      --profiler-address string                             The host and port that Go profiler should listen on, i.e localhost:6060. Ensure that profiler is not exposed on a public address. Profiler will be served at /debug/pprof. (default "localhost:6060")
  -v, --v Level                                             number for the log level verbosity
      --vmodule pattern=N,...                               comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)
```
