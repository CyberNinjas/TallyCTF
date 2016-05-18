'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  ScoreBoard = mongoose.model('ScoreBoard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.accept = function (req, res) {
  var team = req.team;
  var user = req.model;
  var capt = (req.user.roles.indexOf('teamCaptain') !== -1 && team.teamCaptain._id.toString() === req.user._id.toString());
  // Used in the for loop below
  var reqLen = team.requestToJoin.length;
  var askLen = team.askToJoin.length;
  var max = ((reqLen > askLen) ? reqLen : askLen);
  // This works by finding the max size and iterating over the max, skipping the smaller
  // array once the index is over the smaller array's max
  // Check if the requested user is in either array
  for(var i = 0; i < max; ++i) {
    if(i < reqLen && team.requestToJoin[i]._id.toString() === user._id.toString() && capt) {
      team
        .requestToJoin
        .splice(i, 1);
      team
        .members
        .push(user._id);
      break;
    }
    if(i < askLen && team.askToJoin[i]._id.toString() === user._id.toString()) {
      team
        .askToJoin
        .splice(i, 1);
      team
        .members
        .push(user._id);
      break;
    }
    // If it didn't find a user, fail
    if(i === max - 1)
      return res.status(400)
        .send({
          message: 'Invalid User to add'
        });
  }
  // Try to add the user, error if alreay on a team
  if(!exports.addTeamToUser(user, team))
    return res.status(400)
      .send({
        message: 'User is already a member of a team!'
      });

  // FIXME: Support reverting changes on the user when this fails
  team
    .save(function (err) {
      if(err) {
        return res
          .status(400)
          .send({
            message: errorHandler.getErrorMessage(err)
          });
      } else {
        res.json(team);
      }
    });
};
/**
 * Function to decline a request, removing a user from requestToJoin from both User and Team Schemas
 */
exports.decline = function (req, res) {
  var team = req.team;
  var user = req.model;
  var capt = (req.user.roles.indexOf('teamCaptain') !== -1 && team.teamCaptain._id.toString() === req.user._id.toString());
  var reqLen = team.requestToJoin.length;
  var askLen = team.askToJoin.length;
  var max = ((reqLen > askLen) ? reqLen : askLen);
  // FIXME: This will fail if user both is requested to join a team and requests to join
  // FIXME: a team. Consider using a hash for the user requests. (Or a JSON. Whatever)
  // This works by finding the max size and iterating over the max, skipping the smaller
  // array once the index is over the smaller array's max
  // Remove user the lists
  for(var i = 0; i < max; ++i) {
    if(i < reqLen && team.requestToJoin[i]._id.toString() === user._id.toString() && capt) {
      team
        .requestToJoin
        .splice(i, 1);
      user
        .requestToJoin
        .splice(user.requestToJoin.indexOf(team._id), 1);
      break;
    }
    if(i < askLen && team.askToJoin[i]._id.toString() === user._id.toString()) {
      // Remove the user's request fom the user
      user
        .askToJoin
        .splice(user.askToJoin.indexOf(team._id), 1);
      team
        .askToJoin
        .splice(i, 1);
      break;
    }
    // If it didn't find a user, fail
    if(i === max - 1)
      return res.status(400)
        .send({
          message: 'Invalid User to add'
        });
  }
  //save user
  user
    .save(function (err) {
      if(err)
        return res.status(400)
          .send({
            message: errorHandler.getErrorMessage(err)
          });
    });
  // Save the team
  team.save(function (err) {
    if(err) {
      return res
        .status(400)
        .send({
          message: errorHandler.getErrorMessage(err)
        });
    } else {
      res.json(team);
    }
  });
};
/**
 * Allows a team captain to add users (ask to, at least)
 */
exports.askToJoin = function (req, res) {
  var team = req.team;
  var user = req.model;
  //update user and team askToJoin fields
  team
    .askToJoin
    .push(user._id);
  user
    .askToJoin
    .push(team._id);
  //Save team
  team.save(function (err) {
    if(err) {
      return res
        .status(400)
        .send({
          message: errorHandler.getErrorMessage(err)
        });
    } else {
      res.json(team);
    }
  });
  //Save user
  user.save(function (err) {
    if(err)
      return res.status(400)
        .send({
          message: errorHandler.getErrorMessage(err)
        });
  });
};
/**
 * Allows a team captain to add users (ask to, at least)
 */
exports.requestToJoin = function (req, res) {
  var team = req.team;
  var user = req.model;
  //update user and team requestToJoin fields
  team
    .requestToJoin
    .push(user._id);
  user
    .requestToJoin
    .push(team._id);
  //Save team
  team.save(function (err) {
    if(err) {
      return res
        .status(400)
        .send({
          message: errorHandler.getErrorMessage(err)
        });
    } else {
      res.json(team);
    }
  });
  //Save user
  user.save(function (err) {
    if(err)
      return res.status(400)
        .send({
          message: errorHandler.getErrorMessage(err)
        });
  });
};
