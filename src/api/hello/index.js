'use strict';

const wrap = require('co-express');
const controller = require('./hello');

module.exports = {
  helloWorld: wrap(controller.helloWorld)
};
