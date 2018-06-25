#!/usr/bin/env bash

set -e
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd -P)"
cd "${REPO_ROOT}"

set -x

# Workaround for https://github.com/dodo/node-unicodetable/issues/6
# The unicode npm package fails to install on most OSes if unicode.org is blacklisting your IP.
export NODE_UNICODETABLE_UNICODEDATA_TXT="$(pwd)/UnicodeData.txt"

npm rebuild node-sass --force
npm install
CI=true npm test
