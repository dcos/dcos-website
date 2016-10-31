#!/usr/bin/env bash

# LinkChecker
# Manual: https://wummel.github.io/linkchecker/man1/linkchecker.1.html
# Docker Image: https://hub.docker.com/r/mesosphere/linkchecker/
# Dockerfile: https://github.com/mesosphere/docker-containers/blob/master/utils/linkchecker/Dockerfile
# Site: http://wummel.github.io/linkchecker/
# Source: https://github.com/wummel/linkchecker

# IMPORTANT: Run site first
# docker build -t mesosphere/dcos-website .
# PORT=3000 ci/start.sh

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

REPORT_DIR="${REPORT_DIR:-reports}"
URL="${URL:-}"
PORT="${PORT:-3000}"

# docker-machine has to be initialized in every new shell
DOCKER_INIT=""
if hash docker-machine 2>/dev/null; then
  DOCKER_MACHINE="$(docker-machine ls -q --filter state=Running)"
  if [[ -n "${DOCKER_MACHINE}" ]]; then
    # init docker env
    DOCKER_INIT="$(docker-machine env "${DOCKER_MACHINE}")"
  fi
fi

# if URL is not provided, use the docker host and PORT instead
if [[ -z "${URL}" ]]; then
  DOCKER_HOST="$(eval "${DOCKER_INIT}" && docker run --rm joffotron/docker-net-tools -c "netstat -nr | grep '^0\.0\.0\.0'" | awk '{print $2}')"
  URL="http://${DOCKER_HOST}:${PORT}/"
fi

# create report dir
mkdir -p -m 777 "${REPORT_DIR}"

# delete old reports
rm "${REPORT_DIR}/linkchecker."*

eval "${DOCKER_INIT}"

docker run --rm \
  --volume "$(pwd):/workdir" \
  --workdir "/workdir" \
  mesosphere/linkchecker \
  linkchecker \
    --complete --anchors --check-extern \
    --user-agent="curl/7.24.0" \
    --output=text \
    --file-output="csv/${REPORT_DIR}/linkchecker.csv" \
    --file-output="html/${REPORT_DIR}/linkchecker.html" \
    "${URL}"
