---
title: Canary Analysis for Rolling Updates in DC/OS
date: 2016-11-28
author: Gopinath Rebala (Opsmx), Ravi Yadav (Mesosphere)
category: services
description: Canary analysis for rolling updates in DC/OS
layout: article.jade
collection: posts
lunr: true
---


This post describes how the OpsMx analytics platform, which applies machine learning to CI/CD pipelines, could run on DC/OS to automate canary analysis, which would enable improved rolling app updates. If you are interested in seeing this integration move forward, please reach out to ryadav@mesosphere.com or gopinath@opsmx.com. They would love to hear from you!


## Automated canary analysis for rolling update deployments


Canary analysis is an early warning system for detecting problems with the deployment of a new version of a service or component. Production deployments have used manual canary analysis for a few years now in various forms, be it A/B testing, phased rollout, or incremental rollout.


As more teams adopt continuous deployment, there is an increasing need for automated canary analysis.  Continuous delivery allows for shorter delivery times of large numbers of services and changes to services, but that means that deployment also needs to be faster. Automated analysis can help deployments go faster.


<img src="/assets/images/blog/2016-11-10_opsmx_1.png" alt="OpsMx"/>


Automated canary analysis scores the health of new deployments on the basis of performance, functionality, and quality. In the case of rolling updates, the analysis should also be performed for the cluster as a whole  to confirm the success of the upgrade for the whole application.


## DC/OS rolling updates


DC/OS (the datacenter operating system) makes enterprise apps easy to build, run, and scale. Not only does DC/OS elastically run the modern app, it also runs the services that modern apps rely on: containerized micro services and stateful data services. DC/OS enables application teams to easily scale and sustain a continuous integration and delivery model using common tools like Jenkins, as well as artifact repositories and source control tools.


## Canary analysis for rolling updates


DC/OS supported rolling updates would use health checks of service instances to determine whether a new instance had launched successfully. Currently developers are responsible for manually checking that their services are functionally correct and ready for deployment. They  do this by testing it in staging or by using an integration test. However, production load can cause unexpected performance changes. Developers should also monitor the performance, resource utilization, and functionality of the new or updated services as they are deployed, because short-term resource utilization trends can indicate issues with long term deployments.  Monitoring these metrics manually is too cumbersome for modern deployments.


As the number of services and the velocity of delivery increase, the manual approach to testing new releases becomes insufficient. Canary analysis tests new deployments by running a new instance through a small percent of production traffic (1 to 5%) to  check for functionality, performance and reliability.


Canary analysis generates an aggregated score of the quality of a service. This is useful for


- Deciding whether to continue or roll back the latest deployment.
- Predicting long term resource usage patterns for early warning.
- Observing interactions between services.
- Creating performance scores for diagnostics.
- Deciding if a capacity change is needed for a new service.


Automated canary analysis provides deep insight into resource usage patterns as well as service performance to reduce the risk of downtime, by warning operators before these parameters reach alert conditions. Cluster canary analysis provides insights into the performance of autoscaling groups of services.


Automated canary analysis operates on the data collected from the system and service to analyze resource usage as well as other service context-specific data. The data collected is analyzed for dimension reduction, prioritized for performance impact, and normalized for service load to provide a filtered view of changes in resource usage and performance.


<img src="/assets/images/blog/2016-11-10_opsmx_3.png" alt="OpxMx"/>


## OpsMx canary analysis POC


The OpsMx service/plugin (also referred to as CAS) would be a REST service that listens to DC/OS events and provides additional canary analysis scores and detailed reports. OpsMx automates the process of metrics selection and dimension reduction, and performs automated scoring of the health of the canary.  


OpsMx would integrate with DC/OS monitoring of cluster resource usage and can be augmented with monitoring agents for custom metrics of specific services. OpsMx also provides agents for monitoring common application components like tomcat, nginx, and postgres, and supports integration with third party monitoring solutions.


<img src="/assets/images/blog/2016-11-10_opsmx_2.png" alt="OpsMx"/>


OpsMx can analyze the performance of a rolling update as it is happening, and for a specified period after it is finished. Detailed analysis of the performance and resource usage of a newly deployed service instance provides the following benefits:


- Health checks with long-term resource usage pattern analysis for better rollback decisions.
- Analysis to detect degradations on load-based performance for early warnings.
- Detection of capacity changes between the old and new builds.
- A detailed analytics report of performance groups for diagnostic support.


Rolling updates integrated with OpsMx provide analysis of both cluster performance and service instance performance.


Instance performance analysis compares the first deployed instance of the new version with a baseline version chosen from the currently running instances. The analysis can be configured for amount of time, frequency of analysis, acceptable score range, failure scores, and actions to be taken on certain score ranges.


The following diagram shows a sample scoring screen for a service deployment that may require manual intervention. You can diagnose the groups that need attention with relevancy scores that narrow down the events to debug. Service context will determine the course of action. The service context can be encoded into rules that can applied to future builds for faster analysis and diagnostics.


<img src="/assets/images/blog/2016-11-10_opsmx_4.png" alt="OpsMx"/>


It is easy to perform timeline analysis on the metrics based on metric groups and time ranges/load ranges The following picture shows raw data and quantile graphs for a selected metric.


<img src="/assets/images/blog/2016-11-10_opsmx_5.png" alt="OpsMx"/


## Conclusion


Continuous delivery and deployments at scale and velocity require new techniques to ensure the quality of production deployments. OpsMx-supported canary analysis provides automated scoring based on deep analysis of the service and cluster to help inform promotion and rollback decisions. Visualization of the results of the canary analysis make it easier to diagnose and reach root cause decisions faster. Developers can feed insights from previous deployments back into OpsMx analysis, further its increasing scoring accuracy.
