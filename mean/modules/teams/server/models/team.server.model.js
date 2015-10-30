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
  },

});

mongoose.model('Team', TeamSchema);
