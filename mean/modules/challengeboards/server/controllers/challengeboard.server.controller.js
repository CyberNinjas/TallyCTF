'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Challengeboard = mongoose.model('Challengeboard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a challengeboards
 */
exports.create = function (req, res) {
  var challengeboard = new Challengeboard(req.body);
  challengeboard.user = req.user;

  challengeboard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challengeboard);
    }
  });
};

/**
 * Show the current challengeboards
 */
exports.read = function (req, res) {
  res.json(req.challengeboard);
};

/**
 * Update a challengeboards
 */
exports.update = function (req, res) {
  var challengeboard = req.challengeboard;

  challengeboard.title = req.body.title;
  challengeboard.content = req.body.content;

  challengeboard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challengeboard);
    }
  });
};

/**
 * Delete an challengeboards
 */
exports.delete = function (req, res) {
  var challengeboard = req.challengeboard;

  challengeboard.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challengeboard);
    }
  });
};

/**
 * List of Challengeboards
 */
exports.list = function (req, res) {
  Challengeboard.find().sort('-created').populate('user', 'displayName').exec(function (err, challengeboards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challengeboards);
    }
  });
};

/**
 * Challengeboard middleware
 */
exports.challengeboardByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Challengeboard is invalid'
    });
  }

  Challengeboard.findById(id).populate('user', 'displayName').exec(function (err, challengeboard) {
    if (err) {
      return next(err);
    } else if (!challengeboard) {
      return res.status(404).send({
        message: 'No challengeboards with that identifier has been found'
      });
    }
    req.challengeboard = challengeboard;
    next();
  });
};
