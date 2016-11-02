#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

ci/builder/build.sh

docker run -v "$(pwd):/dcos-website" mesosphere/dcos-website-builder

#TODO: move to gulp/npm build
ci/generate-nginx-conf.sh > nginx.conf

docker build -t mesosphere/dcos-website .
