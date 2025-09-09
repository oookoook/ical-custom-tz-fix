const serverlessExpress = require('@codegenie/serverless-express')
const app = require('./api')
exports.handler = async (event, context) => {
    let serverlessExpressInstance = serverlessExpress({ app });
    return serverlessExpressInstance(event, context);
}