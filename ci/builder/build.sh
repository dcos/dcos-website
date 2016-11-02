#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/../.." && pwd -P)"
cd "${REPO_ROOT}/ci/builder"

docker build -t mesosphere/dcos-website-builder .
