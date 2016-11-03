## [1.8.4 - September 15, 2016](/releases/1.8.4)

### New and changed features

- DCOS-8848 - Experimental support for unified containerizer in DC/OS.
- DOCS-1113 - `dcos jobs` command is now available in the CLI. For more information, see the [documentation](/docs/1.8/usage/cli/command-reference/).

### Fixed issues

- DCOS-9637 - Now reports the correct URL for AWS templates.
- DCOS-9104 - Task count and resources are correct in the UI.
- DCOS-9617 - The UID of remote users is shown in the UI.
- DCOS-9191 - Added DNS for discoverable services to the UI.
- DCOS-9162 - Enabled Kill and Scale for locked services.

### Known issues and limitations
- DCOS-9783 - Package service broken with `java.security.InvalidAlgorithmParameterException: the trustAnchors parameter must be non-empty`. The workaround is to restart the Package service (`dcos-cosmos.service`).
