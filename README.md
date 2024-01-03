# Pipeline Restoration Lambda Function

This Lambda function will allow you to search your existing log archives in s3 and send them to Mezmo Pipeline via [S3/SQS Source](https://docs.mezmo.com/telemetry-pipelines/s3-source).

## How to Use

### Configuration
#### S3, SQS and Pipeline prerequisites
You must first SQS as described [here](https://docs.mezmo.com/telemetry-pipelines/s3-source).  By default this setup will notify your pipeline of any
new files and they will then be streamed to your pipeline.  If you do not want this behavior, please skip the secion for S3 Event notification.

Please note your `SQS URL` and `Bucket Name` as you will use them later in invocation.

### Deploy the Code
1. Create a [new AWS Lambda function](https://console.aws.amazon.com/lambda/home) and select `Author from scratch`.
2. Click on the Lambda function to edit the details:
 * Code entry type: `Upload a .ZIP file`
 * Upload our LogDNA Lambda function [.ZIP File](https://github.com/mezmo/pipeline-restoration-s3/releases/latest/download/pipeline-restoration.zip).
 * Handler: `index.handler`
 * Runtime: `Node.js.20.x`

#### Permissions
For Execution role, assign a role that has the following policies:
 * [`AmazonS3ReadOnlyAccess`](https://gist.github.com/bernadinm/6f68bfdd015b3f3e0a17b2f00c9ea3f8#file-all_aws_managed_policies-json-L4392-L4417)
 * [`AWSLambdaBasicExecutionRole`](https://gist.github.com/bernadinm/6f68bfdd015b3f3e0a17b2f00c9ea3f8#file-all_aws_managed_policies-json-L1447-L1473)
 * [`AmazonSQSFullAccess`](https://gist.github.com/bernadinm/6f68bfdd015b3f3e0a17b2f00c9ea3f8#file-all_aws_managed_policies-json-L4551-L4575)

#### Invoking the lambda function
You can do this a number of ways.  If you are doing this through the AWS Management Console, you can run create a test event.  Do so with the following Event JSON:
* `bucket` (required): The bucket your archive files are located
* `path` (optional): If you have stored your files somewhere other than root, place your path here (eg: `subpath/`)
* `archivePrefix` (optional, defaults to `merged_`): This lambda function is looking for files patterned with this prefix then a unix time.  Change this if you have a different prefix
* `queueUrl` (required): The URL of the SQS Queue you have setup in Pipeline
* `startDate` (required): A Javascipt [date time string](https://262.ecma-international.org/6.0/#sec-date-time-string-format)
* `endDate` (required): A Javascipt [date time string](https://262.ecma-international.org/6.0/#sec-date-time-string-format)

Here is an example:
```
{
  "bucket": "my-archive-bucket",
  "path": "somesubpath/",
  "queueUrl": "https://sqs.us-east-1.amazonaws.com/000000000000/my-sqs-queue",
  "startDate": "2024-01-17T18:25:00Z",
  "endDate": "2024-01-17T18:27:00Z"
}
```
