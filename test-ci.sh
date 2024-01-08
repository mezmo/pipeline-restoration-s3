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

npm prune --omit=dev
zip -rq lambda.zip .
aws --endpoint-url=http://localstack:4566 lambda create-function --function-name mezmo-pipeline-restoration \
    --runtime nodejs20.x --handler index.handler --zip-file fileb://lambda.zip --role arn:aws:iam::000000000000:role/lambda-role
npm i
sleep 10
npm run tap
echo "finished test"