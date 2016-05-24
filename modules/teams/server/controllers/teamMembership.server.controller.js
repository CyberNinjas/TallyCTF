'use strict';
/**
 * @ngdoc controller
 * @name teamsServer.controller:TeamMembershipController
 * @description
 * Handles the members array within team objects by effectively allowing
 * the addition and removal of a team's memebers.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * Removes a user from the team
 */
exports.removeMember = function (req, res) {
  var team = req.team;
  var user = req.model;
  // Check to make sure the user being removed is part of the team
  console.log(user.team.toString());
  console.log(team._id.toString());
  if(user.team.toString() !== team._id.toString()) {
    return res.status(400).send({
      message: 'User is not in specified team!'
    });
  }
  // Update the team
  for(var i = 0; i < team.members.length; ++i) {
    if(team.members[i]._id.toString() === user._id.toString()) {
      team.members.splice(i, 1);
      break;
    }
  }
  // Update the user roles & team
  var roleIndex = user.roles.indexOf('teamMember');
  if(roleIndex > -1) user.roles.splice(roleIndex, 1);
  user.team = undefined;
  // Save the team / user
  team.save(function (err) {
    if(err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
  user.save(function (err) {
    if(err) return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
exports.addTeamToUser = function (user, team) {
  if(user.roles.indexOf('teamMember') === -1) {
    user.roles.push('teamMember');
  }
  user.team.push(team._id)
  user.save(function (err) {
    if(err) return false;
  });
  return true;
};
/**
 * Find Team names from requestToJoin field and askToJoin field
 */
//FIXME: the following two methods need to be re-architected.
exports.findRequests = function (req, res) {
  Team.find({
    '_id': {
      $in: req.user.requestToJoin
    }
  }).select('teamName').exec(function (err, teams) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
    }
  });
};
/**
 * Find Team names from requestToJoin field and askToJoin field
 */
exports.findAsks = function (req, res) {
  Team.find({
    '_id': {
      $in: req.user.askToJoin
    }
  }).select('teamName').exec(function (err, teams) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teams);
    }
  });
};
