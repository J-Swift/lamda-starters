#!/usr/bin/env sh

set -eu

main() {
  rm -rf out
  mkdir out
  zip -r out/lambda.zip index.js node_modules 1>/dev/null

  echo 'Done'
}

main
