'use strict';

const http = require('http');
const co = require('co');
const express = require('express');
const SwaggerExpress = require('swagger-express-mw');

const app = express();
const server = http.createServer(app);
const promisify = require('./utils/promisify');

const listenAsync = promisify(server.listen, server);
const createSwaggerAsync = promisify(SwaggerExpress.create, SwaggerExpress);

/**
 * Start the app.
 * New api calls are handled by swagger under /api.
 * If a call is not intercepted by swagger it is forwarded to api node.
 *
 * @private
 * @returns {undefined}
 */
function* _start() {
  const swaggerExpress = yield createSwaggerAsync({
    appRoot: './src',
    swagger: './src/api/swagger.json'
  });
  swaggerExpress.register(app);

  yield listenAsync(3000);
}

const start = co.wrap(_start);

if (!module.parent) {
  start()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  });
} else {
  module.exports = app;
  module.exports.start = start;
}
