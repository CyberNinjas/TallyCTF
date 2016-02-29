'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * CtfEvent Schema
 */
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
  challenges: [{
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    default: []
  }],
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team',
    default: []
  }],
  //scoreboard: {
  //  type: Scema.Types.ObjectId,
  //  ref: scoreBoard
  //},
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
});

mongoose.model('CtfEvent', CtfEventSchema);
