---
title: SMACK stack and beyond
date: 2017-09-13
speaker: Jörg Schad, Mesosphere
speakerurl: https://twitter.com/joerg_schad
eventimage: Los_Angeles_3.jpg
eventlocation: Los Angeles, USA
eventname: Open Source Summit North America
category: SMACK
description: 
layout: event.jade
collection: events
lunr: true
---

Our world seems to move faster and faster and so are our requirements for data analytics. For many use cases such as fraud detection or reacting on sensor data the response times of traditional batch processing are simply to slow. In order to be able to react to such events close to real-time, we need to beyond the classical batch processing and utilize stream processing systems such as Apache Spark Streaming, Apache Flink, or Apache Storm.

But these systems are not sufficient by itself. For an efficient and fault-tolerant setup we also need to a message queue and storage system. One common example for such fast data pipelines is the SMACK stack which stands for

- Spark (Streaming) - the stream processing system
- Mesos - the cluster orchestrator
- Akka - the system for providing custom actors for reacting upon the analyses 
- Cassandra - storage system
- Kafka - message queue

Setting up such pipeline in a scalable, efficient and fault-tolerant manner is not trivial.

This talk will first discuss several alternatives for the various parts in the stack, e.g., what are the tradeoffs between Spark Streaming and Apache Flink; when should I use ArangoDB or Apache Cassandra.

We will then discuss the challenges and best practices for setting up such pipelines in order.

The talk will finish with a demo of a fast data pipelines with Apache Flink, ArangoDB, and Apache Kafka deployed on DC/OS.

Event link: <a href="https://ossna2017.sched.com/event/BDqG/smack-stack-and-beyond-building-fast-data-pipelines-jorg-schad-matt-jarvis-mesosphere">SMACK Stack and Beyond - Building Fast Data Pipelines - Jörg Schad & Matt Jarvis, Mesosphere</a>
