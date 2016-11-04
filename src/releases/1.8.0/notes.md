## [1.8.0 - October 13, 2016](/releases/1.8.0)

The release notes provide a list of useful topics and links for DC/OS.

### Breaking Changes

- Manual modifications of Admin Router config are not supported. If you require a custom certificate, you must run [HAProxy in front of Admin Router](/docs/1.8/administration/haproxy-adminrouter/).
- Network Time Protocol (NTP) must be enabled on all nodes for clock synchronization. For more information, see the [documentation](/docs/1.8/administration/installing/custom/system-requirements/).
- The `AcceptEULA` parameter was removed from [AWS templates](/docs/1.8/administration/installing/cloud/aws/). Any scripts written to deploy these templates may need to be updated so the parameter is no longer passed when deploying the templates.

### What's New

#### Apache Mesos 1.0 and Marathon 1.3 RC integrated
- Apache Mesos 1.0 [CHANGELOG](https://github.com/apache/mesos/blob/1.0.x/CHANGELOG).
- Marathon 1.3 RC [release notes](https://github.com/mesosphere/marathon/releases).

[Read more...](/releases/1.8.0)
