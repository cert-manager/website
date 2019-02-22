---
title: "Auditing with eBPF"
person: Luke Addision
event: Cloud Native London 
slides_link: https://docs.google.com/presentation/d/1v09L97K64FgF3imAkv9VLmJl-6l3yKl45TW7YS2LWtY/edit?usp=sharing
video_link: https://drive.google.com/file/d/1Uzheb-Ks1eGsBC4tl0X-iw8dLArD9qWP/view?usp=sharing
date: 2018-10-09
---

eBPF (extended Berkeley Packet Filter) is a powerful Linux Kernel technology that allows user space code to be run on an in-kernel virtual machine. This talk will introduce eBPF at a high level, some of its more common uses and go into detail on a specific eBPF program designed to record all shell sessions on a Linux machine. The talk will end with a demonstration of how this program can be deployed on Google Kubernetes Engine to replay container shell sessions and gain new insights into activity across the cluster.