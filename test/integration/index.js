'use strict'

const {test, threw} = require('tap')
// eslint-disable-next-line logdna/grouped-require
const {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient} = require('@aws-sdk/client-sqs')
const config = require('../../config.js')
const index = require('../../index.js')
const region = 'us-east-1'
const queueUrl = 'http://localstack:4566/000000000000/localstack-queue'
const bucket = 'test-bucket'

const sqs = new SQSClient({
  endpoint: config.get('aws-endpoint-url')
})

test('integration tests', async (t) => {

  function validateSQSMessage(actual, key) {
    t.match(actual, {
      eventName: 'ObjectCreated:Put'
    , eventSource: 'aws:s3'
    , eventTime: String
    , s3: {
        bucket: {
          name: bucket
        }
      , object: {
          key: key
        }
      }
    })
  }
  t.test('files found in root bucket', async (t) => {
    const params = {
      bucket: bucket
    , region: region
    , queueUrl: queueUrl
    , startDate: 'Wed Jan 10 2024 00:00:00 GMT+0000'
    , endDate: 'Wed Jan 11 2024 00:00:00 GMT+0000'
    }
    const res = await index.handler(params)
    t.match(res, {
      fileCount: 3
    , message: 'Files have been queued to SQS'
    , messageId: String
    , filesQueued: Array
    })
    t.match(res.filesQueued[0].Key, 'merged_1704874481.log')
    t.match(res.filesQueued[1].Key, 'merged_1704881681.log')
    t.match(res.filesQueued[2].Key, 'merged_1704896081.log')

    const sqsCmd = new ReceiveMessageCommand({
      QueueUrl: queueUrl
    })

    const sqsResult = await sqs.send(sqsCmd)

    if (!sqsResult.Messages) {
      t.fail('no sqs messages found')
    }

    t.same(sqsResult.Messages.length, 1, 'sqs message found')
    const records = JSON.parse(sqsResult.Messages[0].Body)
    t.match(records.Records.length, 3)
    validateSQSMessage(records.Records[0], 'merged_1704874481.log')
    validateSQSMessage(records.Records[1], 'merged_1704881681.log')
    validateSQSMessage(records.Records[2], 'merged_1704896081.log')
    await sqs.send(new DeleteMessageCommand({
      QueueUrl: queueUrl
    , ReceiptHandle: sqsResult.Messages[0].ReceiptHandle
    }))

  })

  t.test('files found in root bucket alternate prefix', async (t) => {
    const params = {
      bucket: bucket
    , region: region
    , queueUrl: queueUrl
    , archivePrefix: 'myprefix'
    , startDate: 'Wed Jan 10 2024 00:00:00 GMT+0000'
    , endDate: 'Wed Jan 11 2024 00:00:00 GMT+0000'
    }
    const res = await index.handler(params)
    t.match(res, {
      fileCount: 2
    , message: 'Files have been queued to SQS'
    , messageId: String
    , filesQueued: Array
    })
    t.match(res.filesQueued[0].Key, 'myprefix_1704881681.log')
    t.match(res.filesQueued[1].Key, 'myprefix_1704896081.log')

    const sqsCmd = new ReceiveMessageCommand({
      QueueUrl: queueUrl
    })

    const sqsResult = await sqs.send(sqsCmd)

    if (!sqsResult.Messages) {
      t.fail('no sqs messages found')
    }

    t.same(sqsResult.Messages.length, 1, 'sqs message found')
    const records = JSON.parse(sqsResult.Messages[0].Body)
    t.match(records.Records.length, 2)
    validateSQSMessage(records.Records[0], 'myprefix_1704881681.log')
    validateSQSMessage(records.Records[1], 'myprefix_1704896081.log')
    await sqs.send(new DeleteMessageCommand({
      QueueUrl: queueUrl
    , ReceiptHandle: sqsResult.Messages[0].ReceiptHandle
    }))

  })

  t.test('files found in child bucket alternate prefix', async (t) => {
    const params = {
      bucket: bucket
    , region: region
    , queueUrl: queueUrl
    , path: 'f/'
    , archivePrefix: 'myprefix'
    , startDate: 'Wed Jan 10 2024 00:00:00 GMT+0000'
    , endDate: 'Wed Jan 11 2024 00:00:00 GMT+0000'
    }
    const res = await index.handler(params)
    t.match(res, {
      fileCount: 2
    , message: 'Files have been queued to SQS'
    , messageId: String
    , filesQueued: Array
    })
    t.match(res.filesQueued[0].Key, 'f/myprefix_1704881681.log')
    t.match(res.filesQueued[1].Key, 'f/myprefix_1704896081.log')

    const sqsCmd = new ReceiveMessageCommand({
      QueueUrl: queueUrl
    })

    const sqsResult = await sqs.send(sqsCmd)

    if (!sqsResult.Messages) {
      t.fail('no sqs messages found')
    }

    t.same(sqsResult.Messages.length, 1, 'sqs message found')
    const records = JSON.parse(sqsResult.Messages[0].Body)
    t.match(records.Records.length, 2)
    validateSQSMessage(records.Records[0], 'f/myprefix_1704881681.log')
    validateSQSMessage(records.Records[1], 'f/myprefix_1704896081.log')
    await sqs.send(new DeleteMessageCommand({
      QueueUrl: queueUrl
    , ReceiptHandle: sqsResult.Messages[0].ReceiptHandle
    }))

  })
  t.test('files found in folder', async (t) => {
    const params = {
      bucket: bucket
    , region: region
    , path: 'folder/'
    , queueUrl: queueUrl
    , startDate: 'Dec 26 1997 00:00:00 GMT+0000'
    , endDate: 'Dec 28 1997 00:00:00 GMT+0000'
    }
    const res = await index.handler(params)
    t.match(res, {
      fileCount: 2
    , message: 'Files have been queued to SQS'
    , messageId: String
    , filesQueued: Array
    })
    t.match(res.filesQueued[0].Key, 'folder/merged_883121229.log')
    t.match(res.filesQueued[1].Key, 'folder/merged_883207416.log')

    const sqsCmd = new ReceiveMessageCommand({
      QueueUrl: queueUrl
    })

    const sqsResult = await sqs.send(sqsCmd)

    t.same(sqsResult.Messages.length, 1, 'sqs message found')
    const records = JSON.parse(sqsResult.Messages[0].Body)
    t.match(records.Records.length, 2)
    validateSQSMessage(records.Records[0], 'folder/merged_883121229.log')
    validateSQSMessage(records.Records[1], 'folder/merged_883207416.log')
    await sqs.send(new DeleteMessageCommand({
      QueueUrl: queueUrl
    , ReceiptHandle: sqsResult.Messages[0].ReceiptHandle
    }))
  })

  t.test('no files found', async (t) => {
    const params = {
      bucket: bucket
    , region: region
    , queueUrl: queueUrl
    , startDate: 'Wed Jan 10 2023 00:00:00 GMT+0000'
    , endDate: 'Wed Jan 11 2023 00:00:00 GMT+0000'
    }
    const res = await index.handler(params)
    t.match(res, {
      fileCount: 0
    , message: 'No files found matching criteria'
    })
  })

  t.test('bad path', async (t) => {
    const params = {
      bucket: bucket
    , region: region
    , path: 'badpath/'
    , queueUrl: queueUrl
    , startDate: 'Wed Jan 10 2023 00:00:00 GMT+0000'
    , endDate: 'Wed Jan 11 2023 00:00:00 GMT+0000'
    }
    const res = await index.handler(params)
    t.match(res, {
      fileCount: 0
    , message: 'No files found matching criteria'
    })
  })

}).catch(threw)
