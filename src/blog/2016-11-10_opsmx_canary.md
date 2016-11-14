---
title: Canary analysis for rolling updates in DC/OS
date: 2016-11-10
author: Gopinath Rebala (Opsmx), Judith Malnick (Mesosphere), Ravi Yadav (Mesosphere)
category: services
description: Canary analysis for rolling updates in DC/OS
layout: article.jade
collection: posts
lunr: true
---

This post describes how OpsMx (who is applying machine learning to CI/CD pipelines) and DC/OS could hypothetically run together to allow for automated canary analysis, which would enable improved rolling app updates. If you are interested in seeing this integration move forward, please reach out to ryadav@mesosphere.com or gopinath@opsmx.com. They would love to hear from you! 

## Automated Canary Analysis for rolling update deployments 
Canary analysis is an early warning system for detecting problems in production with deployment of new version of service or component. Production deployments used manual canary analysis for few years now in various forms, be it A/B testing, phased rollout or incremental rollout that can be within the same data center or geographically distributed availability zones. As more teams adopt continuous deployment, there is an increasing need for automated canary analysis that integrates well into their deployment pipelines.


As the number of services deployed increase, the rate of change for new features delivered by the services also increase. Shorter delivery times with large number of services and changes to services, there is a significant need for automated analysis for deployment of new services in production. Adopting cloud native architecture paradigms support automated deployment based on business needs enhanced by applying canary analysis based automated delivery mechanisms. 
<img src="/assets/images/blog/2016-11-10_opsmx_1.png" alt="OpsMx"/>

Automated canary analysis supports scoring for the health of the new deployments for performance, functionality and quality of the new service build. In the case of rolling updates, the analysis should also be performed for the cluster as a whole along with the new build instance to provide confidence on the upgrade process for the whole application. 
DC/OS Rolling Updates

Mesosphere makes modern enterprise apps easy to build, run, and scale with DC/OS - a datacenter-scale platform that elastically runs the full modern app: containerized microservices and stateful data services. DC/OS enables application teams to easily scale and sustain a continuous integration and delivery model using common tools like Jenkins as well as artifact repositories, and source control tools. With DC/OS, rolling updates reduce downtime in rolling out new versions in production with a flexible rollout policies. 

## Canary analysis for rolling updates
DC/OS rolling updates use health checks of service instance to determine the successful launch of new instance. Generally, service is responsible for the checks to be performed for service readiness. Assumption here is that the code that is tested in staging or integration test is functionally correct and testing for availability in production provides the confidence in the new deployment. However, there exists risk of performance changes and functional quality with production load. Short term resource utilization trends can indicate issues with long term deployments. Developers are responsible to validate the performance, resource utilization, and functional issues by manually analyzing the metrics from production to validate deployment.     



As the number of services increase and the velocity of delivery increases, the manual approach will not be sufficient to maintain confidence in the new releases. Canary analysis provides confidence by running new instance through small percent of production traffic (1 to 5%) and check for functional, performance and reliability aspects of the new system. 


Quality score generated from canary analysis represents aggregated score of service in multiple dimensions.  This is useful for 
- Decision to continue or rollback the latest deployed build
- Predicting long term resource usage patterns for early warning
- Observing interactions with various services that are interacting with new build rollout   
- Performance scores for supporting diagnostics 
- Capacity changes for the new service being installed


Automated canary analysis provides deep insight into resource usage patterns as well as service performance to score against a baseline performance to reduce the risk of downtime. Cluster canary analysis provides insights into performance of auto scaling group. Automating this level of analysis requires requires service context specific analysis and improved by application context by analyzing application topology.


Automated canary analysis works on the data collected from the system and service to analyze resource usage as well as the service context specific data. Data collected is analyzed for dimension reduction, priority for performance impact, normalized behavior for service load etc to provide a filtered view of changes in resource usage and performance. 

<img src="/assets/images/blog/2016-11-10_opsmx_3.png" alt="OpxMx"/>


## OpsMx Canary analysis POC
OpsMx service is provided as a REST service that can be used as a hosted service or deployed along with DC/OS. OpsMx service/plugin (also referred to as CAS) is a REST service that listens to DC/OS events and provides additional canary analysis scores and detailed reports. OpsMx automates the process of metrics selection, dimension reduction and performs automated scoring of the health of the canary.  


OpsMx integrates with DC/OS monitoring for the cluster resource usage and can be augmented with service monitoring agents for custom metrics generated by services. OpsMx also provides agents for monitoring common application components like tomcat, nginx, postgres, etc. and  also supports integrating with third party monitoring solutions.
<img src="/assets/images/blog/2016-11-10_opsmx_2.png" alt="OpsMx"/>




As the rolling update is being performed, OpsMx can be configured to analyze performance for a specified period after the deployment. Detailed analysis of the performance of service instance along with the resource usage provides the following benefits


- health checks with long term resource usage patterns analysis for better rollback decision
- analysis to detect degradations on load based performance for early warnings
- capacity changes of new build when replacing an existing version
- detailed analytics report for performance groups for diagnostic support


Application rolling updates integrated with OpsMx provides analysis for both Cluster performance and service Instance performance.


Instance performance analysis will evaluate first deployed instance of the new version with the baseline version chosen from the currently running instances. The analysis can be configured for amount of time, frequency of analysis, acceptable score range, failure scores, actions to be taken on certain score ranges etc.


The following diagram shows a sample scoring screen for a new build of service that shows scoring that may require manual intervention for promotion to full deploy. One can diagnose the groups that need attention with relevancy scores that narrow down the events to debug. Service context will determine the course of action. The service context can be encoded into rules that can applied to future builds for faster analysis and diagnostics. 
<img src="/assets/images/blog/2016-11-10_opsmx_4.png" alt="OpsMx"/>






Support for timeline analysis for the metrics based on metric groups and time ranges/load ranges are easy to use. The following picture shows raw data and quantile graphs for selected metric to drill down further.
<img src="/assets/images/blog/2016-11-10_opsmx_5.png" alt="OpsMx"/>

## Conclusion


Continuous Delivery and Deployments at scale and velocity require new techniques to ensure quality of production deployments. OpsMx supported canary analysis provides automated scoring based on deep analysis of service and cluster to help in promotion and rollback decisions in production. The visualization of analysis provides easier way to diagnose and reach root cause decisions faster. Rules coded in during the process enhance future canary analysis to help build in service context to reflect the application deployments. 




