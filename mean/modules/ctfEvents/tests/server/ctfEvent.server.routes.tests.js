'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CtfEvent = mongoose.model('CtfEvent'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, ctfEvent;

/**
 * CtfEvent routes tests
 */
describe('CtfEvent CRUD tests', function () {

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

    // Save a user to the test db and create new ctfEvent
    user.save(function () {
      ctfEvent = {
        title: 'CtfEvent Title',
        content: 'CtfEvent Content'
      };

      done();
    });
  });

  it('should be able to save an ctfEvent if logged in', function (done) {
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

        // Save a new ctfEvent
        agent.post('/api/ctfEvents')
          .send(ctfEvent)
          .expect(200)
          .end(function (ctfEventSaveErr, ctfEventSaveRes) {
            // Handle ctfEvent save error
            if (ctfEventSaveErr) {
              return done(ctfEventSaveErr);
            }

            // Get a list of ctfEvents
            agent.get('/api/ctfEvents')
              .end(function (ctfEventsGetErr, ctfEventsGetRes) {
                // Handle ctfEvent save error
                if (ctfEventsGetErr) {
                  return done(ctfEventsGetErr);
                }

                // Get ctfEvents list
                var ctfEvents = ctfEventsGetRes.body;

                // Set assertions
                (ctfEvents[0].user._id).should.equal(userId);
                (ctfEvents[0].title).should.match('CtfEvent Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an ctfEvent if not logged in', function (done) {
    agent.post('/api/ctfEvents')
      .send(ctfEvent)
      .expect(403)
      .end(function (ctfEventSaveErr, ctfEventSaveRes) {
        // Call the assertion callback
        done(ctfEventSaveErr);
      });
  });

  it('should not be able to save an ctfEvent if no title is provided', function (done) {
    // Invalidate title field
    ctfEvent.title = '';

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

        // Save a new ctfEvent
        agent.post('/api/ctfEvents')
          .send(ctfEvent)
          .expect(400)
          .end(function (ctfEventSaveErr, ctfEventSaveRes) {
            // Set message assertion
            (ctfEventSaveRes.body.message).should.match('Title cannot be blank');

            // Handle ctfEvent save error
            done(ctfEventSaveErr);
          });
      });
  });

  it('should be able to update an ctfEvent if signed in', function (done) {
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

        // Save a new ctfEvent
        agent.post('/api/ctfEvents')
          .send(ctfEvent)
          .expect(200)
          .end(function (ctfEventSaveErr, ctfEventSaveRes) {
            // Handle ctfEvent save error
            if (ctfEventSaveErr) {
              return done(ctfEventSaveErr);
            }

            // Update ctfEvent title
            ctfEvent.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing ctfEvent
            agent.put('/api/ctfEvents/' + ctfEventSaveRes.body._id)
              .send(ctfEvent)
              .expect(200)
              .end(function (ctfEventUpdateErr, ctfEventUpdateRes) {
                // Handle ctfEvent update error
                if (ctfEventUpdateErr) {
                  return done(ctfEventUpdateErr);
                }

                // Set assertions
                (ctfEventUpdateRes.body._id).should.equal(ctfEventSaveRes.body._id);
                (ctfEventUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of ctfEvents if not signed in', function (done) {
    // Create new ctfEvent model instance
    var ctfEventObj = new CtfEvent(ctfEvent);

    // Save the ctfEvent
    ctfEventObj.save(function () {
      // Request ctfEvents
      request(app).get('/api/ctfEvents')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single ctfEvent if not signed in', function (done) {
    // Create new ctfEvent model instance
    var ctfEventObj = new CtfEvent(ctfEvent);

    // Save the ctfEvent
    ctfEventObj.save(function () {
      request(app).get('/api/ctfEvents/' + ctfEventObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', ctfEvent.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single ctfEvent with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ctfEvents/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'CtfEvent is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single ctfEvent which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent ctfEvent
    request(app).get('/api/ctfEvents/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No ctfEvent with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an ctfEvent if signed in', function (done) {
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

        // Save a new ctfEvent
        agent.post('/api/ctfEvents')
          .send(ctfEvent)
          .expect(200)
          .end(function (ctfEventSaveErr, ctfEventSaveRes) {
            // Handle ctfEvent save error
            if (ctfEventSaveErr) {
              return done(ctfEventSaveErr);
            }

            // Delete an existing ctfEvent
            agent.delete('/api/ctfEvents/' + ctfEventSaveRes.body._id)
              .send(ctfEvent)
              .expect(200)
              .end(function (ctfEventDeleteErr, ctfEventDeleteRes) {
                // Handle ctfEvent error error
                if (ctfEventDeleteErr) {
                  return done(ctfEventDeleteErr);
                }

                // Set assertions
                (ctfEventDeleteRes.body._id).should.equal(ctfEventSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an ctfEvent if not signed in', function (done) {
    // Set ctfEvent user
    ctfEvent.user = user;

    // Create new ctfEvent model instance
    var ctfEventObj = new CtfEvent(ctfEvent);

    // Save the ctfEvent
    ctfEventObj.save(function () {
      // Try deleting ctfEvent
      request(app).delete('/api/ctfEvents/' + ctfEventObj._id)
        .expect(403)
        .end(function (ctfEventDeleteErr, ctfEventDeleteRes) {
          // Set message assertion
          (ctfEventDeleteRes.body.message).should.match('User is not authorized');

          // Handle ctfEvent error error
          done(ctfEventDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      CtfEvent.remove().exec(done);
    });
  });
});
