#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

PORT="${PORT:-80}"

if [[ "${PORT}" != "80" ]]; then
  # listen port has to be updated in nginx or redirects will truncate the port
  docker run -d -p ${PORT}:${PORT} mesosphere/dcos-website bash -c "sed -i -E 's/listen( *)80/listen\1${PORT}/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
else
  docker run -d -p ${PORT}:${PORT} mesosphere/dcos-website
fi
