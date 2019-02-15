---
title: "Why running kubelet on your vacuum is (not) a good idea"
person: Christian Simon
event: Kubecon Europe 2018
slides_link: https://drive.google.com/drive/folders/1V6oynSi611IwsMsNbvKroSqQAU0XGQ6t
video_link: https://www.youtube.com/watch?v=ea0UzDpk6PE&feature=youtu.be
date: 2018-05-04
---

The Xiamio Mi Vacuum Robot is an affordable bit of kit, yet comes with a powerful SoC and utilises a wide range of sensors. A talk at 34C3 last year showed how to gain root access to the underlying Ubuntu Linux operating system.

Based on this groundwork, the talk will explain how the vacuum can be provisioned as a node in a Kubernetes cluster. From then on,well-known Kubernetes primitives can be used to control it: CronJobs periodically schedule drives, and a custom Prometheus exporter is used to track metrics about a vacuum’s life.

Using custom controllers and CRDs, extended features of the vacuum can be utilised: requesting raw sensor readings, dumping a map of your home, and allowing the vacuum to drive custom paths.
