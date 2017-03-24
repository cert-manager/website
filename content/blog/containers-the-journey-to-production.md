+++
title = "Containers - The Journey to Production"
date = "2015-05-08T22:00:00+01:00"
Tags = ["Jetstack", "Meetup"]
Categories = ["Jetstack", "Meetup"]
author = "Matt Barker"
thumbnail = "/authors/matt-barker.jpg"
image = "/blog/containers-the-journey-to-production/cover.jpg"
socialsharing = true
+++

Tuesday the 21st of April was the inaugural [\[ Contain \]](http://www.meetup.com/Contain/) meetup.

Hosted at the Hoxton Hotel, Shoreditch, we were fortunate to have representation from:

- **Alexis Richardson**: Founder of [Weaveworks](http://weave.works/) and [RabbitMQ](https://www.rabbitmq.com/)
- **Ben Firshman**: Founder of [Fig](http://www.fig.sh/) and [Orchard](https://www.orchardup.com/), now Product Manager at [Docker](https://www.docker.com/)
- **Steve Bryen**: Solution Architect, Amazon, and UK lead on [Elastic Container Service](http://aws.amazon.com/ecs/) (ECS)
- **Ivan Pedrazas**: Senior DevOps at [Import.io](http://www.import.io/) and long-time user of Docker

The theme chosen for the event was:

> "Containers - The Journey to Production"

<!--more-->

A quick straw poll of the 70+ members of the audience showed that over 80% were using containers - but just 5 people were using containers in production. The theme of the evening seemed appropriate as many consider how to get to production successfully.

Here are a selection of questions and answers from the panel and audience discussion.

# 1.) What do you see as the biggest challenge to moving containers into production?

There is a general misconception that Docker and containerisation can solve everyone’s problems now - but this is not true and panellist highlighted the several major themes for improvement, including:

- **Security**: Containers do not provide ‘perfect isolation’, especially compared to that provided by hypervisor. This weakness is very widely understood but not yet properly solved. The panel highlighted that enhanced security is actively being addressed, from using SELinux to encapsulating a container in a VM (or even in VMs in containers - a la Google). The approach is very much ‘combine something we know and trust with containers’ to get the best of both worlds. Notable recent developments included [Project Atomic](http://www.projectatomic.io/) from RedHat, VMWare with [Photon](https://vmware.github.io/photon) and [Lightwave](https://vmware.github.io/lightwave/) and Rancher Labs, another exciting startup in the container space, with [Rancher VM](http://rancher.com/introducing-ranchervm-package-and-run-virtual-machines-as-docker-containers/).
- **Persistence**: Containers are a good fit for stateless applications but as soon as persistence of state is required (i.e. to a database) it soon becomes complicated. Bristol-born [ClusterHQ](https://clusterhq.com/) are leading efforts to introduce container data management services and tools with their open source project [Flocker](https://github.com/ClusterHQ/flocker).
- **Ecosystem maturity**: There are many tools out there in very active development but for many right now it is difficult to choose the right selection for a pure container infrastructure that will have the longer-term development and support necessary for many production systems. This is especially true if starting out from scratch. Container management was highlighted as a key component, for managing containers at any reasonable scale in production. Current open source projects are not quite there yet - e.g. [Kubernetes](http://kubernetes.io/) is not yet 1.0 - but the ecosystem is growing and maturing fast. It was pointed out that smart container schedulers remain a very rare breed however, and this will show up in production systems.

# 2.) What are the biggest benefits of containers?

The panel were pretty unanimous in the benefits of containers, including:

- **Isolation**: Using Linux namespaces, a container has its own isolated environment, including its own file system and processes etc. Added to the fact that containers are lightweight, using a shared kernel, containerisation is attractive for multi-tenancy.
- **Infrastructure resource efficiency**: Containers help to drive improved infrastructure resource efficiency by utilising near-100% of CPU cores and memory with increased server density.
- **Portability**: With common formats (e.g. [Docker](http://www.docker.io/), [appc](https://github.com/appc)) evolving to describe container images, with runtime environments using standard Linux kernel features, it makes it really easy to share and ship software between environments (i.e. laptop to server, cloud to cloud) solving dependency hell and dev/prod parity in one big hit.
- **Ease of use**:  Free and open source Docker tooling has made it easy and accessible to build, run, share and collaborate with containers, especially in existing environments that make good use of devops tools and methodology.

Adoption of containers is growing, but for many it is only to use them in place of virtual machines, missing the many wider benefits it can provide. The general consensus was that containers are a great stepping-stone to ultimately building better software. As they’re so lightweight, it becomes possible to think very differently about software; for example, containers can wrap a process with its own filesystem and spin up and down in an instant. Containers offer the potential to embrace the principles of micro-service architecture and provide the foundations to make software rapidly iterable, and highly scalable and resilient.

# 3.) If I’m just about to invest in container technology right now, should I be thinking about more than Docker?

The panel was split on this, with a couple saying that [rkt](https://github.com/coreos/rkt) from CoreOS would be worth a look, but it is probably not production-ready yet.

There was an argument against looking in-depth at other container technologies initially, asking why you would go with anything else other than the clear market leader Docker, who have a mature and rapidly growing ecosystem.

There was panel consensus that competition is undoubtedly good for the growth and evolution of the market. This will likely lead to other viable container options in the future.

# 4.) Is it worthwhile containerising humongous monolithic legacy applications like Websphere, for example, or should I just leave it where it is?

Another split of opinions on this question with some panel members asking what the point of this would be. Their argument was that you should initially be focusing on improving areas that are ripe for change, not trying to tackle huge, complex beasts that have been in-place for a very long time. The benefits of containers also arguably do not apply.

The audience and other panel members were strongly in favour of tackling these apps, arguing that any improvement is better than nothing and you can still get the benefits of portability and ease of development.

Dave from [Crane](http://www.getcrane.io/) likens the process to going on a diet -

> “I might still look fat, but I’ve lost at least 3 stone in the past year. Splitting Websphere up, and containerising will lose you that 3 stone of ‘fat’ even if it’s not totally obvious to someone looking at you for the first time that benefits have been made.”

There was also audience interest in using containers for archiving legacy applications.

# 5.) Do containers make the prospect of a seamless hybrid cloud a reality?

There was a strong feeling from the audience that you shouldn’t even be trying for private-public hybrid cloud, as it’s too difficult and complex. It’s also arguably a minority case requirement.

Some audience members posited that hybrid public-to-public would be useful, and an agreement that this is an exciting possibility.

The panel said that containers might not directly lead to hybrid clouds in the short-term. But an interesting point made was that just knowing that you can move containers across clouds is appealing to executives and IT leaders, and a benefit in itself - however unlikely it might actually be the case.

Portability is key and this was reiterated by many on the panel and audience.

Notes:

The next **[ Contain ]** event will be the 9th of June and will focus on Container Management. Sign up here.

Jonatan Bjork has also written a blog post on the event, see [here](http://blog.jonatanblue.se/#post0).
