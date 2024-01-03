'use strict'
const {SendMessageCommand, SQSClient} = require('@aws-sdk/client-sqs')
const config = require('../../config.js')
const client = new SQSClient({
  endpoint: config.get('aws-endpoint-url')
})

module.exports = {
  sendRecords
}

async function sendRecords(queueUrl, records) {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl
  , MessageBody: JSON.stringify(records)
  })

  return client.send(command)
};
