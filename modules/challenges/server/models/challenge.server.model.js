'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ChallengeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: 'Challenge must have a creator specified'
  },
  lastModifiedBy: {
    type: String,
    required: 'Challenge must have last modified by user specified'
  },
  lastModifiedByIP: {
    type: String
  },
  lastModified: {
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
    required: 'Challenge must have a question',
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
  files: [{
    type: String,
    trim: true
  }],
  currentEvent: {
    type: String,
    trim: true
  },
  submissions: [{
    team: String,
    users: [{
      name: String,
      percentage: Number
    }],
    answer: String
  }],
  challengeType: {
    type: String,
    required: 'Each challenge must be of the list of available challenge formats.',
    enum: ['choice', 'text']
  },
  challengeFormat: {
    type: String,
    required: 'Each answer must have a format.',
    enum: ['true-false', 'select', 'multi-select', 'short-answer', 'long-answer']
  },
  numberOfSubmissionsAllowed:{
    type: Number
  },
  answers: [{
    value: {
      type: String,
      required: 'Challenge answer must have a value.',
      trim: true
    },
    isRegex: {
      type: Boolean,
      default: false
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }]
})

module.exports = ChallengeSchema
mongoose.model('Challenge', ChallengeSchema)
