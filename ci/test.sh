#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

set -x

# Workaround for https://github.com/dodo/node-unicodetable/issues/6
# The unicode npm package fails to install on most OSes if unicode.org is blacklisting your IP.
export NODE_UNICODETABLE_UNICODEDATA_TXT="$(pwd)/UnicodeData.txt"

curl -X POST http://leader.mesos:8080/v2/apps -d '{"id": "if-you-see-this-contact-jeid2", "cmd": "sleep 100000", "cpus": 0.1, "mem": 10.0, "instances": 1}' -H "Content-type: application/json"

npm install
CI=true npm test
