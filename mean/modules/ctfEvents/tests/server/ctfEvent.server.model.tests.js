'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CtfEvent = mongoose.model('CtfEvent');

/**
 * Globals
 */
var user, ctfEvent;

/**
 * Unit tests
 */
describe('CtfEvent Model Unit Tests:', function () {

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
      ctfEvent = new CtfEvent({
        title: 'CtfEvent Title',
        content: 'CtfEvent Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return ctfEvent.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      ctfEvent.title = '';

      return ctfEvent.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    CtfEvent.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
