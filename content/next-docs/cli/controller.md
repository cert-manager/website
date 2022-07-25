---
title: controller CLI reference
description: "cert-manager controller CLI documentation"
---
```

cert-manager is a Kubernetes addon to automate the management and issuance of
TLS certificates from various issuing sources.

It will ensure certificates are valid and up to date periodically, and attempt
to renew certificates at an appropriate time before expiry.

Usage:
  cert-manager-controller [flags]

Flags:
      --acme-http01-solver-image string                     The docker image to use to solve ACME HTTP01 challenges. You most likely will not need to change this parameter unless you are testing a new feature or developing cert-manager. (default "quay.io/jetstack/cert-manager-acmesolver:canary")
      --acme-http01-solver-nameservers strings              A list of comma separated dns server endpoints used for ACME HTTP01 check requests. This should be a list containing host and port, for example 8.8.8.8:53,8.8.4.4:53
      --acme-http01-solver-resource-limits-cpu string       Defines the resource limits CPU size when spawning new ACME HTTP01 challenge solver pods. (default "100m")
      --acme-http01-solver-resource-limits-memory string    Defines the resource limits Memory size when spawning new ACME HTTP01 challenge solver pods. (default "64Mi")
      --acme-http01-solver-resource-request-cpu string      Defines the resource request CPU size when spawning new ACME HTTP01 challenge solver pods. (default "10m")
      --acme-http01-solver-resource-request-memory string   Defines the resource request Memory size when spawning new ACME HTTP01 challenge solver pods. (default "64Mi")
      --add_dir_header                                      If true, adds the file directory to the header of the log messages
      --alsologtostderr                                     log to standard error as well as files (no effect when -logtostderr=true)
      --auto-certificate-annotations strings                The annotation consumed by the ingress-shim controller to indicate a ingress is requesting a certificate (default [kubernetes.io/tls-acme])
      --cluster-issuer-ambient-credentials                  Whether a cluster-issuer may make use of ambient credentials for issuers. 'Ambient Credentials' are credentials drawn from the environment, metadata services, or local files which are not explicitly configured in the ClusterIssuer API object. When this flag is enabled, the following sources for credentials are also used: AWS - All sources the Go SDK defaults to, notably including any EC2 IAM roles available via instance metadata. (default true)
      --cluster-resource-namespace string                   Namespace to store resources owned by cluster scoped resources such as ClusterIssuer in. This must be specified if ClusterIssuers are enabled. (default "kube-system")
      --controllers strings                                 A list of controllers to enable. '--controllers=*' enables all on-by-default controllers, '--controllers=foo' enables just the controller named 'foo', '--controllers=*,-foo' disables the controller named 'foo'.
                                                            All controllers: issuers, clusterissuers, certificates-metrics, ingress-shim, gateway-shim, orders, challenges, certificaterequests-issuer-acme, certificaterequests-approver, certificaterequests-issuer-ca, certificaterequests-issuer-selfsigned, certificaterequests-issuer-vault, certificaterequests-issuer-venafi, certificates-trigger, certificates-issuing, certificates-key-manager, certificates-request-manager, certificates-readiness, certificates-revision-manager (default [*])
      --copied-annotation-prefixes strings                  Specify which annotations should/shouldn't be copiedfrom Certificate to CertificateRequest and Order, as well as from CertificateSigningRequest to Order, by passing a list of annotation key prefixes.A prefix starting with a dash(-) specifies an annotation that shouldn't be copied. Example: '*,-kubectl.kuberenetes.io/'- all annotationswill be copied apart from the ones where the key is prefixed with 'kubectl.kubernetes.io/'. (default [*,-kubectl.kubernetes.io/,-fluxcd.io/,-argocd.argoproj.io/])
      --default-issuer-group string                         Group of the Issuer to use when the tls is requested but issuer group is not specified on the ingress resource. (default "cert-manager.io")
      --default-issuer-kind string                          Kind of the Issuer to use when the tls is requested but issuer kind is not specified on the ingress resource. (default "Issuer")
      --default-issuer-name string                          Name of the Issuer to use when the tls is requested but issuer name is not specified on the ingress resource.
      --dns01-check-retry-period duration                   The duration the controller should wait between a propagation check. Despite the name, this flag is used to configure the wait period for both DNS01 and HTTP01 challenge propagation checks. For DNS01 challenges the propagation check verifies that a TXT record with the challenge token has been created. For HTTP01 challenges the propagation check verifies that the challenge token is served at the challenge URL.This should be a valid duration string, for example 180s or 1h (default 10s)
      --dns01-recursive-nameservers strings                 A list of comma separated dns server endpoints used for DNS01 check requests. This should be a list containing host and port, for example 8.8.8.8:53,8.8.4.4:53
      --dns01-recursive-nameservers-only                    When true, cert-manager will only ever query the configured DNS resolvers to perform the ACME DNS01 self check. This is useful in DNS constrained environments, where access to authoritative nameservers is restricted. Enabling this option could cause the DNS01 self check to take longer due to caching performed by the recursive nameservers.
      --enable-certificate-owner-ref                        Whether to set the certificate resource as an owner of secret where the tls certificate is stored. When this flag is enabled, the secret will be automatically removed when the certificate resource is deleted.
      --enable-profiling                                    Enable profiling for controller.
      --feature-gates mapStringBool                         A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                                            AdditionalCertificateOutputFormats=true|false (ALPHA - default=false)
                                                            AllAlpha=true|false (ALPHA - default=false)
                                                            AllBeta=true|false (BETA - default=false)
                                                            ExperimentalCertificateSigningRequestControllers=true|false (ALPHA - default=false)
                                                            ExperimentalGatewayAPISupport=true|false (ALPHA - default=false)
                                                            LiteralCertificateSubject=true|false (ALPHA - default=false)
                                                            ServerSideApply=true|false (ALPHA - default=false)
                                                            ValidateCAA=true|false (ALPHA - default=false)
  -h, --help                                                help for cert-manager-controller
      --issuer-ambient-credentials                          Whether an issuer may make use of ambient credentials. 'Ambient Credentials' are credentials drawn from the environment, metadata services, or local files which are not explicitly configured in the Issuer API object. When this flag is enabled, the following sources for credentials are also used: AWS - All sources the Go SDK defaults to, notably including any EC2 IAM roles available via instance metadata.
      --kube-api-burst int                                  the maximum burst queries-per-second of requests sent to the Kubernetes apiserver (default 50)
      --kube-api-qps float32                                indicates the maximum queries-per-second requests to the Kubernetes apiserver (default 20)
      --kubeconfig string                                   Paths to a kubeconfig. Only required if out-of-cluster.
      --leader-elect                                        If true, cert-manager will perform leader election between instances to ensure no more than one instance of cert-manager operates at a time (default true)
      --leader-election-lease-duration duration             The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 1m0s)
      --leader-election-namespace string                    Namespace used to perform leader election. Only used if leader election is enabled (default "kube-system")
      --leader-election-renew-deadline duration             The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 40s)
      --leader-election-retry-period duration               The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 15s)
      --log-flush-frequency duration                        Maximum number of seconds between log flushes (default 5s)
      --log_backtrace_at traceLocation                      when logging hits line file:N, emit a stack trace (default :0)
      --log_dir string                                      If non-empty, write log files in this directory (no effect when -logtostderr=true)
      --log_file string                                     If non-empty, use this log file (no effect when -logtostderr=true)
      --log_file_max_size uint                              Defines the maximum size a log file can grow to (no effect when -logtostderr=true). Unit is megabytes. If the value is 0, the maximum file size is unlimited. (default 1800)
      --logtostderr                                         log to standard error instead of files (default true)
      --master string                                       Optional apiserver host address to connect to. If not specified, autoconfiguration will be attempted.
      --max-concurrent-challenges int                       The maximum number of challenges that can be scheduled as 'processing' at once. (default 60)
      --metrics-listen-address string                       The host and port that the metrics endpoint should listen on. (default "0.0.0.0:9402")
      --namespace string                                    If set, this limits the scope of cert-manager to a single namespace and ClusterIssuers are disabled. If not specified, all namespaces will be watched
      --one_output                                          If true, only write logs to their native severity level (vs also writing to each lower severity level; no effect when -logtostderr=true)
      --profiler-address string                             The host and port that Go profiler should listen on, i.e localhost:6060. Ensure that profiler is not exposed on a public address. Profiler will be served at /debug/pprof. (default "localhost:6060")
      --skip_headers                                        If true, avoid header prefixes in the log messages
      --skip_log_headers                                    If true, avoid headers when opening log files (no effect when -logtostderr=true)
      --stderrthreshold severity                            logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=false) (default 2)
  -v, --v Level                                             number for the log level verbosity
      --vmodule moduleSpec                                  comma-separated list of pattern=N settings for file-filtered logging
```
