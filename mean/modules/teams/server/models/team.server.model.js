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
