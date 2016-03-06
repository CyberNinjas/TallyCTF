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
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: 'You cannot be captain of 2 teams',
    required: 'You must have a team captain'
  },
  scoreBoard: {
    type: Schema.Types.ObjectId,
    ref: 'ScoreBoard',
    required: 'each team needs a scoreboard'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  //list of Users who request to join the team
  requestToJoin: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  //list of Users who the teamCaptain asked to join the team
  askToJoin:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  logoImage: {
    type: String,
    default: 'modules/teams/client/img/logo/default.png'
  },
  //teamSoundTrack: {
  //  type: String,
  //  default: 'modules/teams/client/file/sound/default.mp4'
  //}
});

mongoose.model('Team', TeamSchema);
