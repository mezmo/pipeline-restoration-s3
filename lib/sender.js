'use strict'
const {sendRecords} = require('./aws/sqs.js')
module.exports = {
  sendFiles
}

async function sendFiles(region, queueUrl, bucket, files) {

  const recordsToSend = {
    Records: []
  }
  const nowISO = new Date().toISOString()
  files.forEach((file) => {
    recordsToSend.Records.push({
      eventVersion: '2.1'
    , eventSource: 'aws:s3'
    , awsRegion: region
    , eventTime: nowISO
    , eventName: 'ObjectCreated:Put'
    , s3: {
        bucket: {
          name: bucket
        }
      , object: {
          key: file.Key
        , eTag: file.eTag
        }
      }
    })
  })
  return sendRecords(queueUrl, recordsToSend)

}
