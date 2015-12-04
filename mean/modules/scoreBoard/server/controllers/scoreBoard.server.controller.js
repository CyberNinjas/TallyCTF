'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ScoreBoard = mongoose.model('ScoreBoard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a score board entry
 */
//exports.create = function (req, res) {
//  var scoreBoard = new ScoreBoard(req.body);
//
//  scoreBoard.save(function (err) {
//    if (err) {
//      return res.status(400).send({
//        message: errorHandler.getErrorMessage(err)
//      });
//    } else {
//      res.json(scoreBoard);
//    }
//  });
//};

/**
 * Show the current score board entry
 */
exports.read = function (req, res) {
  res.json(req.scoreBoard);
};

/*
 * Append data to a score board
 */
exports.append = function (req, res) {
  var scoreBoard = req.scoreBoard;
  //FIXME: Change this when a validate function is made
  var challenge = JSON.parse(req.query.challenge);

  scoreBoard.solved.push(challenge._id);
  scoreBoard.score += challenge.points;

  scoreBoard.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(scoreBoard);
    }
  });
};

/**
 * Update a score board
 */
exports.update = function (req, res) {
  var scoreBoard = req.scoreBoard;

  scoreBoard.solved = req.body.solved;
  scoreBoard.score = req.body.score;

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
 * Delete a score board
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
  ScoreBoard.find().sort('-score')
  .populate('team', 'teamName')
  .populate('solved')
  .exec(function (err, scoreBoard) {
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
exports.scoreBoardByTeamID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'ScoreBoard is invalid'
    });
  }

  ScoreBoard.find({team: id})
  .populate('team', 'teamName')
  .populate('solved', 'challenge')
  .exec(function (err, scoreBoard) {
    if (err) {
      return next(err);
    } else if (!scoreBoard) {
      return res.status(404).send({
        message: 'No score board with that team identifier has been found'
      });
    }
    
    req.scoreBoard = (scoreBoard.length > 1 ? scoreBoard : scoreBoard[0]);

    next();
  });
};
