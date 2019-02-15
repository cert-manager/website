---
title: "Auditing with eBPF"
person: Luke Addision
event: Cloud Native London 
slides_link: https://docs.google.com/presentation/d/1v09L97K64FgF3imAkv9VLmJl-6l3yKl45TW7YS2LWtY/edit?usp=sharing
video_link: https://drive.google.com/file/d/1Uzheb-Ks1eGsBC4tl0X-iw8dLArD9qWP/view?usp=sharing
date: 2018-10-09
---

At the heart of Kubernetes is its API. Whilst on the surface it may appear
relatively simple to use, under the hood is a beast of complex conversions,
codecs and generators. In this talk, I'll show you how the Kubernetes
maintainers have created their own tooling to make this process easy when
contributing to core, and how you can use this to build your own custom
controllers, operators and API servers. I'll then demonstrate this technique
with a pager extension to Kubernetes.
