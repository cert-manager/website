---
title: CA
description: 'cert-manager configuration: CA Issuers'
---

The CA issuer represents a Certificate Authority whereby its certificate and
private key are stored inside the cluster as a Kubernetes `Secret`, and will be
used to sign incoming certificate requests. This internal CA certificate can
then be used to trust resulting signed certificates.

This issuer type is typically used in a Public Key Infrastructure (PKI) setup to
secure your infrastructure components to establish mTLS or otherwise provide a
means to issue certificates where you also own the private key. Signed
certificates will _not_ be trusted by clients, such a web browser, by default.

## Deployment

In order to create your CA issuer, you must first submit your CA certificate and
signing private key to the Kubernetes API server so that cert-manager is able to
retrieve them and sign certificates. This secret should reside in the same
namespace as the `Issuer`, or otherwise in the `Cluster Resource Namespace` in
the case of a `ClusterIssuer`. The `Cluster Resource Namespace` is defaulted as
being the `cert-manager` namespace, however can be configured using the
`--cluster-resource-namespace` flag on the cert-manager controller component.

Below is an example of a secret resource that will be used for signing. Take
note of the index keys used for each field as these are required in order for
cert-manager to find the certificate and key. Also note that, like all secrets,
data must be base64 encoded. The command `$ cat crt.pem | base64` should help
you here.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ca-key-pair
  namespace: sandbox
data:
  tls.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMrVENDQWVHZ0F3SUJBZ0lKQUtQR3dLRGwvNUhuTUEwR0NTcUdTSWIzRFFFQkN3VUFNQk14RVRBUEJnTlYKQkFNTUNHcHZjMmgyWVc1c01CNFhEVEU1TURneU1qRTJNRFUxT0ZvWERUSTVNRGd4T1RFMk1EVTFPRm93RXpFUgpNQThHQTFVRUF3d0lhbTl6YUhaaGJtd3dnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCCkFRQ3doU0IvcVc2L2tMYjJ6cHUrRUp2RDl3SEZhcStRQS8wSkgvTGxseW83ekFGeCtISHErQ09BYmsrQzhCNHQKL0hVRXNuczVSTDA5Q1orWDRqNnBiSkZkS2R1UHhYdTVaVllua3hZcFVEVTd5ZzdPU0tTWnpUbklaNzIzc01zMApSNmpZbi9Ecmo0eFhNSkVmSFVEcVllU1dsWnIzcWkxRUZhMGM3ZlZEeEgrNHh0WnROTkZPakg3YzZEL3ZXa0lnCldRVXhpd3Vzc2U2S01PV2pEbnYvNFZyamVsMlFnVVlVYkhDeWVaSG1jdGkrSzBMV0Nmby9SZzZQdWx3cmJEa2gKam1PZ1l0MzBwZGhYME9aa0F1a2xmVURIZnA4YmpiQ29JMnRhWUFCQTZBS2pLc08zNUxBRVU3OUNMMW1MVkh1WgpBQ0k1VWppamEzVlBXVkhTd21KUEp5dXhBZ01CQUFHalVEQk9NQjBHQTFVZERnUVdCQlFtbDVkVEFaaXhGS2hqCjkzd3VjUldoYW8vdFFqQWZCZ05WSFNNRUdEQVdnQlFtbDVkVEFaaXhGS2hqOTN3dWNSV2hhby90UWpBTUJnTlYKSFJNRUJUQURBUUgvTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFCK2tsa1JOSlVLQkxYOHlZa3l1VTJSSGNCdgpHaG1tRGpKSXNPSkhac29ZWGRMbEcxcFpORmpqUGFPTDh2aDQ0Vmw5OFJoRVpCSHNMVDFLTWJwMXN1NkNxajByClVHMWtwUkJlZitJT01UNE1VN3ZSSUNpN1VPbFJMcDFXcDBGOGxhM2hQT2NSYjJ5T2ZGcVhYeVpXWGY0dDBCNDUKdEhpK1pDTkhCOUZ4alNSeWNiR1lWaytUS3B2aEphU1lOTUdKM2R4REthUDcrRHgzWGNLNnNBbklBa2h5SThhagpOVSttdzgvdG1Sa1A0SW4va1hBUitSaTBxVW1Iai92d3ZuazRLbTdaVXkxRllIOERNZVM1TmtzbisvdUhsUnhSClY3RG5uMDM5VFJtZ0tiQXFONzJnS05MbzVjWit5L1lxREFZSFlybjk4U1FUOUpEZ3RJL0svQVRwVzhkWAotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
  tls.key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBc0lVZ2Y2bHV2NUMyOXM2YnZoQ2J3L2NCeFdxdmtBUDlDUi95NVpjcU84d0JjZmh4CjZ2Z2pnRzVQZ3ZBZUxmeDFCTEo3T1VTOVBRbWZsK0krcVd5UlhTbmJqOFY3dVdWV0o1TVdLVkExTzhvT3praWsKbWMwNXlHZTl0N0RMTkVlbzJKL3c2NCtNVnpDUkh4MUE2bUhrbHBXYTk2b3RSQld0SE8zMVE4Ui91TWJXYlRUUgpUb3grM09nLzcxcENJRmtGTVlzTHJMSHVpakRsb3c1Ny8rRmE0M3Bka0lGR0ZHeHdzbm1SNW5MWXZpdEMxZ242ClAwWU9qN3BjSzJ3NUlZNWpvR0xkOUtYWVY5RG1aQUxwSlgxQXgzNmZHNDJ3cUNOcldtQUFRT2dDb3lyRHQrU3cKQkZPL1FpOVppMVI3bVFBaU9WSTRvMnQxVDFsUjBzSmlUeWNyc1FJREFRQUJBb0lCQUNFTkhET3JGdGg1a1RpUApJT3dxa2UvVVhSbUl5MHlNNHFFRndXWXBzcmUxa0FPMkFDWjl4YS96ZDZITnNlanNYMEM4NW9PbmtrTk9mUHBrClcxVS94Y3dLM1ZpRElwSnBIZ09VNzg1V2ZWRXZtU3dZdi9Fb1V3eHFHRVMvcnB5Z1drWU5WSC9XeGZGQlg3clMKc0dmeVltbXJvM09DQXEyLzNVVVFiUjcrT09md3kzSHdUdTBRdW5FSnBFbWU2RXdzdWIwZzhTTGp2cEpjSHZTbQpPQlNKSXJyL1RjcFRITjVPc1h1Vm5FTlVqV3BBUmRQT1NrRFZHbWtCbnkyaVZURElST3NGbmV1RUZ1NitXOWpqCmhlb1hNN2czbkE0NmlLenUzR0YwRWhLOFkzWjRmeE42NERkbWNBWnphaU1vMFJVaktWTFVqbVlQSEUxWWZVK3AKMkNYb3dNRUNnWUVBMTgyaU52UEkwVVlWaUh5blhKclNzd1YrcTlTRStvVi90U2ZSUUNGU2xsV0d3KzYyblRiVwpvNXpoL1RDQW9VTVNSbUFPZ0xKWU1LZUZ1SWdvTEoxN1pvWjN0U1czTlVtMmRpT0lPSHorcTQxQzM5MDRrUzM5CjkrYkFtVmtaSFA5VktLOEMraS9tek5mSkdHZEJadGIweWtTM2t3OUIxTHdnT3o3MDhFeXFSQ2tDZ1lFQTBXWlAKbzF2MThnV2tMK2FnUDFvOE13eDRPZlpTN3dKY3E0Z0xnUWhjYS9pSkttY0x0RFN4cUJHckJ4UVo0WTIyazlzdQpzTFVrNEJobGlVM29iUUJNaUdtMGtITHVBSEFRNmJvdWZBMUJwZjN2VFdHSkhSRjRMeFJsNzc2akw4UXI4VnpxClpURVBtY0R0T0hpYjdwb2I1Z2IzSDhiVGhYeUhmdGZxRW55alhFa0NnWUVBdk9DdDZZclZhTlQrWThjMmRFYk4Kd3dJOExBaUZtdjdkRjZFUjlCODJPWDRCeGR0WTJhRDFtNTNqN2NaVnpzNzFYOE1TN25FcDN1dkFqaElkbDI3KwpZbTJ1dUUyYVhIbDN5VTZ3RzBETFpUcnVIU0Z5TVI4ZithbHRTTXBDd0s1NXluSGpHVFp6dXpYaVBBbWpwRzdmCk1XbVRncE1IK3puc3UrNE9VNFBHUW9FQ2dZQWNqdUdKbS84YzlOd0JsR2lDZTJIK2JGTHhSTURteStHcm16QkcKZHNkMENqOWF3eGI3aXJ3MytjRGpoRUJMWExKcjA5YTRUdHdxbStrdElxenlRTG92V0l0QnNBcjVrRThlTVVBcAp0djBmRUZUVXJ0cXVWaldYNWlaSTNpMFBWS2ZSa1NSK2pJUmVLY3V3aWZKcVJpWkw1dU5KT0NxYzUvRHF3Yk93CnRjTHAwUUtCZ0VwdEw1SU10Sk5EQnBXbllmN0F5QVBhc0RWRE9aTEhNUGRpL2dvNitjSmdpUmtMYWt3eUpjV3IKU25QSG1TbFE0aEluNGMrNW1lbHBDWFdJaklLRCtjcTlxT2xmQmRtaWtYb2RVQ2pqWUJjNnVGQ1QrNWRkMWM4RwpiUkJQOUNtWk9GL0hOcHN0MEgxenhNd1crUHk5Q2VnR3hhZ0ZCekxzVW84N0xWR2h0VFFZCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==
```

Next is to deploy the CA issuer which references this `Secret`. This is done by
referencing the secret name under the `ca` stanza in the `Issuer` spec.

```yaml
apiVersion: cert-manager.io/v1alpha2
kind: Issuer
metadata:
  name: ca-issuer
  namespace: sandbox
spec:
  ca:
    secretName: ca-key-pair
```
Optionally, you can specify [CRL](https://en.wikipedia.org/wiki/Certificate_revocation_list) Distribution Points. An array of strings each of which identifies the location of the CRL from which the revocation of this certificate can be checked:
```
...
spec:
  ca:
    secretName: ca-key-pair
    crlDistributionPoints:
    - "http://example.com"
```
Once deployed, you can then check that the issuer has been successfully
configured by checking the ready status of the certificate. Replace `issuers`
here with `clusterissuers` if that is what has been deployed.

configured for the CLI.
```bash
$ kubectl get issuers ca-issuer -n sandbox -o wide
NAME          READY   STATUS                AGE
ca-issuer     True    Signing CA verified   2m
```

Certificates are now ready to be requested by using the CA `Issuer` named
`ca-issuer` within the `sandbox` namespace.