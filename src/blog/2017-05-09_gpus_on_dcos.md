---
title: 'Tutorial: Deep learning with TensorFlow, Nvidia and Apache Mesos (DC/OS), Part 2'
date: 2017-05-09
author: Kevin Klues and Suzanne Scala, Mesosphere
category: services
description: Try out TensorFlow with GPU acceleration on DC/OS.
layout: article.jade
collection: posts
lunr: true
---

In the last post, we demonstrated how GPUs can dramatically reduce the time you need for a TensorFlow job. But what if we want to run this in production, not just from the laptop? You’d want to be able to deploy your TensorFlow service quickly and manage it easily in production across multiple teams: that’s where DC/OS comes in.

Watch a video version of this tutorial:
[![GPUs on DCOS](https://img.youtube.com/vi/VzHVM0SCF44/0.jpg)](https://www.youtube.com/watch?v=VzHVM0SCF44)

In part 2 of this tutorial, we’ll:
- Install the TensorFlow service without GPUs.
- Run a neural network example.
- Install TensorFlow _with_ GPUs.
- Run the same neural network example.
- Run an example that uses multiple GPUs.

# Run TensorFlow on DC/OS without GPUs

First, let’s see how easy it is to use TensorFlow on DC/OS, even without GPUs.

## Prerequisites
- A [DC/OS cluster](https://dcos.io/docs/1.9/installing/) with 1 private agent with 4 CPUs and 1 public agent with 8 CPUs and 8 Nvidia Tesla K80 GPUs.
- The [DC/OS CLI installed](https://docs.mesosphere.com/1.9/cli/install/).

## Deploy the TensorFlow service
First, let's get TensorFlow running on your DC/OS cluster.

1. Go to the Services tab of the DC/OS UI.
1. Click **+** to add a service.
1. Choose **Single Container**.
1. Toggle to the **JSON Editor** and paste the following [application definition](https://docs.mesosphere.com/1.9/deploying-services/creating-services/) into the editor.

  ```json
  {
    "id": "my-tensorflow-no-gpus",
    "cpus": 4,
    "gpus": 0,
    "mem": 2048,
    "disk": 0,
    "instances": 1,
    "container": {
      "type": "MESOS",
      "docker": {
        "image": "tensorflow/tensorflow"
      }
    }
  }
  ```

  This application definition specifies _no_ GPUs and the standard TensorFlow Docker image.

1. Click **Review and Run**, then **Run Service**.

## Run a TensorFlow example

1. Exec into the TensorFlow container from the DC/OS CLI. This command allows you to execute commands inside the container and stream the output to your local terminal.

  ```bash
  dcos task exec -it my-tensorflow-no-gpus bash
  ```

1. Now, let's get some examples to run. Install git and then clone the TensorFlow-Examples repository.

    ```bash
    apt-get update; apt-get install -y git
    git clone https://github.com/aymericdamien/TensorFlow-Examples
    ```
1. Run and time the same example you ran locally in the last tutorial, the convolutional network example.

  ```bash
  cd TensorFlow-Examples/examples/3_NeuralNetworks
  time python convolutional_network.py
  ```

This took my DC/OS cluster 11 minutes.

# Run TensorFlow on DC/OS with GPUs

## Deploy the TensorFlow service with GPUs

Now that you've got TensorFlow examples running on your cluster, let's see how performance compares when you configure your service to use GPUs.

1. Go to the Services tab of the DC/OS UI.
1. Click **+** to add a service.
1. Choose **Single Container**.
1. Toggle to the **JSON Editor** and paste the following [application definition](https://docs.mesosphere.com/1.9/deploying-services/creating-services/) into the editor.

  ```json
  {
    "id": "tensorflow-gpus-1",
    "acceptedResourceRoles": ["slave_public"],
    "cpus": 4,
    "gpus": 4,
    "mem": 2048,
    "disk": 0,
    "instances": 1,
    "container": {
      "type": "MESOS",
      "docker": {
        "image": "tensorflow/tensorflow:latest-gpu"
      }
    }
  }
  ```

  This application definition is largely the same as the last one, except, here, you're requesting 4 GPUs and specifying the TensorFlow Docker image that's configured for GPUs.

1. Click **Review and Run**, then **Run Service**.

## Verify access to GPUs
You'll recall that we created a cluster with a public agent that has 8 GPUs, but only requested access to 4. Let's verify that the node has 8 GPUs, and that our service has access to only 4 of them.

1. First, use `dcos task exec` to run a command inside of the container to get the public IP address of the agent node the container is running on.

  ```
  dcos task exec tensorflow-gpus-1 curl -s ifconfig.co
  ```

1. Now, use that public IP to SSH into the node and run `nvidia-smi` to verify the number of GPUs the node has.

  ```
  ssh <public-ip>
  nvida-smi
  ```

  You should see 8 GPUs installed and running on the machine. The container for your service, however, should only be able to see 4 of those GPUs.

1. Run `dcos task exec` with the `bash` option to get a shell inside of your service's container.

  ```
  dcos task exec -it tensorflow-gpus-1 bash
  ```

1. Set up environment variables so you can run `nvida-smi` from within this shell.

  ```
  export LD_LIBRARY_PATH=/usr/local/nvidia/lib64
  export PATH=$PATH:/usr/local/nvidia/bin
  ```

1. Run `nvidia-smi` to verify that even though you have 8 GPUs installed on the _machine_, you only have access to four of them inside this container.

  ```
  nvidia-smi
  ```

## Run a TensorFlow example with GPUs

Now that you've installed TensorFlow and verified your access to 4 GPUs, let's run the same example as before.

1. If you exited the `tensorflow-gpus-1` container, reenter it and set up the environment variables by following the steps in the last section.

1. Install git and clone the TensorFlow-Examples repository.

  ```bash
  apt-get update; apt-get install -y git
  git clone https://github.com/aymericdamien/TensorFlow-Examples
  ```

1. Run and time the same example you ran earlier, the convolutional network example.

  ```bash
  cd TensorFlow-Examples/examples/3_NeuralNetworks
  time python convolutional_network.py
  ```

1. Watch the code find the GPUs and execute.

This took my DC/OS cluster about 2 minutes: about 5 times faster than before!

## Launch Two TensorFlow Instances
You’ll recall that we have a cluster with _8_ GPUs, but we only requested access to 4 of them. Now, let’s launch a second TensorFlow instance that will consume the remaining 4 GPUs in parallel with the first.

Running more than one TensorFlow instance in parallel shows that you can have multiple users on the same cluster with _isolated access_ to the GPUs on it.

1. Add a third service to your DC/OS cluster with the following application definition, which is similar to the first application definition with GPUs.

  ```json
  {
    "id": "tensorflow-gpus-2",
    "acceptedResourceRoles": ["slave_public"],
    "cpus": 4,
    "gpus": 4,
    "mem": 2048,
    "disk": 0,
    "instances": 1,
    "container": {
      "type": "MESOS",
      "docker": {
        "image": "tensorflow/tensorflow:latest-gpu"
      }
    }
  }
  ```

1. Verify that your second TensorFlow instance is running by accessing the Jupyter notebook that runs by default on the TensorFlow Docker image. In the application definition above, the `acceptedResourceRoles` parameter is set to `slave_public`, which gives us access to the public IP of the agents where the containers are running.

  1. Get the public IP of the agent where the task has been launched.
    ```bash
    dcos task exec tensorflow-gpus-2 curl -s ifconfig.co
    ```

  1. Go to the STDERR log of the service to get the Jupyter URL. **Services** > **tensorflow-gpus-2** > **task-id** > **paper icon** > **ERROR (STDERR)**. You will see this a message similar to the following.
    ```
    Copy/paste this URL into your browser when you connect for the first time, to login with a token:

    http://localhost:10144/?token=d4f3d8f80eb97299e74b5254d1600c480c3f042d548e51f5
    ```

  1. Replace `localhost` with the public IP you found earlier to see the Jupyter notebook.

  1. Click the `Getting Started` notebook and run some commands.

Thanks for playing along at home!

The next post in the series will show you how to use DC/OS to dynamically request cluster resources and launch a distributed TensorFlow job across multiple agents. When that job completes, the resources it had used are automatically released back to the cluster and made available to other jobs. This dramatically increases efficiency in comparison to traditional TensorFlow deployment strategies.
