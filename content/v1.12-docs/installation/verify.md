---
title: Verifying the Installation
description: 'cert-manager installation: Verifying an upgrade was successful'
---

## Check cert-manager API

First, make sure that [cmctl is installed](../reference/cmctl.md#installation).

cmctl performs a dry-run certificate creation check against the Kubernetes cluster.
If successful, the message `The cert-manager API is ready` is displayed.

```bash
$ cmctl check api
The cert-manager API is ready
```

The command can also be used to wait for the check to be successful.
Here is an output example of running the command at the same time that cert-manager is being installed:

```bash
$ cmctl check api --wait=2m
Not ready: the cert-manager CRDs are not yet installed on the Kubernetes API server
Not ready: the cert-manager CRDs are not yet installed on the Kubernetes API server
Not ready: the cert-manager webhook deployment is not ready yet
Not ready: the cert-manager webhook deployment is not ready yet
Not ready: the cert-manager webhook deployment is not ready yet
Not ready: the cert-manager webhook deployment is not ready yet
The cert-manager API is ready
```

## Manual verification

Once you've installed cert-manager, you can verify it is deployed correctly by
checking the `cert-manager` namespace for running pods:

```bash
$ kubectl get pods --namespace cert-manager

NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-5c6866597-zw7kh               1/1     Running   0          2m
cert-manager-cainjector-577f6d9fd7-tr77l   1/1     Running   0          2m
cert-manager-webhook-787858fcdb-nlzsq      1/1     Running   0          2m
```

You should see the `cert-manager`, `cert-manager-cainjector`, and
`cert-manager-webhook` pods in a `Running` state. The webhook might take a
little longer to successfully provision than the others.

If you experience problems, first check the [FAQ](../faq/README.md).

Create an `Issuer` to test the webhook works okay.
```bash
$ cat <<EOF > test-resources.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cert-manager-test
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: test-selfsigned
  namespace: cert-manager-test
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: selfsigned-cert
  namespace: cert-manager-test
spec:
  dnsNames:
    - example.com
  secretName: selfsigned-cert-tls
  issuerRef:
    name: test-selfsigned
EOF
```

Create the test resources.
```bash
$ kubectl apply -f test-resources.yaml
```

Check the status of the newly created certificate. You may need to wait a few
seconds before cert-manager processes the certificate request.
```bash
$ kubectl describe certificate -n cert-manager-test

...
Spec:
  Common Name:  example.com
  Issuer Ref:
    Name:       test-selfsigned
  Secret Name:  selfsigned-cert-tls
Status:
  Conditions:
    Last Transition Time:  2019-01-29T17:34:30Z
    Message:               Certificate is up to date and has not expired
    Reason:                Ready
    Status:                True
    Type:                  Ready
  Not After:               2019-04-29T17:34:29Z
Events:
  Type    Reason      Age   From          Message
  ----    ------      ----  ----          -------
  Normal  CertIssued  4s    cert-manager  Certificate issued successfully
```

Clean up the test resources.
```bash
$ kubectl delete -f test-resources.yaml
```

If all the above steps have completed without error, you're good to go!

## Community-maintained tool

Alternatively, to automatically check if cert-manager is correctly configured,
you can run the community-maintained [cert-manager-verifier](https://github.com/alenkacz/cert-manager-verifier) tool.
