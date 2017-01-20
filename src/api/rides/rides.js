'use strict';

/* eslint-disable */

const express = require('express');

const router = express.Router();

const Ride = require('../../../models/rides');

/**
 * Get all rides
 * @returns {Object} All the rides in the database
 */
router.get('/', function (req, res, next) {
  try {
    Ride.find(function (err, rides) {
      if (err) return next(err);
      else {
        res.status(200).json(rides);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Get a specific rides
 * @param {String} id the id of the ride
 * @returns {Object} The ride with the specified id
 */
router.get('/:idRide', function (req, res, next) {
  try {
    Ride.findOne({ _id: req.params.idRide }, function (err, ride) {
      if (err) return next(err);
      else {
        res.status(200).json(ride);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Create a new ride
 * @param {Number[]} pickup_location the latitude and longitude of the pickup location
 * @param {Number[]} arrival_location the latitude and longitude of the arrival location
 * @param {Number} price the final price of the ride
 * @param {ObjectId} id_user the id of the user associated to this ride
 * @returns {Object} the new ride
 */
router.post('/', function (req, res, next) {
  if (req.body.pickup_location === undefined || req.body.arrival_location === undefined
     || req.body.price === undefined || req.body.id_user) {
    return next(req.app.getError(400, 'Missing or incorrect fields', {}));
  }
  try {
    let ride = new Ride({
      pickup_location: req.body.pickup_location,
      arrival_location: req.body.arrival_location,
      price: req.body.price,
      user: req.body.id_user
    });
    ride.save(function (err) {
      if (err) return next(err);
      else {
        res.status(200).json(ride);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a ride according to its id
 * @param {String} id the id of the ride
 */
router.delete('/:idRide', function (req, res, next) {
  try {
    Ride.findOneAndRemove({ _id: req.params.idRide }, function (err) {
      if (err) return next(err);
      else res.status(200).json('Ride deleted');
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Update the pickup location, the arrival location or the price of a ride
 * @param {String} id the id of the ride
 * @param {Number[]} pickup_location the latitude and longitude of the pickup location
 * @param {Number[]} arrival_location the latitude and longitude of the arrival location
 * @param {Number} price the final price of the ride
 * @param {ObjectId} id_user the id of the user associated to this ride
 * @returns {Object} the updated ride
 */
router.put('/:idRide', function (req, res, next) {
  if (req.body.pickup_location === undefined && req.body.arrival_location === undefined
    && req.body.price === undefined && req.body.id_user === undefined) {
    return next(req.app.getError(400, 'Missing or incorrect fields', {}));
  }
  try {
    Ride.findOne({ _id: req.params.idRide }, function (err, ride) {
      if (err) return next(err);
      else {
        if (ride !== null) {
          if (req.body.pickup_location !== undefined)
            ride.pickup_location = req.body.pickup_location;
          if (req.body.arrival_location !== undefined)
            ride.arrival_location = req.body.arrival_location;
          if (req.body.price !== undefined)
            ride.price = req.body.price;
          if (req.body.id_user !== undefined)
            ride.user = req.body.id_user;
          ride.save(function(err) {
            if (err) return next(err);
            else res.status(200).json(ride);
          });
        } else {
          res.status(404).json('Ride not found');
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
