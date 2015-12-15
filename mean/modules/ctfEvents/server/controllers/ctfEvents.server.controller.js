'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CtfEvent = mongoose.model('CtfEvent'),
  CurrentCtfEvent = mongoose.model('CurrentCtfEvent'),
  Challenge = mongoose.model('Challenge'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a ctfEvent
 */
exports.create = function (req, res) {

  //create new Mongoose object out of request body
  var ctfEvent = new CtfEvent(req.body);

  //commit to db
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
 * Show a ctfEvent
 */
exports.read = function (req, res) {
  res.json(req.ctfEvent);
};

/**
 * Update a ctfEvent
 */
exports.update = function (req, res) {
  var ctfEvent = req.ctfEvent;

  //allow updating of Title, startTime and endTime
  ctfEvent.title = req.body.title;
  ctfEvent.start = req.body.start;
  ctfEvent.end = req.body.end;

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

/*
* Current Ctf Event Stuff
*/

/**
 * Create a currentCtfEvent
 */
exports.createCurrent = function (req, res) {
  //create new mongoose model from request body
  var currentCtfEvent = new CurrentCtfEvent(req.body);

  //commit to db
  currentCtfEvent.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(currentCtfEvent);
    }
  });
};

/*
 * Clear the working set
 */
exports.clear = function (req, res) {

  //remove all challenges
  Challenge.remove({}, function (err, thing) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });

  //remove all teams
  Team.remove({}, function (err, thing) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
//   TODO: Commented out until saving is implemented
  // User.remove({}, function (err, thing) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   }
  // });

  res.status(200).send();
};

//load an event into the current ctf event
exports.loadCurrent = function (req, res) {
  if (req.body.Challenges.length > 0)
  {
    //insert all challenge records from ctfEvent to currentCtfEvent
    Challenge.collection.insertMany(req.body.Challenges, function (err, r) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
  }

  if (req.body.Teams > 0)
  {
    //insert all team records from ctfEvent to currentCtfEvent
    Team.collection.insertMany(req.body.Teams, function (err, r) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
  }
//   TODO: Commented out until saving is implemented
  // User.collection.insertMany(req.body.Users, function (err, r) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   }
  // });

  return res.status(200).send();
};

/*
* Get the Current CTF event
*/
exports.readCurrent = function (req, res) {
  CurrentCtfEvent.find({}, 'title start end', function (err, currentEvent) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // FIXME: This is bad practice. Find a better way of addressing the first element
      res.json(currentEvent[0]);
    }
  });
};

/*
* Set the current CTF event
*/
exports.setCurrent = function (req, res) {
  CurrentCtfEvent.find({}, 'current', function (err, currentEvent) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // If there isn't a current event, 
      if (currentEvent.length < 1) {
        exports.createCurrent(req, res);
      } else {
        req.currentCtfEvent = currentEvent[0];
        exports.updateCurrent(req, res);
      }
    }
  });
};

/*
* Update the currentCtfEvent
*/
exports.updateCurrent = function (req, res) {
  var currentCtfEvent = req.currentCtfEvent;

  currentCtfEvent.title = req.body.title;
  currentCtfEvent.start = req.body.start;
  currentCtfEvent.end   = req.body.end;

  if (currentCtfEvent.current === 0)
    exports.deleteCurrent(req, res);

  currentCtfEvent.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(currentCtfEvent);
    }
  });
};

/*
 * Delete the current CTF event
 */
exports.deleteCurrent = function (req, res) {
  var currentEvent = req.currentCtfEvent;

  currentEvent.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(currentEvent);
    }
  });
};

/*
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
  CtfEvent.find().sort('-created').exec(function (err, ctfEvents) {
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

  CtfEvent.findById(id).exec(function (err, ctfEvent) {
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
