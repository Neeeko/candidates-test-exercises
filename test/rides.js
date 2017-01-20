'use strict';

/* eslint-disable */

const Ride = require('../models/rides');
const User = require('../models/users');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');

chai.use(chaiHttp);

describe('Rides', () => {
  beforeEach((done) => {
    Ride.remove({}, () => {
      done();
    });
  });

  describe('/GET rides', () => {
    it('should get all the rides', (done) => {
      chai.request(server)
      .get('/rides/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
    });
  });

  describe('/GET/:idRide rides', () => {
    it('should get the ride with a specific id', (done) => {
      User({
        name: 'test_ride',
        email: 'test_ride@test.com'
      })
      .save(function (err, user) {
        Ride({
          user: user.id,
          pickup_location: [
            33.792755,
            -118.136829
          ],
          arrival_location: [
            33.7838235,
            -118.11409040000001
          ],
          price: 42
        })
        .save(function (err, ride) {
          chai.request(server)
          .get('/rides/' + ride.id)
          .send(ride)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('user');
            res.body.should.have.property('pickup_location');
            res.body.should.have.property('arrival_location');
            res.body.should.have.property('price');
            res.body.should.have.property('_id').eql(ride.id);
            done();
          });
        });
      });
    });
  });

  describe('/PUT/:idRide rides', () => {
    it('should update the ride according to its id', (done) => {
      User({
        name: 'test_ride2',
        email: 'test_ride2@test.com'
      })
      .save(function (err, user) {
        Ride({
          user: user.id,
          pickup_location: [
            33.792755,
            -118.136829
          ],
          arrival_location: [
            33.7838235,
            -118.11409040000001
          ],
          price: 42
        })
        .save(function (err, ride) {
          chai.request(server)
          .put('/rides/' + ride.id)
          .send({price: 9000})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('price').eql(9000);
            done();
          });
        });
      });
    });
  });

  describe('/DELETE/:idRide ride', () => {
    it('should delete the ride according to its id', (done) => {
      User({
        name: 'test_ride3',
        email: 'test_ride3@test.com'
      })
      .save(function (err, user) {
        Ride({
          user: user.id,
          pickup_location: [
            33.792755,
            -118.136829
          ],
          arrival_location: [
            33.7838235,
            -118.11409040000001
          ],
          price: 42
        })
        .save(function (err, ride) {
          chai.request(server)
          .delete('/rides/' + ride.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.eql('Ride deleted');
            done();
          });
        });
      });
    });
  });
});
