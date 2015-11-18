'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
    User =mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a team
 */
exports.create = function (req, res) {
  var team = new Team(req.body);
  team.user = req.user;

  team.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

/**
 * Show the current team
 */
exports.read = function (req, res) {
  res.json(req.team);
};

/**
 * Update a team
 */
exports.update = function (req, res) {
  var team = req.team;

  team.teamName = req.body.teamName;
  //team.content = req.body.content;

  team.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

exports.requestsToJoin = function(req, res){
  var team = req.team;
  console.log(team);

  team.requestToJoin.push(req.user.username);

  console.log('I am in below server');
  team.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};
exports.clear = function(req,res){
  Team.remove({}, function(err,thing) {
    if (err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
  }
  });
  res.status(200).send();
};
/**
 * Delete an team
 */
exports.delete = function (req, res) {
  var team = req.team;

  team.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

/**
 * List of Teams
 */
exports.list = function (req, res) {
  Team.find().sort('-created').populate('user', 'displayName').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
    }
  });
};

/**
 * Team middleware
 */
exports.teamByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team is invalid'
    });
  }

  Team.findById(id).populate('user', 'displayName').exec(function (err, team) {
    if (err) {
      return next(err);
    } else if (!team) {
      return res.status(404).send({
        message: 'No team with that identifier has been found'
      });
    }
    req.team = team;
    next();
  });
};
