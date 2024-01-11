'use strict'
const {SendMessageCommand, SQSClient} = require('@aws-sdk/client-sqs')
const client = new SQSClient({})

module.exports = {
  sendRecords
}

async function sendRecords(queueUrl, records) {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl
  , MessageBody: JSON.stringify(records)
  })

  const response = await client.send(command)
  return response
};