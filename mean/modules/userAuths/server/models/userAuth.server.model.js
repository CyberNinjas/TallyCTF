'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Auth Schema
 */
var userAuthSchema = new Schema({
  provider: {
    type: String,
    required: 'Provider is required'
  },
  authType: {
    type: String,
    required: 'An auth type is required'
  },
  authURL: {
    type: String,
    required: 'An authorization URL is required'
  },
  tokenURL: {
    type: String
  },
  userInfoURL: {
    type: String
  },
  clientId: {
    type: String,
    required: 'A client ID is required'
  },
  clientSecret: {
    type: String,
    required: 'A client secret is required'
  },
  scope: {
    type: String
  },
  providerImage: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  callbackURL: {
    type: String
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('UserAuth', userAuthSchema);
