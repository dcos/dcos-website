---
title: Package Storage in DC/OS
date: 2016-12-21
author: Charles Ruhland, Mesosphere
category: universe
description: Package Storage in DC/OS
layout: article.jade
collection: posts
lunr: true
---

In DC/OS 1.9, we're rolling out an experimental feature that allows you to develop and test packages in your own cluster, without needing to publish them to the Mesosphere Universe. This guide walks through how to configure and use this feature on a new DC/OS cluster. Let's get started!

# Enabling DC/OS package storage

## Configuration

The package storage feature must be configured as part of DC/OS installation. In this example we will be using a three-node cluster: one bootstrap node for installation, one master node, and one agent node. We'll assume that all of these nodes are running on AWS. On the bootstrap node, in some working directory, do the following:

```bash
mkdir genconf

cat <<EOF > genconf/config.yaml
agent_list:
- <agent IP address>
bootstrap_url: file:///opt/dcos_install_tmp
cluster_name: package_storage_demo
exhibitor_storage_backend: static
master_discovery: static
master_list:
- <master IP address>
resolvers:
- 8.8.4.4
- 8.8.8.8
ssh_port: 22
ssh_user: centos
process_timeout: 300
cosmos_config:
  staged_package_storage_uri: file:///var/lib/dcos/cosmos/staged-packages
  package_storage_uri: file:///var/lib/dcos/cosmos/packages
EOF

cat <<EOF > genconf/ip-detect
#!/bin/sh
# Uses the AWS Metadata Service
curl -fsSL http://169.254.169.254/latest/meta-data/local-ipv4
EOF
```

Make sure you fill in the appropriate IP addresses for your cluster in `config.yaml`. These two files are needed to configure your DC/OS installation. Note the two parameters under `cosmos_config`:

```
staged_package_storage_uri: file:///var/lib/dcos/cosmos/staged-packages
package_storage_uri: file:///var/lib/dcos/cosmos/packages
```

These tell the Cosmos package manager to use the local filesystem of the master node to store package data. They can also be configured to use S3 URIs, which would be necessary for clusters with more than one master. (TODO: Show how to configure for S3?)

You will also need to copy the private SSH key for your cluster's nodes to `genconf/ssh_key` and adjust its permissions:

```bash
chmod 0600 genconf/ssh_key
```

Finally, we need the installation script (TODO: change URL):

```bash
curl -O https://downloads.dcos.io/dcos/testing/pull/974/dcos_generate_config.sh
```

## Installation

We're now ready to install DC/OS with package storage! Run the following commands:

```bash
sudo bash dcos_generate_config.sh --validate
sudo bash dcos_generate_config.sh --genconf
sudo bash dcos_generate_config.sh --preflight
sudo bash dcos_generate_config.sh --deploy
```

At this point you should have a working DC/OS installation. Terminate your SSH connection to the bootstrap node, and let's move on to using the package storage feature!

# Using DC/OS package storage

The DC/OS CLI has been updated with a new subcommand, `dcos experimental`. To ensure you have the latest version, with 1.9 features, point your browser at your master node's public IP and authenticate with your cluster. Once the dashboard appears, click the drop-down menu in the upper left and select "Install CLI", then follow the instructions for your operating system.

If you run the CLI with no command-line arguments, you should see the following:

```
$ dcos
Command line utility for the Mesosphere Datacenter Operating
System (DC/OS). The Mesosphere DC/OS is a distributed operating
system built around Apache Mesos. This utility provides tools
for easy management of a DC/OS installation.

Available DC/OS commands:

        auth            Authenticate to DC/OS cluster
        config          Manage the DC/OS configuration file
        experimental    Experimental commands. These commands are under development and are subject to change
        help            Display help information about DC/OS
        job             Deploy and manage jobs in DC/OS
        marathon        Deploy and manage applications to DC/OS
        node            Administer and manage DC/OS cluster nodes
        package         Install and manage DC/OS software packages
        service         Manage DC/OS services
        task            Manage DC/OS tasks

Get detailed command description with 'dcos <command> --help'.
```

Let's get more info on the `experimental` commands:

```
$ dcos experimental --help
Description:
    Experimental commands. These commands are under development and are subject to change.

Usage:
    dcos experimental --help
    dcos experimental --info
    dcos experimental package add [--json]
                                  (--dcos-package=<dcos-package> |
                                    (--package-name=<package-name>
                                      [--package-version=<package-version>]))
    dcos experimental package build [--output-directory=<output-directory>]
                                    <build-definition>
    dcos experimental service start [--json]
                                    [--package-version=<package-version>]
                                    [--options=<options-file>]
                                    <package-name>

Commands:
    package add
        Adds a DC/OS package to DC/OS.
    package build
        Build a package locally to install to DC/OS or share with Universe.
    service start
        Starts a DC/OS package previously added with `dcos experimental package add`
```

In the next sections, we're going to use `dcos experimental package build` to create a DC/OS package file from a package description; `dcos experimental package add` to upload the package into our cluster; and `dcos experimental service start` to launch a service from our package.

## Build

Let's start by creating a simple package. We need a Marathon app template:

```
$ cat <<EOF > marathon.json.mustache
{
  "id": "helloworld",
  "cpus": 1.0,
  "mem": 512,
  "instances": 1,
  "cmd": "python3 -m http.server {{port}}",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "python:3",
      "network": "HOST"
    }
  }
}
EOF
```

A config file:

```
$ cat <<EOF > config.json
{
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "properties": {
    "port": {
      "type": "integer",
      "default": 8080
    }
  }
}
EOF
```

And finally a metadata file to tie everything together:

```
$ cat <<EOF > package.json
{
  "packagingVersion": "3.0",
  "name": "helloworld",
  "version": "0.1.0",
  "maintainer": "support@mesosphere.io",
  "description": "Example DC/OS service",
  "tags": [],
  "config": "@config.json",
  "marathon": {
    "v2AppMustacheTemplate": "@marathon.json.mustache"
  }
}
EOF
```

Now we invoke `build` to assemble all of the components into a single package file:

```
$ dcos experimental package build package.json
Created DCOS Universe package: /home/demo/helloworld-0.1.0-7c112a3066949b799ff2be95b2f6929b.dcos
```

## Add

Next, we upload the package to our DC/OS cluster:

```
$ dcos experimental package add --dcos-package=helloworld-0.1.0-7c112a3066949b799ff2be95b2f6929b.dcos
The package [helloworld] version [0.1.0] has been added to DC/OS
```

We can also add packages from Universe:

```
$ dcos experimental package add --package-name=cassandra
The package [cassandra] version [1.0.4-2.2.5] has been added to DC/OS
```

Adding a package will eventually ensure that all the resources it needs to run as a service will be available, such as executables, tarballs, or Docker images. However, in this release resources are not included in the package file.

## Start

Once a package has been added to your cluster, you can deploy it with `experimental service start`. Let's launch both of the packages we added in the last section:

```
$ dcos experimental service start helloworld
The service [helloworld] version [0.1.0] has been started
$ dcos experimental service start cassandra
The service [cassandra] version [1.0.4-2.2.5] has been started
```

Running `dcos package list` or looking at the "Services" view in the DC/OS UI will show both of them up and running! To terminate them, the older command `dcos package uninstall <name>` can be used.

# Conclusion

DC/OS package storage enabled us to develop and run a custom package in our cluster, without needing to publish it to the Universe repository first. While this is a great productivity boost already, it's just the beginning. Watch for big improvements to package storage in upcoming releases!
