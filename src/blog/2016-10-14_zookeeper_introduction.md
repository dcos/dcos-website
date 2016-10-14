---
title: Introduction to ZooKeeper
date: 2016-10-14
author: Sunil Shah, Mesosphere
category: components
description: Learn about ZooKeeper, one of the distributed systems that underpins DC/OS.
layout: article.jade
collection: posts
lunr: true
---

A few weeks ago, Patrick Hunt, a committer to the Apache ZooKeeper project and engineer at Cloudera, came to talk to the DC/OS team about ZooKeeper. ZooKeeper is a fundamental component of DC/OS, and a dependency of both Apache Mesos (the distributed kernel that underpins DC/OS) and Marathon (the distributed init.d that is used to run services within DC/OS).

ZooKeeper is used for a number of important tasks in DC/OS, including:

+ Leader election of the Mesos master
+ Leader detection of the Mesos master by masters, agents and scheduler drivers
+ Persisting Marathon state information
+ Coordination between other DC/OS services

In his talk, Patrick introduces ZooKeeper and covers topics including its history, leader election, performance, recipes for success and their roadmap for the future. Check out the full recording below!

<iframe width="100%" height="480" src="https://www.youtube.com/embed/t59z1SeBrc4" frameborder="0" allowfullscreen></iframe>