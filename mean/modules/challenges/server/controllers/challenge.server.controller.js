'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  Challenge = mongoose.model('Challenge'),
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

  challenge.title = req.body.title;
  challenge.content = req.body.content;

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
  Challenge.find().sort('-created').populate('user', 'displayName').exec(function (err, challenges) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      challenges.forEach(function (challenge) {
        delete challenge.flag;
      });
      res.json(challenges);
    }
  });
};

exports.submit = function(req, res) {
  console.log(req.user);
  var teamId = req.user.team;
  var attempt = req.body.flag;
  Challenge.findById(req.body.challenge._id).exec(function (err, challenge){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else if (!challenge) {
      return res.status(404).send({
        message: 'No challenges with that identifier has been found'
      });
    }
    console.log(attempt);
    console.log(challenge);
    if (attempt === challenge.flag){
      challenge.solves += 1;
      challenge.save(function (err) {
        if (err) {
          console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
      console.log("Correct Answer!");
      Team.findById(teamId).exec(function (err, team) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        else if (!team) {
          return res.status(404).send({
            message: 'No challenges with that identifier has been found'
          });
        }
        console.log("Get to the Scoreboard");
        //get the scoreboard
        ScoreBoard.findById(team.scoreBoard).exec( function (err, scoreBoard) {
          if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          else if (!team){
            return res.status(404).send({
              message: 'No scoreboard with that ID found'
            });
          }
          //challenge, name, points, date
          console.log("Before Push:");
          console.log(challenge._id);
          console.log(req.user._id);
          scoreBoard.solved.push({challengeId: challenge._id, userId: req.user._id, date: Date.now(), points: challenge.points});
          scoreBoard.save(function (err) {
            if (err) {
              console.log(err);
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          });
        });
      });
      return res.status(200).send({
        message: 'Correct',
        solves: challenge.solves
      });
    }
    else{
      console.log("Incorrect Answer!");
      return res.status(200).send({
        message: 'Incorrect'
      });
    }
  });
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

  Challenge.findById(id).populate('user', 'displayName').exec(function (err, challenge) {
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
