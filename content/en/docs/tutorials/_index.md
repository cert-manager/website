---
title: "Tutorials"
linkTitle: "Tutorials"
weight: 50
type: "docs"
---

Step-by-step tutorials are a great way to get started with cert-manager, and we provide a few
for you to learn from. Take a look!

- [Backup and Restore Resources](./backup/): Backup the cert-manager resources
  in your cluster and then restore them.
- [Securing Ingresses with NGINX-Ingress and cert-manager](./acme/ingress/): Tutorial for deploying NGINX into your
  cluster and securing incoming connections with a certificate from Let's Encrypt.
- [Issuing an ACME Certificate using DNS Validation](./acme/dns-validation/):
  Tutorial on how to resolve DNS ownership validation using DNS01 challenges.
- [Issuing an ACME Certificate using HTTP Validation](./acme/http-validation/):
  Tutorial on how to resolve DNS ownership validation using HTTP01 challenges.
- [Migrating from kube-lego](./acme/migrating-from-kube-lego/): Tutorial on
  how to migrate from the now deprecated kube-lego project.
- [Securing an EKS Cluster with Venafi](./venafi/venafi/): Tutorial for
  creating an EKS cluster and securing an NGINX deployment with a Venafi issued
  certificate.


### External Tutorials

- A full cert-manager installation demo on a GKE Cluster. See [How-To: Automatic SSL Certificate Management for your Kubernetes Application Deployment](https://medium.com/contino-engineering/how-to-automatic-ssl-certificate-management-for-your-kubernetes-application-deployment-94b64dfc9114)
- cert-manager installation on GKE Cluster using Workload Identity. See [Kubernetes, ingress-nginx, cert-manager & external-dns](https://blog.atomist.com/kubernetes-ingress-nginx-cert-manager-external-dns/)
- A video tutorial for beginners showing cert-manager in action. See [Free SSL for Kubernetes with cert-manager](https://www.youtube.com/watch?v=hoLUigg4V18)
