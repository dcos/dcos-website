#!/usr/bin/env bash

script_dir=$(dirname $0)

${script_dir}/staged_shortlog | git ci -F -
