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
    unique: 'Team Name already exists',
    default: ''
  },
  teamCaptain: {
    type: Schema.Types.Object,
    unique: 'You cannot be captain of 2 teams',
    required: "You must have a team captain"
  },
  members: {
    type: Array,
    default: []
  },
  requestToJoin: {
    type:Array,
    default: []
  },
  askToJoin:{
    type: Array,
    default: []
  }
});

mongoose.model('Team', TeamSchema);
