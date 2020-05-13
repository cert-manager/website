---
url: /preflight
title: Preflight
description: |
    Jetstack Preflight helps you better understand your Kubernetes environments by
    constantly scanning for mis-configurations that may be opening security holes,
    causing costly excess resource usage or making your cluster harder to maintain.

    Preflight checks your environment against hundreds of policy rules, all
    developed by our Kubernetes experts and based on years of working with
    customers' production workloads. Data from your environment is continually
    checked against policy rules and the results are summarised in clear reports
    that highlight the areas most in need of your attention.
logo:
  url: /img/png/preflight-logo.png
  alt: Preflight logo
og:
  description: Preflight is a service that performs automatic configuration checks on your Kubernetes infrastructure.
  image:
    url: /img/png/preflight-diagram-simple.png
    alt: Diagram showing that Preflight inspects your clusters and generates reports
links:
- text: Visit Preflight
  url: https://preflight.jetstack.io/
  external: true
- contactform: true
  text: Join the Beta
features:
- title: Gain visibility in to the workloads running in your Kubernetes environments
  short: Workload visibility
  color: green
  image:
    url: /img/png/preflight-diagram.png
    alt: Diagram showing how preflight uses an agent in your infrastructure to report data to the Preflight SaaS for analysis and reporting
  description: |
    You don't always know exactly what is running in your Kubernetes clusters, either because developers may have deployed things that you don't know about, or because configuration changes have left applications running that everyone thinks have been removed.

    Preflight allows you to see exactly what is running in each cluster without requiring you to pre-approve every change or specific tools to deploy the clusters or their applications. Preflight will also highlight anything that is particularly high risk because of configuration problems, whether that is potential security holes or excess resource usage.
- title: Automated verification of cluster compliance and conformance
  short: Compliance & conformance verification
  color: blue
  image:
    url: /img/png/preflight-violations.png
    alt: Screenshot of the summary of a Preflight report for a Kubernetes cluster
    small: true
  description: |
    Preflight is a core tool for your Kubernetes team, providing a seamless compliance checker so that your business can move quickly on improving your Infrastructure, whilst having the confidence that it meets the highest standards of best practice.

    You can rely on our Kubernetes expertise to catch many common Kubernetes errors.
- title: Ready-made policy packages that are maintained and updated for common cloud native Architecture and patterns
  short: Cloud-native architecture and patterns
  color: purple
  additional: preflight:packages
  description: |
    Preflight packages are constantly updated through shared knowledge in Jetstack, meaning they are always covering the latest developments in upstream technologies and cloud infrastructure.
- title: Hosted, managed, or on-prem
  color: yellow
  description: |
    Preflight supports any Kubernetes environment, hosted or on-prem, and can be used when you have a heterogeneous environment. There are policy packs that check specific rules for each environment so that you be sure that you have the best configuration in each case.

    <center>

    | Platform | Supported | Platform-specific checks |
    |---|---|---|
    | Google Kubernetes Engine | ✓ | ✓ |
    | Azure Kubernetes Service | ✓ | Coming soon... |
    | Amazon Elastic Kubernetes Service | ✓ | Coming soon... |
    | Self-hosted | ✓ | Coming soon... |

    </center>
- title: Easy to digest recommendations
  color: maroon
  image:
    url: /img/png/preflight-recommendation.png
    alt: Screenshot of a recommendation made by Preflight about how options to rectify a configuration issue
    small: true
  description: |
    Jetstack hosts a secure web portal to view the latest reports of checks, ensuring that all members of your team are able to evaluate the current state of your Kubernetes infrastructure. The reports highlight the most important items for you to review and deal with before they become costly.

    The recommendations are updated with new Kubernetes versions so that you can be sure that you are always up to date with best-practices.
- title: Historical reporting
  color: green
  image:
    url: /img/png/preflight-history.png
    alt: Screenshot of the history of Preflight reports for a single cluster
    small: true
  description: |
    Preflight maintains a historical record of the reports from your environments. This allows you to confirm the earlier state of your cluster when needed.

    It also powers our notification feature that informs you when new violations occur within one your environments.
cta:
  title: Join the Private Beta
  text: |
    Jetstack Preflight is currently in Private Beta. Sign up here to be invited to join.
  freshsales:
    src: "https://jetstacksales.freshsales.io/web_forms/c103886bee5ad88446293623e7aaa1094f4f8a06b002cdb8163b449a50f9a82c/form.js"
    id: "fs_c103886bee5ad88446293623e7aaa1094f4f8a06b002cdb8163b449a50f9a82c"
---
