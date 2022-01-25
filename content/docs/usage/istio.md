---
title: Securing Istio Service Mesh
description: >-
  cert-manager can be integrated with Istio using the project istio-csr. The
  istio-csr will deploy an agent that is responsible for receiving certificate
  signing requests for all members of the Istio mesh, and signing them through
  cert-manager.
---

cert-manager can be integrated with [Istio](https://istio.io) using the project
[istio-csr](https://github.com/cert-manager/istio-csr). The istio-csr will
deploy an agent that is responsible for receiving certificate signing requests
for all members of the Istio mesh, and signing them through cert-manager.

[istio-csr](https://github.com/cert-manager/istio-csr) will sign all control
plane and workload certificates via your chosen cert-manager Issuer.
