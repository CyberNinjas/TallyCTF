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
    required: 'You must have a team captain'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  joinRequestsFromUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  joinRequestsToUsers: [{
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
