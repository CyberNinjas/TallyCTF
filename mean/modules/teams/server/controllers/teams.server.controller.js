'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  User =mongoose.model('User'),
  ScoreBoard = mongoose.model('ScoreBoard'),
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
  var scoreBoard = new ScoreBoard();
  scoreBoard.team = team._id;
  team.scoreBoard = scoreBoard._id;
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

  scoreBoard.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });

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
  console.log("in read");

  res.json(req.team);
};

/**
 * Update a team
 */
exports.update = function (req, res) {
  console.log(req);
  var team = req.team;
  team.teamName = req.body.teamName;
  team.requestToJoin = req.body.requestToJoin;
  team.members = req.body.members;
  team.askToJoin = req.body.askToJoin;
  
  console.log("I'm not in the save function");
  team.save(function (err) {
    console.log("I'm inside the save function");
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });

};

exports.accept = function(req, res) {
  var team = req.team;
  var user = req.model;
  
  for (var i = 0; i < team.requestToJoin.length; ++i) {
    if (team.requestToJoin[i]._id.index === user._id.index) {
      team.requestToJoin.splice(i, 1);
      team.members.push(user._id);
      break;
    }

    // If it didn't find a user, fail
    if (i === team.requestToJoin.length - 1)
      return res.status(400).send({
        message: "Invalid User to add"
      });
  }

  // Try to add the user, error if alreay on a team
  if (!exports.addTeamToUser(user, team))
    return res.status(400).send({
      message: "User is already a member of a team!"
    });
  
  team.save(function (err) {
    console.log("I'm inside the save function");
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

exports.decline = function(req, res) {
  var team = req.team;
  var user = req.model;

  // Remove user from list of requests
  for (var i = 0; i < team.requestToJoin.length; ++i) {
    if (team.requestToJoin[i]._id.index === user._id.index) {
      team.requestToJoin.splice(i, 1);
      break;
    }

    // If it didn't find a user, fail
    if (i === team.requestToJoin.length - 1)
      return res.status(400).send({
        message: "Invalid User to add"
      });
  }

  // Remove the user's request fom the user
  user.requestToJoin.splice(user.requestToJoin.indexOf(team._id), 1);
  user.save(function (err) {
    if (err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
  });

  // Save the team
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
};

exports.addMembers = function(req,res){
  var user = req.body;
  var teamID = req.user.team;
  var team1;

  /*var search = Team.findOne({_id: teamID},
    function(err,obj) {
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else{
        team1 = obj;
      }
    });*/
};

/**
 * Update a user's roles / team
 */
exports.addTeamToUser = function (user, team) {
  // Fail if already a team member
  if (user.roles.indexOf('teamMember') !== -1)
    return false;

  // Remove user from being a teamCaptain
  var index = user.roles.indexOf('teamCaptain');
  if (index !== -1)
    user.roles.splice(index, 1);

  // Add them as team member and update relevant info
  user.roles.push('teamMember');
  user.team = team._id;

  // Clear any previous requests / asks to join from other teams
  var requests = Team.find({
    "_id": { $in: user.requestToJoin }
  }, function (err, teams) {
    if (err)
      return false;

    for (var i = 0; i < teams.length; ++i) {
      var index = teams[i].requestToJoin.indexOf(user._id);
      if (index !== -1) {
        teams[i].requestToJoin.splice(index, 1);
        teams[i].save();
      }
    }
  });
  var asks = Team.find({
    "_id": { $in: user.askToJoin }
  }, function (err, teams) {
    if (err)
      return false;

    for (var i = 0; i < teams.length; ++i) {
      var index = teams[i].requestToJoin.indexOf(user._id);
      if (index !== -1) {
        teams[i].requestToJoin.splice(index, 1);
        teams[i].save();
      }
    }
  });

  // Clear any previous requests / asks to join from the user
  user.requestToJoin = [];
  user.askToJoin = [];
  user.save(function (err) {
    if (err)
      return false;
  });

  return true;
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

  Team.findById(id)
      .populate('members', 'username roles')
      .populate('requestToJoin', 'username roles')
      .populate('askToJoin', 'username')
      .populate('teamCaptain','username')
      .exec(function (err, team) {
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
