'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ScoreBoard = mongoose.model('ScoreBoard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a scoreBoard
 */
exports.create = function (req, res) {
  var scoreBoard = new ScoreBoard(req.body);
  scoreBoard.user = req.user;

  scoreBoard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(scoreBoard);
    }
  });
};

/**
 * Show the current scoreBoard
 */
exports.read = function (req, res) {
  res.json(req.scoreBoard);
};

/**
 * Update a scoreBoard
 */
exports.update = function (req, res) {
  var scoreBoard = req.scoreBoard;

  scoreBoard.title = req.body.title;
  scoreBoard.content = req.body.content;

  scoreBoard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(scoreBoard);
    }
  });
};

/**
 * Delete an scoreBoard
 */
exports.delete = function (req, res) {
  var scoreBoard = req.scoreBoard;

  scoreBoard.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(scoreBoard);
    }
  });
};

/**
 * List of ScoreBoard
 */
exports.list = function (req, res) {
  ScoreBoard.find().sort('-created').populate('user', 'displayName').exec(function (err, scoreBoard) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(scoreBoard);
    }
  });
};

/**
 * ScoreBoard middleware
 */
exports.scoreBoardByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'ScoreBoard is invalid'
    });
  }

  ScoreBoard.findById(id).populate('user', 'displayName').exec(function (err, scoreBoard) {
    if (err) {
      return next(err);
    } else if (!scoreBoard) {
      return res.status(404).send({
        message: 'No scoreBoard with that identifier has been found'
      });
    }
    req.scoreBoard = scoreBoard;
    next();
  });
};
