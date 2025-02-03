---
title: Managing public trust in kubernetes with trust-manager
description: Learn how to deploy and configure trust-manager to automatically distribute your approved Public CA configuration to your Kubernetes cluster.
---

*Last Verified: 19 June 2023*

In this tutorial we will walk through how we can use 
[trust-manager](https://cert-manager.io/docs/trust/trust-manager/) to
distribute publicly trusted Certificate Authority (CA) certificates inside
a Kubernetes cluster. Once distributed we will also show:

- How you can automatically reload applications when your trust bundle changes
- How you can enforce applications to use your distributed CA bundle

From there we will use a simple `curl` pod to show how to automatically mount
the trusted CA `Bundle`, so it can be used without having to configure curl
manually. This mimics how an application would not need any additional
configuration to make use of your trusted CA certificates bundle.

In this tutorial we will be limiting the scope of our changes to only impact
the `team-a` namespace. To get the most out of these features you will want 
to remove this limitation.

> **Note:** All resources provided are demonstrative and should be reviewed 
  properly before using in production environments.

## Prerequisites

**💻 Software**

1. [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl): The Kubernetes
command-line tool which allows you to configure Kubernetes clusters.
1. [helm](https://helm.sh/): A package manager for Kubernetes.
1. [yq](https://github.com/mikefarah/yq#install): A command line tool for
parsing YAML with helpful coloring.

## Distribute Public CA Trust

Let us first setup trust-manager and have our public CAs distributed to our
demo namespace: `team-a`.

### Setup Application & Bundle

1) Install trust-manager following the 
  [instructions here](../../trust/trust-manager/README.md#installation).

1) Create your first `Bundle` resource including only Public CA certificates

    ```yaml file=./trust/bundle-public.yaml
    ```

    ```shell
    kubectl apply -f - <<EOF
    apiVersion: trust.cert-manager.io/v1alpha1
    kind: Bundle
    metadata:
      name: public-bundle
    spec:
      sources:
      - useDefaultCAs: true
      target:
        configMap:
          key: "ca-certificates.crt"
        namespaceSelector:
          matchLabels:
            trust: enabled
    EOF
    ```

1) Let's create a namespace where our application will run:

    ```shell
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: Namespace
    metadata:
      labels:
        trust: enabled
      name: team-a
    EOF
    ```

    Note that this namespace is labelled with `trust: enabled` which matches the
    `namespaceSelector` criteria in the `Bundle` resource:

    ```yaml
      namespaceSelector:
        matchLabels:
          trust: enabled
    ```

    > **Note**: this is to limit the scope of our trust bundle to only the
    `team-a` namespace as mentioned previously.

1) Verify that the trust-manager controller has correctly propagated the
  CA bundle to the namespace:

    ```shell
    kubectl get configmap -n team-a public-bundle -o yaml
    ```

    Note that this output should be quite long. This is because the default
    public bundle that we use has a lot of public CAs in it.

### Mount Trust Bundle to Application with Automatic Use

To use our trusted CAs we will mount them to the application in a default 
location that most applications expect to find a `ca-certificates.crt` file.
The benefit to this approach is that most application code inside the container
will use this file by default and not require any additional configuration. There is the added benefit that you will be mounting over the top of 
`/etc/ssl/certs` which will remove existing CA certificates, usually
present from a container base image or pulled in during CI builds.

> **WARNING:** We have chosen one well known location in this example which
  is used by alpine and `curl` for sourcing trusted CAs. This is not the only
  location that can be used, so a container may have other default locations.
  If you want to see where default CAs are located you can use
  [paranoia](https://github.com/jetstack/paranoia) to inspect a built container
  image.

1) Apply the application deployment:

    ```yaml file=./trust/deploy-auto.yaml
    ```

    ```shell
    kubectl apply -f - <<EOF
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      labels:
        app: sleep-auto
      name: sleep-auto
      namespace: team-a
    spec:
      replicas: 1
      revisionHistoryLimit: 3
      selector:
        matchLabels:
          app: sleep-auto
      template:
        metadata:
          labels:
            app: sleep-auto
        spec:
          containers:
          - command:
            - /bin/sh
            - -c
            - sleep 1d
            image: quay.io/zenlab/curl:latest
            name: curl
            volumeMounts:
              - mountPath: /etc/ssl/certs/
                name: ca-certificate-only
                readOnly: true
          volumes:
            - name: ca-certificate-only
              configMap:
                name: public-bundle
                defaultMode: 0644
                optional: false
                items:
                - key: ca-certificates.crt
                  path: ca-certificates.crt
    EOF
    ```

1) Create a shell inside the running pod:

    ```shell
    kubectl exec -n team-a -ti $(kubectl get po -n team-a -l app=sleep-auto -o jsonpath='{.items[0].metadata.name}') -- /bin/sh
    ```

1) List the contents of `/etc/ssl/certs/` to validate that only your
trusted `ca-certificates.crt` is present.

    ```shell
    ls -ltr /etc/ssl/certs/
    ```

    Output should look similar to:

    ```
    ~ $ ls -ltr /etc/ssl/certs/
    total 0
    lrwxrwxrwx    1 root     root            26 Apr 14 15:12 ca-certificates.crt -> ..data/ca-certificates.crt
    ```

    Note that normally the output would look something
    like the following, when there is no volume overriding this directory:

    ```
    ~ $ ls -ltr /etc/ssl/certs/
    total 608
    -rw-r--r--    1 root     root        214222 Apr 14 01:11 ca-certificates.crt
    lrwxrwxrwx    1 root     root            52 Apr 14 01:11 ca-cert-vTrus_Root_CA.pem -> /usr/share/ca-certificates/mozilla/vTrus_Root_CA.crt
    lrwxrwxrwx    1 root     root            56 Apr 14 01:11 ca-cert-vTrus_ECC_Root_CA.pem -> /usr/share/ca-certificates/mozilla/vTrus_ECC_Root_CA.crt
    ...
    lrwxrwxrwx    1 root     root            53 Apr 14 01:11 02265526.0 -> ca-cert-Entrust_Root_Certification_Authority_-_G2.pem
    lrwxrwxrwx    1 root     root            31 Apr 14 01:11 002c0b4f.0 -> ca-cert-GlobalSign_Root_R46.pem
    ```

1) Make a HTTPS call out to a well known site to validate `curl` works without
having to pass the additional `--cacert` flag:

    ```shell
    curl -v https://bbc.co.uk/news
    ```

    Success will result in a valid TLS connection such as:

    ```
    *   Trying 151.101.0.81:443...
    * Connected to bbc.co.uk (151.101.0.81) port 443 (#0)
    * ALPN: offers h2,http/1.1
    * TLSv1.3 (OUT), TLS handshake, Client hello (1):
    *  CAfile: /etc/ssl/certs/ca-certificates.crt
    *  CApath: none
    * TLSv1.3 (IN), TLS handshake, Server hello (2):
    * TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
    * TLSv1.3 (IN), TLS handshake, Certificate (11):
    * TLSv1.3 (IN), TLS handshake, CERT verify (15):
    * TLSv1.3 (IN), TLS handshake, Finished (20):
    * TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
    * TLSv1.3 (OUT), TLS handshake, Finished (20):
    * SSL connection using TLSv1.3 / TLS_AES_128_GCM_SHA256
    * ALPN: server accepted h2
    * Server certificate:
    *  subject: C=GB; ST=London; L=London; O=BRITISH BROADCASTING CORPORATION; CN=www.bbc.com
    *  start date: Mar 14 06:16:13 2023 GMT
    *  expire date: Apr 14 06:16:12 2024 GMT
    *  subjectAltName: host "bbc.co.uk" matched cert's "bbc.co.uk"
    *  issuer: C=BE; O=GlobalSign nv-sa; CN=GlobalSign RSA OV SSL CA 2018
    *  SSL certificate verify ok.
    ```

1. Exit the container: `exit`

## Configure Real Applications

Based on the example above, Kubernetes is able to mount over the top of the
default CA certificate bundle. You can use this with applications assuming you
know the default locations from where they retrieve CA certificates.

For example with `Go` your application is configurable with either
`SSL_CERT_FILE` or `SSL_CERT_DIR` to point to the default CA certificate
file location.

See more details [here](https://go.dev/src/crypto/x509/root_unix.go) and
for the default locations on various OS bases, check
[here](https://go.dev/src/crypto/x509/root_linux.go)

```go
// Possible certificate files; stop after finding one.
var certFiles = []string{
	"/etc/ssl/certs/ca-certificates.crt",                // Debian/Ubuntu/Gentoo etc.
	"/etc/pki/tls/certs/ca-bundle.crt",                  // Fedora/RHEL 6
	"/etc/ssl/ca-bundle.pem",                            // OpenSUSE
	"/etc/pki/tls/cacert.pem",                           // OpenELEC
	"/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem", // CentOS/RHEL 7
	"/etc/ssl/cert.pem",                                 // Alpine Linux
}

// Possible directories with certificate files; all will be read.
var certDirectories = []string{
	"/etc/ssl/certs",               // SLES10/SLES11, https://golang.org/issue/12139
	"/etc/pki/tls/certs",           // Fedora/RHEL
	"/
```

Having checked Python the `ssl` library uses the same two environment variables
for finding the trusted CAs: `SSL_CERT_DIR` and / or `SSL_CERT_FILE`. You can
verify this [in documentation](https://docs.python.org/3/library/ssl.html#ssl.get_default_verify_paths)
and from a `python3` runtime:

```python3
>>> import ssl
>>> ssl.get_default_verify_paths()
DefaultVerifyPaths(cafile=None, capath='/usr/lib/ssl/certs', openssl_cafile_env='SSL_CERT_FILE', openssl_cafile='/usr/lib/ssl/cert.pem', openssl_capath_env='SSL_CERT_DIR', openssl_capath='/usr/lib/ssl/certs')
```

This should mean that any CAs mounted in a file and any of the following files
will be trusted by any python application runtime, similar to `Go`:

- '/usr/lib/ssl/cert.pem'
- '/usr/lib/ssl/certs/*'

Similar could be achieved with other languages.

## Automate and Enforce

So now we have mounted trust-manager's bundle manually, you might be thinking:

- What happens if the CA Bundle is changed, how do I get that change to my
  application?
- How do I ensure that my CA Bundle is mounted to all applications in my
  cluster without having to request changes from my tenants?

Let's tackle both of these scenarios using additional Open Source tools.

### Rollout CA Bundle Changes

If your CA bundle changes, those changes will be synced to the namespaces
pretty quickly. This change will be reflected in the volume attached to the
container, but most applications will not pickup on the file system change.
The common approach is restarting the client application deployment, through
the use of `kubectl rollout restart deployment <DEPLOY_NAME>`. There is an
option to automate this process through a third party piece of open-source
software.

Using [Stakater Reloader](https://github.com/stakater/Reloader) it is
possible to reload or rollout a deployment whenever a `ConfigMap` or `Secret`
changes. So whenever the `Bundle`'s target is synced, the Reloader component
can pick up this change and rollout applications mounting those resource
as volumes or environment variables.

**Please note** that there are many alternative pieces of software that you
could bundle or write into your application container. They would simply watch
the file system for changes and trigger a reload of the application process.
Such an approach requires container image or code changes and this could be
difficult to implement with many tenants. The advantage to using reloader here
is that it's a generic solution, applicable to all applications running in a
cluster.

1. Continuing with the reloader, it can be installed with helm:

    ```shell
    helm repo add stakater https://stakater.github.io/stakater-charts
    helm repo update
    helm install reloader stakater/reloader -n stakater-reloader --create-namespace --set fullnameOverride=reloader
    ```

1. We can reuse the deployment `sleep-auto` from the previous section and 
  configured it to enabled the reload functionality:

    ```shell
    kubectl annotate deployment -n team-a sleep-auto reloader.stakater.com/auto="true"
    ```

    **Please note** there are several configuration options to configure 
    the reloader tooling and this is only the most basic example. Refer to
    [the documentation](https://github.com/stakater/Reloader#how-to-use-reloader)
    for more detailed examples.

1. In another terminal watch the application rollout:

    ```shell
    kubectl get po -n team-a -w
    ```

1. To test this change we can edit our `Bundle` resource to remove all the
  default Public CA certificates and only provide one CA certificate instead:

    ```yaml file=./trust/bundle-one-ca.yaml
    ```

    ```shell
    kubectl apply -f - <<EOF
    apiVersion: trust.cert-manager.io/v1alpha1
    kind: Bundle
    metadata:
      name: public-bundle
    spec:
      sources:
      - inLine: |
          -----BEGIN CERTIFICATE-----
          MIIETjCCAzagAwIBAgINAe5fFp3/lzUrZGXWajANBgkqhkiG9w0BAQsFADBXMQsw
          CQYDVQQGEwJCRTEZMBcGA1UEChMQR2xvYmFsU2lnbiBudi1zYTEQMA4GA1UECxMH
          Um9vdCBDQTEbMBkGA1UEAxMSR2xvYmFsU2lnbiBSb290IENBMB4XDTE4MDkxOTAw
          MDAwMFoXDTI4MDEyODEyMDAwMFowTDEgMB4GA1UECxMXR2xvYmFsU2lnbiBSb290
          IENBIC0gUjMxEzARBgNVBAoTCkdsb2JhbFNpZ24xEzARBgNVBAMTCkdsb2JhbFNp
          Z24wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDMJXaQeQZ4Ihb1wIO2
          hMoonv0FdhHFrYhy/EYCQ8eyip0EXyTLLkvhYIJG4VKrDIFHcGzdZNHr9SyjD4I9
          DCuul9e2FIYQebs7E4B3jAjhSdJqYi8fXvqWaN+JJ5U4nwbXPsnLJlkNc96wyOkm
          DoMVxu9bi9IEYMpJpij2aTv2y8gokeWdimFXN6x0FNx04Druci8unPvQu7/1PQDh
          BjPogiuuU6Y6FnOM3UEOIDrAtKeh6bJPkC4yYOlXy7kEkmho5TgmYHWyn3f/kRTv
          riBJ/K1AFUjRAjFhGV64l++td7dkmnq/X8ET75ti+w1s4FRpFqkD2m7pg5NxdsZp
          hYIXAgMBAAGjggEiMIIBHjAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB
          /zAdBgNVHQ4EFgQUj/BLf6guRSSuTVD6Y5qL3uLdG7wwHwYDVR0jBBgwFoAUYHtm
          GkUNl8qJUC99BM00qP/8/UswPQYIKwYBBQUHAQEEMTAvMC0GCCsGAQUFBzABhiFo
          dHRwOi8vb2NzcC5nbG9iYWxzaWduLmNvbS9yb290cjEwMwYDVR0fBCwwKjAooCag
          JIYiaHR0cDovL2NybC5nbG9iYWxzaWduLmNvbS9yb290LmNybDBHBgNVHSAEQDA+
          MDwGBFUdIAAwNDAyBggrBgEFBQcCARYmaHR0cHM6Ly93d3cuZ2xvYmFsc2lnbi5j
          b20vcmVwb3NpdG9yeS8wDQYJKoZIhvcNAQELBQADggEBACNw6c/ivvVZrpRCb8RD
          M6rNPzq5ZBfyYgZLSPFAiAYXof6r0V88xjPy847dHx0+zBpgmYILrMf8fpqHKqV9
          D6ZX7qw7aoXW3r1AY/itpsiIsBL89kHfDwmXHjjqU5++BfQ+6tOfUBJ2vgmLwgtI
          fR4uUfaNU9OrH0Abio7tfftPeVZwXwzTjhuzp3ANNyuXlava4BJrHEDOxcd+7cJi
          WOx37XMiwor1hkOIreoTbv3Y/kIvuX1erRjvlJDKPSerJpSZdcfL03v3ykzTr1Eh
          kluEfSufFT90y1HonoMOFm8b50bOI7355KKL0jlrqnkckSziYSQtjipIcJDEHsXo
          4HA=
          -----END CERTIFICATE-----
      target:
        configMap:
          key: "ca-certificates.crt"
        namespaceSelector:
          matchLabels:
            trust: enabled
    EOF
    ```

    You should see immediately that the application deployment is rolled out in
    your other terminal. 
    
1. Once the new pod is running, use the following to confirm that you have only
  one CA certificate `ca-certificates.crt` file, the one we have just applied:

    ```shell
    kubectl exec -ti -n team-a $(kubectl get po -n team-a -l app=sleep-auto -o jsonpath='{.items[0].metadata.name}') -- cat /etc/ssl/certs/ca-certificates.crt
    ```

    You should get exactly this output:

    ```shell
    -----BEGIN CERTIFICATE-----
    MIIETjCCAzagAwIBAgINAe5fFp3/lzUrZGXWajANBgkqhkiG9w0BAQsFADBXMQsw
    CQYDVQQGEwJCRTEZMBcGA1UEChMQR2xvYmFsU2lnbiBudi1zYTEQMA4GA1UECxMH
    Um9vdCBDQTEbMBkGA1UEAxMSR2xvYmFsU2lnbiBSb290IENBMB4XDTE4MDkxOTAw
    MDAwMFoXDTI4MDEyODEyMDAwMFowTDEgMB4GA1UECxMXR2xvYmFsU2lnbiBSb290
    IENBIC0gUjMxEzARBgNVBAoTCkdsb2JhbFNpZ24xEzARBgNVBAMTCkdsb2JhbFNp
    Z24wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDMJXaQeQZ4Ihb1wIO2
    hMoonv0FdhHFrYhy/EYCQ8eyip0EXyTLLkvhYIJG4VKrDIFHcGzdZNHr9SyjD4I9
    DCuul9e2FIYQebs7E4B3jAjhSdJqYi8fXvqWaN+JJ5U4nwbXPsnLJlkNc96wyOkm
    DoMVxu9bi9IEYMpJpij2aTv2y8gokeWdimFXN6x0FNx04Druci8unPvQu7/1PQDh
    BjPogiuuU6Y6FnOM3UEOIDrAtKeh6bJPkC4yYOlXy7kEkmho5TgmYHWyn3f/kRTv
    riBJ/K1AFUjRAjFhGV64l++td7dkmnq/X8ET75ti+w1s4FRpFqkD2m7pg5NxdsZp
    hYIXAgMBAAGjggEiMIIBHjAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB
    /zAdBgNVHQ4EFgQUj/BLf6guRSSuTVD6Y5qL3uLdG7wwHwYDVR0jBBgwFoAUYHtm
    GkUNl8qJUC99BM00qP/8/UswPQYIKwYBBQUHAQEEMTAvMC0GCCsGAQUFBzABhiFo
    dHRwOi8vb2NzcC5nbG9iYWxzaWduLmNvbS9yb290cjEwMwYDVR0fBCwwKjAooCag
    JIYiaHR0cDovL2NybC5nbG9iYWxzaWduLmNvbS9yb290LmNybDBHBgNVHSAEQDA+
    MDwGBFUdIAAwNDAyBggrBgEFBQcCARYmaHR0cHM6Ly93d3cuZ2xvYmFsc2lnbi5j
    b20vcmVwb3NpdG9yeS8wDQYJKoZIhvcNAQELBQADggEBACNw6c/ivvVZrpRCb8RD
    M6rNPzq5ZBfyYgZLSPFAiAYXof6r0V88xjPy847dHx0+zBpgmYILrMf8fpqHKqV9
    D6ZX7qw7aoXW3r1AY/itpsiIsBL89kHfDwmXHjjqU5++BfQ+6tOfUBJ2vgmLwgtI
    fR4uUfaNU9OrH0Abio7tfftPeVZwXwzTjhuzp3ANNyuXlava4BJrHEDOxcd+7cJi
    WOx37XMiwor1hkOIreoTbv3Y/kIvuX1erRjvlJDKPSerJpSZdcfL03v3ykzTr1Eh
    kluEfSufFT90y1HonoMOFm8b50bOI7355KKL0jlrqnkckSziYSQtjipIcJDEHsXo
    4HA=
    -----END CERTIFICATE-----
    ```

1. This CA certificate is one that can be used to verify the authenticity of
  the website `https://bbc.co.uk`. We can validate this by using `curl` from
  that container:

    ```shell
    kubectl exec -ti -n team-a $(kubectl get po -n team-a -l app=sleep-auto -o jsonpath='{.items[0].metadata.name}') -- curl -v https://bbc.co.uk
    ```

    We can also verify that from this pod, we can no longer talk to google.com.
    
    ```shell
    kubectl exec -ti -n team-a $(kubectl get po -n team-a -l app=sleep-auto -o jsonpath='{.items[0].metadata.name}') -- curl -v https://google.com
    ```

    Example TLS failure:

    ```
    *   Trying 142.250.200.46:443...
    * Connected to google.com (142.250.200.46) port 443 (#0)
    * ALPN: offers h2,http/1.1
    * TLSv1.3 (OUT), TLS handshake, Client hello (1):
    *  CAfile: /etc/ssl/certs/ca-certificates.crt
    *  CApath: none
    * TLSv1.3 (IN), TLS handshake, Server hello (2):
    * TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
    * TLSv1.3 (IN), TLS handshake, Certificate (11):
    * TLSv1.3 (OUT), TLS alert, unknown CA (560):
    * SSL certificate problem: unable to get local issuer certificate
    * Closing connection 0
    curl: (60) SSL certificate problem: unable to get local issuer certificate
    More details here: https://curl.se/docs/sslcerts.html

    curl failed to verify the legitimacy of the server and therefore could not
    establish a secure connection to it. To learn more about this situation and
    how to fix it, please visit the web page mentioned above.
    command terminated with exit code 60
    ```

### Enforce Usage of Your CA Bundle

Using tools such as 
[Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/)
& [Kyverno](https://kyverno.io/) we can require that particular
`volume` & `volumeMount` configurations are enforced when applications are
deployed to Kubernetes. With this method, a cluster administrator can setup
rules to automatically insert the relevant configuration to every pod.
This may be beneficial to enforce configuration but can be more opaque to your
cluster's application teams or tenants.

In this tutorial we will show how to use Gatekeeper

#### Gatekeeper

See the [Gatekeeper](./gatekeeper/) directory for two example `Assign` policies
designed to enforce the CA bundle being mounted on all pods from the
`configMap` that trust-manager produces in each namespace.

1. Install Gatekeeper onto your cluster:

    ```shell
    helm repo add gatekeeper https://open-policy-agent.github.io/gatekeeper/charts
    helm repo update
    helm install gatekeeper/gatekeeper --name-template=gatekeeper --namespace gatekeeper-system --create-namespace --version v3.11.0
    ```

1. Create a policy that applies to all `pod` resources in the `team-a`
namespace which mutates `Pod` resource as they are applied with the required
`volumes` configuration:

    ```yaml file=./gatekeeper/gatekeeper-trust-pod-ca-volume.yaml
    ```

    ```shell
    kubectl apply -f gatekeeper/gatekeeper-trust-pod-ca-volume.yaml
    ```

1. Create a policy that applies to all `pod` resources in the `team-a`
namespace which mutates them with a required `volumeMounts` configuration:

    ```yaml file=./gatekeeper/gatekeeper-trust-pod-ca-volumemount.yaml
    ```

    ```shell
    kubectl apply -f gatekeeper/gatekeeper-trust-pod-ca-volumemount.yaml
    ```

1. Switch to the `team-a` namespace and create the deployment with no prior
`volume` or `volumeMount` configuration to see the mutations take effect once
the pod is running:

    ```yaml file=./gatekeeper/deploy-novol.yaml
    ```

    ```shell
    kubectl apply -f gatekeeper/deploy-novol.yaml
    ```

1. Once applied validate that the `volume` and `volumeMount` have been applied:

    ```shell
    kubectl get po -n team-a -l app=test-assign -o yaml | yq '.items[0].spec' -
    ```

1. Execute a shell into the pod and attempt to make an HTTPS connection to any
publicly trusted website, for example: `https://bbc.co.uk`

    ```shell
    kubectl exec -n team-a -ti $(kubectl get pod -n team-a -l app=test-assign -o jsonpath='{.items[0].metadata.name}') -- curl -v https://bbc.co.uk
    ```

    Success looks like a valid 200 response from the web page.

    Note that this should now work without any additional configuration. If you
    get an SSL error at the point, check that the correct `configMap` is 
    referenced in the `volumes` section.

1. Lastly we can apply a similar pod, except this time the CA certificates
have been mounted explicitly. This is to show that with the Gatekeeper policies
no action is taken if the relevant configuration is already present:

    ```yaml file=./gatekeeper/deploy-withvol.yaml
    ```

    ```shell
    kubectl apply -f gatekeeper/deploy-withvol.yaml
    kubectl exec -n team-a -ti $(kubectl get pod -n team-a -l app=test-assign-noop -o jsonpath='{.items[0].metadata.name}') -- curl -v https://bbc.co.uk
    ```

**Note:** If you have problems with your `Assign` policy resource, try checking
the Kubernetes events (`kubectl get events`) for issues.

## Public Trust with trust-manager

In this tutorial we have shown how you can manage Certificate Authority
certificates at a cluster level using trust-manager, and how to consume this
trusted `Bundle` manually or by enforcing it with Gatekeeper. We have seen how
you can setup applications to auto deploy on changes to your trusted CAs.

Whilst this may appear to be more work for something that currently "works" in
your environment, consider how this solution positions you to handle situations
where you no longer trust a particular Certificate Authority.

Next time we will look at how simple it is to integrate Private Certificate
Authorities into this trust management process.

## Cleanup

To remove all resources deployed in this tutorial:

```shell
kubectl delete deployment -n team-a sleep-auto test-assign test-assign-noop
kubectl delete bundle public-bundle
kubectl delete assign demo-trust-ca-volume demo-trust-ca-volumemount
helm uninstall -n gatekeeper-system gatekeeper
helm uninstall -n stakater-reloader reloader
helm uninstall -n cert-manager trust-manager
helm uninstall -n cert-manager cert-manager
kubectl delete namespace cert-manager team-a stakater-reloader gatekeeper-system
kubectl delete crd -l gatekeeper.sh/system=yes
```
