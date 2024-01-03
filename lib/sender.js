'use strict'
const {sendRecords} = require('./aws/sqs.js')
module.exports = {
  sendFiles
}

async function sendFiles(region, queueUrl, bucket, files) {
  const recordTemplate = {
    eventVersion: '2.1'
  , eventSource: 'aws:s3'
  , awsRegion: ''
  , eventTime: ''
  , eventName: 'ObjectCreated:Put'
  , s3: {
      bucket: {
        name: ''
      }
    , object: {
        key: ''
      , eTag: ''
      }
    }
  }
  const recordTemplateJSON = JSON.stringify(recordTemplate)

  const recordsToSend = {
    Records: []
  }
  files.forEach((file) => {
    const newRecord = JSON.parse(recordTemplateJSON)
    newRecord.eventTime = new Date().toISOString()
    newRecord.awsRegion = region
    newRecord.s3.bucket.name = bucket
    newRecord.s3.object.key = file.Key
    newRecord.s3.object.eTag = file.eTag
    recordsToSend.Records.push(newRecord)
  })

  return sendRecords(queueUrl, recordsToSend)

}
