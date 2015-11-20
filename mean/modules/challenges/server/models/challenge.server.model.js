'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Challenge Schema
 */
var ChallengeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: 'Challenge must have a name',
    trim: true
  },
  description: {
    type: String,
    required: 'Challenge must have a description',
    trim: true
  },
  category: {
    type: String,
    required: 'Challenge must belong to a category',
    trim: true
  },
  points: {
    type: Number,
    min: 0,
    required: 'Challenge points must be set'
  },
  solves: {
    type: Number,
    min: 0,
    default: 0
  },
  flag: {
    type: String,
    required: 'Challenge must have a flag set',
    trim: true
  }
});

mongoose.model('Challenge', ChallengeSchema);
