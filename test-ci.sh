#!/bin/bash

while [ true ]
do
    echo "checking localstack readiness"
    STATUS=$(curl http://localstack:4566/_localstack/init -s | jq -r '.scripts[] | select(.stage=="READY") | .state')
    echo $STATUS
    if [ "$STATUS" = "SUCCESSFUL" ]; then
      echo "localstack is ready";
      break;
    fi
    sleep 5
done

set -e
npm i
npm run tap
echo "finished test"