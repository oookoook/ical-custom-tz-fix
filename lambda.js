'use strict'
const awsServerlessExpress = require('@codegenie/serverless-express')
const app = require('./api')
exports.handler = serverlessExpress({ app })