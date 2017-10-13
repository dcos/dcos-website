---
title: No One Puts Java in a Container
date: 2017-09-26
speaker: Gastón Kleiman, Mesosphere
speakerurl: https://twitter.com/kleimang
eventimage: 2017-09-26_sysdig_ccwfs.jpg
eventlocation: San Francisco, USA
eventname: Sysdig CCWFS
category: Containers
description: Considerations when working to use Java inside of a container-based infrastructure
layout: event.jade
collection: events
lunr: true
---

# Abstract

The current craze of Docker has everyone sticking their processes inside a container… but do you really understand cgroups and how they work? Do you understand the difference between CPU Sets and CPU Shares? Spark is a Scala application that lives inside a Java Runtime, do you understand the consequence of what impact the cgroup constraints have on the JRE? This talk starts with a deep understand of Java’s memory management and GC characteristics and how JRE characteristics change based on core count. We will continue the talk looking at containers and how resource isolation works. The session will detail specifically the difference between CPU sets and CPU shares and memory management. The session will close with a deep understanding of the consequences of running the JRE in a CPU share environment and the potential for pseudo-random behavior of running in a heterogeneous datacenter.

# Media
## Slides

<iframe src="https://docs.google.com/presentation/d/1nrQcrOPQyV353Ri2dv56X8P3pMVt_lp8UmbNFKyr64U/embed?start=false&loop=false&delayms=3000" frameborder="0" width="640" height="389" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
