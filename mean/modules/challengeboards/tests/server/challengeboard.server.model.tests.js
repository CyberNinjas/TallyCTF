'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Challengeboard = mongoose.model('Challengeboard');

/**
 * Globals
 */
var user, challengeboard;

/**
 * Unit tests
 */
describe('Challengeboard Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      challengeboard = new Challengeboard({
        title: 'Challengeboard Title',
        content: 'Challengeboard Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return challengeboard.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      challengeboard.title = '';

      return challengeboard.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Challengeboard.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
