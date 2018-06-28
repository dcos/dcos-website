The release notes provide a list of useful topics and links for DC/OS.

# Breaking Changes

- Manual modifications of Admin Router config are not supported. If you require a custom certificate, you must run [HAProxy in front of Admin Router](/docs/1.8/administration/tls-ssl/haproxy-adminrouter/).
- Network Time Protocol (NTP) must be enabled on all nodes for clock synchronization. For more information, see the [documentation](/docs/1.8/administration/installing/custom/system-requirements/).
- The `AcceptEULA` parameter was removed from [AWS templates](/docs/1.8/administration/installing/cloud/aws/). Any scripts written to deploy these templates may need to be updated so the parameter is no longer passed when deploying the templates.

# What's New

## Apache Mesos 1.0 and Marathon 1.3 RC integrated
- Apache Mesos 1.0 [CHANGELOG](https://github.com/apache/mesos/blob/1.0.x/CHANGELOG).
- Marathon 1.3 RC [release notes](https://github.com/mesosphere/marathon/releases).

## Container Orchestration
#### Services ("Built-In" Marathon)
Marathon is not just one container orchestrator out of many that we support; it is our default way to run things on DC/OS, supporting the full range of DC/OS features. In this release we'll have a major change in the Services tab in DC/OS. The native DC/OS Marathon instance UI is now fully integrated with the DC/OS UI. You can access it from the [**Services**](/docs/1.8/usage/webinterface/) tab on the DC/OS UI. The new fully integrated UI no longer shows a list of frameworks, but shows an embedded Marathon. This means that all of your services and applications are in one place.

For more information, see the [documentation](/docs/1.8/usage/webinterface/#services).

#### Jobs - Ability to run scheduled jobs on DC/OS
There is now built-in support of running scheduled jobs. We created a new Apache Mesos framework called [Metronome](https://github.com/dcos/metronome). Metronome is integrated natively with DC/OS and is available from the [**Jobs**](/docs/1.8/usage/webinterface/) tab on the DC/OS UI. You can create and administer scheduled jobs directly from the Jobs tab. Similar to the Services tab for long-running applications, you can manage all of your Jobs from one centralized place. You can set up jobs with a scheduler by using the cron format.

Additionally, you can specify attributes like the time zone or a starting deadline. We also have a JSON view mode which allows you to specify everything in one file to easily copy and paste it. We will constantly improve and extend the given functionality. Metronome will likely replace Chronos as our DC/OS job framework. If you still need Chronos, you can get it from the DC/OS [Universe](https://github.com/mesosphere/universe).

For more information, see the [documentation](/docs/1.8/usage/jobs/).

## Networking Services

#### IP per Container with VxLAN based Virtual Networks
DC/OS comes with built-in support for Virtual Networks leveraging the Container Network Interface (CNI) standard, and one default Virtual Network named `dcos`. Any container that attaches to a Virtual Network receives its own dedicated IP. This allows users to run workloads that are not friendly to dynamically assigned ports and would rather bind to the ports in their existing app configuration. Now, with dedicated IP/Container, workloads are free to bind to any port as every container has access to the entire available port range.

For more information, see the [documentation](/docs/1.8/administration/virtual-networks/).

#### DNS Based Service Addresses for Load Balanced Virtual IPs
DC/OS 1.8 introduces DNS Named Service Addresses for VIPs. With DNS Named VIPs, clients connect with a service address instead of an IP address. Due to the way DNS Named VIPs are generated in DC/OS, the risk of collision associated with IP VIPs does not exist. This means that administrators do not need to carefully manage DNS Named VIPs to avoid collision. This also means DNS Named VIPs can be automatically created at the time of service installation.

For more information, see the [documentation](/docs/1.8/usage/service-discovery/load-balancing-vips/virtual-ip-addresses/).

#### Network Isolation of Virtual Network Subnets
DC/OS now supports the creation of multiple virtual networks at install time and will associate non-overlapping subnets with each of the virtual networks. Further, DC/OS users can program Network Isolation rules across DC/OS agent nodes to ensure that traffic across Virtual Network subnets is isolated.

For more information, see the [documentation](/docs/1.8/administration/virtual-networks/).

## CLI
#### Binary CLIs for Linux, Windows, and Mac
Installing the DC/OS CLI is easier than ever. We’ve replaced the install script with a simple binary CLI.

For more information, see the [documentation](/docs/1.8/usage/cli/install/).

#### Download CLI binaries from DC/OS UI
Download the CLI binaries directly from the DC/OS UI. For more information, see the [documentation](/docs/1.8/usage/webinterface/).

## Package Management Service
Easy to deploy offline Universe. For more information, see the [documentation](/docs/1.8/administration/installing/).


<!-- ## Cloud Installation
- Advanced AWS and Azure Templates. For more information, see the [documentation](/docs/1.8/administration/installing/cloud/)
- Auto Scaling for AWS, including GovCloud. For more information, see the [documentation](/docs/1.8/administration/installing/cloud/aws/). -->

## DC/OS Data services

- Non-root user config (except Cassandra). <!-- [Documentation]() -->
- Binary CLIs for all services.

#### HDFS Service
DC/OS Universe now has a new DC/OS HDFS Service. This new DC/OS HDFS Service is an entirely new implementation sharing no code with the previous DC/OS HDFS Services. DC/OS HDFS Service can be deployed with a single command. Multiple instances of the DC/OS HDFS Service can be deployed to a single DC/OS cluster. Configuration of a DC/OS HDFS Service can updated at runtime without service interruption. DC/OS HDFS Service instances reserve all resources including CPU, Memory, Disk and Network Ports.

For more information, see the [documentation](https://docs.mesosphere.com/services/hdfs/).

#### Kafka Service
DC/OS Universe has an updated DC/OS Kafka Service. The updated DC/OS Kafka Service now supports configuring ZK service for Apache Kafka.

For more information, see the [documentation](https://docs.mesosphere.com/services/kafka/).

#### Confluent Kafka Service
DC/OS Universe has a DC/OS Confluent Platform Service that is based on the DC/OS Kafka Service. Confluent offers support for the DC/OS Confluent Platform Service on DC/OS.

For more information, see the Universe [documentation](https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/C/confluent-kafka).

#### Cassandra Service
DC/OS Universe has an updated DC/OS Cassandra Service. The updated DC/OS Cassandra Service now supports multi-datacenter Cassandra ring topologies, and backup and restore with Azure Storage.

For more information, see the [documentation](https://docs.mesosphere.com/services/cassandra/).

#### Datastax Enterprise (DSE) Service
DC/OS Universe has a DC/OS DataStax Enterprise (DSE) Service that is based on the DC/OS Cassandra Service. DataStax offers support for the DC/OS DataStax Enterprise Service on DC/OS.

For more information, see the Universe [documentation](https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/D/dse).

#### Spark Service
DC/OS Universe has an updated version of Apache Spark based on 1.6.2.  In addition to all the of features of Apache Spark 1.6.2, the DC/OS Spark Service supports Kerberos and SSL with secure HDFS clusters. Latest stable Spark with coarse-grained scheduler.

For more information, see the [documentation](https://docs.mesosphere.com/services/spark/).

## Developer Agility
<!-- - GitLab Package. -->
- Artifactory Package. For more information, see the [documentation](https://github.com/JFrogDev/artifactory-dcos).
- Updated Jenkins packages. For more information, see the [documentation](https://docs.mesosphere.com/services/jenkins/).

## Improved UI & CLI improvements
- See the CLI [release notes](https://github.com/dcos/dcos-cli/releases).

## Fixes and enhancements
Over 1350 other fixes and enhancements to DC/OS and DC/OS Services, including:

- DCOS-7415 - Unable to fetch /v2/tasks as plaintext for Marathon 0.15.3 in some cases
- DCOS-7422 - Improved reconnect logic in the case of root Marathon / Mesos master disconnections
- DCOS-7810 - Invalid IDs inside of nested groups leading to unexpected blocked deployments
- DCOS-7926 - Improved Marathon performance while deploying thousands of tasks
- DCOS-8128 - Improved Marathon task recovery in the case of some network events
- DCOS-8370 - Apps should not be able to share the same service port on a single host
- DCOS-8730 - Admin Router does not respect ports provided by external proxy
- MARATHON-888 - Improved handled of orphaned containers after master failover
- MARATHON-956 - Improved Marathon performance to prevent occurrence of "futures timed out" errors


## <a name="known-issues"></a>Known Issues and Limitations <!-- OSS -->

- DCOS-270 - Docker version 1.12.x is not supported.
- DCOS-8975 - Port mapping for virtual networks is not displayed correctly. <!-- OSS -->

# <a name="minor"></a>Minor releases

## <a name="1-8-3"></a>1.8.3 - September 6, 2016

Issues fixed:

- Bug fixes to the [mesos-overlay-modules](https://github.com/dcos/mesos-overlay-modules).
- Bug fixes to the [Navstar component](https://github.com/dcos/navstar).
- [DCOS-321](https://jira.dcos.io/browse/DCOS-321) - Bug fixes to configuring OAuth in the AWS advanced templates.
- [DCOS-326](https://jira.dcos.io/browse/DCOS-326) - Azure downloads URL is fixed.

New features and changes:

- You can generate custom AWS Advanced templates from the custom installer file (`dcos_generate_config.sh --aws-cloudformation`) and a configuration file (`config.yaml`). Only a subset of the configuration file options are allowed (e.g. `resolvers` and `exhibitor_backend` cannot be changed). <!-- For more information, see the [documentation](/docs/1.8/administration/installing/cloud/aws/advanced/aws-custom). -->
- New version of the Jobs component ([Metronome 0.1.9](https://github.com/dcos/metronome)).
- To clarify the location of the installed files, the DC/OS installer refers to `genconf/` instead of `/genconf/`.
- CentOS AMIs are updated to include a fix for a Docker 1.11.2 bug, which caused Docker to not start.
- DC/OS can now be built using older Docker versions.
- Mesos-DNS [0.5.3-rc2](https://github.com/mesosphere/mesos-dns/blob/master/CHANGELOG).
- Updated DC/OS UI.
- Marathon 1.3.0-RC6 [release notes](https://github.com/mesosphere/marathon/releases).
- Updated the DC/OS Diagnostics component (`dcos-3dt.service`) with numerous bug fixes.
- BUILD_DIR is no longer printed when you run the custom installer (`dcos_generate_config.sh`).
- The custom DC/OS installer has been refactored and reworked.
- `gen_resolvconf.py` will attempt to rename`resolv.conf`, but if that fails it will fall back to writing directly.
- If you have an existing SSH connection to a master, you can quickly add a new user to your cluster with the `dcos_add_user.py` script. Just run `sudo -i /opt/mesosphere/bin/dcos_add_user.py <password>`. For more information see PR [609](https://github.com/dcos/dcos/pull/609).


## <a name="1-8-2"></a>1.8.2 - August 25, 2016

Issues fixed:

- Fix named VIPS with 2 or more ports in use
- Fix `dcos-adminrouter-reload.service`
- Fix 3dt checking of timer units which exit non-zero (found the `dcos-adminrouter-reload` bug)

New features and changes:

- Marathon [1.3.0-RC5](https://github.com/mesosphere/marathon/releases)
- CentOS 7 AMI builder scripts
- Updated [Cosmos](https://github.com/dcos/cosmos) API for DC/OS services
- Added a flag to the custom installer, `--cli-telemetry-disabled`, to disable the CLI basic telemetry. For more information, see the [documentation](/docs/1.8/administration/installing/custom/cli/).
- Improved handling of `/etc/resolv.conf` around systemd-networkd
- Moved REX-Ray out of the agent advertised port range
- The preflight port check is different for masters and agents
- Removed SPDY and HTTP/2 from admin router (the nginx and OpenResty is broken)
- Always enable EBS optimization for AWS clusters (EbsOptimized)
- Fold `dcos-vol-discovery-{priv,pub}-agent.service` into the appropriate `dcos-mesos-slave` service, making it easier to change the resources on a host and reset the agent
- Marathon and Metronome run as non-root
- Switch to `/etc/os-release` for OS Detection
- Switch to [argparse's](https://docs.python.org/3/library/argparse.html) default help for `dcos_generate_config.sh`
- General internal code cleanup and technical debt fixes

