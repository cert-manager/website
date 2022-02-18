---
title: "Tutorials"
linkTitle: "Tutorials"
weight: 50
type: "docs"
---

It is strongly recommended that users get familiar with the concepts and
configuration of resources in the documentation when using cert-manager.
However, step-by-step tutorials are very useful for deploying these resources to
get to a final goal. Below is the list of tutorials that you might find helpful:

- [Backup and Restore Resources](./backup/): Backup the cert-manager resources
  in your cluster and then restore them.
- [Securing Ingresses with NGINX-Ingress and
  cert-manager](./acme/ingress/): Tutorial for deploying NGINX into your
  cluster and securing the connection with an ACME certificate.
- [Issuing an ACME Certificate using DNS Validation](./acme/dns-validation/):
  Tutorial on how to resolve DNS ownership validation using DNS01 challenges.
- [Issuing an ACME Certificate using HTTP Validation](./acme/http-validation/):
  Tutorial on how to resolve DNS ownership validation using HTTP01 challenges.
- [Migrating from kube-lego](./acme/migrating-from-kube-lego/): Tutorial on
  how to migrate from the now deprecated kube-lego project.
- [Securing an EKS Cluster with Venafi](./venafi/venafi/): Tutorial for
  creating an EKS cluster and securing an NGINX deployment with a Venafi issued
  certificate.


User How-To Blog Posts and Examples:

- A full cert-manager installation demo on GKE Cluster. See [How-To: Automatic SSL Certificate Management for your Kubernetes Application Deployment](https://medium.com/contino-engineering/how-to-automatic-ssl-certificate-management-for-your-kubernetes-application-deployment-94b64dfc9114)
- cert-manager installation on GKE Cluster using Workload Identity. See [Kubernetes, ingress-nginx, cert-manager & external-dns](https://blog.atomist.com/kubernetes-ingress-nginx-cert-manager-external-dns/)
- A video tutorial for beginners showing cert-manager in action. See [Free SSL for Kubernetes with Cert-Manager](https://www.youtube.com/watch?v=hoLUigg4V18)