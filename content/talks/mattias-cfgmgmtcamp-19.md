---
title: "Tarmak: Why do we need another Kubernetes provisioner?"
person: Mattias Gees
event: Config Management Camp, Belgium
slides_link: https://speakerdeck.com/mattiasgees/tarmak-why-do-we-need-another-kubernetes-provisioner
video_link: https://www.youtube.com/watch?v=xtc88sbUnkM
date: 2019-02-05
---

Tarmak is an open-source toolkit for Kubernetes cluster lifecycle management. It
is focused on best-practice cluster security, management and operation. This
talk will clarify the reasoning behind creating Tarmak, the architecture and
technologies used.

With Tarmak we tried to not reinvent the full wheel, that is why we have chosen
to depend on a lot open-source tools (Terraform, Puppet, Vault, …). This talk
will explain how all of this is tied together.
