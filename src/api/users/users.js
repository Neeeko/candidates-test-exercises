'use strict';

/* eslint-disable */

const express = require('express');

const router = express.Router();

const User = require('../../../models/users');
const Ride = require('../../../models/rides');

const StatusModule = require('../statuses/statuses');

/**
* Get all users
* @returns {Object} All the users in the database
*/
router.get('/', function (req, res, next) {
  try {
    User.find(function (err, users) {
      if (err) return next(err);
      else {
        res.status(200).json(users);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
* Get a specific user
* @param {String} idUser the id of the user
* @returns {Object} The user with the specified id
*/
router.get('/:idUser', function (req, res, next) {
  try {
    User.findOne({ _id: req.params.idUser }, function (err, user) {
      if (err) return next(err);
      else {
        res.status(200).json(user);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
* Create a new user
* @param {String} name the name of the user
* @param {String} email the email of the user
* @returns {Object} the new user
*/
router.post('/', function (req, res, next) {
  if (req.body.name === undefined || req.body.email === undefined) {
    return next(req.app.getError(400, 'Missing or incorrect fields', {}));
  }
  try {
    let user = new User({
      name  : req.body.name,
      email : req.body.email
    });
    user.save(function (err) {
      if (err) return next(err);
      else {
        res.status(200).json(user);
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
* Delete a user according to its id
* @param {String} idUser the id of the user
*/
router.delete('/:idUser', function (req, res, next) {
  try {
    User.findOneAndRemove({ _id: req.params.idUser }, function(err) {
      if (err) return next(err);
      else res.status(200).json('User deleted');
    });
  } catch (error) {
    return next(error);
  }
});

/**
* Update the name or the email of a user
* @param {String} idUser the id of the user
* @param {String} email the new email
* @param {String} name the new name
* @returns {Object} the updated user
*/
router.put('/:idUser', function (req, res, next) {
  if (req.body.name === undefined && req.body.email === undefined) {
    return next(req.app.getError(400, 'Missing or incorrect fields', {}));
  }
  try {
    User.findOne({ _id: req.params.idUser }, function (err, user) {
      if (err) return next(err);
      else {
        if (user !== null) {
          if (req.body.name !== undefined) user.name = req.body.name;
          if (req.body.email !== undefined) user.email = req.body.email;
          user.save(function (err) {
            if (err) return next(err);
            else res.status(200).json(user);
          });
        } else {
          res.status(404).json('User not found');
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
* Handle the payments made by the user; add a new ride to the user if ride's information is provided
* @param {String} id the id of the user
* @param {Number} money_spent the amount of money spent for this transaction
*
* @param {Object} ride optional, JSON object containing two arrays: pickup_location
* and arrival_location. Each of these arrays must contain latitude and longitude.
* @returns {Object} the updated user
*/
router.post('/:idUser/payment/', function (req, res, next) {
  if (req.body.money_spent === undefined) {
    return next(req.app.getError(400, 'Missing or incorrect fields', {}));
  }
  try {
    User.findOne({ _id: req.params.idUser }, function (err, user) {
      if (err) return next(err);
      else {
        if (user !== null) {
          StatusModule.getLevel(user.rides.length, function (result) {
            user.loyalty_points += req.body.money_spent * result.points;
            if (req.body.ride !== undefined) {
              let ride = new Ride({
                pickup_location: req.body.ride.pickup_location,
                arrival_location: req.body.ride.arrival_location,
                price: req.body.money_spent,
                user: req.params.idUser
              });
              ride.save(function (err) {
                if (err) return next(err);
                user.rides.push(ride);
              });
            }
            user.save(function (err) {
              if (err) return next(err);
              else {
                res.status(200).json(user);
              }
            });
          });
        } else {
          res.status(404).json('User not found');
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
* Get the amount of loyalty points of a user
* @param {String} idUser the id of the user
* @returns {Object} the amount of loyalty points of the user
*/
router.get('/:idUser/loyalty_points', function (req, res, next) {
  try {
    User.findOne({ _id: req.params.idUser }, function (err, user) {
      if (err) return next(err);
      else {
        if (user !== null) {
          res.status(200).json(user.loyalty_points);
        } else {
          res.status(404).json('User not found');
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
* Get the loyalty status of a user
* @param {String} idUser the id of the user
* @returns {Object} the loyalty status of the user
*/
router.get('/:idUser/loyalty_status', function (req, res, next) {
  try {
    User.findOne({ _id: req.params.idUser }, function (err, user) {
      if (err) return next(err);
      else {
        if (user !== null) {
          StatusModule.getLevel(user.rides.length, function (result) {
            res.status(200).json(result.name);
          }, next);
        } else {
          res.status(404).json('User not found');
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

/**
* Get the next loyalty status of a user
* @param {String} idUser the id of the user
* @returns {Object} the next loyalty status of the user
*/
router.get('/:idUser/next_loyalty_status', function (req, res, next) {
  try {
    User.findOne({ _id: req.params.idUser }, function (err, user) {
      if (err) return next(err);
      else {
        if (user !== null) {
          StatusModule.getNextLevel(user.rides.length, function (result) {
            res.status(200).json(result);
          }, next);
        } else {
          res.status(404).json('User not found');
        }
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
