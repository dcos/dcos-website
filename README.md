# DC/OS website

| Environment | URL | Build Status |
|-------------|-----|--------------|
| Production | <https://dcos.io> | [![Prod Build Status](https://jenkins.mesosphere.com/service/jenkins/buildStatus/icon?job=public-dcos-website-deploy-prod)](https://jenkins.mesosphere.com/service/jenkins/job/public-dcos-website-deploy-prod/) |
| Development | <https://dev.dcos.io> | [![Dev Build Status](https://jenkins.mesosphere.com/service/jenkins/buildStatus/icon?job=public-dcos-website-deploy-dev)](https://jenkins.mesosphere.com/service/jenkins/job/public-dcos-website-deploy-dev/) |

**Issue tracking is moving to the [DCOS JIRA](https://dcosjira.atlassian.net/) (Project: [SITE](https://dcosjira.atlassian.net/projects/SITE/issues)).
Issues on GitHub will be disabled soon.**

## Contribution Workflow

1. [Create a repo fork in GitHub](https://guides.github.com/activities/forking/)
1. [Clone the dcos/dcos-website repo](https://help.github.com/articles/cloning-a-repository/)
1. Add repo fork as remote repo:

    ```
    git remote add fork https://github.com/<github-user>/dcos-website
    git fetch fork
    ```
1. Checkout the develop branch:

    ```
    git checkout develop
    ```
1. Update the dcos-docs submodule:

    ```
    git submodule update --init --recursive
    ```
1. [Install Node](https://docs.npmjs.com/getting-started/installing-node)
1. Install dependencies:

    ```
    npm install
    ```
1. Launch local dev server:

    ```
    npm start
    ```
    (opens dev server in browser)
1. Create a new feature branch:

    ```
    git checkout -b feature/<feature-name>
    ```
1. Make local changes
1. Verify changes in dev server (updates automatically when files are changed)
1. Add and Commit changes

    ```
    git add -p .
    git commit
    ```
1. Rebase repo fork to include recent dcos/dcos-website:develop changes

    Rebasing a repo (instead of merging) will keep your fork commit history clean and move all your changes to the top of the commit log.

    ```
    git pull --rebase origin develop
    ```
    (may require resolving conflicts)
1. Push changes to repo fork feature branch

    ```
    git push -u fork feature/<feature-name>
    ```
1. [Create a pull request](https://help.github.com/articles/creating-a-pull-request/) from the repo fork feature branch to dcos/dcos-website:develop


Once changes are accepted and merged to the develop branch, CI will push the updates to <https://dev.dcos.io/>.

## Validate Links

```
SERVER_CID="$(ci/start.sh)"
ci/generate-linkchecker-report.sh
docker rm -f "${SERVER_CID}"
```

## Update the Docs

Docs should be updated on `develop` by maintainers to avoid git sha merge conflicts:

```
git checkout origin develop
scripts/bump_docs.sh
git push
```

## Promote to Production

Once changes have been previewed and accepted on <https://dev.dcos.io/>, the maintainers will rebase `develop` to `master`:

```
ci/promote.sh
```

Continuous integration will handle deploying updates (`ci/deploy.sh`), updating redirects (`ci/update-redirects.sh`), and updating the S3 website config (`ci/update-website-conifg.sh`).

## Adding New Redirects

- Page Redirects

    Add to `redirects` with the following format:

    /from/ /to/
- Prefix Redirects

    Add a `RoutingRules` entry to `s3-bucket-website-config.json`.

    Make sure `"HostName": "dcos.io"`. Continuous integration (`ci/update-website-conifg.sh`) will handle replacing with `dev.dcos.io` when run from the `develop` branch.

## Technology

Built using [Metalsmith](http://metalsmith.io).

## License and Authors

Copyright 2016 Mesosphere, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this repository except in compliance with the License.

The contents of this repository are solely licensed under the terms described in the [LICENSE file](./LICENSE) included in this repository.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Authors are listed in [AUTHORS.md file](./AUTHORS.md).
