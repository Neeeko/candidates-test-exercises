'use strict';

/* eslint-disable require-yield */

/**
 * Hello
 * @param {Object} req the request
 * @param {Object} res the response
 * @returns {Object} hello response
 */
function* helloWorld(req, res) {
  return res.send({
    greetings: `Hello ${req.swagger.params.userName.raw}, you are: ${req.swagger.params.age.raw}`
  });
}

module.exports = { helloWorld };
