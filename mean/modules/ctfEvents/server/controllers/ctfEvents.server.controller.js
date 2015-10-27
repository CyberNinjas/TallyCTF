'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CtfEvent = mongoose.model('CtfEvent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a ctfEvent
 */
exports.create = function (req, res) {
  var ctfEvent = new CtfEvent(req.body);
  ctfEvent.user = req.user;

  ctfEvent.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvent);
    }
  });
};

/**
 * Show the current ctfEvent
 */
exports.read = function (req, res) {
  res.json(req.ctfEvent);
};

/**
 * Update a ctfEvent
 */
exports.update = function (req, res) {
  var ctfEvent = req.ctfEvent;

  ctfEvent.title = req.body.title;
  ctfEvent.content = req.body.content;

  ctfEvent.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvent);
    }
  });
};

/**
 * Delete an ctfEvent
 */
exports.delete = function (req, res) {
  var ctfEvent = req.ctfEvent;

  ctfEvent.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvent);
    }
  });
};

/**
 * List of CtfEvents
 */
exports.list = function (req, res) {
  CtfEvent.find().sort('-created').populate('user', 'displayName').exec(function (err, ctfEvents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvents);
    }
  });
};

/**
 * CtfEvent middleware
 */
exports.ctfEventByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'CtfEvent is invalid'
    });
  }

  CtfEvent.findById(id).populate('user', 'displayName').exec(function (err, ctfEvent) {
    if (err) {
      return next(err);
    } else if (!ctfEvent) {
      return res.status(404).send({
        message: 'No ctfEvent with that identifier has been found'
      });
    }
    req.ctfEvent = ctfEvent;
    next();
  });
};
