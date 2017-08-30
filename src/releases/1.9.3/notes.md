DC/OS 1.9 includes many new capabilities for Operators, and expands the collection of Data and Developer Services with a focus on:

- Tools for Production Operations - Monitoring and troubleshooting for distributed apps.
- Broader Workload Support - From traditional apps to machine learning.
- New data and developer services. <!-- NEED A LINK -->

### Contents
- [What's New](#whats-new)
- [Known Issues and Limitations](#known-issues)
- [Fixed Issues](#fixed-issues)

# <a name="whats-new"></a>What's New

### Apache Mesos 1.2 and Marathon 1.4 integrated

- Marathon 1.4.5 [release notes](https://github.com/mesosphere/marathon/releases/tag/v1.4.5).
- Apache Mesos 1.2.1 [CHANGELOG](https://github.com/mesosphere/mesos/blob/dcos-mesos-1.2.1-rc1/CHANGELOG).

## Container Orchestration
Added support for pods, GPUs, and made significant scalability improvements.

#### Pods
Multiple co-located containers per instance, scheduled on the same host. For more information, see the [documentation](/docs/1.9/deploying-services/pods/).

#### GPU
- Leverage GPUs to run novel algorithms.
- Because DC/OS GPU support is compatible with nvidia-docker, you can test locally with nvidia-docker and then deploy to production with DC/OS.
- Allocate GPUs on a per container basis, including isolation guarantees

For more information, see the [documentation](/docs/1.9/deploying-services/gpu/).

## <a name="monitoring-and-operations"></a>DC/OS Monitoring and Operations

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

## <a name="networking-services"></a>Networking Services

- CNI support for 3rd party CNI plugins.
- Performance improvements across all networking features.

## <a name="other-improvements"></a>Other Improvements

### DC/OS Internals

- Update DC/OS internal JDK to 8u112 for security [fixes](http://www.oracle.com/technetwork/java/javase/2col/8u112-bugfixes-3124974.html).
- Update DC/OS internal Python from 3.4 to 3.5.
- The `dcos_generate_config.sh --aws-cloudformation` command will now determine the region of the s3 bucket automatically, preventing region mistakes.
- Added the `dcos_add_user.py` script, which you can use to add or invites users to a DC/OS cluster from the command line. For more information, see the [documentation](/docs/1.9/security/add-user-script/). <!-- OSS only -->
- Added `dcos-shell` which activates the DC/OS environment for running other DC/OS command line tools.

### Expanded OS Support

- CentOS [7.3](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.3_Release_Notes/index.html) is the default version. If you install DC/OS 1.9 by using the [GUI](/docs/1.9/installing/custom/gui/) or [CLI](/docs/1.9/installing/custom/cli/) install methods, your system will be automatically upgraded to CentOS 7.3.
- CoreOS [1235.12.0](https://coreos.com/releases/#1235.12.0).

### Expanded Docker Engine Support

- Docker 1.12 and 1.13 are now [supported](/docs/1.9/installing/custom/system-requirements/). Docker 1.13 is the default version.

### Upgrades

Improved upgrade tooling and experience for on-premise installations. Upgrades now use internal DC/OS APIs to ensure nodes can be upgraded with minimal disruption to running DC/OS services on a node. The upgrade procedure has also been simplified to improve user experience.

For more information, see the [documentation](/docs/1.9/installing/upgrading/).

# <a name="known-issues"></a>Known Issues and Limitations

- DCOS_OSS-691 - DNS becomes briefly unavailable during DC/OS version upgrades.
- DCOS-14005 - Marathon-LB does not support pods.
- DCOS-14021 - [Task logging to journald](/1.9/monitoring/logging/) disabled by default, so task logs will continue to be written to their sandboxes, and logrotated out. The `- DCOS task log` command will work as it did before.
- Marathon-7133 - Marathon application history is lost after Marathon restart.
- CORE-1191 -  The Mesos master's event queue can get backlogged with the default settings, causing performance problems. These can be mitigated by setting the following configuration parameter in your `config.yaml` file at install time. See the [Configuration Reference](/1.9/installing/custom/configuration/configuration-parameters/) for more information.

  ```yaml
  mesos_max_completed_tasks_per_framework: 20
  ```

# <a name="fixed-issues"></a>Issues Fixed Since 1.8

- CORE-735 - Large node count leads to failed overlay config and failed replog recovery.
- DCOS-9149 - Missing Timeout for Spartan fetching DNS Exhibitor data.
- DCOS-9754 - beam.smp consumes inordinate amount of CPU.
- DCOS-9776 - Race in DeploymentPlan.
- DCOS-10089 - Network tab in UI doesn't show the assigned IP.
- DCOS-13228 - Layer 4 load balancer is not working with Docker bridge mode.
- DCOS-13359 - Backends are not removed from VIP table when killed.
- DCOS-13367 - ZooKeeper logs grow unbounded and will cause master node disks to fill up.
- DCOS-13400 - Layer 4 load balancer cannot handle multiple protocols with the same VIP.
- DCOS-13448 - Missing explicit file descriptor limits for DC/OS services.
- DCOS-13672 - Mesos reports over allocated CPU during DC/OS upgrade.
- DCOS-14228 - Disabled schedules keep firing in jobs.

<a name="1-9-2"></a>
# Issues Fixed Since 1.9.1

- Critical fix: Enables editing Marathon app in the UI. Encompasses the following:
  - DCOS_OSS-1350 - Nodes Page error on checkbox.
  - DCOS-17262 - Bug in DC/OS 1.9.1 - cannot edit marathon app from UI form.
  - DCOS-17242 - UI Bug - No warning when trying to create a service without specifying an ID.
  - DCOS-17241 - UI Bug in DC/OS 1.9.1 - Unable to select a task.
- Fix for dcos-metrics dropping data. Encompasses the following:
  - DCOS-16350 - dcos-metrics drops nearly all app data.
  - DCOS-15939 - Long labels can cause errors in datadog plugin for dcos-metrics.
  - DCOS-16424 - Metrics plugins don't collect app-level metrics.
- Ability to override storage region in AWS templates/ Encompasses the following:
  - DCOS-16737 - Unable to build and publish AWS templates to govcloud regions.
- Fix for bug in persistent volume handling in the Mesos containerizer. Encompasses:
  - MESOS-7770 - Persistent volume might not be mounted if there is a sandbox volume whose source is the same as the target of the persistent volume.
-  Fix for agent failure with Docker 1.12 and Docker 1.13. Encompasses:
  - MESOS-7777 - Agent failed to recover due to mount namespace leakage in Docker 1.12/1.13.
- DCOS-14880 - GUI bug: container type must be defined.

<a name="1-9-3"></a>
# Issues Fixed Since 1.9.2

- DCOS-15771 - mesos-dns doesn't return all SRV records of running tasks.
- DCOS-16151 - Marathon Endpoints are not responding.
- DCOS-16743 - libprocess in infinity schedulers performs a hostname reverse lookup instead of using /opt/mesosphere/bin/detect_ip.
- DCOS-17271 - dcos-epmd failing after host reboot.
- DCOS-17286 - Backport DCOS-16358 to 1.9.3.
- DCOS-17294 - Unable to curl (resolve) applications using Mesos DNS names.
- DCOS-18162 - `dcos task exec` does not pass on the last exit code.
- DCOS_OSS-1234 - VIP docs mention no longer existing endpoint.
- DCOS_OSS-1301 - Exhibitor doesn't log multiline messages to journald.
- DCOS_OSS-1433 - Bug in /etc/systemd/system/dcos-docker-gc.service script (1.9).
- DCOS_OSS-1451 - Stale datapoints can occur in container metrics.
- DCOS_OSS-1466 - Marathon returns persistent 503's.
- DCOS_OSS-1470 - Exhibitor: use PatternLayoutEscaped logger layout for structured journal logger.
- DCOS_OSS-1486 - Metrics agent crashes when the mesos containers endpoint is missing fields.
- DCOS_OSS-1561 - Revert DCOS_OSS-1472 from 1.9.3.
