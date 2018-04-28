---
title: Running Kubernetes on DC/OS
date: 2018-03-13
speaker: Daniel Mennell, Mesosphere
speakerurl: https://twitter.com/dcmennell
eventimage: Montreal.jpg
eventlocation: Montréal, Canada
eventname: Kubernetes and Cloud Native Montréal
category: Kubernetes
description: Lightning talk about running Kubernetes on Mesosphere DC/OS!
layout: event.jade
collection: events
lunr: true
---

# Event description

Nous avons décidé de faire un autre meetup ce trimestre parce que nous avons tellement de super contenu pour vous !

We have so much great content, we decided to add a meetup in Q1! Au plaisir de vous voir ! See you then!

Merci à nos commanditaires pour ce meetup / Thanks to our sponsors for this meetup: Nuance Communications & Microsoft.

NB - en raison de sécurité, juste les gens inscrits ici seront admis.
Please note: for security reasons, only members signed up here will be admitted.

Talk #1: Horizontal Pod Auto scaling (HPA) with custom metrics by Luis Tobon, Senior Software Developer at Nuance Communications

K8s has support for three types of metrics for Pod Autoscaling, the more flexible and powerful one is by using custom metrics. I would like to share our experience by implementing an HPA using custom metrics. More concrete, the following agenda.
1. What Use case will require custom metrics for HPA
2. What do you need to implement Custom Metrics on HPA
3. How we make it work
4. Which issues we faced and how we solved
5. Short demo if time permits

Talk #2 (lightning talk): Handling Meltdown / Spectre in Azure when using K8s by Sylvain Boily, Principal Software/DevOps Engineer at Nuance Communications

The talk will focus on explaining the Fault/Update Domain in Azure when using Availability Sets. How we could make aware K8s' scheduler and how pod anti-affinity/affinity rules can be leveraged to ensure that pods are scheduled on nodes that are on different fd/up combination.

Talk #3 (CANCELLED du to weather! :( ): Where the Helm are your binaries? by Baruch Sadogursky at JFrog Do you always know what’s going on with your product artifacts since the moment they are built by the CI server from Git sources all the way to being deployed by Helm into Kuberenetes?

In this talk, we will show how to build a reliable and transparent pipeline from code to cluster using Git, Artifactory, Docker, Kubernetes, and Helm. We’ll show how you such a pipeline can help you answer the the big questions: What to deploy, What is deployed, and what is this artifact that I am looking for. This kind of transparency is critical for today’s environments, and Kubernetes with Helm shouldn’t be an exception.

Talk #4 (lightning talk): Running Kubernetes on DC/OS by Mark Johnson, Senior Systems Engineer at Mesosphere
This talk will be focused on the of combining the capabilities DC/OS & Kubernetes for container orchestration and application management.

Event Link: [Custom Metric HPA, Managing Helm Chart Repos, Avoiding K8s "Meltdown" in Azure](https://www.meetup.com/Kubernetes-Montreal/events/248313060/)

# Slides

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSMk_jtkCstAV3PYE72dMF2_3sQW5--64TNw45L-4B3A3eD_PWY4FlsTyQ7jXPAQn8IgGUZGPwAsu2a/embed?start=false&loop=false&delayms=3000" frameborder="0" width="640" height="389" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
