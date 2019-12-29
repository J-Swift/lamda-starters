#!/usr/bin/env sh

set -eu

# NOTE(jpr): you must fill these in
readonly s3_bucket_name=''
readonly s3_file_name=''
readonly lambda_function_name=''

if [ -z "${s3_bucket_name}" ] || [ -z "${s3_file_name}" ] || [ -z "${lambda_function_name}" ]; then
  echo "Must configure aws params within $( basename ${0} )!"
  exit 1
fi

main() {
  rm -rf out
  mkdir out

  echo 'installing packages...'
  npm install >/dev/null 2>&1

  echo 'zipping...'
  zip -r out/lambda.zip index.js node_modules 1>/dev/null

  echo 'uploading to s3...'
  aws s3 cp \
    out/lambda.zip \
    s3://"${s3_bucket_name}"/"${s3_file_name}"

  echo 'updating lambda...'
  aws lambda update-function-code \
    --function-name "${lambda_function_name}" \
    --s3-bucket "${s3_bucket_name}" \
    --s3-key "${s3_file_name}" \
    1>/dev/null

  echo
  echo 'Done!'
}

main
