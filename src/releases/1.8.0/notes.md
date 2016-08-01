The release notes provide a list of useful topics and links for DC/OS.

# Container Orchestration <!-- OSS -->

Marathon is not just one container orchestrator out of many that we support; it is our default way to run things on DC/OS, supporting the full range of DC/OS features. In this release we'll have a major change in the Services tab in DC/OS. The native DC/OS Marathon instance UI is now fully integrated with the DC/OS UI. You can access it from the [**Services**](/docs/1.8/usage/webinterface/) tab on the dashboard. The new fully integrated UI shows no longer a list of frameworks, but shows an embedded Marathon. This means all your services and applications are in one place.

There is now built-in support of running scheduled jobs. We created a new Apache Mesos framework called [Metronome](https://github.com/dcos/metronome). Metronome is integrated natively with DC/OS and is available from the DC/OS UI [**Jobs**](/docs/1.8/usage/webinterface/) tab on the dashboard. You can create and administer scheduled jobs directly from the Job tab. Similar to the Service tab for long-running applications, you can manage all of your Jobs from one centralized place. You can set up jobs with a scheduler by using the cron format.

Additionally, you can specify attributes like the time zone or a starting deadline. We also have a JSON view mode which allows you to specify everything in one file to easily copy and paste it. We will constantly improve and extend the given functionality. Metronome will likely replace Chronos as our DC/OS job framework. If you still need Chronos, you can get it from the DC/OS [Universe](https://github.com/mesosphere/universe).

<!-- You can manage Jobs via DC/OS CLI. We will have support for CRUD commands for jobs as well as for schedules. This means we support the same commands as in the UI. Please note that we currently only allow one schedule per job. We will change that in future releases. For further information please look at the CLI Command Reference. -->


# Networking <!-- OSS -->

## IP per Container with Extensible Virtual Networks (SDN)

DC/OS comes built-in with support Virtual Networks leveraging Container Network Interface (CNI) standard. By default, there is one Virtual Network named `dcos` is created and any container that attaches to a Virtual Network, receives its own dedicated IP. This allows users to run workloads that are not friendly to dynamically assigned ports and would rather bind the existing ports that is in their existing app configuration. Now, with support for dedicated IP/Container, workloads are free to bind to any port as every container has access to the entire available port range.

## Network Isolation of Virtual Network Subnets

DC/OS now supports the creation of multiple virtual networks at install time and associate non-overlapping subnets with each of the virtual networks. Further, DC/OS users can program Network Isolation rules across DC/OS agent nodes to ensure that traffic across Virtual Network subnets is isolated.

For more information, see the [documentation](/docs/1.8/administration/overlay-networks/).

<!-- DNS Based Distributed LB Service Addresses -->
<!-- Workload Isolation and Management -->
<!-- Network Isolation and Management -->

# CLI <!-- OSS -->

Installing the DC/OS CLI should be easy as possible now. We’ve replaced the install script with a simple binary CLI. For more information, see the [documentation](/docs/1.8/usage/cli/install/).

# <a name="mesos"></a>DC/OS Mesos Update <!-- OSS -->

The Apache Mesos kernel is now at [version 1.0.0](https://github.com/apache/mesos/blob/1.0.x/CHANGELOG).


# <a name="known-issues"></a>Known Issues and Limitations <!-- OSS -->

- DCOS-8208 - ZK credentials not configurable in CF templates

- **Overlay Network** - No API informs the service that an agent has exhausted its IP address range. If the agent runs out of addresses, the agent will send a `TASK_FAILED` message to the service. The service should interpret this message as an indication that the agent has exhausted its IP address range.
