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

});

mongoose.model('Team', TeamSchema);
