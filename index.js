'use strict'

const {getFiles} = require('./lib/aws/s3.js')
const sender = require('./lib/sender.js')
const DEFAULT_ARCHIVE_PREFIX = 'merged_'

exports.handler = async function(event) {
  if (!event) {
    throw new Error('Event with the following parameters is '
      + 'required (bucket, queueUrl, startDate, endDate)')
  }

  if (!event.region) {
    throw new Error('Parameter region is required')
  }
  if (!event.bucket) {
    throw new Error('Parameter bucket is required')
  }
  if (!event.queueUrl) {
    throw new Error('Parameter queueUrl is required')
  }
  if (!event.startDate || isNaN(Date.parse(event.startDate))) {
    throw new Error('Parameter startDate must be a valid date')
  }
  if (!event.endDate || isNaN(Date.parse(event.endDate))) {
    throw new Error('Parameter endDate must be a valid date')
  }

  const archivePrefix = event.archivePrefix ?? DEFAULT_ARCHIVE_PREFIX
  const region = event.region
  const bucket = event.bucket
  const path = event.path ?? ''
  const startDate = Date.parse(event.startDate)
  const endDate = Date.parse(event.endDate)
  const queueUrl = event.queueUrl

  const files = await getFiles({
    bucket
  , prefix: path + archivePrefix
  , startDate
  , endDate
  })

  if (files.length > 0) {
    const sqsResponse = await sender.sendFiles(region, queueUrl, bucket, files)
    return {
      fileCount: files.length
    , filesQueued: files
    , message: 'Files have been queued to SQS'
    , messageId: sqsResponse.MessageId
    }
  } else {
    return {
      fileCount: 0
    , message: 'No files found matching criteria'
    }
  }
}

