'use strict';

/* eslint-disable */

const http = require('http');
const co = require('co');
const express = require('express');
const bodyParser = require('body-parser');
const SwaggerExpress = require('swagger-express-mw');

const app = express();
const server = http.createServer(app);
const promisify = require('./utils/promisify');

const mongo_express = require('mongo-express/lib/middleware');
const mongo_express_config = require('mongo-express/config.js');

const mongoose = require('mongoose');

const listenAsync = promisify(server.listen, server);
const createSwaggerAsync = promisify(SwaggerExpress.create, SwaggerExpress);

const users = require('./api/users/users');
const statuses = require('./api/statuses/statuses');
const rides = require('./api/rides/rides');
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

app.getError = function (status, message, err) {
  const error = new Error();
  error.message = message;
  error.status = status;
  error.error = err;
  return error;
};

app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

app.use(bodyParser.json({ limit: '1mb' }));

app.use('/admin', mongo_express(mongo_express_config));

mongoose.connect('mongodb://localhost/dbChauffeurPrive');

app.set('mongoose', mongoose);

app.use('/users', users);
app.use('/statuses', statuses);
app.use('/rides', rides);

app.use(function (err, req, res, next) {
  res.status(parseInt(err.status !== undefined ? err.status : 500)).json({
    message: err.message,
    error: err
  });
});

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
