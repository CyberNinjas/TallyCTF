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
  console.log('create team before user');
  var team = new Team(req.body);
  team.user = req.user;
  var user = req.user;
  user.roles.push('teamCaptain');
  user.roles.push('teamMember');
  console.log(user);
  user.save(function (err) {
    if (err) {
      console.log('got an error');
      console.log(err);
    } else {
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          console.log("saved user");
        }
      });
    }
  });
  console.log('made it after user save');

  team.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
console.log('made it after team save');
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

exports.accept = function(req,res){
  console.log("in accept");
  console.log(req);
};

exports.decline = function(req,res){
  console.log("in decline");
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


exports.addMembers = function(req,res){
  var lteam = 
  console.log("heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
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
  Team.find().sort('-created')
      .populate('members', 'username')
      .populate('requestToJoin', 'username')
      .populate('askToJoin', 'username')
      .populate('teamCaptain','username')
      .exec(function (err, teams) {
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
