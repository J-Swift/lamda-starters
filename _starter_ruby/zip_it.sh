#!/usr/bin/env sh

set -eu

main() {
  rm -rf out
  mkdir out

  bundle check 1>/dev/null || (echo 'installing missing gems...' && bundle install 1>/dev/null)

  echo 'zipping...'
  zip -r out/lambda.zip lambda_function.rb vendor 1>/dev/null

  echo
  echo 'Done!'
}

main
