'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Challenge = mongoose.model('Challenge');

/**
 * Globals
 */
var user, challenge;

/**
 * Unit tests
 */
describe('Challenge Model Unit Tests:', function () {
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
      challenge = new Challenge({
        name: 'challengeName',
        description: 'challengeDescription',
        solves: 0,
        category: 'challengeCategory',
        points: 100,
        flag: 'challengeFlag'
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return challenge.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      challenge.name = '';

      return challenge.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without description', function (done) {
      challenge.description = '';

      return challenge.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should be able to show an error when try to save without category', function (done) {
    challenge.category = '';

    return challenge.save(function (err) {
      should.exist(err);
      done();
    });
  });

  it('should be able to show an error when try to save without points', function (done) {
    challenge.points = null;

    return challenge.save(function (err) {
      should.exist(err);
      done();
    });
  });

  it('should be able to show an error when try to save without flag', function (done) {
    challenge.flag = '';

    return challenge.save(function (err) {
      should.exist(err);
      done();
    });
  });


  afterEach(function (done) {
    Challenge.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
