'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Challenge = mongoose.model('Challenge'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, challenge;

/**
 * Challenge routes tests
 */
describe('Challenge CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new challenges
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

  it('should be able to save an challenges if logged in', function (done) {
    agent.post('/api/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      // Get the userId
      var userId = user.id;

      // Save a new challenges
      agent.post('/api/challenges')
      .send(challenge)
      .expect(200)
      .end(function (challengeSaveErr, challengeSaveRes) {
        // Handle challenges save error
        if (challengeSaveErr) {
          return done(challengeSaveErr);
        }

        // Get a list of challenges
        agent.get('/api/challenges')
        .end(function (challengesGetErr, challengesGetRes) {
          // Handle challenges save error
          if (challengesGetErr) {
            return done(challengesGetErr);
          }

          // Get challenges list
          var challenges = challengesGetRes.body;

          // Set assertions
          (challenges[0].user._id).should.equal(userId);
          (challenges[0].title).should.match('Challenge Title');

          // Call the assertion callback
          done();
        });
      });
    });
  });

  it('should not be able to save an challenges if not logged in', function (done) {
    agent.post('/api/challenges')
    .send(challenge)
    .expect(403)
    .end(function (challengeSaveErr, challengeSaveRes) {
      // Call the assertion callback
      done(challengeSaveErr);
    });
  });

  it('should not be able to save an challenges if no title is provided', function (done) {
    // Invalidate title field
    challenge.name = '';

    agent.post('/api/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      // Get the userId
      var userId = user.id;

      // Save a new challenges
      agent.post('/api/challenges')
      .send(challenge)
      .expect(400)
      .end(function (challengeSaveErr, challengeSaveRes) {
        // Set message assertion
        (challengeSaveRes.body.message).should.match('Name cannot be blank');

        // Handle challenges save error
        done(challengeSaveErr);
      });
    });
  });

  it('should be able to update an challenges if signed in', function (done) {
    agent.post('/api/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      // Get the userId
      var userId = user.id;

      // Save a new challenges
      agent.post('/api/challenges')
      .send(challenge)
      .expect(200)
      .end(function (challengeSaveErr, challengeSaveRes) {
        // Handle challenges save error
        if (challengeSaveErr) {
          return done(challengeSaveErr);
        }

        // Update challenges title
        challenge.title = 'WHY YOU GOTTA BE SO MEAN?';

        // Update an existing challenges
        agent.put('/api/challenges/' + challengeSaveRes.body._id)
        .send(challenge)
        .expect(200)
        .end(function (challengeUpdateErr, challengeUpdateRes) {
          // Handle challenges update error
          if (challengeUpdateErr) {
            return done(challengeUpdateErr);
          }

          // Set assertions
          (challengeUpdateRes.body._id).should.equal(challengeSaveRes.body._id);
          (challengeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

          // Call the assertion callback
          done();
        });
      });
    });
  });

  it('should be able to get a list of challenges if not signed in', function (done) {
    // Create new challenges model instance
    var challengeObj = new Challenge(challenge);

    // Save the challenges
    challengeObj.save(function () {
      // Request challenges
      request(app).get('/api/challenges')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);

        // Call the assertion callback
        done();
      });

    });
  });

  it('should be able to get a single challenges if not signed in', function (done) {
    // Create new challenges model instance
    var challengeObj = new Challenge(challenge);

    // Save the challenges
    challengeObj.save(function () {
      request(app).get('/api/challenges/' + challengeObj._id)
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('title', challenge.title);

        // Call the assertion callback
        done();
      });
    });
  });

  it('should return proper error for single challenges with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/challenges/test')
    .end(function (req, res) {
      // Set assertion
      res.body.should.be.instanceof(Object).and.have.property('message', 'Challenge is invalid');

      // Call the assertion callback
      done();
    });
  });

  it('should return proper error for single challenges which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent challenges
    request(app).get('/api/challenges/559e9cd815f80b4c256a8f41')
    .end(function (req, res) {
      // Set assertion
      res.body.should.be.instanceof(Object).and.have.property('message', 'No challenges with that identifier has been found');

      // Call the assertion callback
      done();
    });
  });

  it('should be able to delete an challenges if signed in', function (done) {
    agent.post('/api/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      // Get the userId
      var userId = user.id;

      // Save a new challenges
      agent.post('/api/challenges')
      .send(challenge)
      .expect(200)
      .end(function (challengeSaveErr, challengeSaveRes) {
        // Handle challenges save error
        if (challengeSaveErr) {
          return done(challengeSaveErr);
        }

        // Delete an existing challenges
        agent.delete('/api/challenges/' + challengeSaveRes.body._id)
        .send(challenge)
        .expect(200)
        .end(function (challengeDeleteErr, challengeDeleteRes) {
          // Handle challenges error error
          if (challengeDeleteErr) {
            return done(challengeDeleteErr);
          }

          // Set assertions
          (challengeDeleteRes.body._id).should.equal(challengeSaveRes.body._id);

          // Call the assertion callback
          done();
        });
      });
    });
  });

  it('should not be able to delete an challenges if not signed in', function (done) {
    // Set challenges user
    challenge.user = user;

    // Create new challenges model instance
    var challengeObj = new Challenge(challenge);

    // Save the challenges
    challengeObj.save(function () {
      // Try deleting challenges
      request(app).delete('/api/challenges/' + challengeObj._id)
      .expect(403)
      .end(function (challengeDeleteErr, challengeDeleteRes) {
        // Set message assertion
        (challengeDeleteRes.body.message).should.match('User is not authorized');

        // Handle challenges error error
        done(challengeDeleteErr);
      });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Challenge.remove().exec(done);
    });
  });
});
