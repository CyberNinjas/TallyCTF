'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  challengeSchema = require('../../../challenges/server/models/challenge.server.model.js');

var CtfEventSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Event Title cannot be blank'
  },
  description:{
    type: String,
    default: ''
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    default: Date('Y-m-d', Date.now + 86400)
  },
  registrationStart: {
    type: Date,
    default: Date.now
  },
  registrationEnd: {
    type: Date
  },
  settings: {
    userAuths: [{
      type: String,
      default: []
    }],
    maxTries: [{
      questionType: {
        type: String
      },
      tryCount: {
        type: Number
      },
      default: []
    }]
  },
  challenges: [challengeSchema],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }]
});

mongoose.model('CtfEvent', CtfEventSchema);
