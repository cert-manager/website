---
title: Trusting certificates
description: "Managing client trust stores"
---

:::danger

If you're using private CAs, clients need to know the CA to be able to connect to servers.

With cert-manager, `ca.crt` will likely contain the certificate you need to trust,
but __do not mount the same `Secret` as the server__ to access `ca.crt`.

This is because:

1. That `Secret` also contains the private key of the server, which should only be accessible to the server.
   You should use RBAC to ensure that the `Secret` containing the serving certificate and private key are only accessible to Pods that need it.
2. Rotating CA certificates safely relies on being able to have both the old and new CA certificates trusted at the same time. See [the FAQ](../faq/README.md#chain-cacrt) for more details.

:::

When configuring the client you should independently choose and fetch the CA certificates that you want to trust.
Download the CA out of band and store it in a `Secret` or `ConfigMap` separate from the `Secret` containing the server's private key and certificate.

[trust-manager](./trust-manager/README.md) can be used to manage these certificates and automatically distribute them to multiple namespaces.

This ensures that if the material in the `Secret` containing the server key and certificate is tampered with,
the client will fail to connect to the compromised server.

The same concept also applies when configuring a server for mutually-authenticated TLS;
don't give the server access to Secret containing the client certificate and private key.

<a id="ca-crt-in-same-secret"></a>
## My application expects `ca.crt` in the same Secret as the certificate

Many Helm charts and operators assume a `kubernetes.io/tls` Secret with three keys:
`tls.crt`, `tls.key` and `ca.crt`. cert-manager only writes `ca.crt` when the issuer
reports a CA. The ACME issuer never does, so that Secret has no `ca.crt`, and the
application refuses to start or the volume mount fails with an error like
`references non-existent secret key: ca.crt`.

The question to answer first is what the application does with `ca.crt`. For most
applications it is a trust store: the set of CAs allowed to sign client or peer
certificates. For example, OpenSearch nodes use it to authenticate other nodes and
admin clients, and Redis uses `tls-ca-cert-file` to
[authenticate clients and replicas](https://github.com/redis/redis/blob/8.10.1/redis.conf#L233-L237).
A trust store must contain only CAs you control. If the certificate was issued by a
public CA such as Let's Encrypt, the issuing CA must not be used as a trust store,
because anyone with a certificate from that CA could then authenticate to your
application.

So the CA you want in `ca.crt` is a decision you make, and its lifecycle is separate
from the leaf certificate. Distribute it with trust-manager and connect the two
Secrets in one of these ways.

### Give the application a separate CA Secret

Check whether the application accepts the CA separately. Many of the applications
users report do:

- The OpenSearch operator has
  [`caSecret.name`](https://github.com/opensearch-project/opensearch-k8s-operator/blob/v2.8.0/docs/userguide/main.md?plain=1#L214)
  next to `secret.name`.
- The RabbitMQ cluster operator has
  [`tls.caSecretName`](https://github.com/rabbitmq/cluster-operator/blob/v2.22.5/api/v1beta1/rabbitmqcluster_types.go#L374)
  next to `tls.secretName`.
- Istio Gateway reads the CA for mutual TLS from a Secret named
  [`<credentialName>-cacert`](https://istio.io/latest/docs/reference/config/networking/gateway/#ServerTLSSettings).
- ingress-nginx reads the client CA from the Secret named in the
  [`auth-tls-secret`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#client-certificate-authentication)
  annotation.
- Gateway API `BackendTLSPolicy` reads CAs from a
  [ConfigMap](https://gateway-api.sigs.k8s.io/api-types/backendtlspolicy/).

Point those fields at a trust-manager `Bundle` target. `Bundle` targets are
ConfigMaps by default; enable Secret targets in trust-manager if the application
only accepts a Secret. See [Targets](./trust-manager/README.md#targets).

### Merge the two into one volume

If you write the Pod spec yourself, a
[projected volume](https://kubernetes.io/docs/concepts/storage/projected-volumes/)
presents the cert-manager Secret and the trust-manager ConfigMap as one directory.
The application sees `tls.crt`, `tls.key` and `ca.crt` side by side, and each file is
updated independently by its own controller:

```yaml
volumes:
  - name: tls
    projected:
      sources:
        - secret:
            name: my-app-tls # Certificate.spec.secretName
            items:
              - key: tls.crt
                path: tls.crt
              - key: tls.key
                path: tls.key
        - configMap:
            name: my-org-roots # trust-manager Bundle name
            items:
              - key: trust-bundle.pem # Bundle.spec.target.configMap.key
                path: ca.crt
```

### Do not write `ca.crt` into the cert-manager Secret

It is tempting to have a second controller, a mutating webhook or a Job add
`ca.crt` to the Secret that cert-manager manages. Do not do this. cert-manager
reconciles that Secret and reads it back to decide whether to reissue. For example,
if `keystores` are enabled, cert-manager treats the presence of `ca.crt` as proof that
the issuer provided a CA and expects a matching trust store. cert-manager builds
trust stores from the CA returned by the issuer, not from the Secret, and an ACME
issuer returns none. The trust store is never written, so the check fails and
cert-manager reissues on every reconcile.

If the application accepts only a single Secret with all three keys and offers no
separate CA option, ask the project to add one, and link to this page. In the
meantime, build a derived Secret with a tool such as
[secret-transform](https://github.com/maelvls/secret-transform) rather than editing
the cert-manager Secret.
