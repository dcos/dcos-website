DC/OS 1.9 includes many new capabilities for Operators, and expands the collection of Data and Developer Services with a focus on:

- Tools for Production Operations - Monitoring and troubleshooting for distributed apps.
- Broader Workload Support - From traditional apps to machine learning.
- New data and developer services. <!-- NEED A LINK -->

### Contents
- [What's New](#whats-new)
- [Known Issues and Limitations](#known-issues)

# <a name="whats-new"></a>What's New

### Apache Mesos 1.2 and Marathon 1.4 integrated

- Apache Mesos 1.2 [CHANGELOG](https://github.com/apache/mesos/blob/1.2.x/CHANGELOG).
- Marathon 1.4 [release notes](https://github.com/mesosphere/marathon/releases).

## Container Orchestration

- Pods - Multiple co-located containers per instance, scheduled on the same host. For more information, see the [documentation](/docs/1.9/deploying-services/pods/).
- GPU - Leverage GPUs to run novel algorithms. For more information, see the [documentation](/docs/1.9/deploying-services/gpu/).
- Significant scalability improvements.

## DC/OS Monitoring and Operations

### Remote Process Injection for Debugging

The new `dcos task exec` command allows you to remotely execute a process inside the container of a deployed Mesos task, providing the following features.
- An optional `--interactive` flag for interactive sessions.
- Attach to a remote pseudoterminal (aka PTY) inside a container via the optional `--tty` flag.
- Combine the `--interactive` and `--tty` flags to launch an interactive bash session or to run `top` and see the resource usage of your container in real time.

For more information, see the documentation for the debugging [documentation](/docs/1.9/monitoring/debugging/).

### Logging

Stream task and system logs to journald by setting the `mesos_container_log_sink` install-time parameter to `journald` or `journald+logrotate`. This allows you to:
- Include task metadata like container ID in your queries to more easily locate the logs that you want.
- Use new DC/OS CLI commands `dcos node log` and `dcos task log` DC/OS CLI commands to query the logs. You can also make requests directly against the new Logging API.
- Set up log aggregation solutions such as Logstash to get logs into their aggregated storage solutions.

For more information, see the [documentation](/docs/1.9/monitoring/logging/).

### Metrics

- Node-level HTTP API that returns metrics from frameworks, cgroup allocations per container, and host level metrics such as load and memory allocation.
- StatsD endpoint in every container for forwarding metrics to the DC/OS metrics service. This service is what exposes the HTTP API.
- Any metric sent to STATSD_UDP_HOST/PORT is available in the HTTP API `/container/<container_id>/app` endpoint.

For more information, see the [documentation](/docs/1.9/metrics/).

### Tool for Troubleshooting Service Deployment Failures

- The new service deployment troubleshooting tool allows you to find out why your applications aren’t starting from the GUI and CLI.

  ![Service deploy GUI](/assets/images/releases/dcos-offers.png)

### Improved GUI

- New look and feel and improved navigation.

  ![New GUI](/assets/images/releases/dcos-dash.png)

- Usability improvements to the service create workflow.

  ![Improved GUI](/assets/images/releases/dcos-create.png)

## Networking Services

- CNI support for 3rd party CNI plugins.
- Performance improvements across all networking features.

## Other Improvements

### DC/OS Internals

- Update DC/OS internal JDK to 8u112 for security [fixes](http://www.oracle.com/technetwork/java/javase/2col/8u112-bugfixes-3124974.html).
- Update DC/OS internal Python from 3.4 to 3.5.
- The `dcos_generate_config.sh --aws-cloudformation` command will now determine the region of the s3 bucket automatically, preventing region mistakes.
- Added the `dcos_add_user.py` script, which you can use to add or invites users to a DC/OS cluster from the command line. For more information, see the [documentation](/docs/1.9/id-and-access-mgt/add-user-script/). <!-- OSS only -->
- Added `dcos-shell` which activates the DC/OS environment for running other DC/OS command line tools.

### Expanded OS Support

- CentOS [7.3](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.3_Release_Notes/index.html).
- CoreOS [1235.8.0](https://coreos.com/releases/#1235.8.0).

### Expanded Docker Engine Support

- Docker 1.12 and 1.13 are now [supported](/docs/1.9/installing/custom/system-requirements/).

### Upgrades

Improved upgrade tooling and experience for on-premise installations. Upgrades now use internal DC/OS APIs to ensure nodes can be upgraded with minimal disruption to running DC/OS services on a node. The upgrade procedure has also been simplified to improve user experience.

For more information, see the [documentation](/docs/1.9/installing/upgrading/).

# <a name="known-issues"></a>Known Issues and Limitations

- Marathon-LB does not support pods.
- If you install DC/OS 1.9 by using the [GUI](/docs/1.9/installing/custom/gui/) or [CLI](/docs/1.9/installing/custom/cli/) install methods, your system will be automatically upgraded to CentOS 7.3.
- The next 1.9 release candidate will use CentOS 7.3 as the default version.
- The next 1.9 release candidate will use Docker 1.13 as the default version.
- The next 1.9 release candidate will have the [logging features](/docs/1.9/monitoring/logging/) disabled by default.
- [4137](https://github.com/mesosphere/marathon/issues/4137) - Volumes do not persist.
