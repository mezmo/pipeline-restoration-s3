'use strict'
const {getAllFiles} = require('./aws/s3.js')

module.exports = {
  getFiles
}

async function getFiles(bucket, prefix, startDate, endDate) {
  const allFiles = await getAllFiles(bucket, prefix)
  const filesByDate = []
  allFiles.forEach((file) => {
    const fileRegex = /(\D*)(\d*)(\D*)/
    const matches = fileRegex.exec(file.Key)
    const dateMatch = matches[2]
    const theDate = new Date(dateMatch * 1000)
    if (theDate >= startDate && theDate <= endDate) {
      filesByDate.push(file)
    }
  })
  return filesByDate
}
