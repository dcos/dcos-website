# DC/OS 1.10.0 Beta 2

<div style="padding: 10px; border: 2px solid black; background-color: #e3e4e5;">
<h2>This beta release is for testing only and not to be used in production. It will only support new installations.</h2>
<h3>DC/OS 1.10.0 Beta 2 has a number of limitations that will be resolved at GA time:</h3>

<ul>
<li>Upgrades from 1.10.0 Beta 1 to 1.10.0 Beta 2 are not supported.</li>
<li>DC/OS 1.10 requires CLI version 0.5.3.
  <ul>
  <li><a href="/docs/1.10/cli/uninstall/">Uninstall the existing CLI</a>.</li>
  <li>Install version 0.5.3 using the <strong>Install CLI</strong> instructions in the dropdown in the upper left hand corner of the 1.10 DC/OS GUI.</li>
  </ul>
<li>You must upgrade Marathon-LB _before_ upgrading to DC/OS 1.10. See the [upgrade section](/1.10/installing/upgrading/) for more information.</li>
<strong>Note:</strong> CLI version 0.5.3 is not compatible with DC/OS 1.9.</li>
</ul>
<br />
Please try out the new features and updated data services. Provide any feedback through Jira: https://jira.dcos.io.
</div>

DC/OS 1.10 includes many new capabilities for Operators and expands the collection of Data & Developer Services with a focus on:
- Core DC/OS Service Continuity - System resilience, cluster and node checks, UCR and Pods improvements.
- CNI Networking enhancements for broader networking support.
- Data Services enhancements.

### Contents
- [New Features and Capabilities](#new-features)
- [Breaking Changes](#breaking-changes)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed since 1.10.0 Beta 1](#fixed-issues)

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
  Write your own custom health checks or use the predefined checks to access and use information about your cluster, including available ports, Mesos agent status, and IP detect script validation. [View the documentation](/docs/1.10/installing/custom/node-cluster-health-check/).
- Enhanced upgrades with pre/post flight checks.
- UCR.
- Scale and performance limits.

## CLI
- Multi-cluster support. [View the documentation](/docs/1.10/cli/multi-cluster-cli/).

## GUI
The GUI sidebar tabs have been updated to offer a more intuitive experience.

- The "Deployments" subpage under the "Services" tab has been moved to a toggle-able modal in the "Services" page.
- The "Universe" tab has been renamed to "Catalog" and the "Installed" subpage has been removed.
- The "System Overview" tab has been renamed to "Overview".

## Updated DC/OS Data Services

- Rolling Configuration Update and Upgrades support via CLI.
- Ability to deploy Data Services into Folders to enable multi team deployments.
- Ability to deploy to CNI-Based Virtual Networks.

The following updated data services packages are also in beta and are compatible with DC/OS 1.10.

- Beta Cassandra. [Documentation](https://docs.mesosphere.com/service-docs/beta-cassandra/v1.0.31-3.0.13-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/cassandra-1.0.31-3.0.13-beta).

- Beta Elastic. [Documentation](https://docs.mesosphere.com/service-docs/beta-elastic/v1.0.15-5.5.1-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/elastic-1.0.15-5.5.1-beta).

- Beta HDFS. [Documentation](https://docs.mesosphere.com/service-docs/beta-hdfs/v1.3.3-2.6.0-cdh5.11.0-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/hdfs-1.3.3-2.6.0-cdh5.11.0-beta).

- Beta Kafka. [Documentation](https://docs.mesosphere.com/service-docs/beta-kafka/v1.1.26-0.10.1.0-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/kafka-1.1.26-0.10.1.0-beta).

- Apache Spark. [Documentation](https://docs.mesosphere.com/service-docs/spark/v1.1.1-2.2.0/). [Release Notes](https://github.com/mesosphere/spark-build/releases/tag/1.1.1-2.2.0).

<a name="breaking-changes"></a>
# Breaking Changes

- Upgrades not supported from 1.10.0 Beta 1 to 1.10.0 Beta 2.
  Upgrades from 1.10.0 Beta 1 to 1.10.0 Beta 2 are _not supported_ in 1.10.0 Beta 2. This upgrade will be supported in a future 1.10 release.

- Marathon Networking API Changes in 1.5
  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md). <!-- linking to the marathon doc until I port the relevant information to the dc/os site -->

- The latest version of Marathon-LB is required for 1.10.
  Before upgrading to 1.10, uninstall your existing Marathon-LB package and reinstall the updated version. See the [upgrade section](/docs/1.10/installing/upgrading/) for more information.

- REX-Ray configuration change.
  DC/OS 1.10 upgrades REX-Ray from v03.3. to v0.9.0 and therefore the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the `REX-Ray_config` parameter of your `config.yaml` file, change the parameter to `REX-Ray_config_preset: aws`.

- New flow to change the `dcos_url` and login.
  The new command to change your cluster URL is `dcos cluster setup <dcos_url>`. This change will break any existing tooling that uses the former command. Backwards compatibility is slated for a future patch release.

# <a name="known-issues"></a>Known Issues and Limitations

- DCOS-13762 - SDK Integration with DC/OS Folders. <!-- resolved? -->
- DCOS-14534 - Marathon: Verbose Server Banner.
- DCOS-14536 - UI Vulnerable to Clickjacking (aka UI Redressing).
- DCOS-15590 - DCOS cli confirm() is not non-interactive safe.
- DCOS-16547 - Task state does not update after the agent running it was removed from the cluster.
- DCOS_OSS-1340 - Spartan "autoip" DNS should resolve to host IP for UCR in bridge network.
- INFINITY-1143 - Update / Uninstall. DSE does not support rolling upgrade.

# <a name="fixed-issues"></a>Major Issues Fixed Since 1.10.0 Beta 1

- Upgrades from DC/OS 1.9 are supported.
- CASSANDRA-613 - Replace of Cassandra Nodes doesn't work with duplicate Hostname/IPs.
- DCOS-5809	- Admin Router: use "variables approach" for DNS name re-resolution instead of periodic worker process reload.
- DCOS-14469 - Pods displaying duplicate image of same container.
- DCOS-14535 - Marathon GUI: Error Messages are Too Verbose.
- DCOS-15902 - Add documentation for the dcos-backup CLI.
- DCOS-15937 - Pods do not receive SIGTERM.
- DCOS-16088 - The flow for changing the dcos_url and login has changed.
- DCOS-16225 - Edit modal for SDK services should mention the CLI.
- DCOS-16144 - DC/OS CLI: AttributeError: 'str' object has no attribute 'status_code'.
- DCOS-16151 - Marathon Endpoints are not responding.
- DCOS-16528 - Incorrect command in Edit Service modal.
- DCOS-16564 - UI error message references Marathon command.
- DCOS-17219 - Marathon-LB broken in DC/OS 1.10.
- DCOS-17284 - [1.10] GUI bug: container type must be defined.
- DCOS-17294 - Unable to curl (resolve) applications using Mesos DNS names.
- DCOS-17321 - Fix upgrade of Marathon-lb from 1.9-1.10.
- DCOS-17502 - Marathon cannot retrieve JSON web key set: 'the trustAnchors parameter must be non-empty'.
- DCOS-17511 - cockroachdb: upgrade to v1.0.4.
- DCOS-17581 - bootstrap: consolidate write_java_truststore_with_dcos_ca_bundle for concurrent execution.
- DCOS-17979 - Remove "Open Service" from UI for SDK-based Services.
- DCOS-17982 - Remove the suspend button for SDK services.
- DCOS_OSS-1014	- Admin Router: Document /service endpoint behaviour and limitations.
- DCOS_OSS-1398	- Instructions for forcing `dcos-docker` to use docker 1.13.1 are incorrect.
- DCOS_OSS-1470 - Exhibitor: use PatternLayoutEscaped logger layout for structured journal logger.
- DCOS_OSS-1486 - Metrics agent crashes when the mesos containers endpoint is missing fields.
- DCOS_OSS-1524	- `dcos-diagnostics --diag` returns false positives during DC/OS install.
- INFINITY-1912	- Update CLI to reflect Cosmos update fixes.
- INFINITY-1988	- Suppress/revive out of sync with Mesos.
- INFINITY-2114 - Flaky Uninstall.
- INFINITY-2115	- Kibana will not uninstall.
- MARATHON-7469 - Marathon killed tasks involved in Deployment after leader election.
- MARATHON-7521	- Histograms, counters, min-max-counters, and timers are duplicated in /metrics.
- MARATHON-7574	- MetricsTimerTest fails 2% of the time.
- MARATHON-7575	- DeleteAppAndBackupIntegrationTest fails 3% of the time.
- MARATHON-7654	- Marathon cannot replace persistent tasks for rebooted hosts until the Mesos Master forgets about the old agent.
- MARATHON-7688	- VIP does not work with pods on overlay.
- MESOS-6950 - Launching two tasks with the same Docker image simultaneously may cause a staging dir never cleaned up.
