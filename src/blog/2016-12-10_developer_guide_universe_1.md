---
title: A Developer’s Guide to the Universe
date: 2016-12-10
author: Ravi Yadav (Mesosphere), Jörg Schad (Mesosphere)
category: universe
description: A Developer’s Guide to the Universe
layout: article.jade
collection: posts
lunr: true
---

The [Universe](https://github.com/mesosphere/universe) is a DC/OS package repository that contains services like Spark, Cassandra, Jenkins, and many others. It allows users to install these services with a single click from the DC/OS UI or by a simple `dcos package install package_name` command from the [DC/OS CLI](https://dcos.io/docs/1.8/usage/cli). Many community members have already submitted their own packages to the Universe, and we encourage anyone interested to get involved with package development! It is a great way of contributing to the DC/OS ecosystem and allows users to easily get started with your favorite package. This blog series will provide details on doing so. Pack your [towel](https://en.wikipedia.org/wiki/Technology_in_The_Hitchhiker%27s_Guide_to_the_Galaxy#Towels) and let’s get started!

# Series Overview

<div style="padding: 25px 50px; color: #666; background-color: #f5f5f5; font-style:italic;  margin: 0 0 30px 0;">

  <p>A [single book](https://en.wikipedia.org/wiki/The_Hitchhiker's_Guide_to_the_Galaxy) could never cover all the aspects of the Universe (let alone a single blog post) so we decided to divide the content into a series of posts (watch here for the following parts):</p> <br>

  <ul>
    <li>In this first part, [**_“A Developer’s Guide to the Universe”_**](/blog/2016/a-developer-s-guide-to-the-universe/index.html) we will develop a simple package that deploys just one container and make it available via a local Universe in our DC/OS cluster.</li>


    <li>In the second part, **_“Add Another Thing...”_**, we will explore a more complex multi container service and show how we can utilize DC/OS features for connecting these containers. We will also discuss what it takes to contribute a package to the official Universe.</li>


    <li>In the third part, **_“Frameworks, the Universe and Everything Else”_** we will take a look at the Mesos concept of a 2-level scheduler, which allows us to encode logic beyond a simple container for our services. As part of this, we will develop a simple stateless Mesos framework.</li>


    <li>The fourth part, **_“Stateful, and Thanks for the SDK”_** will enter the complex world of stateful services and explore the DC/OS SDK, which relieves us of much of the complexity involved in writing frameworks.</li>


    <li>The fifth part, **_“Well, it works but wouldn’t it be better if… (mostly testing)”_** will explore different options for testing your service.</li>


    <li>The sixth part, **_“The CLI at the End of the Universe”_** will demonstrate how to add a custom CLI for your package.</li>
  </ul>
</div>


# Table of Contents:

- [Warning and Prerequisites](#warning-and-prerequisites)
- [First Package](#first-package)
- [Clone the universe](#clone-the-universe)
- Create the universe package
  - [Folder structure](#create-the-folder-structure)
  - [`marathon.json.mustache` and `config.json`](#create-the-marathon.json.mustache-and-config.json)
  - [`resources.json`](#resourcesjson)
  - [`package.json`](#packagejson)
  - [Webui](#adding-webui)
- [Build and deploy a local Universe Server](#build-and-deploy-a-local-universe-server)
  - [Validate and build the Universe](#validate-and-build-the-universe)
  - [Build the Universe server Docker image](#build-the-universe-server-docker-image)
    - [Deploy the universe server on your cluster](#deploy-the-universe-server-on-your-cluster)
    - [Install Neo4j package](#install-neo4j-package)
    - [Pitfalls with Neo4j Dashboard](#pitfalls-with-neo4j-dashboard)
- [So Long, and Thanks for All the Introduction](#so-long-and-thanks-for-all-the-introduction)

# Warning and Prerequisites
*Note*: This being your first package, we’re keeping things simple and developing a service being backed by a single container which is not meant for production usage!


In order to get started you should have:
- A running DC/OS 1.8+ cluster.
- [DC/OS CLI](https://dcos.io/docs/1.8/usage/cli/install/) installed and configured.
- Your [towel](https://en.wikipedia.org/wiki/Technology_in_The_Hitchhiker%27s_Guide_to_the_Galaxy#Towels) close by.

## First Package

Arthur currently uses a graph database to map out all the places he has visited in the universe. He has deployed a single [Neo4j](https://neo4j.com) container on his interstellar DC/OS cluster with

```
dcos marathon app add https://raw.githubusercontent.com/joerg84/developers-guide-to-the-universe/master/neo4j-app.json
```

The challenges of such cross-galaxy DC/OS clusters will be discussed in a future blog post.

After seeing this, all his friends want to use the same database. In order to allow them to install Neo4J with a single click, Arthur decides to make it available in the [Universe package repository](https://github.com/joerg84/universe/tree/neo4j-demo/repo/packages/N/neo4j_tutorial/). This repo can also be used if you don’t want to create all the files by yourself and want to jump to the deploy step directly.


## Clone the universe

To work with the universe it is helpful to have a copy available . You can fork and then clone the github repository here https://github.com/mesosphere/universe.

## Create the folder structure

Looking at the package folder structure below, we see that the package structure is actually quite simple.

<img style="margin-left: 87px;" width="450" height="210" src="/assets/images/blog/2016-12-10_universe_folder_structure.png" alt="package structure"/>

Each package has a its own folder (inside the subfolder with the first letter of the package name). As each package can have multiple versions, each version has a numbered subfolder. For example the files for the first version of Arthur’s neo4j package would be located in: [repo/packages/N/neo4j/0](https://github.com/joerg84/universe/tree/neo4j-demo/repo/packages/N/neo4j_tutorial/0).

### Create the marathon.json.mustache and config.json

We need a total of four different files in the directory, but let us start by creating the [marathon.json.mustache](https://github.com/joerg84/universe/blob/neo4j-demo/repo/packages/N/neo4j_tutorial/0/marathon.json.mustache) and [config.json](https://github.com/joerg84/universe/blob/neo4j-demo/repo/packages/N/neo4j_tutorial/0/config.json) files.

The two key parts of a Universe package are a templated Marathon app definition in a file called `marathon.json.mustache`, and the parameters used to render this template in a `config.json`. These parameters can be altered by DC/OS users at install time via the UI (using ”Advanced Install”) or CLI.

The purpose of `marathon.json.mustache` is to ultimately create a `marathon.json`. It uses the [Mustache](http://mustache.github.io/) templating language to configure options. These configurations come out of resources used in `resources.json` and options specified in `config.json` file.

Let us have a look at Arthur’s original [app definition](https://raw.githubusercontent.com/joerg84/developers-guide-to-the-universe/master/neo4j-app.json) and identify potential settings which are likely to vary between different instances. The following settings are probably good candidates for parameters:

- `id`: the id needs to be unique, making it configurable allows users to install multiple instances of the app on the same cluster.
- `cpu` and `mem`: making resource parameters like CPU shares and memory allocation configurable allows users to change these at install time depending on their needs.

After adding these template parameters, our modified marathon app definition starts as follows:

~~~
"id": "{{service.name}}",

"instances": 1,

"cpus": {{neo4j.cpus}},

"mem": {{neo4j.mem}},
~~~

The corresponding [config.json]() specifies these template parameters in the following way:
~~~
{
  "type": "object",
  "properties": {
    "service": {
      "type": "object",
      "description": "DC/OS service configuration properties",
      "properties": {
        "name": {
          "description": "Name of this service instance.",
          "type": "string",
          "default": "neo4j"
        }
      }
    },
    "neo4j": {
      "type": "object",
      "description": "Neo4J instance configuration properties",
      "properties": {
        "cpus": {
          "description": "CPU shares to allocate to the Neo4J instance.",
          "type": "number",
          "default": 2,
          "minimum": 1
        },
        "mem": {
          "description": "Memory to allocate to the Neo4J instance.",
          "type": "number",
          "default": 2048,
          "minimum": 2048
        }
      },
      "required": [
        "cpus",
        "mem"
      ]
    }
  }
}
~~~

### resources.json
There is one more template parameter in our [marathon.json.mustache](https://github.com/joerg84/universe/blob/neo4j-demo/repo/packages/N/neo4j_tutorial/0/marathon.json.mustache): the Docker image.
~~~
"docker":{
  "image":"{{resource.assets.container.docker.neo4j}}",
~~~


In order to allow installation in cluster which are not directly connected to the internet, we collect all external resources in the [resource.json](https://github.com/joerg84/universe/blob/neo4j-demo/repo/packages/N/neo4j_tutorial/0/resource.json) and not directly in the marathon.json.mustache.

~~~
"assets": {
  "container": {
    "docker": {
      "neo4j": "mesosphere/neo4j:3.1.1-RC1"
    }
  }
}
~~~

The resource.json also specifies the icons used by the UI (**Note**: It is good practice to store these images in a highly available location):

~~~
"images": {
   "icon-small": "https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-neo4j-small.png",
   "icon-medium": "https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-neo4j-medium.png",
   "icon-large": "https://s3.amazonaws.com/downloads.mesosphere.io/universe/assets/icon-service-neo4j-large.png"
 }
~~~

### package.json

Last, but not least there is the [package.json](https://github.com/joerg84/universe/blob/neo4j-demo/repo/packages/N/neo4j_tutorial/0/package.json) file with metadata about the package and additional information for users.

~~~
{
  "packagingVersion": "3.0",
  "name": "neo4j",
  "version": "3.1-0.0.1",
  "maintainer": "joerg@mesosphere.io",
  "description": "This is a single Neo4j container, which is not suited for HA setups. Neo4J is a popular graph database. See documentation for details: https://github.com/dcos/examples/tree/master/1.8/neo4j",
  "website": "http://www.neo4j.com",
  "framework": false,
  "tags": [
    "mesosphere",
    "service",
    "neo4j",
    "storage"
  ],
  "licenses": [
    {
      "name": "GPL v3 license or Neo4j Commercial/Evaluation/Education License",
      "url": "https://neo4j.com/licensing/"
    }
  ],
  "postInstallNotes": "Neo4J installed!",
  "preInstallNotes": "This DC/OS Service is currently EXPERIMENTAL. There may be bugs, incomplete features, incorrect documentation, or other discrepancies. Neo4J requires a single node with 2GB of RAM and 1 CPU. ",
  "postUninstallNotes": "Thank you for using Redis"
}
~~~

## Adding Webui

DC/OS allows users to automatically create a link from the DC/OS UI to the framework web UI. In order to create this link, we add the following labels to our [marathon.json.mustache](https://github.com/joerg84/universe/blob/neo4j-demo/repo/packages/N/neo4j_tutorial/0/marathon.json.mustache) file. Note that the `DCOS_SERVICE_PORT_INDEX` label assumes the user has bound the interface to the first port.

```
"labels": {
  "DCOS_SERVICE_NAME": "{{service.name}}",
  "DCOS_SERVICE_PORT_INDEX": "0",
  "DCOS_SERVICE_SCHEME": "http"
}
```

# Build and deploy a local Universe Server

Now we are ready to test our new package. To do so we deploy local dev-universe server. This can be done following the steps below. More detailed instructions can be found in the [Universe documentation](https://github.com/mesosphere/universe#repository-consumption).

## Validate and build the Universe

From the root directory of your Universe repo, run `scripts/build.sh` and check that it builds successfully.

## Build the Universe server Docker image

You can create a Docker image `universe-server:your_name-neo4jtutorial` on your local machine with the following command (*Note*: Please consider choosing different tags in order to identify your image) :

~~~
DOCKER_TAG="your_name-neo4jtutorial-1" docker/server/build.bash
~~~

If that step is successful, you can publish the image:

~~~
DOCKER_TAG="your_name-neo4jtutorial-1" docker/server/build.bash publish
~~~

### Deploy the universe server on your cluster

The above steps created the Marathon app definition you will use to deploy the universe server. It can be found as docker/server/target/marathon.json on your local machine.

Use this CLI command to deploy the Universe, which might take some time.

```
dcos marathon app add docker/server/target/marathon.json
```

You can check if the deployment has finished with

```
dcos marathon app list
```

Once the deployment has finished, add the new package repo:

```
dcos package repo add --index=0 dev-universe http://universe.marathon.mesos:8085/repo
```

### Install Neo4j package

Let us check the package is available by searching for it:

```
dcos package search neo4j
```

Now we can install neo4j and check that it is running from the UI.

```
dcos package install neo4j
```

For more details on how to use neo4j check the [official neo4j package documentation](https://github.com/dcos/examples/tree/master/1.8/neo4j).
Note the pitfalls listed below and use neo4j/dcos to login.

### Pitfalls with Neo4j Dashboard

Since our local package is just a prototype, your instance of the Neo4J UI has some limitations. The official neo4j universe package does not have these issues.

`Service UI`: Even though we can get the Neo4J from the DC/OS Services page, the links don’t work (because they redirect to /page while DC/OS works with /service/neo4j/page). This can be circumvented by accessing the UI via [marathon-lb](https://dcos.io/docs/1.8/usage/service-discovery/marathon-lb/).

`The bolt connection`: Bolt is Neo4J default connection method. You should disable bolt as shown in the screenshot below.

<img style="margin-left: 87px;" width="500" height="300" src="/assets/images/blog/2016-12-10_universe_neo4j_ui.png" alt="package structure"/>


# So Long, and Thanks for All the Introduction

Congratulations, you just created and installed your first universe package!
In the next posts in this series we will go into more depth, and create more sophisticated packages!

**Note**: We are currently working on a new packaging format, [`package.dcos`](https://dcos.io/blog/2016/packaging-in-dc-os/index.html), which will be formally introduced in the 1.10 release. We’ll update this guide at that point.
