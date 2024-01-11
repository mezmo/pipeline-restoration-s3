'use strict'

const filelist = require('./lib/filelist.js')
const sender = require('./lib/sender.js')
const DEFAULT_ARCHIVE_PREFIX = 'merged_'

exports.handler = async function(event) {
  if (!event) {
    throw new Error('Event with the following parameters is '
      + 'required (bucket, queueUrl, startDate, endDate)')
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
  const bucket = event.bucket
  const path = event.path ?? ''
  const startDate = Date.parse(event.startDate)
  const endDate = Date.parse(event.endDate)
  const queueUrl = event.queueUrl

  const files = await filelist.getFiles({
    bucket
  , prefix: path + archivePrefix
  , startDate
  , endDate})
  await sender.sendFiles(queueUrl, bucket, files)
}

