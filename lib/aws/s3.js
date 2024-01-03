'use strict'

const {S3Client, ListObjectsV2Command} = require('@aws-sdk/client-s3')
const config = require('../../config.js')
const client = new S3Client({
  endpoint: config.get('aws-endpoint-url')
, forcePathStyle: true
})
const fileRegex = /\S+_(?<datePart>[0-9]+)\S+/

module.exports = {
  getFiles
}

async function getFiles({bucket, prefix, startDate, endDate}) {
  const command = new ListObjectsV2Command({
    Bucket: bucket
  , Prefix: prefix
  })

  let isTruncated = true
  const contents = []

  while (isTruncated) {
    const {Contents, IsTruncated, NextContinuationToken}
      = await client.send(command)
    isTruncated = IsTruncated
    if (Contents) {
      contents.push(...Contents.filter((f) => {
        return matchesDateRange(f, startDate, endDate)
      }))
    }
    command.input.ContinuationToken = NextContinuationToken
  }
  return contents
}

function matchesDateRange(f, startDate, endDate) {
  const {groups: {datePart}} = fileRegex.exec(f.Key)
  const theDate = new Date(datePart * 1000)
  return theDate >= startDate && theDate <= endDate
}
