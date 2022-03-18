---
title: "Improve the Navigation and Structure of the cert-manager Website"
linkTitle: "Improve the Navigation and Structure of the cert-manager Website"
weight: 70
type: "docs"
---

## About cert-manager

cert-manager (current version 1.7.2, first release in October 2017) is an Apache-2.0 licensed Kubernetes add-on to automate the management and issuance of TLS certificates.
Our typical contributors are Go developers from around the world with experience of the Kubernetes ecosystem with experience contributing to core Kubernetes components and Kubernetes operators.
Our users are often developers and system administrators who are trying to automate the rotation of TLS certificates for applications running in their Kubernetes clusters.
Our largest users have cert-manager installed on multiple Kubernetes clusters and managing many thousands of TLS certificates.

## Project Overview

Right now the content is not designed with our target audiences in mind.
For example a new user will not easily find a guide explaining how to install cert-manager on AWS and configure it for Let’s Encrypt.
Nor will a Cluster Administrator easily find information about how to optimize cert-manager for a large cluster with many Certificates.
The information exists but is spread across multiple pages and is often not at the obvious page.

As a visual example, a user looking for a guide on how the Certificate resource can be used may feel helpless when realizing that the "Certificate" page exists twice: once under the "Usage" section, and once under the "Concepts" section.

![Screenshot of the cert-manager.io website with Usage and Concepts visible in the menu](/images/google-season-of-docs-2022-improve-navigation-and-structure.png)

We would like a technical writer:

1. to help us identify our target audiences, and
2. to identify the key tasks of each of these audiences, and
3. re-structure the cert-manager.io website with this in mind.

For example, we have discussed the following audiences and tasks: Beginner, Cluster Administrator, User, Integrator, New Contributor
and each of these people will be interested in a different set of tasks.
We would like them to quickly and easily find the information they need.

By making it easier for each group to find the information they need we aim to reduce the number of support queries.

## Scope

The scope of this project is as follows:

1. Identify and describe three target audiences.
2. Identify three key top tasks for each of these audiences.
3. Audit the existing documentation and create a friction log of the current documentation.
4. Using the friction log as a baseline, re-organize the documentation to minimize friction for three top tasks.
6. Incorporate feedback from documentation testers (volunteers in the project) and the wider cert-manager community.
7. Work with the cert-manager team to publish the documentation on cert-manager.io.
8. Create documentation for website contributors explaining how we structure our content around audiences and tasks.

## Measuring success

After the technical writer has helped us identify the 3 key tasks for each audience
we will measure a baseline number of clicks required to achieve the task and we will aim to minimize the number of clicks for each task.

## Timeline

| Dates       | Action Items                                     |
|-------------|--------------------------------------------------|
| May         | Orientation                                      |
| May / June  | Identify audiences and tasks                     |
| May / June  | Audit and friction log                           |
| June        | Restructuring tasks                              |
| June / July | Incorporating feedback                           |
| June / July | Publish to cert-manager.io                       |
| July        | Finish writing guidance for website contributors |
| July        | Project Completion                               |

## Budget

|                                  Budget item                                  | Amount  ($) | Running Total ($) |              Notes              |
|-------------------------------------------------------------------------------|-------------|-------------------|---------------------------------|
| Technical writer audit and restructuring of the cert-manager.io documentation | 12,000      | 12,000            |                                 |
| Volunteer stipends                                                            | 1,500       | 12,500            | 3 volunteer stipends x 500 each |
| TOTAL                                                                         |             | 12,500            |                                 |
