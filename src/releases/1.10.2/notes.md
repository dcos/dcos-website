# Issues Fixed in DC/OS 1.10.2

- DCOS_OSS-1508 - The DC/OS CLI now ignores output when opening a browser window so that users do not see error information when prompted for the authentication token.
- DCOS_OSS-1795 - Removed sensitive config values from diagnostics bundles and build output.
- DCOS_OSS-1818 - DC/OS Metrics now sanitizes metrics names.
- DCOS_OSS-1825 - DC/OS layer 4 load balancer now periodically checks that the IPVS configuration matches the desired configuration and reapplies if the configuration is absent.
- DCOS-19452 - The DC/OS OpenSSL library is now configured to not support TLS compression anymore (compression allows for the CRIME attack).
- DCOS-19009 - The DC/OS CLI can now retrieve metrics for DC/OS data services.

# Notable changes in DC/OS 1.10.2

- Support for RHEL 7.4.
- Updated to Mesos 1.4.0 ([changelog](https://gitbox.apache.org/repos/asf?p=mesos.git;a=blob_plain;f=CHANGELOG;hb=1.4.0)).
- Updated to Marathon 1.5.2 ([changelog](https://github.com/mesosphere/marathon/releases/tag/v1.5.2)).
- DCOS-17947 - Updated configuration example for a cluster that uses [custom Docker credentials](https://docs.d2iq.com/mesosphere/dcos/1.10/deploying-services/private-docker-registry/).
- DOCS-1925 - Clarified how operators can [recover from a full agent disk](https://docs.d2iq.com/mesosphere/dcos/1.10/administering-clusters/recovering-agent-disk-space/).

# Issues Fixed in DC/OS 1.10.1

- COPS-974 - Master node fails to start after configuration change. This was was due to tmp mountpoints being marked as noexec. Bug fixed.
- DCOS-18212 - In the UI, the name of the containerizer runtime in the service creation form has been changed from MESOS RUNTIME to UNIVERSAL CONTAINER RUNTIME (UCR).
- DCOS-18694 - Pod Endpoints protocol json parser adds 0 to json. Bug fixed.
- DCOS-18788 - The JSON editor duplicates and fails to properly parse app definition. Bug fixed.
- DCOS-19197 - DC/OS UI deletes environment variables with non-string values from Marathon app/pod definitions. Bug fixed.
- DCOS_OSS-1661 - Installer prints large traceback when checks fail during --postflight. A clearer error message is now provided.
- DOCS-2077 - DC/OS 1.10 Custom Installation documentation: clarified where the `/opt/mesosphere` directory must be.

# Notable Changes in DC/OS 1.10.1

- Support for Docker CE 17.03.0.
- Marathon 1.5.1.2 and Mesos 1.4.0-rc4 are integrated with DC/OS 1.10.1.
- DCOS-18055 - Improvements for deployment behavior in Catalog. You now have a "Review & Run" button that allows you to cancel, modify your configuration, or install with defaults.
- Support for Centos 7.4.

# Issues Fixed in 1.10.0

- CASSANDRA-457 - Redirect deprecated /v1/nodes/connect to /v1/connect.
- CORE-849 - Support DC/OS commons services on public agents.
- DCOS-13988 - Filter/Search Design Update.
- DCOS-16029 - Addition of new pullConfig properties break validation.
- DCOS-10863 - Launch containers on `DockerContainerizer` if network mode is "NONE".

# About DC/OS 1.10

DC/OS 1.10 includes many new capabilities for Operators and expands the collection of Data & Developer Services with a focus on:
- Core DC/OS Service Continuity - System resilience, cluster and node checks, UCR and Pods improvements.
- CNI Networking enhancements for broader networking support.
- Kubernetes is now available on DC/OS.
- Data Services enhancements.

Please try out the new features and updated data services. Provide any feedback through Jira: https://jira.dcos.io.

### Contents
- [New Features and Capabilities](#new-features)
- [Breaking Changes](#breaking-changes)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed since 1.10.0 Beta 2](#fixed-issues)

# <a name="new-features"></a>New Features and Capabilities

## Apache Mesos 1.4 and Marathon 1.5 Integrated.
- DC/OS 1.10 is is based on Mesos 1.4.0, here using master branch (pre-release) SHA 013f7e21, with over 1200 commits since the previous Mesos version. View the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

- DC/OS 1.10 is integrated with the latest release of Marathon, version 1.5. Resulting breaking changes and new features are documented below. For more information about Marathon 1.5, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Networking
- Configurable Spartan upstreams for domains (dnames).
  You can now configure Spartan to delegate a particular domain (e.g. "\*.foo.company.com") to a particular upstream. <!-- I could use more information here -->

- Increased CNI network support.
  DC/OS now supports any type of CNI network. [View the documentation](/docs/1.10/networking/virtual-networks/cni-plugins/).

## Platform
- Node and Cluster health checks.
  Write your own custom health checks or use the predefined checks to access and use information about your cluster, including available ports, Mesos agent status, and IP detect script validation.
- Enhanced upgrades with pre/post flight checks.
- Universal Container Runtime (UCR).
  Adds port mapping support for containers running on the CNI network. Port mapping support allows UCR to have a default bridge network, similar to Docker's default bridge network. This gives UCR feature parity with Docker Engine enabling use of Mesos Runtime as the default container runtime. [View the documentation](/docs/1.10/deploying-services/containerizers/).
- Scale and performance limits.

## CLI

- DC/OS 1.10.0 requires DC/OS CLI 0.5.x.
- DC/OS CLI 0.5.x adds [multi-cluster support](/docs/1.10/cli/multi-cluster-cli/) with [`dcos cluster`](/docs/1.10/cli/command-reference/dcos-cluster) commands. Multi-cluster support has a number of consequences:

   - DC/OS CLI 0.4.x and 0.5.x use a different structure for the location of configuration files. DC/OS CLI 0.4.x has a single configuration file, which by default is stored in `~/.dcos/dcos.toml`. DC/OS CLI 0.5.x has a configuration file for each connected cluster, which by default are stored in `~/.dcos/clusters/<cluster_id>/dcos.toml`.
   - DC/OS CLI 0.5.x introduces the `dcos cluster setup` command to configure a connection to a cluster and log into the cluster.
   - **Note:**
     -  Updating to the DC/OS CLI 0.5.x and running any CLI command triggers conversion from the old to the new configuration structure.
     - _After_ you call `dcos cluster setup`, (or after conversion has occurred), if you attempt to update the cluster configuration using a `dcos config set` command, the command prints a warning message saying the command is deprecated and cluster configuration state may now be corrupted.
  - If you have the `DCOS_CONFIG` environment variable configured:
    - After conversion to the new configuration structure, `DCOS_CONFIG` is no longer honored.
    - _Before_ you call `dcos cluster setup`, you can change the configuration pointed to by `DCOS_CONFIG` using `dcos config set`. This command prints a warning message saying the command is deprecated and recommends using `dcos cluster setup`.
  - CLI modules are cluster-specific and stored in `~/.dcos/clusters/<cluster_id>/subcommands`. Therefore you must install a CLI module for each cluster. For example, if you connect to cluster 1, and install the Spark module, then connect to cluster 2 which is also running Spark, Spark CLI commands are not available until you install the module for that cluster.

## GUI
The GUI sidebar tabs have been updated to offer a more intuitive experience.

- The "Deployments" subpage under the "Services" tab has been moved to a toggle-able modal in the "Services" page.
- The "Universe" tab has been renamed to "Catalog" and the "Installed" subpage has been removed.
- The "System Overview" tab has been renamed to "Overview".

## Kubernetes on DC/OS

- Kubernetes on DC/OS is beta with DC/OS 1.10.0. Install from the DC/OS Service Catalog or use the [quickstart](https://github.com/mesosphere/dcos-kubernetes-quickstart).

## Updated DC/OS Data Services

- Ability to deploy Data Services into Folders to enable multi team deployments.
- Ability to deploy to CNI-Based Virtual Networks.

The following updated data services packages are compatible with DC/OS 1.10.

- Cassandra. [Documentation](https://docs.mesosphere.com/service-docs/cassandra/).[Release Notes](https://docs.mesosphere.com/service-docs/cassandra/v2.0.0-3.0.14/release-notes/).

- Elastic. [Documentation](https://docs.mesosphere.com/service-docs/elastic/). [Release Notes](https://docs.mesosphere.com/service-docs/elastic/v2.0.0-5.5.1/release-notes/).

- HDFS. [Documentation](https://docs.mesosphere.com/service-docs/hdfs/). [Release Notes](https://docs.mesosphere.com/service-docs/hdfs/v2.0.0-2.6.0-cdh5.11.0/release-notes/).

- Kafka. [Documentation](https://docs.mesosphere.com/service-docs/kafka/). [Release Notes](https://docs.mesosphere.com/service-docs/kafka/v2.0.0-0.11.0/release-notes/).

- Apache Spark. [Documentation](https://docs.mesosphere.com/service-docs/spark/). [Release Notes](https://github.com/mesosphere/spark-build/releases/tag/1.1.1-2.2.0).

<a name="breaking-changes"></a>
# Breaking Changes

- Marathon Networking API Changes in 1.5.

  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md). <!-- linking to the marathon doc until I port the relevant information to the dc/os site -->

- The latest version of Marathon-LB is required for 1.10.

  Before upgrading to 1.10, uninstall your existing Marathon-LB package and reinstall the updated version. See the [upgrade section](/docs/1.10/installing/oss/upgrading/) for more information.

- REX-Ray configuration change.

  DC/OS 1.10 upgrades REX-Ray from v0.3.3. to v0.9.0 and therefore the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the `REX-Ray_config` parameter of your `config.yaml` file, change the parameter to `REX-Ray_config_preset: aws`.

- New flow to change the `dcos_url` and login.

  The new command to change your cluster URL is `dcos cluster setup <dcos_url>`. This change will break any existing tooling that uses the former command. Backwards compatibility is slated for a future patch release.

- Hard CFS CPU limits enabled by default.

  DC/OS 1.10 enforces hard CPU limits with CFS isolation for both the Docker and Universal Container Runtimes. This will provide more predictable performance across all tasks, but might lead to a slowdown for tasks (and also deployments) that had previously consumed more CPU cycles than allocated.
See [MESOS-6134](https://issues.apache.org/jira/browse/MESOS-6134) for more details.

# <a name="known-issues"></a>Known Issues and Limitations

- Upgrade: During upgrade to DC/OS 1.10, there is a brief moment when the DNS resolution does not work. If a health check runs at that moment, it will fail and services will be reported as unhealthy.
- CORE-1125 - Docker image pull config is re-used.
- DCOS-16547 - Task state does not update after the agent running it was removed from the cluster.
- MARATHON-7736 - Marathon Client Java library does NOT work with Marathon 1.5.
