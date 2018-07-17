#!/bin/bash

if [ ! -d tmp/node_modules ]; then
  mkdir -p tmp/node_modules
fi

if ! docker images | grep docs-runner; then
  docker build -f build-artifacts/Dockerfile -t docs-runner .
fi

docker run -it -p 3000:3000 -p 3001:3001 -v $PWD:/website \
  -v $PWD/tmp/node_modules:/website/node_modules \
  docs-runner:latest /website/scripts/run-server.sh
