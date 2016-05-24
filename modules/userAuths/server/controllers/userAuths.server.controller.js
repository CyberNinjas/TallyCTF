'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserAuth = mongoose.model('UserAuth'),
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller.js')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * Create a article
 */
exports.create = function(req, res) {
  var userAuth = new UserAuth(req.body);
  userAuth.save(function(err) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userAuth);
    }
  });
};
/**
 * Show the current user auth
 */
exports.read = function(req, res) {
  res.json(req.userAuth);
};
/**
 * Update a user auth
 */
exports.update = function(req, res) {
  var userAuth = req.userAuth;
  userAuth.provider = req.body.provider;
  userAuth.authType = req.body.authType;
  userAuth.authURL = req.body.authURL;
  userAuth.userInfoURL = req.body.userInfoURL;
  userAuth.clientId = req.body.clientId;
  userAuth.clientSecret = req.body.clientSecret;
  userAuth.scope = req.body.scope;
  userAuth.providerImage = req.body.providerImage;
  userAuth.callbackURL = '/api/auth/userAuths/' + userAuth.provider.toLowerCase() + '/callback';
  userAuth.updated = Date.now();
  userAuth.save(function(err) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userAuth);
    }
  });
};
/**
 * Delete a user auth
 */
exports.delete = function(req, res) {
  var userAuth = req.userAuth;
  userAuth.remove(function(err) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userAuth);
    }
  });
};
/**
 * List of User Auths
 */
exports.list = function(req, res) {
  UserAuth.find().sort('-created').exec(function(err, userAuths) {
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userAuths);
    }
  });
};
/**
 * User Auth middleware
 */
exports.userAuthByID = function(req, res, next, id) {
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User Auth is invalid'
    });
  }
  UserAuth.findById(id).exec(function(err, userAuth) {
    if(err) {
      return next(err);
    } else if(!userAuth) {
      return res.status(404).send({
        message: 'No user auth with that identifier has been found'
      });
    }
    req.userAuth = userAuth;
    next();
  });
};
exports.userAuthByProvider = function(req, res, next, provider) {
  UserAuth.findOne({
    provider: provider
  }).exec(function(err, userAuth) {
    if(err) {
      return next(err);
    } else if(!userAuth) {
      return res.status(404).send({
        message: 'No user auth with that provider has been found'
      });
    }
    req.userAuth = userAuth;
    next();
  });
};
/**
 * User OAuth call
 */
exports.oauthCall = function(req, res, scope) {
  require(path.resolve('./modules/userAuths/server/config/strategy/' + req.userAuth.authType + '.strategy.config.js'))(req.userAuth);
  users.oauthCall(req.userAuth.authType, scope)(req, res);
};
/**
 * User OAuth callback
 */
exports.oauthCallback = function(req, res, next) {
  users.oauthCallback(req.userAuth.authType)(req, res, next);
};
