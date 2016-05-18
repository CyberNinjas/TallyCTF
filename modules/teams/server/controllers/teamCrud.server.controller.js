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

exports.create = function (req, res) {
  var team = new Team(req.body);
  var user = req.user;
  var scoreBoard = new ScoreBoard();
  team.scoreBoard = scoreBoard._id;
  scoreBoard.team = team._id;
  scoreBoard.teamName = team.teamName;
  // Save the user / team
  team.save(function (err) {
    if(err) {
      scoreBoard.remove();
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      scoreBoard.save(function (err) {
        if(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // Update the user's data
          if(user.roles.indexOf('teamCaptain') === -1) {
            user.roles.push('teamCaptain');
          }
          user.team.push(team._id);
          // Save the user
          user.save(function (err) {
            if(err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              req.login(user, function (err) {
                if(err) {
                  res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  res.json(user);
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.read = function (req, res) {
  res.json(req.team);
};

exports.update = function (req, res) {
  var team = req.team;
  team.teamName = req.body.teamName;
  team.requestToJoin = req.body.requestToJoin;
  team.members = req.body.members;
  team.askToJoin = req.body.askToJoin;
  team.save(function (err) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

exports.delete = function (req, res) {
  var team = req.team;
  var user = req.user;
  // Make sure the person deleting this can delete this
  if((user.roles.indexOf('admin') === -1) && (!user || team.teamCaptain._id.toString() !== user._id.toString())) {
    return res.status(503).send({
      message: 'Not authorized to delete this team!'
    });
  }
  // Update all members / requestees / requesters of team deletion
  var members = User.find({
    '_id': {
      $in: team.members
    }
  }, function (err, users) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for(var i = 0; i < users.length; ++i) {
        // Update the User's roles (Remove teamMember / teamCaptain role)
        var captain = users[i]
          .roles
          .indexOf('teamCaptain');
        if(captain > -1)
          users[i].roles.splice(captain, 1);
        var member = users[i]
          .roles
          .indexOf('teamMember');
        if(member > -1)
          users[i].roles.splice(member, 1);

        // Remove the team from the user (MongoDB strips away all tags that are undefined)
        users[i].team = undefined;
        // FIXME: Have a way to handle this failing
        users[i].save();
      }
    }
  });
  var requests = User.find({
    '_id': {
      $in: team.requestToJoin
    }
  }, function (err, users) {
    if(err)
      return false;
    for(var i = 0; i < users.length; ++i) {
      var index = users[i]
        .requestToJoin
        .indexOf(team._id);
      if(index !== -1) {
        users[i]
          .requestToJoin
          .splice(index, 1);
        // FIXME: Have a way to handle this failing
        users[i].save();
      }
    }
  });
  var asks = User.find({
    '_id': {
      $in: team.askToJoin
    }
  }, function (err, users) {
    if(err)
      return false;
    for(var i = 0; i < users.length; ++i) {
      var index = users[i]
        .askToJoin
        .indexOf(team._id);
      if(index !== -1) {
        users[i]
          .askToJoin
          .splice(index, 1);
        // FIXME: Have a way to handle this failing
        users[i].save();
      }
    }
  });
  // Delete the scoreBoard associated with the team being deleted
  ScoreBoard.remove({
    team: team._id
  }, function (err, scoreBoard) {
    if(err) {
      return res
        .status(400)
        .send({
          message: errorHandler.getErrorMessage(err)
        });
    }
  });
  // Delete the team
  team.remove(function (err) {
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
