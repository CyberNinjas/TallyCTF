'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Challenge = mongoose.model('Challenge'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a challenges
 */
exports.create = function (req, res) {
  var challenge = new Challenge(req.body);
  challenge.user = req.user;

  challenge.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challenge);
    }
  });
};

/**
 * Show the current challenges
 */
exports.read = function (req, res) {
  res.json(req.challenge);
};

/**
 * Update a challenges
 */
exports.update = function (req, res) {
  var challenge = req.challenge;

  challenge.title = req.body.title;
  challenge.content = req.body.content;

  challenge.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challenge);
    }
  });
};

/**
 * Delete an challenges
 */
exports.delete = function (req, res) {
  var challenge = req.challenge;

  challenge.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challenge);
    }
  });
};

/**
 * List of Challenges
 */
exports.list = function (req, res) {
  Challenge.find().sort('-created').populate('user', 'displayName').exec(function (err, challenges) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challenges);
    }
  });
};

/**
 * Challenge middleware
 */
exports.challengeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Challenge is invalid'
    });
  }

  Challenge.findById(id).populate('user', 'displayName').exec(function (err, challenge) {
    if (err) {
      return next(err);
    } else if (!challenge) {
      return res.status(404).send({
        message: 'No challenges with that identifier has been found'
      });
    }
    req.challenge = challenge;
    next();
  });
};
