## [1.8.1 - August 2016](/releases/1.8.1)

## Fixes and enhancements
Over 1350 other fixes and enhancements to DC/OS and DC/OS Services, including:

- DCOS-7415 - Unable to fetch /v2/tasks as plaintext for Marathon 0.15.3 in some cases.
- DCOS-7422 - Improved reconnect logic in the case of root Marathon / Mesos master disconnections.
- DCOS-7810 - Invalid IDs inside of nested groups leading to unexpected blocked deployments.
- DCOS-7926 - Improved Marathon performance while deploying thousands of tasks.
- DCOS-8128 - Improved Marathon task recovery in the case of some network events.
- DCOS-8370 - Apps should not be able to share the same service port on a single host.
- DCOS-8730 - Admin Router does not respect ports provided by external proxy.
- MARATHON-888 - Improved handled of orphaned containers after master failover.
- MARATHON-956 - Improved Marathon performance to prevent occurrence of "futures timed out" errors.

## <a name="known-issues"></a>Known issues and limitations

- DCOS-270 - Docker version 1.12.x is not supported.
- DCOS-8975 - Port mapping for virtual networks is not displayed correctly. <!-- OSS -->
