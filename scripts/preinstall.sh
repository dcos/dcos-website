#!/bin/bash

METALSMITH_TAGS_VERSION=`node -e "console.log(require('./package.json').devDependencies['metalsmith-tags']);"`

if [ -z "$METALSMITH_TAGS_VERSION" ]; then
  exit 0
fi

export NODE_UNICODETABLE_UNICODEDATA_TXT="$(pwd)/UnicodeData.txt"

npm install metalsmith-tags@$METALSMITH_TAGS_VERSION
