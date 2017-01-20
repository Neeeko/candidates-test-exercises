'use strict';

/* eslint-disable */

const User = require('../models/users');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');

const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      User.create([
        {
          name: 'Donald J. Trump',
          email: 'donaldtrump@aol.com'
        },
        {
          name: 'Hillary Clinton',
          email: 'hillaryclinton@yahoo.com'
        },
        {
          name: 'Barack H. Obama',
          email: 'barackobama@gmail.com'
        }
      ], function () {
        done();
      });
    });
  });

  describe('/GET users', () => {
    it('should get all the users', (done) => {
      chai.request(server)
      .get('/users/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
    });
  });

  describe('/GET/:idUser users', () => {
    it('should get the user with a specific id', (done) => {
      User({
        name: 'test',
        email: 'test@test.com'
      })
      .save(function (err, user) {
        chai.request(server)
        .get('/users/' + user.id)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.have.property('loyalty_points');
          res.body.should.have.property('_id').eql(user.id);
          done();
        });
      });
    });
  });

  describe('/POST users', () => {
    it('should add a new user', (done) => {
      var user = {
        name: 'test',
        email: 'test@test.fr'
      };
      chai.request(server)
      .post('/users/')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('name');
        res.body.should.have.property('email');
        res.body.should.have.property('loyalty_points');
        done();
      });
    });
  });

  describe('/PUT/:idUser users', () => {
    it('should update the user according to its id', (done) => {
      User({
        name: 'test2',
        email: 'test2@test.fr'
      })
      .save(function (err, user) {
        chai.request(server)
        .put('/users/' + user.id)
        .send({name: 'test42'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('name').eql('test42');
          done();
        });
      });
    });
  });

  describe('/DELETE/:idUser users', () => {
    it('should delete the user according to its id', (done) => {
      User({
        name: 'test3',
        email: 'test3@test.fr'
      })
      .save(function (err, user) {
        chai.request(server)
        .delete('/users/' + user.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.eql('User deleted');
          done();
        });
      });
    });
  });

  describe('/POST/:idUser/payment users', () => {
    it('should create a payment to the user', (done) => {
      User({
        name: 'test4',
        email: 'test4@test.fr'
      })
      .save(function (err, user) {
        chai.request(server)
        .post('/users/' + user.id + '/payment')
        .send({ money_spent: 10 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('loyalty_points').eql(10);
          done();
        });
      });
    });
  });

  describe('/GET/:idUser/loyalty_status users', () => {
    it('should get the loyalty status of the user', (done) => {
      User({
        name: 'test4',
        email: 'test4@test.fr'
      })
      .save(function (err, user) {
        chai.request(server)
        .get('/users/' + user.id + '/loyalty_status')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.eql('Bronze');
          done();
        });
      });
    });
  });

  describe('/GET/:idUser/next_loyalty_status users', () => {
    it('should get the next loyalty status of the user and the numbers of rides left',
    (done) => {
      User({
        name: 'test5',
        email: 'test5@test.fr'
      })
      .save(function (err, user) {
        chai.request(server)
        .get('/users/' + user.id + '/next_loyalty_status')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('name').eql('Silver');
          res.body.should.have.property('rides_left').eql(10);
          done();
        });
      });
    });
  });
});
