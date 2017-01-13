'use strict';

/**
 * Promisify a callback style function.
 *
 * The promisified function returns a promise that will be resolved once the callback of the
 * original function is called succesfully and will be rejected if the callback is called with an
 * error.
 *
 * @param {Function} fn: the function that you want to promisify, it should accept a callback as
 * last argument.
 * @param {Object} ctx: The object on which you want your function to be applied.
 * @returns {Function} The promisified function.
 */
function promisify(fn, ctx) {
  return (...args) => new Promise((resolve, reject) => {
    function cb(err, result) { // eslint-disable-line require-jsdoc
      if (err) reject(err);
      resolve(result);
    }
    args.push(cb);
    fn.apply(ctx, args);
  });
}

module.exports = promisify;
