# DC/OS website

| Environment | URL | Build Status |
|-------------|-----|--------------|
| Production | <https://dcos.io> | [![Prod Build Status](https://jenkins.mesosphere.com/service/jenkins/buildStatus/icon?job=public-dcos-website-deploy-prod)](https://jenkins.mesosphere.com/service/jenkins/job/public-dcos-website-deploy-prod/) |
| Development | <https://dev.dcos.io> | [![Dev Build Status](https://jenkins.mesosphere.com/service/jenkins/buildStatus/icon?job=public-dcos-website-deploy-dev)](https://jenkins.mesosphere.com/service/jenkins/job/public-dcos-website-deploy-dev/) |

## Issue tracking
Please report issues in the [DCOS JIRA instance](https://jira.dcos.io/) (Project: [DCOS_SITE](https://jira.mesosphere.com/projects/DCOS_SITE/issues/)).
**Issues on GitHub will be disabled soon.**

Table of contents:

- [Contribution Workflow](#contribution-workflow)
- [Testing your updates locally](#testing-your-updates-locally)
- [Managing redirects](#managing-redirects)
- [Promoting site to live](#promoting-site-to-live)
- [Link checking](#link-checking)
- [Technology](#technology)

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

1. Create a new feature branch:

    ```
    git checkout -b feature/<feature-name>
    ```

1. Make local changes.

1. Test your changes [locally](#).

1. Add and commit changes:

    ```
    git add -p .
    git commit
    ```

1. Rebase repo fork to include recent `dcos/dcos-website:develop` changes. Rebasing a repo (instead of merging) will keep your fork commit history clean and move all your changes to the top of the commit log.

    ```
    git fetch origin
    git pull --rebase origin develop
    ```
    **Tip:** May require resolving conflicts.

1. Push changes to repo fork feature branch:

    ```
    git push -u fork feature/<feature-name>
    ```

1. [Create a pull request](https://help.github.com/articles/creating-a-pull-request/) from the repo fork feature branch to `dcos/dcos-website:develop`.

Once changes are accepted and merged to the develop branch, CI will push the updates to <https://dev.dcos.io/>.

## Testing your updates locally

1.  Update the dcos-docs submodule:

    ```
    git submodule update --init --recursive
    ```

1.  Build a local version of the doc site. The DC/OS website can be built locally using Node or run in an Nginx Docker container.

- Using Easy Mode
    1. [Install Docker Toolkit](https://www.docker.com/products/docker-toolbox)

    1. Run dev server

        ```
        make
        ```

    1. Go to [running server](http://localhost:3000)

- Using Node
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

    1. Verify changes on localhost server (updates automatically when files are changed).

- Using an Nginx Docker image

    1. [Install Docker Toolkit](https://www.docker.com/products/docker-toolbox)

    1. Configure your shell:
        ```
        eval $(/usr/local/bin/docker-machine env default)
        ```
    1. Build the website server Docker image:

        ```
        ci/docker-build-image.sh
        ```
    1. Run the website server in Docker:

        ```
        SERVER_CID="$(ci/docker-run.sh)"
        ```
    1. By default, the server runs on port 80. You can find the server IP by running
        ```
        docker-machine ip default
        ```

    1. Stop the website server:

        ```
        docker rm -f "${SERVER_CID}"
        ```

## Promoting site to live

To promote the dev site to live, rebase `develop` to `master`:

```
$ git checkout develop
$ git pull
$ git submodule update --init --recursive
$ ci/promote.sh
```

Continuous integration will handle deploying updates (`ci/deploy.sh`), updating redirects (`ci/update-redirects.sh`), and updating the S3 website config (`ci/update-website-conifg.sh`).

**Tip:** If you receive this error `Found unstaged changes - Exiting`, run the submodule update command:

```
$ git submodule update --init --recursive
```

## Managing redirects

There are two types of redirects, stored in two different files:

- Page Redirects: `https://github.com/dcos/dcos-website/redirect-files`
- Prefix Redirects: `https://github.com/dcos/dcos-website/redirect-prefixes`

That both use following format:

```
/from/ /to/
```

Both types of redirects are processed and used in the S3, npm/gulp, and docker/nginx environments.

The "current" version of DC/OS that corresponds to `/docs/latest/` is managed in the `redirect-prefixes` file.

## Versioning

- To create a new version picker dropdown item, modify `layouts/docs.jade` and `gulpfile.js`.

-  When a new version GAs, modify the `redirect-prefixes` file. For example, this denotes that 1.8 is the default version:

   ```
   /docs/latest/ /docs/1.8/
   ```


## Link checking

Validating links requires building and running a local site. You can run a local site as a standalone process or alternatively as a part of a [docs build](#updating-the-documentation).

1. Build the website server Docker image:

    ```
    ci/docker-build-image.sh
    ```
1. Start the website server in Docker and remember the container ID:

    ```
    SERVER_CID="$(PORT=3000 ci/docker-run.sh)"
    ```
1. Run link validation in Docker:

    ```
    ci/docker-validate-links.sh
    ```
1. Stop the website server

    ```
    docker rm -f "${SERVER_CID}"
    ```


## Technology

Built using [Metalsmith](http://metalsmith.io).

## License and Authors

Copyright 2017 Mesosphere, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this repository except in compliance with the License.

The contents of this repository are solely licensed under the terms described in the [LICENSE file](./LICENSE) included in this repository.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Authors are listed in [AUTHORS.md file](./AUTHORS.md).
