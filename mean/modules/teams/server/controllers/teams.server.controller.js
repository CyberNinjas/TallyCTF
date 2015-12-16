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

/**
 * Create a team
 */
exports.create = function (req, res) {
  var team = new Team(req.body);
  var user = req.user;
  var scoreBoard = new ScoreBoard();
  team.scoreBoard = scoreBoard._id;
  scoreBoard.team = team._id;
  scoreBoard.teamName = team.teamName;

  // Clear any previous requests / asks to join from other teams
  var requests = Team.find({
    '_id': { $in: user.requestToJoin }
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
    '_id': { $in: user.askToJoin }
  }, function (err, teams) {
    if (err)
      return false;

    for (var i = 0; i < teams.length; ++i) {
      var index = teams[i].askToJoin.indexOf(user._id);
      if (index !== -1) {
        teams[i].askToJoin.splice(index, 1);
        // FIXME: Have a way to handle this failing
        teams[i].save();
      }
    }
  });

  user.requestToJoin = [];
  user.askToJoin = [];


  // Save the user / team
  team.save(function (err) {
    if (err) {
      scoreBoard.remove();
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('before scoreboard save');
      scoreBoard.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        else{
          console.log('after scoreboard save');
          // Update the user's data
          user.roles.push('teamCaptain');
          user.team = team._id;

          // Save the user
          user.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              req.login(user, function (err) {
                if (err) {
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

/**
 * Show the current team
 */
exports.read = function (req, res) {
  res.json(req.team);
};

/**
 * Update a team and its schema model
 */
exports.update = function (req, res) {
  var team = req.team;

  team.teamName = req.body.teamName;
  team.requestToJoin = req.body.requestToJoin;
  team.members = req.body.members;
  team.askToJoin = req.body.askToJoin;

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
 * Adds a user to a team or vice-versa
 */
exports.accept = function(req, res) {
  console.log('beginning');
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
  for (var i = 0; i < max; ++i) {
    if (i < reqLen && team.requestToJoin[i]._id.toString() === user._id.toString() && capt) {
      team.requestToJoin.splice(i, 1);
      team.members.push(user._id);
      break;
    }

    if (i < askLen && team.askToJoin[i]._id.toString() === user._id.toString()) {
      team.askToJoin.splice(i, 1);
      team.members.push(user._id);
      break;
    }

    // If it didn't find a user, fail
    if (i === max - 1)
      return res.status(400).send({
        message: 'Invalid User to add'
      });
  }
  // Try to add the user, error if alreay on a team
  if (!exports.addTeamToUser(user, team))
    return res.status(400).send({
      message: 'User is already a member of a team!'
    });

  // FIXME: Support reverting changes on the user when this fails
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
  for (var i = 0; i < max; ++i) {
    if (i < reqLen && team.requestToJoin[i]._id.toString() === user._id.toString() && capt) {
      team.requestToJoin.splice(i, 1);
      user.requestToJoin.splice(user.requestToJoin.indexOf(team._id), 1);
      break;
    }

    if (i < askLen && team.askToJoin[i]._id.toString() === user._id.toString()) {
      // Remove the user's request fom the user
      user.askToJoin.splice(user.askToJoin.indexOf(team._id), 1);
      team.askToJoin.splice(i, 1);
      break;
    }

    // If it didn't find a user, fail
    if (i === max - 1)
      return res.status(400).send({
        message: 'Invalid User to add'
      });
  }
//save user
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

/**
 * Allows a team captain to add users (ask to, at least)
 */
exports.askToJoin = function (req, res) {
  var team = req.team;
  var user = req.model;
  //update user and team askToJoin fields
  team.askToJoin.push(user._id);
  user.askToJoin.push(team._id);

  //Save team
  team.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
  //Save user
  user.save(function (err) {
    if (err)
      return res.status(400).send({
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
  team.requestToJoin.push(user._id);
  user.requestToJoin.push(team._id);

  //Save team
  team.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
  //Save user
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
      message: 'User is not in specified team!'
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
 * Update a user's roles / team when the
 */
exports.addTeamToUser = function (user, team) {
  // Fail if already a team member
  if (user.roles.indexOf('teamMember') !== -1)
    return false;

  // // Remove user from being a teamCaptain
  // var index = user.roles.indexOf('teamCaptain');
  // if (index !== -1)
  //   user.roles.splice(index, 1);

  // Add them as team member and update relevant info
  user.roles.push('teamMember');
  user.team = team._id;

  // Clear any previous requests / asks to join from other teams
  var requests = Team.find({
    '_id': { $in: user.requestToJoin }
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
    '_id': { $in: user.askToJoin }
  }, function (err, teams) {
    if (err)
      return false;

    for (var i = 0; i < teams.length; ++i) {
      var index = teams[i].askToJoin.indexOf(user._id);
      if (index !== -1) {
        teams[i].askToJoin.splice(index, 1);
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
/**
 * Removes Team
 */
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
 * Delete a team
 */
exports.delete = function (req, res) {
  var team = req.team;
  var user = req.user;

  // Make sure the person deleting this can delete this
  if ((user.roles.indexOf('admin') === -1) &&
    (!user || team.teamCaptain._id.toString() !== user._id.toString())) {

    return res.status(503).send({
      message: 'Not authorized to delete this team!'
    });
  }


  // Update all members / requestees / requesters of team deletion
  var members = User.find({
    '_id': { $in: team.members }
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

        var member = users[i].roles.indexOf('teamMember');
        if (member > -1)
          users[i].roles.splice(member, 1);

        // Remove the team from the user (MongoDB strips away all tags that are undefined)
        users[i].team = undefined;

        // FIXME: Have a way to handle this failing
        users[i].save();
      }
    }
  });
  var requests = User.find({
    '_id': { $in: team.requestToJoin }
  }, function (err, users) {
    if (err)
      return false;

    for (var i = 0; i < users.length; ++i) {
      var index = users[i].requestToJoin.indexOf(team._id);
      if (index !== -1) {
        users[i].requestToJoin.splice(index, 1);
        // FIXME: Have a way to handle this failing
        users[i].save();
      }
    }
  });
  var asks = User.find({
    '_id': { $in: team.askToJoin }
  }, function (err, users) {
    if (err)
      return false;

    for (var i = 0; i < users.length; ++i) {
      var index = users[i].askToJoin.indexOf(team._id);
      if (index !== -1) {
        users[i].askToJoin.splice(index, 1);
        // FIXME: Have a way to handle this failing
        users[i].save();
      }
    }
  });

  // Delete the scoreBoard associated with the team being deleted
  ScoreBoard.remove({ team: team._id }, function (err, scoreBoard) {
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
  Team.find().sort('-created').exec(function (err, teams) {
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

/**
 * Find Team names from requestToJoin field and askToJoin field
 */
//FIXME: the following two methods need to be re-architected.
exports.findRequests = function (req, res) {

  Team.find({
    '_id': { $in: req.user.requestToJoin }
  }).select('teamName')
    .exec(function (err, teams) {
      if(err){
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
    '_id': { $in: req.user.askToJoin }
  }).select('teamName')
      .exec(function (err, teams) {
        if(err){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(teams);
        }
      });
};

/**
 * Team middleware (without population of fields)
 */
exports.teamByIDRaw = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team is invalid'
    });
  }

  Team.findById(id).exec(function (err, team) {
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
