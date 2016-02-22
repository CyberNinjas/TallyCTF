'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  Challenge = mongoose.model('Challenge'),
  CurrentCtfEvent = mongoose.model('CurrentCtfEvent'),
  ScoreBoard = mongoose.model('ScoreBoard'),
  scoreboard = require(path.resolve('./modules/scoreBoard/server/controllers/scoreBoard.server.controller.js')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Q = require('q');
var self = this;

/**
 * read - Returns the current challenge as a JSON Object.
 * NOTE: req.challenge is only populated if :challengeId is in the route so that
 * this.challengeByID is run first.
 */
exports.read = function (req, res, next) {
  res.json(req.challenge);
};

/**
 * default - Sets req.challenge to a default, blank, challenge object, and calls read for the display.
 * @param req - Express Request Object
 * @param res - Express Response Object
 * @param next - Next Function in the MiddleWare
 */
exports.default = function (req, res, next) {
  req.challenge = new Challenge({
    'challenge_type': 'text',
    'challenge_format': 'short-answer',
    'points': 10,
    'answers': []
  });
  self.read(req, res, next);//Use Default Output for Challenge
}

/**
 * updateOrCreate - Updates or creates a challenge if it doesn't exist yet.
 * Sends the output to a JSON response of {success:true} if successful or {success:false, error:MESSAGE} if failed.
 * @param req - Express Request Object
 * @param res - Express Response Object
 */
exports.updateOrCreate = function (req, res) {
  //Test if its a create since req.challenge will be null.
  var isCreate = (req.challenge) ? false : true;
  var challenge = req.challenge || new Challenge({});

  if (isCreate) //Set Create if its being created
    challenge.createdBy = req.user._id;
  challenge.lastModifiedBy = req.user._id;

  //Set lastModified
  challenge.lastModified = Date.now();

  //set challenge properties from request body
  challenge.name = req.body.name;
  challenge.description = req.body.description;
  challenge.category = req.body.category;
  challenge.points = req.body.points;
  challenge.answers = req.body.answers;
  challenge.challenge_type = req.body.challenge_type;
  challenge.challenge_format = req.body.challenge_format;
  //challenge.files = req.body.challenge.files;

  //commit changes to DB
  challenge.save(function (err) {
    if (err) {
      res.send({ success: false, error: err });
    } else {
      res.send({ success: true });
    }
  });
};

/**
 * Delete a challenge
 */
exports.delete = function (req, res) {
  var challenge = req.challenge;

  challenge.remove(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challenge);
    }
  });
};

/**
 * List of Challenges
 */
exports.list = function (req, res) {
  //use mongoose object's 'select' after 'find' function to strip out the flag's value from the response
  Challenge.find().select('-flags').sort('-created').exec(function (err, challenges) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challenges);
    }
  });
};

//Method to validate and register challenge solve or reject incorrect answer
exports.submit = function (req, res) {

  //get teamID of user requesting submit
  var teamId = req.user.team;

  //get the string to be considered for submission
  var attempt = req.body.solve;

  //get the user's roles
  var roles = req.user.roles;

  //get the challenge they are submitting for
  var challenge = req.challenge;

  // Check that the user is able to submit (must be on a team)
  if ((roles.indexOf('teamMember') === -1) && (roles.indexOf('teamCaptain') === -1)) {
    return res.status(403).send({
      message: 'You must be on a team to submit flags!'
    });
  }

  // Make sure that there is a challenge to check
  if (!challenge) {
    return res.status(404).send({
      message: 'No challenges with that identifier has been found'
    });
  }

  // Check if the answer provided is correct
  var correct = false;
  for (var i = 0; i < challenge.flags.length; ++i) {
    // Handle regular expression case
    if (challenge.flags[i].regex) {
      var pat = new RegExp(challenge.flags[i].flag);
      correct = pat.test(attempt);
    } else {
      correct = (attempt === challenge.flags[i].flag);
    }

    //if submitted response matches any of the challenge flags, break
    if (correct)
      break;
  }

  //if the answer submitted matches any of the challenge's flags
  if (correct) {
    console.log('Correct Answer!');
    //retrieve the team object the user belongs to
    Team.findById(teamId).exec(function (err, team) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else if (!team) {
        return res.status(404).send({
          message: 'No teams with that identifier have been found'
        });
      }

      // Append the correct solution to the team's scoreBoard
      scoreboard.append(team, req.user, challenge, res);
    });
  } else {
    // On incorrect answer
    console.log('Incorrect Answer!');
    //return a successful submit with the message informing them the answer was wrong
    return res.status(200).send({
      message: 'Incorrect',
      solves: challenge.solves,
      solved: null
    });
  }
};

/**
 * Challenge middleware
 */
exports.challengeByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Challenge is invalid'
    });
  }
  getChallengeById(id).then(function (challenge) {
    req.challenge = challenge;
    next();
  }, function (err) {
    if (err.number == 404)
      res.status(404).send(error.message);
    else
      res.status(500);
    next(err);
  }).finally(function (err) {
  });
};

/**
 * getChallengeById - Takes the id value, looks it up in the MongoDB, and retrieves a challenge object.
 * @param id - The challenge id for the object.
 * @returns {*|promise} - The challenge object, as a promise
 */
function getChallengeById(id) {
  var deferred = Q.defer();
  Challenge.findById(id).exec(function (err, challenge) {
    if (err) {
      deferred.reject(err);
    } else if (!challenge) {
      var error = new Error('No challenges with that identifier were found');
      error.number = 404;
      deferred.reject(error);
    } else {
      deferred.resolve(challenge);
    }
  });
  return deferred.promise;
}