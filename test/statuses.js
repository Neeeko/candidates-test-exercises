'use strict';

/* eslint-disable */

const Status = require('../models/statuses');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');

const should = chai.should();

chai.use(chaiHttp);

describe('Statuses', () => {
  beforeEach((done) => {
    Status.remove({}, () => {
      Status.create([
        {
          points: 1,
          required_value: 0,
          name: 'Bronze'
        },
        {
          points: 3,
          required_value: 10,
          name: 'Silver'
        },
        {
          points: 5,
          required_value: 25,
          name: 'Gold'
        },
        {
          points: 10,
          required_value: 50,
          name: 'Platinum'
        }
      ], function () {
        done();
      });
    });
  });

  describe('/GET statuses', () => {
    it('should get all the statuses', (done) => {
      chai.request(server)
      .get('/statuses/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
    });
  });

  describe('/GET/:idStatus statuses', () => {
    it('should get the status with a specific id', (done) => {
      Status({
        name: 'Gold',
        points: 5,
        required_value: 25
      })
      .save(function (err, status) {
        chai.request(server)
        .get('/statuses/' + status.id)
        .send(status)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('name');
          res.body.should.have.property('points');
          res.body.should.have.property('required_value');
          res.body.should.have.property('_id').eql(status.id);
          done();
        });
      });
    });
  });

  describe('/POST statuses', () => {
    it('should add a new status', (done) => {
      var status = {
        name: 'Gold',
        points: 5,
        required_value: 25
      };
      chai.request(server)
      .post('/statuses/')
      .send(status)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('name');
        res.body.should.have.property('points');
        res.body.should.have.property('required_value');
        done();
      });
    });
  });

  describe('/PUT/:idStatus statuses', () => {
    it('should update the status according to its id', (done) => {
      Status({
        name: 'Silver',
        points: 3,
        required_value: 10
      })
      .save(function (err, status) {
        chai.request(server)
        .put('/statuses/' + status.id)
        .send({name: 'Diamond'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('name').eql('Diamond');
          done();
        });
      });
    });
  });

  describe('/DELETE/:idStatus statuses', () => {
    it('should delete the status according to its id', (done) => {
      Status({
        name: 'Emerald',
        points: 42,
        required_value: 42
      })
      .save(function (err, status) {
        chai.request(server)
        .delete('/statuses/' + status.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.eql('Status deleted');
          done();
        });
      });
    });
  });

  describe('/GET/level/:nbRide statuses', () => {
    it('should get the loyalty status according to the number of rides', (done) => {
      chai.request(server)
      .get('/statuses/level/9')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('name').eql('Bronze');
        res.body.should.have.property('points').eql(1);
        done();
      });
    });
  });

  describe('/GET/next_level/:nbRide statuses', () => {
    it('should get the amount of rides until the next loyalty status', (done) => {
      chai.request(server)
      .get('/statuses/next_level/15')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('name').eql('Gold');
        res.body.should.have.property('rides_left').eql(10);
        done();
      });
    });
  });
});
