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
  var team = new Team(req.body);
  var user = req.user;

  // Make the requesting user the team captain
  user.roles.push('teamCaptain');

  var scoreBoard = new ScoreBoard();
  scoreBoard.team = team._id;

  // Save the user
  user.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
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
  console.log(req);
  var team = req.team;
  team.teamName = req.body.teamName;
  team.requestToJoin = req.body.requestToJoin;
  team.members = req.body.members;
  team.askToJoin = req.body.askToJoin;
  var capt = req.team.teamCaptain;
  capt.notifications+=1;
  capt.save(function (err) {
    if (err)
      console.log('error updating captain');
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

};

exports.accept = function(req, res) {
  var team = req.team;
  var user = req.model;
  console.log("NOTIFICATIONS");
  console.log(user.notifications);
  user.notifications+=1;

  for (var i = 0; i < team.requestToJoin.length; ++i) {
    if (team.requestToJoin[i]._id.toString() === user._id.toString()) {
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

  user.notifications+=1;

  // Remove user from list of requests
  for (var i = 0; i < team.requestToJoin.length; ++i) {
    if (team.requestToJoin[i]._id.toString()=== user._id.toString()) {
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
  var team = req.team;
  var user = req.model;

  team.askToJoin.push(user._id);
  user.askToJoin.push(team._id);

  console.log("**************************");
  console.log(team);
  console.log(user);
  console.log("**************************");

  team.save(function (err) {
    console.log("I'm inside the save function");
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
      console.log("asdfasdfasdf");
    }
  });
  
  user.save(function (err) {
    if (err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
  });

};

/**
 * Removes a user from the team
 */
exports.removeMember = function (req, res) {
  var team = req.team;
  var user = req.model;

  // Check to make sure the user being removed is part of the team
  if (user.team.toString() !== team._id.toString()) {
    return res.status(400).send({
      message: "User is not in specified team!"
    });
  }

  // Update the team
  for (var i = 0; i < team.members.length; ++i) {
    if (team.members[i]._id.toString() === user._id.toString()) {
      team.members.splice(i, 1);
      break;
    }
  }

  // Update the user roles & team
  var roleIndex = user.roles.indexOf('teamMember');
  if (roleIndex > -1)
    user.roles.splice(roleIndex, 1);

  user.team = undefined;

  // Save the team / user
  team.save(function (err) {
    if (err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
  });
  user.save(function (err) {
    if (err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
  });
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
        // FIXME: Have a way to handle this failing
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
        // FIXME: Have a way to handle this failing
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

  // Update all members / requestees / requesters of team deletion
  var members = User.find({
    "_id": { $in: team.members }
  }, function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < users.length; ++i)
      {
        // Update the User's roles (Remove teamMember / teamCaptain role)
        var captain = users[i].roles.indexOf('teamCaptain');
        if (captain > -1)
          users[i].roles.splice(captain, 1);

        var member  = users[i].roles.indexOf('teamMember');
        if (member > -1)
          users[i].roles.splice(member, 1);

        // Remove the team from the user (MongoDB strips away all tags that are undefined)
        users[i].team = undefined;

        // FIXME: Have a way to handle this failing
        users[i].save();
      }
    }
  });

  // Delete the scoreBoard associated with the team being deleted
  ScoreBoard.remove({team: team._id}, function (err, scoreBoard) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });

  // Delete the team
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
      .populate('members', 'username roles notifications')
      .populate('requestToJoin', 'username roles')
      .populate('askToJoin', 'username')
      .populate('teamCaptain','username notifications')
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
