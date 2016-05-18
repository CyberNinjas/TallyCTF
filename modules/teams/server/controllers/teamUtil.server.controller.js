'use strict';
var path = require('path'),
  mongoose = require('mongoose'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.list = function (req, res) {
  Team.find().sort('-created').exec(function (err, teams) {
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
 * Team middleware
 */
exports.teamByID = function (req, res, next, id) {
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team is invalid'
    });
  }
  Team
    .findById(id)
    .populate('members', 'username roles notifications')
    .populate('requestToJoin', 'username roles')
    .populate('askToJoin', 'username')
    .populate('teamCaptain', 'username notifications')
    .exec(function (err, team) {
      if(err) {
        return next(err);
      } else if(!team) {
        return res
          .status(404)
          .send({
            message: 'No team with that identifier has been found'
          });
      }
      req.team = team;
      next();
    });
};
/**
 * Team middleware (without population of fields)
 */
exports.teamByIDRaw = function (req, res, next, id) {
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Team is invalid'
    });
  }
  Team
    .findById(id)
    .exec(function (err, team) {
      if(err) {
        return next(err);
      } else if(!team) {
        return res.status(404).send({
          message: 'No team with that identifier has been found'
        });
      }
      req.team = team;
      next();
    });
};
