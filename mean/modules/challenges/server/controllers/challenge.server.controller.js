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
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a challenges
 */
exports.create = function (req, res) {
  var challenge = new Challenge(req.body);
  challenge.user = req.user;

  challenge.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challenge);
    }
  });
};

/**
 * Show the current challenges
 */
exports.read = function (req, res) {
  res.json(req.challenge);
};

/**
 * Update a challenges
 */
exports.update = function (req, res) {
  var challenge = req.challenge;

  challenge.name = req.body.name;
  challenge.description = req.body.description;
  challenge.category = req.body.category;
  challenge.points = req.body.points;
  challenge.flags = req.body.flags;

  challenge.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challenge);
    }
  });
};

/**
 * Delete an challenges
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

exports.submit = function(req, res) {
  var teamId = req.user.team;
  var attempt = req.body.solve;
  var roles = req.user.roles;
  var challenge = req.challenge;

  // Check that the user is able to submit (must be on a team)
  if ((roles.indexOf("teamMember") === -1) && (roles.indexOf("teamCaptain") === -1)){
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
  for (var i = 0; i < challenge.flags.length; ++i)
  {
    // Handle regular expression case
    if (challenge.flags[i].regex) {
      var pat = new RegExp(challenge.flags[i].flag);
      correct = pat.test(attempt);
    } else {
      correct = (attempt === challenge.flags[i].flag);
    }

    if (correct)
      break;
  }

  if (correct) {
    console.log("Correct Answer!");
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
    console.log("Incorrect Answer!");
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

  Challenge.findById(id).exec(function (err, challenge) {
    if (err) {
      return next(err);
    } else if (!challenge) {
      return res.status(404).send({
        message: 'No challenges with that identifier has been found'
      });
    }
    req.challenge = challenge;
    next();
  });
};
