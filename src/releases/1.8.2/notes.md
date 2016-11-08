## [1.8.2 - August 25, 2016](/releases/1.8.2)

### New and changed features

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

### Fixed issues

- Named VIPS with 2 or more ports in use.
- `dcos-adminrouter-reload.service`
- Diagnostics component checking of timer units which exit non-zero (found the `dcos-adminrouter-reload` bug).
