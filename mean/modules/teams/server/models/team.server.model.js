'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
  teamName: {
    type: String,
    trim: false,
    default: '',
    required: 'Needs team name',
  },
  teamCaptain: {
    type: String,
    default: '',
    trim: true
    required: 'Needs team captain'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Team', TeamSchema);
