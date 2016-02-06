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
    type: Date
  },
  registrationStart: {
    type: Date,
    default: Date.now
  },
  registrationEnd: {
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
