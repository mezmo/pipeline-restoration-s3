'use strict'

const Config = require('@logdna/env-config')

module.exports = new Config([
  Config
    .string('aws-endpoint-url')
    .desc('The aws endpoint to use during testing, it should be left empty in production')
])
