```
├── build 
├── cmd 
│   ├── acmesolver
│   ├── cainjector
│   ├── controller
│   ├── ctl # cert-manager kubectl plugin
│   │   └── pkg # cert-manager kubectl plugin subcommands
│   └── webhook
├── deploy
│   ├── charts
│   │   └── cert-manager
│   ├── crds
│   ├── manifests
├── design
├── devel
│   ├── addon
│   │   ├── certmanager
│   │   ├── ingressnginx
│   │   ├── pebble
│   │   ├── sample-external-issuer
│   │   ├── samplewebhook
│   │   └── vault
│   ├── bin
│   ├── cluster
│   ├── lib
├── docs
├── hack
│   ├── bin
│   ├── boilerplate
│   ├── build
│   ├── filter-crd
├── logo
├── pkg
│   ├── acme
│   │   ├── accounts
│   │   ├── client
│   │   ├── util
│   │   └── webhook
│   │       ├── apis
│   │       ├── apiserver
│   │       ├── cmd
│   │       │   └── server
│   │       ├── registry
│   ├── api
│   │   ├── testing
│   │   └── util
│   ├── apis
│   │   ├── acme
│   │   ├── certmanager
│   │   ├── meta
│   ├── client
│   │   ├── clientset
│   │   │   └── versioned
│   │   │       ├── fake
│   │   │       ├── scheme
│   │   │       └── typed
│   │   │           ├── acme
│   │   │           └── certmanager
│   │   ├── informers
│   │   │   └── externalversions
│   │   │       ├── acme
│   │   │       ├── certmanager
│   │   │       └── internalinterfaces
│   │   └── listers
│   │       ├── acme
│   │       └── certmanager
│   ├── controller 
│   │   ├── acmechallenges # control loop responsible for reconciling Challenge CRs
│   │   ├── acmeorders # control loop responsible for reconciling Order CRs
│   │   ├── cainjector
│   │   ├── certificaterequests # control loops for reconciling CertificateRequests for each Certificate kind (self-signed, acme etc)
│   │   ├── certificates # control loops responsible for reconciling Certificate CRs
│   │   │   ├── issuing # control loop that creates the Kubernetes secret with certificate data
│   │   │   ├── keymanager # control loop that generates private key for a certificate
│   │   │   ├── metrics
│   │   │   ├── readiness # control loop that updates certificate's Ready condition and sets renewal time
│   │   │   ├── requestmanager # control loop that creates CertificateRequests
│   │   │   ├── trigger # control loop that 'triggers' generation of a new certificate and automated renewal
│   │   │   │   ├── policies # policies used to determine status of a controller
│   │   ├── clusterissuers # control loop responsible for reconciling ClusterIssuer CRs
│   │   ├── ingress-shim
│   │   ├── issuers # control loop responsible for reconciling Issuer CRs
│   │   ├── test # functionality for unit-testing controllers (mostly based on k8s.io/client-go/testing)
│   ├── ctl
│   ├── feature
│   ├── internal
│   │   ├── api
│   │   ├── apis
│   │   │   ├── acme
│   │   │   │   ├── fuzzer
│   │   │   │   ├── install
│   │   │   │   ├── validation
│   │   │   ├── certmanager
│   │   │   │   ├── install
│   │   └── vault
│   │       ├── fake
│   ├── issuer
│   │   ├── acme
│   │   │   ├── dns
│   │   │   │   ├── acmedns
│   │   │   │   ├── akamai
│   │   │   │   ├── azuredns
│   │   │   │   ├── clouddns
│   │   │   │   ├── cloudflare
│   │   │   │   ├── digitalocean
│   │   │   │   ├── rfc2136
│   │   │   │   ├── route53
│   │   │   ├── http
│   │   ├── ca
│   │   ├── fake
│   │   ├── selfsigned
│   │   ├── vault
│   │   └── venafi
│   ├── logs
│   ├── metrics
│   ├── scheduler
│   ├── util│
│   └── webhook
│       ├── handlers
│       │   ├── testdata
│       │   │   └── apis
│       └── server
│           ├── tls
│           └── util
├── test
│   ├── acme
│   │   └── dns
│   ├── e2e
│   │   ├── bin
│   │   ├── charts
│   │   │   └── vault
│   │   ├── e2e.go
│   │   ├── e2e_test.go
│   │   ├── framework
│   │   │   ├── addon
│   │   │   │   ├── base
│   │   │   │   ├── chart
│   │   │   │   └── vault
│   │   │   ├── config
│   │   │   ├── helper
│   │   │   ├── log
│   │   │   ├── matcher
│   │   │   ├── util
│   │   ├── suite
│   │   │   │   ├── certificates
│   │   │   │   │   ├── acme
│   │   │   │   │   ├── ca
│   │   │   │   │   ├── external
│   │   │   │   │   ├── selfsigned
│   │   │   │   │   ├── vault
│   │   │   │   │   ├── venafi
│   │   │   │   │   └── venaficloud
│   │   │   │   └── rbac
│   │   │   ├── issuers
│   │   │   │   ├── acme
│   │   │   │   │   ├── certificate
│   │   │   │   │   ├── certificaterequest
│   │   │   │   │   ├── dnsproviders
│   │   │   │   ├── ca
│   │   │   │   ├── selfsigned
│   │   │   │   ├── vault
│   │   │   │   │   ├── certificate
│   │   │   │   │   ├── certificaterequest
│   │   │   │   └── venafi
│   │   │   │       ├── addon
│   │   │   │       └── tpp
│   │   │   └── serving
│   │   └── util
│   ├── fixtures
│   │   ├── kind
│   ├── integration
│   │   ├── certificates
│   │   ├── conversion
│   │   ├── ctl
│   │   │   └── testdata
│   │   ├── framework
│   │   ├── validation
│   │   └── webhook
│   └── unit
├── tools
```
