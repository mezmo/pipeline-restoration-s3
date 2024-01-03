'use strict'

const {S3Client, ListObjectsV2Command} = require('@aws-sdk/client-s3')
const client = new S3Client({})

module.exports = {
  getAllFiles
}

async function getAllFiles(bucket, prefix) {
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
      contents.push(...Contents)
    }
    command.input.ContinuationToken = NextContinuationToken
  }
  return contents
}
