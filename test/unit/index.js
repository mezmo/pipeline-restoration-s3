'use strict'

const {test, threw} = require('tap')
const index = require('../../index.js')

test('invocation unit tests', async (t) => {
  t.test('empty event fails', async (t) => {
    await t.rejects(index.handler(null, null), {
      message: 'Event with the following parameters '
        + 'is required (bucket, queueUrl, startDate, endDate)'
    })
  })
  t.test('bucket is required', async (t) => {
    await t.rejects(index.handler({}, null), {
      message: 'Parameter bucket is required'
    })
  })
  t.test('queueUrl is required', async (t) => {
    await t.rejects(index.handler({
      bucket: 'some-bucket'
    }, null), {
      message: 'Parameter queueUrl is required'
    })
  })
  t.test('startDate is required', async (t) => {
    await t.rejects(index.handler({
      bucket: 'some-bucket'
    , queueUrl: 'http://queue.url'
    }, null), {
      message: 'Parameter startDate must be a valid date'
    })
  })
  t.test('endDate is required', async (t) => {
    await t.rejects(index.handler({
      bucket: 'some-bucket'
    , queueUrl: 'http://queue.url'
    , startDate: '04 Dec 1995 00:12:00 GMT'
    }, null), {
      message: 'Parameter endDate must be a valid date'
    })
  })
  t.test('startDate must be valid', async (t) => {
    await t.rejects(index.handler({
      bucket: 'some-bucket'
    , queueUrl: 'http://queue.url'
    , startDate: 'xxx'
    , endDate: '04 Dec 1995 00:12:00 GMT'
    }, null), {
      message: 'Parameter startDate must be a valid date'
    })
  })
  t.test('endDate must be valid', async (t) => {
    await t.rejects(index.handler({
      bucket: 'some-bucket'
    , queueUrl: 'http://queue.url'
    , startDate: '04 Dec 1995 00:12:00 GMT'
    , endDate: 'xxx'
    }, null), {
      message: 'Parameter endDate must be a valid date'
    })
  })
}).catch(threw)
