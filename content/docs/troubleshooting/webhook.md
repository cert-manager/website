---
title: Troubleshooting Problems with the Webhook
description: |
    Learn how to diagnose problems with the cert-manager webhook, such as connection errors or invalid or missing TLS certificate errors
---

Learn how to diagnose problems with the cert-manager webhook, such as connection errors or invalid or missing TLS certificate errors.

## Overview

You may encounter errors when creating cert-manager resources indicating that the webhook is unreachable.
In this case, it is advised to first check the [compatibility](../installation/compatibility.md) of your environment
and take necessary action outlined there.
Then refer to the [known webhook problems](../concepts/webhook.md#known-problems-and-solutions).
And finally, if you are still having problems follow the steps below.

## Check the webhook TLS certificates

The Kubernetes API server will load the CA content from the webhook configuration and use that to verify the serving certificate presented by the webhook server, when the TLS connection is established.

Get the webhook configuration and check the `caBundle` value.
For example, to check the `ValidatingWebhookConfiguration`:

```
kubectl get validatingwebhookconfigurations cert-manager-webhook -o yaml | grep caBundle
```

NOTE: If the value is empty there may be a problem with `cainjector`.
The `caBundle` value is set by [`cainjector` Injecting CA data from a Secret resource](./ca-injector.md#injecting-ca-data-from-a-secret-resource).
Check that the `cainjector` Pod is running and check the `cainjector` logs for errors.

Next check that the `caBundle` has a valid CA certificate.

```
echo <CA BUNDLE VALUE> | base64 -d  | openssl x509 -in - -noout -text
```

Then compare that with the certificates that are being used by the webhook server:

```
kubectl -n cert-manager get secrets cert-manager-webhook-ca  -o yaml
```

You should be able to decode the `ca.crt` X.509 content from that secret and see that the CA matches that which we saw in the webhook configuration.

You should also find that the `tls.crt` content has a certificate signed by that same CA.

NOTE: This process can also be repeated for the `caBundle` field in `MutatingWebhookConfiguration` and `CustomResourceDefinition` resources.

## Temporarily work around webhook TLS problems

If necessary, you can manually add / update the TLS certificates in the `ValidatingWebhookConfiguration`, `MutatingWebhookConfiguration`,
and in each of the cert-manager `CustomResourceDefinition` resources.
Add the `caBundle` value, copied from the `ca.crt` field of the `cert-manager-webhook-ca` Secret.

NOTE: This should only be used as a temporary measure, while you investigate the root cause of `cainjector` failing to update the fields automatically.
