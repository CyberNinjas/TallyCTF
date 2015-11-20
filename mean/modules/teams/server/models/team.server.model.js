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
  scoreBoard: {
    type: Schema.Types.ObjectId,
    ref: 'ScoreBoard',
    required:'each team must have a scoreboard object ref',
    unique: 'each scoreboard can belong to one team'
  },
  teamCaptain: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: 'You cannot be captain of 2 teams',
    required: "You must have a team captain"
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  requestToJoin: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  askToJoin:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

mongoose.model('Team', TeamSchema);
