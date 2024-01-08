'use strict'

const {getFiles} = require('./lib/filelist.js')
const {sendFiles} = require('./lib/sender.js')
const DEFUALT_ARCHIVE_PREFIX = 'merged_'

exports.handler = async function(event) {
  const archivePrefix = event.archivePrefix ? event.archivePrefix : DEFUALT_ARCHIVE_PREFIX
  const bucket = event.bucket
  const path = event.path ? event.path : ''
  const startDate = Date.parse(event.startDate)
  const endDate = Date.parse(event.endDate)
  const queueUrl = event.queueUrl

  if (!event.bucket) {
    throw new Error('Parameter bucket is required')
  }
  if (!event.queueUrl) {
    throw new Error('Parameter queueUrl is required')
  }
  if (isNaN(startDate)) {
    throw new Error('Parameter startDate must be a valid date')
  }
  if (isNaN(endDate)) {
    throw new Error('Parameter endDate must be a valid date')
  }
  const files = await getFiles(bucket, path + archivePrefix, startDate, endDate)
  await sendFiles(queueUrl, bucket, files)
}

