'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve(
    './modules/core/server/controllers/errors.server.controller'));

var addUserToTeam = function (user, team) {
  user.teams.push(team._id);
  if (user.roles.indexOf('teamCaptain') === -1) {
    user.roles.push('teamCaptain');
  }
  user.save(function (err) {
    if (err) {
      return res.status(422)
        .send({
          message: errorHandler.getErrorMessage(err)
        });
    }
  })
}

exports.create = function (req, res) {
  var team = new Team(req.body);
  team.save(function (err) {
    if (!err) {
      addUserToTeam(req.user, team);
      res.json(req.user);
    } else {
      return res.status(422)
        .send({
          message: errorHandler.getErrorMessage(err)
        });
    }
  })
}

exports.read = function (req, res) {
  Team.find({
    '_id': {
      $in: req.params.teamId
    }
  }).exec(function (err, teams) {
    if (err) {
      return res.status(422)
    .send({
      message: errorHandler.getErrorMessage(err)
    });
    } else {
      res.json(teams[0]);
    }
  });
};

exports.list = function (req, res) {
  Team.find()
    .sort('-created')
    .exec(function (err, teams) {
      if (err) {
        return res.status(422)
          .send({
            message: errorHandler.getErrorMessage(err)
          });
      } else {
        res.json(teams);
      }
    });
};

exports.update = function (req, res) {
  Team.update({
    '_id': req.body._id
  },{
    teamName : req.body.teamName,
    joinRequestsFromUsers : req.body.joinRequestsFromUsers,
    joinRequestsToUsers : req.body.joinRequestsToUsers,
    members : req.body.members
  },function (err, found, team) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(team);
    }
  });
};

exports.delete = function (req, res) {
  Team.findOne({
    '_id': req.params.teamId
  }).exec(function (err, team) {
    User.find({
      '_id': {
        $in: team.members
      }
    }, function (err, users) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        for (var index = 0, len = users.length; index < len; ++index) {
          adjustRoles(users[index], team)
        }
      }
    });

    User.find({
      '_id': {
        $in: team.joinRequestsToUsers
      }
    }, function (err, users) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        for (var index = 0, len = users.length; index < len; ++index) {
          removeUserRequests(users[index], team)
        }
      }
    });

    User.find({
      '_id': {
        $in: team.joinRequestsFromUsers
      }
    }, function (err, users) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        for (var index = 0, len = users.length; index < len; ++index) {
          removeCaptainRequests(users[index], team)
        }
      }
    });

    team.remove(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(team);
      }
    });
  })
};

var adjustRoles = function (user, team) {
  var index = user.teams.indexOf(team._id);
  user.teams.splice(index, 1);
  if (user.teams.length === 0) {
    user.roles.splice(user.roles.indexOf('teamMember'), 1);
  }
  Team.find({
    '_id': { $in: user.teams }
  }, function (err, teams) {
    var captain = false;
    for (var index = 0, len = teams.length; index < len; ++index) {
      if (user._id = teams[index].teamCaptain) {
        captain = true;
      }
    }
    if (!captain && user.roles.indexOf('teamCaptain') > 0) {
      user.roles.splice(user.roles.indexOf('teamCaptain'), 1);
    }
    user.save();
  });
}

var removeUserRequests = function (user, team) {
  var index = user.requestedToJoin.indexOf(team._id);
  if (index > -1) {
    user.requestedToJoin.splice(index, 1);
  }
  user.save();
}

var removeCaptainRequests = function (user, team) {
  var index = user.wasAskedToJoin.indexOf(team._id);
  if (index > -1) {
    user.wasAskedToJoin.splice(index, 1);
  }
  user.save();
}
