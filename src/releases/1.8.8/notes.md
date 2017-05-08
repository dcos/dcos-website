The release notes provide a list of useful topics and links for DC/OS. Click [here](#1-8-8) to see the updates for 1.8.8.

# Breaking Changes

- Manual modifications of Admin Router config are not supported. If you require a custom certificate, you must run [HAProxy in front of Admin Router](/docs/1.8/administration/tls-ssl/haproxy-adminrouter/).
- Network Time Protocol (NTP) must be enabled on all nodes for clock synchronization. For more information, see the [documentation](/docs/1.8/administration/installing/custom/system-requirements/).

# What's New

## Apache Mesos 1.0 and Marathon 1.3 integrated
- Apache Mesos 1.0 [CHANGELOG](https://github.com/apache/mesos/blob/1.0.x/CHANGELOG).
- Marathon 1.3 [release notes](https://github.com/mesosphere/marathon/releases).

## Container Orchestration
#### Services ("Built-In" Marathon)
Marathon is not just one container orchestrator out of many that we support; it is our default way to run things on DC/OS, supporting the full range of DC/OS features. In this release we'll have a major change in the Services tab in DC/OS. The native DC/OS Marathon instance UI is now fully integrated with the DC/OS UI. You can access it from the [**Services**](/docs/1.8/usage/webinterface/) tab on the DC/OS UI. The new fully integrated UI no longer shows a list of frameworks, but shows an embedded Marathon. This means that all of your services and applications are in one place.

For more information, see the [documentation](/docs/1.8/usage/webinterface/#services).

#### Jobs - Ability to run scheduled jobs on DC/OS
There is now built-in support of running scheduled jobs. We created a new Apache Mesos framework called [Metronome](https://github.com/dcos/metronome). Metronome is integrated natively with DC/OS and is available from the [**Jobs**](/docs/1.8/usage/webinterface/) tab on the DC/OS UI. You can create and administer scheduled jobs directly from the Jobs tab. Similar to the Services tab for long-running applications, you can manage all of your Jobs from one centralized place. You can set up jobs with a scheduler by using the cron format.

Additionally, you can specify attributes like the time zone or a starting deadline. We also have a JSON view mode which allows you to specify everything in one file to easily copy and paste it. We will constantly improve and extend the given functionality. Metronome will likely replace Chronos as our DC/OS job framework. If you still need Chronos, you can get it from the DC/OS [Universe](https://github.com/mesosphere/universe).

For more information, see the [documentation](/docs/1.8/usage/jobs/).

## DC/OS Universal container runtime
The Universal container runtime extends the Mesos containerizer to support provisioning Docker container images (AppC coming soon). This means that you can use both the Mesos containerizer and other container image types in DC/OS. You can still use the Docker container runtime directly with DC/OS, but the Universal container runtime supports running Docker images independent of the Docker Engine, which allows for better integration with Mesos.

The Universal container runtime offers the following advantages:

* **Removes your dependency on the Docker daemon**: With previous versions of Docker, if the Docker daemon was not responsive, a restart to the daemon caused all containers to stop on the host. In addition, Docker must be installed on each of your agent nodes in order to use the Docker containerizer. This means that in order to use the Docker containerizer you need to upgrade Docker on the agent nodes each time a new version of Docker comes out.
* The Universal container runtime is more stable and allows deployment at scale.
* The Universal container runtime offers features not available in the Docker containerizer, such as GPU and CNI support.
* The Universal container runtime allows you to take advantage of continuing innovation within both the Mesos and DC/OS, including features such as IP per container, strict container isolation and more.

**Note**: The Universal container runtime is in the experimental phase. We encourage you to try it out and [let us know what you think](https://dcos.io/community/).

For more information, see the [documentation](/docs/1.8/usage/containerizers/).

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

For more information, see the [documentation](https://docs.mesosphere.com/1.8/usage/service-guides/hdfs/).

#### Kafka Service
DC/OS Universe has an updated DC/OS Kafka Service. The updated DC/OS Kafka Service now supports configuring ZK service for Apache Kafka.

For more information, see the [documentation](https://docs.mesosphere.com/1.8/usage/service-guides/kafka/).

#### Confluent Kafka Service
DC/OS Universe has a DC/OS Confluent Platform Service that is based on the DC/OS Kafka Service. Confluent offers support for the DC/OS Confluent Platform Service on DC/OS.

For more information, see the Universe [documentation](https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/C/confluent-kafka).

#### Cassandra Service
DC/OS Universe has an updated DC/OS Cassandra Service. The updated DC/OS Cassandra Service now supports multi-datacenter Cassandra ring topologies, and backup and restore with Azure Storage.

For more information, see the [documentation](https://docs.mesosphere.com/1.8/usage/service-guides/cassandra/).

#### Datastax Enterprise (DSE) Service
DC/OS Universe has a DC/OS DataStax Enterprise (DSE) Service that is based on the DC/OS Cassandra Service. DataStax offers support for the DC/OS DataStax Enterprise Service on DC/OS.

For more information, see the Universe [documentation](https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/D/dse).

#### Spark Service
DC/OS Universe has an updated version of Apache Spark based on 1.6.2.  In addition to all the of features of Apache Spark 1.6.2, the DC/OS Spark Service supports Kerberos and SSL with secure HDFS clusters. Latest stable Spark with coarse-grained scheduler.

For more information, see the [documentation](https://docs.mesosphere.com/1.8/usage/service-guides/spark/).

## Developer Agility

- New Artifactory Package. For more information, see the [documentation](https://github.com/JFrogDev/artifactory-dcos/).
- Artifactory Package. For more information, see the [documentation](https://github.com/JFrogDev/artifactory-dcos).
- Updated Jenkins packages. For more information, see the [documentation](https://docs.mesosphere.com/1.8/usage/service-guides/jenkins/).

## Enhanced Cloud Templates

- You can use customized Amazon Machine Images (AMI) based on CentOS 7 or CoreOS to launch DC/OS with the advanced templates. For more information, see the [documentation](/docs/1.8/administration/installing/cloud/aws/advanced/aws-ami/).
- You can create custom advanced templates for DC/OS and then deploy and run DC/OS from your own private S3 bucket. For more information, see the [documentation](/docs/1.8/administration/installing/cloud/aws/advanced/).

## Improved UI and CLI improvements
- See the CLI [release notes](https://github.com/dcos/dcos-cli/releases).

# <a name="minor"></a>Minor releases

## <a name="1-8-8"></a>1.8.8 - Feb 10, 2017

### New and changed features

- Marathon 1.3.9 [release notes](https://github.com/mesosphere/marathon/releases/tag/v1.3.9).
- Apache Mesos 1.0.3 [CHANGELOG](https://github.com/mesosphere/mesos/blob/dcos-mesos-1.0.3-rc1/CHANGELOG).

### Fixed issues DC/OS

#### DC/OS UI

- DCOS-9310 - Default memory for jobs is too low.
- DCOS-11482 - Jobs UI wipes "artifacts" part from the JSON job descriptor.
- DCOS-11559 - Switching from Bridge to Host Networking leaves portDefinitions that can cause conflicts with Marathon-LB.
- DCOS-11599 - Jobs attributes are stripped out and not available in UI.
- DCOS-11781 - Zeppelin package is missing from Universe in UI.
- DCOS-11887 - Cron example in the Jobs UI is wrong.
- DCOS-11984 - Error destroying a service.
- DCOS-13243 - Unable to revert Marathon app configuration to older version or switch between versions in the UI.
- DCOS-13530 - Label keys in the service create form are converted to uppercase.
- DCOS-13692 - DC/OS UI server connection errors because of 10s timeout for the Universe, and 2s timeout everywhere else.

#### Networking Services

- DCOS-10809 - DNS unavailable during DC/OS upgrade.
- DCOS-11704 - Agent node does not report virtual network logging errors.
- DCOS-12706 - LIBPROCESS_PORT must be explicitly set with Marathon (and other DC/OS services).
- DCOS-13192 - Virtual network agent modules have dependency on the Docker daemon at startup.
- DCOS-13193 - EDNS issues.
- DCOS-13211 - Cosmos admin and http ports are accessible from all interfaces in DC/OS. <!-- OSS -->
- DCOS-13430 - Virtual network service crashes after installing Marathon-LB.

### Fixed issues Marathon

- MARATHON-1309 - App groups are not structured properly for upgrades.
- DCOS-11560 - ZooKeeper Connection Timeout is not configurable.

### Fixed issues Mesos

- MESOS-6621 - Nodes continuously restarting, cannot recover.
- MESOS-6917 - Segfault when the executor sets an invalid UUID when sending a status update.

### Known issues

- DCOS_OSS-683 - Admin Router on DC/OS 1.8 fails with newer versions of curl. This behavior has been observed in CoreOS 1298.5.0 or newer. This can occur if you install DC/OS 1.8 with a recent version of CoreOS, or upgrade your existing distribution. This is fixed in DC/OS 1.9.
- DCOS_OSS-824 - HDFS 0.9.2-2.6.0 does not work on DC/OS 1.8 with newer versions of CoreOS. This is fixed in DC/OS 1.9.
