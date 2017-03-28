+++
title = "Kubernetes: Are you Ready to Manage your Infrastructure like Google?"
date = "2015-06-19T22:00:00+01:00"
Description = "Kubernetes: Are you Ready to Manage your Infrastructure like Google?"
Tags = ["Kubernetes", "Docker", "Introduction"]
Categories = ["Kubernetes", "Getting Started"]
authortwitter = "mattbates25"
author = "Matt Bates"
thumbnail = "/authors/matt-bates.jpg"
socialsharing = true
image = "/blog/k8s-getting-started-part1/cover.jpg"
+++

*Google’s Kubernetes open source project for container management has just recently celebrated its first birthday. In its first year, it has attracted massive community and enterprise interest. The numbers speak for themselves: almost 400 contributors from across industry; over 8000 stars and 12000+ commits on Github. And many will have heard it mentioned in almost every other conversation at recent container meetups and industry conferences – no doubt with various different pronunciations!*

<!--more-->

In a series of blog posts in the run-up to the eagerly anticipated 1.0 release of [Kubernetes](http://www.kubernetes.io) this summer, container specialists [Jetstack](http://www.jetstack.io) will be taking a close look at how it works and how to get started, featuring insight based on our experiences to date. Future posts will walk through deployment of a modern-stack micro-service application on Kubernetes locally and in the cloud. We’ll be using a variety of technology along the way, including [Weave](https://weave.works), [Flocker](https://www.clusterhq.com) and [MongoDB](https://www.mongodb.com).

{{<img src="/images/logo.png" alt="Jetstack Logo" class="pure-img center" >}}

Over a month ago, Google lifted the lid on its internal [Borg](http://research.google.com/pubs/pub43438.html) system in a research paper. This once-secret sauce runs Google’s entire infrastructure, managing vast server clusters across the globe – a crown jewel that until not long ago was never mentioned, even as a secret code name.

Unlike previous Google papers, such as Map-Reduce, Google went one step further and kicked off an open source implementation of the container management system in advance of the paper. Although Kubernetes is not strictly a straight, like-for-like implementation, it is heavily inspired by Borg and its predecessor. Importantly, it implements lessons learned in using these systems at massive scale in production.

Arguably, Kubernetes is even better than Borg – and it’s free and available to us all. Pretty awesome, right?

{{<img src="/images/k8s/container-ship.jpg" alt="Container Ship" class="pure-img center" >}}

# An Important Piece in the Container Production Puzzle

Containerising a single application, running it elsewhere and then collaborating with others is relatively straightforward, and this is testament to the great, albeit imperfect, Docker toolset and image format. It’s a wild success for good reason.

But today’s applications are increasingly complex software systems with many moving parts. They need to be deployed and updated at a rapid pace to keep up with our ability to iterate and innovate. With lots of containers, it soon becomes hard work to coordinate and deploy the sprawl, and importantly, keep them running in production.

Just consider a simple web application deployed using containers. There will be a web server (or many), a reverse proxy, load balancers and backend datastore – already a handful of containers to deploy and manage. And as we now head into a world of micro services, this web application might feasibly be further decomposed into many loosely coupled services. These might use dedicated and perhaps different datastores, and will be developed and managed entirely by separate teams in the organisation. Let’s not forget that each of these containers will also require replicas for scale-out and high availability. This means 10s of containers and this is just in the case of a simple web app.

It’s not just the number of containers that becomes challenging: services may need to be deployed together, to certain regions and zones for availability. These services need to understand how to find each other in this containerised world.

{{<img src="/images/k8s/logo-small.png" alt="Kubernetes Log" class="pure-img center" >}}

# Enter Kubernetes

The underlying container technology to Docker has actually been baked into the Linux Kernel for some time. It is these capabilities that Google have used in Borg for over a decade, helping them to innovate rapidly and develop some of the Internet’s best-loved services. At an estimated cost of $200M per data centre, squeezing every last drop of performance is a big incentive for Google and its balance sheet.

Lightweight and rapid to start and stop, containers are used for everything at Google – literally everything and that includes VMs. Google report that they start a colossal two billion containers every week, everything from GMail to Maps, AppEngine to Docs.


# Think Applications not Servers

Kubernetes has elegant abstractions that enable developers to think about applications as services, rather than the nuts and bolts of individual containers on ‘Pet’ servers – specific servers, specific IPs and hostnames.

Pods, replication controllers and services are the fundamental units of Kubernetes used to describe the desired state of a system – including, for example, the number of instances of an application, the container images to deploy and the services to expose. In the next blog, we’ll dig into the detail of these concepts and see them in action.

Kubernetes handles the deployment, according to the rules, and goes a step further by pro-actively monitoring, scaling, and auto-healing these services in order to maintain this desired state. In effect, Kubernetes herds the server ‘Cattle’ and chooses appropriate resources from a cluster to schedule and expose services, including with IPs and DNS – automatically and transparently.

One of the great benefits of Kubernetes is a whole lot less deployment complexity. As it is application-centric, the configuration is simple to grasp and use by developers and ops alike. The friction to rapidly deploy services is diminished. And with smart scheduling, these services can be positioned in the right place at the right time to maximise cluster resource efficiency.

{{<img src="/images/k8s/overview.png" alt="Kubernetes Overview" class="pure-img center" >}}

# Google Infrastructure for All

Kubernetes isn’t just for the Google cloud. It runs almost everywhere. Google of course supports Kubernetes on their cloud platform, on top of GCE (Google Compute Engine) with VMs but also with a more dedicated, hosted Kubernetes-as-Service called GKE (Google Container Engine). Written in Go and completely open source, Kubernetes can also be deployed in public or private cloud, on VMs or bare metal.

Kubernetes offers a real promise of cloud-native portability. Kubernetes configuration artefacts that describe services and all its components, can be moved from cloud to cloud with ease. Applications are packaged as container images based on Docker (and more recently Rkt). This openness means no lock-in and a complete flexibility to move services and workloads, for reasons of performance, cost efficiency and more.

Kubernetes is an exciting project that brings Google’s infrastructure technology to us all. It changes the way we think about modern application stack deployment, management and monitoring and has the potential to bring huge efficiencies to resource utilization and portability in cloud environments, as well as lower the friction to innovate.

Stay tuned for the [next part]({{< relref "blog/k8s-getting-started-part2.md">}}) where we’ll be detailing Kubernetes core concepts and putting them to practice with a local deployment of a simple web application.

To keep up-to-date and find out more, comment or feedback, please follow us [@JetstackHQ](https://www.twitter.com/JetstackHQ).
