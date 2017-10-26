---
title: Health Checking - A not-so-trivial task in the distributed containerized world
date: 2017-10-23
speaker: Alexander Rukletsov, Mesosphere
eventimage: 2017-10-23_ato_2017_2.jpg
eventlocation: Raleigh, USA
eventname: All Things Open 2017
category: Containers
description: Discussion around challenges and trade-offs when writing health checks on modern distributed systems
layout: event.jade
collection: events
lunr: true
---

# Abstract

## Health Checking: A not-so-trivial task in the distributed containerized world

What people usually understand by "health checks" is a simple sequence: performing a specific action and judging whether the target application is healthy based on the outcome. This simple sequence becomes trickier when the application consists of multiple containers managed by a cluster orchestrator and monitored by third party tooling:

* What entity should interpret the result? Should the reasoning about the health of a task be done locally (less context) or globally (greater overhead)?
* Should health checks be aware of environment-specific intricacies such as namespaces and software defined networks?
* How to keep the overhead imposed by health checks manageable and reasonable?

During the discussion of challenges and trade-offs, Alex will provide an overview of how the modern distributed systems (such as AWS, Apache Mesos, and Kubernetes) tackle the problem of health checking, have a look at alternative solutions and discuss trade-offs. To summarize, Alex will share some practical recommendations based on the experience revamping Apache Mesos’ health checking.

Event link: <a href="https://allthingsopen.org/talk/health-checking-a-not-so-trivial-task-in-the-distributed-containerized-world/">Cloud: Health Checking: A not-so-trivial task in the distributed containerized world</a>
