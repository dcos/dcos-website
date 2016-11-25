---
title: New DC/OS Packages You Can Use - November 2016
date: 2016-11-28
author: Ravi Yadav, Mesosphere
category: universe
description: New DC/OS packages you can use
layout: article.jade
collection: posts
lunr: true
---

2016 has been a great year for DC/OS. We just celebrated our [6 month anniversary](https://dcos.io/blog/2016/dc-os-our-first-six-months/index.html). Our packager manager, Universe has seen tremendous adoption, and some great contributions from the community and partners. To keep you posted about all the most recent changes, we’re kicking off a series of short blog posts about updates to Universe.

## New Packages

Note that these new packages are currently `EXPERIMENTAL`. There may be bugs, incomplete features, incorrect documentation, or other discrepancies

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-11-03_registry-logo.png" alt="docker Registry Logo"/> **docker Registry** : The docker Registry is a stateless, highly scalable server side application that stores and lets you distribute Docker images. This DC/OS package provides a private registry that can be made available to any other component in the system. [Learn more](https://github.com/dcos/examples/tree/master/1.8/registry).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-11-24_nexus_logo.png" alt="Nexus Logo"/> **Nexus Repository Manager** : Nexus 3 is a repository manager that supports a broad variety of package managers, namely Bower, Docker, Maven 2, npm, NuGet, PyPI, and Raw site repositories. [Learn more](https://github.com/dcos/examples/tree/master/1.8/nexus).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-11-24_scale_logo.png" alt="Scale Logo"/> **Scale** : Scale enables on-demand, near real-time, automated processing of large datasets (satellite, medical, audio, video) using a dynamic bank of algorithms. [Learn more](https://github.com/dcos/examples/tree/master/1.8/scale).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-11-24_bookkeeper_logo.png" alt="docker Bookkeeper Logo"/> **Apache Bookkeeper** : Bookkeeper is a replicated log service which can be used to build replicated state machines. A log contains a sequence of events which can be applied to a state machine. [Learn more](https://github.com/dcos/examples/tree/master/1.8/bookkeeper).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-11-24_koding_logo.png" alt="Koding Logo"/> **Koding**: is a web based collaborative software development tool. Through the use of stacks, you can define server environments which include all of the necessary software for you to develop your code. [Learn more](https://github.com/dcos/examples/tree/master/1.8/koding).
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-11-24_cadvisor-logo.png" alt="cAdvisor Logo"/> **cAdvisor** (Container Advisor): cAdvisor provides container users an understanding of the resource usage and performance characteristics of their running containers. It is a running daemon that collects, aggregates, processes, and exports information about running containers.
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-11-24_influxdb-logo.png" alt="InfluxDB Logo"/> **InfluxDB**: is an open source time series database with no external dependencies. It's useful for recording metrics, events, and performing analytics.
<br/><br/>

<img style="float: left;margin-right: 27px;margin-top: 4px;" width="90" height="90" src="/assets/images/blog/2016-11-24_grafana-logo.png" alt="Grafana Logo"/> **Grafana**: is an open source application for visualizing large-scale measurement data. It provides a powerful and elegant way to create, share, and explore data and dashboards from your disparate metric databases. [Learn more](https://github.com/dcos/examples/tree/master/1.8/cadvisor-influxdb-grafana) about cAdvisor, InfluxDB and Grafana.
<br/><br/>

## Updates to existing packages

- [Jenkins](https://github.com/mesosphere/universe/pull/809) package is upgraded to version 2.19.3 LTS.
- [ArangoDB](https://github.com/mesosphere/universe/pull/837) package is upgraded to version 3.1.x. [Learn more](https://github.com/dcos/examples/tree/master/1.8/arangodb).
- [Cassandra](https://github.com/mesosphere/universe/pull/839) is updated to use DC/OS Cassandra 1.0.19-3.0.9 release. [Learn more](https://github.com/mesosphere/dcos-cassandra-service/releases) about the changes.
- [Spark](https://github.com/mesosphere/universe/pull/836) is updated to use DC/OS Spark service 1.0.6-2.0.2 release.
- [Confluent Kafka](https://github.com/mesosphere/universe/pull/795) is updated to use dcos-kafka-service 1.1.16 release.
- [GitLab](https://github.com/mesosphere/universe/pull/781) package upgraded to version 8.1.13. This update brings improved root_squash support in the case of users setting up NFS on the hostmounts.
- [Linkerd](https://github.com/mesosphere/universe/pull/763) package is updated to support app groups. [Learn more about linkerd](http://bit.ly/2dLhnkg).
- [MariaDB](https://github.com/mesosphere/universe/pull/732) package updated to the latest version to fix some OpenSSL issues.
- [Nginx](https://github.com/mesosphere/universe/pull/733) package updated to the latest version to fix some OpenSSL issues.
- [Netsil](https://github.com/mesosphere/universe/pull/727) 1.0 is now available in Universe. See what's new in the [1.0 release](https://github.com/netsil/docs/blob/master/docs/release-notes.md#100---09252016).
- Added external volume support to [MongoDB](https://github.com/mesosphere/universe/pull/767), [MySQL](https://github.com/mesosphere/universe/pull/768), [OpenLDAP](https://github.com/mesosphere/universe/pull/770) and [Postgresql](https://github.com/mesosphere/universe/pull/769) packages.
- [Vamp](https://github.com/mesosphere/universe/pull/804) package is updated to 0.9.1 version which also updates the REST API port to HTTP API port.
<br/><br/>

Try [DC/OS](https://dcos.io/get-started/)

Contribute your package to Universe on [GitHub](https://github.com/mesosphere/universe). Get more involved in the future of our packaging format by joining the [Working Group](www.google.com) for packaging.

Engage with the DC/OS community on [Slack](http://chat.dcos.io/) or our mailing list.
