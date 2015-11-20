'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ScoreBoard = mongoose.model('ScoreBoard'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, scoreBoard;

/**
 * ScoreBoard routes tests
 */
describe('ScoreBoard CRUD tests', function () {

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

    // Save a user to the test db and create new scoreBoard
    user.save(function () {
      scoreBoard = {
        title: 'ScoreBoard Title',
        content: 'ScoreBoard Content'
      };

      done();
    });
  });

  it('should be able to save an scoreBoard if logged in', function (done) {
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

        // Save a new scoreBoard
        agent.post('/api/scoreBoard')
          .send(scoreBoard)
          .expect(200)
          .end(function (scoreBoardSaveErr, scoreBoardSaveRes) {
            // Handle scoreBoard save error
            if (scoreBoardSaveErr) {
              return done(scoreBoardSaveErr);
            }

            // Get a list of scoreBoard
            agent.get('/api/scoreBoard')
              .end(function (scoreBoardGetErr, scoreBoardGetRes) {
                // Handle scoreBoard save error
                if (scoreBoardGetErr) {
                  return done(scoreBoardGetErr);
                }

                // Get scoreBoard list
                var scoreBoard = scoreBoardGetRes.body;

                // Set assertions
                (scoreBoard[0].user._id).should.equal(userId);
                (scoreBoard[0].title).should.match('ScoreBoard Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an scoreBoard if not logged in', function (done) {
    agent.post('/api/scoreBoard')
      .send(scoreBoard)
      .expect(403)
      .end(function (scoreBoardSaveErr, scoreBoardSaveRes) {
        // Call the assertion callback
        done(scoreBoardSaveErr);
      });
  });

  it('should not be able to save an scoreBoard if no title is provided', function (done) {
    // Invalidate title field
    scoreBoard.title = '';

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

        // Save a new scoreBoard
        agent.post('/api/scoreBoard')
          .send(scoreBoard)
          .expect(400)
          .end(function (scoreBoardSaveErr, scoreBoardSaveRes) {
            // Set message assertion
            (scoreBoardSaveRes.body.message).should.match('Title cannot be blank');

            // Handle scoreBoard save error
            done(scoreBoardSaveErr);
          });
      });
  });

  it('should be able to update an scoreBoard if signed in', function (done) {
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

        // Save a new scoreBoard
        agent.post('/api/scoreBoard')
          .send(scoreBoard)
          .expect(200)
          .end(function (scoreBoardSaveErr, scoreBoardSaveRes) {
            // Handle scoreBoard save error
            if (scoreBoardSaveErr) {
              return done(scoreBoardSaveErr);
            }

            // Update scoreBoard title
            scoreBoard.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing scoreBoard
            agent.put('/api/scoreBoard/' + scoreBoardSaveRes.body._id)
              .send(scoreBoard)
              .expect(200)
              .end(function (scoreBoardUpdateErr, scoreBoardUpdateRes) {
                // Handle scoreBoard update error
                if (scoreBoardUpdateErr) {
                  return done(scoreBoardUpdateErr);
                }

                // Set assertions
                (scoreBoardUpdateRes.body._id).should.equal(scoreBoardSaveRes.body._id);
                (scoreBoardUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of scoreBoard if not signed in', function (done) {
    // Create new scoreBoard model instance
    var scoreBoardObj = new ScoreBoard(scoreBoard);

    // Save the scoreBoard
    scoreBoardObj.save(function () {
      // Request scoreBoard
      request(app).get('/api/scoreBoard')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single scoreBoard if not signed in', function (done) {
    // Create new scoreBoard model instance
    var scoreBoardObj = new ScoreBoard(scoreBoard);

    // Save the scoreBoard
    scoreBoardObj.save(function () {
      request(app).get('/api/scoreBoard/' + scoreBoardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', scoreBoard.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single scoreBoard with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/scoreBoard/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'ScoreBoard is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single scoreBoard which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent scoreBoard
    request(app).get('/api/scoreBoard/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No scoreBoard with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an scoreBoard if signed in', function (done) {
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

        // Save a new scoreBoard
        agent.post('/api/scoreBoard')
          .send(scoreBoard)
          .expect(200)
          .end(function (scoreBoardSaveErr, scoreBoardSaveRes) {
            // Handle scoreBoard save error
            if (scoreBoardSaveErr) {
              return done(scoreBoardSaveErr);
            }

            // Delete an existing scoreBoard
            agent.delete('/api/scoreBoard/' + scoreBoardSaveRes.body._id)
              .send(scoreBoard)
              .expect(200)
              .end(function (scoreBoardDeleteErr, scoreBoardDeleteRes) {
                // Handle scoreBoard error error
                if (scoreBoardDeleteErr) {
                  return done(scoreBoardDeleteErr);
                }

                // Set assertions
                (scoreBoardDeleteRes.body._id).should.equal(scoreBoardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an scoreBoard if not signed in', function (done) {
    // Set scoreBoard user
    scoreBoard.user = user;

    // Create new scoreBoard model instance
    var scoreBoardObj = new ScoreBoard(scoreBoard);

    // Save the scoreBoard
    scoreBoardObj.save(function () {
      // Try deleting scoreBoard
      request(app).delete('/api/scoreBoard/' + scoreBoardObj._id)
        .expect(403)
        .end(function (scoreBoardDeleteErr, scoreBoardDeleteRes) {
          // Set message assertion
          (scoreBoardDeleteRes.body.message).should.match('User is not authorized');

          // Handle scoreBoard error error
          done(scoreBoardDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      ScoreBoard.remove().exec(done);
    });
  });
});
