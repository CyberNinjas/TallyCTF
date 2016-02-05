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
  id: {
    type: Number
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Event Title cannot be blank'
  },
  description: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  registrationStart: {
    type: Date,
    default: Date.now
  },
  registrationEnd: {
    type: Date
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date
  },
  settings: {
    type: Array,
    default: []
  },
  challenges: {
    type: Array,
    default: []
  },
  maxTries: {
    type: Array,
    default: []
  },
  teams: {
    type: Array,
    default: []
  },
  users: {
    type: Array,
    default: []
  },
  usersAuths: {
    type: Array,
    default: []
  }
});

var CurrentCtfEventSchema = new Schema({
  title: {
    type: String
  },
  start: {
    type: Date
  },
  end: {
    type: Date
  }
});

mongoose.model('CtfEvent', CtfEventSchema);
mongoose.model('CurrentCtfEvent', CurrentCtfEventSchema);
