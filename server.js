'use strict'

const hapi = require('hapi')
const constants = require('./lib/constants/constants')
const routes = require('./lib/router/routes')

const server = new hapi.Server({ port: constants.PORT })

server.route(routes)

server.route({
  method: 'GET',
  path: '/ping',
  handler: function (request, h) {
    return 'pong'
  }
})

async function startServer() {
  await server.start();
  console.log('Server started at: ' + server.info.uri);
}

startServer()