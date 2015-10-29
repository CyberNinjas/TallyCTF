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
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date
  },
  challenges: {
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
  userAuths: {
    type: Array,
    default: []
  }
});

mongoose.model('CtfEvent', CtfEventSchema);
