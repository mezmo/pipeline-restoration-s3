#!/bin/bash
awslocal s3 mb s3://test-bucket
awslocal sqs create-queue --queue-name localstack-queue
echo "log line - Wed Jan 10 2024 08:14:41 GMT+0000" | awslocal s3 cp - s3://test-bucket/merged_1704874481.log
echo "log line - Wed Jan 10 2024 10:14:41 GMT+0000" | awslocal s3 cp - s3://test-bucket/merged_1704881681.log
echo "log line - Wed Jan 10 2024 14:14:41 GMT+0000" | awslocal s3 cp - s3://test-bucket/merged_1704896081.log
echo "log line - Mon Jan 08 2024 14:14:41 GMT+0000" | awslocal s3 cp - s3://test-bucket/merged_1704723281.log
echo "log line - Thu Dec 25 1997 07:23:36 GMT+0000" | awslocal s3 cp - s3://test-bucket/folder/merged_883034616.log
echo "log line - Fri Dec 26 1997 07:23:36 GMT+0000" | awslocal s3 cp - s3://test-bucket/folder/merged_883121229.log
echo "log line - Sat Dec 27 1997 07:23:36 GMT+0000" | awslocal s3 cp - s3://test-bucket/folder/merged_883207416.log
echo "not a log file" | awslocal s3 cp - s3://test-bucket/notalog_1704723281.log