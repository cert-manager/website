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
  controller [flags]

Flags:
      --acme-http01-solver-image string                      The docker image to use to solve ACME HTTP01 challenges. You most likely will not need to change this parameter unless you are testing a new feature or developing cert-manager. (default "quay.io/jetstack/cert-manager-acmesolver:canary")
      --acme-http01-solver-nameservers strings               A list of comma separated dns server endpoints used for ACME HTTP01 check requests. This should be a list containing host and port, for example 8.8.8.8:53,8.8.4.4:53
      --acme-http01-solver-resource-limits-cpu string        Defines the resource limits CPU size when spawning new ACME HTTP01 challenge solver pods. (default "100m")
      --acme-http01-solver-resource-limits-memory string     Defines the resource limits Memory size when spawning new ACME HTTP01 challenge solver pods. (default "64Mi")
      --acme-http01-solver-resource-request-cpu string       Defines the resource request CPU size when spawning new ACME HTTP01 challenge solver pods. (default "10m")
      --acme-http01-solver-resource-request-memory string    Defines the resource request Memory size when spawning new ACME HTTP01 challenge solver pods. (default "64Mi")
      --acme-http01-solver-run-as-non-root                   Defines the ability to run the http01 solver as root for troubleshooting issues (default true)
      --auto-certificate-annotations strings                 The annotation consumed by the ingress-shim controller to indicate a ingress is requesting a certificate (default [kubernetes.io/tls-acme])
      --cluster-issuer-ambient-credentials                   Whether a cluster-issuer may make use of ambient credentials for issuers. 'Ambient Credentials' are credentials drawn from the environment, metadata services, or local files which are not explicitly configured in the ClusterIssuer API object. When this flag is enabled, the following sources for credentials are also used: AWS - All sources the Go SDK defaults to, notably including any EC2 IAM roles available via instance metadata. (default true)
      --cluster-resource-namespace string                    Namespace to store resources owned by cluster scoped resources such as ClusterIssuer in. This must be specified if ClusterIssuers are enabled. (default "kube-system")
      --concurrent-workers int                               The number of concurrent workers for each controller. (default 5)
      --config string                                        Path to a file containing a ControllerConfiguration object used to configure the controller
      --controllers strings                                  A list of controllers to enable. '--controllers=*' enables all on-by-default controllers, '--controllers=foo' enables just the controller named 'foo', '--controllers=*,-foo' disables the controller named 'foo'.
                                                             All controllers: issuers, clusterissuers, certificates-metrics, ingress-shim, gateway-shim, orders, challenges, certificaterequests-issuer-acme, certificaterequests-approver, certificaterequests-issuer-ca, certificaterequests-issuer-selfsigned, certificaterequests-issuer-vault, certificaterequests-issuer-venafi, certificates-trigger, certificates-issuing, certificates-key-manager, certificates-request-manager, certificates-readiness, certificates-revision-manager (default [*])
      --copied-annotation-prefixes strings                   Specify which annotations should/shouldn't be copiedfrom Certificate to CertificateRequest and Order, as well as from CertificateSigningRequest to Order, by passing a list of annotation key prefixes.A prefix starting with a dash(-) specifies an annotation that shouldn't be copied. Example: '*,-kubectl.kuberenetes.io/'- all annotationswill be copied apart from the ones where the key is prefixed with 'kubectl.kubernetes.io/'. (default [*,-kubectl.kubernetes.io/,-fluxcd.io/,-argocd.argoproj.io/])
      --default-issuer-group string                          Group of the Issuer to use when the tls is requested but issuer group is not specified on the ingress resource. (default "cert-manager.io")
      --default-issuer-kind string                           Kind of the Issuer to use when the tls is requested but issuer kind is not specified on the ingress resource. (default "Issuer")
      --default-issuer-name string                           Name of the Issuer to use when the tls is requested but issuer name is not specified on the ingress resource.
      --dns01-check-retry-period duration                    The duration the controller should wait between a propagation check. Despite the name, this flag is used to configure the wait period for both DNS01 and HTTP01 challenge propagation checks. For DNS01 challenges the propagation check verifies that a TXT record with the challenge token has been created. For HTTP01 challenges the propagation check verifies that the challenge token is served at the challenge URL.This should be a valid duration string, for example 180s or 1h (default 10s)
      --dns01-recursive-nameservers <ip address>:<port>      A list of comma separated dns server endpoints used for DNS01 and DNS-over-HTTPS (DoH) check requests. This should be a list containing entries of the following formats: <ip address>:<port> or `https://<DoH RFC 8484 server address>`. For example: `8.8.8.8:53,8.8.4.4:53` or `https://1.1.1.1/dns-query,https://8.8.8.8/dns-query`. To make sure ALL DNS requests happen through DoH, `dns01-recursive-nameservers-only` should also be set to true.
      --dns01-recursive-nameservers-only                     When true, cert-manager will only ever query the configured DNS resolvers to perform the ACME DNS01 self check. This is useful in DNS constrained environments, where access to authoritative nameservers is restricted. Enabling this option could cause the DNS01 self check to take longer due to caching performed by the recursive nameservers.
      --enable-certificate-owner-ref                         Whether to set the certificate resource as an owner of secret where the tls certificate is stored. When this flag is enabled, the secret will be automatically removed when the certificate resource is deleted.
      --enable-gateway-api                                   Whether gateway API integration is enabled within cert-manager. The ExperimentalGatewayAPISupport feature gate must also be enabled (default as of 1.15).
      --enable-profiling                                     Enable profiling for controller.
      --feature-gates mapStringBool                          A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                                             AdditionalCertificateOutputFormats=true|false (BETA - default=true)
                                                             AllAlpha=true|false (ALPHA - default=false)
                                                             AllBeta=true|false (BETA - default=false)
                                                             ExperimentalCertificateSigningRequestControllers=true|false (ALPHA - default=false)
                                                             ExperimentalGatewayAPISupport=true|false (BETA - default=true)
                                                             LiteralCertificateSubject=true|false (BETA - default=true)
                                                             NameConstraints=true|false (ALPHA - default=false)
                                                             OtherNames=true|false (ALPHA - default=false)
                                                             SecretsFilteredCaching=true|false (BETA - default=true)
                                                             ServerSideApply=true|false (ALPHA - default=false)
                                                             StableCertificateRequestName=true|false (BETA - default=true)
                                                             UseCertificateRequestBasicConstraints=true|false (ALPHA - default=false)
                                                             ValidateCAA=true|false (ALPHA - default=false)
  -h, --help                                                 help for controller
      --issuer-ambient-credentials                           Whether an issuer may make use of ambient credentials. 'Ambient Credentials' are credentials drawn from the environment, metadata services, or local files which are not explicitly configured in the Issuer API object. When this flag is enabled, the following sources for credentials are also used: AWS - All sources the Go SDK defaults to, notably including any EC2 IAM roles available via instance metadata.
      --kube-api-burst int                                   the maximum burst queries-per-second of requests sent to the Kubernetes apiserver (default 50)
      --kube-api-qps float32                                 indicates the maximum queries-per-second requests to the Kubernetes apiserver (default 20)
      --kubeconfig string                                    Paths to a kubeconfig. Only required if out-of-cluster.
      --leader-elect                                         If true, cert-manager will perform leader election between instances to ensure no more than one instance of cert-manager operates at a time (default true)
      --leader-election-lease-duration duration              The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 1m0s)
      --leader-election-namespace string                     Namespace used to perform leader election. Only used if leader election is enabled (default "kube-system")
      --leader-election-renew-deadline duration              The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 40s)
      --leader-election-retry-period duration                The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 15s)
      --log-flush-frequency duration                         Maximum number of seconds between log flushes (default 5s)
      --logging-format string                                Sets the log format. Permitted formats: "json" (gated by LoggingBetaOptions), "text". (default "text")
      --master string                                        Optional apiserver host address to connect to. If not specified, autoconfiguration will be attempted.
      --max-concurrent-challenges int                        The maximum number of challenges that can be scheduled as 'processing' at once. (default 60)
      --metrics-dynamic-serving-ca-secret-name string        name of the secret used to store the CA that signs serving certificates
      --metrics-dynamic-serving-ca-secret-namespace string   namespace of the secret used to store the CA that signs serving certificates
      --metrics-dynamic-serving-dns-names strings            DNS names that should be present on certificates generated by the dynamic serving CA
      --metrics-dynamic-serving-leaf-duration duration       leaf duration of serving certificates (default 168h0m0s)
      --metrics-listen-address string                        The host and port that the metrics endpoint should listen on. (default "0.0.0.0:9402")
      --metrics-tls-cert-file string                         path to the file containing the TLS certificate to serve with
      --metrics-tls-cipher-suites strings                    Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.  Possible values: TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA
      --metrics-tls-min-version string                       Minimum TLS version supported. If omitted, the default Go minimum version will be used. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13
      --metrics-tls-private-key-file string                  path to the file containing the TLS private key to serve with
      --namespace string                                     If set, this limits the scope of cert-manager to a single namespace and ClusterIssuers are disabled. If not specified, all namespaces will be watched
      --profiler-address string                              The host and port that Go profiler should listen on, i.e localhost:6060. Ensure that profiler is not exposed on a public address. Profiler will be served at /debug/pprof. (default "localhost:6060")
  -v, --v Level                                              number for the log level verbosity
      --vmodule pattern=N,...                                comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)
```
