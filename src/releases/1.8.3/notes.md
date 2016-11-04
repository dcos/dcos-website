## [1.8.3 - September 6, 2016](/releases/1.8.3)

### New and changed features

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


### Fixed issues

- Bug fixes to the [mesos-overlay-modules](https://github.com/dcos/mesos-overlay-modules).
- Bug fixes to the [Navstar component](https://github.com/dcos/navstar).
- [DCOS-321](https://dcosjira.atlassian.net/browse/DCOS-321) - Bug fixes to configuring OAuth in the AWS advanced templates.
- [DCOS-326](https://dcosjira.atlassian.net/browse/DCOS-326) - Azure downloads URL is fixed.
