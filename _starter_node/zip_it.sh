#!/usr/bin/env sh

set -eu

main() {
  rm -rf out
  mkdir out

  echo 'installing packages...'
  npm install >/dev/null 2>&1

  echo 'zipping...'
  zip -r out/lambda.zip index.js node_modules 1>/dev/null

  echo
  echo 'Done!'
}

main
