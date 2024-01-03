'use strict'
const {getAllFiles} = require('./aws/s3.js')

module.exports = {
  getFiles
}

const fileRegex = /\D*merged_(?<datePart>\d*)\D*/

async function getFiles({bucket, prefix, startDate, endDate}) {
  const allFiles = await getAllFiles(bucket, prefix)

  return allFiles.filter((f) => { return matchesDateRange(f, startDate, endDate) })
}

function matchesDateRange(f, startDate, endDate) {
  const {groups: {datePart}} = fileRegex.exec(f.Key)
  const theDate = new Date(datePart * 1000)
  return theDate >= startDate && theDate <= endDate
}
