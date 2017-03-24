+++
title = "Introducing Jetstack"
date = "2015-03-17T22:00:00+01:00"
Tags = ["Jetstack", "Introduction"]
Categories = ["Jetstack"]
author = "Matt Barker"
thumbnail = "/authors/matt-barker.jpg"
image = "/blog/introducing-jetstack/cover.png"
socialsharing = true
+++


I made the cut as a millennial by one year. The rate of technological change I have witnessed over the years is amazing. I’ve seen the birth of the web, the first mobile phones in the playground, and the flurry of excitement as the university computing lab is introduced to ‘thefacebook’.

<!--more-->

When I imagine the next twenty years of technology, I see three big drivers:

# 1.) Open Development

Thanks in part to my early career, open source is part of my dna. Even 5 years ago it was beyond belief that Microsoft would open source .NET

Proprietary software will always have its place, but open software is taking over as the primary delivery method, mainly because it enables rapid adoption, facilitates innovation, and allows software to evolve naturally.

# 2.) Compute as a Commodity

When you buy electricity to power your home, there is no interaction with the service other than a monthly bill from your energy supplier. With the move towards platform services in the cloud, compute is rapidly going the same way.

You might ask whether you should use ‘private clouds, or hybrid clouds’? And yes, there will be a short-term need for them. But running and maintaining on-premise generators will never be able to compete with the pricing and scale of the national grid. As Simon Wardley points out, the hybrid cloud you should be aiming for is **public - public**, not **private - public**.

Just as ubiquitous access to electricity in the early 1900s enabled an explosion of innovation in the appliance space, ubiquitous availability of compute will do the same for the application.

# 3.) Data Growth

“There were 5 exabytes of information created between the dawn of civilization through 2003, but that much information is now created every 2 days.” – Eric Schmidt, Google, 2010

Software like Hadoop and NoSQL have given us a brilliant way to store and process data of this magnitude. Trends like ‘the internet of things’ will contribute to the exponential growth of information and fuel further adoption of these products. As we gain access to more data, the processing power needed to gain relevant insights from it will become more precious and important.

# Introducing Containers

Back when I was talking to customers about Ubuntu, they loved the concept of a cut-down version of the operating system servicing lightweight applications. What we built was similar to a rudimentary microservices architecture. This was good in theory, but in practice it took a lot of effort.

As soon as I saw the container world developing I started to get excited. Why? Because Containerisation allows you to deliver this architecture more easily, **and** take advantage of the trends described above. This is achieved in the following ways:

**Containers improve density.** Because containers are light-weight you can run more on a platform than you can virtual machines. This gives you more effective use of compute resource when storing and processing data.

**Containers speed delivery to production.** Ever put an application into test only for it to break? Containers are free of dependencies and allow you to deploy the same image in production as you did in development. That means less time spent fixing code.

**Containers make your application portable.** Dependency freedom now means portability. Not getting a good deal from one cloud provider? Quickly and easily move it to another and reap the rewards straight away.

**Containers improve development practice.** Less time spinning up VMs, and arguing about whether ‘it worked on my laptop’ means more time for what actually matters - the application you are building for your customers  and the value it brings to them.

# Jetstack

Jetstack was founded to take advantage of container technology, and free you up to work on your application. We do this by:

- containerising your application
- moving it to the cloud (private or public)
- managing the infrastructure

Although we will be packaging the best of breed technology needed to build this platform, delivering the tools themselves isn’t the goal.

What we want to do is allow you to focus on what really matters - the value you provide to your end users.

# Where to go Next?

If you’d like to find out more about how and why you should use containers, we’ve created an independent Meetup group called Contain you can join [here](http://www.meetup.com/contain/).

If you want to get in touch directly, email me here: matt@jetstack.io
