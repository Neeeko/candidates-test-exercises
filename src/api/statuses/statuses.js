'use strict';

/* eslint-disable */

const express = require('express');

const router = express.Router();

const Status = require('../../../models/statuses');

/**
 * Get all status
 * @returns {Object} All the status in the database
 */
router.get('/', function (req, res, next) {
  try {
    Status.find(function (err, status) {
      if (err) return next(err);
      else {
        res.status(200).json(status);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Get a specific status
 * @param {String} id the id of the status
 * @returns {Object} The status with the specified id
 */
router.get('/:idStatus', function (req, res, next) {
  try {
    Status.findOne({ _id: req.params.idStatus }, function (err, status) {
      if (err) return next(err);
      else {
        res.status(200).json(status);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Create a new status
 * @param {String} name the name of the status
 * @param {Number} required_value the required value to get to this status
 * @returns {Object} the new status
 */
router.post('/', function (req, res, next) {
  if (req.body.name === undefined || req.body.required_value === undefined) {
    return next(req.app.getError(400, 'Missing or incorrect fields', {}));
  }
  try {
    let status = new Status({
      name: req.body.name,
      required_value: req.body.required_value
    });
    status.save(function (err) {
      if (err) return next(err);
      else {
        res.status(200).json(status);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a status according to its id
 * @param {String} id the id of the status
 */
router.delete('/:idStatus', function (req, res, next) {
  try {
    Status.findOneAndRemove({ _id: req.params.idStatus }, function (err) {
      if (err) return next(err);
      else res.status(200).json('Status deleted');
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Update the name or the required value of a status
 * @param {String} id the id of the status
 * @param {String} name the new name
 * @param {String} required_value the new required value
 * @returns {Object} the updated status
 */
router.put('/:idStatus', function (req, res, next) {
  if (req.body.name === undefined && req.body.required_value === undefined) {
    return next(req.app.getError(400, 'Missing or incorrect fields', {}));
  }
  try {
    Status.findOne({ _id: req.params.idStatus }, function (err, status) {
      if (err) return next(err);
      else {
        if (status !== null) {
          if (req.body.name !== undefined) status.name = req.body.name;
          if (req.body.required_value !== undefined)
            status.required_value = req.body.required_value;
          status.save(function (err) {
            if (err) return next(err);
            else res.status(200).json(status);
          });
        } else {
          res.status(404).json('Status not found');
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

function getLevel(nbRide, callback, next) {
  try {
    Status.find({ required_value: { $lte: nbRide } },
      function(err, status) {
        if (err) return next(err);
        callback({
          name: status[0].name,
          points: status[0].points
        });
      }).sort({ required_value: -1 }).limit(1);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get the loyalty status according to the number of rides
 * @param {Number} nbRide the number of rides
 * @returns {String} the name of the loyalty level
 */
router.get('/level/:nbRide', function (req, res, next) {
  getLevel(req.params.nbRide, function (result) {
    res.status(200).json(result);
  }, next);
});

function getNextLevel(nbRide, callback, next) {
  try {
    Status.find({ required_value: { $gt: nbRide }},
      function(err, status) {
        if (err) return next(err);
        else {
          if (status.length > 0) {
            callback({
              name: status[0].name,
              rides_left: status[0].required_value - nbRide
            });
          } else {
            callback({});
          }
        }
      }).sort({ required_value: 1 }).limit(1);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get the amount of rides until the next loyalty status
 * @param {Number} nbRide the number of rides
 * @returns {Object} the name of the next loyalty level and the number of rides left
 */
router.get('/next_level/:nbRide', function (req, res, next) {
  getNextLevel(req.params.nbRide, function (result) {
    res.status(200).json(result);
  }, next);
});

module.exports = router;
module.exports.getLevel = function (nbRide, callback, next) {
  return getLevel(nbRide, callback, next);
};
module.exports.getNextLevel = function (nbRide, callback, next) {
  return getNextLevel(nbRide, callback, next);
};
