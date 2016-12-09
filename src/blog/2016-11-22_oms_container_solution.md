---
title: Monitor containers on DC/OS with Operations Management Suite Container Solution
date: 2016-12-08
author: Keiko Harada (Microsoft)
category: universe
description: How to monitor containers with the Operations Management Suite Container solution, on DC/OS.
layout: article.jade
collection: posts
lunr: true
---
# Monitor containers on DC/OS with Microsoft's Operations Management Suite Container Solution

Monitoring Docker containers can be challenging because containers can be created or destroyed at any time. The more containers you have, the more challenging monitoring becomes. Microsoft's [Operations Management Suite (OMS) Container Solution](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-containers) helps users view their container inventory, performance, and logs, and to troubleshoot their containers. OMS Container Solution has been so well-received that Microsoft is making its monitoring capabilities available for DC/OS clusters (regardless of the provider), as part of the Mesosphere Universe.

OMS Container Solution allows users to monitor all their Docker containers through a web interface, providing them with container performance metrics, log analysis, container image inventories, and events.

<img src="/assets/images/blog/2016-12-08-image_1.png" alt="Packages in the DC/OS Universe" />

OMS Container Solution is easy to install on DC/OS. Just choose the "msoms" package from the DC/OS web interface.

<img src="/assets/images/blog/2016-12-08-image_2.png" alt="Packages in the DC/OS Universe" />

When you install msoms, a containerized instance of OMS Agent for Linux gets installed on every private and public agent. This OMS instance scales with your DC/OS environment and sends monitoring data to the OMS Container Solutions web interface.

## OMS Container Solution features

* Centralize and correlate millions of logs from Docker containers at scale using journald
* See real-time information about container status, image, image tag, and affinity
    * Container Lifecycle view, which shows container creation, start, and finish
* Quickly diagnose "noisy neighbor" containers that can cause problems on container hosts
* Retrieve, visualize, and monitor CPU, memory, storage, and network usage with 10-second real-time performance metrics
    * Container Computer and Memory Usage view
* View detailed and secure audit trail of all Docker actions on Container hosts

<img src="/assets/images/blog/2016-12-08-image_3.png" alt="Packages in the DC/OS Universe" />

<img src="/assets/images/blog/2016-12-08-image_4.png" alt="Packages in the DC/OS Universe" />

Microsoft will continue to enhance OMS Container Solution and is open to feedback. For more information, read through the [Container Solution documentation](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-containers) and [Release Notes](https://github.com/Microsoft/OMS-docker/blob/master/ReleaseNote.md).

## How do I try this?

You can use your own Azure subscription or try a [free subscription for Microsoft Azure](https://azure.microsoft.com/en-us/free/), which you can use to set up your DC/OS cluster and OMS workspace with Container Solution. For specific documentation on how to set up OMS Container Solution on DC/OS, see [Using OMS to monitor container applications on ACS DC/OS](https://docs.microsoft.com/en-us/azure/container-service/container-service-monitoring-oms).

## How can I give Microsoft feedback?

There are a few different routes to give feedback:

* **UserVoic**: Post ideas for new OMS features to work on. Visit the [OMS UserVoice page](https://feedback.azure.com/forums/267889-azure-operational-insights).
* **OMS Forums**: Good general discussion of OMS. Visit the [OMS Forums](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=opinsights).
* **Email**: OMScontainers@microsoft.com Tell us whatever is on your mind.
* **Survey**: [Take a survey](https://www.surveymonkey.com/r/6G6RCBG).

Your feedback is important. If you see any features you would like that are not here, please let us know. I invite you to follow me on [Twitter](https://twitter.com/scriptingguys) and the [Microsoft OMS Facebook site](https://www.facebook.com/groups/MicrosoftOMS/). If you want to learn more about Container Solution and OMS, visit the [Hey, Scripting Guy! Blog](http://blogs.technet.com/b/heyscriptingguy/).
