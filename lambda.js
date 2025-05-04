const serverlessExpress = require('@codegenie/serverless-express')
const app = require('./api')
exports.handler = serverlessExpress({ app })