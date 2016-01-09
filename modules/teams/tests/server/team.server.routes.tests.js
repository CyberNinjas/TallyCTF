'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Team = mongoose.model('Team'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, team;

/**
 * Team routes tests
 */
describe('Team CRUD tests', function () {
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

    // Save a user to the test db and create new team
    user.save(function () {
      team = {
        title: 'Team Title',
        content: 'Team Content'
      };

      done();
    });
  });

  it('should be able to save an team if logged in', function (done) {
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

        // Save a new team
        agent.post('/api/teams')
          .send(team)
          .expect(200)
          .end(function (teamSaveErr, teamSaveRes) {
            // Handle team save error
            if (teamSaveErr) {
              return done(teamSaveErr);
            }

            // Get a list of teams
            agent.get('/api/teams')
              .end(function (teamsGetErr, teamsGetRes) {
                // Handle team save error
                if (teamsGetErr) {
                  return done(teamsGetErr);
                }

                // Get teams list
                var teams = teamsGetRes.body;

                // Set assertions
                (teams[0].user._id).should.equal(userId);
                (teams[0].title).should.match('Team Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an team if not logged in', function (done) {
    agent.post('/api/teams')
      .send(team)
      .expect(403)
      .end(function (teamSaveErr, teamSaveRes) {
        // Call the assertion callback
        done(teamSaveErr);
      });
  });

  it('should not be able to save an team if no title is provided', function (done) {
    // Invalidate title field
    team.title = '';

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

        // Save a new team
        agent.post('/api/teams')
          .send(team)
          .expect(400)
          .end(function (teamSaveErr, teamSaveRes) {
            // Set message assertion
            (teamSaveRes.body.message).should.match('Title cannot be blank');

            // Handle team save error
            done(teamSaveErr);
          });
      });
  });

  it('should be able to update an team if signed in', function (done) {
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

        // Save a new team
        agent.post('/api/teams')
          .send(team)
          .expect(200)
          .end(function (teamSaveErr, teamSaveRes) {
            // Handle team save error
            if (teamSaveErr) {
              return done(teamSaveErr);
            }

            // Update team title
            team.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing team
            agent.put('/api/teams/' + teamSaveRes.body._id)
              .send(team)
              .expect(200)
              .end(function (teamUpdateErr, teamUpdateRes) {
                // Handle team update error
                if (teamUpdateErr) {
                  return done(teamUpdateErr);
                }

                // Set assertions
                (teamUpdateRes.body._id).should.equal(teamSaveRes.body._id);
                (teamUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of teams if not signed in', function (done) {
    // Create new team model instance
    var teamObj = new Team(team);

    // Save the team
    teamObj.save(function () {
      // Request teams
      request(app).get('/api/teams')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single team if not signed in', function (done) {
    // Create new team model instance
    var teamObj = new Team(team);

    // Save the team
    teamObj.save(function () {
      request(app).get('/api/teams/' + teamObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', team.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single team with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/teams/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Team is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single team which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent team
    request(app).get('/api/teams/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No team with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an team if signed in', function (done) {
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

        // Save a new team
        agent.post('/api/teams')
          .send(team)
          .expect(200)
          .end(function (teamSaveErr, teamSaveRes) {
            // Handle team save error
            if (teamSaveErr) {
              return done(teamSaveErr);
            }

            // Delete an existing team
            agent.delete('/api/teams/' + teamSaveRes.body._id)
              .send(team)
              .expect(200)
              .end(function (teamDeleteErr, teamDeleteRes) {
                // Handle team error error
                if (teamDeleteErr) {
                  return done(teamDeleteErr);
                }

                // Set assertions
                (teamDeleteRes.body._id).should.equal(teamSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an team if not signed in', function (done) {
    // Set team user
    team.user = user;

    // Create new team model instance
    var teamObj = new Team(team);

    // Save the team
    teamObj.save(function () {
      // Try deleting team
      request(app).delete('/api/teams/' + teamObj._id)
        .expect(403)
        .end(function (teamDeleteErr, teamDeleteRes) {
          // Set message assertion
          (teamDeleteRes.body.message).should.match('User is not authorized');

          // Handle team error error
          done(teamDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Team.remove().exec(done);
    });
  });
});
