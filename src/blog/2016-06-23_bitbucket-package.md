---
title: Building A DC/OS Universe Package
date: 2016-07-25
author: Andrew Hoskins, Mesosphere
category: services
description: A step-by-step guide for creating a Bitbucket package
layout: article.jade
collection: posts
lunr: true
---

Universe is the DC/OS package repository that contains services like Spark, Cassandra, Jenkins, and many others.  In this post, we'll walk through the process of creating a [Bitbucket](https://bitbucket.org/) package for the DC/OS Universe.

Before you get started, install a couple prerequisite tools.

-  Install the DC/OS and the DC/OS CLI using this [guide](https://dcos.io/install/). You must have at least 1 [public agent](https://docs.mesosphere.com/1.7/overview/concepts/#public) node.
-  Install [pip](https://pip.pypa.io/en/stable/installing.html#install-pip) for Python 3
-  Install jsonschema:

```bash
$ pip install jsonschema
```

## Getting Started
Packages are published to the Mesosphere Universe repository on GitHub.

To get started, fork the [Universe](https://github.com/mesosphere/universe) repository, then clone the fork:

```bash
$ git clone https://github.com/<your-username>/universe
$ cd universe
```

As you look around the Universe repository you'll notice that the repository (`/repo/packages`) consists of packages arranged alphabetically. Each package consists of 4 JSON files:

-  `config.json` -  configuration properties supported by the package, represented as a json-schema.
-  `package.json` -  high-level metadata about the package.
-  `marathon.json.mustache` - a [mustache](http://mustache.github.io/) template that when rendered will create a [Marathon](http://github.com/mesosphere/marathon) app definition capable of running your service.
-  `resource.json` - contains all of the externally hosted resources (e.g. Docker images, HTTP objects and images) that are required to install the application.

The Universe repository uses pre-commit hooks.  Install the hooks:

```bash
$ bash scripts/install-git-hooks.sh
```

Create a new directory for the Bitbucket package in `repo/packages/B/bitbucket/0`.

```bash
$ cd repo/packages && mkdir B && cd B && mkdir bitbucket && cd bitbucket && mkdir 0 && cd 0
```

The `0` directory corresponds to the release number of the package.  If you look at other packages in Universe, many have multiple releases (directories `0`, `1`, `2`, etc).

Now, you're ready to start creating your package!  At a high-level, all we are doing is bundling up a Bitbucket docker container into an entity DC/OS can deploy onto a cluster.  Each of the first four steps prepares one of the necessary JSON files, then the last step is to build and deploy Bitbucket on DC/OS.

## Step One: package.json

This file specifies the highest-level metadata about the package (comparable to a `package.json` in Node.js or `setup.py` in Python).
Let's go ahead and create it in the most basic way.

```javascript
{
  "packagingVersion": "3.0", // see below
  "name": "bitbucket",
  "version": "4.5", // 4.5 is the version of the bitbucket container we are launching
  "scm": "https://www.atlassian.com/software/bitbucket",
  "description": "Bitbucket package",
  "maintainer": "support@mesosphere.io",
  "tags": ["git", "bitbucket", "bit", "bucket", "vcs"],
  "preInstallNotes": "Preparing to install bitbucket-server.",
  "postInstallNotes": "Bitbucket has been installed.",
  "postUninstallNotes": "Bitbucket was uninstalled successfully."
}
```

The `packagingVersion` field specifies the version of Universe package spec to adhere to.  Use the latest version, `3.0`.  
See the [schema](https://github.com/mesosphere/universe/blob/version-3.x/repo/meta/schema/v3-resource-schema.json) on GitHub for details on this version spec.  

## Step Two: resource.json

This file declares all the externally hosted assets the package will need &mdash; for example: docker containers, images, or native binary CLI.  See the resource schema version [2.0](https://github.com/mesosphere/universe/blob/version-3.x/repo/meta/schema/v2-resource-schema.json) or [3.0](https://github.com/mesosphere/universe/blob/version-3.x/repo/meta/schema/v3-resource-schema.json) for the available assets for each.

For the Bitbucket package, you will want an icon and to use a pre-existing [Bitbucket container](https://hub.docker.com/r/atlassian/bitbucket-server/).

```javascript
{
  "images": {
    "icon-small": "http://i.imgur.com/QGc420u.png",
    "icon-medium": "http://i.imgur.com/QGc420u.png",
    "icon-large": "http://i.imgur.com/QGc420u.png"
  },
  "assets": {
    "container": {
      "docker": {
        "bitbucket-docker": "atlassian/bitbucket-server:4.5"
      }
    }
  }
}
```
The image sizes should be 48x48 (small), 96x96 (medium), and 256x256 (large).

## Step Three: config.json

This file declares the packages configuration properties, such as the amount of CPUs, number of instances, allotted memory, and the package name that will appear on DC/OS Universe.  In step four, these properties will be injected into the` marathon.json.mustache file`.

Each property can provide a default value, specify whether it's required, and provide validation (minimum and maximum values).  When installing our Bitbucket package (step five), we will use CLI [flags](https://docs.mesosphere.com/1.7/usage/managing-services/config/) to override some of the values.  They can also be overriden through DC/OS [UI](https://docs.mesosphere.com/1.7/usage/webinterface/#universe).

Below is a snippet of `config.json`.  Find the [rest](https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/B/bitbucket/0/config.json) on Github.
```javascript
{
  "$schema": "http://json-schema.org/schema#",
  "properties": {
    "bitbucket": {
      "properties": {
        "instances": {
          "default": 1,
          "description": "Number of instances to run.",
          "minimum": 1,
          "type": "integer"
        },
        "cpus": {
          "default": 2,
          "description": "CPU shares to allocate to each bitbucket instance.",
          "minimum": 2,
          "type": "number"
        },
        "name": {
          "default": "bitbucket",
          "description": "Name for this bitbucket application",
          "type": "string"
        },
...
...
...
}
```

## Step Four: marathon.json.mustache

This file is written in the [mustache templating language](https://mustache.github.io/mustache.5.html), and is compiled to JSON later.
It's written in a higher-level templating language because it references objects and variables that are declared in `config.json` and `resource.json`.
For example, in your `config.json`, the instances property can be accessed from the `marathon.json.mustache` file.

```javascript
...
"id": "/{{bitbucket.name}}",
"instances": {{bitbucket.instances}},
...
```

When the mustache is compiled, it replaces this special tag with the value of `bitbucket.instances` declared in `config.json`.  Be careful about types!  If the replaced property is a string, make sure to enclose it in double quotes.

Here is a snippet of `marathon.json.mustache` for your Bitbucket package.  See Github for the [entire file](https://github.com/mesosphere/universe/blob/version-3.x/repo/packages/B/bitbucket/0/marathon.json.mustache).

```javascript
{
  "id": "/{{bitbucket.name}}",
  "instances": {{bitbucket.instances}},
  "cpus": {{bitbucket.cpus}},
  "mem": {{bitbucket.mem}},
  "maintainer": "support@mesosphere.io",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "{{resource.assets.container.docker.bitbucket-docker}}",
      "network": "BRIDGE",
      "portMappings": [
        { "containerPort": 7990, "hostPort": 0 },
        { "containerPort": 7999, "hostPort": 0 }
      ]
    },
    "volumes": [
    {
        "containerPath": "/var/atlassian/application-data/bitbucket",
        "hostPath": "{{bitbucket.host-volume}}",
        "mode": "RW"
    }
    ]
  },
...
...
...
}
```

For information about health checks and volumes, reference the [Marathon documentation](https://mesosphere.github.io/marathon/docs/rest-api.html).

## Step Five: Install Bitbucket Package

At this point, the Bitbucket package has all the required files for running on DC/OS.  Push all of these changes up to your fork of Universe on GitHub.

The next step is to verify that your new Bitbucket package works as expected.  To test this you are going to install it on a DC/OS cluster.

You must have DC/OS and DC/OS CLI [installed](https://dcos.io/install/).

#### Install marathon-lb
Install marathon-lb from the CLI:

```bash
$ dcos package install marathon-lb
```

Alternatively, you can use the DC/OS UI to install marathon-lb onto the cluster.

#### Public Agent IP
Next, determine the address of a [public agent](/docs/1.7/overview/concepts/#public) from your cluster.  The process for finding this will vary depending on your infrastructure.  For information about how to determine public agent on AWS, see this [blog post](https://mesosphere.com/blog/2015/12/04/dcos-marathon-lb/).

After you have determined the public agent, make a new configuration file named `options.json`.  This file overrides the `virtual-host` property that was specified earlier in `config.json`.

**Important:** Remove the `http://`, and trailing slash (`/`) from the public agent address.

Make a file named `options.json` with the following contents:
```javascript
{
   "bitbucket": {
       "virtual-host": "<your-public-agent-address>"
   }
}
```

#### Build the Universe Server

Refer to the Universe [docs](https://github.com/mesosphere/universe#build-universe-server-locally).

#### Install Bitbucket on your cluster

In the previous step, a `marathon.json` was created.  Use the below commands to run a Universe Server on our DC/OS cluster.

```bash
$ dcos marathon app add marathon.json
$ dcos package repo add --index=0 dev-universe http://universe.marathon.mesos:8085/repo
```

Now the Bitbucket package is available to your DC/OS cluster.  If you ever need to recreate a Universe, delete the old one first with: `$ dcos marathon app remove universe`. 

To install Bitbucket, run the following command.  Make sure to include the options flag, which overrides the `bitbucket.virtual-host` property of `config.json` file:

```bash
$ dcos package install bitbucket --options=options.json
```

It will take a few minutes for Bitbucket to deploy on your cluster.  When it's done deploying, enter the below url into a web browser:

```bash
<public-agent-ip>/service/bitbucket
```

When you see the Bitbucket welcome screen, it's working!













