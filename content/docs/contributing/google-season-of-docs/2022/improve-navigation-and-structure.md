---
title: Improve the Navigation and Structure of the cert-manager Website
description: Google season of docs 2022 proposal
---

## Project Updates

### 7 Sept 2022: The Webhook Debugging Guide

<img src="/images/google-season-of-docs-2022-improve-navigation-and-structure/screenshot-friction-log-before.png" style={{float: "right", clear: "right", margin: "5px"}} width="40%" alt="friction log for task 3, before" />
<img src="/images/google-season-of-docs-2022-improve-navigation-and-structure/screenshot-friction-log-after.png" style={{float: "right", clear: "right", margin: "5px"}} width="40%" alt="friction log for task 3, after" />

At the start of the Google Season of Docs program, we built friction logs for
common user tasks, such as debugging the error "connect: connection refused".
The friction log for this task, visible in the [GSoD work
document](https://docs.google.com/document/d/1O-MFWwtpOcNlrRzsiBvrpGHC10EXnvw0XK37M2nEjzg/edit#bookmark=id.cu9ss8s7yl46),
was to serve as a reference point to see whether the improvements we aimed to
bring would have an impact or not.

The friction log showed a consistent pattern: the user searches the error on
Google, is confused by GitHub issues that don't have any solutions, then clicks
the second link in the Google results, without much luck. We realized that one
improvement we could make was to add a link to the FAQ page "Troubleshooting
Problems with the Webhook". We found two problems with this FAQ page:

1. It could not be found by anyone because the error messages were not listed in
   the page, meaning that Google would not show the page in the search results.
2. Many error messages were not listed in the page.

We set ourselves to rewrite this page with the goal of making it error-focused,
meaning that the user would just be able to look for their particular error and
start debugging it. We called it "The Definitive Debugging Guide for the
cert-manager Webhook Pod", and it can be found
[here](../../../troubleshooting/webhook/).

### 12 Aug 2022: Improved the layout of the navigation menu

On displays `>=1280px` the left-hand menu was too narrow to display the nested menu items clearly,
On smaller displays the [responsive CSS](https://tailwindcss.com/docs/responsive-design) actually made the menu larger.
So we've widened it by 1 column on displays `>=1280px`  and reduced the width of the content by 1 column to compensate.
This makes the menu much easier to read on laptop and desktop computer screens.

We fixed an inconsistency in the vertical spacing between menu items with sub-menus and those without.

And finally, we moved the version selector to the bottom of the side-bar to avoid distracting the reader.

### 3 August 2022: The cert-manager.io Documentation Survey is now closed

Thank you to everyone who participated in our documentation survey.
We will use the results to prioritize sections of the website for restructuring and rewriting.
Before the conclusion of this Season-of-Docs we will select a random winner from among the responses and contact you about your prize.

### 18 July 2022: The cert-manager.io Documentation Survey

<img src="/images/google-season-of-docs-2022-improve-navigation-and-structure/Screenshot_2022-07-18_at_14-35-48_cert-manager_documentation_survey.png" style={{float: "right", clear: "right", margin: "5px"}} alt="Screenshot 2022-07-18 at 14-35-48 cert-manager documentation survey" title="Screenshot 2022-07-18 at 14-35-48 cert-manager documentation survey" />

We have created a short survey, to help us identify what are the top-priorities for the cert-manager.io documentation.

1. We want identify the most useful documentation, so that we don't go and change things that are already working well.
2. We want to know which documentation is not useful, so that we can make improvements.
3. We'd like to hear from new and experienced users about how and how often you use the documentation.
4. And we'd like to know where else you find good information about cert-manager, outside of the cert-manager.io website,
so that we can try and incorporate some of those sources.

We've added a link to the survey to the banner at the top of this site
and we will also be sharing the link in our Slack channels and mailing lists.

[Please take 10 minutes to fill in the survey](https://docs.google.com/forms/d/e/1FAIpQLSeqfRkd86_N0L7VOW_ImCT0iyUabhczdiDk2dQDLp55V8kqvw/viewform).

<div style={{clear: "both"}} />

### 15 July 2022: New "Getting Started" pages

<img src="/images/google-season-of-docs-2022-improve-navigation-and-structure/Screenshot_2022-07-15_at_10-22-50_Let_s_Encrypt_Kubernetes_-_Google_Search.png" style={{float: "right", clear: "right"}} />
<img src="/images/google-season-of-docs-2022-improve-navigation-and-structure/Screenshot_2022-07-15_at_10-23-04_Let_s_Encrypt_Kubernetes_at_DuckDuckGo.png" style={{float: "right", clear: "right"}} />

We have been auditing the existing documentation to identify some key tasks that our users and potential new users need to carry out.
We have created "friction logs" for some of these tasks.
What this means is that we imagine ourselves in the place of the user and ask, for example,

> How can I get a Let's Encrypt certificate for my server in Kubernetes?

So we searched Google and DuckDuckGo for "Let's Encrypt Kubernetes" and to our surprise, cert-manager.io does not feature among the top search results.

Among the results are some excellent third-party tutorials and videos about using cert-manager to create Let's Encrypt certificates,
and we are grateful to the authors for taking the time to write such detailed content.
But inevitably, some of these refer to much older versions of cert-manager and Kubernetes.
So we have decided to write some official guides, for the cert-manager.io website which demonstrate how to quickly install cert-manager and configure it for Let's Encrypt.
We hope that in time these will be indexed by the search engines and that they will reach the top of the search results for "Let's Encrypt Kubernetes".
The advantages will be that users and potential users will find up-to-date information,
and the cert-manager.io maintainers will receive fewer support requests from new users who are attempting this task.

Go and read the new [Getting Started Guide for GKE Users](../../../getting-started) and tell us what you think.

<div style={{clear: "both"}} />

### 5 May 2022: Announcing Mehak Saeed as Technical Writer

We are delighted to announce that [Mehak Saeed](https://www.linkedin.com/in/mehak-saeed-29121a12a) will be the technical writer working on this project.
We were extremely impressed with Mehak's presentation during her interview and impressed with her detailed preparations and planning.
We look forward to working with her.

Thank you to all the other technical writers who applied for this project.

### 14 April 2022: Project Accepted

This project was [accepted on 14 April 2022](https://developers.google.com/season-of-docs/docs/participants).

### 24 March 2022: Project Registered

We have [registered our interest to  participate in Google Season of Docs 2022](https://github.com/google/season-of-docs/pull/483),
and have submitted a single project proposal detailed in the remaining of this
page.

You have until 27 April 2022 18:00 UTC to apply for the technical writer role.

We will be sharing the name of the selected candidate on Wed 4 May 2022 at
15:00 London Time (14:00 UTC) on Slack in the channel `#cert-manager-dev`.

To apply as a technical writer, please let us know by one of the two ways
below:

- e-mail us at `cert-manager-maintainers@googlegroups.com` with the prefix
  `GSoD2022:` in the e-mail subject.
- or open an issue on
  [cert-manager/website](https://github.com/cert-manager/website) with the
  prefix `GSoD2022:` in the issue title.

You can join our open standup (every day at 10:30 UK time), and join the
Kubernetes Slack channel `#cert-manager-dev` to know more about this project
proposal.

## About cert-manager

cert-manager (current version 1.8.0, first release in October 2017) is an Apache-2.0 licensed Kubernetes add-on to automate the management and issuance of TLS certificates.

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

(NB: This screenshot is from our old site design but the text and layout are broadly the same)

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
| Volunteer stipends                                                            | 1,500       | 13,500            | 3 volunteer stipends x 500 each |
| TOTAL                                                                         |             | 13,500            |                                 |

Regarding the amount of $12,000, we assume that it will be enough to fund one experienced technical writer
part-time (for example, they could work half day from Tuesday to Friday, for a total of 24 days, for 3 months
at a daily rate of $500).

We will give the "volunteer stipend" to contributors who can show they have one PR within the project
time frame (from 1st May to 30th July) in which a re-write of one page or a set of pages. Before
starting the rewriting, the volunteer will suggest which page they wish to work on either on Slack
(Kubernetes Slack, channel #cert-manager-dev), or in an issue on GitHub, and make sure by asking the
team whether it makes sense to rework this page. As long as at least one positive reaction, the
volunteer can start working. For the stipend to be validated, the PR needs to be reviewed and merged.
