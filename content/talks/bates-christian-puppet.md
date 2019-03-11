---
title: "From Rollercoasters to Meerkats: 3 Generations of Production Kubernetes Clusters"
person: Matt Bates & Christian Simon
event: Puppet Conf 2017
slides_link: https://drive.google.com/file/d/1rZCUV1q2dWZ2kqlP1xHGNQSQdD_9nWo1/view?usp=sharing
video_link: https://www.youtube.com/watch?time_continue=6&v=ThbcHUj70EA
date: 2017-10-27
---

Deploying Kubernetes is improving with each release — but it hasn’t always been easy. This talk will look back at a two year journey setting up secure and scalable Kubernetes clusters in production and show how Jetstack’s approach to cluster provisioning has evolved, building on improvements in the project and the wider open source. We will explain several generations of approach, the pros/cons and the various tradeoffs, as well as all the lessons learned along the way deploying large production clusters. It all culminates with where we’re at today — a hybrid of immutable infrastructure and configuration management using Puppet, Terraform and Packer, dynamic short-lived renewable certificates with Vault, and cluster(s) lifecycle driven by CI/CD systems such as Jenkins and GoCD. The talk will deep-dive on the architecture and all the components, notably the open source Puppet modules that power the provisioning.