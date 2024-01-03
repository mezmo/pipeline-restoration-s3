# Pipeline Restoration Lambda Function

This Lambda function will allow you to search your existing log archives in s3 and send them to Mezmo Pipeline via [S3/SQS Source](https://docs.mezmo.com/telemetry-pipelines/s3-source).

## How to Use

### SQS and Pipeline configuration
#### Create an SQS queue
1. Navigate to Simple Queue Service in AWS
2. Choose create queue.  For type, choose `Standard`.
3. Leave all other settings as default and click Create Queue

#### Setup your Pipeline S3 Source
1. Add the S3 Source to your pipeline
2. Enter your SQS Queue URL, Access Key ID, Secret Access Key and Region 
3. Click save

_You may have noticed this setup is very similar to the setup for [S3 Source](https://docs.mezmo.com/telemetry-pipelines/s3-source).  This is on purpose.  The way this source works is by listening to New File events sent from S3 to SQS.  This function aims to mimic that, but also you to choose which files to send._

### Deploy the Code
1. Create a [new AWS Lambda function](https://console.aws.amazon.com/lambda/home) and select `Author from scratch`.
2. Click on the Lambda function to edit the details:
 * Code entry type: `Upload a .ZIP file`
 * Upload the Mezmo Pipeline Restoration from S3 function [.ZIP File](https://github.com/mezmo/pipeline-restoration-s3/releases/latest/download/pipeline-restoration.zip).
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
* `region` (required): The region your archive files are located
* `path` (optional): If you have stored your files somewhere other than root, place your path here (eg: `subpath/`)
* `archivePrefix` (optional, defaults to `merged_`): This lambda function is looking for files patterned with this prefix then a unix time.  Change this if you have a different prefix
* `queueUrl` (required): The URL of the SQS Queue you have setup in Pipeline
* `startDate` (required): A Javascipt [date time string](https://262.ecma-international.org/6.0/#sec-date-time-string-format)*
* `endDate` (required): A Javascipt [date time string](https://262.ecma-international.org/6.0/#sec-date-time-string-format)*

_Please note that dates provided are inclusive in the search_

#### Compatibility with Mezmo [Pipeline S3 Destination](https://docs.mezmo.com/telemetry-pipelines/s3-destination)
Please note that this project is set up to assist with restoiring files created by the Mezmo S3 destination.  This destination has a feature to combine small archive files into larger ones and named `merged_UNIXTIME.log`.  The archive prefix is defaulted to `merged_` because of this setup.  *Additionally, the dates searched are the dates written into the filename and not the dates in the properties of the file.

Here is an example:
```
{
  "bucket": "my-archive-bucket",
  "region": "us-east-1",
  "path": "somesubpath/",
  "queueUrl": "https://sqs.us-east-1.amazonaws.com/000000000000/my-sqs-queue",
  "startDate": "2024-01-17T00:00:00Z",
  "endDate": "2024-01-17T23:59:59Z"
}
```
