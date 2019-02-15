---
title: "Extending the Kubernetes API: What the Docs Don't Tell You"
person: James Munnelly
event: Kubecon North America 2017
slides_link: https://docs.google.com/presentation/d/17W_-GG1I00k7zL43DvwuJKJTQuPS_pK058qGclf0Mbc/edit?usp=sharing
video_link: https://www.youtube.com/watch?v=PYLFZVv68lM
date: 2017-12-15
---

At the heart of Kubernetes is its API. Whilst on the surface it may appear
relatively simple to use, under the hood is a beast of complex conversions,
codecs and generators. In this talk, I'll show you how the Kubernetes
maintainers have created their own tooling to make this process easy when
contributing to core, and how you can use this to build your own custom
controllers, operators and API servers. I'll then demonstrate this technique
with a pager extension to Kubernetes.
