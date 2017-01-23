'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CtfEvent = mongoose.model('CtfEvent'),
  Challenge = mongoose.model('Challenge'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res) {
  var ctfEvent = new CtfEvent(req.body);
  ctfEvent.save(function(err) {
    if(err) {
      console.log(err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvent);
    }
  });
};

exports.read = function(req, res) {
  for (var index = 0; index < req.ctfEvent.challenges.length; ++index) {
    delete req.ctfEvent.challenges[index].answers
  }
  res.json(req.ctfEvent);
};

exports.update = function(req, res) {
  var ctfEvent = req.ctfEvent;
  ctfEvent.title = req.body.title;
  ctfEvent.start = req.body.start;
  ctfEvent.end = req.body.end;
  ctfEvent.teams = req.body.teams;
  ctfEvent.challenges = req.body.challenges;
  ctfEvent.users = req.body.users;
  ctfEvent.save(function(err) {
    if(err) {
      console.log(err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(ctfEvent.challenges)
      res.json(ctfEvent);
    }
  });
};

exports.delete = function(req, res) {
  var ctfEvent = req.ctfEvent;
  ctfEvent.remove(function(err) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvent);
    }
  });
};

exports.list = function(req, res) {
  CtfEvent.find().sort('-created').exec(function(err, ctfEvents) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvents);
    }
  });
};

exports.ctfEventByID = function(req, res, next, id) {
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'CtfEvent is invalid'
    });
  }
  CtfEvent.findById(id).exec(function(err, ctfEvent) {
    if(err) {
      return next(err);
    } else if(!ctfEvent) {
      return res.status(404).send({
        message: 'No ctfEvent with that identifier has been found'
      });
    }
    req.ctfEvent = ctfEvent;
    next();
  });
};
