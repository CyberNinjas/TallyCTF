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
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    default: '',
    trim: true
  },
  points: {
    type: Number,
    min: 0,
    default: 0
  },
  solves: {
    type: Number,
    min: 0,
    default: 0
  },
  val: {
    type: String,
    default: '',
	trim: true
  }
});

mongoose.model('Challenge', ChallengeSchema);
