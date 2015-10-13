'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Challengeboard = mongoose.model('Challengeboard'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, challengeboard;

/**
 * Challengeboard routes tests
 */
describe('Challengeboard CRUD tests', function () {
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

    // Save a user to the test db and create new challengeboards
    user.save(function () {
      challengeboard = {
        title: 'Challengeboard Title',
        content: 'Challengeboard Content'
      };

      done();
    });
  });

  it('should be able to save an challengeboards if logged in', function (done) {
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

        // Save a new challengeboards
        agent.post('/api/challengeboards')
          .send(challengeboard)
          .expect(200)
          .end(function (challengeboardSaveErr, challengeboardSaveRes) {
            // Handle challengeboards save error
            if (challengeboardSaveErr) {
              return done(challengeboardSaveErr);
            }

            // Get a list of challengeboards
            agent.get('/api/challengeboards')
              .end(function (challengeboardsGetErr, challengeboardsGetRes) {
                // Handle challengeboards save error
                if (challengeboardsGetErr) {
                  return done(challengeboardsGetErr);
                }

                // Get challengeboards list
                var challengeboards = challengeboardsGetRes.body;

                // Set assertions
                (challengeboards[0].user._id).should.equal(userId);
                (challengeboards[0].title).should.match('Challengeboard Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an challengeboards if not logged in', function (done) {
    agent.post('/api/challengeboards')
      .send(challengeboard)
      .expect(403)
      .end(function (challengeboardSaveErr, challengeboardSaveRes) {
        // Call the assertion callback
        done(challengeboardSaveErr);
      });
  });

  it('should not be able to save an challengeboards if no title is provided', function (done) {
    // Invalidate title field
    challengeboard.title = '';

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

        // Save a new challengeboards
        agent.post('/api/challengeboards')
          .send(challengeboard)
          .expect(400)
          .end(function (challengeboardSaveErr, challengeboardSaveRes) {
            // Set message assertion
            (challengeboardSaveRes.body.message).should.match('Title cannot be blank');

            // Handle challengeboards save error
            done(challengeboardSaveErr);
          });
      });
  });

  it('should be able to update an challengeboards if signed in', function (done) {
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

        // Save a new challengeboards
        agent.post('/api/challengeboards')
          .send(challengeboard)
          .expect(200)
          .end(function (challengeboardSaveErr, challengeboardSaveRes) {
            // Handle challengeboards save error
            if (challengeboardSaveErr) {
              return done(challengeboardSaveErr);
            }

            // Update challengeboards title
            challengeboard.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing challengeboards
            agent.put('/api/challengeboards/' + challengeboardSaveRes.body._id)
              .send(challengeboard)
              .expect(200)
              .end(function (challengeboardUpdateErr, challengeboardUpdateRes) {
                // Handle challengeboards update error
                if (challengeboardUpdateErr) {
                  return done(challengeboardUpdateErr);
                }

                // Set assertions
                (challengeboardUpdateRes.body._id).should.equal(challengeboardSaveRes.body._id);
                (challengeboardUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of challengeboards if not signed in', function (done) {
    // Create new challengeboards model instance
    var challengeboardObj = new Challengeboard(challengeboard);

    // Save the challengeboards
    challengeboardObj.save(function () {
      // Request challengeboards
      request(app).get('/api/challengeboards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single challengeboards if not signed in', function (done) {
    // Create new challengeboards model instance
    var challengeboardObj = new Challengeboard(challengeboard);

    // Save the challengeboards
    challengeboardObj.save(function () {
      request(app).get('/api/challengeboards/' + challengeboardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', challengeboard.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single challengeboards with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/challengeboards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Challengeboard is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single challengeboards which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent challengeboards
    request(app).get('/api/challengeboards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No challengeboards with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an challengeboards if signed in', function (done) {
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

        // Save a new challengeboards
        agent.post('/api/challengeboards')
          .send(challengeboard)
          .expect(200)
          .end(function (challengeboardSaveErr, challengeboardSaveRes) {
            // Handle challengeboards save error
            if (challengeboardSaveErr) {
              return done(challengeboardSaveErr);
            }

            // Delete an existing challengeboards
            agent.delete('/api/challengeboards/' + challengeboardSaveRes.body._id)
              .send(challengeboard)
              .expect(200)
              .end(function (challengeboardDeleteErr, challengeboardDeleteRes) {
                // Handle challengeboards error error
                if (challengeboardDeleteErr) {
                  return done(challengeboardDeleteErr);
                }

                // Set assertions
                (challengeboardDeleteRes.body._id).should.equal(challengeboardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an challengeboards if not signed in', function (done) {
    // Set challengeboards user
    challengeboard.user = user;

    // Create new challengeboards model instance
    var challengeboardObj = new Challengeboard(challengeboard);

    // Save the challengeboards
    challengeboardObj.save(function () {
      // Try deleting challengeboards
      request(app).delete('/api/challengeboards/' + challengeboardObj._id)
        .expect(403)
        .end(function (challengeboardDeleteErr, challengeboardDeleteRes) {
          // Set message assertion
          (challengeboardDeleteRes.body.message).should.match('User is not authorized');

          // Handle challengeboards error error
          done(challengeboardDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Challengeboard.remove().exec(done);
    });
  });
});
