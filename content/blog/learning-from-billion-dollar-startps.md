+++
title = "Learning From Billion Dollar Startups"
date = "2015-04-20T22:00:00+01:00"
Tags = ["Jetstack", "Introduction"]
Categories = ["Jetstack"]
author = "Matt Barker"
thumbnail = "/authors/matt-barker.jpg"
socialsharing = true
image = "/blog/learning-from-billion-dollar-startps/cover.png"
+++

If you’ve not seen the Wall Street Journal's [Billion Dollar Startup Club](http://graphics.wsj.com/billion-dollar-club/), this article tracks venture-backed private companies valued at $1 billion or more.
I thought I would take a look into their technology stacks to see what I could learn.
The companies I have chosen to explore aren’t based on any categorisation, they are just highly visible companies that I thought most people would recognise.
Obviously these companies are different to your average company, but they are fast-growing, innovative, and perhaps give us a glimpse into the future of computing.

<!--more-->

The ones I looked at are:

Uber, Snapchat, Pinterest, AirBnB, Square, Slack, Spotify.

Some of the lessons I draw are as follows:

# 1.) They Are Built In Public Cloud:

Amongst these Startups, 5 of the 7 use Public Cloud environments for their infrastructure. Amazon cloud is the number one choice with four of those five using AWS.

Public cloud allows these companies to act Global from day one, and have obviously helped them them to grow quickly.

Two exceptions are Square and Uber who run physical infrastructure in hosted environments.  The best reasons I can find for this are down to cost and security. But this has been at the cost of a visible outage for Uber:

{{< tweet 438509832795353088 >}}

<br/>

I think we will see more variety in the environments used by billion dollar start-ups as the other public cloud players catch up with Amazon’s capability and price.

# 2.) Platform Plays Are Developing

I was interested to read that Snapchat use the full Google App stack. According to their CTO, it’s because it was easy to get up and running, and they wanted to get a minimum viable product into the hands of users quickly.

{{< youtube 17PtS1Qx8kU >}}

<br/>

The other closest full-stack deployment is AirBnB who use Amazon end-to-end. The reasoning for this was “the ease of managing and customizing the stack”.

Platform deployments seems to be down to ease of use, and I can see Google pushing their Cloud to corporates who have already migrated to Google Apps.

My personal worry would be that companies buying into platforms will trade short-term efficiencies with possible lock-in and inflexibility later down the line.

# 3.) Javascript

JavaScript seems to be regularly built in to every level of the stack. This gives consistency between the front and back end, and assists in the ease of developing on the ‘full stack’.

Technically, a consistent language also reduces the chance of something going wrong, and greater ease in securing and updating the stack.

# 4.) Use Of Open Source Software

There are no companies using a proprietary stack. Open development allows quick start-up time and rapid development and flexibility. It also reduces the up-front costs involved in purchasing proprietary software.

I have seen some good moves from Microsoft in allowing open source software in Azure, so it might only be a matter of time before we see a Billion Dollar startup in Azure.

Azure is also good for Windows shops as they tap into public cloud environments so there will likely be plenty of Billion dollar companies running in Azure, even if they are not a classed as a ‘start-up’.

# 5.) Variety Of Data Stores

Most of the organisations run a variety of databases and ‘big data’ software alongside the traditional relational Database. These include:

- NoSQL
- key/value store
- Hadoop

It seems to be the new norm to pick a data store to fit the use-case inside the organisation. The argument I used to hear of ‘increased complexity and overhead’ doesn’t seem to be stopping these guys from going ahead with polyglot data stores.

# Conclusion

Reading about the stacks of Billion Dollar Start Ups reminded me that it’s often ease of deployment that leads to technology adoption and traction, not necessarily the most feature rich technology.

The VHS / Betamax story is one that is played again and again in business schools around the world and is almost now considered a cliche. However, it’s a story that any new software vendor should definitely pay heed to.

*This isn’t a rigorous or scientific investigation, and I can’t confirm the accuracy of the information or how up-to date it is. Most of the data I got was from http://stackshare.io/, Quora, and presentations given at public conferences. The details of the stacks used can be seen below:*

# Stack Details:

## Uber:

- Data Layer: MongoDB / Redis / MySQL
- Languages: Java, Python, Objective-C
- Framework: Node.js, Backbone.js
- Cloud: Physical Hosted Servers

## Snapchat:

- Google App Engine
- Cloud: Google

## Pinterest:

- Data Layer: Memcached, MySQL, MongoDB, Redis, Cassandra, Hadoop, Qubole
- Languages: Python, Objective-C
- Framework: Node.js, Backbone.js
- Cloud: Amazon Web Services

## AirBnB:

- Data Store: AmazonRDS, Amazon Elasticache, AmazonEBS, PrestoDB/AirPal, Languages: Ruby
- Framework: Rails
- Cloud: Amazon Web Services

## Square:

- Data Store: PostgreSQL, MySQL, Hadoop, Redis 
- Languages: Ruby, Java
- Framework: Rails, Ember.js
- Cloud: On-Prem datacentre

## Slack:

- Data Store: MySQL
- Languages: JavaScript, Java, PHP, Objective C
- Framework: Android SDK
- Cloud: Amazon Web Services

## Spotify:

- Data Store: PostgreSQL, Cassandra, Hadoop,
- Languages: Python, Java,
- Framework: Android SDK
- Cloud: Amazon Web Services
